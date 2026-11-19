$ErrorActionPreference = 'Continue'
$Root = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\')
Set-Location -LiteralPath $Root
$Marker = Join-Path $Root '.firework-port'
# Prefer 3000 so Moyin (墨引, prefers 3001) can coexist.
$PreferredPort = 3000
$PortStart = 3000
$PortEnd = 3020
$RootKey = $Root.ToLowerInvariant()

function Test-IsFireworkCommand([string]$CommandLine) {
  if (-not $CommandLine) { return $false }
  $cmd = $CommandLine.ToLowerInvariant().Replace('/', '\')
  if (-not $cmd.Contains($RootKey)) { return $false }
  return $cmd.Contains('server.js')
}

function Get-FireworkNodeProcesses {
  return @(
    Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
      Where-Object { Test-IsFireworkCommand ([string]$_.CommandLine) }
  )
}

function Get-ListeningPortSet {
  $set = New-Object 'System.Collections.Generic.HashSet[int]'
  foreach ($line in (netstat -ano)) {
    if ($line -notmatch 'LISTENING') { continue }
    if ($line -match ':(\d+)\s') { [void]$set.Add([int]$Matches[1]) }
  }
  return $set
}

function Test-PortListening([int]$Port) {
  return (Get-ListeningPortSet).Contains($Port)
}

# Confirm this port is Firework, not Moyin/SnackOps on a shared port.
function Test-IsFireworkHttp([int]$Port) {
  try {
    $req = [System.Net.HttpWebRequest]::Create("http://127.0.0.1:$Port/")
    $req.Proxy = $null
    $req.Timeout = 1500
    $req.ReadWriteTimeout = 1500
    $req.Method = 'GET'
    $resp = $req.GetResponse()
    $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $html = $reader.ReadToEnd()
    $reader.Close()
    $resp.Close()
    if ($html -match 'playRiverIntoHeart|skytrail|shape-button|version-btn|绽夜') { return $true }
    return $false
  } catch {
    return $false
  }
}

function Find-RunningFireworkPort {
  Write-Host '  [1/2] Checking whether Firework is already running...'

  $procs = Get-FireworkNodeProcesses
  if ($procs.Count -eq 0) {
    if (Test-Path -LiteralPath $Marker) {
      Remove-Item -LiteralPath $Marker -Force -ErrorAction SilentlyContinue
    }
    Write-Host '  Not running.'
    return $null
  }

  $candidates = New-Object 'System.Collections.Generic.HashSet[int]'
  if (Test-Path -LiteralPath $Marker) {
    $raw = (Get-Content -LiteralPath $Marker -ErrorAction SilentlyContinue | Select-Object -First 1)
    $marked = 0
    if ([int]::TryParse("$raw", [ref]$marked)) { [void]$candidates.Add($marked) }
  }

  foreach ($proc in $procs) {
    foreach ($line in (netstat -ano)) {
      if ($line -notmatch 'LISTENING') { continue }
      if ($line -notmatch ("\s$([int]$proc.ProcessId)\s*$")) { continue }
      if ($line -match ':(\d+)\s') { [void]$candidates.Add([int]$Matches[1]) }
    }
  }

  foreach ($port in $candidates) {
    if (-not (Test-PortListening $port)) { continue }
    if (Test-IsFireworkHttp $port) {
      Write-Host "  Found Firework on port $port"
      return $port
    }
    Write-Host "  Port $port is not Firework — ignored."
  }

  Write-Host '  Firework process found, but page not ready / not Firework.'
  return $null
}

function Find-FreePort {
  Write-Host "  [2/2] Looking for a free port (prefer $PreferredPort, range $PortStart-$PortEnd)..."
  $listening = Get-ListeningPortSet

  $order = New-Object System.Collections.Generic.List[int]
  if (-not $order.Contains($PreferredPort)) { $order.Add($PreferredPort) }
  for ($port = $PortStart; $port -le $PortEnd; $port++) {
    if (-not $order.Contains($port)) { $order.Add($port) }
  }

  foreach ($port in $order) {
    if (-not $listening.Contains($port)) {
      Write-Host "  Using free port $port"
      return $port
    }
    Write-Host "  Port $port busy (another app)"
  }
  return $null
}

function Open-Url([string]$Url) {
  try { Start-Process $Url; return $true } catch {}
  try { cmd.exe /c "start `"`" `"$Url`""; return $true } catch {}
  return $false
}

Write-Host ''
Write-Host '  Firework (Zhanye) one-click start'
Write-Host "  Preferred port: $PreferredPort (Moyin usually takes 3001)"
Write-Host ''

$existing = Find-RunningFireworkPort
if ($null -ne $existing) {
  $url = "http://localhost:$existing/"
  Write-Host "  Already running. Opening: $url"
  Set-Content -LiteralPath $Marker -Value "$existing" -Encoding ascii
  Open-Url $url | Out-Null
  Start-Sleep -Seconds 1
  exit 0
}

$port = Find-FreePort
if ($null -eq $port) {
  Write-Host "  Ports $PortStart-$PortEnd are all busy."
  Write-Host '  Tip: Firework prefers 3000; Moyin prefers 3001. Close one if needed.'
  Read-Host 'Press Enter to exit'
  exit 1
}

$url = "http://localhost:$port/"
Set-Content -LiteralPath $Marker -Value "$port" -Encoding ascii
Write-Host "  Starting Firework on: $url"
Write-Host '  Browser will open when ready.'
Write-Host '  Stop: Ctrl+C'
Write-Host ''

$opener = Join-Path $Root 'open-when-ready.ps1'
Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-File', $opener,
  '-Port', "$port",
  '-OpenHost', 'localhost'
) | Out-Null

$env:PORT = "$port"
& node (Join-Path $Root 'server.js')
$code = $LASTEXITCODE

Write-Host ''
Write-Host '  Server stopped.'
if ($code -ne 0) {
  Read-Host 'Press Enter to exit'
  exit $code
}
exit 0

param(
  [Parameter(Mandatory = $true)][int]$Port,
  [string]$OpenHost = 'localhost',
  [int]$Tries = 40
)

$ErrorActionPreference = 'Continue'
$url = "http://${OpenHost}:${Port}/"

function Open-Url([string]$Target) {
  try { Start-Process $Target; return } catch {}
  try { cmd.exe /c "start `"`" `"$Target`"" } catch {}
}

for ($i = 0; $i -lt $Tries; $i++) {
  Start-Sleep -Milliseconds 250
  try {
    $req = [System.Net.HttpWebRequest]::Create($url)
    $req.Proxy = $null
    $req.Timeout = 1500
    $req.Method = 'GET'
    $resp = $req.GetResponse()
    $resp.Close()
    Open-Url $url
    exit 0
  } catch {}

  # Port listening is enough for this plain Node server.
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $async = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
    $ok = $async.AsyncWaitHandle.WaitOne(200)
    if ($ok -and $client.Connected) {
      $client.Close()
      Open-Url $url
      exit 0
    }
    $client.Close()
  } catch {}
}

Open-Url $url
exit 0

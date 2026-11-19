/* =========================================================
   烟花预设配方库（V8 AI 创作用）
   - 每个配方都是人工调校过的高质量烟花，作为 AI 工具编排的检索基础。
   - AI 先用 use_preset 选择最接近用户描述的预设，再微调参数。
   - 字段与 index.html 的自定义轨迹配方完全一致，播放引擎直接可执行。
   ========================================================= */
'use strict';

const PRESETS = [
  {
    id: 'star-river', name: '星河', tags: ['星河', '银河', '星云', '流动', '缓缓', '蓝色', '蓝紫', '梦幻', '浪漫'],
    style: { name: '星河', color: '#8fc6ff', scale: 1.4, speed: .8, silhouette: 'none' },
    timing: { hold: 20, dissolve: 130 },
    groups: [
      { pattern: 'comet-rain', particles: 170, spread: 1.4, curve: .01, gravity: .045, drag: .991, lifetime: 1.6, direction: 0, arc: 360, delay: 0, role: 'main', color: '#8fc6ff', silhouette: 'none' },
      { pattern: 'comet-rain', particles: 90, spread: 1.9, curve: -.015, gravity: .06, drag: .988, lifetime: 1.7, direction: 0, arc: 360, delay: 220, role: 'trail', color: '#c9e4ff', silhouette: 'none' },
      { pattern: 'radial', particles: 60, spread: .6, curve: 0, gravity: .02, drag: .984, lifetime: 1.2, direction: 0, arc: 360, delay: 80, role: 'accent', color: '#ffffff', silhouette: 'none' }
    ]
  },
  {
    id: 'golden-falls', name: '金色瀑布', tags: ['瀑布', '流水', '金色', '垂落', '洒落', '辉煌', '倾泻'],
    style: { name: '金色瀑布', color: '#ffcf6f', scale: 1.6, speed: .9, silhouette: 'none' },
    timing: { hold: 10, dissolve: 150 },
    groups: [
      { pattern: 'comet-rain', particles: 180, spread: 1.1, curve: 0, gravity: .075, drag: .994, lifetime: 1.7, direction: 90, arc: 360, delay: 0, role: 'main', color: '#ffcf6f', silhouette: 'none' },
      { pattern: 'comet-rain', particles: 110, spread: 1.5, curve: 0, gravity: .09, drag: .992, lifetime: 1.6, direction: 90, arc: 360, delay: 260, role: 'trail', color: '#fff0c4', silhouette: 'none' }
    ]
  },
  {
    id: 'peony', name: '牡丹', tags: ['牡丹', '花朵', '盛开', '饱满', '大朵', '粉色', '华丽', '绽放'],
    style: { name: '牡丹', color: '#ff7d9c', scale: 1.8, speed: 1.05, silhouette: 'none' },
    timing: { hold: 22, dissolve: 120 },
    groups: [
      { pattern: 'radial', particles: 200, spread: 2.4, curve: .012, gravity: .028, drag: .982, lifetime: 1.05, direction: 0, arc: 360, delay: 0, role: 'main', color: '#ff7d9c', silhouette: 'none' },
      { pattern: 'radial', particles: 90, spread: 1.1, curve: 0, gravity: .02, drag: .983, lifetime: .9, direction: 0, arc: 360, delay: 60, role: 'accent', color: '#ffd9a8', silhouette: 'none' },
      { pattern: 'radial', particles: 36, spread: .45, curve: 0, gravity: .012, drag: .98, lifetime: .7, direction: 0, arc: 360, delay: 0, role: 'accent', color: '#fff5e0', silhouette: 'none' }
    ]
  },
  {
    id: 'nebula', name: '蓝紫星云', tags: ['星云', '蓝紫', '双色', '旋转', '缓慢', '神秘', '星系'],
    style: { name: '蓝紫星云', color: '#7f9dff', scale: 1.5, speed: .75, silhouette: 'none' },
    timing: { hold: 26, dissolve: 150 },
    groups: [
      { pattern: 'spiral', particles: 150, spread: 1.7, curve: .07, gravity: .012, drag: .99, lifetime: 1.6, direction: 0, arc: 360, delay: 0, role: 'main', color: '#7f9dff', silhouette: 'none' },
      { pattern: 'spiral', particles: 130, spread: 2.2, curve: -.07, gravity: .012, drag: .99, lifetime: 1.6, direction: 0, arc: 360, delay: 150, role: 'main', color: '#b26bff', silhouette: 'none' },
      { pattern: 'radial', particles: 50, spread: .55, curve: 0, gravity: .008, drag: .988, lifetime: 1.3, direction: 0, arc: 360, delay: 60, role: 'accent', color: '#e6dcff', silhouette: 'none' }
    ]
  },
  {
    id: 'meteor-shower', name: '流星雨', tags: ['流星雨', '流星', '划过', '群星', '阵雨', '落下', '愿望'],
    style: { name: '流星雨', color: '#ffe9b8', scale: 1.5, speed: 1.2, silhouette: 'none' },
    timing: { hold: 8, dissolve: 110 },
    groups: [
      { pattern: 'comet-rain', particles: 120, spread: 1.9, curve: 0, gravity: .06, drag: .989, lifetime: 1.2, direction: 90, arc: 360, delay: 0, role: 'main', color: '#ffe9b8', silhouette: 'none' },
      { pattern: 'comet-rain', particles: 100, spread: 1.6, curve: 0, gravity: .07, drag: .987, lifetime: 1.2, direction: 90, arc: 360, delay: 300, role: 'main', color: '#fff7df', silhouette: 'none' },
      { pattern: 'comet-rain', particles: 90, spread: 2.1, curve: 0, gravity: .08, drag: .986, lifetime: 1.3, direction: 90, arc: 360, delay: 650, role: 'trail', color: '#ffd27a', silhouette: 'none' }
    ]
  },
  {
    id: 'willow-breeze', name: '柳影垂风', tags: ['柳树', '柳枝', '垂柳', '下垂', '柔美', '绿色', '金色', '垂落'],
    style: { name: '柳影垂风', color: '#cfe89a', scale: 1.7, speed: .85, silhouette: 'willow' },
    timing: { hold: 24, dissolve: 160 },
    groups: [
      { pattern: 'radial', particles: 140, spread: 1.5, curve: .008, gravity: .055, drag: .99, lifetime: 1.6, direction: 0, arc: 360, delay: 0, role: 'main', color: '#cfe89a', silhouette: 'willow' },
      { pattern: 'comet-rain', particles: 80, spread: 1.8, curve: 0, gravity: .07, drag: .99, lifetime: 1.7, direction: 90, arc: 360, delay: 200, role: 'trail', color: '#eaf5c8', silhouette: 'none' }
    ]
  },
  {
    id: 'ring-flare', name: '环抱星火', tags: ['环', '圆环', '光环', '环绕', '规整', '简约', '圆圈'],
    style: { name: '环抱星火', color: '#8de6ff', scale: 1.5, speed: 1, silhouette: 'double' },
    timing: { hold: 28, dissolve: 120 },
    groups: [
      { pattern: 'radial', particles: 130, spread: .55, curve: 0, gravity: .014, drag: .986, lifetime: 1.1, direction: 0, arc: 360, delay: 0, role: 'main', color: '#8de6ff', silhouette: 'double' },
      { pattern: 'radial', particles: 60, spread: 1.9, curve: 0, gravity: .02, drag: .983, lifetime: .9, direction: 0, arc: 360, delay: 120, role: 'accent', color: '#ffffff', silhouette: 'none' }
    ]
  },
  {
    id: 'heart-glow', name: '心语心愿', tags: ['爱心', '心形', '表白', '浪漫', '红色', '粉色', '告白', '情人节'],
    style: { name: '心语心愿', color: '#ff6f9c', scale: 1.5, speed: 1, silhouette: 'heart' },
    timing: { hold: 34, dissolve: 130 },
    groups: [
      { pattern: 'radial', particles: 150, spread: .9, curve: 0, gravity: .014, drag: .987, lifetime: 1.15, direction: 0, arc: 360, delay: 0, role: 'main', color: '#ff6f9c', silhouette: 'heart' },
      { pattern: 'radial', particles: 50, spread: .4, curve: 0, gravity: .01, drag: .985, lifetime: .9, direction: 0, arc: 360, delay: 80, role: 'accent', color: '#ffd7e6', silhouette: 'none' }
    ]
  },
  {
    id: 'sakura-drift', name: '樱花吹雪', tags: ['樱花', '花瓣', '粉色', '浪漫', '飘落', '吹雪', '春天', '温柔'],
    style: { name: '樱花吹雪', color: '#ff9fc4', scale: 1.4, speed: .85, silhouette: 'flower' },
    timing: { hold: 22, dissolve: 140 },
    groups: [
      { pattern: 'radial', particles: 140, spread: 1.6, curve: .02, gravity: .03, drag: .988, lifetime: 1.4, direction: 0, arc: 360, delay: 0, role: 'main', color: '#ff9fc4', silhouette: 'flower' },
      { pattern: 'wave', particles: 90, spread: 1.9, curve: .015, gravity: .045, drag: .99, lifetime: 1.5, direction: 0, arc: 360, delay: 180, role: 'trail', color: '#ffd8e8', silhouette: 'none' },
      { pattern: 'radial', particles: 40, spread: .8, curve: 0, gravity: .02, drag: .988, lifetime: 1.2, direction: 0, arc: 360, delay: 60, role: 'accent', color: '#fff0f5', silhouette: 'none' }
    ]
  },
  {
    id: 'aurora-curtain', name: '极光垂帘', tags: ['极光', '光帘', '绿紫', '夜幕', '梦幻', '流动', '北极光', '光带'],
    style: { name: '极光垂帘', color: '#7ef0c8', scale: 1.6, speed: .7, silhouette: 'none' },
    timing: { hold: 30, dissolve: 170 },
    groups: [
      { pattern: 'fan', particles: 140, spread: 1.2, curve: .01, gravity: .02, drag: .993, lifetime: 1.7, direction: 270, arc: 60, delay: 0, role: 'main', color: '#7ef0c8', silhouette: 'none' },
      { pattern: 'fan', particles: 140, spread: 1.6, curve: -.012, gravity: .025, drag: .993, lifetime: 1.7, direction: 270, arc: 80, delay: 120, role: 'main', color: '#a97eff', silhouette: 'none' },
      { pattern: 'radial', particles: 44, spread: .5, curve: 0, gravity: .012, drag: .99, lifetime: 1.4, direction: 0, arc: 360, delay: 40, role: 'accent', color: '#dcfff2', silhouette: 'none' }
    ]
  },
  {
    id: 'tricolor-salute', name: '三色礼花', tags: ['礼花', '庆祝', '多彩', '三色', '热闹', '节日', '连续', '新年'],
    style: { name: '三色礼花', color: '#ffd84d', scale: 1.6, speed: 1.1, silhouette: 'none' },
    timing: { hold: 18, dissolve: 120 },
    groups: [
      { pattern: 'radial', particles: 120, spread: 2, curve: .01, gravity: .03, drag: .984, lifetime: 1, direction: 0, arc: 360, delay: 0, role: 'main', color: '#ffd84d', silhouette: 'none' },
      { pattern: 'radial', particles: 120, spread: 2.1, curve: -.01, gravity: .035, drag: .984, lifetime: 1, direction: 0, arc: 360, delay: 240, role: 'main', color: '#4da3ff', silhouette: 'none' },
      { pattern: 'radial', particles: 120, spread: 2.2, curve: .008, gravity: .032, drag: .984, lifetime: 1, direction: 0, arc: 360, delay: 480, role: 'main', color: '#ff6fae', silhouette: 'none' }
    ]
  },
  {
    id: 'spiral-vortex', name: '螺旋星涡', tags: ['螺旋', '漩涡', '旋转', '星涡', '缠绕', '金色', '紫色', '涡旋'],
    style: { name: '螺旋星涡', color: '#c89bff', scale: 1.5, speed: .9, silhouette: 'none' },
    timing: { hold: 24, dissolve: 140 },
    groups: [
      { pattern: 'spiral', particles: 140, spread: 1.9, curve: .085, gravity: .015, drag: .99, lifetime: 1.5, direction: 0, arc: 360, delay: 0, role: 'main', color: '#c89bff', silhouette: 'none' },
      { pattern: 'spiral', particles: 110, spread: 1.4, curve: -.08, gravity: .02, drag: .99, lifetime: 1.4, direction: 0, arc: 360, delay: 160, role: 'accent', color: '#ffd27a', silhouette: 'none' },
      { pattern: 'orbit', particles: 70, spread: 1.1, curve: .07, gravity: .01, drag: .992, lifetime: 1.5, direction: 0, arc: 360, delay: 300, role: 'trail', color: '#fff1c7', silhouette: 'none' }
    ]
  },
  {
    id: 'heart-river', name: '星河化心', tags: ['星河', '爱心', '汇聚', '最后形成', '先', '然后', '变成', '化作', '蓝紫', '浪漫', '告白', '两阶段', '变化'],
    style: { name: '星河化心', color: '#8fb2ff', scale: 1.5, speed: .8, silhouette: 'none' },
    timing: { hold: 32, dissolve: 150 },
    groups: [
      { pattern: 'comet-rain', particles: 150, spread: 1.4, curve: .01, gravity: .045, drag: .991, lifetime: 1.6, direction: 0, arc: 360, delay: 0, role: 'main', color: '#8fb2ff', silhouette: 'none' },
      { pattern: 'comet-rain', particles: 90, spread: 1.9, curve: -.015, gravity: .055, drag: .989, lifetime: 1.6, direction: 0, arc: 360, delay: 250, role: 'trail', color: '#cfe4ff', silhouette: 'none' },
      { pattern: 'radial', particles: 50, spread: .6, curve: 0, gravity: .02, drag: .986, lifetime: 1.2, direction: 0, arc: 360, delay: 120, role: 'accent', color: '#ffffff', silhouette: 'none' },
      { pattern: 'radial', particles: 24, spread: .35, curve: 0, gravity: .008, drag: .982, lifetime: .9, direction: 0, arc: 360, delay: 1100, role: 'main', color: '#ff8fb0', silhouette: 'heart' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = { PRESETS };
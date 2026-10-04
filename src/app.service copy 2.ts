import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return String.raw`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Apearix Universe</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <style>
    :root {
      --bg: #03040a;
      --panel: rgba(7, 9, 18, .72);
      --panel-strong: rgba(8, 10, 20, .9);
      --line: rgba(255,255,255,.10);
      --line-purple: rgba(139,92,246,.34);
      --text: #f8fafc;
      --muted: #94a3b8;
      --purple: #8b5cf6;
      --purple-2: #c084fc;
      --cyan: #38bdf8;
      --green: #34d399;
      --ease: cubic-bezier(.16,1,.3,1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      touch-action: none;
    }

    body { cursor: none; }

    #webgl-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 1;
    }

    .screen-vignette {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 46%, transparent 0 35%, rgba(0,0,0,.20) 62%, rgba(0,0,0,.82) 100%),
        linear-gradient(180deg, rgba(2,3,8,.22), transparent 24%, transparent 76%, rgba(2,3,8,.35));
    }

    .noise {
      position: fixed;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      opacity: .035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
    }

    #cursor {
      position: fixed;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      z-index: 100;
      pointer-events: none;
      border: 1px solid rgba(255,255,255,.8);
      border-radius: 50%;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 16px rgba(139,92,246,.8);
      transition: width .2s var(--ease), height .2s var(--ease), border-color .2s;
    }

    #cursor::before,
    #cursor::after {
      content: '';
      position: absolute;
      background: rgba(255,255,255,.75);
    }

    #cursor::before { width: 4px; height: 1px; left: 7px; top: 8px; }
    #cursor::after { width: 1px; height: 4px; left: 8px; top: 7px; }

    #cursor.hover {
      width: 32px;
      height: 32px;
      border-color: var(--green);
      box-shadow: 0 0 24px rgba(52,211,153,.55), inset 0 0 10px rgba(52,211,153,.2);
    }

    .topbar {
      position: fixed;
      top: 18px;
      left: 18px;
      right: 18px;
      z-index: 20;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      pointer-events: none;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 13px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: rgba(5,7,14,.55);
      backdrop-filter: blur(18px);
      box-shadow: 0 12px 50px rgba(0,0,0,.28);
    }

    .brand-mark {
      width: 27px;
      height: 27px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: linear-gradient(135deg,#7c3aed,#a78bfa);
      box-shadow: 0 0 24px rgba(139,92,246,.5);
      font-weight: 900;
      font-size: 12px;
    }

    .brand strong { font-size: 12px; letter-spacing: .14em; }
    .brand small {
      display: block;
      color: var(--muted);
      font: 10px 'JetBrains Mono', monospace;
      margin-top: 2px;
      letter-spacing: .12em;
    }

    .telemetry {
      display: flex;
      gap: 9px;
    }

    .telemetry-item {
      padding: 9px 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(5,7,14,.5);
      backdrop-filter: blur(18px);
      font: 10px 'JetBrains Mono', monospace;
      color: var(--muted);
    }

    .telemetry-item b { color: #e2e8f0; font-weight: 600; }
    .online { color: var(--green) !important; }

    .search-wrap {
      position: fixed;
      top: 82px;
      left: 18px;
      z-index: 25;
      width: 285px;
    }

    .search {
      height: 43px;
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 0 13px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: var(--panel);
      backdrop-filter: blur(20px);
      box-shadow: 0 18px 60px rgba(0,0,0,.28);
    }

    .search span { color: #a78bfa; font-size: 17px; }
    .search input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: white;
      font: 11px 'JetBrains Mono', monospace;
    }
    .search input::placeholder { color: #64748b; }

    #search-results {
      display: none;
      margin-top: 6px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: var(--panel-strong);
      backdrop-filter: blur(24px);
    }

    .search-result {
      padding: 11px 13px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      cursor: pointer;
    }
    .search-result:last-child { border-bottom: 0; }
    .search-result:hover { background: rgba(139,92,246,.12); }
    .search-result b { display: block; font-size: 12px; }
    .search-result small { color: var(--muted); font: 9px 'JetBrains Mono', monospace; }

    .nav-panel {
      position: fixed;
      left: 18px;
      top: 136px;
      z-index: 20;
      width: 285px;
      max-height: calc(100vh - 230px);
      overflow: auto;
      padding: 14px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: var(--panel);
      backdrop-filter: blur(22px);
      box-shadow: 0 22px 80px rgba(0,0,0,.34);
      transition: transform .35s var(--ease), opacity .35s var(--ease);
    }

    .nav-panel.hidden { transform: translateX(-110%); opacity: 0; pointer-events: none; }

    .panel-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #64748b;
      font: 9px 'JetBrains Mono', monospace;
      letter-spacing: .18em;
      text-transform: uppercase;
    }

    .galaxy-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      margin: 2px 0;
      border: 0;
      border-radius: 9px;
      color: #cbd5e1;
      background: transparent;
      text-align: left;
      font: 10px 'JetBrains Mono', monospace;
      cursor: pointer;
      transition: .2s ease;
    }

    .galaxy-item:hover,
    .galaxy-item.active {
      color: white;
      background: rgba(139,92,246,.13);
    }

    .galaxy-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8b5cf6;
      box-shadow: 0 0 10px #8b5cf6;
    }

    .hero {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 12;
      transform: translate(-50%,-50%);
      text-align: center;
      pointer-events: none;
      transition: opacity .45s var(--ease), transform .6s var(--ease);
    }

    .hero.hide { opacity: 0; transform: translate(-50%,-44%) scale(.97); }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border: 1px solid rgba(139,92,246,.28);
      border-radius: 999px;
      background: rgba(109,40,217,.08);
      color: #c4b5fd;
      font: 9px 'JetBrains Mono', monospace;
      letter-spacing: .17em;
      text-transform: uppercase;
      box-shadow: 0 0 40px rgba(109,40,217,.15);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 12px var(--green);
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse { 50% { transform: scale(.5); opacity: .4; } }

    .hero h1 {
      margin-top: 17px;
      font-size: clamp(4rem, 8vw, 7.8rem);
      line-height: .9;
      letter-spacing: -.07em;
      font-weight: 900;
      text-shadow: 0 22px 60px rgba(0,0,0,.85);
    }

    .hero h1 span {
      background: linear-gradient(120deg,#fff 0%,#c4b5fd 35%,#8b5cf6 72%,#38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 42px rgba(139,92,246,.45));
    }

    .hero p {
      margin-top: 18px;
      color: #94a3b8;
      font: 10px 'JetBrains Mono', monospace;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .object-panel {
      position: fixed;
      right: 18px;
      top: 50%;
      z-index: 22;
      width: 285px;
      padding: 16px;
      transform: translateY(-50%) translateX(115%);
      opacity: 0;
      border: 1px solid var(--line-purple);
      border-radius: 18px;
      background: var(--panel);
      backdrop-filter: blur(24px);
      box-shadow: 0 25px 100px rgba(0,0,0,.42);
      transition: .5s var(--ease);
    }

    .object-panel.visible {
      transform: translateY(-50%) translateX(0);
      opacity: 1;
    }

    .object-type {
      color: #a78bfa;
      font: 9px 'JetBrains Mono', monospace;
      letter-spacing: .18em;
      text-transform: uppercase;
    }

    .object-name {
      margin-top: 5px;
      font-size: 25px;
      font-weight: 800;
      letter-spacing: -.04em;
    }

    .object-desc {
      margin-top: 7px;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.6;
    }

    .object-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 14px;
    }

    .stat {
      padding: 9px;
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 10px;
      background: rgba(255,255,255,.025);
    }

    .stat small {
      display: block;
      color: #64748b;
      font: 8px 'JetBrains Mono', monospace;
      text-transform: uppercase;
    }

    .stat b { display: block; margin-top: 3px; font: 10px 'JetBrains Mono', monospace; color: #e2e8f0; }

    .follow-btn {
      width: 100%;
      height: 36px;
      margin-top: 10px;
      border: 1px solid rgba(139,92,246,.38);
      border-radius: 10px;
      color: white;
      background: rgba(139,92,246,.13);
      font: 10px 'JetBrains Mono', monospace;
      cursor: pointer;
    }

    .follow-btn:hover { background: rgba(139,92,246,.24); }

    .bottom {
      position: fixed;
      left: 18px;
      right: 18px;
      bottom: 17px;
      z-index: 20;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      pointer-events: none;
    }

    .help {
      color: #64748b;
      font: 9px 'JetBrains Mono', monospace;
      line-height: 1.8;
    }
    .help b { color: #a5b4fc; }

    .controls {
      display: flex;
      gap: 6px;
      pointer-events: auto;
    }

    .control {
      height: 33px;
      padding: 0 11px;
      border: 1px solid var(--line);
      border-radius: 9px;
      color: #cbd5e1;
      background: rgba(5,7,14,.58);
      backdrop-filter: blur(15px);
      font: 9px 'JetBrains Mono', monospace;
      cursor: pointer;
    }

    .control:hover { border-color: rgba(139,92,246,.4); color: white; }

    #warp {
      position: fixed;
      inset: 0;
      z-index: 50;
      pointer-events: none;
      opacity: 0;
      background:
        radial-gradient(circle at center, transparent 0 12%, rgba(90,40,180,.08) 22%, rgba(40,10,90,.35) 100%);
      mix-blend-mode: screen;
      transition: opacity .3s;
    }

    #warp.active { opacity: 1; }

    #warp::after {
      content: '';
      position: absolute;
      inset: -30%;
      background: repeating-radial-gradient(
        ellipse at center,
        rgba(167,139,250,.0) 0 4%,
        rgba(167,139,250,.08) 4.2% 4.5%,
        rgba(56,189,248,.0) 4.8% 7%
      );
      animation: warpSpin .8s linear infinite;
    }

    @keyframes warpSpin { to { transform: scale(1.8) rotate(8deg); } }

    #toast {
      position: fixed;
      left: 50%;
      bottom: 80px;
      z-index: 60;
      transform: translate(-50%, 15px);
      opacity: 0;
      padding: 9px 13px;
      border: 1px solid var(--line);
      border-radius: 9px;
      background: rgba(5,7,14,.82);
      backdrop-filter: blur(18px);
      color: #cbd5e1;
      font: 9px 'JetBrains Mono', monospace;
      transition: .3s var(--ease);
    }

    #toast.show { opacity: 1; transform: translate(-50%,0); }

    @media (max-width: 760px) {
      body { cursor: auto; }
      #cursor { display: none; }
      .telemetry { display: none; }
      .search-wrap { width: calc(100vw - 36px); }
      .nav-panel { width: calc(100vw - 36px); max-height: 36vh; top: 136px; }
      .object-panel { left: 18px; right: 18px; width: auto; top: auto; bottom: 70px; transform: translateY(20px); }
      .object-panel.visible { transform: translateY(0); }
      .hero h1 { font-size: 4rem; }
      .hero p { font-size: 8px; }
      .help { display: none; }
    }
  </style>
</head>

<body>
  <canvas id="webgl-canvas"></canvas>
  <div class="screen-vignette"></div>
  <div class="noise"></div>
  <div id="cursor"></div>
  <div id="warp"></div>

  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">A</div>
      <div>
        <strong>APEARIX</strong>
        <small>UNIVERSE CORE</small>
      </div>
    </div>

    <div class="telemetry">
      <div class="telemetry-item">FPS <b id="fps">60</b></div>
      <div class="telemetry-item">OBJECTS <b id="objects">—</b></div>
      <div class="telemetry-item">STATUS <b class="online">● ONLINE</b></div>
    </div>
  </header>

  <div class="search-wrap">
    <div class="search">
      <span>⌕</span>
      <input id="search" autocomplete="off" placeholder="Search universe..." />
    </div>
    <div id="search-results"></div>
  </div>

  <aside class="nav-panel" id="nav-panel">
    <div class="panel-label">
      <span>Known galaxies</span>
      <span>10</span>
    </div>
    <div id="galaxy-list"></div>
  </aside>

  <section class="hero" id="hero">
    <div class="status"><span class="status-dot"></span> APEARIX UNIVERSE ONLINE</div>
    <h1>Explore <span>Infinity.</span></h1>
    <p>Drag to rotate · Wheel to travel · Double click to warp</p>
  </section>

  <aside class="object-panel" id="object-panel">
    <div class="object-type" id="object-type">PLANET</div>
    <div class="object-name" id="object-name">Earth</div>
    <div class="object-desc" id="object-desc">Our home world.</div>
    <div class="object-stats" id="object-stats"></div>
    <button class="follow-btn" id="follow-btn">FOLLOW OBJECT</button>
  </aside>

  <div class="bottom">
    <div class="help">
      <b>LEFT DRAG</b> ROTATE &nbsp;·&nbsp;
      <b>RIGHT DRAG</b> PAN &nbsp;·&nbsp;
      <b>WHEEL</b> ZOOM &nbsp;·&nbsp;
      <b>DOUBLE CLICK</b> WARP
    </div>

    <div class="controls">
      <button class="control" id="home-btn">⌂ HOME</button>
      <button class="control" id="nav-btn">☰ GALAXIES</button>
      <button class="control" id="sound-btn">◉ SOUND OFF</button>
    </div>
  </div>

  <div id="toast"></div>

<script>
(function () {
  const THREE = window.THREE;
  const canvas = document.getElementById('webgl-canvas');
  const cursor = document.getElementById('cursor');
  const hero = document.getElementById('hero');
  const warp = document.getElementById('warp');
  const toast = document.getElementById('toast');
  const objectPanel = document.getElementById('object-panel');
  const searchInput = document.getElementById('search');
  const searchResults = document.getElementById('search-results');

  // ------------------------------------------------------------
  // Scene
  // ------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03040a);
  scene.fog = new THREE.FogExp2(0x03040a, 0.000025);

  const camera = new THREE.PerspectiveCamera(
    55,
    innerWidth / innerHeight,
    0.1,
    100000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  const textureLoader = new THREE.TextureLoader();
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function toastMessage(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,'rgba(255,255,255,1)');
    g.addColorStop(.12,'rgba(255,255,255,.95)');
    g.addColorStop(.35,'rgba(167,139,250,.45)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(c);
  }

  function makeNebulaTexture(colorA, colorB) {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');

    for (let i = 0; i < 55; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 30 + Math.random() * 140;
      const g = ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,colorA);
      g.addColorStop(.35,colorB);
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(c);
  }

  function safeTexture(url, fallback) {
    const tex = textureLoader.load(
      url,
      t => {
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      },
      undefined,
      () => {}
    );
    return tex || fallback;
  }

  const glowTexture = makeGlowTexture();

  // ------------------------------------------------------------
  // Starfield: 3 depth layers + twinkle
  // ------------------------------------------------------------
  const starLayers = [];

  function createStarLayer(count, spread, size, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorPool = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#dbeafe'),
      new THREE.Color('#c4b5fd'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#fca5a5')
    ];

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), .55) * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i*3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i*3+1] = Math.cos(phi) * r * .72;
      pos[i*3+2] = Math.sin(phi) * Math.sin(theta) * r;

      const c = colorPool[Math.floor(Math.random()*colorPool.length)];
      colors[i*3] = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors,3));

    const mat = new THREE.PointsMaterial({
      size,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    starLayers.push({ points, baseOpacity: opacity, phase: Math.random()*10 });
  }

  createStarLayer(18000, 45000, 1.7, .72);
  createStarLayer(6500, 15000, 3.0, .65);
  createStarLayer(900, 6500, 5.0, .95);

  // ------------------------------------------------------------
  // Subtle nebulae
  // ------------------------------------------------------------
  const nebulae = [
    { p:[-7000,2200,-6500], s:7000, c1:'rgba(124,58,237,.18)', c2:'rgba(56,189,248,.06)' },
    { p:[7200,-1800,-5200], s:6200, c1:'rgba(236,72,153,.12)', c2:'rgba(139,92,246,.06)' },
    { p:[-5000,-2600,7000], s:6500, c1:'rgba(14,165,233,.12)', c2:'rgba(139,92,246,.05)' }
  ];

  nebulae.forEach(n => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeNebulaTexture(n.c1,n.c2),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: .8
    }));
    sprite.position.set(...n.p);
    sprite.scale.set(n.s,n.s,.1);
    scene.add(sprite);
  });

  // ------------------------------------------------------------
  // Galaxy system
  // ------------------------------------------------------------
  const galaxySpecs = [
    { id:'milkyway', name:'Milky Way', pos:[0,0,0], type:'Spiral', scale:1, colors:['#ffffff','#8b5cf6','#38bdf8'], home:true },
    { id:'andromeda', name:'Andromeda', pos:[4800,900,-4100], type:'Spiral', scale:1.35, colors:['#ede9fe','#a78bfa','#38bdf8'] },
    { id:'triangulum', name:'Triangulum', pos:[-4300,-700,-3400], type:'Spiral', scale:.9, colors:['#d1fae5','#34d399','#8b5cf6'] },
    { id:'sombrero', name:'Sombrero', pos:[5400,-1500,4600], type:'Lenticular', scale:1.15, colors:['#fff7ed','#f59e0b','#7c3aed'] },
    { id:'whirlpool', name:'Whirlpool', pos:[-5900,1500,4300], type:'Spiral', scale:1.1, colors:['#fbcfe8','#c084fc','#34d399'] },
    { id:'cartwheel', name:'Cartwheel', pos:[8000,2300,-5900], type:'Ring', scale:1.2, colors:['#dbeafe','#38bdf8','#c084fc'] },
    { id:'blackeye', name:'Black Eye', pos:[-7900,-1900,-6100], type:'Lenticular', scale:1, colors:['#fef3c7','#a78bfa','#111827'] },
    { id:'cigar', name:'Cigar', pos:[6900,-2700,-8500], type:'Irregular', scale:.95, colors:['#fecdd3','#fb7185','#7c3aed'] },
    { id:'lmc', name:'Large Magellanic', pos:[-3400,3300,6500], type:'Irregular', scale:.85, colors:['#ede9fe','#ec4899','#34d399'] },
    { id:'centaurus', name:'Centaurus A', pos:[9000,2900,8000], type:'Elliptical', scale:1.3, colors:['#fff','#8b5cf6','#f59e0b'] }
  ];

  const galaxies = [];
  const clickable = [];
  const planets = [];
  let sunMesh = null;
  let selectedObject = null;
  let followedPlanet = null;

  function galaxyMaterial(colors) {
    return {
      c1:new THREE.Color(colors[0]),
      c2:new THREE.Color(colors[1]),
      c3:new THREE.Color(colors[2])
    };
  }

  function createGalaxy(spec) {
    const group = new THREE.Group();
    group.position.set(...spec.pos);
    group.userData = { type:'galaxy', spec };

    const count = spec.home ? 14000 : 7500;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    const colors = galaxyMaterial(spec.colors);

    for (let i=0; i<count; i++) {
      let x=0,y=0,z=0;
      const u = Math.random();

      if (spec.type === 'Ring') {
        const r = (90 + Math.pow(u,.7)*480) * spec.scale;
        const a = Math.random()*Math.PI*2;
        x = Math.cos(a)*r;
        z = Math.sin(a)*r;
        y = (Math.random()-.5) * (20 + r*.025);
      } else if (spec.type === 'Elliptical') {
        const r = Math.pow(u,.48)*420*spec.scale;
        const a = Math.random()*Math.PI*2;
        x = Math.cos(a)*r*1.35;
        y = (Math.random()-.5)*r*.72;
        z = Math.sin(a)*r*.9;
      } else if (spec.type === 'Irregular') {
        const r = Math.pow(u,.62)*430*spec.scale;
        x = (Math.random()-.5)*r*1.8;
        y = (Math.random()-.5)*r*.7;
        z = (Math.random()-.5)*r*.8;
      } else {
        const r = Math.pow(u,.68)*470*spec.scale;
        const arms = 4;
        const arm = i % arms;
        const angle = arm*(Math.PI*2/arms) + r*.016 + (Math.random()-.5)*.65;
        x = Math.cos(angle)*r + (Math.random()-.5)*26;
        z = Math.sin(angle)*r + (Math.random()-.5)*26;
        y = (Math.random()-.5) * (13 + r*.035);
      }

      pos[i*3]=x;
      pos[i*3+1]=y;
      pos[i*3+2]=z;

      const distance = Math.sqrt(x*x+y*y+z*z);
      const t = Math.min(1,distance/(500*spec.scale));
      const c = colors.c1.clone().lerp(colors.c2,Math.min(1,t*1.5)).lerp(colors.c3,Math.max(0,t-.45));
      col[i*3]=c.r;
      col[i*3+1]=c.g;
      col[i*3+2]=c.b;
    }

    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',new THREE.BufferAttribute(col,3));

    const points = new THREE.Points(geo,new THREE.PointsMaterial({
      size: spec.home ? 2.9 : 3.4*spec.scale,
      map: glowTexture,
      vertexColors:true,
      transparent:true,
      opacity:.86,
      depthWrite:false,
      blending:THREE.AdditiveBlending
    }));

    group.add(points);

    // Dense galactic core
    const core = new THREE.Sprite(new THREE.SpriteMaterial({
      map:glowTexture,
      color:spec.colors[0],
      transparent:true,
      opacity:.9,
      depthWrite:false,
      blending:THREE.AdditiveBlending
    }));
    core.scale.set(190*spec.scale,190*spec.scale,1);
    group.add(core);

    // Click target
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(55*spec.scale,16,16),
      new THREE.MeshBasicMaterial({visible:false})
    );
    hit.userData = {type:'galaxy', spec};
    group.add(hit);
    clickable.push(hit);

    scene.add(group);
    galaxies.push({group,points,spec});

    if (spec.home) createSolarSystem(group);

    return group;
  }

  // ------------------------------------------------------------
  // Solar system
  // ------------------------------------------------------------
  function createPlanetTexture(color) {
    const c = document.createElement('canvas');
    c.width=1024; c.height=512;
    const ctx=c.getContext('2d');

    ctx.fillStyle=color;
    ctx.fillRect(0,0,c.width,c.height);

    for(let i=0;i<160;i++){
      ctx.fillStyle='rgba(255,255,255,'+(Math.random()*.13)+')';
      ctx.beginPath();
      ctx.arc(Math.random()*c.width,Math.random()*c.height,3+Math.random()*28,0,Math.PI*2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  const earthColor = safeTexture(
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    createPlanetTexture('#155e75')
  );

  const earthNormal = safeTexture(
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    createPlanetTexture('#64748b')
  );

  const earthSpecular = safeTexture(
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
    createPlanetTexture('#111827')
  );

  const earthClouds = safeTexture(
    'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
    createPlanetTexture('#ffffff')
  );

  const moonTexture = safeTexture(
    'https://threejs.org/examples/textures/planets/moon_1024.jpg',
    createPlanetTexture('#777777')
  );

  const jupiterTexture = safeTexture(
    'https://threejs.org/examples/textures/planets/jupiter2_1024.jpg',
    createPlanetTexture('#9a6a48')
  );

  const marsTexture = safeTexture(
    'https://threejs.org/examples/textures/planets/mars_1k_color.jpg',
    createPlanetTexture('#8f3f24')
  );

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent:true,
    side:THREE.BackSide,
    blending:THREE.AdditiveBlending,
    uniforms:{
      glowColor:{value:new THREE.Color('#4cc9ff')},
      viewVector:{value:camera.position}
    },
    vertexShader:
      'varying vec3 vNormal;\n' +
      'void main(){\n' +
      '  vNormal = normalize(normalMatrix * normal);\n' +
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n' +
      '}',
    fragmentShader:
      'varying vec3 vNormal;\n' +
      'void main(){\n' +
      '  float intensity = pow(0.72 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0);\n' +
      '  gl_FragColor = vec4(0.22,0.72,1.0,intensity*.72);\n' +
      '}'
  });

  function createSolarSystem(homeGroup) {
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(25,48,48),
      new THREE.MeshBasicMaterial({color:0xffc247})
    );
    sun.userData = {
      type:'sun',
      name:'Sun',
      description:'The star at the center of our solar system.',
      stats:[
        ['TYPE','G2 V'],
        ['AGE','4.6 BY'],
        ['TEMP','5,500°C'],
        ['MOONS','8 PLANETS']
      ]
    };
    homeGroup.add(sun);
    sunMesh = sun;
    clickable.push(sun);

    const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map:glowTexture,
      color:0xffb52e,
      transparent:true,
      opacity:.92,
      blending:THREE.AdditiveBlending
    }));
    sunGlow.scale.set(300,300,1);
    homeGroup.add(sunGlow);

    const sunLight = new THREE.PointLight(0xffffff,3.2,8000,1.2);
    homeGroup.add(sunLight);

    const planetData = [
      {id:'MERCURY',name:'Mercury',r:65,size:2.4,speed:.018,color:0x9ca3af,desc:'The smallest planet and the closest planet to the Sun.',stats:[['DIAMETER','4,879 KM'],['YEAR','88 DAYS'],['MOONS','0'],['TEMP','167°C']]},
      {id:'VENUS',name:'Venus',r:100,size:3.6,speed:.014,color:0xd6a15d,desc:'A hot world wrapped in a thick carbon-dioxide atmosphere.',stats:[['DIAMETER','12,104 KM'],['YEAR','225 DAYS'],['MOONS','0'],['TEMP','464°C']]},
      {id:'EARTH',name:'Earth',r:155,size:5.2,speed:.010,earth:true,desc:'Our home world — the only known world with life.',stats:[['DIAMETER','12,742 KM'],['YEAR','365.25 DAYS'],['MOONS','1'],['TEMP','15°C']]},
      {id:'MARS',name:'Mars',r:215,size:3.2,speed:.008,mars:true,color:0xc65f3a,desc:'The red planet, marked by ancient valleys and giant volcanoes.',stats:[['DIAMETER','6,779 KM'],['YEAR','687 DAYS'],['MOONS','2'],['TEMP','-63°C']]},
      {id:'JUPITER',name:'Jupiter',r:315,size:11,speed:.004,jupiter:true,desc:'The largest planet, dominated by powerful storms.',stats:[['DIAMETER','139,820 KM'],['YEAR','11.86 YEARS'],['MOONS','95+'],['TEMP','-110°C']]},
      {id:'SATURN',name:'Saturn',r:425,size:9,speed:.0028,color:0xd8c18a,rings:true,desc:'A gas giant surrounded by a spectacular system of icy rings.',stats:[['DIAMETER','116,460 KM'],['YEAR','29.45 YEARS'],['MOONS','140+'],['TEMP','-140°C']]},
      {id:'URANUS',name:'Uranus',r:525,size:6.2,speed:.0018,color:0x73d5dc,desc:'An ice giant rotating on an extreme axial tilt.',stats:[['DIAMETER','50,724 KM'],['YEAR','84 YEARS'],['MOONS','27'],['TEMP','-195°C']]},
      {id:'NEPTUNE',name:'Neptune',r:625,size:6,speed:.0015,color:0x426ee8,desc:'A distant blue ice giant with extremely fast winds.',stats:[['DIAMETER','49,244 KM'],['YEAR','164.8 YEARS'],['MOONS','14'],['TEMP','-200°C']]}
    ];

    planetData.forEach(d => {
      const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0,0,d.r,d.r*.97,0,Math.PI*2,false,0)
            .getPoints(180)
            .map(p=>new THREE.Vector3(p.x,0,p.y))
        ),
        new THREE.LineBasicMaterial({
          color:d.id==='EARTH'?0x34d399:0x7c3aed,
          transparent:true,
          opacity:.14
        })
      );
      orbit.rotation.x=Math.PI/2;
      homeGroup.add(orbit);

      const pivot = new THREE.Group();
      homeGroup.add(pivot);

      let material;
      if (d.earth) {
        material = new THREE.MeshPhongMaterial({
          map:earthColor,
          normalMap:earthNormal,
          specularMap:earthSpecular,
          specular:new THREE.Color(0x446688),
          shininess:18
        });
      } else if (d.jupiter) {
        material = new THREE.MeshPhongMaterial({map:jupiterTexture,shininess:3});
      } else if (d.mars) {
        material = new THREE.MeshPhongMaterial({map:marsTexture,shininess:2});
      } else {
        material = new THREE.MeshPhongMaterial({
          color:d.color,
          shininess: d.id==='VENUS'?8:3
        });
      }

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.size,40,40),material);
      mesh.userData = {
        type:'planet',
        id:d.id,
        name:d.name,
        description:d.desc,
        stats:d.stats
      };
      pivot.add(mesh);
      clickable.push(mesh);

      if (d.earth) {
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(d.size*1.09,40,40),
          atmosphereMaterial.clone()
        );
        pivot.add(atmosphere);

        const cloud = new THREE.Mesh(
          new THREE.SphereGeometry(d.size*1.018,40,40),
          new THREE.MeshPhongMaterial({
            map:earthClouds,
            transparent:true,
            opacity:.48,
            depthWrite:false
          })
        );
        pivot.add(cloud);

        const moonPivot = new THREE.Group();
        mesh.add(moonPivot);
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(1.35,24,24),
          new THREE.MeshPhongMaterial({map:moonTexture,shininess:1})
        );
        moon.position.x=12;
        moonPivot.add(moon);
        moonPivot.userData={speed:.025};
      }

      if (d.rings) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(d.size*1.45,d.size*2.65,96),
          new THREE.MeshBasicMaterial({
            color:0xd7c28e,
            side:THREE.DoubleSide,
            transparent:true,
            opacity:.68
          })
        );
        ring.rotation.x=Math.PI/2.25;
        mesh.add(ring);
      }

      const planet = {
        id:d.id,
        name:d.name,
        pivot,
        mesh,
        orbit:d.r,
        speed:d.speed,
        angle:Math.random()*Math.PI*2
      };

      planets.push(planet);
    });
  }

  galaxySpecs.forEach(createGalaxy);

  // ------------------------------------------------------------
  // Camera / interaction
  // ------------------------------------------------------------
  const targetLookAt = new THREE.Vector3(0,0,0);
  const currentLookAt = new THREE.Vector3(0,0,0);

  let spherical = {radius:950,theta:.8,phi:1.18};
  let targetSpherical = {radius:950,theta:.8,phi:1.18};

  let dragging=false;
  let panning=false;
  let prev={x:0,y:0};
  let hovered=null;
  let warpBusy=false;
  let lastClickTime=0;
  let mouseIdle=0;

  function setPointer(clientX,clientY) {
    mouse.x=(clientX/innerWidth)*2-1;
    mouse.y=-(clientY/innerHeight)*2+1;
  }

  function getHit(clientX,clientY) {
    setPointer(clientX,clientY);
    raycaster.setFromCamera(mouse,camera);
    const hits=raycaster.intersectObjects(clickable,false);
    return hits[0] || null;
  }

  function updateCursor(hit) {
    if (hit) cursor.classList.add('hover');
    else cursor.classList.remove('hover');
  }

  function showObject(obj) {
    selectedObject=obj;
    objectPanel.classList.add('visible');

    document.getElementById('object-type').textContent =
      obj.userData.type === 'galaxy' ? obj.userData.spec.type.toUpperCase() : obj.userData.type.toUpperCase();

    document.getElementById('object-name').textContent =
      obj.userData.type === 'galaxy' ? obj.userData.spec.name : obj.userData.name;

    document.getElementById('object-desc').textContent =
      obj.userData.type === 'galaxy'
        ? obj.userData.spec.name + ' · ' + obj.userData.spec.type + ' galaxy'
        : obj.userData.description;

    const stats=obj.userData.type==='galaxy'
      ? [
          ['TYPE',obj.userData.spec.type.toUpperCase()],
          ['SCALE',obj.userData.spec.scale.toFixed(2)+'×'],
          ['SYSTEMS','EXPLORABLE'],
          ['STATUS','DISCOVERED']
        ]
      : obj.userData.stats;

    document.getElementById('object-stats').innerHTML=stats.map(s =>
      '<div class="stat"><small>'+s[0]+'</small><b>'+s[1]+'</b></div>'
    ).join('');
  }

  function hideObject() {
    selectedObject=null;
    objectPanel.classList.remove('visible');
  }

  function focusGalaxy(spec, cinematic=true) {
    if (warpBusy) return;
    const destination = new THREE.Vector3(...spec.pos);

    if (cinematic) {
      warpBusy=true;
      warp.classList.add('active');
      hero.classList.add('hide');

      const startRadius=targetSpherical.radius;
      const mid=performance.now();

      targetLookAt.copy(destination);
      targetSpherical.radius=720*spec.scale;

      setTimeout(() => {
        warp.classList.remove('active');
        warpBusy=false;
        toastMessage('ARRIVED · '+spec.name.toUpperCase());
      },850);

      void startRadius;
      void mid;
    } else {
      targetLookAt.copy(destination);
      targetSpherical.radius=720*spec.scale;
      hero.classList.add('hide');
    }

    showObject({
      userData:{
        type:'galaxy',
        spec
      }
    });
  }

  function focusPlanet(p) {
    followedPlanet=p;
    hero.classList.add('hide');
    hideObject();
    targetSpherical.radius=p.id==='EARTH'?30:42;
    toastMessage('LOCKED · '+p.name.toUpperCase());
  }

  function home() {
    followedPlanet=null;
    targetLookAt.set(0,0,0);
    targetSpherical.radius=950;
    targetSpherical.theta=.8;
    targetSpherical.phi=1.18;
    hero.classList.remove('hide');
    hideObject();
    toastMessage('HOME · MILKY WAY');
  }

  window.addEventListener('mousemove',e => {
    cursor.style.left=e.clientX+'px';
    cursor.style.top=e.clientY+'px';
    mouseIdle=0;

    const hit=getHit(e.clientX,e.clientY);
    hovered=hit ? hit.object : null;
    updateCursor(hit);

    const dx=e.clientX-prev.x;
    const dy=e.clientY-prev.y;

    if (dragging) {
      followedPlanet=null;
      targetSpherical.theta-=dx*.0045;
      targetSpherical.phi=Math.max(.08,Math.min(Math.PI-.08,targetSpherical.phi-dy*.0045));
    } else if (panning) {
      followedPlanet=null;
      const forward=new THREE.Vector3().subVectors(camera.position,currentLookAt).normalize();
      const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),forward).normalize();
      const up=new THREE.Vector3().crossVectors(forward,right).normalize();
      const speed=targetSpherical.radius*.0015;
      targetLookAt.addScaledVector(right,dx*speed);
      targetLookAt.addScaledVector(up,-dy*speed);
    }

    prev.x=e.clientX;
    prev.y=e.clientY;
  });

  window.addEventListener('mousedown',e => {
    if (e.button===2) panning=true;
    else dragging=true;
    prev.x=e.clientX;
    prev.y=e.clientY;
  });

  window.addEventListener('mouseup',() => {
    dragging=false;
    panning=false;
  });

  window.addEventListener('contextmenu',e => e.preventDefault());

  window.addEventListener('dblclick',e => {
    const hit=getHit(e.clientX,e.clientY);

    if (!hit) {
      home();
      return;
    }

    const obj=hit.object;
    if (obj.userData.type==='galaxy') {
      focusGalaxy(obj.userData.spec,true);
    } else if (obj.userData.type==='planet') {
      const p=planets.find(x=>x.id===obj.userData.id);
      if (p) focusPlanet(p);
    } else if (obj.userData.type==='sun') {
      followedPlanet=null;
      targetLookAt.set(0,0,0);
      targetSpherical.radius=72;
      hero.classList.add('hide');
      showObject(obj);
    }
  });

  window.addEventListener('wheel',e => {
    e.preventDefault();
    const factor=1+Math.min(Math.abs(e.deltaY)*.0018,.24);
    targetSpherical.radius*=e.deltaY>0?factor:1/factor;
    targetSpherical.radius=THREE.MathUtils.clamp(targetSpherical.radius,16,36000);

    if (targetSpherical.radius>1600) {
      followedPlanet=null;
      hero.classList.add('hide');
    }
  },{passive:false});

  // ------------------------------------------------------------
  // Touch navigation
  // ------------------------------------------------------------
  let touchDist=0;

  window.addEventListener('touchstart',e => {
    if(e.touches.length===1){
      dragging=true;
      prev.x=e.touches[0].clientX;
      prev.y=e.touches[0].clientY;
    }
    if(e.touches.length===2){
      panning=true;
      touchDist=Math.hypot(
        e.touches[0].clientX-e.touches[1].clientX,
        e.touches[0].clientY-e.touches[1].clientY
      );
    }
  },{passive:false});

  window.addEventListener('touchmove',e => {
    e.preventDefault();

    if(e.touches.length===1 && dragging){
      const x=e.touches[0].clientX;
      const y=e.touches[0].clientY;
      targetSpherical.theta-=(x-prev.x)*.005;
      targetSpherical.phi=Math.max(.08,Math.min(Math.PI-.08,targetSpherical.phi-(y-prev.y)*.005));
      prev.x=x;
      prev.y=y;
    }

    if(e.touches.length===2){
      const d=Math.hypot(
        e.touches[0].clientX-e.touches[1].clientX,
        e.touches[0].clientY-e.touches[1].clientY
      );
      targetSpherical.radius*=touchDist/d;
      targetSpherical.radius=THREE.MathUtils.clamp(targetSpherical.radius,16,36000);
      touchDist=d;
    }
  },{passive:false});

  window.addEventListener('touchend',() => {
    dragging=false;
    panning=false;
  });

  // ------------------------------------------------------------
  // Search
  // ------------------------------------------------------------
  const searchable = [
    ...galaxySpecs.map(g=>({name:g.name,type:'Galaxy',action:()=>focusGalaxy(g,true)})),
    ...planets.map(p=>({name:p.name,type:'Planet',action:()=>focusPlanet(p)})),
    {name:'Sun',type:'Star',action:()=>{targetLookAt.set(0,0,0);targetSpherical.radius=72;hero.classList.add('hide');}}
  ];

  searchInput.addEventListener('input',() => {
    const q=searchInput.value.trim().toLowerCase();

    if(!q){
      searchResults.style.display='none';
      searchResults.innerHTML='';
      return;
    }

    const results=searchable.filter(x=>x.name.toLowerCase().includes(q)).slice(0,6);
    searchResults.innerHTML=results.length
      ? results.map((r,i)=>'<div class="search-result" data-index="'+i+'"><b>'+r.name+'</b><small>'+r.type+'</small></div>').join('')
      : '<div class="search-result"><b>No object found</b><small>Try Earth, Jupiter, Andromeda...</small></div>';

    searchResults.style.display='block';

    searchResults.querySelectorAll('.search-result[data-index]').forEach(el=>{
      el.addEventListener('click',()=>{
        results[Number(el.dataset.index)].action();
        searchInput.value='';
        searchResults.style.display='none';
      });
    });
  });

  // ------------------------------------------------------------
  // Galaxy navigator
  // ------------------------------------------------------------
  const galaxyList=document.getElementById('galaxy-list');

  galaxySpecs.forEach(g=>{
    const button=document.createElement('button');
    button.className='galaxy-item';
    button.innerHTML='<span class="galaxy-dot"></span><span>'+g.name+'</span>';
    button.addEventListener('click',()=>focusGalaxy(g,true));
    galaxyList.appendChild(button);
  });

  document.getElementById('home-btn').addEventListener('click',home);

  document.getElementById('nav-btn').addEventListener('click',()=>{
    document.getElementById('nav-panel').classList.toggle('hidden');
  });

  document.getElementById('follow-btn').addEventListener('click',()=>{
    if(selectedObject && selectedObject.userData.type==='planet'){
      const p=planets.find(x=>x.id===selectedObject.userData.id);
      if(p) followedPlanet=p;
    }
  });

  // ------------------------------------------------------------
  // Simple sound feedback using Web Audio
  // ------------------------------------------------------------
  let audioEnabled=false;
  let audioCtx=null;

  function beep(freq=520,duration=.07) {
    if(!audioEnabled) return;
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type='sine';
    osc.frequency.value=freq;
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.025,audioCtx.currentTime+.01);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime+duration+.02);
  }

  document.getElementById('sound-btn').addEventListener('click',async()=>{
    audioEnabled=!audioEnabled;
    if(audioEnabled){
      if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended') await audioCtx.resume();
      beep(660,.09);
    }
    document.getElementById('sound-btn').textContent=audioEnabled?'◉ SOUND ON':'◉ SOUND OFF';
  });

  // ------------------------------------------------------------
  // Render loop
  // ------------------------------------------------------------
  let frames=0;
  let fpsTime=performance.now();

  function animate() {
    requestAnimationFrame(animate);
    const delta=Math.min(clock.getDelta(),.05);
    const elapsed=clock.elapsedTime;

    mouseIdle+=delta;

    if(followedPlanet){
      const world=new THREE.Vector3();
      followedPlanet.mesh.getWorldPosition(world);
      targetLookAt.lerp(world,.12);
    }

    // Smooth camera
    spherical.radius += (targetSpherical.radius-spherical.radius)*.075;
    spherical.theta += (targetSpherical.theta-spherical.theta)*.075;
    spherical.phi += (targetSpherical.phi-spherical.phi)*.075;
    currentLookAt.lerp(targetLookAt,.075);

    camera.position.x=currentLookAt.x+spherical.radius*Math.sin(spherical.phi)*Math.sin(spherical.theta);
    camera.position.y=currentLookAt.y+spherical.radius*Math.cos(spherical.phi);
    camera.position.z=currentLookAt.z+spherical.radius*Math.sin(spherical.phi)*Math.cos(spherical.theta);

    camera.lookAt(currentLookAt);

    // Mouse parallax
    camera.position.x += mouse.x*2.2;
    camera.position.y += mouse.y*1.4;

    // Stars
    starLayers.forEach((layer,i)=>{
      layer.points.rotation.y += delta*(.0025+i*.001);
      layer.points.rotation.x = Math.sin(elapsed*.05+layer.phase)*.006;
      layer.points.material.opacity =
        layer.baseOpacity*(.9+.1*Math.sin(elapsed*(.8+i*.4)+layer.phase));
    });

    // Galaxies
    galaxies.forEach((g,i)=>{
      g.points.rotation.y += delta*(.012/(i*.18+1));
      g.points.rotation.z = Math.sin(elapsed*.05+i)*.015;
    });

    // Planets
    planets.forEach(p=>{
      p.angle += p.speed*delta*60;
      p.pivot.position.x=Math.cos(p.angle)*p.orbit;
      p.pivot.position.z=Math.sin(p.angle)*p.orbit;
      p.mesh.rotation.y += delta*.18;

      p.mesh.children.forEach(child=>{
        if(child.userData && child.userData.speed){
          child.rotation.y += child.userData.speed*delta*60;
        }
      });
    });

    if(sunMesh) sunMesh.rotation.y+=delta*.04;

    // Dynamic FOV during deep travel
    const targetFov = targetSpherical.radius < 100 ? 50 : 55;
    camera.fov += (targetFov-camera.fov)*.05;
    camera.updateProjectionMatrix();

    renderer.render(scene,camera);

    frames++;
    if(performance.now()-fpsTime>700){
      document.getElementById('fps').textContent=String(Math.round(frames*1000/(performance.now()-fpsTime)));
      document.getElementById('objects').textContent=String(18000+galaxies.length*7500+planets.length);
      frames=0;
      fpsTime=performance.now();
    }
  }

  // Hover information
  setInterval(()=>{
    if(hovered && !dragging && !panning){
      const obj=hovered;
      if(obj.userData.type==='planet' || obj.userData.type==='sun' || obj.userData.type==='galaxy'){
        showObject(obj);
      }
    }
  },140);

  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  });

  // Initial state
  toastMessage('SYSTEM READY · EXPLORE THE UNIVERSE');
  animate();
})();
</script>
</body>
</html>`;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Apearix APIverse</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    :root {
      --color-background: #FFFFFF;
      --color-surface: #FAFAFC;
      --color-surface-alt: #F6F7FB;
      --color-primary: #5500ff;
      --color-primary-hover: #4c00ff;
      --color-primary-light: #F4F0FF;
      --color-heading: #111827;
      --color-body: #4B5563;
      --color-muted: #6B7280;
      --color-border: #E5E7EB;
      --color-border-accent: #DDD6FE;
      --color-border-subtle: rgba(0, 0, 0, 0.06);
      --color-brand-purple: #6D28F5;
      --color-accent-purple: #5B21E6;
      --color-glow: rgba(109, 40, 245, 0.12);
      --color-footer: #0F172A;
      --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
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
      background-color: #090A0F;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      touch-action: none;
      overscroll-behavior: none;
      cursor: none !important; /* System pointer hidden completely */
    }

    #webgl-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      display: block;
    }

    .vignette-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      background: radial-gradient(circle at center, transparent 38%, rgba(9, 10, 15, 0.65) 80%, #090A0F 100%);
    }

    /* 18px Sci-Fi Cursor Ring */
    #universe-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--color-brand-purple);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 12px var(--color-brand-purple), inset 0 0 6px rgba(109, 40, 245, 0.4);
      transition: width 0.2s var(--ease-apple), height 0.2s var(--ease-apple), border-color 0.2s;
    }

    #universe-cursor::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: #FFFFFF;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 8px #FFFFFF;
    }

    #universe-cursor.hovering {
      width: 28px;
      height: 28px;
      border-color: #10B981;
      box-shadow: 0 0 16px #10B981, inset 0 0 8px rgba(16, 185, 129, 0.5);
    }

    /* Clean Center Hero Container */
    .content-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      text-align: center;
      pointer-events: none;
      transition: opacity 0.35s var(--ease-apple), transform 0.25s var(--ease-apple);
    }

    .system-status {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--color-primary);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 18px;
      background: rgba(109, 40, 245, 0.08);
      border: 1px solid var(--color-border-accent);
      padding: 7px 22px;
      border-radius: 9999px;
      backdrop-filter: blur(16px);
      box-shadow: 0 0 30px var(--color-glow);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10B981;
      animation: beacon 1.8s ease-in-out infinite;
    }

    @keyframes beacon {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.65); }
    }

    .title {
      font-size: 7.2rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #FFFFFF;
      line-height: 1.05;
      margin: 0;
      text-shadow: 0 18px 45px rgba(0, 0, 0, 0.95);
    }

    .title span {
      background: linear-gradient(135deg, var(--color-brand-purple) 0%, var(--color-accent-purple) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 40px rgba(109, 40, 245, 0.65));
    }

    .sub-telemetry {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: var(--color-muted);
      margin-top: 18px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .sub-telemetry span.dim { color: #374151; }
    .sub-telemetry span.active { color: var(--color-border-accent); }

    @media (max-width: 1024px) {
      .title { font-size: 4.8rem; }
    }

    @media (max-width: 640px) {
      .title { font-size: 3rem; }
      .system-status { font-size: 0.72rem; }
      .sub-telemetry { font-size: 0.68rem; }
    }
  </style>
</head>
<body>
  <div class="vignette-overlay"></div>
  <div id="universe-cursor"></div>
  <canvas id="webgl-canvas"></canvas>

  <div class="content-container" id="interactive-card">
    
    <h1 class="title">Hello <span>Apearix!</span></h1>
    <div class="sub-telemetry">
      <span>10 REAL GALAXIES</span>
      <span class="dim"> // </span>
      <span class="active">DOUBLE CLICK TO WARP</span>
      <span class="dim"> // </span>
      <span style="color: var(--color-brand-purple)">PORT 3001</span>
    </div>
  </div>

  <script>
    (function () {
      const canvas = document.getElementById('webgl-canvas');
      const card = document.getElementById('interactive-card');
      const cursor = document.getElementById('universe-cursor');

      // 1. PAGE ZOOM & DEFAULT GESTURE LOCK
      window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
      window.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('gesturestart', (e) => e.preventDefault());
      document.addEventListener('touchmove', (e) => { if (e.scale !== 1) e.preventDefault(); }, { passive: false });

      // 2. THREE.JS ENGINE SETUP
      const scene = new THREE.Scene();
      // scene.fog = new THREE.FogExp2(0x090A0F, 0.00008);
      scene.fog = false;

      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 75000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x090A0F, 1);

      // Texture Generators
      function createStarTexture() {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      
      // Sharp center core with crisp glow
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.15, 'rgba(255, 255, 255, 0.95)');
      g.addColorStop(0.35, 'rgba(224, 231, 255, 0.6)');
      g.addColorStop(0.7, 'rgba(109, 40, 245, 0.15)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(c);
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      return texture;
      }

      function createSunTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#ff7b00';
        ctx.fillRect(0, 0, 512, 256);
        for (let i = 0; i < 600; i++) {
          ctx.fillStyle = Math.random() > 0.4 ? '#ffbe0b' : '#ff0054';
          ctx.beginPath();
          ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 8 + 2, 0, Math.PI * 2);
          ctx.fill();
        }
        return new THREE.CanvasTexture(c);
      }

      function createRealisticEarthTexture() {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#081c3d';
        ctx.fillRect(0, 0, 1024, 512);

        ctx.fillStyle = '#10B981';
        for (let i = 0; i < 45; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 80 + 35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#047857';
        for (let i = 0; i < 35; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 55 + 20, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        for (let i = 0; i < 40; i++) {
          ctx.beginPath();
          ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 140 + 40, Math.random() * 25 + 8, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, 1024, 38);
        ctx.fillRect(0, 474, 1024, 38);
        return new THREE.CanvasTexture(c);
      }

      function createJupiterTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 256;
        const ctx = c.getContext('2d');
        for (let y = 0; y < 256; y += 6) {
          ctx.fillStyle = y % 12 === 0 ? '#c99a6b' : (y % 18 === 0 ? '#e3c6a0' : '#8c593b');
          ctx.fillRect(0, y, 512, 6);
        }
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.ellipse(340, 160, 40, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        return new THREE.CanvasTexture(c);
      }

      const starTex = createStarTexture();
      const sunTex = createSunTexture();
      const earthTex = createRealisticEarthTexture();
      const jupiterTex = createJupiterTexture();

      // 3. ULTRA-VISIBLE VIBRANT STARFIELD (12,000 STARS)
      const starGeo = new THREE.BufferGeometry();
      const starCount = 12000;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starColorsPalette = [
        new THREE.Color('#FFFFFF'),
        new THREE.Color('#E0E7FF'),
        new THREE.Color('#C4B5FD'),
        new THREE.Color('#10B981'),
        new THREE.Color('#FDE047')
      ];

      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 45000;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 35000;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 45000;

        const col = starColorsPalette[Math.floor(Math.random() * starColorsPalette.length)];
        starColors[i * 3] = col.r;
        starColors[i * 3 + 1] = col.g;
        starColors[i * 3 + 2] = col.b;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 5.5,
        map: starTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      scene.add(new THREE.Points(starGeo, starMat));

      // 4. REAL 10 EXPLORED GALAXIES WITH SYSTEMS & PLANETS
      const GALAXY_SPECS = [
        { id: 'milkyway', name: 'Milky Way', pos: new THREE.Vector3(0, 0, 0), c1: '#FFFFFF', c2: '#6D28F5', c3: '#10B981', scale: 1.0, isSolarHome: true },
        { id: 'andromeda', name: 'Andromeda', pos: new THREE.Vector3(4500, 900, -3800), c1: '#C4B5FD', c2: '#7928CA', c3: '#38BDF8', scale: 1.35 },
        { id: 'triangulum', name: 'Triangulum', pos: new THREE.Vector3(-4200, -700, -3200), c1: '#6EE7B7', c2: '#10B981', c3: '#6D28F5', scale: 0.9 },
        { id: 'sombrero', name: 'Sombrero', pos: new THREE.Vector3(5200, -1400, 4400), c1: '#FFFFFF', c2: '#A78BFA', c3: '#312E81', scale: 1.15 },
        { id: 'whirlpool', name: 'Whirlpool', pos: new THREE.Vector3(-5600, 1600, 4200), c1: '#F472B6', c2: '#6D28F5', c3: '#10B981', scale: 1.1 },
        { id: 'cartwheel', name: 'Cartwheel', pos: new THREE.Vector3(7800, 2200, -5600), c1: '#10B981', c2: '#38BDF8', c3: '#7928CA', scale: 1.25, isRing: true },
        { id: 'blackeye', name: 'Black Eye', pos: new THREE.Vector3(-7800, -1800, -5800), c1: '#FDE047', c2: '#7928CA', c3: '#090A0F', scale: 1.0 },
        { id: 'cigar', name: 'Cigar', pos: new THREE.Vector3(6800, -2600, -8200), c1: '#FB7185', c2: '#6D28F5', c3: '#F43F5E', scale: 0.95 },
        { id: 'lmc', name: 'Large Magellanic', pos: new THREE.Vector3(-3200, 3200, 6200), c1: '#DDD6FE', c2: '#EC4899', c3: '#10B981', scale: 0.85 },
        { id: 'centaurus', name: 'Centaurus A', pos: new THREE.Vector3(8800, 2800, 7800), c1: '#FFFFFF', c2: '#6D28F5', c3: '#F59E0B', scale: 1.3 }
      ];

      const allGalaxies = [];
      const solarPlanets = [];
      const clickableObjects = [];
      let sunMeshRef = null;

      GALAXY_SPECS.forEach((gSpec) => {
        const gGroup = new THREE.Group();
        gGroup.position.copy(gSpec.pos);

        const pCount = 2000;
        const gGeo = new THREE.BufferGeometry();
        const pos = new Float32Array(pCount * 3);
        const col = new Float32Array(pCount * 3);
        const c1 = new THREE.Color(gSpec.c1);
        const c2 = new THREE.Color(gSpec.c2);
        const c3 = new THREE.Color(gSpec.c3);

        for (let i = 0; i < pCount; i++) {
          const dist = Math.pow(Math.random(), 1.7) * (420 * gSpec.scale) + 15;
          const arm = i % 2;
          const spiral = dist * 0.015 + (arm * Math.PI);

          pos[i * 3] = Math.cos(spiral) * dist + (Math.random() - 0.5) * 25;
          pos[i * 3 + 1] = (Math.random() - 0.5) * (gSpec.isRing ? 12 : 35);
          pos[i * 3 + 2] = Math.sin(spiral) * dist + (Math.random() - 0.5) * 25;

          const pCol = dist < 70 ? c1.clone().lerp(c2, dist / 70) : c2.clone().lerp(c3, (dist - 70) / (350 * gSpec.scale));
          col[i * 3] = pCol.r;
          col[i * 3 + 1] = pCol.g;
          col[i * 3 + 2] = pCol.b;
        }

        gGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        gGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const gMat = new THREE.PointsMaterial({
        size: 4.2 * gSpec.scale,        
        sizeAttenuation: true,       
        map: starTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,            
        blending: THREE.AdditiveBlending,
        depthWrite: false
           });
        const pSystem = new THREE.Points(gGeo, gMat);
        gGroup.add(pSystem);

        // Core Glowing Mesh (Raycast Click Target)
        const hitSphere = new THREE.Mesh(
          new THREE.SphereGeometry(30 * gSpec.scale, 16, 16),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        hitSphere.userData = { type: 'galaxy', spec: gSpec };
        gGroup.add(hitSphere);
        clickableObjects.push(hitSphere);

        // Core Corona Sprite
        const coreSprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: starTex, color: gSpec.c1, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
        );
        coreSprite.scale.set(160 * gSpec.scale, 160 * gSpec.scale, 1);
        gGroup.add(coreSprite);

        // MILKY WAY: SOLAR SYSTEM
        if (gSpec.isSolarHome) {
          const sGeo = new THREE.SphereGeometry(22, 32, 32);
          const sMat = new THREE.MeshBasicMaterial({ map: sunTex });
          const sunMesh = new THREE.Mesh(sGeo, sMat);
          sunMesh.userData = { type: 'sun', spec: gSpec };
          gGroup.add(sunMesh);
          sunMeshRef = sunMesh;
          clickableObjects.push(sunMesh);

          const sLight = new THREE.PointLight(0xFFFFFF, 3.5, 6000, 1.1);
          gGroup.add(sLight);

          const sGlow = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: starTex, color: 0xFDE047, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
          );
          sGlow.scale.set(220, 220, 1);
          gGroup.add(sGlow);

          const realPlanets = [
            { id: 'MERCURY', name: 'Mercury', r: 52, size: 2.2, color: 0x9CA3AF, speed: 0.024 },
            { id: 'VENUS', name: 'Venus', r: 85, size: 3.6, color: 0xFBBF24, speed: 0.018 },
            { id: 'EARTH', name: 'Earth', r: 135, size: 4.5, map: earthTex, speed: 0.014, hasAtmosphere: true, hasMoon: true },
            { id: 'MARS', name: 'Mars', r: 195, size: 2.8, color: 0xEF4444, speed: 0.011 },
            { id: 'JUPITER', name: 'Jupiter', r: 290, size: 9.8, map: jupiterTex, speed: 0.007, moons: 3 },
            { id: 'SATURN', name: 'Saturn', r: 390, size: 7.8, color: 0xFDE68A, speed: 0.005, hasRings: true },
            { id: 'URANUS', name: 'Uranus', r: 480, size: 5.2, color: 0x38BDF8, speed: 0.0035 },
            { id: 'NEPTUNE', name: 'Neptune', r: 570, size: 5.0, color: 0x3B82F6, speed: 0.0028 }
          ];

          realPlanets.forEach((pData) => {
            const oCurve = new THREE.EllipseCurve(0, 0, pData.r, pData.r * 0.96, 0, Math.PI * 2, false, 0);
            const oPts = oCurve.getPoints(120);
            const oGeo = new THREE.BufferGeometry().setFromPoints(oPts.map(pt => new THREE.Vector3(pt.x, 0, pt.y)));
            const oLine = new THREE.Line(oGeo, new THREE.LineBasicMaterial({
              color: pData.id === 'EARTH' ? 0x10B981 : 0x7928CA,
              transparent: true,
              opacity: 0.28
            }));
            oLine.rotation.x = Math.PI / 2;
            gGroup.add(oLine);

            const pPivot = new THREE.Group();
            gGroup.add(pPivot);

            const pMat = pData.map
              ? new THREE.MeshStandardMaterial({ map: pData.map, roughness: 0.6, metalness: 0.1 })
              : new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.6 });
            const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.size, 32, 32), pMat);
            pMesh.userData = { type: 'planet', data: pData };
            pPivot.add(pMesh);
            clickableObjects.push(pMesh);

            const moonRefs = [];
            if (pData.hasAtmosphere) {
              const atmo = new THREE.Sprite(
                new THREE.SpriteMaterial({ map: starTex, color: 0x38BDF8, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
              );
              atmo.scale.set(pData.size * 3.4, pData.size * 3.4, 1);
              pMesh.add(atmo);
            }

            if (pData.hasMoon) {
              const mM = new THREE.Mesh(
                new THREE.SphereGeometry(pData.size * 0.27, 24, 24),
                new THREE.MeshStandardMaterial({ color: 0xD1D5DB, roughness: 0.9 })
              );
              const mP = new THREE.Group();
              pMesh.add(mP);
              mM.position.set(pData.size + 8, 0, 0);
              mP.add(mM);
              moonRefs.push({ pivot: mP, speed: 0.05 });
            }

            if (pData.hasRings) {
              const rMesh = new THREE.Mesh(
                new THREE.RingGeometry(pData.size * 1.4, pData.size * 2.5, 48),
                new THREE.MeshBasicMaterial({ color: 0xFDE68A, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
              );
              rMesh.rotation.x = Math.PI / 2.3;
              pMesh.add(rMesh);
            }

            if (pData.moons) {
              for (let m = 0; m < pData.moons; m++) {
                const jmM = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), new THREE.MeshStandardMaterial({ color: 0xE5E7EB }));
                const jmP = new THREE.Group();
                pMesh.add(jmP);
                jmM.position.set(pData.size + 7 + m * 6, 0, 0);
                jmP.add(jmM);
                moonRefs.push({ pivot: jmP, speed: 0.04 - m * 0.01 });
              }
            }

            solarPlanets.push({
              id: pData.id,
              name: pData.name,
              pivot: pPivot,
              mesh: pMesh,
              rx: pData.r,
              rz: pData.r * 0.96,
              speed: pData.speed,
              angle: Math.random() * Math.PI * 2,
              moons: moonRefs
            });
          });
        } else {
          // EXOPLANETS FOR OTHER 9 GALAXIES
          for (let ep = 0; ep < 4; ep++) {
            const epDist = 90 + ep * 55;
            const epMesh = new THREE.Mesh(
              new THREE.SphereGeometry(Math.random() * 5 + 3, 24, 24),
              new THREE.MeshStandardMaterial({ color: ep % 2 === 0 ? 0x10B981 : 0x7928CA, emissive: 0x110826 })
            );
            const epPivot = new THREE.Group();
            gGroup.add(epPivot);
            epPivot.add(epMesh);

            const epCurve = new THREE.EllipseCurve(0, 0, epDist, epDist * 0.95, 0, Math.PI * 2, false, 0);
            const epPts = epCurve.getPoints(80);
            const epLine = new THREE.Line(
              new THREE.BufferGeometry().setFromPoints(epPts.map(pt => new THREE.Vector3(pt.x, 0, pt.y))),
              new THREE.LineBasicMaterial({ color: 0x6D28F5, transparent: true, opacity: 0.15 })
            );
            epLine.rotation.x = Math.PI / 2;
            gGroup.add(epLine);

            solarPlanets.push({
              id: \`\${gSpec.id}-exo-\${ep}\`,
              name: \`\${gSpec.name} Exoplanet \${ep + 1}\`,
              pivot: epPivot,
              mesh: epMesh,
              rx: epDist,
              rz: epDist * 0.95,
              speed: (0.015 / Math.sqrt(epDist)) * 2,
              angle: Math.random() * Math.PI * 2,
              moons: []
            });
          }
        }

        scene.add(gGroup);
        allGalaxies.push({ group: gGroup, points: pSystem, spec: gSpec });
      });

      // 5. GOOGLE MAPS STYLE NAVIGATION, DOUBLE CLICK & INTERACTIVITY
      const targetLookAt = new THREE.Vector3(0, 0, 0);
      const currentLookAt = new THREE.Vector3(0, 0, 0);

      let spherical = { radius: 850, theta: Math.PI * 0.45, phi: Math.PI * 0.28 };
      let targetSpherical = { radius: 850, theta: Math.PI * 0.45, phi: Math.PI * 0.28 };

      let isDragging = false;
      let isPanning = false;
      let prevMousePos = { x: 0, y: 0 };
      let trackedObject = null;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Mouse Movements & 18px Cursor Tracking
      window.addEventListener('mousemove', (e) => {
        cursor.style.left = \`\${e.clientX}px\`;
        cursor.style.top = \`\${e.clientY}px\`;

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        // Hover raycast feedback
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(clickableObjects);
        if (hits.length > 0) {
          cursor.classList.add('hovering');
        } else {
          cursor.classList.remove('hovering');
        }

        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        if (isDragging) {
          trackedObject = null;
          targetSpherical.theta -= deltaX * 0.005;
          targetSpherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, targetSpherical.phi - deltaY * 0.005));
        } else if (isPanning) {
          trackedObject = null;
          const panSpeed = targetSpherical.radius * 0.0014;
          const forward = new THREE.Vector3().subVectors(camera.position, currentLookAt).normalize();
          const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
          const up = new THREE.Vector3().crossVectors(forward, right).normalize();

          targetLookAt.addScaledVector(right, deltaX * panSpeed);
          targetLookAt.addScaledVector(up, -deltaY * panSpeed);
        }

        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
      });

      window.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          isPanning = true;
        } else {
          isDragging = true;
        }
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
        isPanning = false;
      });

      // DOUBLE CLICK TO WARP JUMP INTO GALAXY OR PLANET
      window.addEventListener('dblclick', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(clickableObjects);

        if (hits.length > 0) {
          const hit = hits[0].object;
          if (hit.userData.type === 'galaxy') {
            targetLookAt.copy(hit.userData.spec.pos);
            targetSpherical.radius = 480 * hit.userData.spec.scale;
            card.style.opacity = '0';
          } else if (hit.userData.type === 'planet') {
            const p = solarPlanets.find(sp => sp.id === hit.userData.data.id);
            if (p) {
              trackedObject = p;
              targetSpherical.radius = p.id === 'EARTH' ? 18 : 28;
              card.style.opacity = '0';
            }
          } else if (hit.userData.type === 'sun') {
            trackedObject = null;
            targetLookAt.copy(hit.userData.spec.pos);
            targetSpherical.radius = 62;
            card.style.opacity = '0';
          }
        } else {
          // Double click on empty space resets to cluster view
          trackedObject = null;
          targetLookAt.set(0, 0, 0);
          targetSpherical.radius = 9500;
          card.style.opacity = '1';
        }
      });

      // Two-Finger Touch Navigation
      let touchStartDist = 0;
      let touchStartMid = { x: 0, y: 0 };

      window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMousePos.x = e.touches[0].clientX;
          prevMousePos.y = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          isPanning = true;
          touchStartDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          touchStartMid.x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          touchStartMid.y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        }
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
          const dx = e.touches[0].clientX - prevMousePos.x;
          const dy = e.touches[0].clientY - prevMousePos.y;
          targetSpherical.theta -= dx * 0.005;
          targetSpherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, targetSpherical.phi - dy * 0.005));
          prevMousePos.x = e.touches[0].clientX;
          prevMousePos.y = e.touches[0].clientY;
        } else if (e.touches.length === 2 && isPanning) {
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          const zoomFactor = dist / touchStartDist;
          targetSpherical.radius /= (zoomFactor * 0.05 + 0.95);
          targetSpherical.radius = Math.max(12, Math.min(32000, targetSpherical.radius));
          touchStartDist = dist;

          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const deltaX = midX - touchStartMid.x;
          const deltaY = midY - touchStartMid.y;
          const panSpeed = targetSpherical.radius * 0.0016;

          const forward = new THREE.Vector3().subVectors(camera.position, currentLookAt).normalize();
          const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
          const up = new THREE.Vector3().crossVectors(forward, right).normalize();

          targetLookAt.addScaledVector(right, deltaX * panSpeed);
          targetLookAt.addScaledVector(up, -deltaY * panSpeed);

          touchStartMid.x = midX;
          touchStartMid.y = midY;
        }
      }, { passive: false });

      window.addEventListener('touchend', () => {
        isDragging = false;
        isPanning = false;
      });

      // 100x LOGARITHMIC MOUSE WHEEL ZOOM
      window.addEventListener('wheel', (e) => {
        const factor = 1 + Math.abs(e.deltaY) * 0.0018;
        if (e.deltaY > 0) {
          targetSpherical.radius *= factor;
        } else {
          targetSpherical.radius /= factor;
        }
        targetSpherical.radius = Math.max(12, Math.min(32000, targetSpherical.radius));

        const cardOpacity = THREE.MathUtils.clamp((targetSpherical.radius - 500) / 300, 0, 1);
        card.style.opacity = cardOpacity.toString();
      }, { passive: false });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // 6. ANIMATION & RENDER LOOP
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (trackedObject) {
          const worldPos = new THREE.Vector3();
          trackedObject.mesh.getWorldPosition(worldPos);
          targetLookAt.copy(worldPos);
        }

        spherical.radius += (targetSpherical.radius - spherical.radius) * 0.08;
        spherical.theta += (targetSpherical.theta - spherical.theta) * 0.08;
        spherical.phi += (targetSpherical.phi - spherical.phi) * 0.08;
        currentLookAt.lerp(targetLookAt, 0.08);

        camera.position.x = currentLookAt.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        camera.position.y = currentLookAt.y + spherical.radius * Math.cos(spherical.phi);
        camera.position.z = currentLookAt.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.lookAt(currentLookAt);

        if (sunMeshRef) {
          sunMeshRef.rotation.y += 0.005;
        }

        solarPlanets.forEach((p) => {
          p.angle += p.speed;
          p.pivot.position.x = Math.cos(p.angle) * p.rx;
          p.pivot.position.z = Math.sin(p.angle) * p.rz;
          p.mesh.rotation.y += 0.02;

          p.moons.forEach((m) => {
            m.pivot.rotation.y += m.speed;
          });
        });

        allGalaxies.forEach((g, idx) => {
          g.points.rotation.y += delta * (0.04 / (idx * 0.2 + 1));
        });

        renderer.render(scene, camera);
      }

      animate();
    })();
  </script>
</body>
</html>`;
  }
}
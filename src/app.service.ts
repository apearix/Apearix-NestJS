import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Apearix APIs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet" />
    <style>
        :root {
            --color-background: #FFFFFF;
            --color-surface: #FAFAFC;
            --color-surface-alt: #F6F7FB;
            --color-primary: #6D28F5;
            --color-primary-hover: #5B21E6;
            --color-primary-light: #F4F0FF;
            --color-heading: #111827;
            --color-body: #4B5563;
            --color-muted: #6B7280;
            --color-border: #E5E7EB;
            --color-border-accent: #DDD6FE;
            --color-border-subtle: rgba(0, 0, 0, 0.06);
            --color-brand-purple: #6D28F5;
            --color-accent-purple: #5B21E6;
            --color-glow: rgba(109, 40, 245, 0.15);
            --color-footer: #0F172A;
            --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--color-background);
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            color: var(--color-body);
            overflow: hidden;
            position: relative;
        }

        /* Ambient animated glow background */
        .glow-orb {
            position: absolute;
            width: 520px;
            height: 520px;
            background: radial-gradient(circle, var(--color-glow) 0%, rgba(255, 255, 255, 0) 70%);
            border-radius: 50%;
            filter: blur(60px);
            z-index: 0;
            pointer-events: none;
            animation: float 10s ease-in-out infinite alternate;
        }

        @keyframes float {
            0% {
                transform: translate(-30px, -20px) scale(0.95);
            }

            100% {
                transform: translate(30px, 30px) scale(1.1);
            }
        }

        #bubbles-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        /* Main Title container and typography */
        .content-container {
            position: relative;
            z-index: 2;
            text-align: center;
            user-select: none;
            pointer-events: auto;
        }

        .title {
            font-size: 8rem;
            font-weight: 700;
            letter-spacing: -0.03em;
            color: var(--color-heading);
            line-height: 1.2;
            margin: 0;
            transition: transform 0.3s ease;
        }

        .title span {
            background: linear-gradient(135deg, var(--color-brand-purple) 0%, var(--color-accent-purple) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Responsive preservation */
        @media (max-width: 1024px) {
            .title {
                font-size: 5rem;
            }
        }

        @media (max-width: 640px) {
            .title {
                font-size: 3.2rem;
            }
        }
    </style>
</head>

<body>
    <div class="glow-orb"></div>
    <canvas id="bubbles-canvas"></canvas>
    <div class="content-container">
        <h1 class="title">Hello <span>Apearix!</span></h1>
    </div>
    <script>
    (function () {
      const canvas = document.getElementById('bubbles-canvas');
      const ctx = canvas.getContext('2d');

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      // Track cursor position for smooth interactive repulsion
      const mouse = {
        x: -9999,
        y: -9999,
        radius: 120
      };

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      });

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      // Bubble particle constructor
      class Bubble {
        constructor() {
          this.reset(true);
        }

        reset(initial = false) {
          this.radius = Math.random() * 26 + 10;
          this.x = Math.random() * width;
          this.y = initial ? Math.random() * height : height + this.radius + Math.random() * 50;
          this.speedY = Math.random() * 0.9 + 0.5;
          this.wobbleSpeed = Math.random() * 0.025 + 0.012;
          this.wobbleDistance = Math.random() * 1.5 + 0.6;
          this.angle = Math.random() * Math.PI * 2;
          this.baseAlpha = Math.random() * 0.35 + 0.2;
          this.vx = 0;
          this.vy = 0;
        }

        update() {
          this.angle += this.wobbleSpeed;
          this.y -= this.speedY;
          this.x += Math.sin(this.angle) * this.wobbleDistance;

          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.vx += dirX * force * 1.2;
            this.vy += dirY * force * 1.2;
          }

          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.92;
          this.vy *= 0.92;

          if (this.y < -this.radius * 2) {
            this.reset(false);
          }
        }

        draw() {
          ctx.save();
          ctx.translate(this.x, this.y);

          const grad = ctx.createRadialGradient(
            -this.radius * 0.3,
            -this.radius * 0.35,
            this.radius * 0.1,
            0,
            0,
            this.radius
          );

          grad.addColorStop(0, 'rgba(255, 255, 255, ' + (this.baseAlpha * 1.2) + ')');
          grad.addColorStop(0.5, 'rgba(221, 214, 254, ' + (this.baseAlpha * 0.5) + ')');
          grad.addColorStop(0.95, 'rgba(109, 40, 245, ' + (this.baseAlpha * 0.7) + ')');
          grad.addColorStop(1, 'rgba(91, 33, 230, ' + (this.baseAlpha * 0.85) + ')');

          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(
            -this.radius * 0.38,
            -this.radius * 0.38,
            this.radius * 0.28,
            this.radius * 0.16,
            Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.min(1, this.baseAlpha + 0.4) + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, this.radius - 1, 0.4 * Math.PI, 0.9 * Math.PI);
          ctx.strokeStyle = 'rgba(167, 139, 250, ' + (this.baseAlpha * 0.9) + ')';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.restore();
        }
      }

      const bubbleCount = Math.floor(Math.min(width, height) / 28) + 25;
      const bubbles = Array.from({ length: bubbleCount }, () => new Bubble());

      function render() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < bubbles.length; i++) {
          bubbles[i].update();
          bubbles[i].draw();
        }
        requestAnimationFrame(render);
      }
      render();
    })();
  </script>
</body>
</html>`;
  }
}

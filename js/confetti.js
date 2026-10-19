/**
 * ConfettiEngine - High Performance Particle Physics Celebration
 * Diseñado con física de caída libre, resistencia aerodinámica, rotación 3D y partículas doradas.
 * 100% autónomo y offline sin dependencias externas.
 */

class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Paleta de gala: Dorado/Ámbar, Verde Esmeralda, Carmesí/Magenta, Azul ORI y Blanco
    this.colors = [
      '#fbbf24', '#f59e0b', '#d97706', // Oro / Ámbar
      '#10b981', '#059669', '#34d399', // Verde Esmeralda (Nivel Bajo)
      '#f43f5e', '#e11d48', '#fb7185', // Carmesí / Magenta (Nivel Difícil)
      '#3b82f6', '#60a5fa', '#2563eb', // Azul Institucional
      '#ffffff', '#f1f5f9', '#fef08a'  // Blanco y perla
    ];

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * Lanza un estallido festivo clásico desde un punto relativo (0 a 1)
   */
  burst(originX = 0.5, originY = 0.6, count = 120, spread = 75) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      count = 25;
    }

    const startX = originX * this.width;
    const startY = originY * this.height;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * (spread * Math.PI / 180) - Math.PI / 2;
      const speed = 12 + Math.random() * 20;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const isStar = Math.random() > 0.75;

      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed,
        gravity: 0.35 + Math.random() * 0.15,
        friction: 0.94,
        size: isStar ? 8 + Math.random() * 6 : 7 + Math.random() * 7,
        color: color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
        opacity: 1,
        decay: 0.007 + Math.random() * 0.006,
        shape: isStar ? 'star' : (Math.random() > 0.4 ? 'rect' : 'circle')
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  /**
   * Disparo doble simultáneo estilo cañones de concurso de TV
   */
  canonBurst() {
    this.burst(0.2, 0.85, 90, 60);
    this.burst(0.8, 0.85, 90, 60);
  }

  /**
   * Lluvia continua para la pantalla de Gran Final
   */
  startContinuousRain(durationMs = 8000) {
    const interval = setInterval(() => {
      this.burst(Math.random() * 0.8 + 0.1, -0.05, 30, 90);
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
    }, durationMs);
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  loop() {
    if (!this.particles.length) {
      this.isRunning = false;
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.height + 60) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.scale(Math.cos(p.wobble), 1);
      this.ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.shape === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, p.size, p.size * 0.45, p.color);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}

window.confettiEngine = new ConfettiEngine();

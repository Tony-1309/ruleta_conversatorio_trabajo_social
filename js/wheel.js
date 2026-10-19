/**
 * WheelEngine - Canvas TV Show Game Wheel con Apple Fluid Motion
 * Renderizado de alta fidelidad en HTML5 Canvas con soporte Retina (DPI 2x/3x),
 * luces perimetrales LED estilo estudio de televisión, física de desaceleración suave (4.5s),
 * aguja/puntero con física elástica de resorte (Spring Rebound) y manipulación táctil directa.
 */

class WheelEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    this.options = Object.assign({
      spinDuration: 4500, // 4.5 segundos según requerimiento
      totalLeds: 28,
      onSpinStart: () => {},
      onSpinEnd: () => {},
      onTick: (ratio) => {}
    }, options);

    this.currentAngle = 0; // Ángulo actual en radianes
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.items = []; // Lista de preguntas activas
    this.selectedItem = null;

    // Física de la aguja / flapper superior (Spring Oscillator)
    this.flapperAngle = 0;
    this.flapperVelocity = 0;
    this.lastPegIndex = -1;

    // Estado visual de los LEDs perimetrales
    this.ledOffset = 0;
    this.ledTimer = 0;

    // Dimensiones
    this.size = 640;
    this.centerX = 320;
    this.centerY = 320;
    this.radius = 280;

    // Soporte de interacción gestual directa (Apple Direct Manipulation)
    this.isDragging = false;
    this.dragStartAngle = 0;
    this.dragLastAngle = 0;
    this.dragVelocityTracker = [];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initGestures();

    // Ciclo de renderizado continuo sincronizado a la pantalla (CADisplayLink / requestAnimationFrame)
    this.renderLoop();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    // Contenedor responsivo
    const displaySize = Math.min(rect.width, window.innerHeight * 0.65, 680);
    this.size = Math.max(displaySize, 300);

    this.canvas.width = this.size * dpr;
    this.canvas.height = this.size * dpr;
    this.canvas.style.width = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.centerX = this.size / 2;
    this.centerY = this.size / 2;
    this.radius = (this.size / 2) * 0.88;

    this.draw();
  }

  setItems(items) {
    this.items = items;
    this.draw();
  }

  initGestures() {
    let pointerId = null;

    const getAngleFromEvent = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      return Math.atan2(y, x);
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.isSpinning) return;
      this.isDragging = true;
      pointerId = e.pointerId;
      this.canvas.setPointerCapture(pointerId);

      const angle = getAngleFromEvent(e);
      this.dragStartAngle = angle;
      this.dragLastAngle = angle;
      this.dragVelocityTracker = [{ angle, time: performance.now() }];
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isDragging || this.isSpinning) return;
      const angle = getAngleFromEvent(e);
      let delta = angle - this.dragLastAngle;

      // Normalizar saltos de cuadrante (-PI a PI)
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;

      this.currentAngle += delta;
      this.dragLastAngle = angle;

      // Registrar historial de velocidad para lanzamiento con inercia (Momentum Projection)
      const now = performance.now();
      this.dragVelocityTracker.push({ angle: this.currentAngle, time: now });
      if (this.dragVelocityTracker.length > 5) {
        this.dragVelocityTracker.shift();
      }

      this.checkPegCollision(delta);
    });

    const endDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (pointerId !== null) {
        try { this.canvas.releasePointerCapture(pointerId); } catch (err) {}
      }

      // Calcular velocidad de salida del gesto
      if (this.dragVelocityTracker.length >= 2) {
        const first = this.dragVelocityTracker[0];
        const last = this.dragVelocityTracker[this.dragVelocityTracker.length - 1];
        const dt = (last.time - first.time) / 1000;
        if (dt > 0.01) {
          const velocity = (last.angle - first.angle) / dt;
          if (Math.abs(velocity) > 2.5) {
            this.spinWithVelocity(velocity);
          }
        }
      }
    };

    this.canvas.addEventListener('pointerup', endDrag);
    this.canvas.addEventListener('pointercancel', endDrag);
  }

  /**
   * Giro libre con inercia física a partir del gesto de lanzamiento del usuario
   */
  spinWithVelocity(initialVelocity) {
    if (this.isSpinning || !this.items.length) return;
    this.isSpinning = true;
    this.options.onSpinStart();

    const startTime = performance.now();
    const duration = this.options.spinDuration;
    const startAngle = this.currentAngle;

    // Proyección de momento según fórmula de Apple: v * 0.998 / (1 - 0.998)
    const sign = Math.sign(initialVelocity);
    const extraTurns = Math.PI * 2 * (4 + Math.random() * 2);
    const targetDistance = Math.min(Math.abs(initialVelocity) * 1.5 + extraTurns, Math.PI * 2 * 12);
    const finalAngle = startAngle + targetDistance * sign;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva de desaceleración quíntica suave (Apple Quintic Out)
      const ease = 1 - Math.pow(1 - progress, 5);
      const prevAngle = this.currentAngle;
      this.currentAngle = startAngle + (finalAngle - startAngle) * ease;

      const deltaAngle = this.currentAngle - prevAngle;
      const speedRatio = 1 - progress;
      this.checkPegCollision(deltaAngle, speedRatio);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.resolveLandingItem();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Ejecuta el giro controlado hacia un elemento objetivo o seleccionado
   */
  spinTo(targetItem) {
    if (this.isSpinning || !this.items.length) return;

    this.isSpinning = true;
    this.selectedItem = targetItem;
    this.options.onSpinStart();

    const targetIndex = this.items.findIndex(it => it.id === targetItem.id);
    const validIndex = targetIndex !== -1 ? targetIndex : Math.floor(Math.random() * this.items.length);
    const numSegments = this.items.length;
    const segmentAngle = (Math.PI * 2) / numSegments;

    // Puntero en la parte superior: 270 grados (3 * PI / 2)
    const pointerAngle = 3 * Math.PI / 2;

    // Calcular el ángulo destino en el centro del segmento objetivo
    // needle = (currentAngle + segmentIndex * segAngle + segAngle / 2) % (2PI)
    const targetSegmentCenter = validIndex * segmentAngle + segmentAngle / 2;
    
    // Normalizar ángulo actual
    const currentNormalized = (this.currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    
    // Distancia necesaria para alinear con el puntero
    let neededRotation = pointerAngle - (currentNormalized + targetSegmentCenter);
    while (neededRotation < 0) {
      neededRotation += Math.PI * 2;
    }

    // 5 a 7 vueltas completas para emoción televisiva (4.5 segundos)
    const fullTurns = Math.PI * 2 * 6;
    const totalRotation = fullTurns + neededRotation;

    const startAngle = this.currentAngle;
    const finalAngle = startAngle + totalRotation;
    const startTime = performance.now();
    const duration = this.options.spinDuration;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva de desaceleración suave: 1 - (1 - t)^4.2
      const ease = 1 - Math.pow(1 - progress, 4.2);
      const prevAngle = this.currentAngle;
      this.currentAngle = startAngle + (finalAngle - startAngle) * ease;

      const deltaAngle = this.currentAngle - prevAngle;
      const speedRatio = 1 - progress;
      this.checkPegCollision(deltaAngle, speedRatio);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.currentAngle = finalAngle;
        this.isSpinning = false;
        this.resolveLandingItem();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Detecta colisión de clavijas perimetrales con el puntero superior y simula rebote elástico
   */
  checkPegCollision(deltaAngle, speedRatio = 1) {
    if (!this.items.length) return;

    const numSegments = this.items.length;
    const segmentAngle = (Math.PI * 2) / numSegments;

    // Puntero en la cúspide (3 * PI / 2)
    const pointerAngle = 3 * Math.PI / 2;
    const relativeAngle = (pointerAngle - this.currentAngle) % (Math.PI * 2);
    const positiveAngle = (relativeAngle + Math.PI * 2) % (Math.PI * 2);

    const currentPeg = Math.floor(positiveAngle / segmentAngle);

    if (currentPeg !== this.lastPegIndex) {
      this.lastPegIndex = currentPeg;

      // Deflexión de la aguja con fuerza proporcional a la velocidad
      const dir = Math.sign(deltaAngle) || 1;
      this.flapperAngle = -0.42 * dir * Math.max(0.3, speedRatio);
      this.flapperVelocity = 0;

      // Disparar audio sincronizado exactamente en este frame
      this.options.onTick(speedRatio);
    }
  }

  resolveLandingItem() {
    if (!this.items.length) return;

    const numSegments = this.items.length;
    const segmentAngle = (Math.PI * 2) / numSegments;
    const pointerAngle = 3 * Math.PI / 2;

    const relativeAngle = (pointerAngle - this.currentAngle) % (Math.PI * 2);
    const positiveAngle = (relativeAngle + Math.PI * 2) % (Math.PI * 2);
    const landedIndex = Math.floor(positiveAngle / segmentAngle) % numSegments;

    const landedItem = this.items[landedIndex];
    this.selectedItem = landedItem;
    this.options.onSpinEnd(landedItem);
  }

  renderLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.renderLoop());
  }

  update() {
    // Física del resorte de la aguja (Damped Harmonic Spring: f = -kx - cv)
    const springConstant = 0.28;
    const damping = 0.76;
    const force = -springConstant * this.flapperAngle;
    this.flapperVelocity = (this.flapperVelocity + force) * damping;
    this.flapperAngle += this.flapperVelocity;

    // Animación de luces LED perimetrales (chase lights)
    this.ledTimer++;
    const speed = this.isSpinning ? 0.35 : 0.04;
    this.ledOffset = (this.ledOffset + speed) % 1;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.size, this.size);

    if (!this.items || !this.items.length) {
      this.drawEmptyState();
      return;
    }

    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    // 1. Resplandor ambiental de fondo
    this.drawAmbientGlow();

    // 2. Anillo exterior dorado con bisel de estudio
    this.drawOuterChassis();

    // 3. Luces LED perimetrales
    this.drawPerimeterLeds();

    // 4. Cuerpo rotativo de la ruleta (segmentos y textos)
    this.ctx.save();
    this.ctx.rotate(this.currentAngle);
    this.drawSegments();
    this.drawPegs();
    this.ctx.restore();

    // 5. Cubo central decorativo (Hub ORI 2026)
    this.drawCenterHub();

    // 6. Aguja / Puntero superior con rebote físico
    this.drawFlapper();

    this.ctx.restore();
  }

  drawAmbientGlow() {
    const glowRadius = this.radius * 1.14;
    const glow = this.ctx.createRadialGradient(0, 0, this.radius * 0.8, 0, 0, glowRadius);
    glow.addColorStop(0, 'rgba(30, 58, 138, 0.45)');
    glow.addColorStop(0.7, 'rgba(251, 191, 36, 0.15)');
    glow.addColorStop(1, 'transparent');

    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawOuterChassis() {
    const outerR = this.radius + 18;

    // Sombra proyectada del chasis
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    this.ctx.shadowBlur = 28;
    this.ctx.shadowOffsetY = 12;

    // Anillo exterior metalizado
    const ringGrad = this.ctx.createLinearGradient(-outerR, -outerR, outerR, outerR);
    ringGrad.addColorStop(0, '#fef08a');
    ringGrad.addColorStop(0.25, '#d97706');
    ringGrad.addColorStop(0.5, '#fbbf24');
    ringGrad.addColorStop(0.75, '#b45309');
    ringGrad.addColorStop(1, '#fef08a');

    this.ctx.beginPath();
    this.ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    this.ctx.fillStyle = ringGrad;
    this.ctx.fill();
    this.ctx.restore();

    // Pista oscura interior donde reposan los LEDs
    const ledTrackR = this.radius + 4;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, ledTrackR, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0a1329';
    this.ctx.fill();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    this.ctx.stroke();
  }

  drawPerimeterLeds() {
    const total = this.options.totalLeds;
    const ledRadius = this.radius + 11;

    for (let i = 0; i < total; i++) {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.cos(angle) * ledRadius;
      const y = Math.sin(angle) * ledRadius;

      // Patrón de parpadeo dinámico
      const phase = (i / total + this.ledOffset) % 1;
      const isLit = Math.sin(phase * Math.PI * 2) > 0;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4.5, 0, Math.PI * 2);

      if (isLit) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#fbbf24';
        this.ctx.shadowBlur = 10;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawSegments() {
    const num = this.items.length;
    const arc = (Math.PI * 2) / num;

    // Paletas temáticas elegantes
    const colorsBajo = [
      { bg: '#065f46', text: '#ffffff', accent: '#10b981' },
      { bg: '#047857', text: '#ffffff', accent: '#34d399' },
      { bg: '#0f766e', text: '#ffffff', accent: '#2dd4bf' }
    ];

    const colorsDificil = [
      { bg: '#881337', text: '#ffffff', accent: '#f43f5e' },
      { bg: '#9f1239', text: '#ffffff', accent: '#fb7185' },
      { bg: '#991b1b', text: '#ffffff', accent: '#f87171' }
    ];

    for (let i = 0; i < num; i++) {
      const item = this.items[i];
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      const palette = item.level === 'dificil'
        ? colorsDificil[i % colorsDificil.length]
        : colorsBajo[i % colorsBajo.length];

      // Segmento de tarta con gradiente radial sutil para dar volumen
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, this.radius, startAngle, endAngle);
      this.ctx.closePath();

      const grad = this.ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius);
      grad.addColorStop(0, palette.bg);
      grad.addColorStop(1, this.darkenColor(palette.bg, 0.2));

      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Borde separador entre segmentos
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      this.ctx.stroke();

      // Pestaña luminosa en el borde exterior
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.radius - 2, startAngle, endAngle);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = palette.accent;
      this.ctx.stroke();
      this.ctx.restore();

      // Renderizar texto y número de pregunta
      this.drawSegmentText(item, startAngle + arc / 2, num);
    }
  }

  drawSegmentText(item, angle, totalSegments) {
    this.ctx.save();
    this.ctx.rotate(angle);
    this.ctx.translate(this.radius * 0.68, 0);

    // Ajuste tipográfico según cantidad de segmentos
    const fontSize = totalSegments > 24 ? 11 : (totalSegments > 16 ? 12 : 14);
    this.ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Sombra para máxima legibilidad
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    this.ctx.shadowBlur = 4;

    const label = `P#${item.id} · ${item.level === 'dificil' ? '🔴 RETO' : '🟢 BÁSICO'}`;
    this.ctx.fillText(label, 0, 0);

    this.ctx.restore();
  }

  drawPegs() {
    const num = this.items.length;
    const arc = (Math.PI * 2) / num;
    const pegDist = this.radius - 6;

    for (let i = 0; i < num; i++) {
      const angle = i * arc;
      const x = Math.cos(angle) * pegDist;
      const y = Math.sin(angle) * pegDist;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);

      const pegGrad = this.ctx.createRadialGradient(x - 1, y - 1, 1, x, y, 4);
      pegGrad.addColorStop(0, '#ffffff');
      pegGrad.addColorStop(0.4, '#fbbf24');
      pegGrad.addColorStop(1, '#78350f');

      this.ctx.fillStyle = pegGrad;
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawCenterHub() {
    const hubR = this.radius * 0.28;

    // Sombra profunda del botón central
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 18;
    this.ctx.shadowOffsetY = 6;

    // Bisel dorado exterior
    const goldGrad = this.ctx.createLinearGradient(-hubR, -hubR, hubR, hubR);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.3, '#fbbf24');
    goldGrad.addColorStop(0.7, '#d97706');
    goldGrad.addColorStop(1, '#fef08a');

    this.ctx.beginPath();
    this.ctx.arc(0, 0, hubR, 0, Math.PI * 2);
    this.ctx.fillStyle = goldGrad;
    this.ctx.fill();
    this.ctx.restore();

    // Centro oscuro estilo cristal zafiro
    const innerR = hubR * 0.84;
    const darkGrad = this.ctx.createRadialGradient(0, -hubR * 0.2, 0, 0, 0, innerR);
    darkGrad.addColorStop(0, '#1e3a8a');
    darkGrad.addColorStop(0.85, '#070d1e');
    darkGrad.addColorStop(1, '#020617');

    this.ctx.beginPath();
    this.ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    this.ctx.fillStyle = darkGrad;
    this.ctx.fill();

    // Reflejo especular superior Apple Glass
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.ellipse(0, -innerR * 0.45, innerR * 0.65, innerR * 0.28, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    this.ctx.fill();
    this.ctx.restore();

    // Tipografía central institucional
    this.ctx.save();
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.ctx.font = '800 17px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText('ORI', 0, -8);

    this.ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    this.ctx.fillStyle = '#93c5fd';
    this.ctx.letterSpacing = '1px';
    this.ctx.fillText('2026', 0, 10);

    this.ctx.restore();
  }

  drawFlapper() {
    // Puntero posicionado exactamente en el tope superior
    const flapperY = -this.radius - 2;

    this.ctx.save();
    this.ctx.translate(0, flapperY);
    this.ctx.rotate(this.flapperAngle);

    // Sombra del puntero
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    this.ctx.shadowBlur = 12;
    this.ctx.shadowOffsetY = 4;

    // Cuerpo de la aguja con forma triangular estilizada de concurso
    this.ctx.beginPath();
    this.ctx.moveTo(-16, -20);
    this.ctx.lineTo(16, -20);
    this.ctx.lineTo(0, 28);
    this.ctx.closePath();

    const ptrGrad = this.ctx.createLinearGradient(-16, -20, 16, 28);
    ptrGrad.addColorStop(0, '#fef08a');
    ptrGrad.addColorStop(0.3, '#fbbf24');
    ptrGrad.addColorStop(0.7, '#f59e0b');
    ptrGrad.addColorStop(1, '#b45309');

    this.ctx.fillStyle = ptrGrad;
    this.ctx.fill();

    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.stroke();

    // Eje de fijación superior
    this.ctx.beginPath();
    this.ctx.arc(0, -18, 7, 0, Math.PI * 2);
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#fbbf24';
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawEmptyState() {
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.stroke();

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.font = '700 18px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillText('¡Todas las preguntas respondidas!', 0, -10);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '500 13px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillText('Reinicia desde el panel de ajustes', 0, 18);

    this.ctx.restore();
  }

  darkenColor(hex, amount) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    let g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    let b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

// Exportación modular
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WheelEngine };
}

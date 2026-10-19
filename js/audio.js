/**
 * SoundEngine - Web Audio API Synthesizer
 * Síntesis sonora 100% en vivo mediante osciladores, filtros bipolares y envolventes de ganancia.
 * Cero dependencias externas y cero archivos de audio descargados.
 * Diseñado bajo principios de Apple Design: latencia cero, causalidad armónica e interacción táctil.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.isInitialized = false;

    // Cargar preferencia persistente
    try {
      const savedMute = localStorage.getItem('ori_sound_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
    } catch (e) {
      console.warn('LocalStorage no disponible para audio:', e);
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.isInitialized = true;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('ori_sound_muted', this.muted);
    } catch (e) {}
    return this.muted;
  }

  setMute(state) {
    this.muted = Boolean(state);
    try {
      localStorage.setItem('ori_sound_muted', this.muted);
    } catch (e) {}
  }

  /**
   * Clic percusivo mecánico y elástico para cada clavija que cruza el puntero.
   */
  playTick(velocityRatio = 1) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Rango dinámico y tono que responde a la velocidad del giro
    const baseFreq = 780 + Math.random() * 60 + velocityRatio * 220;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(3.8, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);

    // Micro transitorio de impacto (ruido de aguja)
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.006);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.006);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  /**
   * Efecto de suspenso y revelación cinematográfica de TV show al abrir la tarjeta
   */
  playQuestionReveal() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [220, 277.18, 329.63, 440, 554.37]; // La menor / acorde místico TV
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.8, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.25 + i * 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(2600, t + 0.6);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.15 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.0);
    });
  }

  /**
   * Pulso suave de reloj durante la cuenta regresiva de 15 segundos
   */
  playTimerTick(isUrgent = false) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isUrgent ? 880 : 520;
    osc.frequency.setValueAtTime(freq, t);

    const volume = isUrgent ? 0.14 : 0.08;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isUrgent ? 0.09 : 0.06));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Fanfarria triunfal de concurso de TV al entregar premio
   */
  playWinFanfare() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Secuencia triunfal en Do Mayor con brillo de metales
    const fanfareNotes = [
      { note: 523.25, start: 0.0, dur: 0.16 }, // C5
      { note: 659.25, start: 0.15, dur: 0.16 }, // E5
      { note: 783.99, start: 0.30, dur: 0.18 }, // G5
      { note: 1046.50, start: 0.46, dur: 0.55 }, // C6
      { note: 880.00, start: 0.75, dur: 0.18 }, // A5
      { note: 1046.50, start: 0.95, dur: 0.85 }  // C6 sostenido final
    ];

    fanfareNotes.forEach(({ note, start, dur }) => {
      const startTime = t + start;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(note, startTime);
      osc2.frequency.setValueAtTime(note * 1.002, startTime); // Sutil desafinación corifea

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + dur + 0.05);
      osc2.stop(startTime + dur + 0.05);
    });
  }

  /**
   * Zumbador grave y estridente de concurso ("Buzzer") para respuesta incorrecta
   */
  playWrongBuzzer() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Intervalo disonante de tritono en registro grave
    osc1.frequency.setValueAtTime(130.81, t); // C3
    osc2.frequency.setValueAtTime(185.00, t); // F#3

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, t);

    // Dos pulsos rápidos típicos de TV show: BEEP - BEEP
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    gain.gain.setValueAtTime(0.2, t + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.6);
  }

  /**
   * Clic táctil de botón UI estilo Apple (retroalimentación instantánea al pulsar)
   */
  playTap() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.025);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }
}

// Instancia singleton compartida
window.soundEngine = new SoundEngine();

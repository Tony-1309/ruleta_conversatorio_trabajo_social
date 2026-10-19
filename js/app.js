/**
 * Application Controller - ¡La Ruleta Sin Fronteras!
 * ORI Universidad Mariana 2026
 * 
 * Orquesta el estado global, sincronización de audio, cronómetro de 15s,
 * modales fluidos estilo Apple con retroalimentación inmediata y pantalla de Gran Final.
 */

class AppController {
  constructor() {
    this.storageKey = 'ori_ruleta_state_v2';

    // Estado inicial por defecto
    this.state = {
      prizesBajo: 4,
      prizesDificil: 2,
      selectedCasa: 'Casa San Francisco', // 'Casa San Francisco' o 'Casa Santa Clara'
      mode: 'mixto', // 'bajo' | 'dificil' | 'mixto'
      usedQuestionIds: [],
      wonHistory: [],
      mixedQuestionOrder: []
    };

    this.currentQuestion = null;
    this.timerInterval = null;
    this.timerSeconds = 15;
    this.isTimerPaused = false;
    this.isSpinning = false;
    this.answerRevealed = false;

    this.loadState();
    this.initElements();
    this.initWheel();
    this.bindEvents();
    this.renderHUD();
    this.updateWheelItems();
    this.checkGrandFinaleAuto();
  }

  generateMixedQuestionOrder() {
    // Tomar preguntas por nivel
    const bajoQuestions = QUESTIONS_DATA.filter(q => q.level === 'bajo');
    const dificilQuestions = QUESTIONS_DATA.filter(q => q.level === 'dificil');

    // Mezclar aleatoriamente dentro de cada categoría (Fisher-Yates)
    const shuffle = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const shuffledBajo = shuffle(bajoQuestions);
    const shuffledDificil = shuffle(dificilQuestions);

    // Intercalar de forma perfectamente equilibrada alrededor de los 360° de la ruleta (🟢 y 🔴 alternados)
    const interleaved = [];
    const ratio = shuffledBajo.length / shuffledDificil.length; // 22 / 14 ≈ 1.571
    let acc = ratio / 2;
    let bIdx = 0;
    let dIdx = 0;

    while (bIdx < shuffledBajo.length || dIdx < shuffledDificil.length) {
      if (bIdx < shuffledBajo.length && (dIdx >= shuffledDificil.length || acc < ratio)) {
        interleaved.push(shuffledBajo[bIdx++].id);
        acc += 1;
      } else if (dIdx < shuffledDificil.length) {
        interleaved.push(shuffledDificil[dIdx++].id);
        acc -= ratio;
      } else {
        interleaved.push(shuffledBajo[bIdx++].id);
      }
    }

    return interleaved;
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = Object.assign(this.state, parsed);
      }
    } catch (e) {
      console.warn('Error al cargar estado de ruleta:', e);
    }

    // Asegurar que exista un orden mixto de preguntas intercaladas y distribuido homogéneamente
    if (!this.state.mixedQuestionOrder || this.state.mixedQuestionOrder.length !== QUESTIONS_DATA.length) {
      this.state.mixedQuestionOrder = this.generateMixedQuestionOrder();
      this.saveState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error al guardar estado de ruleta:', e);
    }
    this.renderHUD();
  }

  initElements() {
    // Ruleta y escenario
    this.canvas = document.getElementById('wheel-canvas');
    this.spinBtn = document.getElementById('spin-btn');
    this.centerSpinTrigger = document.getElementById('center-spin-trigger');

    // Selector de Modo
    this.btnModeBajo = document.getElementById('mode-bajo');
    this.btnModeDificil = document.getElementById('mode-dificil');
    this.btnModeMixto = document.getElementById('mode-mixto');

    // HUD Superior
    this.hudTotalPrizes = document.getElementById('hud-total-prizes');
    this.hudSlotsBajo = document.getElementById('hud-slots-bajo');
    this.hudSlotsDificil = document.getElementById('hud-slots-dificil');
    this.hudCountBajo = document.getElementById('hud-count-bajo');
    this.hudCountDificil = document.getElementById('hud-count-dificil');
    this.hudCasaTag = document.getElementById('hud-casa-tag');

    // Botones de Cabecera
    this.btnMute = document.getElementById('btn-mute');
    this.btnSettings = document.getElementById('btn-settings');
    this.btnShortcuts = document.getElementById('btn-shortcuts');

    // Modal de Pregunta
    this.questionModal = document.getElementById('question-modal');
    this.modalLevelBadge = document.getElementById('modal-level-badge');
    this.modalCategory = document.getElementById('modal-category');
    this.modalTitle = document.getElementById('modal-title');
    this.modalQuestionText = document.getElementById('modal-question-text');
    this.modalAnswerBox = document.getElementById('modal-answer-box');
    this.modalAnswerText = document.getElementById('modal-answer-text');

    // Cronómetro
    this.timerDisplay = document.getElementById('timer-display');
    this.timerProgressBar = document.getElementById('timer-progress-bar');
    this.btnToggleTimer = document.getElementById('btn-toggle-timer');

    // Acciones del modal de pregunta
    this.btnRevealAnswer = document.getElementById('btn-reveal-answer');
    this.btnAwardWinner = document.getElementById('btn-award-winner');
    this.btnWrongAnswer = document.getElementById('btn-wrong-answer');
    this.btnDiscardQuestion = document.getElementById('btn-discard-question');
    this.btnCloseModal = document.getElementById('btn-close-modal');

    // Modal de Ajustes
    this.settingsModal = document.getElementById('settings-modal');
    this.selectCasa = document.getElementById('select-casa');
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.btnResetGame = document.getElementById('btn-reset-game');
    this.btnTriggerFinaleTest = document.getElementById('btn-trigger-finale-test');
    this.statsRemainingBajo = document.getElementById('stats-remaining-bajo');
    this.statsRemainingDificil = document.getElementById('stats-remaining-dificil');

    // Modal de Atajos
    this.shortcutsModal = document.getElementById('shortcuts-modal');
    this.btnCloseShortcuts = document.getElementById('btn-close-shortcuts');

    // Pantalla de Gran Final
    this.finaleOverlay = document.getElementById('finale-overlay');
    this.btnCloseFinale = document.getElementById('btn-close-finale');
  }

  initWheel() {
    if (!this.canvas) return;

    this.wheel = new WheelEngine(this.canvas, {
      spinDuration: 4500,
      totalLeds: 28,
      onSpinStart: () => {
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.spinBtn.classList.add('is-spinning');
        if (window.soundEngine) window.soundEngine.ensureContext();
      },
      onTick: (ratio) => {
        if (window.soundEngine) {
          window.soundEngine.playTick(ratio);
        }
      },
      onSpinEnd: (landedQuestion) => {
        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.spinBtn.classList.remove('is-spinning');
        this.showQuestionModal(landedQuestion);
      }
    });
  }

  bindEvents() {
    // Giro maestro por botón y trigger central
    this.spinBtn.addEventListener('click', () => this.executeSpin());
    if (this.centerSpinTrigger) {
      this.centerSpinTrigger.addEventListener('click', () => this.executeSpin());
    }

    // Selector de Modo
    this.btnModeBajo.addEventListener('click', () => this.setMode('bajo'));
    this.btnModeDificil.addEventListener('click', () => this.setMode('dificil'));
    this.btnModeMixto.addEventListener('click', () => this.setMode('mixto'));

    // Botones de Cabecera
    this.btnMute.addEventListener('click', () => this.toggleAudioMute());
    this.btnSettings.addEventListener('click', () => this.openModal(this.settingsModal));
    this.btnShortcuts.addEventListener('click', () => this.openModal(this.shortcutsModal));

    // Cierres de Modales
    this.btnCloseSettings.addEventListener('click', () => this.closeModal(this.settingsModal));
    this.btnCloseShortcuts.addEventListener('click', () => this.closeModal(this.shortcutsModal));
    this.btnCloseModal.addEventListener('click', () => this.closeQuestionModal());
    if (this.btnCloseFinale) {
      this.btnCloseFinale.addEventListener('click', () => this.closeModal(this.finaleOverlay));
    }

    // Cambio de Casa ORI en Ajustes
    this.selectCasa.value = this.state.selectedCasa;
    this.selectCasa.addEventListener('change', (e) => {
      this.state.selectedCasa = e.target.value;
      this.saveState();
      this.renderHUD();
      if (window.soundEngine) window.soundEngine.playTap();
    });

    // Acciones del modal de Pregunta
    this.btnRevealAnswer.addEventListener('click', () => this.revealAnswer());
    this.btnAwardWinner.addEventListener('click', () => this.awardPrize());
    this.btnWrongAnswer.addEventListener('click', () => this.handleWrongAnswer());
    if (this.btnDiscardQuestion) {
      this.btnDiscardQuestion.addEventListener('click', () => this.discardCurrentQuestion());
    }
    this.btnToggleTimer.addEventListener('click', () => this.toggleTimer());

    // Ajustes y Reinicio
    this.btnResetGame.addEventListener('click', () => this.confirmResetGame());
    this.btnTriggerFinaleTest.addEventListener('click', () => {
      this.closeModal(this.settingsModal);
      this.triggerGrandFinale();
    });

    // Atajos de Teclado del Operador (Global Keyboard Shortcuts)
    window.addEventListener('keydown', (e) => this.handleKeyboardShortcut(e));

    // Cerrar modales con clic en el fondo oscuro translúcido
    [this.questionModal, this.settingsModal, this.shortcutsModal, this.finaleOverlay].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
          if (modal === this.questionModal) {
            this.stopTimer();
          }
        }
      });
    });
  }

  handleKeyboardShortcut(e) {
    // Si el usuario está interactuando con un campo de formulario o select, no capturar
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;

    // Espacio: Girar ruleta
    if (key === ' ' || e.code === 'Space') {
      if (!this.isAnyModalOpen() && !this.isSpinning) {
        e.preventDefault();
        this.executeSpin();
      }
      return;
    }

    // Tecla 1: Modo Bajo
    if (key === '1') {
      if (!this.isAnyModalOpen()) {
        e.preventDefault();
        this.setMode('bajo');
      }
      return;
    }

    // Tecla 2: Modo Difícil
    if (key === '2') {
      if (!this.isAnyModalOpen()) {
        e.preventDefault();
        this.setMode('dificil');
      }
      return;
    }

    // Tecla 3: Modo Mixto
    if (key === '3') {
      if (!this.isAnyModalOpen()) {
        e.preventDefault();
        this.setMode('mixto');
      }
      return;
    }

    // Atajos con el Modal de Pregunta Activo
    if (this.questionModal && this.questionModal.classList.contains('is-open')) {
      if (key === 'r' || key === 'R') {
        e.preventDefault();
        this.revealAnswer();
      } else if (key === 'g' || key === 'G') {
        e.preventDefault();
        this.awardPrize();
      } else if (key === 'b' || key === 'B') {
        e.preventDefault();
        this.handleWrongAnswer();
      } else if (key === 'p' || key === 'P') {
        e.preventDefault();
        this.discardCurrentQuestion();
      } else if (key === 't' || key === 'T') {
        e.preventDefault();
        this.toggleTimer();
      } else if (key === 'Escape') {
        e.preventDefault();
        this.closeQuestionModal();
      }
      return;
    }

    // Mute con M
    if (key === 'm' || key === 'M') {
      e.preventDefault();
      this.toggleAudioMute();
      return;
    }

    // Escape para cerrar cualquier modal abierto
    if (key === 'Escape') {
      if (this.settingsModal.classList.contains('is-open')) this.closeModal(this.settingsModal);
      if (this.shortcutsModal.classList.contains('is-open')) this.closeModal(this.shortcutsModal);
      if (this.finaleOverlay && this.finaleOverlay.classList.contains('is-open')) this.closeModal(this.finaleOverlay);
    }
  }

  isAnyModalOpen() {
    return (
      this.questionModal.classList.contains('is-open') ||
      this.settingsModal.classList.contains('is-open') ||
      this.shortcutsModal.classList.contains('is-open') ||
      (this.finaleOverlay && this.finaleOverlay.classList.contains('is-open'))
    );
  }

  setMode(mode) {
    this.state.mode = mode;
    this.saveState();
    this.updateModeButtonsUI();
    this.updateWheelItems();
    if (window.soundEngine) window.soundEngine.playTap();
  }

  updateModeButtonsUI() {
    [this.btnModeBajo, this.btnModeDificil, this.btnModeMixto].forEach(b => b.classList.remove('is-selected'));
    if (this.state.mode === 'bajo') this.btnModeBajo.classList.add('is-selected');
    else if (this.state.mode === 'dificil') this.btnModeDificil.classList.add('is-selected');
    else this.btnModeMixto.classList.add('is-selected');
  }

  getAvailableQuestions(levelFilter = null) {
    return QUESTIONS_DATA.filter(q => {
      const isUsed = this.state.usedQuestionIds.includes(q.id);
      if (isUsed) return false;
      if (levelFilter) return q.level === levelFilter;
      return true;
    });
  }

  updateWheelItems() {
    let pool = [];
    const availableBajo = this.getAvailableQuestions('bajo');
    const availableDificil = this.getAvailableQuestions('dificil');

    if (this.state.mode === 'bajo') {
      pool = availableBajo.length ? availableBajo : availableDificil;
    } else if (this.state.mode === 'dificil') {
      pool = availableDificil.length ? availableDificil : availableBajo;
    } else {
      // Modo mixto: utiliza el orden intercalado y mezclado uniforme alrededor de toda la ruleta
      if (!this.state.mixedQuestionOrder || this.state.mixedQuestionOrder.length !== QUESTIONS_DATA.length) {
        this.state.mixedQuestionOrder = this.generateMixedQuestionOrder();
        this.saveState();
      }

      pool = this.state.mixedQuestionOrder
        .map(id => QUESTIONS_DATA.find(q => q.id === id))
        .filter(q => q && !this.state.usedQuestionIds.includes(q.id));
    }

    if (this.wheel) {
      this.wheel.setItems(pool);
    }

    // Actualizar estadísticas en el panel de configuración
    if (this.statsRemainingBajo) {
      this.statsRemainingBajo.textContent = `${availableBajo.length} / 22`;
    }
    if (this.statsRemainingDificil) {
      this.statsRemainingDificil.textContent = `${availableDificil.length} / 14`;
    }
  }

  executeSpin() {
    if (this.isSpinning) return;

    // Verificar si quedan premios
    const totalRemaining = this.state.prizesBajo + this.state.prizesDificil;
    if (totalRemaining <= 0) {
      this.triggerGrandFinale();
      return;
    }

    // Determinar categoría a seleccionar
    let targetLevel = null;
    if (this.state.mode === 'bajo') {
      targetLevel = this.state.prizesBajo > 0 ? 'bajo' : 'dificil';
    } else if (this.state.mode === 'dificil') {
      targetLevel = this.state.prizesDificil > 0 ? 'dificil' : 'bajo';
    } else {
      // Modo mixto automático: prioriza de acuerdo a la proporción de premios restantes
      if (this.state.prizesBajo > 0 && this.state.prizesDificil > 0) {
        targetLevel = Math.random() < 0.65 ? 'bajo' : 'dificil';
      } else if (this.state.prizesBajo > 0) {
        targetLevel = 'bajo';
      } else {
        targetLevel = 'dificil';
      }
    }

    let candidates = this.getAvailableQuestions(targetLevel);
    if (!candidates.length) {
      // Si no quedan de ese nivel, usar cualquier pregunta disponible
      candidates = this.getAvailableQuestions();
    }

    if (!candidates.length) {
      alert('¡Todas las 36 preguntas del conversatorio han sido utilizadas! Puedes reiniciar en el botón Ajustes.');
      return;
    }

    // Seleccionar aleatoriamente una pregunta candidata
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    this.wheel.spinTo(selected);
  }

  showQuestionModal(question) {
    this.currentQuestion = question;
    this.answerRevealed = false;

    // Configurar contenido
    const isDificil = question.level === 'dificil';
    this.modalLevelBadge.textContent = isDificil ? '🔴 NIVEL DIFÍCIL · RETO EXPERTO' : '🟢 NIVEL BAJO · BÁSICO';
    this.modalLevelBadge.className = `level-badge ${isDificil ? 'level-dificil' : 'level-bajo'}`;

    this.modalCategory.textContent = question.category || 'ORI Universidad Mariana';
    this.modalTitle.textContent = question.title;
    this.modalQuestionText.textContent = question.question;

    // Ocultar caja de respuesta inicialmente
    this.modalAnswerBox.classList.remove('is-revealed');
    this.modalAnswerText.textContent = '';
    this.btnRevealAnswer.style.display = 'inline-flex';

    // Abrir modal
    this.openModal(this.questionModal);

    // Audio de revelación
    if (window.soundEngine) {
      window.soundEngine.playQuestionReveal();
    }

    // Iniciar cronómetro de 15 segundos
    this.startTimer(15);
  }

  closeQuestionModal(discardQuestion = true) {
    if (this.currentQuestion && discardQuestion) {
      const qId = this.currentQuestion.id;
      if (!this.state.usedQuestionIds.includes(qId)) {
        this.state.usedQuestionIds.push(qId);
        this.saveState();
        this.updateWheelItems();
      }
    }
    this.stopTimer();
    this.closeModal(this.questionModal);
    this.currentQuestion = null;
  }

  discardCurrentQuestion() {
    if (!this.currentQuestion) return;
    const qId = this.currentQuestion.id;

    // Marcar pregunta como utilizada para que NO se vuelva a repetir en la ruleta (sin descontar premio)
    if (!this.state.usedQuestionIds.includes(qId)) {
      this.state.usedQuestionIds.push(qId);
    }

    this.saveState();
    this.updateWheelItems();
    this.stopTimer();

    if (window.soundEngine) {
      window.soundEngine.playTap();
    }

    this.closeModal(this.questionModal);
    this.currentQuestion = null;
  }

  revealAnswer() {
    if (!this.currentQuestion) return;
    this.answerRevealed = true;

    // Resolver dinámicamente si es la pregunta #20 de la Casa ORI
    const resolvedAnswer = getProcessedAnswer(this.currentQuestion, this.state.selectedCasa);
    this.modalAnswerText.textContent = resolvedAnswer;
    this.modalAnswerBox.classList.add('is-revealed');

    if (window.soundEngine) {
      window.soundEngine.playTap();
    }
  }

  awardPrize() {
    if (!this.currentQuestion) return;

    const level = this.currentQuestion.level;
    let awardedCategory = level;

    // Descontar premio según nivel
    if (level === 'bajo') {
      if (this.state.prizesBajo > 0) {
        this.state.prizesBajo--;
      } else if (this.state.prizesDificil > 0) {
        this.state.prizesDificil--;
        awardedCategory = 'dificil';
      }
    } else {
      if (this.state.prizesDificil > 0) {
        this.state.prizesDificil--;
      } else if (this.state.prizesBajo > 0) {
        this.state.prizesBajo--;
        awardedCategory = 'bajo';
      }
    }

    // Marcar pregunta como utilizada
    if (!this.state.usedQuestionIds.includes(this.currentQuestion.id)) {
      this.state.usedQuestionIds.push(this.currentQuestion.id);
    }

    // Guardar historial
    this.state.wonHistory.push({
      questionId: this.currentQuestion.id,
      level: awardedCategory,
      timestamp: new Date().toISOString()
    });

    this.saveState();
    this.updateWheelItems();
    this.stopTimer();

    // Celebración: Fanfarria de TV y Confeti
    if (window.soundEngine) {
      window.soundEngine.playWinFanfare();
    }
    if (window.confettiEngine) {
      window.confettiEngine.canonBurst();
    }

    // Cerrar modal tras breve pausa de emoción
    setTimeout(() => {
      this.closeQuestionModal();
      this.checkGrandFinaleAuto();
    }, 1800);
  }

  handleWrongAnswer() {
    // Sonido de error TV Buzzer
    if (window.soundEngine) {
      window.soundEngine.playWrongBuzzer();
    }

    // Animación de sacudida Apple Error
    const card = this.questionModal.querySelector('.modal-card');
    if (card) {
      card.classList.add('shake-error');
      setTimeout(() => card.classList.remove('shake-error'), 600);
    }
  }

  startTimer(seconds = 15) {
    this.stopTimer();
    this.timerSeconds = seconds;
    this.isTimerPaused = false;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.isTimerPaused) return;

      this.timerSeconds--;
      this.updateTimerDisplay();

      if (window.soundEngine) {
        window.soundEngine.playTimerTick(this.timerSeconds <= 3);
      }

      if (this.timerSeconds <= 0) {
        this.stopTimer();
        if (window.soundEngine) {
          window.soundEngine.playWrongBuzzer();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  toggleTimer() {
    this.isTimerPaused = !this.isTimerPaused;
    this.btnToggleTimer.textContent = this.isTimerPaused ? '▶️ Continuar' : '⏸️ Pausar';
    if (window.soundEngine) window.soundEngine.playTap();
  }

  updateTimerDisplay() {
    if (!this.timerDisplay || !this.timerProgressBar) return;
    this.timerDisplay.textContent = `${this.timerSeconds}s`;

    const percentage = (this.timerSeconds / 15) * 100;
    this.timerProgressBar.style.width = `${Math.max(0, percentage)}%`;

    if (this.timerSeconds <= 5) {
      this.timerProgressBar.style.backgroundColor = 'var(--color-dificil)';
    } else {
      this.timerProgressBar.style.backgroundColor = 'var(--color-gold)';
    }
  }

  renderHUD() {
    const totalRemaining = this.state.prizesBajo + this.state.prizesDificil;

    // Total en juego
    if (this.hudTotalPrizes) {
      this.hudTotalPrizes.textContent = `${totalRemaining} / 6`;
    }

    // Contadores
    if (this.hudCountBajo) this.hudCountBajo.textContent = this.state.prizesBajo;
    if (this.hudCountDificil) this.hudCountDificil.textContent = this.state.prizesDificil;

    // Etiquetas de Casa ORI
    if (this.hudCasaTag) {
      this.hudCasaTag.textContent = this.state.selectedCasa;
    }

    // Renderizar iconos de premios Nivel Bajo (4 slots)
    if (this.hudSlotsBajo) {
      this.hudSlotsBajo.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        const isRemaining = i < this.state.prizesBajo;
        slot.className = `prize-pill ${isRemaining ? 'is-active bajo' : 'is-claimed'}`;
        slot.title = isRemaining ? 'Premio Nivel Bajo disponible' : 'Premio Nivel Bajo entregado';
        slot.innerHTML = isRemaining ? '🎁' : '✓';
        this.hudSlotsBajo.appendChild(slot);
      }
    }

    // Renderizar iconos de premios Nivel Difícil (2 slots)
    if (this.hudSlotsDificil) {
      this.hudSlotsDificil.innerHTML = '';
      for (let i = 0; i < 2; i++) {
        const slot = document.createElement('div');
        const isRemaining = i < this.state.prizesDificil;
        slot.className = `prize-pill ${isRemaining ? 'is-active dificil' : 'is-claimed'}`;
        slot.title = isRemaining ? 'Trofeo Nivel Difícil disponible' : 'Trofeo Nivel Difícil entregado';
        slot.innerHTML = isRemaining ? '🏆' : '✓';
        this.hudSlotsDificil.appendChild(slot);
      }
    }

    this.updateModeButtonsUI();
  }

  toggleAudioMute() {
    if (!window.soundEngine) return;
    const isMuted = window.soundEngine.toggleMute();
    this.updateAudioButtonUI(isMuted);
  }

  updateAudioButtonUI(isMuted) {
    if (!this.btnMute) return;
    this.btnMute.innerHTML = isMuted
      ? '🔇 <span class="nav-label">Silenciado</span>'
      : '🔊 <span class="nav-label">Audio</span>';
    this.btnMute.classList.toggle('is-muted', isMuted);
  }

  checkGrandFinaleAuto() {
    const totalRemaining = this.state.prizesBajo + this.state.prizesDificil;
    if (totalRemaining <= 0) {
      setTimeout(() => {
        this.triggerGrandFinale();
      }, 1000);
    }
  }

  triggerGrandFinale() {
    this.openModal(this.finaleOverlay);
    if (window.soundEngine) {
      window.soundEngine.playWinFanfare();
    }
    if (window.confettiEngine) {
      window.confettiEngine.startContinuousRain(8000);
    }
  }

  openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add('is-open');
    modalElement.setAttribute('aria-hidden', 'false');
  }

  closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('is-open');
    modalElement.setAttribute('aria-hidden', 'true');
  }

  confirmResetGame() {
    const ok = confirm('¿Estás seguro de reiniciar los 6 premios y habilitar nuevamente todas las 36 preguntas?');
    if (ok) {
      this.state.prizesBajo = 4;
      this.state.prizesDificil = 2;
      this.state.usedQuestionIds = [];
      this.state.wonHistory = [];
      this.state.mixedQuestionOrder = this.generateMixedQuestionOrder();
      this.saveState();
      this.updateWheelItems();
      this.closeModal(this.settingsModal);
      if (window.soundEngine) window.soundEngine.playTap();
      alert('¡El juego ha sido restablecido a su estado inicial de gala!');
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  // Sincronizar estado inicial del audio
  if (window.soundEngine && window.appController.btnMute) {
    window.appController.updateAudioButtonUI(window.soundEngine.muted);
  }
});

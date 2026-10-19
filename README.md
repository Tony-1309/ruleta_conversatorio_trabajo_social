# 🎡 ¡La Ruleta Sin Fronteras! – ORI Universidad Mariana 2026

Aplicación web interactiva, moderna y de alta fidelidad diseñada para el conversatorio institucional:
**"Aprender sin fronteras, crecer sin límites"**, organizado por la **Oficina de Relaciones Nacionales e Internacionales (ORI)** de la Universidad Mariana en San Juan de Pasto.

Diseñada bajo los principios de **Apple Design System** (WWDC Design Guidelines: latencia cero, translucidez jerárquica con materiales de vidrio, física elástica de resortes, manipulación gestual directa y tipografía óptica).

---

## 👥 Equipo Humano ORI e Invitados de Honor

### Equipo Organizador ORI
1. **Sofía Vallejos** ("Profe Sofi") – Directora de la ORI.
2. **Marcela** – Auxiliar Administrativa.
3. **Antony** – Auxiliar Administrativo.

### 4 Estudiantes Invitados de Movilidad Entrante
1. 🇨🇴 **Ana María Mercado Montes** (Colombia – Movilidad Nacional | Corporación Universitaria del Caribe CECAR a Trabajo Social).
2. 🇨🇱 **Luciana Andrea Valencia Guzmán** (Chile – Movilidad Internacional | Universidad de La Frontera UFRO a Terapia Ocupacional).
3. 🇵🇪 **Luz Celene Tello Fernández** (Perú – Movilidad Internacional | Universidad César Vallejo UCV a Psicología).
4. 🇲🇽 **Diego Navarrete Salmerón** (México – Movilidad Internacional | Universidad del Valle de Atemajac UNIVA a Mercadeo).

---

## 🏆 Sistema de Premiación en Vivo

Se entregan **6 premios en total**:
* 🟢 **4 Premios** para preguntas de **Nivel Bajo (Básico)**.
* 🔴 **2 Premios** para preguntas de **Nivel Difícil (Reto Experto)**.

---

## 🎯 Directriz Estricta: Sin Pistas en las Preguntas

Por indicación explícita, se han **eliminado por completo las pistas** tanto del banco de datos (`js/questions.js`) como de la interfaz de usuario:
* No existen textos de pistas en las tarjetas de preguntas.
* Las preguntas se muestran de forma limpia, clara y directa para el auditorio.
* La sede de la oficina ORI (Casa San Francisco o Casa Santa Clara) se selecciona dinámicamente desde el panel de **Ajustes (⚙️)** y actualiza la respuesta oficial de la pregunta #20.

---

## 🍏 Principios de Apple Design Implementados

1. **Respuesta Inmediata (Kill Latency):** Retroalimentación háptica y visual instantánea al pulsar botones (`:active` con escala `0.96` y feedback acústico sintetizado en el mismo milisegundo).
2. **Materiales y Translucidez (`backdrop-filter`):** Barra superior HUD flotante, control segmentado y tarjetas de preguntas con desenfoque de `24px`, saturación al `190%` y bisel de luz especular (`border-top: 1px solid rgba(255,255,255,0.22)`).
3. **Física de Resortes (Spring Motion):** Aguja superior y desaceleración basadas en el modelo de resorte amortiguado de Apple (`damping: 0.8`, `springConstant: 0.28`), logrando desaceleración orgánica de 4.5 segundos.
4. **Manipulación Directa y Proyección de Momento:** Se puede girar la ruleta haciendo clic en el botón maestro, en el cubo central, mediante la barra espaciadora o arrastrando y lanzando directamente el lienzo canvas con el puntero/dedo.
5. **Tipografía Óptica y Jerarquía:** Fuente del sistema Apple (`-apple-system, SF Pro Display, SF Pro Text`) con *tracking* negativo en titulares gigantes (`-0.025em`) y números tabulares en el cronómetro.
6. **Accesibilidad Total:** Soporte completo para `prefers-reduced-motion: reduce`, `prefers-reduced-transparency: reduce` y `prefers-contrast: more`.

---

## 🔊 Motor de Audio Web Audio API (Cero MP3s externos)

Clase `SoundEngine` autónoma sintetizada en vivo con osciladores y filtros bipolares:
* `playTick(ratio)`: Clic mecánico percusivo sincronizado al frame de impacto de la lengüeta.
* `playQuestionReveal()`: Riser armónico y dramático al desplegar la tarjeta de pregunta.
* `playTimerTick(isUrgent)`: Pulso de reloj durante los 15 segundos (acelera en los últimos 3 segundos).
* `playWinFanfare()`: Fanfarria triunfal polifónica de concurso de televisión al confirmar respuesta correcta.
* `playWrongBuzzer()`: Zumbador disonante grave tipo "buzzer" en caso de error o pase de turno.
* Botón de **Silenciar/Activar (Mute)** con memoria local (`localStorage`).

---

## ⌨️ Atajos de Teclado del Operador

| Tecla | Acción |
| :--- | :--- |
| <kbd>Espacio</kbd> | Girar la ruleta con física de 4.5s |
| <kbd>1</kbd> | Cambiar a modo **🟢 Nivel Bajo** |
| <kbd>2</kbd> | Cambiar a modo **🔴 Nivel Difícil** |
| <kbd>3</kbd> | Cambiar a **🎲 Modo Mixto Automático** |
| <kbd>R</kbd> | Revelar la respuesta oficial verificada |
| <kbd>G</kbd> | Confirmar respuesta correcta, entregar premio y lanzar confeti |
| <kbd>B</kbd> | Disparar buzzer de respuesta incorrecta / pasar turno |
| <kbd>T</kbd> | Pausar o reanudar el cronómetro de 15 segundos |
| <kbd>M</kbd> | Silenciar o reactivar el sonido |
| <kbd>Esc</kbd> | Cerrar tarjetas o paneles abiertos |

---

## 📦 Estructura del Proyecto

```
Conversatorio - Trabajo social 2/
├── index.html          # Estructura semántica, HUD, Canvas y modales
├── vercel.json         # Configuración de despliegue y cabeceras seguras
├── README.md           # Documentación completa del proyecto
├── css/
│   └── style.css       # Sistema de diseño Apple Fluid Interface & TV Show
└── js/
    ├── questions.js    # Banco oficial de 36 preguntas (sin pistas)
    ├── audio.js        # SoundEngine 100% sintetizado con Web Audio API
    ├── confetti.js     # ConfettiEngine 3D en Canvas sin dependencias
    ├── wheel.js        # WheelEngine Canvas con LEDs y física de resorte
    └── app.js          # Controlador central, atajos y gestión de estado
```

---

## 🚀 Despliegue en GitHub y Vercel

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: Ruleta Sin Fronteras ORI Universidad Mariana 2026 v2"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/ruleta-ori-mariana-2026.git
   git push -u origin main
   ```

2. **Desplegar en Vercel:**
   * Importa el repositorio directamente en [vercel.com](https://vercel.com).
   * Al ser un sitio estático puro (HTML/CSS/JS nativo), no requiere comandos de construcción (`build command` vacío).
   * Despliegue instantáneo con CDN global y soporte HTTPS.

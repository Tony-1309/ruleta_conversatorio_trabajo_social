### 📋 Prompt Maestro Actualizado para Antigravity 2.0 (con los 4 Invitados Nacionales e Internacionales y 36 Preguntas)

Copia y pega este bloque completo directamente en **Antigravity 2.0** para que construya la aplicación web de la ruleta con los nuevos participantes (**Ana María Mercado, Luciana Valencia, Luz Celene Tello y Diego Navarrete**), sus universidades de origen, programas académicos y las 36 preguntas actualizadas:

> **ROL Y CONTEXTO:**
> Actúa como un **Senior Creative Frontend Developer, Game Show UI/UX Designer y Web Audio API Engineer**. Necesito que construyas una aplicación web interactiva, ultra llamativa, 100% responsive (optimizada tanto para proyector panorámico 16:9 de auditorio como para pantallas móviles/tablets) llamada **"¡La Ruleta Sin Fronteras! – ORI Universidad Mariana 2026"**, lista para subirse a GitHub y desplegarse en Vercel.
> **OBJETIVO DEL JUEGO EN VIVO:**
> Esta ruleta será utilizada al final del conversatorio *"Aprender sin fronteras, crecer sin límites"* organizado por el equipo de la Oficina de Relaciones Nacionales e Internacionales – ORI (conformado por 3 personas: la Directora Sofía Vallejos "Profe Sofi", la auxiliar administrativa Marcela y el auxiliar administrativo Antony), junto a los 4 estudiantes invitados de movilidad entrante nacional e internacional:
> 1. **Ana María Mercado Montes** (Colombia 🇨🇴 – Movilidad Nacional | Viene de la Corporación Universitaria del Caribe CECAR al programa de Trabajo Social).
> 2. **Luciana Andrea Valencia Guzmán** (Chile 🇨🇱 – Movilidad Internacional | Viene de la Universidad de La Frontera UFRO al programa de Terapia Ocupacional).
> 3. **Luz Celene Tello Fernández** (Perú 🇵🇪 – Movilidad Internacional | Viene de la Universidad César Vallejo UCV al programa de Psicología).
> 4. **Diego Navarrete Salmerón** (México 🇲🇽 – Movilidad Internacional | Viene de la Universidad del Valle de Atemajac UNIVA al programa de Mercadeo).
> 
> 
> Se van a entregar **6 PREMIOS EN TOTAL** al público asistente:
> * **4 Premios** para preguntas de **Nivel Bajo (Básico)**.
> * **2 Premios** para preguntas de **Nivel Difícil (Reto Experto)**.
> 
> 
> **REQUERIMIENTOS VISUALES Y DE DISEÑO (UI/UX):**
> 1. **Estética TV Show Institucional:** Fondo oscuro elegante con degradados vibrantes en azul institucional profundo (`#0a192f`, `#1e3a8a`), detalles en dorado/ámbar (`#fbbf24`) para los premios, verde esmeralda (`#10b981`) para Nivel Bajo y rojo/magenta energético (`#f43f5e`) para Nivel Difícil.
> 2. **Marcador de Premios en Tiempo Real (Header / HUD):**
> * Contador visual de **Premios Nivel Bajo: 4 restantes** (con íconos de regalo/trofeo que se iluminan o marcan al entregarse).
> * Contador visual de **Premios Nivel Difícil: 2 restantes** (con íconos de trofeo dorado especial).
> * Contador Total: **6 Premios en Juego**.
> * Tarjeta o barra inferior discreta que muestre las banderas e insignias de nuestros 4 invitados: 🇨🇴 Colombia (CECAR - Trabajo Social), 🇨🇱 Chile (UFRO - Terapia Ocupacional), 🇵🇪 Perú (UCV - Psicología) y 🇲🇽 México (UNIVA - Mercadeo).
> * Botón de configuración rápida (ícono de engranaje) para seleccionar la Casa donde se ubica la ORI (Casa San Francisco o Casa Santa Clara) y que se actualice dinámicamente en la pregunta #20.
> 
> 
> 3. **Selector de Modo de Giro:**
> * Permitir elegir antes de girar: **"Girar Nivel Bajo (🟢)"**, **"Girar Nivel Difícil (🔴)"** o **"Modo Mixto Automático"** (que elige automáticamente según los premios que aún quedan disponibles).
> 
> 
> 4. **Ruleta Animada en HTML5 Canvas:**
> * Rueda con segmentos coloridos, textos legibles, luces perimetrales parpadeantes estilo estudio de televisión y física de desaceleración suave de 4.5 segundos.
> * Puntero superior con animación de rebote físico al pasar cada casilla.
> 
> 
> 5. **Modal / Tarjeta de Pregunta en Pantalla Gigante:**
> * Al detenerse la ruleta, abre con animación dramática una tarjeta grande con:
> * Etiqueta del nivel (**🟢 NIVEL BAJO** o **🔴 NIVEL DIFÍCIL**).
> * Cronómetro interactivo de 15 segundos en pantalla para darle emoción al público.
> * Texto de la pregunta en tipografía gigante para que todo el auditorio pueda leerla.
> * Botón **"👁️ Revelar Respuesta Correcta"** (oculta inicialmente para no dar spoiler).
> * Botón **"🏆 ¡Respuesta Correcta! Entregar Premio"** (descuenta 1 premio de la categoría correspondiente, elimina la pregunta para que no vuelva a salir, dispara lluvia de confeti con `canvas-confetti` y reproduce fanfarria de victoria).
> * Botón **"❌ Respuesta Incorrecta / Pasar Turno"** (reproduce sonido de error y permite que otro estudiante responda o volver a girar sin descontar el premio).
> 
> 
> 
> 
> 6. **Pantalla de Gran Final:** Cuando se entreguen los 6 premios (0 restantes), botón para mostrar una pantalla épica de cierre con el lema: *"Aprender sin fronteras, crecer sin límites – Movilidad Nacional e Internacional ORI (Sofía Vallejos, Marcela y Antony – Universidad Mariana 2026)"*.
> 
> 
> **SISTEMA DE SONIDO OBLIGATORIO (100% WEB AUDIO API SINTETIZADO):**
> ¡NO uses archivos MP3 externos que puedan bloquearse o fallar! Crea una clase `SoundEngine` usando `window.AudioContext` que sintetice en vivo:
> * `playTick()`: Sonido percusivo corto cada vez que un segmento de la ruleta pasa por el puntero durante el giro.
> * `playQuestionReveal()`: Efecto de suspenso ascendente cuando aparece la pregunta en pantalla.
> * `playTimerTick()`: Pulso suave durante la cuenta regresiva.
> * `playWinFanfare()`: Acorde y arpegio triunfal brillante de concurso de TV cuando alguien gana un premio.
> * `playWrongBuzzer()`: Sonido grave tipo "buzzer" si el participante se equivoca.
> * Incluye un botón de **Mute/Unmute** visible en la esquina superior derecha.
> 
> 
> **ATAJOS DE TECLADO PARA EL OPERADOR:**
> * `Espacio`: Girar ruleta.
> * `1`: Cambiar a Nivel Bajo (🟢).
> * `2`: Cambiar a Nivel Difícil (🔴).
> * `R`: Revelar respuesta correcta cuando el modal está abierto.
> * `G`: Confirmar ganador y entregar premio.
> * `B`: Sonar buzzer de respuesta incorrecta.
> 
> 
> **BANCO DE DATOS JSON OBLIGATORIO (Incluir estas 36 preguntas exactas):**
> Incluye en el código las siguientes 22 preguntas de Nivel Bajo y 14 preguntas de Nivel Difícil:
> * **Nivel Bajo (22):**
> 1. "¿Cuál es el promedio acumulado mínimo que debe tener un estudiante de la Universidad Mariana para postularse a una movilidad saliente nacional o internacional?" -> Respuesta: "Un promedio acumulado SUPERIOR A 3.8."
> 2. "¿A partir de qué semestre académico pueden postularse los estudiantes de la Universidad Mariana para realizar su movilidad saliente?" -> Respuesta: "Desde CUARTO (4.º) SEMESTRE en adelante."
> 3. "¿Qué porcentaje de créditos académicos debe haber superado un estudiante para poder postularse a una movilidad saliente?" -> Respuesta: "Más del 50% de los créditos académicos aprobados."
> 4. "En cuanto a los antecedentes disciplinarios, ¿qué requisito debe cumplir un estudiante para hacer movilidad saliente?" -> Respuesta: "NO tener ningún llamado de atención disciplinario."
> 5. "¿Hasta qué mes tienen plazo los estudiantes de la Universidad Mariana para postularse a la convocatoria de movilidad académica?" -> Respuesta: "Hasta el mes de NOVIEMBRE."
> 6. "¿Qué significan las siglas ORI dentro de la Universidad Mariana?" -> Respuesta: "Oficina de Relaciones Nacionales e Internacionales."
> 7. "¿Cuántas personas conforman el equipo de la Oficina de Relaciones Nacionales e Internacionales (ORI)?" -> Respuesta: "3 personas: la directora Sofía Vallejos, la auxiliar administrativa Marcela y el auxiliar administrativo Antony."
> 8. "¿A qué programa académico de la Universidad Mariana pertenece nuestra invitada de movilidad nacional Ana María Mercado Montes y de qué universidad viene?" -> Respuesta: "Al programa de TRABAJO SOCIAL, y viene de la Corporación Universitaria del Caribe (CECAR) 🇨🇴."
> 9. "¿De qué país y de qué universidad nos visita nuestra invitada internacional Luciana Andrea Valencia Guzmán?" -> Respuesta: "De CHILE 🇨🇱, de la Universidad de La Frontera (UFRO)."
> 10. "¿En qué programa académico de la Universidad Mariana realiza su movilidad Luciana Andrea Valencia Guzmán?" -> Respuesta: "En el programa de TERAPIA OCUPACIONAL."
> 11. "¿De qué país y de qué universidad viene nuestra invitada internacional Luz Celene Tello Fernández?" -> Respuesta: "De PERÚ 🇵🇪, de la Universidad César Vallejo (UCV)."
> 12. "¿En qué programa académico de la Universidad Mariana está cursando su intercambio Luz Celene Tello Fernández?" -> Respuesta: "En el programa de PSICOLOGÍA."
> 13. "¿De qué país y de qué universidad nos visita nuestro invitado internacional Diego Navarrete Salmerón?" -> Respuesta: "De MÉXICO 🇲🇽, de la Universidad del Valle de Atemajac (UNIVA)."
> 14. "¿En qué programa académico de la Universidad Mariana está realizando su intercambio Diego Navarrete Salmerón?" -> Respuesta: "En el programa de MERCADEO."
> 15. "¿Cómo se llama la figura docente dentro de tu propio programa académico que te orienta inicialmente sobre movilidad nacional e internacional?" -> Respuesta: "El Líder de Internacionalización de programa o facultad."
> 16. "¿Cuáles son las siglas del permiso migratorio obligatorio para los estudiantes extranjeros que ingresan a la Universidad Mariana por estancias cortas?" -> Respuesta: "Permiso migratorio PID (o Visa Estudiantil según la duración)."
> 17. "Además de cursar un semestre académico, menciona UNA modalidad adicional de movilidad que puedes hacer con la ORI." -> Respuesta: "Pasantías internacionales, misiones académicas o estancia de investigación."
> 18. "¿Con cuántos convenios NACIONALES vigentes cuenta hoy la Universidad Mariana para hacer movilidad en Colombia?" -> Respuesta: "52 convenios nacionales vigentes."
> 19. "¿Con cuántos convenios INTERNACIONALES vigentes cuenta hoy la Universidad Mariana?" -> Respuesta: "69 convenios internacionales vigentes."
> 20. "¿En cuál de las dos casas (Casa San Francisco o Casa Santa Clara) se ubica la oficina de la ORI?" -> Respuesta: "Validar respuesta con la Profe Sofi según la Cápsula Global #3."
> 21. "¿Cómo se llama el programa de movilidad enfocado específicamente en estancias de investigación científica?" -> Respuesta: "El Programa DELFÍN."
> 22. "¿Qué documentos internos de la universidad es fundamental diligenciar a tiempo para postularse a una movilidad?" -> Respuesta: "Los formatos académicos de postulación."
> 
> 
> * **Nivel Difícil (14):**
> 23. "¡Reto de los 4 Requisitos Salientes! Menciona los CUATRO requisitos fundamentales que debe cumplir un estudiante de la Universidad Mariana para postularse a una movilidad saliente nacional o internacional." -> Respuesta: "1) Promedio acumulado superior a 3.8, 2) Más del 50% de créditos académicos, 3) Estar desde 4.º semestre en adelante y 4) No tener llamados de atención disciplinarios."
> 24. "¡Reto de Perfil Académico Saliente! Si un estudiante ya está en cuarto semestre y no tiene llamados de atención disciplinarios, ¿qué promedio acumulado exacto y qué porcentaje de créditos debe superar para postularse?" -> Respuesta: "Promedio acumulado superior a 3.8 y más del 50% de los créditos académicos."
> 25. "¡Reto Matemático Nacional e Internacional! Dinos cuántos convenios internacionales, cuántos nacionales y la suma total de convenios vigentes de la Universidad Mariana." -> Respuesta: "69 internacionales y 52 nacionales, para un total de 121 convenios vigentes."
> 26. "¡Reto de Becas y Programas! Menciona al menos TRES de los cinco programas estratégicos de movilidad y becas nombrados en la Cápsula #5." -> Respuesta: "3 entre: Programa PILA, Programa MARCA, Programa Delfín, Becas de Reciprocidad y Programa PIRI."
> 27. "¡Reto de Modalidades! Menciona las CUATRO modalidades de movilidad académica que puedes realizar a través de los 121 convenios de la ORI." -> Respuesta: "1) Semestre académico, 2) Pasantías internacionales, 3) Misiones académicas y 4) estancia de investigación."
> 28. "¡Reto Cuádruple de Invitados y Países! Dinos el nombre de nuestros cuatro estudiantes invitados de hoy y el país de origen de cada uno." -> Respuesta: "Ana María Mercado (Colombia 🇨🇴), Luciana Valencia (Chile 🇨🇱), Luz Celene Tello (Perú 🇵🇪) y Diego Navarrete (México 🇲🇽)."
> 29. "¡Reto de Programas en la U. Mariana! Menciona a qué programas académicos de la Universidad Mariana llegaron Ana María, Luciana, Celene y Diego." -> Respuesta: "Ana María a Trabajo Social, Luciana a Terapia Ocupacional, Celene a Psicología y Diego a Mercadeo."
> 30. "¡Reto de Universidades de Origen! Menciona el nombre de la universidad de origen de al menos TRES de nuestros cuatro invitados de hoy." -> Respuesta: "3 entre: Corporación Universitaria del Caribe – CECAR (Ana María), Universidad de La Frontera (Luciana), Universidad César Vallejo (Celene) y Universidad del Valle de Atemajac – UNIVA (Diego)."
> 31. "¡Reto de Movilidad Nacional! Dinos el nombre de nuestra invitada de movilidad nacional, de qué institución viene, a qué programa llegó en la U. Mariana y cuántos convenios nacionales tiene la ORI." -> Respuesta: "Ana María Mercado Montes, viene de CECAR, está en Trabajo Social y la ORI tiene 52 convenios nacionales."
> 32. "¡Reto de Siglas Latinoamericanas! ¿Cuál programa corresponde al Intercambio Académico Latinoamericano y cuál corresponde a programas acreditados del Mercosur?" -> Respuesta: "Programa PILA (Latinoamericano) y Programa MARCA (Mercosur)."
> 33. "¡Reto del Equipo ORI Completo! Dinos cuántas personas conforman el equipo de la ORI y menciona el nombre y rol de cada uno de sus 3 integrantes." -> Respuesta: "3 integrantes: la Directora Sofía Vallejos, la auxiliar administrativa Marcela y el auxiliar administrativo Antony."
> 34. "¡Reto Migratorio y de Convocatoria! Menciona las dos opciones de requisito migratorio para extranjeros Y el mes límite de postulación." -> Respuesta: "Permiso PID o Visa Estudiantil, y plazo límite hasta NOVIEMBRE."
> 35. "¡Reto de los 5 Programas! Menciona los CINCO programas de movilidad y apoyo que nombró la Profe Sofi en la Cápsula #5." -> Respuesta: "PILA, MARCA, Delfín, Becas de Reciprocidad y PIRI."
> 36. "¡Reto de Síntesis Global! Si un estudiante de cuarto semestre con promedio superior a 3.8 quiere irse de intercambio, ¿a quién debe acudir primero en su programa, con quiénes se asesora en la ORI y antes de qué mes debe postularse?" -> Respuesta: "1) Líder de Internacionalización, 2) En la ORI con Sofía Vallejos, Marcela o Antony, y 3) Antes de finalizar NOVIEMBRE."
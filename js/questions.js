/**
 * Banco Oficial de Preguntas - ORI Universidad Mariana 2026
 * Conversatorio: "Aprender sin fronteras, crecer sin límites"
 * 
 * Contiene las 36 preguntas exactas especificadas:
 * - 22 de Nivel Bajo (Básico) 🟢
 * - 14 de Nivel Difícil (Reto Experto) 🔴
 * 
 * Directriz estricta: NO contiene pistas en las preguntas (ni en datos ni en interfaz).
 * Incluye función para resolver dinámicamente la casa seleccionada (San Francisco o Santa Clara)
 * en la pregunta #20.
 */

const QUESTIONS_DATA = [
  // ==========================================
  // NIVEL BAJO (22 PREGUNTAS) 🟢
  // ==========================================
  {
    id: 1,
    level: 'bajo',
    title: 'Pregunta #1 · Promedio de Movilidad',
    question: '¿Cuál es el promedio acumulado mínimo que debe tener un estudiante de la Universidad Mariana para postularse a una movilidad saliente nacional o internacional?',
    answer: 'Un promedio acumulado SUPERIOR A 3.8.',
    category: 'Requisitos Académicos'
  },
  {
    id: 2,
    level: 'bajo',
    title: 'Pregunta #2 · Semestre de Postulación',
    question: '¿A partir de qué semestre académico pueden postularse los estudiantes de la Universidad Mariana para realizar su movilidad saliente?',
    answer: 'Desde CUARTO (4.º) SEMESTRE en adelante.',
    category: 'Requisitos Académicos'
  },
  {
    id: 3,
    level: 'bajo',
    title: 'Pregunta #3 · Créditos Académicos',
    question: '¿Qué porcentaje de créditos académicos debe haber superado un estudiante para poder postularse a una movilidad saliente?',
    answer: 'Más del 50% de los créditos académicos aprobados.',
    category: 'Requisitos Académicos'
  },
  {
    id: 4,
    level: 'bajo',
    title: 'Pregunta #4 · Antecedentes Disciplinarios',
    question: 'En cuanto a los antecedentes disciplinarios, ¿qué requisito debe cumplir un estudiante para hacer movilidad saliente?',
    answer: 'NO tener ningún llamado de atención disciplinario.',
    category: 'Convivencia y Ética'
  },
  {
    id: 5,
    level: 'bajo',
    title: 'Pregunta #5 · Mes Límite de Convocatoria',
    question: '¿Hasta qué mes tienen plazo los estudiantes de la Universidad Mariana para postularse a la convocatoria de movilidad académica?',
    answer: 'Hasta el mes de NOVIEMBRE.',
    category: 'Calendario y Convocatoria'
  },
  {
    id: 6,
    level: 'bajo',
    title: 'Pregunta #6 · Significado de la Sigla ORI',
    question: '¿Qué significan las siglas ORI dentro de la Universidad Mariana?',
    answer: 'Oficina de Relaciones Nacionales e Internacionales.',
    category: 'Identidad Institucional'
  },
  {
    id: 7,
    level: 'bajo',
    title: 'Pregunta #7 · Equipo Humano de la ORI',
    question: '¿Cuántas personas conforman el equipo de la Oficina de Relaciones Nacionales e Internacionales (ORI)?',
    answer: '3 personas: la directora Sofía Vallejos, la auxiliar administrativa Marcela y el auxiliar administrativo Antony.',
    category: 'Equipo Humano ORI'
  },
  {
    id: 8,
    level: 'bajo',
    title: 'Pregunta #8 · Invitada Ana María Mercado',
    question: '¿A qué programa académico de la Universidad Mariana pertenece nuestra invitada de movilidad nacional Ana María Mercado Montes y de qué universidad viene?',
    answer: 'Al programa de TRABAJO SOCIAL, y viene de la Corporación Universitaria del Caribe (CECAR) 🇨🇴.',
    category: 'Movilidad Nacional'
  },
  {
    id: 9,
    level: 'bajo',
    title: 'Pregunta #9 · Invitada Luciana Valencia (Origen)',
    question: '¿De qué país y de qué universidad nos visita nuestra invitada internacional Luciana Andrea Valencia Guzmán?',
    answer: 'De CHILE 🇨🇱, de la Universidad de La Frontera (UFRO).',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 10,
    level: 'bajo',
    title: 'Pregunta #10 · Invitada Luciana Valencia (Programa)',
    question: '¿En qué programa académico de la Universidad Mariana realiza su movilidad Luciana Andrea Valencia Guzmán?',
    answer: 'En el programa de TERAPIA OCUPACIONAL.',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 11,
    level: 'bajo',
    title: 'Pregunta #11 · Invitada Luz Celene Tello (Origen)',
    question: '¿De qué país y de qué universidad viene nuestra invitada internacional Luz Celene Tello Fernández?',
    answer: 'De PERÚ 🇵🇪, de la Universidad César Vallejo (UCV).',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 12,
    level: 'bajo',
    title: 'Pregunta #12 · Invitada Luz Celene Tello (Programa)',
    question: '¿En qué programa académico de la Universidad Mariana está cursando su intercambio Luz Celene Tello Fernández?',
    answer: 'En el programa de PSICOLOGÍA.',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 13,
    level: 'bajo',
    title: 'Pregunta #13 · Invitado Diego Navarrete (Origen)',
    question: '¿De qué país y de qué universidad nos visita nuestro invitado internacional Diego Navarrete Salmerón?',
    answer: 'De MÉXICO 🇲🇽, de la Universidad del Valle de Atemajac (UNIVA).',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 14,
    level: 'bajo',
    title: 'Pregunta #14 · Invitado Diego Navarrete (Programa)',
    question: '¿En qué programa académico de la Universidad Mariana está realizando su intercambio Diego Navarrete Salmerón?',
    answer: 'En el programa de MERCADEO.',
    category: 'Estudiantes Internacionales'
  },
  {
    id: 15,
    level: 'bajo',
    title: 'Pregunta #15 · Orientación en el Programa',
    question: '¿Cómo se llama la figura docente dentro de tu propio programa académico que te orienta inicialmente sobre movilidad nacional e internacional?',
    answer: 'El Líder de Internacionalización de programa o facultad.',
    category: 'Orientación Académica'
  },
  {
    id: 16,
    level: 'bajo',
    title: 'Pregunta #16 · Permiso Migratorio',
    question: '¿Cuáles son las siglas del permiso migratorio obligatorio para los estudiantes extranjeros que ingresan a la Universidad Mariana por estancias cortas?',
    answer: 'Permiso migratorio PID (o Visa Estudiantil según la duración).',
    category: 'Trámites Migratorios'
  },
  {
    id: 17,
    level: 'bajo',
    title: 'Pregunta #17 · Modalidades de Movilidad',
    question: 'Además de cursar un semestre académico, menciona UNA modalidad adicional de movilidad que puedes hacer con la ORI.',
    answer: 'Pasantías internacionales, misiones académicas o estancia de investigación.',
    category: 'Modalidades de Movilidad'
  },
  {
    id: 18,
    level: 'bajo',
    title: 'Pregunta #18 · Convenios Nacionales',
    question: '¿Con cuántos convenios NACIONALES vigentes cuenta hoy la Universidad Mariana para hacer movilidad en Colombia?',
    answer: '52 convenios nacionales vigentes.',
    category: 'Convenios y Redes'
  },
  {
    id: 19,
    level: 'bajo',
    title: 'Pregunta #19 · Convenios Internacionales',
    question: '¿Con cuántos convenios INTERNACIONALES vigentes cuenta hoy la Universidad Mariana?',
    answer: '69 convenios internacionales vigentes.',
    category: 'Convenios y Redes'
  },
  {
    id: 20,
    level: 'bajo',
    title: 'Pregunta #20 · Sede de la Oficina ORI',
    question: '¿En cuál de las dos casas (Casa San Francisco o Casa Santa Clara) se ubica la oficina de la ORI?',
    answer: 'Validar respuesta con la Profe Sofi según la sede configurada.',
    category: 'Identidad Institucional',
    dynamicCasa: true
  },
  {
    id: 21,
    level: 'bajo',
    title: 'Pregunta #21 · Investigación Científica',
    question: '¿Cómo se llama el programa de movilidad enfocado específicamente en estancias de investigación científica?',
    answer: 'El Programa DELFÍN.',
    category: 'Programas de Movilidad'
  },
  {
    id: 22,
    level: 'bajo',
    title: 'Pregunta #22 · Documentación de Postulación',
    question: '¿Qué documentos internos de la universidad es fundamental diligenciar a tiempo para postularse a una movilidad?',
    answer: 'Los formatos académicos de postulación.',
    category: 'Trámites y Formatos'
  },

  // ==========================================
  // NIVEL DIFÍCIL (14 PREGUNTAS) 🔴
  // ==========================================
  {
    id: 23,
    level: 'dificil',
    title: 'Pregunta #23 · Reto de los 4 Requisitos Salientes',
    question: '¡Reto de los 4 Requisitos Salientes! Menciona los CUATRO requisitos fundamentales que debe cumplir un estudiante de la Universidad Mariana para postularse a una movilidad saliente nacional o internacional.',
    answer: '1) Promedio acumulado superior a 3.8, 2) Más del 50% de créditos académicos aprobados, 3) Estar desde 4.º semestre en adelante y 4) No tener llamados de atención disciplinarios.',
    category: 'Reto Experto · Requisitos'
  },
  {
    id: 24,
    level: 'dificil',
    title: 'Pregunta #24 · Reto de Perfil Académico',
    question: '¡Reto de Perfil Académico Saliente! Si un estudiante ya está en cuarto semestre y no tiene llamados de atención disciplinarios, ¿qué promedio acumulado exacto y qué porcentaje de créditos debe superar para postularse?',
    answer: 'Promedio acumulado superior a 3.8 y más del 50% de los créditos académicos.',
    category: 'Reto Experto · Requisitos'
  },
  {
    id: 25,
    level: 'dificil',
    title: 'Pregunta #25 · Reto Matemático de Convenios',
    question: '¡Reto Matemático Nacional e Internacional! Dinos cuántos convenios internacionales, cuántos nacionales y la suma total de convenios vigentes de la Universidad Mariana.',
    answer: '69 internacionales y 52 nacionales, para un total de 121 convenios vigentes.',
    category: 'Reto Experto · Cifras Globales'
  },
  {
    id: 26,
    level: 'dificil',
    title: 'Pregunta #26 · Reto de Becas y Programas',
    question: '¡Reto de Becas y Programas! Menciona al menos TRES de los cinco programas estratégicos de movilidad y becas nombrados en la Cápsula #5.',
    answer: '3 entre: Programa PILA, Programa MARCA, Programa Delfín, Becas de Reciprocidad y Programa PIRI.',
    category: 'Reto Experto · Becas'
  },
  {
    id: 27,
    level: 'dificil',
    title: 'Pregunta #27 · Reto de Modalidades Académicas',
    question: '¡Reto de Modalidades! Menciona las CUATRO modalidades de movilidad académica que puedes realizar a través de los 121 convenios de la ORI.',
    answer: '1) Semestre académico, 2) Pasantías internacionales, 3) Misiones académicas y 4) Estancia de investigación.',
    category: 'Reto Experto · Modalidades'
  },
  {
    id: 28,
    level: 'dificil',
    title: 'Pregunta #28 · Reto Cuádruple de Invitados y Países',
    question: '¡Reto Cuádruple de Invitados y Países! Dinos el nombre de nuestros cuatro estudiantes invitados de hoy y el país de origen de cada uno.',
    answer: 'Ana María Mercado (Colombia 🇨🇴), Luciana Valencia (Chile 🇨🇱), Luz Celene Tello (Perú 🇵🇪) y Diego Navarrete (México 🇲🇽).',
    category: 'Reto Experto · Invitados'
  },
  {
    id: 29,
    level: 'dificil',
    title: 'Pregunta #29 · Reto de Programas en U. Mariana',
    question: '¡Reto de Programas en la U. Mariana! Menciona a qué programas académicos de la Universidad Mariana llegaron Ana María, Luciana, Celene y Diego.',
    answer: 'Ana María a Trabajo Social, Luciana a Terapia Ocupacional, Celene a Psicología y Diego a Mercadeo.',
    category: 'Reto Experto · Programas'
  },
  {
    id: 30,
    level: 'dificil',
    title: 'Pregunta #30 · Reto de Universidades de Origen',
    question: '¡Reto de Universidades de Origen! Menciona el nombre de la universidad de origen de al menos TRES de nuestros cuatro invitados de hoy.',
    answer: '3 entre: Corporación Universitaria del Caribe – CECAR (Ana María), Universidad de La Frontera (Luciana), Universidad César Vallejo (Celene) y Universidad del Valle de Atemajac – UNIVA (Diego).',
    category: 'Reto Experto · Universidades'
  },
  {
    id: 31,
    level: 'dificil',
    title: 'Pregunta #31 · Reto de Movilidad Nacional',
    question: '¡Reto de Movilidad Nacional! Dinos el nombre de nuestra invitada de movilidad nacional, de qué institución viene, a qué programa llegó en la U. Mariana y cuántos convenios nacionales tiene la ORI.',
    answer: 'Ana María Mercado Montes, viene de CECAR, está en Trabajo Social y la ORI tiene 52 convenios nacionales.',
    category: 'Reto Experto · Movilidad Nacional'
  },
  {
    id: 32,
    level: 'dificil',
    title: 'Pregunta #32 · Reto de Siglas Latinoamericanas',
    question: '¡Reto de Siglas Latinoamericanas! ¿Cuál programa corresponde al Intercambio Académico Latinoamericano y cuál corresponde a programas acreditados del Mercosur?',
    answer: 'Programa PILA (Latinoamericano) y Programa MARCA (Mercosur).',
    category: 'Reto Experto · Alianzas'
  },
  {
    id: 33,
    level: 'dificil',
    title: 'Pregunta #33 · Reto del Equipo ORI Completo',
    question: '¡Reto del Equipo ORI Completo! Dinos cuántas personas conforman el equipo de la ORI y menciona el nombre y rol de cada uno de sus 3 integrantes.',
    answer: '3 integrantes: la Directora Sofía Vallejos, la auxiliar administrativa Marcela y el auxiliar administrativo Antony.',
    category: 'Reto Experto · Equipo ORI'
  },
  {
    id: 34,
    level: 'dificil',
    title: 'Pregunta #34 · Reto Migratorio y de Convocatoria',
    question: '¡Reto Migratorio y de Convocatoria! Menciona las dos opciones de requisito migratorio para extranjeros Y el mes límite de postulación.',
    answer: 'Permiso PID o Visa Estudiantil, y plazo límite hasta NOVIEMBRE.',
    category: 'Reto Experto · Trámites'
  },
  {
    id: 35,
    level: 'dificil',
    title: 'Pregunta #35 · Reto de los 5 Programas Estratégicos',
    question: '¡Reto de los 5 Programas! Menciona los CINCO programas de movilidad y apoyo que nombró la Profe Sofi en la Cápsula #5.',
    answer: 'PILA, MARCA, Delfín, Becas de Reciprocidad y PIRI.',
    category: 'Reto Experto · Programas'
  },
  {
    id: 36,
    level: 'dificil',
    title: 'Pregunta #36 · Reto de Síntesis Global',
    question: '¡Reto de Síntesis Global! Si un estudiante de cuarto semestre con promedio superior a 3.8 quiere irse de intercambio, ¿a quién debe acudir primero en su programa, con quiénes se asesora en la ORI y antes de qué mes debe postularse?',
    answer: '1) Líder de Internacionalización en su programa, 2) En la ORI con Sofía Vallejos, Marcela o Antony, y 3) Antes de finalizar NOVIEMBRE.',
    category: 'Reto Experto · Síntesis'
  }
];

/**
 * Retorna la respuesta oficial procesada para una pregunta dada,
 * inyectando dinámicamente la Casa seleccionada en la pregunta #20.
 */
function getProcessedAnswer(questionObj, selectedCasa = 'Casa San Francisco') {
  if (questionObj.id === 20) {
    return `La oficina de la ORI se ubica en: ${selectedCasa.toUpperCase()} (Universidad Mariana).`;
  }
  return questionObj.answer;
}

// Exportación global y modular
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTIONS_DATA, getProcessedAnswer };
}

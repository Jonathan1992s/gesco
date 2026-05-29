export interface FaqItem {
  q: string;
  a: string;
}

export const generalFaqs: FaqItem[] = [
  {
    q: '¿Cómo son las clases de GESCO?',
    a: 'GESCO dicta sus clases online a nivel nacional mediante su plataforma educativa. La sede administrativa de GESCO está en Quito.',
  },
  {
    q: '¿La preparación sirve para universidades públicas y privadas?',
    a: 'Sí. El diagnóstico inicial permite orientar la ruta según el proceso de admisión y la universidad objetivo.',
  },
  {
    q: '¿Incluyen simuladores?',
    a: 'Sí. Los simuladores ayudan a practicar con tiempo, medir avances y detectar temas que necesitan refuerzo.',
  },
  {
    q: '¿Pueden orientar a padres de familia?',
    a: 'Sí. El acompañamiento incluye comunicación por WhatsApp y seguimiento para que la familia conozca el avance del estudiante.',
  },
];

export const programFaqs: Record<string, FaqItem[]> = {
  publicas: [
    {
      q: '¿Cómo se prepara un estudiante para universidades públicas?',
      a: 'Se trabaja una ruta online con diagnóstico, clases en vivo, práctica por áreas, simuladores y seguimiento académico.',
    },
    {
      q: '¿Todavía se habla de Examen Transformar?',
      a: 'Muchos estudiantes siguen usando ese término al buscar información, pero GESCO enfoca la preparación en procesos actuales de admisión a la educación superior.',
    },
    {
      q: '¿Qué materias se refuerzan?',
      a: 'Se refuerzan razonamiento matemático, aptitud verbal, lógica, lectura crítica y temas según el perfil del estudiante.',
    },
  ],
  privadas: [
    {
      q: '¿Cada universidad privada tiene un proceso distinto?',
      a: 'Sí. Por eso GESCO ajusta la preparación online a pruebas internas, entrevistas, inglés, lógica o requisitos propios de cada institución.',
    },
    {
      q: '¿Preparan para USFQ, UDLA, PUCE y UIDE?',
      a: 'Sí. Existen rutas específicas para universidades privadas con simuladores y práctica dirigida.',
    },
    {
      q: '¿La preparación es online?',
      a: 'Sí. Los estudiantes se preparan online con clases en vivo, Plataforma Gesco y seguimiento por WhatsApp.',
    },
  ],
  refuerzoAcademico: [
    {
      q: '¿Qué es el Refuerzo Académico?',
      a: 'Es un programa online de refuerzos para estudiantes que necesitan recuperar bases, mejorar notas o avanzar con más seguridad.',
    },
    {
      q: '¿Qué materias cubre?',
      a: 'Cubre matemática, física, química, inglés, aptitud verbal y otras materias según diagnóstico.',
    },
    {
      q: '¿Sirve si el estudiante está con bajo rendimiento?',
      a: 'Sí. El objetivo es identificar vacíos, ordenar prioridades y acompañar el avance con seguimiento.',
    },
  ],
  vocacional: [
    {
      q: '¿El test vocacional define una carrera automáticamente?',
      a: 'No. Es una herramienta de orientación para conversar con el estudiante y construir una decisión más informada.',
    },
    {
      q: '¿Incluye acompañamiento?',
      a: 'Sí. GESCO ayuda a interpretar resultados y conectar el perfil con opciones universitarias.',
    },
  ],
  educacionContinua: [
    {
      q: '¿Las certificaciones de educación continua son reconocidas?',
      a: 'Sí. Las certificaciones de GESCO en educación continua están avaladas por el Ministerio de Trabajo del Ecuador, por lo que tienen validez oficial para tu hoja de vida.',
    },
    {
      q: '¿Puedo estudiar siendo trabajador de tiempo completo?',
      a: 'Sí. Los programas son 100% online con horarios flexibles, diseñados para que puedas avanzar sin dejar tus responsabilidades laborales.',
    },
    {
      q: '¿Qué diferencia a la educación continua del preuniversitario?',
      a: 'La educación continua está orientada a adultos y profesionales que buscan actualización, nuevas habilidades o certificaciones. El preuniversitario es para estudiantes que buscan ingresar a la universidad.',
    },
    {
      q: '¿Cuánto dura cada programa?',
      a: 'La duración varía según el programa. Hay cursos cortos de pocas semanas y programas más completos de varios meses. Escríbenos por WhatsApp para conocer los programas disponibles en el periodo actual.',
    },
  ],
  capacitacionDocente: [
    {
      q: '¿La certificación docente está avalada por el Ministerio de Trabajo?',
      a: 'Sí. Las certificaciones de capacitación docente de GESCO están avaladas por el Ministerio de Trabajo del Ecuador, lo que les da validez oficial para carrera docente y hoja de vida.',
    },
    {
      q: '¿Los programas sirven para el Sistema Nacional de Educación?',
      a: 'Las certificaciones están reconocidas y pueden sumarse al expediente profesional docente. Para requisitos específicos del Ministerio de Educación, consulta la normativa vigente.',
    },
    {
      q: '¿Es presencial o virtual?',
      a: '100% online. Los docentes acceden desde cualquier ciudad del Ecuador a través de la Plataforma Gesco con clases en vivo y materiales descargables.',
    },
    {
      q: '¿Quién imparte los cursos?',
      a: 'Docentes expertos en educación con experiencia en metodología, tecnología educativa y gestión del aula tanto en el sector público como privado.',
    },
  ],
  convenios: [
    {
      q: '¿Qué tipo de instituciones pueden tener convenio con GESCO?',
      a: 'Colegios, instituciones educativas, empresas y organizaciones que quieran ofrecer preparación universitaria o capacitación a sus estudiantes, docentes o empleados con condiciones especiales.',
    },
    {
      q: '¿Qué beneficios ofrece un convenio institucional?',
      a: 'Acceso grupal a la Plataforma Gesco, precios institucionales, seguimiento por grupos, reportes de avance y certificaciones para los participantes.',
    },
    {
      q: '¿Cómo se inicia el proceso de convenio?',
      a: 'El proceso empieza con una reunión de diagnóstico para entender las necesidades de la institución. Contáctanos por WhatsApp para coordinar una reunión sin compromiso.',
    },
    {
      q: '¿Los convenios incluyen capacitación docente?',
      a: 'Sí. Los colegios pueden acceder a programas de capacitación para sus docentes dentro del convenio institucional.',
    },
  ],
};

export const SITE = {
  name: 'GESCO',
  url: 'https://gescovirtual.com',
  description: 'Preparación preuniversitaria online en Ecuador. +10.000 estudiantes preparados.',
  whatsapp: '593999216079',
  email: 'gescocorporacion@gmail.com',
  address: 'Leonardo Murialdo y Gaspar Tello, Quito, Ecuador 170514',
  phone: '+593 999 216 079',
  facebook: 'https://facebook.com/Corporacion.Gesco',
  instagram: 'https://instagram.com/corporacion_gesco',
  platform: 'https://plataformagesco.com/course/index.php?categoryid=1',
  logo: '/img/logo-gesco.webp',
  ogImage: 'https://gescovirtual.com/img/logo-gesco.webp',
  founder: 'Diego Polanco',
} as const;

export const seoByPath = {
  '/': {
    title: 'Preuniversitario Online en Ecuador | Ingreso Universidades - GESCO',
    description:
      'Prepárate online para universidades públicas y privadas con clases en vivo, Plataforma Gesco, simuladores y acompañamiento por WhatsApp.',
  },
  '/preuniversitario/': {
    title: 'Curso Preuniversitario Online en Ecuador | GESCO',
    description:
      'Preparación preuniversitaria online con clases en vivo, Plataforma Gesco, simuladores reales, orientación vocacional y seguimiento personalizado.',
  },
  '/universidades-publicas/': {
    title: 'Preuniversitario para universidades públicas | GESCO',
    description:
      'Prepárate online para procesos de admisión a universidades públicas con simuladores, clases en vivo y orientación personalizada.',
  },
  '/universidades-privadas/': {
    title: 'Preuniversitario USFQ, UDLA, PUCE, UIDE | GESCO',
    description:
      'Entrena online para pruebas de ingreso a universidades privadas con docentes expertos, simuladores, inglés, lógica y acompañamiento.',
  },
  '/refuerzo-academico/': {
    title: 'Refuerzo Académico Online en Ecuador | GESCO',
    description:
      'Refuerzos académicos online para mejorar notas: matemática, física, química, inglés y más, con diagnóstico y seguimiento personalizado.',
  },
  '/clases-particulares/': {
    title: 'Clases Particulares Online en Ecuador | GESCO',
    description:
      'Clases particulares y refuerzos académicos online para bachillerato: matemática, física, química, inglés y más.',
  },
  '/test-vocacional/': {
    title: 'Test Vocacional Online en Ecuador | GESCO',
    description:
      'Descubre qué carrera universitaria se adapta mejor a tu perfil con orientación vocacional online y acompañamiento de GESCO.',
  },
  '/para-padres/': {
    title: 'Preuniversitario online para su hijo | GESCO',
    description:
      'Acompañamos a su hijo online con diagnóstico, clases, simuladores, seguimiento académico y orientación para ingreso universitario.',
  },
  '/preuniversitario-quito/': {
    title: 'Preuniversitario Online desde Quito | GESCO',
    description:
      'GESCO tiene sede en Quito y prepara online a estudiantes de todo Ecuador con clases en vivo, Plataforma Gesco y seguimiento personalizado.',
  },
  '/contacto/': {
    title: 'Contacto | GESCO Preuniversitario Online',
    description:
      'Contáctanos por WhatsApp, teléfono o formulario. Nuestra sede está en Quito y atendemos online a estudiantes de todo Ecuador.',
  },
  '/gracias/': {
    title: 'Gracias por contactarnos | GESCO',
    description: 'Gracias por escribir a GESCO. Un asesor se comunicará contigo pronto.',
  },
  '/educacion-continua/': {
    title: 'Educación Continua Online con Certificación | GESCO',
    description:
      'Cursos de educación continua online para profesionales en Ecuador. Certificaciones avaladas por el Ministerio de Trabajo. Aprende sin dejar tu trabajo.',
  },
  '/capacitacion-docente/': {
    title: 'Capacitación Docente Online con Certificación | GESCO',
    description:
      'Programas de capacitación docente online con certificación avalada por el Ministerio de Trabajo. Metodología, tecnología educativa y gestión del aula.',
  },
  '/cursos-certificacion/': {
    title: 'Cursos de Certificación Profesional en Ecuador | GESCO',
    description:
      'Certificación profesional en desarrollo web, ensamble de equipos y facilitación de capacitación. Revisa requisitos, evaluación y vigencia de certificados GESCO.',
  },
  '/verificar/': {
    title: 'Verificar Autenticidad de Documentos GESCO | Informe Vocacional',
    description:
      'Comprueba la autenticidad de un informe vocacional u otro documento emitido por Corporación para la Gestión del Conocimiento — GESCO.',
  },
  '/convenios/': {
    title: 'Convenios GESCO para Instituciones Educativas | GESCO',
    description:
      'Convenios institucionales de GESCO para colegios, empresas y organizaciones. Preparación universitaria y capacitación grupal con condiciones especiales.',
  },
  '/publicaciones/': {
    title: 'Revista Nueva Jurisprudencia | Publicaciones GESCO',
    description:
      'Análisis legal, doctrina, derecho tributario, constitucional y parlamentario del Ecuador. Publicación mensual de Corporación para la Gestión del Conocimiento.',
  },
  '/blog/': {
    title: 'Blog GESCO — Guías para ingresar a la universidad en Ecuador',
    description:
      'Artículos y guías de GESCO: procesos de admisión, universidades públicas, USFQ, UDLA, orientación vocacional y más.',
  },
} as const;

export type SeoPath = keyof typeof seoByPath;

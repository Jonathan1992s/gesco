import type { WaKey } from './whatsapp';

export interface Program {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  waKey: WaKey;
  benefits: string[];
  curriculum: string[];
  audience: string;
}

export const programs: Program[] = [
  {
    slug: 'universidades-publicas',
    name: 'Universidades públicas',
    eyebrow: 'Ruta pública',
    title: 'Prepárate online para procesos de admisión a universidades públicas',
    description:
      'Entrena con clases online en vivo, Plataforma Gesco, simuladores, refuerzos y seguimiento para llegar con una ruta clara a tu proceso de admisión.',
    image: '/img/programs/program-publicas.svg',
    imageAlt: 'Preparación online GESCO para universidades públicas de Ecuador',
    waKey: 'publicas',
    audience: 'Bachilleres de todo Ecuador que buscan ingresar a universidades públicas.',
    benefits: ['Diagnóstico inicial', 'Clases online en vivo', 'Simuladores reales', 'Seguimiento semanal'],
    curriculum: ['Razonamiento matemático', 'Aptitud verbal', 'Lógica', 'Lectura crítica', 'Gestión del tiempo'],
  },
  {
    slug: 'universidades-privadas',
    name: 'Universidades privadas',
    eyebrow: 'Ruta privada',
    title: 'Preparación online para USFQ, UDLA, PUCE, UIDE y más',
    description:
      'Practica pruebas internas, lógica, inglés y entrevistas con una ruta online adaptada a la universidad que elegiste.',
    image: '/img/programs/program-privadas.svg',
    imageAlt: 'Preparación online GESCO para universidades privadas de Ecuador',
    waKey: 'privadas',
    audience: 'Estudiantes de todo Ecuador que buscan ingresar a universidades privadas con procesos propios.',
    benefits: ['Ruta por universidad', 'Práctica de inglés', 'Simuladores internos', 'Acompañamiento online personalizado'],
    curriculum: ['Matemática', 'Inglés', 'Aptitud verbal', 'Razonamiento abstracto', 'Entrevistas'],
  },
  {
    slug: 'preuniversitario',
    name: 'Preuniversitario integral',
    eyebrow: 'Ruta completa',
    title: 'Curso preuniversitario online para todo Ecuador',
    description:
      'Una preparación online integral para estudiantes que quieren fortalecer bases, practicar y postular con mayor seguridad.',
    image: '/img/programs/program-preuniversitario.svg',
    imageAlt: 'Estudiantes en preparación preuniversitaria online con GESCO',
    waKey: 'home',
    audience: 'Estudiantes de todo Ecuador que desean una preparación completa para educación superior.',
    benefits: ['Clases online en vivo', 'Plataforma Gesco', 'Orientación vocacional', 'Simuladores'],
    curriculum: ['Matemática', 'Aptitud verbal', 'Lógica', 'Orientación vocacional', 'Hábitos de estudio'],
  },
  {
    slug: 'refuerzo-academico',
    name: 'Refuerzo Académico',
    eyebrow: 'Refuerzos',
    title: 'Refuerzos académicos online para mejorar notas y recuperar bases',
    description:
      'Ayudamos a estudiantes con bajo rendimiento a ordenar prioridades, reforzar materias y avanzar online con acompañamiento.',
    image: '/img/programs/program-salvavidas.svg',
    imageAlt: 'Salvavidas académico online GESCO para mejorar notas',
    waKey: 'salvavidas',
    audience: 'Estudiantes de colegio que necesitan mejorar notas o reforzar materias desde cualquier ciudad del país.',
    benefits: ['Diagnóstico por materia', 'Plan de refuerzo online', 'Seguimiento por WhatsApp', 'Horarios flexibles'],
    curriculum: ['Matemática', 'Física', 'Química', 'Inglés', 'Aptitud verbal'],
  },
  {
    slug: 'test-vocacional',
    name: 'Test Vocacional',
    eyebrow: 'Orientación',
    title: 'Test vocacional online para elegir mejor tu carrera',
    description:
      'Identifica intereses, fortalezas y opciones universitarias con acompañamiento online para tomar una decisión informada.',
    image: '/img/programs/program-vocacional.svg',
    imageAlt: 'Orientación vocacional online GESCO para elegir carrera universitaria',
    waKey: 'vocacional',
    audience: 'Estudiantes de todo Ecuador que aún no tienen clara su carrera universitaria.',
    benefits: ['Análisis de perfil', 'Resultados explicados', 'Orientación profesional online', 'Modalidad online'],
    curriculum: ['Intereses', 'Habilidades', 'Carreras compatibles', 'Universidades posibles', 'Plan de decisión'],
  },
  {
    slug: 'clases-particulares',
    name: 'Clases particulares',
    eyebrow: 'Apoyo académico',
    title: 'Clases particulares online para estudiantes de Ecuador',
    description:
      'Refuerzos personalizados online para materias específicas, preparación universitaria y mejora de rendimiento académico.',
    image: '/img/programs/program-clases.svg',
    imageAlt: 'Clases particulares online y refuerzos académicos GESCO',
    waKey: 'clasesParticulares',
    audience: 'Estudiantes que necesitan apoyo puntual o continuo en materias específicas, sin importar su ciudad.',
    benefits: ['Atención personalizada online', 'Diagnóstico rápido', 'Refuerzo por objetivos', 'Seguimiento cercano'],
    curriculum: ['Matemática', 'Física', 'Química', 'Inglés', 'Lectura y escritura'],
  },
  {
    slug: 'educacion-continua',
    name: 'Educación Continua',
    eyebrow: 'Aprende siempre',
    title: 'Educación continua online con certificación para profesionales en Ecuador',
    description:
      'Programas de actualización profesional, cursos de habilidades y certificaciones avaladas por el Ministerio de Trabajo para quienes buscan seguir aprendiendo sin dejar su trabajo.',
    image: '/img/programs/program-educacion-continua.svg',
    imageAlt: 'Educación continua online GESCO con certificaciones para profesionales',
    waKey: 'educacionContinua',
    audience: 'Profesionales en activo, adultos que buscan actualizar conocimientos, certificarse o cambiar de área laboral.',
    benefits: [
      'Certificaciones avaladas por el Ministerio de Trabajo',
      'Modalidad 100% online',
      'Horarios flexibles para trabajadores',
      'Plataforma Gesco con acceso permanente',
    ],
    curriculum: [
      'Habilidades blandas y liderazgo',
      'Tecnología e informática básica',
      'Emprendimiento y finanzas personales',
      'Inglés profesional',
      'Gestión y administración',
    ],
  },
  {
    slug: 'capacitacion-docente',
    name: 'Capacitación Docente',
    eyebrow: 'Para educadores',
    title: 'Capacitación docente online con certificación avalada por el Ministerio de Trabajo',
    description:
      'Formación continua para docentes: metodología activa, tecnología educativa, gestión del aula y certificaciones reconocidas que fortalecen tu hoja de vida profesional.',
    image: '/img/programs/program-capacitacion-docente.svg',
    imageAlt: 'Capacitación docente online GESCO con certificación Ministerio de Trabajo',
    waKey: 'capacitacionDocente',
    audience: 'Docentes de bachillerato y educación básica que buscan actualización profesional y certificaciones reconocidas en Ecuador.',
    benefits: [
      'Certificación avalada por el Ministerio de Trabajo',
      'Modalidad 100% online',
      'Docentes expertos en educación',
      'Materiales descargables y acceso a plataforma',
    ],
    curriculum: [
      'Metodologías de enseñanza activa',
      'Tecnología educativa y aulas virtuales',
      'Gestión del aula y convivencia escolar',
      'Evaluación por competencias',
      'Liderazgo educativo',
    ],
  },
];

export const getProgram = (slug: string) => programs.find((program) => program.slug === slug);

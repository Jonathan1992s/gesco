export type ChasideAreaCode = 'C' | 'H' | 'A' | 'S' | 'I' | 'D' | 'E';
export type ChasideAnswer = 0 | 1;
export type ChasideAnswers = Record<number, ChasideAnswer>;

export interface ChasideQuestion {
  id: number;
  text: string;
}

export interface ChasideAreaProfile {
  code: ChasideAreaCode;
  name: string;
  description: string;
  interests: string[];
  aptitudes: string[];
  careers: string[];
}

export interface ChasideAreaScore {
  code: ChasideAreaCode;
  name: string;
  interests: number;
  aptitudes: number;
  total: number;
  profile: ChasideAreaProfile;
}

export const chasideQuestions: ChasideQuestion[] = [
  { id: 1, text: '¿Aceptarías trabajar escribiendo artículos en la sección económica de un diario?' },
  { id: 2, text: '¿Te ofrecerías para organizar la despedida de soltero o soltera de uno de tus amigos o amigas?' },
  { id: 3, text: '¿Te gustaría dirigir un proyecto de urbanización en tu provincia?' },
  { id: 4, text: '¿A una frustración siempre opones un pensamiento positivo?' },
  { id: 5, text: '¿Te dedicarías a socorrer a personas accidentadas o atacadas por asaltantes?' },
  { id: 6, text: '¿Cuando eras chico, te interesaba saber cómo estaban construidos tus juguetes?' },
  { id: 7, text: '¿Te interesan más los misterios de la naturaleza que los secretos de la tecnología?' },
  { id: 8, text: '¿Escuchás atentamente los problemas que te plantean tus amigos?' },
  { id: 9, text: '¿Te ofrecerías para explicar a tus compañeros un determinado tema que ellos no entendieron?' },
  { id: 10, text: '¿Sos exigente y crítico con tu equipo de trabajo?' },
  { id: 11, text: '¿Te atrae armar rompecabezas o puzzles?' },
  { id: 12, text: '¿Podés establecer la diferencia conceptual entre macroeconomía y microeconomía?' },
  { id: 13, text: '¿Usar uniforme te hace sentir distinto, importante?' },
  { id: 14, text: '¿Participarías como profesional en un espectáculo de acrobacia aérea?' },
  { id: 15, text: '¿Organizas tu dinero de manera que te alcance hasta el próximo cobro?' },
  { id: 16, text: '¿Convencés fácilmente a otras personas sobre la validez de tus argumentos?' },
  { id: 17, text: '¿Estás informado sobre los nuevos descubrimientos que se están realizando sobre la Teoría del Big-Bang?' },
  { id: 18, text: '¿Ante una situación de emergencia actuás rápidamente?' },
  { id: 19, text: '¿Cuando tenés que resolver un problema matemático, perseverás hasta encontrar la solución?' },
  { id: 20, text: '¿Si te convocara tu club preferido para planificar, organizar y dirigir un campo de deportes, aceptarías?' },
  { id: 21, text: '¿Sos el que pone un toque de alegría en las fiestas?' },
  { id: 22, text: '¿Crees que los detalles son tan importantes como el todo?' },
  { id: 23, text: '¿Te sentirías a gusto trabajando en un ámbito hospitalario?' },
  { id: 24, text: '¿Te gustaría participar para mantener el orden ante grandes desórdenes y cataclismos?' },
  { id: 25, text: '¿Pasarías varias horas leyendo algún libro de tu interés?' },
  { id: 26, text: '¿Planificás detalladamente tus trabajos antes de empezar?' },
  { id: 27, text: '¿Entablás una relación casi personal con tu computadora?' },
  { id: 28, text: '¿Disfrutás modelando con arcilla?' },
  { id: 29, text: '¿Ayudás habitualmente a los no videntes a cruzar la calle?' },
  { id: 30, text: '¿Considerás importante que desde la escuela primaria se fomente la actitud crítica y la participación activa?' },
  { id: 31, text: '¿Aceptarías que personas de distintos géneros formaran parte de las fuerzas armadas bajo las mismas normas?' },
  { id: 32, text: '¿Te gustaría crear nuevas técnicas para descubrir las patologías de algunas enfermedades a través del microscopio?' },
  { id: 33, text: '¿Participarías en una campaña de prevención contra la enfermedad de Chagas?' },
  { id: 34, text: '¿Te interesan los temas relacionados al pasado y a la evolución del hombre?' },
  { id: 35, text: '¿Te incluirías en un proyecto de investigación de los movimientos sísmicos y sus consecuencias?' },
  { id: 36, text: '¿Fuera de los horarios escolares, dedicás algún día de la semana a la realización de actividades corporales?' },
  { id: 37, text: '¿Te interesan las actividades de mucha acción y de reacción rápida en situaciones imprevistas y de peligro?' },
  { id: 38, text: '¿Te ofrecerías para colaborar como voluntario en los gabinetes espaciales de la NASA?' },
  { id: 39, text: '¿Te gusta más el trabajo manual que el trabajo intelectual?' },
  { id: 40, text: '¿Estarías dispuesto a renunciar a un momento placentero para ofrecer tu servicio como profesional?' },
  { id: 41, text: '¿Participarías de una investigación sobre la violencia en el fútbol?' },
  { id: 42, text: '¿Te gustaría trabajar en un laboratorio mientras estudiás?' },
  { id: 43, text: '¿Arriesgarías tu vida para salvar la vida de otro que no conoces?' },
  { id: 44, text: '¿Te agradaría hacer un curso de primeros auxilios?' },
  { id: 45, text: '¿Tolerarías empezar tantas veces como fuere necesario hasta obtener el logro deseado?' },
  { id: 46, text: '¿Distribuís tu horarios del día adecuadamente para poder hacer todo lo planeado?' },
  { id: 47, text: '¿Harías un curso para aprender a fabricar los instrumentos y/o piezas de las máquinas o aparatos con que trabajas?' },
  { id: 48, text: '¿Elegirías una profesión en la tuvieras que estar algunos meses alejado de tu familia, por ejemplo el marino?' },
  { id: 49, text: '¿Te radicarías en una zona agrícola-ganadera para desarrollar tus actividades como profesional?' },
  { id: 50, text: '¿Cuando estás en un grupo trabajando, te entusiasma producir ideas originales y que sean tenidas en cuenta?' },
  { id: 51, text: '¿Te resulta fácil coordinar un grupo de trabajo?' },
  { id: 52, text: '¿Te resultó interesante el estudio de las ciencias biológicas?' },
  { id: 53, text: '¿Si una gran empresa solicita un profesional como gerente de comercialización, te sentirías a gusto desempeñando ese rol?' },
  { id: 54, text: '¿Te incluirías en un proyecto nacional de desarrollo de la principal fuente de recursos de tu provincia?' },
  { id: 55, text: '¿Tenés interés por saber cuáles son las causas que determinan ciertos fenómenos, aunque saberlo no altere tu vida?' },
  { id: 56, text: '¿Descubriste algún filósofo o escritor que haya expresado tus mismas ideas con antelación?' },
  { id: 57, text: '¿Desearías que te regalen algún instrumento musical para tu cumpleaños?' },
  { id: 58, text: '¿Aceptarías colaborar con el cumplimiento de las normas en lugares públicos?' },
  { id: 59, text: '¿Crees que tus ideas son importantes y haces todo lo posible para ponerlas en práctica?' },
  { id: 60, text: '¿Cuando se descompone un artefacto en tu casa, te disponés prontamente a repararlo?' },
  { id: 61, text: '¿Formarías parte de un equipo de trabajo orientado a la preservación de la flora y la fauna en extinción?' },
  { id: 62, text: '¿Acostumbrás a leer revistas relacionadas con los últimos avances científicos y tecnológicos en el área de la salud?' },
  { id: 63, text: '¿Preservar las raíces culturales de nuestro país te parece importante y necesario?' },
  { id: 64, text: '¿Te gustaría realizar una investigación que contribuyera a hacer más justa la distribución de la riqueza?' },
  { id: 65, text: '¿Te gustaría realizar tareas auxiliares en una nave, como por ejemplo izado y arriado de velas, pintura y conservación del casco, arreglo de averías, conservación de motores, etc.?' },
  { id: 66, text: '¿Crees que un país debe poseer la más alta tecnología armamentista, a cualquier precio?' },
  { id: 67, text: '¿La libertad y la justicia son valores fundamentales en tu vida?' },
  { id: 68, text: '¿Aceptarías hacer una práctica rentada en una industria de productos alimenticios en el sector de control de calidad?' },
  { id: 69, text: '¿Consideras que la salud pública debe ser prioritaria, gratuita y eficiente para todos?' },
  { id: 70, text: '¿Te interesaría investigar sobre alguna nueva vacuna?' },
  { id: 71, text: '¿En un equipo de trabajo, preferís el rol de coordinador?' },
  { id: 72, text: '¿En una discusión entre amigos, te ofrecés como mediador?' },
  { id: 73, text: '¿Estás de acuerdo con la formación de un cuerpo de soldados profesionales?' },
  { id: 74, text: '¿Lucharías por una causa justa hasta las últimas consecuencias?' },
  { id: 75, text: '¿Te gustaría investigar científicamente sobre cultivos agrícolas?' },
  { id: 76, text: '¿Harías un nuevo diseño de una prenda pasada de moda, ante una reunión imprevista?' },
  { id: 77, text: '¿Visitarías un observatorio astronómico para conocer en acción el funcionamiento de los aparatos?' },
  { id: 78, text: '¿Dirigirías el área de importación y exportación de una empresa?' },
  { id: 79, text: '¿Te inhibís al entrar a un lugar nuevo con gente desconocida?' },
  { id: 80, text: '¿Te gratificaría el trabajar con niños?' },
  { id: 81, text: '¿Harías el diseño de un afiche para una campaña contra el sida?' },
  { id: 82, text: '¿Dirigirías un grupo de teatro independiente?' },
  { id: 83, text: '¿Enviarías tu currículum a una empresa automotriz que solicita gerente para su área de producción?' },
  { id: 84, text: '¿Participarías en un grupo de defensa internacional dentro de alguna fuerza armada?' },
  { id: 85, text: '¿Te costearías tus estudios trabajando en una auditoría?' },
  { id: 86, text: '¿Sos de los que defendés causas perdidas?' },
  { id: 87, text: '¿Ante una emergencia epidémica participarías en una campaña brindando tu ayuda?' },
  { id: 88, text: '¿Sabrías responder qué significa ADN y ARN?' },
  { id: 89, text: '¿Elegirías una carrera cuyo instrumento de trabajo fuere la utilización de un idioma extranjero?' },
  { id: 90, text: '¿Trabajar con objetos te resulta más gratificante que trabajar con personas?' },
  { id: 91, text: '¿Te resultaría gratificante ser asesor contable en una empresa reconocida?' },
  { id: 92, text: '¿Ante un llamado solidario, te ofrecerías para cuidar a un enfermo?' },
  { id: 93, text: '¿Te atrae investigar sobre los misterios del universo, por ejemplo los agujeros negros?' },
  { id: 94, text: '¿El trabajo individual te resulta más rápido y efectivo que el trabajo grupal?' },
  { id: 95, text: '¿Dedicarías parte de tu tiempo a ayudar a personas de zonas carenciadas?' },
  { id: 96, text: '¿Cuando elegís tu ropa o decorás un ambiente, tenés en cuenta la combinación de los colores, las telas o el estilo de los muebles?' },
  { id: 97, text: '¿Te gustaría trabajar como profesional dirigiendo la construcción de una empresa hidroeléctrica?' },
  { id: 98, text: '¿Sabés qué es el PBI?' },
];

export const chasideInterestMap: Record<ChasideAreaCode, number[]> = {
  C: [98, 91, 12, 1, 20, 53, 64, 71, 78, 85],
  H: [9, 25, 34, 41, 56, 67, 74, 89, 95, 80],
  A: [96, 81, 57, 45, 36, 28, 21, 11, 50, 3],
  S: [92, 87, 70, 62, 52, 44, 33, 23, 16, 8],
  I: [83, 97, 75, 60, 54, 47, 38, 27, 19, 6],
  D: [84, 73, 65, 58, 48, 37, 31, 24, 14, 5],
  E: [93, 88, 77, 68, 61, 49, 42, 35, 32, 17],
};

export const chasideAptitudeMap: Record<ChasideAreaCode, number[]> = {
  C: [2, 15, 46, 51],
  H: [30, 63, 72, 86],
  A: [22, 39, 76, 82],
  S: [4, 29, 40, 69],
  I: [10, 26, 59, 90],
  D: [13, 18, 43, 66],
  E: [7, 55, 79, 94],
};

export const chasideAreas: Record<ChasideAreaCode, ChasideAreaProfile> = {
  C: {
    code: 'C',
    name: 'Administrativas y Contables',
    description: 'Área orientada a organización, gestión, análisis económico, planificación y toma de decisiones en empresas o instituciones.',
    interests: ['gestión de recursos', 'economía', 'organización de equipos', 'comercialización', 'procesos administrativos'],
    aptitudes: ['orden', 'coordinación', 'manejo de información', 'planificación', 'responsabilidad con detalles'],
    careers: ['Administración de Empresas', 'Contabilidad y Auditoría', 'Finanzas', 'Economía', 'Marketing', 'Comercio Exterior', 'Gestión de Talento Humano'],
  },
  H: {
    code: 'H',
    name: 'Humanísticas y Sociales',
    description: 'Área vinculada con comunicación, educación, análisis social, cultura, idiomas y acompañamiento de personas o comunidades.',
    interests: ['lectura', 'historia', 'educación', 'causas sociales', 'idiomas', 'mediación'],
    aptitudes: ['comunicación', 'empatía', 'pensamiento crítico', 'argumentación', 'comprensión social'],
    careers: ['Psicología', 'Comunicación', 'Educación', 'Derecho', 'Sociología', 'Trabajo Social', 'Relaciones Internacionales', 'Idiomas'],
  },
  A: {
    code: 'A',
    name: 'Artísticas',
    description: 'Área relacionada con creatividad, expresión estética, diseño, composición visual, música, teatro y producción cultural.',
    interests: ['diseño', 'música', 'teatro', 'manualidades', 'composición visual', 'ideas originales'],
    aptitudes: ['creatividad', 'sensibilidad estética', 'expresión', 'observación de formas y colores', 'trabajo manual'],
    careers: ['Diseño Gráfico', 'Diseño de Interiores', 'Arquitectura', 'Artes Visuales', 'Producción Audiovisual', 'Música', 'Diseño de Modas'],
  },
  S: {
    code: 'S',
    name: 'Medicina y Ciencias de la Salud',
    description: 'Área enfocada en cuidado, prevención, biología, investigación clínica, salud pública y servicio a personas.',
    interests: ['salud', 'biología', 'prevención', 'primeros auxilios', 'investigación médica', 'ayuda humanitaria'],
    aptitudes: ['servicio', 'escucha', 'autocontrol', 'responsabilidad social', 'atención a necesidades humanas'],
    careers: ['Medicina', 'Enfermería', 'Odontología', 'Fisioterapia', 'Nutrición', 'Laboratorio Clínico', 'Psicología Clínica', 'Salud Pública'],
  },
  I: {
    code: 'I',
    name: 'Ingeniería y Computación',
    description: 'Área centrada en tecnología, resolución de problemas, construcción, producción, sistemas, máquinas e innovación aplicada.',
    interests: ['tecnología', 'computación', 'producción', 'mecánica', 'construcción', 'investigación aplicada'],
    aptitudes: ['lógica', 'perseverancia', 'análisis técnico', 'planificación', 'trabajo con objetos y sistemas'],
    careers: ['Ingeniería en Sistemas', 'Software', 'Civil', 'Industrial', 'Mecatrónica', 'Electrónica', 'Automotriz', 'Telecomunicaciones'],
  },
  D: {
    code: 'D',
    name: 'Defensa y Seguridad',
    description: 'Área orientada al orden, protección, respuesta ante emergencias, disciplina, acción rápida y seguridad ciudadana o institucional.',
    interests: ['seguridad', 'disciplina', 'emergencias', 'rescate', 'orden público', 'acciones de riesgo controlado'],
    aptitudes: ['decisión rápida', 'autocontrol', 'resistencia', 'liderazgo operativo', 'cumplimiento de normas'],
    careers: ['Seguridad Ciudadana', 'Criminalística', 'Gestión de Riesgos', 'Ciencias Policiales', 'Fuerzas Armadas', 'Bombería', 'Seguridad Ocupacional'],
  },
  E: {
    code: 'E',
    name: 'Ciencias Exactas y Agrarias',
    description: 'Área asociada con investigación científica, naturaleza, laboratorio, ambiente, alimentos, astronomía, biología y producción agraria.',
    interests: ['ciencia', 'naturaleza', 'laboratorio', 'astronomía', 'ambiente', 'calidad de alimentos'],
    aptitudes: ['curiosidad científica', 'observación', 'trabajo individual', 'análisis de causas', 'rigurosidad'],
    careers: ['Biología', 'Química', 'Física', 'Matemática', 'Agronomía', 'Ingeniería Ambiental', 'Ciencia de Alimentos', 'Veterinaria'],
  },
};

const areaOrder: ChasideAreaCode[] = ['C', 'H', 'A', 'S', 'I', 'D', 'E'];

function sumAnswers(questionIds: number[], answers: ChasideAnswers) {
  return questionIds.reduce((total, questionId) => total + (answers[questionId] === 1 ? 1 : 0), 0);
}

export function scoreChaside(answers: ChasideAnswers): ChasideAreaScore[] {
  return areaOrder
    .map((code) => {
      const interests = sumAnswers(chasideInterestMap[code], answers);
      const aptitudes = sumAnswers(chasideAptitudeMap[code], answers);

      return {
        code,
        name: chasideAreas[code].name,
        interests,
        aptitudes,
        total: interests + aptitudes,
        profile: chasideAreas[code],
      };
    })
    .sort((a, b) => b.total - a.total || b.interests - a.interests || areaOrder.indexOf(a.code) - areaOrder.indexOf(b.code));
}

export function areAllChasideQuestionsAnswered(answers: Partial<ChasideAnswers>) {
  return chasideQuestions.every((question) => answers[question.id] === 0 || answers[question.id] === 1);
}

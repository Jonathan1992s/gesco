// Estimación orientativa de demanda laboral por carrera en Ecuador.
// Fuentes: SENESCYT, ENEMDU, medios académicos nacionales.
// No representa tasa oficial de empleo — uso exclusivo para orientación vocacional.

export interface CareerMarketInfo {
  nombre: string;
  descripcion: string;
  porcentaje: number;
  nivel: string;
}

// Ordenadas de mayor a menor % para facilitar el slice en el PDF
export const carrerasMercado: Record<string, CareerMarketInfo[]> = {

  // ── C: Administrativas y Contables ──────────────────────────────────────────
  C: [
    { nombre: 'Logística y Transporte',          descripcion: 'Gestiona distribución y movilidad de productos.',                  porcentaje: 82, nivel: 'Muy Alta' },
    { nombre: 'Administración de Empresas',       descripcion: 'Gestiona organizaciones y recursos empresariales.',                porcentaje: 76, nivel: 'Alta' },
    { nombre: 'Marketing',                        descripcion: 'Diseña estrategias de promoción y ventas.',                        porcentaje: 75, nivel: 'Alta' },
    { nombre: 'Finanzas',                         descripcion: 'Administra inversiones y recursos económicos.',                    porcentaje: 72, nivel: 'Alta' },
    { nombre: 'Contabilidad y Auditoría',         descripcion: 'Controla información financiera y auditorías.',                   porcentaje: 73, nivel: 'Alta' },
    { nombre: 'Gestión Empresarial',              descripcion: 'Optimiza procesos y liderazgo empresarial.',                      porcentaje: 70, nivel: 'Alta' },
    { nombre: 'Comercio Exterior',                descripcion: 'Coordina importaciones y exportaciones.',                          porcentaje: 65, nivel: 'Media-Alta' },
    { nombre: 'Talento Humano',                   descripcion: 'Administra personal y clima organizacional.',                      porcentaje: 66, nivel: 'Media-Alta' },
    { nombre: 'Negocios Internacionales',         descripcion: 'Gestiona comercio y relaciones globales.',                         porcentaje: 62, nivel: 'Media-Alta' },
    { nombre: 'Emprendimiento e Innovación',      descripcion: 'Desarrolla nuevos negocios y proyectos.',                          porcentaje: 61, nivel: 'Media-Alta' },
    { nombre: 'Economía',                         descripcion: 'Analiza producción, consumo y mercados.',                          porcentaje: 60, nivel: 'Media-Alta' },
    { nombre: 'Banca y Seguros',                  descripcion: 'Trabaja en servicios financieros y aseguradoras.',                 porcentaje: 63, nivel: 'Media-Alta' },
  ],

  // ── H: Humanísticas y Sociales ───────────────────────────────────────────────
  H: [
    { nombre: 'Educación Básica',                 descripcion: 'Forma docentes para educación escolar.',                          porcentaje: 73, nivel: 'Alta' },
    { nombre: 'Educación Inicial',                descripcion: 'Especializada en enseñanza infantil temprana.',                    porcentaje: 71, nivel: 'Alta' },
    { nombre: 'Psicología',                       descripcion: 'Estudia el comportamiento y procesos mentales humanos.',           porcentaje: 67, nivel: 'Media-Alta' },
    { nombre: 'Pedagogía',                        descripcion: 'Estudia métodos y procesos de enseñanza.',                        porcentaje: 65, nivel: 'Media-Alta' },
    { nombre: 'Derecho',                          descripcion: 'Forma profesionales en leyes y justicia.',                         porcentaje: 64, nivel: 'Media-Alta' },
    { nombre: 'Turismo',                          descripcion: 'Gestiona actividades turísticas y culturales.',                    porcentaje: 59, nivel: 'Media' },
    { nombre: 'Trabajo Social',                   descripcion: 'Interviene en problemáticas sociales y comunitarias.',            porcentaje: 54, nivel: 'Media' },
    { nombre: 'Comunicación Social',              descripcion: 'Gestiona información en medios y organizaciones.',                 porcentaje: 52, nivel: 'Media' },
    { nombre: 'Idiomas',                          descripcion: 'Forma profesionales en lenguas extranjeras.',                      porcentaje: 56, nivel: 'Media' },
    { nombre: 'Periodismo',                       descripcion: 'Investiga y comunica noticias y hechos relevantes.',              porcentaje: 48, nivel: 'Media' },
    { nombre: 'Relaciones Internacionales',       descripcion: 'Analiza política y relaciones entre países.',                      porcentaje: 46, nivel: 'Media' },
    { nombre: 'Historia',                         descripcion: 'Investiga hechos y procesos históricos.',                          porcentaje: 38, nivel: 'Media-Baja' },
    { nombre: 'Sociología',                       descripcion: 'Analiza el comportamiento y dinámica social.',                    porcentaje: 40, nivel: 'Media-Baja' },
    { nombre: 'Filosofía',                        descripcion: 'Reflexiona sobre pensamiento, ética y conocimiento.',              porcentaje: 35, nivel: 'Baja' },
  ],

  // ── A: Artísticas ─────────────────────────────────────────────────────────────
  A: [
    { nombre: 'Animación Digital',                descripcion: 'Crea animaciones y contenido digital.',                           porcentaje: 64, nivel: 'Media-Alta' },
    { nombre: 'Diseño Multimedia',                descripcion: 'Integra imagen, audio y animación digital.',                      porcentaje: 62, nivel: 'Media-Alta' },
    { nombre: 'Ilustración Digital',              descripcion: 'Crea arte digital e ilustraciones.',                              porcentaje: 52, nivel: 'Media' },
    { nombre: 'Diseño Gráfico',                   descripcion: 'Crea contenido visual para comunicación.',                        porcentaje: 57, nivel: 'Media' },
    { nombre: 'Producción Audiovisual',           descripcion: 'Produce contenido de video y medios.',                            porcentaje: 55, nivel: 'Media' },
    { nombre: 'Fotografía',                       descripcion: 'Captura y edita imágenes profesionales.',                         porcentaje: 45, nivel: 'Media' },
    { nombre: 'Diseño de Moda',                   descripcion: 'Diseña prendas y tendencias textiles.',                           porcentaje: 46, nivel: 'Media' },
    { nombre: 'Cine',                             descripcion: 'Produce y dirige proyectos cinematográficos.',                    porcentaje: 42, nivel: 'Media-Baja' },
    { nombre: 'Artes Visuales',                   descripcion: 'Desarrolla expresión artística visual.',                          porcentaje: 36, nivel: 'Media-Baja' },
    { nombre: 'Música',                           descripcion: 'Forma profesionales en interpretación y composición.',            porcentaje: 35, nivel: 'Baja' },
    { nombre: 'Danza',                            descripcion: 'Desarrolla técnicas de expresión corporal.',                      porcentaje: 32, nivel: 'Baja' },
    { nombre: 'Teatro',                           descripcion: 'Forma actores y gestores escénicos.',                             porcentaje: 30, nivel: 'Baja' },
  ],

  // ── S: Medicina y Ciencias de la Salud ──────────────────────────────────────
  S: [
    { nombre: 'Medicina',                         descripcion: 'Diagnostica y trata enfermedades humanas.',                       porcentaje: 92, nivel: 'Muy Alta' },
    { nombre: 'Enfermería',                       descripcion: 'Brinda atención y cuidado integral de salud.',                    porcentaje: 86, nivel: 'Muy Alta' },
    { nombre: 'Salud Pública',                    descripcion: 'Diseña estrategias de prevención y bienestar social.',            porcentaje: 78, nivel: 'Alta' },
    { nombre: 'Bioquímica y Farmacia',            descripcion: 'Desarrolla medicamentos y análisis químicos.',                    porcentaje: 75, nivel: 'Alta' },
    { nombre: 'Laboratorio Clínico',              descripcion: 'Realiza análisis para diagnóstico médico.',                       porcentaje: 74, nivel: 'Alta' },
    { nombre: 'Radiología',                       descripcion: 'Utiliza imágenes médicas para diagnóstico.',                      porcentaje: 72, nivel: 'Alta' },
    { nombre: 'Fisioterapia',                     descripcion: 'Ayuda en rehabilitación física y movilidad.',                     porcentaje: 70, nivel: 'Alta' },
    { nombre: 'Psicología Clínica',              descripcion: 'Evalúa y trata trastornos emocionales.',                          porcentaje: 69, nivel: 'Media-Alta' },
    { nombre: 'Odontología',                      descripcion: 'Especializada en salud oral y dental.',                           porcentaje: 68, nivel: 'Media-Alta' },
    { nombre: 'Obstetricia',                      descripcion: 'Atiende salud materna y neonatal.',                               porcentaje: 66, nivel: 'Media-Alta' },
    { nombre: 'Nutrición',                        descripcion: 'Promueve alimentación saludable y bienestar.',                    porcentaje: 61, nivel: 'Media-Alta' },
    { nombre: 'Terapia Ocupacional',              descripcion: 'Apoya rehabilitación e independencia funcional.',                 porcentaje: 58, nivel: 'Media' },
  ],

  // ── I: Ingeniería y Computación ──────────────────────────────────────────────
  I: [
    { nombre: 'Ciberseguridad',                   descripcion: 'Protege sistemas y datos frente a amenazas digitales.',           porcentaje: 91, nivel: 'Muy Alta' },
    { nombre: 'Ciencia de Datos',                 descripcion: 'Analiza grandes volúmenes de datos para generar información.',    porcentaje: 90, nivel: 'Muy Alta' },
    { nombre: 'Inteligencia Artificial',          descripcion: 'Crea sistemas capaces de aprender y automatizar tareas.',         porcentaje: 89, nivel: 'Muy Alta' },
    { nombre: 'Desarrollo de Software',           descripcion: 'Diseña y programa aplicaciones informáticas.',                    porcentaje: 87, nivel: 'Muy Alta' },
    { nombre: 'Ingeniería en Software',           descripcion: 'Desarrolla aplicaciones y soluciones tecnológicas.',              porcentaje: 88, nivel: 'Muy Alta' },
    { nombre: 'Ingeniería en Computación',        descripcion: 'Integra hardware y software en sistemas computacionales.',        porcentaje: 82, nivel: 'Muy Alta' },
    { nombre: 'Ingeniería en Redes',              descripcion: 'Administra infraestructura y conectividad informática.',          porcentaje: 81, nivel: 'Muy Alta' },
    { nombre: 'Ingeniería en Sistemas',           descripcion: 'Diseña y administra sistemas informáticos y tecnológicos.',       porcentaje: 85, nivel: 'Muy Alta' },
    { nombre: 'Ingeniería Industrial',            descripcion: 'Optimiza procesos de producción y gestión empresarial.',          porcentaje: 80, nivel: 'Muy Alta' },
    { nombre: 'Ing. en Telecomunicaciones',       descripcion: 'Gestiona sistemas de comunicación y redes.',                      porcentaje: 79, nivel: 'Alta' },
    { nombre: 'Ingeniería Eléctrica',             descripcion: 'Trabaja con sistemas eléctricos y energéticos.',                  porcentaje: 78, nivel: 'Alta' },
    { nombre: 'Ingeniería Mecatrónica',           descripcion: 'Combina mecánica, electrónica y programación.',                   porcentaje: 77, nivel: 'Alta' },
    { nombre: 'Ingeniería Mecánica',              descripcion: 'Desarrolla maquinaria y sistemas mecánicos.',                     porcentaje: 76, nivel: 'Alta' },
    { nombre: 'Ingeniería Electrónica',           descripcion: 'Diseña circuitos y dispositivos electrónicos.',                   porcentaje: 74, nivel: 'Alta' },
    { nombre: 'Ingeniería Civil',                 descripcion: 'Diseña y construye obras de infraestructura.',                    porcentaje: 70, nivel: 'Alta' },
    { nombre: 'Ingeniería Automotriz',            descripcion: 'Especializada en diseño y mantenimiento de vehículos.',            porcentaje: 62, nivel: 'Media-Alta' },
  ],

  // ── D: Defensa y Seguridad ───────────────────────────────────────────────────
  D: [
    { nombre: 'Seguridad y Salud Ocupacional',   descripcion: 'Promueve bienestar y prevención laboral.',                        porcentaje: 72, nivel: 'Alta' },
    { nombre: 'Seguridad Industrial',             descripcion: 'Previene accidentes en ambientes laborales.',                     porcentaje: 68, nivel: 'Media-Alta' },
    { nombre: 'Gestión de Riesgos',               descripcion: 'Planifica acciones ante desastres y emergencias.',                porcentaje: 64, nivel: 'Media-Alta' },
    { nombre: 'Inteligencia Estratégica',         descripcion: 'Analiza información para seguridad y planificación.',             porcentaje: 60, nivel: 'Media-Alta' },
    { nombre: 'Seguridad Ciudadana',              descripcion: 'Previene riesgos y fortalece la convivencia social.',             porcentaje: 58, nivel: 'Media' },
    { nombre: 'Ciencias Militares',               descripcion: 'Forma profesionales para liderazgo y estrategia militar.',        porcentaje: 55, nivel: 'Media' },
    { nombre: 'Protección Civil',                 descripcion: 'Coordina acciones de ayuda en emergencias.',                      porcentaje: 57, nivel: 'Media' },
    { nombre: 'Investigación Criminal',           descripcion: 'Apoya procesos de investigación delictiva.',                      porcentaje: 53, nivel: 'Media' },
    { nombre: 'Criminalística',                   descripcion: 'Analiza evidencias para investigaciones judiciales.',             porcentaje: 52, nivel: 'Media' },
    { nombre: 'Criminología',                     descripcion: 'Estudia las causas y prevención del delito.',                     porcentaje: 50, nivel: 'Media' },
  ],

  // ── E: Ciencias Exactas y Agrarias ──────────────────────────────────────────
  E: [
    { nombre: 'Estadística',                      descripcion: 'Analiza datos para apoyar la toma de decisiones.',                porcentaje: 72, nivel: 'Alta' },
    { nombre: 'Agroindustria',                    descripcion: 'Transforma productos agrícolas en bienes industriales.',           porcentaje: 70, nivel: 'Alta' },
    { nombre: 'Tecnología de Alimentos',          descripcion: 'Garantiza la calidad y procesamiento seguro de alimentos.',       porcentaje: 63, nivel: 'Media-Alta' },
    { nombre: 'Química',                          descripcion: 'Investiga la composición y transformación de la materia.',        porcentaje: 62, nivel: 'Media-Alta' },
    { nombre: 'Ingeniería Agropecuaria',          descripcion: 'Integra agricultura y ganadería para producción sostenible.',     porcentaje: 66, nivel: 'Media-Alta' },
    { nombre: 'Ingeniería Agronómica',            descripcion: 'Carrera enfocada en producción agrícola y manejo de cultivos.',   porcentaje: 65, nivel: 'Media-Alta' },
    { nombre: 'Matemática',                       descripcion: 'Desarrolla modelos y soluciones mediante razonamiento lógico.',   porcentaje: 60, nivel: 'Media-Alta' },
    { nombre: 'Ciencias Ambientales',             descripcion: 'Se enfoca en la protección y conservación del medio ambiente.',   porcentaje: 57, nivel: 'Media' },
    { nombre: 'Medicina Veterinaria',             descripcion: 'Se dedica a la salud y cuidado de animales.',                     porcentaje: 58, nivel: 'Media' },
    { nombre: 'Zootecnia',                        descripcion: 'Especializada en crianza, nutrición y producción animal.',        porcentaje: 55, nivel: 'Media' },
    { nombre: 'Biología',                         descripcion: 'Analiza los seres vivos, sus procesos y relación ambiental.',     porcentaje: 45, nivel: 'Media' },
    { nombre: 'Ingeniería Forestal',              descripcion: 'Estudia el manejo sostenible de bosques y recursos forestales.',  porcentaje: 48, nivel: 'Media' },
    { nombre: 'Física',                           descripcion: 'Estudia las leyes que rigen la materia, energía y movimiento.',   porcentaje: 42, nivel: 'Media-Baja' },
  ],
};

export function getLevelColor(porcentaje: number): [number, number, number] {
  if (porcentaje >= 81) return [22,  163, 74 ];   // Muy Alta — verde
  if (porcentaje >= 70) return [27,  136, 226];   // Alta — brand blue
  if (porcentaje >= 60) return [8,   145, 178];   // Media-Alta — teal
  if (porcentaje >= 45) return [100, 116, 139];   // Media — slate
  return                       [148, 163, 184];   // Media-Baja / Baja — gris
}

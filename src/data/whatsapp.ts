import { SITE } from './site';

const whatsappLink = (message: string, campaign: string) => {
  const params = new URLSearchParams({
    text: message,
    utm_source: 'web',
    utm_medium: 'cta',
    utm_campaign: campaign,
  });

  return `https://wa.me/${SITE.whatsapp}?${params.toString()}`;
};

export const WA = {
  home: whatsappLink('Hola, quiero información sobre los programas online de GESCO.', 'home'),
  publicas: whatsappLink('Hola, quiero prepararme online para ingresar a una universidad pública.', 'publicas'),
  privadas: whatsappLink('Hola, quiero información sobre preparación online para universidades privadas.', 'privadas'),
  usfq: whatsappLink('Hola, quiero prepararme online para el examen de ingreso a la USFQ.', 'usfq'),
  udla: whatsappLink('Hola, quiero prepararme online para el examen de ingreso a la UDLA.', 'udla'),
  puce: whatsappLink('Hola, quiero prepararme online para el examen de ingreso a la PUCE.', 'puce'),
  uide: whatsappLink('Hola, quiero prepararme online para el examen de ingreso a la UIDE.', 'uide'),
  uce: whatsappLink('Hola, quiero prepararme online para el proceso de admisión a la UCE.', 'uce'),
  epn: whatsappLink('Hola, quiero prepararme online para el proceso de admisión a la EPN.', 'epn'),
  espe: whatsappLink('Hola, quiero prepararme online para el proceso de admisión a la ESPE.', 'espe'),
  espol: whatsappLink('Hola, quiero prepararme online para el proceso de admisión a la ESPOL.', 'espol'),
  salvavidas: whatsappLink('Hola, necesito ayuda académica online para mejorar mis notas.', 'salvavidas'),
  clasesParticulares: whatsappLink('Hola, quiero información sobre clases particulares online de GESCO.', 'clases-particulares'),
  padres: whatsappLink('Hola, soy padre/madre y quiero información para mi hijo/a.', 'padres'),
  vocacional: whatsappLink('Hola, quiero información sobre el test vocacional online de GESCO.', 'test-vocacional'),
  blog: whatsappLink('Hola, vi el blog de GESCO y quiero más información sobre sus programas online.', 'blog'),
  quito: whatsappLink('Hola, quiero información sobre el preuniversitario online de GESCO. Sé que su sede está en Quito.', 'preuniversitario-quito'),
  contacto: whatsappLink('Hola, quiero comunicarme con un asesor de GESCO.', 'contacto'),
  educacionContinua: whatsappLink('Hola, quiero información sobre los programas de educación continua y certificaciones de GESCO.', 'educacion-continua'),
  capacitacionDocente: whatsappLink(
    'Hola, quiero información sobre los programas de capacitación docente con certificación del Ministerio de Trabajo de GESCO.',
    'capacitacion-docente',
  ),
  cursosCertificacion: whatsappLink(
    'Hola, quiero información sobre los cursos de certificación profesional de GESCO y los requisitos para aplicar.',
    'cursos-certificacion',
  ),
  convenios: whatsappLink('Hola, quiero información sobre los convenios institucionales de GESCO.', 'convenios'),
} as const;

export type WaKey = keyof typeof WA;

import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  areAllChasideQuestionsAnswered,
  chasideQuestions,
  scoreChaside,
  type ChasideAnswer,
  type ChasideAnswers,
  type ChasideAreaScore,
} from '@/data/chaside';
import { carrerasMercado, getLevelColor } from '@/data/carreras-mercado';

interface StudentData {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  website: string;
  aceptaContacto: boolean;
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error';
type TestStage = 'questions' | 'lead' | 'results';

const initialStudentData: StudentData = {
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  website: '',
  aceptaContacto: false,
};

function validateStudentData(student: StudentData) {
  if (!student.nombres.trim() || !student.apellidos.trim()) return 'Completa tus nombres y apellidos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.correo.trim())) return 'Ingresa un correo válido.';
  if (!student.aceptaContacto) return 'Autoriza el uso de tus datos para generar y enviar el reporte.';
  return '';
}

interface LoadedImage { dataUrl: string; w: number; h: number; }

async function loadImageAsDataUrl(src: string): Promise<LoadedImage> {
  const response = await fetch(src);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  return new Promise<LoadedImage>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(objectUrl); reject(new Error('canvas')); return; }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve({ dataUrl: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('load')); };
    img.src = objectUrl;
  });
}

function fitImage(img: LoadedImage, maxW: number, maxH: number): { w: number; h: number } {
  const aspect = img.w / img.h;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) { h = maxH; w = h * aspect; }
  return { w, h };
}

function addWrappedText(pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function generateResultCode() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GESCO-CH-${datePart}-${randomPart}`;
}

function getStrengths(area: ChasideAreaScore) {
  const strengthsByArea: Record<string, string[]> = {
    C: ['Orden para manejar información', 'Pensamiento administrativo', 'Afinidad con procesos y resultados'],
    H: ['Comunicación empática', 'Lectura social', 'Interés por comprender personas y contextos'],
    A: ['Creatividad visual o expresiva', 'Sensibilidad estética', 'Facilidad para proponer ideas originales'],
    S: ['Vocación de servicio', 'Interés por el bienestar humano', 'Disciplina para procesos de cuidado'],
    I: ['Pensamiento lógico', 'Resolución de problemas técnicos', 'Curiosidad por sistemas y tecnología'],
    D: ['Toma de decisiones bajo presión', 'Sentido de responsabilidad', 'Interés por normas y protección'],
    E: ['Razonamiento analítico', 'Precisión con datos', 'Interés por ciencia, cálculo y experimentación'],
  };

  return strengthsByArea[area.code] || area.profile.aptitudes;
}

function getSuggestedUniversities(area: ChasideAreaScore) {
  const universitiesByArea: Record<string, string[]> = {
    C: ['UDLA', 'USFQ', 'PUCE', 'Universidad Central del Ecuador'],
    H: ['PUCE', 'USFQ', 'Universidad Central del Ecuador', 'UDLA'],
    A: ['USFQ', 'UDLA', 'PUCE', 'Universidad Central del Ecuador'],
    S: ['PUCE', 'Universidad Central del Ecuador', 'UDLA', 'USFQ'],
    I: ['Escuela Politécnica Nacional', 'ESPOL', 'USFQ', 'ESPE'],
    D: ['ESPE', 'Universidad Central del Ecuador', 'UIDE', 'UTE'],
    E: ['Escuela Politécnica Nacional', 'ESPOL', 'USFQ', 'Universidad Central del Ecuador'],
  };

  return universitiesByArea[area.code] || ['USFQ', 'UDLA', 'PUCE', 'UCE'];
}

function getAiInterpretation(topAreas: ChasideAreaScore[]) {
  const primary   = topAreas[0];
  const secondary = topAreas[1];
  if (!primary) return 'Completa el test para obtener tu interpretación personalizada.';
  if (!secondary) return `Tu perfil muestra una tendencia principal hacia ${primary.name}. Compara esta área con tus materias favoritas y el tipo de vida profesional que imaginas.`;
  return `Tu perfil combina una tendencia principal hacia ${primary.name} con un apoyo importante en ${secondary.name}. Esto sugiere que podrías sentirte mejor en carreras donde uses tus intereses dominantes, pero sin descuidar habilidades complementarias. La recomendación es comparar estas áreas con tus materias favoritas, tu rendimiento académico y el tipo de vida profesional que imaginas.`;
}

function getScoreLevel(total: number): [string, number, number, number] {
  if (total >= 12) return ['MUY ALTO', 34,  197, 94];   // green
  if (total >= 8)  return ['ALTO',     27,  136, 226];  // brand blue
  if (total >= 5)  return ['MEDIO',    100, 116, 139];  // slate
  return                  ['BAJO',     148, 163, 184];  // light gray
}

function addRunningHeader(pdf: jsPDF, pageWidth: number, margin: number) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(150, 160, 180);
  pdf.text('Corporación para la Gestión del Conocimiento', margin, 11);
  pdf.text('Informe Vocacional CHASIDE', pageWidth - margin, 11, { align: 'right' });
  pdf.setDrawColor(221, 227, 240);
  pdf.setLineWidth(0.25);
  pdf.line(margin, 13, pageWidth - margin, 13);
}

function addSectionBanner(pdf: jsPDF, num: string, title: string, y: number, margin: number, cw: number): number {
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, cw, 12, 2, 2, 'F');
  pdf.setFillColor(21, 112, 196);
  pdf.circle(margin + 7.5, y + 6, 4.5, 'F');
  pdf.setTextColor('#ffffff');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.text(num, margin + 7.5, y + 7.7, { align: 'center' });
  pdf.setFontSize(11);
  pdf.text(title, margin + 16, y + 7.8);
  return y + 12;
}

function addPageNumber(pdf: jsPDF, page: number, pageWidth: number, pageHeight: number) {
  pdf.setDrawColor(221, 227, 240);
  pdf.setLineWidth(0.25);
  pdf.line(16, pageHeight - 13, pageWidth - 16, pageHeight - 13);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(150, 160, 180);
  pdf.text(String(page), pageWidth - 16, pageHeight - 7, { align: 'right' });
}

interface UnivEntry { name: string; careers: string[]; }

function getAreaUniversities(code: string): { publicas: UnivEntry[]; privadas: UnivEntry[] } {
  const map: Record<string, { publicas: UnivEntry[]; privadas: UnivEntry[] }> = {
    C: {
      publicas: [
        { name: 'UCE', careers: ['Administración de Empresas', 'Contabilidad y Auditoría', 'Economía'] },
        { name: 'ESPOL', careers: ['Ingeniería Comercial', 'Economía y Finanzas'] },
        { name: 'U. de Guayaquil', careers: ['Ingeniería Comercial', 'Contaduría Pública', 'Marketing'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Administración de Empresas', 'Contabilidad y Auditoría', 'Economía'] },
        { name: 'USFQ', careers: ['Administración', 'Economía', 'Marketing'] },
        { name: 'UDLA', careers: ['Administración', 'Marketing', 'Finanzas'] },
      ],
    },
    H: {
      publicas: [
        { name: 'UCE', careers: ['Derecho', 'Psicología', 'Trabajo Social', 'Educación'] },
        { name: 'U. de Cuenca', careers: ['Derecho', 'Ciencias Políticas y Sociales', 'Trabajo Social'] },
        { name: 'U. T. de Ambato', careers: ['Educación', 'Trabajo Social', 'Comunicación'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Derecho', 'Psicología Clínica', 'Ciencias Políticas'] },
        { name: 'USFQ', careers: ['Derecho', 'Comunicación', 'Relaciones Internacionales'] },
        { name: 'UDLA', careers: ['Comunicación', 'Psicología', 'Educación'] },
      ],
    },
    A: {
      publicas: [
        { name: 'U. de Cuenca', careers: ['Diseño Gráfico', 'Arquitectura', 'Artes Plásticas'] },
        { name: 'UCE', careers: ['Diseño Gráfico', 'Artes Plásticas', 'Teatro y Actuación'] },
        { name: 'UArtes Guayaquil', careers: ['Artes Musicales', 'Cine y Audiovisual', 'Danza'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Diseño Gráfico', 'Arquitectura'] },
        { name: 'UIDE', careers: ['Diseño Gráfico', 'Arquitectura'] },
        { name: 'U. Casa Grande', careers: ['Diseño Gráfico', 'Comunicación Audiovisual'] },
      ],
    },
    S: {
      publicas: [
        { name: 'UCE', careers: ['Medicina', 'Enfermería', 'Odontología', 'Nutrición y Dietética'] },
        { name: 'U. de Cuenca', careers: ['Medicina', 'Odontología', 'Enfermería', 'Nutrición'] },
        { name: 'U. T. de Ambato', careers: ['Medicina', 'Enfermería', 'Nutrición'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Medicina', 'Odontología', 'Enfermería', 'Fisioterapia'] },
        { name: 'UCSG', careers: ['Medicina', 'Odontología', 'Nutrición y Dietética'] },
        { name: 'USFQ', careers: ['Medicina', 'Enfermería', 'Salud Pública'] },
      ],
    },
    I: {
      publicas: [
        { name: 'EPN', careers: ['Ing. Civil', 'Ing. Mecánica', 'Ing. Sistemas', 'Ing. Eléctrica'] },
        { name: 'ESPOL', careers: ['Ing. Civil', 'Ing. Computación', 'Ing. Industrial', 'Ing. Electrónica'] },
        { name: 'ESPE', careers: ['Ing. Sistemas', 'Ing. Telecomunicaciones', 'Ing. Mecánica'] },
        { name: 'UCE', careers: ['Ing. Civil', 'Ing. Eléctrica', 'Ing. Matemática'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Ing. Sistemas y Computación', 'Ing. Civil', 'Ing. Mecánica'] },
        { name: 'USFQ', careers: ['Ciencias de la Computación', 'Ing. Civil', 'Ing. Mecánica'] },
        { name: 'UIDE', careers: ['Ing. Informática', 'Ing. Sistemas', 'Ing. Civil'] },
      ],
    },
    D: {
      publicas: [
        { name: 'ESPE', careers: ['Ciencias Militares', 'Ing. en Seguridad', 'Tecnología FFAA'] },
        { name: 'UCE', careers: ['Derecho', 'Criminología', 'Gestión de Riesgos'] },
        { name: 'U. T. de Ambato', careers: ['Gestión de Riesgos', 'Seguridad Vial'] },
      ],
      privadas: [
        { name: 'UIDE', careers: ['Seguridad Ciudadana', 'Gestión de Riesgos'] },
        { name: 'UTE', careers: ['Seguridad Industrial', 'Administración'] },
        { name: 'UDLA', careers: ['Derecho Penal', 'Criminalística'] },
      ],
    },
    E: {
      publicas: [
        { name: 'EPN', careers: ['Matemáticas', 'Física', 'Química', 'Ing. Ambiental'] },
        { name: 'ESPOL', careers: ['Biología', 'Ing. Agronómica', 'Ing. Ambiental'] },
        { name: 'UAE', careers: ['Ing. Agronómica', 'Medicina Veterinaria', 'Agroindustria'] },
        { name: 'UCE', careers: ['Bioquímica y Farmacia', 'Química', 'Ciencias Biológicas'] },
      ],
      privadas: [
        { name: 'PUCE', careers: ['Medicina Veterinaria', 'Biología', 'Bioquímica'] },
        { name: 'USFQ', careers: ['Ing. Ambiental', 'Biología', 'Química'] },
        { name: 'UCACUE', careers: ['Bioquímica y Farmacia', 'Ing. Agronómica'] },
      ],
    },
  };
  return map[code] ?? { publicas: [], privadas: [] };
}

async function buildPdfReport(student: StudentData, scores: ChasideAreaScore[], resultCode: string) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const topAreas = scores.slice(0, 2);
  const date = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const cw = pageWidth - margin * 2;
  const muted = '#5f6675';

  // Verification URL — embedded as QR in the last page
  const verifyParams = new URLSearchParams({
    t: 'ch',
    c: resultCode,
    n: `${student.nombres} ${student.apellidos}`,
    d: date,
    a1: topAreas[0]?.code ?? '',
    s1: String(topAreas[0]?.total ?? 0),
    a2: topAreas[1]?.code ?? '',
    s2: String(topAreas[1]?.total ?? 0),
  });
  const verifyUrl = `https://gescovirtual.com/verificar/?${verifyParams.toString()}`;
  let qrDataUrl: string | null = null;
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 1,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    });
  } catch { /* skip QR on error */ }

  let logo: LoadedImage | null = null;
  let logoNeg: LoadedImage | null = null;
  let firma: LoadedImage | null = null;
  try { logo    = await loadImageAsDataUrl('/img/logo-gesco.webp');    } catch { /* text fallback */ }
  try { logoNeg = await loadImageAsDataUrl('/img/logo-negativo.webp'); } catch { /* text fallback */ }
  try { firma   = await loadImageAsDataUrl('/img/firma-diego.jpg');    } catch { /* omit signature */ }

  // ── PÁGINA 1: PORTADA EDITORIAL — estilo dark navy ───────────────────────
  // Fondo navy completo
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Watermark "CH" — fantasma, esquina superior derecha, sutil
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(198);
  pdf.setTextColor(42, 42, 65);
  pdf.text('CH', pageWidth + 6, 88, { align: 'right' });

  // Logo negativo en la cabecera de la portada
  if (logoNeg) {
    const { w: lw, h: lh } = fitImage(logoNeg, 46, 14);
    pdf.addImage(logoNeg.dataUrl, 'PNG', margin, 10, lw, lh);
  } else {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.text('GESCO', margin, 20);
  }

  // Línea horizontal brand bajo el logo
  pdf.setFillColor(27, 136, 226);
  pdf.rect(margin, 26, cw, 1, 'F');

  // Título principal — 3 líneas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(36);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Informe', margin, 50);
  pdf.text('Vocacional', margin, 66);
  pdf.text('CHASIDE', margin, 82);

  // Subtítulo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(110, 130, 165);
  const coverSubtitleLines = pdf.splitTextToSize(
    'Análisis de intereses y aptitudes vocacionales para orientación de carreras universitarias en Ecuador.',
    112,
  );
  pdf.text(coverSubtitleLines, margin, 94);

  // Stats row — 3 ítems tipo contador
  const coverStatY = 108;
  const coverStatItems: [string, string][] = [
    ['98', 'PREGUNTAS'],
    ['7', 'ÁREAS'],
    [topAreas[0]?.code ?? '—', 'PERFIL PRINCIPAL'],
  ];
  const coverStatW = cw / 3;
  coverStatItems.forEach(([val, label], i) => {
    const sx = margin + i * coverStatW;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);
    pdf.setTextColor(255, 255, 255);
    pdf.text(val, sx, coverStatY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(78, 98, 148);
    pdf.text(label, sx, coverStatY + 6);
  });

  // Divisor sutil
  pdf.setDrawColor(38, 42, 68);
  pdf.setLineWidth(0.5);
  pdf.line(margin, coverStatY + 15, pageWidth - margin, coverStatY + 15);

  // Sección datos del estudiante
  const coverSY = coverStatY + 25;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(72, 90, 135);
  pdf.text('INFORME PREPARADO PARA', margin, coverSY);

  const fullName = `${student.nombres} ${student.apellidos}`.trim().toUpperCase();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  const fullNameLines = pdf.splitTextToSize(fullName, cw);
  pdf.text(fullNameLines, margin, coverSY + 10);

  const nameBlockEnd = coverSY + 10 + (fullNameLines.length - 1) * 7;

  // Línea separadora bajo nombre
  pdf.setDrawColor(38, 45, 72);
  pdf.setLineWidth(0.35);
  pdf.line(margin, nameBlockEnd + 7, pageWidth - margin, nameBlockEnd + 7);

  // Metadata — dos cajas oscuras
  const coverMetaY = nameBlockEnd + 15;
  const coverHalfW = (cw - 6) / 2;

  pdf.setFillColor(32, 35, 58);
  pdf.roundedRect(margin, coverMetaY, coverHalfW, 15, 3, 3, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, coverMetaY, 2.5, 15, 1.5, 1.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(78, 98, 148);
  pdf.text('FECHA DE EMISIÓN', margin + 7, coverMetaY + 5.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(215, 228, 248);
  pdf.text(date, margin + 7, coverMetaY + 12);

  const coverCodeX = margin + coverHalfW + 6;
  pdf.setFillColor(32, 35, 58);
  pdf.roundedRect(coverCodeX, coverMetaY, coverHalfW, 15, 3, 3, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(coverCodeX, coverMetaY, 2.5, 15, 1.5, 1.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(78, 98, 148);
  pdf.text('CÓDIGO DE RESULTADO', coverCodeX + 7, coverMetaY + 5.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(215, 228, 248);
  pdf.text(resultCode, coverCodeX + 7, coverMetaY + 12);

  // Perfil dominante — label + tarjetas oscuras
  const coverPerfY = coverMetaY + 22;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(72, 90, 135);
  pdf.text('PERFIL VOCACIONAL DOMINANTE', margin, coverPerfY);

  const coverCardW = (cw - 6) / 2;
  topAreas.forEach((area, i) => {
    const [, lr, lg, lb] = getScoreLevel(area.total);
    const pcx = margin + i * (coverCardW + 6);
    const pcY = coverPerfY + 6;
    pdf.setFillColor(32, 35, 58);
    pdf.roundedRect(pcx, pcY, coverCardW, 20, 3, 3, 'F');
    pdf.setFillColor(lr, lg, lb);
    pdf.roundedRect(pcx, pcY, 3, 20, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(244, 196, 48);
    pdf.text(`#${i + 1} AREA DE ${i === 0 ? 'INTERES' : 'APTITUD'}`, pcx + 8, pcY + 6);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(215, 228, 248);
    const coverAreaName = pdf.splitTextToSize(area.name, coverCardW - 46);
    pdf.text(coverAreaName, pcx + 8, pcY + 14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(lr, lg, lb);
    pdf.text(`${area.total}/14`, pcx + coverCardW - 5, pcY + 14, { align: 'right' });
  });

  // Disclaimer
  const coverDiscY = coverPerfY + 33;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.setTextColor(58, 72, 108);
  const coverDisclaimLines = pdf.splitTextToSize(
    'Este informe es de carácter orientativo. No constituye diagnóstico psicológico ni reemplaza la orientación vocacional profesional.',
    cw,
  );
  pdf.text(coverDisclaimLines, pageWidth / 2, coverDiscY, { align: 'center' });

  // Footer — línea accent + contacto
  pdf.setFillColor(27, 136, 226);
  pdf.rect(0, pageHeight - 18, pageWidth, 1.2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(185, 205, 238);
  pdf.text('Corporación para la Gestión del Conocimiento', margin, pageHeight - 9);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(82, 102, 148);
  pdf.text('gescovirtual.com  ·  +593 999 216 079', margin, pageHeight - 3.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(96, 120, 172);
  pdf.text('Orientación Vocacional y Preparación Universitaria', pageWidth - margin, pageHeight - 6, { align: 'right' });

  // ── PÁGINA 2: ACERCA DEL TEST CHASIDE + ÍNDICE ────────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);

  // Banda superior compacta con logo
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, 14, pageWidth, 26, 'F');
  if (logo) {
    const { w: lw, h: lh } = fitImage(logo, 48, 20);
    pdf.addImage(logo.dataUrl, 'PNG', pageWidth - margin - lw, 17 + (20 - lh) / 2, lw, lh);
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Acerca del Test', margin, 28);
  pdf.setFillColor(27, 136, 226);
  pdf.rect(margin, 31, 16, 1.6, 'F');

  let y = 46;

  // ── Cajas de info lado a lado ─────────────────────────────────────────────
  const p2ColW = (cw - 5) / 2;
  const p2ColR = margin + p2ColW + 5;

  const p2Text1 = 'Evalua intereses y aptitudes en 7 areas: Administrativas (C), Humanisticas (H), Artisticas (A), Salud (S), Ingenieria (I), Defensa (D) y Ciencias Exactas (E). Instrumento orientativo de apoyo a la decision vocacional.';
  const p2Text2 = 'Los puntajes combinan intereses y aptitudes. Niveles ALTO o MUY ALTO indican mayor compatibilidad con las carreras de esa area. Se recomienda complementar con orientacion personalizada.';

  pdf.setFontSize(7.5);
  const p2L1 = pdf.splitTextToSize(p2Text1, p2ColW - 11) as string[];
  const p2L2 = pdf.splitTextToSize(p2Text2, p2ColW - 11) as string[];
  const p2BoxH = Math.max(8 + 6 + p2L1.length * 4.1 + 4, 8 + 6 + p2L2.length * 4.1 + 4);

  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, p2ColW, p2BoxH, 4, 4, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 3.5, p2BoxH, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Que es el Test CHASIDE?', margin + 8, y + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(55, 70, 100);
  pdf.text(p2L1, margin + 8, y + 14);

  pdf.setFillColor(248, 249, 250);
  pdf.roundedRect(p2ColR, y, p2ColW, p2BoxH, 4, 4, 'F');
  pdf.setFillColor(21, 112, 196);
  pdf.roundedRect(p2ColR, y, 3.5, p2BoxH, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Por que son importantes?', p2ColR + 8, y + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(55, 70, 100);
  pdf.text(p2L2, p2ColR + 8, y + 14);

  y += p2BoxH + 8;

  // ── Título índice ─────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Contenido del informe', margin, y);
  pdf.setFillColor(27, 136, 226);
  pdf.rect(margin, y + 3, 16, 1.5, 'F');
  y += 11;

  // ── Índice 2 columnas × 3 filas ───────────────────────────────────────────
  const indexItems: Array<[string, string, string]> = [
    ['1', 'RESULTADO GENERAL',  'Areas principales e interpretacion del perfil'],
    ['2', 'MAPA DE AFINIDADES', 'Puntajes de las 7 areas con niveles'],
    ['3', 'ANALISIS VOCACIONAL','Perfil detallado y carreras compatibles'],
    ['4', 'OFERTA LABORAL',     'Demanda laboral estimada en Ecuador'],
    ['5', 'UNIVERSIDADES',      'Universidades recomendadas por area'],
    ['6', 'PLAN DE ACCION',     'Proximos pasos con GESCO'],
  ];
  const idxColW = (cw - 5) / 2;
  const idxRowH = 16;
  const idxGap  = 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const item = indexItems[row * 2 + col];
      const ix = margin + col * (idxColW + 5);
      const iy = y + row * (idxRowH + idxGap);

      pdf.setFillColor(248, 249, 250);
      pdf.roundedRect(ix, iy, idxColW, idxRowH, 2.5, 2.5, 'F');
      pdf.setFillColor(27, 136, 226);
      pdf.circle(ix + 8.5, iy + 8, 5.5, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.text(item[0], ix + 8.5, iy + 9.7, { align: 'center' });
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(26, 26, 46);
      pdf.text(item[1], ix + 18, iy + 6.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.setTextColor(100, 115, 135);
      pdf.text(item[2], ix + 18, iy + 12.5);
    }
  }

  y += 3 * (idxRowH + idxGap) + 6;

  // ── Escala de niveles ─────────────────────────────────────────────────────
  pdf.setFillColor(26, 26, 46);
  pdf.roundedRect(margin, y, cw, 21, 4, 4, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(180, 210, 255);
  pdf.text('Escala de niveles de afinidad', margin + 8, y + 8);
  const levelDefs: Array<[string, number, number, number]> = [
    ['BAJO 0-4',       148, 163, 184],
    ['MEDIO 5-7',      100, 116, 139],
    ['ALTO 8-11',       27, 136, 226],
    ['MUY ALTO 12-14',  34, 197,  94],
  ];
  const lDefW = (cw - 18) / 4;
  levelDefs.forEach(([label, lr, lg, lb], i) => {
    const lx = margin + 8 + i * (lDefW + 2);
    pdf.setFillColor(lr, lg, lb);
    pdf.roundedRect(lx, y + 11, lDefW, 7.5, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.text(label, lx + lDefW / 2, y + 16.5, { align: 'center' });
  });

  // ── Nota metodológica ─────────────────────────────────────────────────────
  y += 21 + 8;

  const notaLines: Array<{ bold: boolean; text: string }> = [
    { bold: true,  text: 'Como leer este informe' },
    { bold: false, text: 'El test CHASIDE mide tu nivel de afinidad en 7 grandes areas del conocimiento a traves de 98 preguntas. Cada area recibe un puntaje de 0 a 14: cuanto mayor sea, mayor es tu identificacion con ese campo.' },
    { bold: false, text: 'Los resultados son orientativos y complementan — no reemplazan — la orientacion de un profesional. Usalo como punto de partida para explorar opciones academicas y conversarlas con tu familia y consejero.' },
    { bold: false, text: 'En las siguientes paginas encontraras el detalle de tus puntajes, las carreras mas afines a tu perfil, la demanda laboral estimada en Ecuador y las universidades recomendadas por area.' },
  ];

  const notaPad = 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);

  const notaBodyLines: string[] = [];
  notaLines.slice(1).forEach(l => {
    const wrapped = pdf.splitTextToSize(l.text, cw - notaPad * 2 - 4) as string[];
    notaBodyLines.push(...wrapped);
  });
  const notaBoxH = notaPad + 5.5 + 3 + notaBodyLines.length * 4 + notaPad;

  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, cw, notaBoxH, 4, 4, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 3.5, notaBoxH, 2, 2, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(27, 136, 226);
  pdf.text('Como leer este informe', margin + notaPad, y + notaPad + 1);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(51, 65, 85);
  pdf.text(notaBodyLines, margin + notaPad, y + notaPad + 1 + 5.5 + 2, { lineHeightFactor: 1.45 });

  addPageNumber(pdf, 2, pageWidth, pageHeight);

  // ── PÁGINA 3: RESULTADO GENERAL + MAPA DE AFINIDADES ─────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);

  y = 20;

  // ── Bloque navy RESULTADO GENERAL — estilo web ─────────────────────────
  const resBlockH = 94;
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, y, pageWidth, resBlockH, 'F');

  // "RESULTADO ORIENTATIVO" etiqueta dorada
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(244, 196, 48);
  pdf.text('RESULTADO ORIENTATIVO', margin, y + 10);

  // Título
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Tus dos áreas principales', margin, y + 21);

  // Tarjetas
  const cardW = (cw - 6) / 2;
  const cardsY = y + 29;
  const cardH = 52;

  topAreas.forEach((area, index) => {
    const cx = margin + index * (cardW + 6);

    // Fondo tarjeta navy ligeramente más claro
    pdf.setFillColor(36, 40, 68);
    pdf.roundedRect(cx, cardsY, cardW, cardH, 4, 4, 'F');
    // Borde sutil blanco
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.12);
    pdf.roundedRect(cx, cardsY, cardW, cardH, 4, 4, 'S');

    // "#1 ÁREA DE INTERÉS" / "#2 ÁREA DE APTITUD" en dorado
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(244, 196, 48);
    pdf.text(`#${index + 1} AREA DE ${index === 0 ? 'INTERES' : 'APTITUD'}`, cx + 6, cardsY + 7);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    pdf.setTextColor(180, 190, 220);
    pdf.text(index === 0 ? 'Lo que mas te apasiona' : 'En lo que mas destacas', cx + 6, cardsY + 12);

    // Nombre del área (hasta 2 líneas)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    const rcNameLines = (pdf.splitTextToSize(area.name, cardW - 10) as string[]).slice(0, 2);
    pdf.text(rcNameLines, cx + 6, cardsY + 20);
    const rcNameEnd = cardsY + 20 + (rcNameLines.length - 1) * 5.5;

    // Descripción (hasta 3 líneas)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(128, 145, 185);
    const rcDescLines = (pdf.splitTextToSize(area.profile.description, cardW - 10) as string[]).slice(0, 3);
    pdf.text(rcDescLines, cx + 6, rcNameEnd + 7);

    // "Total: X puntos" — fijo en la parte baja
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Total: ${area.total} puntos`, cx + 6, cardsY + cardH - 7);
  });

  y = y + resBlockH + 6;

  // Caja de interpretación — alto calculado según el texto real
  const interpText = getAiInterpretation(topAreas);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  const interpLines = pdf.splitTextToSize(interpText, cw - 12);
  const interpBoxH = 6 + 5 + interpLines.length * 4 + 4; // título + gap + texto + padding inferior
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, cw, interpBoxH, 4, 4, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 3.5, interpBoxH, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(27, 136, 226);
  pdf.text('Interpretacion del perfil', margin + 8, y + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(55, 70, 95);
  pdf.text(interpLines, margin + 8, y + 12);
  y += interpBoxH + 4;

  y = addSectionBanner(pdf, '2', 'MAPA DE AFINIDADES', y, margin, cw);
  y += 5;

  // Barras en orden CHASIDE (C H A S I D E)
  const chasideOrder = ['C', 'H', 'A', 'S', 'I', 'D', 'E'];
  const sortedScores = [...scores].sort(
    (a, b) => chasideOrder.indexOf(a.code) - chasideOrder.indexOf(b.code),
  );

  sortedScores.forEach((area) => {
    const [levelLabel, lr, lg, lb] = getScoreLevel(area.total);

    // Fondo de fila
    pdf.setFillColor(248, 250, 255);
    pdf.roundedRect(margin, y, cw, 12, 2, 2, 'F');
    pdf.setDrawColor(220, 230, 248);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(margin, y, cw, 12, 2, 2, 'S');

    // Tag nivel — extremo derecho, primera fila
    pdf.setFontSize(5.5);
    const tagW = pdf.getTextWidth(levelLabel) + 6;
    const tagX = pageWidth - margin - 3 - tagW;
    pdf.setFillColor(lr, lg, lb);
    pdf.roundedRect(tagX, y + 1, tagW, 4.5, 1.5, 1.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(levelLabel, tagX + tagW / 2, y + 4.5, { align: 'center' });

    // Nombre área izquierda
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(26, 26, 46);
    pdf.text(`${area.code} — ${area.name}`, margin + 5, y + 5);

    // Stats — a la izquierda del tag (con hueco de 5mm)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(lr, lg, lb);
    pdf.text(
      `Int ${area.interests}  ·  Apt ${area.aptitudes}  ·  Tot ${area.total}`,
      tagX - 4,
      y + 5,
      { align: 'right' },
    );

    // Barra ancha
    const bx = margin + 5;
    const bw = cw - 10;
    pdf.setFillColor(222, 232, 248);
    pdf.roundedRect(bx, y + 8, bw, 2.5, 1.25, 1.25, 'F');
    const filledW = bw * (area.total / 14);
    if (filledW > 0) {
      pdf.setFillColor(lr, lg, lb);
      pdf.roundedRect(bx, y + 8, filledW, 2.5, 1.25, 1.25, 'F');
    }

    y += 13;
  });

  addPageNumber(pdf, 3, pageWidth, pageHeight);

  // ── PÁGINA 4: ANÁLISIS VOCACIONAL DETALLADO ───────────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);
  y = 20;

  y = addSectionBanner(pdf, '3', 'ANÁLISIS VOCACIONAL DETALLADO', y, margin, cw);
  y += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(muted);
  y = addWrappedText(pdf, 'Análisis de las dos áreas con mayor afinidad vocacional. Los datos presentados son orientativos y deben complementarse con una evaluación profesional.', margin, y, cw, 4.5);
  y += 7;

  topAreas.forEach((area, areaIndex) => {
    const [, lr, lg, lb] = getScoreLevel(area.total);
    if (areaIndex > 0) {
      pdf.setDrawColor(215, 224, 240);
      pdf.setLineWidth(0.4);
      pdf.line(margin, y - 3, pageWidth - margin, y - 3);
      y += 3;
    }
    // Encabezado del área
    pdf.setFillColor(lr, lg, lb);
    pdf.roundedRect(margin, y, 3.5, 13, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(lr, lg, lb);
    pdf.text(`AREA DE ${areaIndex === 0 ? 'INTERES' : 'APTITUD'}`, margin + 7, y + 5.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(lr, lg, lb);
    pdf.text(area.name, margin + 7, y + 13);
    // Badge puntaje
    pdf.setFillColor(lr, lg, lb);
    pdf.roundedRect(pageWidth - margin - 36, y + 3, 36, 9, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(`${area.total}/14 pts`, pageWidth - margin - 18, y + 9, { align: 'center' });
    y += 22;

    // Descripción
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(65, 80, 105);
    y = addWrappedText(pdf, area.profile.description, margin, y, cw, 4.5);
    y += 12;

    // Filas de datos
    const dataRows: Array<[string, number, string]> = [
      ['Aptitudes clave:', 36, getStrengths(area).join('  ·  ')],
      ['Intereses frecuentes:', 46, area.profile.interests.join(', ')],
      ['Carreras compatibles:', 46, area.profile.careers.slice(0, 5).join(', ')],
      ['Universidades en Ecuador:', 54, getSuggestedUniversities(area).join(', ')],
    ];
    dataRows.forEach(([label, lw, value]) => {
      pdf.setFillColor(lr, lg, lb);
      pdf.circle(margin + 2.5, y - 1.5, 1.5, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(26, 26, 46);
      pdf.text(label, margin + 6, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(muted);
      y = addWrappedText(pdf, value, margin + 6 + lw, y, cw - 6 - lw, 4.5);
      y += 3;
    });
    y += 8;
  });

  addPageNumber(pdf, 4, pageWidth, pageHeight);

  // ── PÁGINA 5: OFERTA LABORAL EN ECUADOR ──────────────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);
  y = 20;

  y = addSectionBanner(pdf, '4', 'OFERTA LABORAL EN ECUADOR', y, margin, cw);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(muted);
  const laborLines = pdf.splitTextToSize(
    'Estimación orientativa de demanda laboral relativa en Ecuador para las carreras de tu perfil vocacional. Basada en tendencias de SENESCYT, ENEMDU y medios académicos nacionales. No representa una tasa oficial de empleo.',
    cw,
  );
  pdf.text(laborLines, margin, y);
  y += (laborLines as string[]).length * 4.5 + 4;

  // Leyenda de escala
  const scaleItems5: Array<[[number, number, number], string]> = [
    [[22,  163, 74 ], 'Muy Alta 81-100%'],
    [[27,  136, 226], 'Alta 70-80%'],
    [[8,   145, 178], 'Media-Alta 60-69%'],
    [[100, 116, 139], 'Media 45-59%'],
    [[148, 163, 184], 'Baja menos 45%'],
  ];
  const scaleW5 = cw / scaleItems5.length;
  scaleItems5.forEach(([rgb, label], i) => {
    pdf.setFillColor(...rgb);
    pdf.roundedRect(margin + i * scaleW5, y, scaleW5 - 2, 5.5, 1, 1, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(label, margin + i * scaleW5 + (scaleW5 - 2) / 2, y + 3.8, { align: 'center' });
  });
  y += 11;

  topAreas.forEach((area, aIdx) => {
    const sl       = getScoreLevel(area.total);
    const areaRgb: [number, number, number] = [sl[1], sl[2], sl[3]];
    const careers5 = (carrerasMercado[area.code] ?? []).slice(0, 8);

    // Cabecera del área
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, y, cw, 12, 3, 3, 'F');
    pdf.setFillColor(...areaRgb);
    pdf.roundedRect(margin, y, 4, 12, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(26, 26, 46);
    pdf.text(area.name, margin + 9, y + 8.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...areaRgb);
    pdf.text(`${area.total}/14 · #${aIdx + 1} ÁREA`, pageWidth - margin - 3, y + 8.5, { align: 'right' });
    y += 14;

    // Encabezados de columna
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(150, 160, 180);
    pdf.text('CARRERA', margin + 3, y + 4.5);
    pdf.text('DEMANDA LABORAL ESTIMADA EN ECUADOR', margin + cw * 0.43, y + 4.5);
    pdf.text('NIVEL', pageWidth - margin - 3, y + 4.5, { align: 'right' });
    y += 8;

    // Filas de carreras
    careers5.forEach((career, i) => {
      const rgb5 = getLevelColor(career.porcentaje);
      const rowH = 9;

      pdf.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 250);
      pdf.rect(margin, y, cw, rowH, 'F');

      // Nombre
      pdf.setFont('helvetica', i < 3 ? 'bold' : 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(26, 26, 46);
      pdf.text(career.nombre, margin + 3, y + 6);

      // Barra de progreso
      const barX5 = margin + cw * 0.43;
      const barW5 = cw * 0.35;
      const barH5 = 3.5;
      const barY5 = y + (rowH - barH5) / 2;
      pdf.setFillColor(222, 232, 248);
      pdf.roundedRect(barX5, barY5, barW5, barH5, 1.5, 1.5, 'F');
      const filled5 = barW5 * (career.porcentaje / 100);
      if (filled5 > 0) {
        pdf.setFillColor(...rgb5);
        pdf.roundedRect(barX5, barY5, filled5, barH5, 1.5, 1.5, 'F');
      }

      // Porcentaje
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...rgb5);
      pdf.text(`${career.porcentaje}%`, barX5 + barW5 + 4, y + 6);

      // Badge de nivel
      const lvW5 = pdf.getTextWidth(career.nivel) + 6;
      pdf.setFillColor(...rgb5);
      pdf.roundedRect(pageWidth - margin - lvW5, y + 1.5, lvW5, 6, 1.5, 1.5, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(5.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text(career.nivel, pageWidth - margin - lvW5 / 2, y + 5.8, { align: 'center' });

      y += rowH;
    });

    if (aIdx < topAreas.length - 1) y += 8;
  });

  // Nota metodológica
  y += 7;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.setTextColor(148, 163, 184);
  const methodLines5 = pdf.splitTextToSize(
    'Fuentes: SENESCYT (Acceso a la Educación Superior), ENEMDU (Ecuador en Cifras), UNIR Ecuador, La Hora Ecuador. Los porcentajes son estimaciones orientativas, no tasas oficiales de empleo ni garantías de contratación.',
    cw,
  );
  pdf.text(methodLines5, margin, y);

  addPageNumber(pdf, 5, pageWidth, pageHeight);

  // ── PÁGINA 6: UNIVERSIDADES RECOMENDADAS POR ÁREA ────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);
  y = 20;

  y = addSectionBanner(pdf, '5', 'UNIVERSIDADES RECOMENDADAS POR ÁREA', y, margin, cw);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(muted);
  const univIntroLines = pdf.splitTextToSize(
    'Instituciones del Ecuador con oferta académica en las áreas de mayor afinidad del estudiante, organizadas por tipo de financiamiento.',
    cw,
  );
  pdf.text(univIntroLines, margin, y);
  y += univIntroLines.length * 4.5 + 6;

  const uColGap = 4;
  const uColW = (cw - uColGap) / 2;
  const uColRX = margin + uColW + uColGap;

  topAreas.forEach((area, aIdx) => {
    const [, alr, alg, alb] = getScoreLevel(area.total);
    const univData = getAreaUniversities(area.code);

    // Encabezado del área
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, y, cw, 13, 3, 3, 'F');
    pdf.setFillColor(alr, alg, alb);
    pdf.roundedRect(margin, y, 4, 13, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(26, 26, 46);
    pdf.text(area.name, margin + 9, y + 9);
    const sBadgeW = 36;
    pdf.setFillColor(alr, alg, alb);
    pdf.roundedRect(pageWidth - margin - sBadgeW, y + 3, sBadgeW, 7, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text(`${area.total}/14 · #${aIdx + 1} ÁREA`, pageWidth - margin - sBadgeW / 2, y + 7.8, { align: 'center' });
    y += 16;

    // Encabezados de columna
    pdf.setFillColor(27, 136, 226);
    pdf.roundedRect(margin, y, uColW, 8, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.text('UNIVERSIDADES PÚBLICAS', margin + uColW / 2, y + 5.5, { align: 'center' });

    pdf.setFillColor(26, 26, 46);
    pdf.roundedRect(uColRX, y, uColW, 8, 2, 2, 'F');
    pdf.text('UNIVERSIDADES PRIVADAS', uColRX + uColW / 2, y + 5.5, { align: 'center' });
    y += 11;

    // Filas de universidades
    const maxRows = Math.max(univData.publicas.length, univData.privadas.length);
    for (let uRow = 0; uRow < maxRows; uRow++) {
      const pub = univData.publicas[uRow];
      const priv = univData.privadas[uRow];
      const eH = 12;

      if (pub) {
        pdf.setFillColor(248, 250, 255);
        pdf.roundedRect(margin, y, uColW, eH, 2, 2, 'F');
        pdf.setDrawColor(215, 228, 248);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(margin, y, uColW, eH, 2, 2, 'S');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(26, 26, 46);
        pdf.text(pub.name, margin + 5, y + 5.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(100, 115, 140);
        const pubLine = (pdf.splitTextToSize(pub.careers.slice(0, 3).join('  ·  '), uColW - 8) as string[])[0] ?? '';
        pdf.text(pubLine, margin + 5, y + 9.5);
      }

      if (priv) {
        pdf.setFillColor(248, 250, 255);
        pdf.roundedRect(uColRX, y, uColW, eH, 2, 2, 'F');
        pdf.setDrawColor(215, 228, 248);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(uColRX, y, uColW, eH, 2, 2, 'S');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(26, 26, 46);
        pdf.text(priv.name, uColRX + 5, y + 5.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(100, 115, 140);
        const privLine = (pdf.splitTextToSize(priv.careers.slice(0, 3).join('  ·  '), uColW - 8) as string[])[0] ?? '';
        pdf.text(privLine, uColRX + 5, y + 9.5);
      }

      y += eH + 2;
    }

    if (aIdx < topAreas.length - 1) y += 8;
  });

  // Nota informativa + disclaimer
  y += 6;
  const disclaimerText = 'Esta lista es referencial. Existen otras universidades en Ecuador que también ofrecen estas carreras. La oferta académica, requisitos y costos pueden cambiar según el ciclo de admisión. Verifica la información vigente directamente en el sitio web oficial de cada institución antes de postular.';
  pdf.setFontSize(7);
  const disclaimerArr = pdf.splitTextToSize(disclaimerText, cw - 10) as string[];
  const noteBoxH = 8 + 5.5 + 5 + disclaimerArr.length * 4.5 + 4;
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, cw, noteBoxH, 3, 3, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 3, noteBoxH, 1.5, 1.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(27, 136, 226);
  pdf.text('Importante:', margin + 7, y + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(55, 70, 100);
  pdf.text('Universidades públicas: gratuitas según la Constitución del Ecuador.', margin + 38, y + 7);
  pdf.setFontSize(7);
  pdf.setTextColor(100, 115, 140);
  pdf.text('Admisión pública: ser.gob.ec (SNNA)  ·  Privadas: consultar directamente cada institución.', margin + 7, y + 12.5);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(120, 138, 175);
  pdf.text(disclaimerArr, margin + 7, y + 18);

  addPageNumber(pdf, 6, pageWidth, pageHeight);

  // ── PÁGINA 7: PLAN DE ACCIÓN CON GESCO ───────────────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);
  y = 20;

  y = addSectionBanner(pdf, '6', 'PLAN DE ACCIÓN CON GESCO', y, margin, cw);
  y += 10;

  // 3 pasos
  const steps: Array<[string, string, number, number, number]> = [
    ['Sesión de Orientación Vocacional', 'Se analizan los resultados CHASIDE junto con materias de mayor desempeño y metas personales para definir un perfil vocacional completo.', 27, 136, 226],
    ['Mapa de Carreras y Universidades', 'Se comparan opciones académicas disponibles en Ecuador considerando perfil, modalidad, costo y procesos de admisión vigentes.', 21, 112, 196],
    ['Ruta de Preparación Personalizada', 'Se diseña un plan de estudio en razonamiento, lectura crítica, matemáticas, inglés o simulacros según la universidad objetivo.', 26, 26, 46],
  ];
  steps.forEach(([title, text, sr, sg, sb], i) => {
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, y, cw, 32, 4, 4, 'F');
    pdf.setFillColor(sr, sg, sb);
    pdf.circle(margin + 12, y + 16, 9, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(String(i + 1), margin + 12, y + 19, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(26, 26, 46);
    pdf.text(title, margin + 26, y + 11);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(muted);
    addWrappedText(pdf, text, margin + 26, y + 19, cw - 30, 4.5);
    y += 36;
  });

  y += 4;

  // Servicios GESCO
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, cw, 46, 5, 5, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 4, 46, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Servicios Corporación para la Gestión del Conocimiento', margin + 10, y + 9);
  const services = [
    'Preuniversitario online (públicas y privadas)',
    'Simuladores reales de examen de admisión',
    'Clases en vivo con docentes especializados',
    'Salvavidas Académico y refuerzo de materias',
    'Orientación vocacional con asesor académico',
    'Plataforma Gesco y material de estudio',
  ];
  const svcHalf = Math.ceil(services.length / 2);
  services.forEach((s, i) => {
    const col = i < svcHalf ? 0 : 1;
    const row = i < svcHalf ? i : i - svcHalf;
    const sx = margin + 10 + col * (cw / 2);
    const sy = y + 18 + row * 9;
    pdf.setFillColor(27, 136, 226);
    pdf.circle(sx + 2.5, sy - 1, 2.5, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(50, 65, 90);
    pdf.text(s, sx + 7, sy);
  });
  y += 52;

  // CTA box navy
  pdf.setFillColor(26, 26, 46);
  pdf.roundedRect(margin, y, cw, 50, 6, 6, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 4, 50, 3, 3, 'F');
  // Círculo decorativo
  pdf.setFillColor(38, 58, 110);
  pdf.circle(pageWidth - margin - 14, y + 25, 20, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.circle(pageWidth - margin - 14, y + 25, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  const ctaLines = pdf.splitTextToSize('Convierte este resultado en una decisión segura', cw * 0.66);
  pdf.text(ctaLines, margin + 10, y + 12);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(180, 200, 235);
  addWrappedText(pdf, 'Agenda tu sesión de orientación y comienza con un plan claro hacia la universidad.', margin + 10, y + 26, cw * 0.64, 4.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text('gescovirtual.com', margin + 10, y + 38);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(180, 200, 235);
  pdf.text('+593 999 216 079', margin + 10, y + 45);

  addPageNumber(pdf, 7, pageWidth, pageHeight);

  // ── PÁGINA 8: CIERRE FORMAL CON FIRMA ─────────────────────────────────────
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  addRunningHeader(pdf, pageWidth, margin);

  // Banda navy superior
  const bandY = 14;
  const bandH = 38;
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, bandY, pageWidth, bandH, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.rect(0, bandY, pageWidth, 1.5, 'F');

  // Logo — pequeño, dentro de la banda, alineado a la derecha y centrado verticalmente
  const logoBoxW = 46;
  const logoBoxH = 22;
  const logoBoxX = pageWidth - margin - logoBoxW;
  const logoBoxY = bandY + (bandH - logoBoxH) / 2;
  if (logo) {
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH, 4, 4, 'F');
    const { w: lw, h: lh } = fitImage(logo, logoBoxW - 6, logoBoxH - 6);
    pdf.addImage(logo.dataUrl, 'PNG', logoBoxX + (logoBoxW - lw) / 2, logoBoxY + (logoBoxH - lh) / 2, lw, lh);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(255, 255, 255);
  const p6TitleLines = pdf.splitTextToSize(
    'Validado por Corporación para la Gestión del Conocimiento',
    logoBoxX - margin - 6,
  ) as string[];
  let p6TitleY = p6TitleLines.length === 1 ? 32 : 27;
  p6TitleLines.forEach((line: string) => { pdf.text(line, margin, p6TitleY); p6TitleY += 5.5; });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 180, 230);
  pdf.text('Orientación Vocacional y Preparación Universitaria', margin, p6TitleY + 2);

  y = 64;

  // Cuerpo formal
  pdf.setFillColor(248, 249, 250);
  pdf.roundedRect(margin, y, cw, 52, 5, 5, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 4, 52, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(26, 26, 46);
  pdf.text(`Quito, ${date}`, margin + 10, y + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(55, 70, 100);
  let ty = y + 19;
  ty = addWrappedText(pdf,
    `El presente informe ha sido generado a partir de las respuestas del estudiante ${student.nombres} ${student.apellidos} al Test Vocacional CHASIDE, administrado mediante la plataforma digital de Corporación para la Gestión del Conocimiento.`,
    margin + 10, ty, cw - 14, 4.5,
  );
  ty += 5;
  ty = addWrappedText(pdf,
    'El resultado tiene carácter orientativo y forma parte del proceso de orientación vocacional de Corporación para la Gestión del Conocimiento. Se recomienda complementar este informe con una sesión de orientación personalizada con uno de nuestros asesores académicos.',
    margin + 10, ty, cw - 14, 4.5,
  );
  y += 58;

  // Bloque de firma
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, y, 96, 56, 5, 5, 'F');
  if (firma) {
    const { w: fw, h: fh } = fitImage(firma, 58, 28);
    pdf.addImage(firma.dataUrl, 'PNG', margin + 8, y + 4 + (28 - fh) / 2, fw, fh);
  }
  pdf.setDrawColor(190, 200, 220);
  pdf.setLineWidth(0.4);
  pdf.line(margin + 8, y + 36, margin + 8 + 72, y + 36);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Mgtr. Diego Polanco', margin + 8, y + 43);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(muted);
  pdf.text('Director Académico', margin + 8, y + 49);
  pdf.text('Corporación para la Gestión del Conocimiento', margin + 8, y + 54);
  y += 62;

  // Panel de verificación — QR + datos de autenticidad
  const qrSize = 26;
  const verifyBoxH = qrSize + 10;
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, cw, verifyBoxH, 4, 4, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.roundedRect(margin, y, 3, verifyBoxH, 2, 2, 'F');

  // QR a la izquierda
  if (qrDataUrl) {
    pdf.addImage(qrDataUrl, 'PNG', margin + 7, y + (verifyBoxH - qrSize) / 2, qrSize, qrSize);
  }

  // Textos a la derecha del QR
  const verifyTextX = margin + 7 + qrSize + 6;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(27, 136, 226);
  pdf.text('Verificar autenticidad', verifyTextX, y + 8);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(80, 105, 150);
  pdf.text('Escanea el código QR con la cámara de tu teléfono para comprobar', verifyTextX, y + 14);
  pdf.text('la validez de este documento en gescovirtual.com/verificar/', verifyTextX, y + 19.5);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(100, 120, 165);
  pdf.text(`Código: ${resultCode}`, verifyTextX, y + 27);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(150, 165, 195);
  pdf.text('Corporación para la Gestión del Conocimiento © 2026  ·  Todos los derechos reservados', verifyTextX, y + 33);
  y += verifyBoxH + 4;

  // Banda footer
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, pageHeight - 16, pageWidth, 16, 'F');
  pdf.setFillColor(27, 136, 226);
  pdf.rect(0, pageHeight - 16, pageWidth, 1.2, 'F');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(150, 180, 230);
  pdf.text('gescovirtual.com  ·  +593 999 216 079  ·  gescocorporacion@gmail.com', pageWidth / 2, pageHeight - 5, { align: 'center' });

  addPageNumber(pdf, 8, pageWidth, pageHeight);

  return pdf;
}

interface ChasideTestProps {
  apiToken?: string;
}

export default function ChasideTest({ apiToken = '' }: ChasideTestProps) {
  const [student, setStudent] = useState<StudentData>(initialStudentData);
  const [answers, setAnswers] = useState<Partial<ChasideAnswers>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<TestStage>('questions');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [resultCode, setResultCode] = useState<string>('');

  const currentQuestion = chasideQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / chasideQuestions.length) * 100);
  const isComplete = areAllChasideQuestionsAnswered(answers);
  const scores = useMemo(() => (isComplete ? scoreChaside(answers as ChasideAnswers) : []), [answers, isComplete]);
  const topAreas = scores.slice(0, 2);
  const maxScore = Math.max(...scores.map((area) => area.total), 1);

  const updateAnswer = (value: ChasideAnswer) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    setMessage('');
  };

  const goNext = () => {
    if (currentIndex < chasideQuestions.length - 1) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    if (!isComplete) {
      setMessage('Responde todas las preguntas antes de continuar.');
      return;
    }

    setStage('lead');
    setMessage('');
  };

  const showResults = () => {
    const validationMessage = validateStudentData(student);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    const code = generateResultCode();
    setResultCode(code);
    setStage('results');
    setMessage('');

    // Guardar lead en Supabase (fire and forget — no bloquea la UI)
    const topAreas = scoreChaside(answers as ChasideAnswers).slice(0, 2);
    fetch('/api/guardar-resultado/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken ? { 'X-Request-Token': apiToken } : {}),
      },
      body: JSON.stringify({
        codigo:         code,
        nombres:        student.nombres,
        apellidos:      student.apellidos,
        correo:         student.correo,
        telefono:       student.telefono || null,
        area1_codigo:   topAreas[0]?.code ?? '',
        area1_nombre:   topAreas[0]?.name ?? '',
        area1_puntaje:  topAreas[0]?.total ?? 0,
        area2_codigo:   topAreas[1]?.code ?? null,
        area2_nombre:   topAreas[1]?.name ?? null,
        area2_puntaje:  topAreas[1]?.total ?? null,
        acepta_contacto: student.aceptaContacto,
      }),
    }).catch(() => { /* silencioso — el PDF funciona igual sin Supabase */ });
  };

  const downloadReport = async () => {
    setMessage('');

    try {
      const pdf = await buildPdfReport(student, scores, resultCode);
      const safeName = `${student.nombres}-${student.apellidos}`.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase();
      const fileName = `resultado-chaside-gesco-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
    } catch {
      setMessage('No pudimos generar el PDF en este momento. Intenta nuevamente.');
    }
  };

  const sendResults = async () => {
    const validationMessage = validateStudentData(student);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setSubmitState('sending');
    setMessage('');

    // Genera el mismo PDF del botón "Descargar" y lo adjunta al correo
    let pdfBase64: string | undefined;
    try {
      const pdf = await buildPdfReport(student, scores, resultCode);
      const bytes = new Uint8Array(pdf.output('arraybuffer'));
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      pdfBase64 = btoa(binary);
    } catch { /* si falla el PDF se envía igual el correo */ }

    try {
      const response = await fetch('/api/enviar-resultado/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: { ...student, codigo: resultCode }, answers, website: student.website, aceptaContacto: student.aceptaContacto, ...(pdfBase64 ? { pdfBase64 } : {}) }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'No pudimos enviar el resultado en este momento.');
      }

      setSubmitState('success');
      setMessage('Resultado enviado correctamente a tu correo y al equipo GESCO.');
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Ocurrió un error al enviar el resultado.');
    }
  };

  const resetTest = () => {
    setStudent(initialStudentData);
    setAnswers({});
    setCurrentIndex(0);
    setStage('questions');
    setSubmitState('idle');
    setMessage('');
    setResultCode('');
  };

  return (
    <section className="section-pad bg-surface" id="simulador-chaside">
      <div className="container-g">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-bold uppercase tracking-wide text-brand">Simulador CHASIDE gratis</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy md:text-4xl">Realiza el test vocacional CHASIDE online</h2>
          <p className="mt-4 text-muted">
            Responde 98 preguntas de Sí o No y recibe una lectura orientativa de tus intereses y aptitudes. No es un diagnóstico psicológico definitivo ni reemplaza una orientación vocacional profesional.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 md:p-8">
          {stage === 'questions' && (
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <aside className="rounded-2xl bg-surface p-5">
                <h3 className="text-xl font-extrabold text-navy">Antes de empezar</h3>
                <div className="mt-5 grid gap-4 text-sm text-muted">
                  <p><strong className="text-navy">Duración:</strong> entre 10 y 15 minutos.</p>
                  <p><strong className="text-navy">Formato:</strong> 98 preguntas con respuesta Sí o No.</p>
                  <p><strong className="text-navy">Recomendación:</strong> responde según lo que realmente te interesa, no según lo que otros esperan.</p>
                  <p><strong className="text-navy">Datos:</strong> los solicitaremos al final para poder generar y enviar tu resultado.</p>
                </div>
                <a href="#chaside-faq" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-black/10 px-5 py-3 text-sm font-bold text-navy hover:bg-white">
                  Ver preguntas frecuentes
                </a>
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={() => {
                      const mock: Partial<ChasideAnswers> = {};
                      chasideQuestions.forEach((q, i) => { mock[q.id] = (i % 5 === 0 || i % 7 === 0) ? 0 : 1; });
                      setAnswers(mock);
                      setStudent({ nombres: 'Ana', apellidos: 'Martínez López', correo: 'ana@ejemplo.com', telefono: '0991234567', website: '', aceptaContacto: true });
                      setResultCode(generateResultCode());
                      setStage('results');
                    }}
                    className="mt-4 w-full rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-2 text-xs font-bold text-brand hover:bg-brand/10"
                  >
                    [DEV] Vista previa PDF
                  </button>
                )}
              </aside>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-brand">Pregunta {currentIndex + 1} de {chasideQuestions.length}</p>
                    <p className="mt-1 text-sm text-muted">{answeredCount} respuestas guardadas temporalmente</p>
                  </div>
                  <span className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">{progress}%</span>
                </div>

                <div
                  className="mt-4 h-3 overflow-hidden rounded-full bg-surface"
                  role="progressbar"
                  aria-label="Progreso del test vocacional"
                  aria-valuemin={0}
                  aria-valuemax={chasideQuestions.length}
                  aria-valuenow={answeredCount}
                  aria-valuetext={`${answeredCount} de ${chasideQuestions.length} preguntas respondidas`}
                >
                  <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
                </div>

                <article className="mt-8 rounded-3xl border border-black/10 p-6">
                  <p className="text-2xl font-extrabold leading-snug text-navy">{currentQuestion.text}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: 'Sí', value: 1 as ChasideAnswer },
                      { label: 'No', value: 0 as ChasideAnswer },
                    ].map((option) => {
                      const active = answers[currentQuestion.id] === option.value;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => updateAnswer(option.value)}
                          className={`min-h-14 rounded-2xl border px-5 py-4 text-lg font-extrabold transition ${
                            active
                              ? 'border-brand bg-brand text-white shadow-sm'
                              : 'border-black/10 bg-white text-navy hover:border-brand hover:bg-surface'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </article>

                {message && <p className="mt-4 rounded-2xl bg-accent/15 p-4 text-sm font-semibold text-navy" role="status">{message}</p>}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
                    disabled={currentIndex === 0}
                    className="min-h-11 rounded-full border border-black/10 px-5 py-3 font-bold text-navy transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={answers[currentQuestion.id] === undefined}
                    className="solid-cta min-h-11 rounded-full bg-brand px-6 py-3 font-bold text-white! transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-muted"
                  >
                    {currentIndex === chasideQuestions.length - 1 ? 'Continuar al resultado' : 'Siguiente'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage === 'lead' && (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-navy p-6 text-white md:p-8">
                <p className="font-bold uppercase tracking-wide text-accent">Ya terminaste el test</p>
                <h3 className="mt-2 text-3xl font-extrabold">Déjanos tus datos para generar tu reporte</h3>
                <p className="mt-4 text-white/75">
                  Con esta información personalizamos el resultado, habilitamos la descarga y podemos enviarte una copia por correo junto con opciones de orientación académica.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-white/80">
                  <p>98 preguntas respondidas</p>
                  <p>Resultados por intereses, aptitudes y áreas CHASIDE</p>
                  <p>Recomendaciones de carreras compatibles</p>
                </div>
              </div>

              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  showResults();
                }}
              >
                <label className="hidden">
                  Sitio web
                  <input
                    value={student.website}
                    onChange={(event) => setStudent((current) => ({ ...current, website: event.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-navy">
                    Nombres
                    <input value={student.nombres} onChange={(event) => setStudent((current) => ({ ...current, nombres: event.target.value }))} className="min-h-11 rounded-xl border border-black/10 px-4 py-3 font-normal" autoComplete="given-name" required />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-navy">
                    Apellidos
                    <input value={student.apellidos} onChange={(event) => setStudent((current) => ({ ...current, apellidos: event.target.value }))} className="min-h-11 rounded-xl border border-black/10 px-4 py-3 font-normal" autoComplete="family-name" required />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Correo
                  <input value={student.correo} onChange={(event) => setStudent((current) => ({ ...current, correo: event.target.value }))} className="min-h-11 rounded-xl border border-black/10 px-4 py-3 font-normal" type="email" autoComplete="email" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Teléfono opcional
                  <input value={student.telefono} onChange={(event) => setStudent((current) => ({ ...current, telefono: event.target.value }))} className="min-h-11 rounded-xl border border-black/10 px-4 py-3 font-normal" autoComplete="tel" />
                </label>
                <label className="flex items-start gap-3 rounded-2xl bg-surface p-4 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={student.aceptaContacto}
                    onChange={(event) => setStudent((current) => ({ ...current, aceptaContacto: event.target.checked }))}
                    className="mt-1 h-4 w-4 accent-brand"
                    required
                  />
                  <span>
                    Autorizo a GESCO a usar mis datos para generar el reporte del test vocacional CHASIDE, enviarlo por correo y contactarme con orientación académica relacionada.
                  </span>
                </label>

                {message && <p className="rounded-2xl bg-accent/15 p-4 text-sm font-semibold text-navy" role="status">{message}</p>}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="submit" className="solid-cta min-h-11 rounded-full bg-brand px-6 py-3 font-bold text-white! hover:bg-brand-dark">
                    Ver mi resultado
                  </button>
                  <button type="button" onClick={() => setStage('questions')} className="min-h-11 rounded-full border border-black/10 px-6 py-3 font-bold text-navy hover:bg-surface">
                    Volver al test
                  </button>
                </div>
                <p className="text-xs text-muted">Usaremos tus datos solo para el reporte del test y seguimiento académico solicitado.</p>
              </form>
            </div>
          )}

          {stage === 'results' && (
            <div className="grid gap-8">
              <div className="rounded-3xl bg-navy p-6 text-white md:p-8">
                <p className="font-bold uppercase tracking-wide text-accent">Resultado orientativo</p>
                <h3 className="mt-2 text-3xl font-extrabold">Tus dos áreas principales</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {topAreas.map((area, index) => (
                    <article key={area.code} className="rounded-2xl bg-white/10 p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-accent">
                        #{index + 1} Área de {index === 0 ? 'Interés' : 'Aptitud'}
                      </p>
                      <p className="mt-0.5 text-xs text-white/50">
                        {index === 0 ? 'Lo que más te apasiona' : 'En lo que más destacas'}
                      </p>
                      <h4 className="mt-2 text-2xl font-extrabold">{area.name}</h4>
                      <p className="mt-3 text-white/75">{area.profile.description}</p>
                      <p className="mt-4 font-bold">Total: {area.total} puntos</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-2xl font-extrabold text-navy">Puntajes por área</h3>
                {scores.map((area) => (
                  <div key={area.code} className="rounded-2xl border border-black/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-bold text-navy">{area.code} - {area.name}</p>
                      <p className="text-sm font-semibold text-muted">Intereses {area.interests} · Aptitudes {area.aptitudes} · Total {area.total}</p>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(area.total / maxScore) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {topAreas.map((area) => (
                  <article key={area.code} className="rounded-3xl bg-surface p-6">
                    <h3 className="text-2xl font-extrabold text-navy">{area.name}</h3>
                    <p className="mt-4 font-bold text-navy">Intereses frecuentes</p>
                    <p className="mt-2 text-muted">{area.profile.interests.join(', ')}.</p>
                    <p className="mt-4 font-bold text-navy">Aptitudes asociadas</p>
                    <p className="mt-2 text-muted">{area.profile.aptitudes.join(', ')}.</p>
                    <p className="mt-4 font-bold text-navy">Carreras sugeridas</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {area.profile.careers.map((career) => (
                        <span key={career} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-navy">{career}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {message && (
                <p className={`rounded-2xl p-4 text-sm font-semibold ${submitState === 'success' ? 'bg-success/10 text-success' : 'bg-accent/15 text-navy'}`} role="status">
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={sendResults} disabled={submitState === 'sending'} className="solid-cta min-h-11 rounded-full bg-brand px-6 py-3 font-bold text-white! hover:bg-brand-dark disabled:bg-muted">
                  {submitState === 'sending' ? 'Enviando...' : 'Enviar resultados por correo'}
                </button>
                <button type="button" onClick={downloadReport} className="min-h-11 rounded-full border border-black/10 px-6 py-3 font-bold text-navy hover:bg-surface">
                  Descargar PDF
                </button>
                <button type="button" onClick={resetTest} className="min-h-11 rounded-full px-6 py-3 font-bold text-brand hover:text-brand-dark">
                  Reiniciar test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

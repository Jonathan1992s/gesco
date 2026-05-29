import type { APIRoute } from 'astro';
import { areAllChasideQuestionsAnswered, chasideQuestions, scoreChaside, type ChasideAnswers } from '@/data/chaside';
import { templateResultadoChaside } from '@/lib/email-templates';

export const prerender = false;

interface StudentPayload {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  website?: string;
  aceptaContacto?: boolean;
  codigo?: string;
}

const MAX_PAYLOAD_BYTES = 6 * 1024 * 1024; // 6 MB — acomoda el PDF base64 adjunto
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const emailAttempts = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  return forwardedFor || realIp || 'local';
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const current = emailAttempts.get(clientKey);

  if (!current || current.resetAt <= now) {
    emailAttempts.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_ATTEMPTS) return true;

  current.count += 1;
  return false;
}

function parseSender(value: string) {
  const sender = value.trim();
  const match = sender.match(/^(.*?)\s*<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>$/);

  if (!match) return { email: sender };

  const name = match[1].trim().replace(/^["']|["']$/g, '');
  return {
    email: match[2],
    ...(name ? { name } : {}),
  };
}

function normalizeStudent(raw: StudentPayload) {
  return {
    nombres:  String(raw.nombres  || '').trim().slice(0, 80),
    apellidos: String(raw.apellidos || '').trim().slice(0, 80),
    correo:   String(raw.correo   || '').trim().toLowerCase().slice(0, 254),
    telefono: String(raw.telefono || '').trim().slice(0, 30),
  };
}

function normalizeAnswers(raw: unknown): Partial<ChasideAnswers> {
  if (!raw || typeof raw !== 'object') return {};

  return Object.entries(raw as Record<string, unknown>).reduce<Partial<ChasideAnswers>>((acc, [key, value]) => {
    const questionId = Number(key);
    if (!Number.isInteger(questionId)) return acc;
    if (questionId < 1 || questionId > chasideQuestions.length) return acc;
    if (value === 0 || value === 1) acc[questionId] = value;
    return acc;
  }, {});
}


type Attachment = { filename: string; content: string };

async function sendWithResend(apiKey: string, from: string, to: string, bcc: string[], subject: string, html: string, attachments: Attachment[] = []) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, bcc, subject, html, ...(attachments.length ? { attachments } : {}) }),
  });
}

async function sendWithSendgrid(apiKey: string, from: string, to: string, bcc: string[], subject: string, html: string, attachments: Attachment[] = []) {
  const sender = parseSender(from);

  return fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          ...(bcc.length ? { bcc: bcc.map((email) => ({ email })) } : {}),
        },
      ],
      from: sender,
      subject,
      content: [{ type: 'text/html', value: html }],
      ...(attachments.length ? {
        attachments: attachments.map(a => ({
          content: a.content,
          filename: a.filename,
          type: 'application/pdf',
          disposition: 'attachment',
        })),
      } : {}),
    }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: { student?: StudentPayload; answers?: unknown; website?: string; aceptaContacto?: boolean; pdfBase64?: string };
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > MAX_PAYLOAD_BYTES) {
    return jsonResponse({ message: 'La información enviada es demasiado grande. Recarga la página e intenta nuevamente.' }, 413);
  }

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ message: 'No pudimos leer la información enviada.' }, 400);
  }

  const student = normalizeStudent(payload.student || {});
  const answers = normalizeAnswers(payload.answers);
  const honeypot = String(payload.website || payload.student?.website || '').trim();

  if (honeypot) {
    return jsonResponse({ message: 'No pudimos procesar la solicitud. Intenta nuevamente.' }, 400);
  }

  if (!student.nombres || !student.apellidos) {
    return jsonResponse({ message: 'Completa nombres y apellidos antes de enviar.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.correo)) {
    return jsonResponse({ message: 'Ingresa un correo válido.' }, 400);
  }

  if (!payload.aceptaContacto && !payload.student?.aceptaContacto) {
    return jsonResponse({ message: 'Autoriza el uso de tus datos para generar y enviar el reporte.' }, 400);
  }

  if (!areAllChasideQuestionsAnswered(answers)) {
    return jsonResponse({ message: `Debes responder las ${chasideQuestions.length} preguntas antes de enviar.` }, 400);
  }

  const resendKey = import.meta.env.RESEND_API_KEY;
  const sendgridKey = import.meta.env.SENDGRID_API_KEY;
  const emailDestino = import.meta.env.EMAIL_DESTINO;
  const emailRemitente = import.meta.env.EMAIL_REMITENTE;

  if (!emailDestino || !emailRemitente || (!resendKey && !sendgridKey)) {
    return jsonResponse({ message: 'El envío de correos aún no está configurado. Puedes descargar o imprimir tu resultado.' }, 503);
  }

  if (isRateLimited(getClientKey(request))) {
    return jsonResponse({ message: 'Recibimos varios intentos seguidos. Espera unos minutos antes de volver a enviar.' }, 429);
  }

  const scores   = scoreChaside(answers as ChasideAnswers);
  const topAreas = scores.slice(0, 2);
  const fecha    = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Guayaquil' });
  const codigo   = String(payload.student?.codigo ?? '').trim().toUpperCase();

  const { subject, html } = templateResultadoChaside({
    nombres:   student.nombres,
    apellidos: student.apellidos,
    correo:    student.correo,
    codigo,
    fecha,
    topAreas: topAreas.map(a => ({
      code:        a.code,
      name:        a.name,
      total:       a.total,
      interests:   a.interests,
      aptitudes:   a.aptitudes,
      description: a.profile.description,
      careers:     a.profile.careers.slice(0, 6),
    })),
    allScores: scores.map(a => ({
      code:      a.code,
      name:      a.name,
      total:     a.total,
      interests: a.interests,
      aptitudes: a.aptitudes,
    })),
  });

  // El PDF lo genera el browser (mismo que "Descargar PDF") y llega como base64
  const pdfBase64 = typeof payload.pdfBase64 === 'string' && /^[A-Za-z0-9+/]+=*$/.test(payload.pdfBase64)
    ? payload.pdfBase64
    : null;
  const safeName = `${student.nombres}-${student.apellidos}`.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toUpperCase();
  const pdfFilename = `resultado-chaside-gesco-${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`;
  const attachments = pdfBase64
    ? [{ filename: pdfFilename, content: pdfBase64 }]
    : [];

  const copyRecipients = emailDestino === student.correo ? [] : [emailDestino];
  const response = resendKey
    ? await sendWithResend(resendKey, emailRemitente, student.correo, copyRecipients, subject, html, attachments)
    : await sendWithSendgrid(sendgridKey!, emailRemitente, student.correo, copyRecipients, subject, html, attachments);

  if (!response.ok) {
    return jsonResponse({ message: 'No pudimos enviar el correo. Intenta nuevamente o descarga tu resultado.' }, 502);
  }

  return jsonResponse({ message: 'Resultado enviado correctamente.' });
};

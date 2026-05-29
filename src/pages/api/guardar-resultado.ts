import { createHmac, timingSafeEqual } from 'node:crypto';
import type { APIRoute } from 'astro';
import { guardarResultado } from '@/lib/supabase';

export const prerender = false;

const CODE_RE = /^GESCO-[A-Z]{2}-\d{8}-[A-Z0-9]{6}$/;
const SIGNING_WINDOW_S = 7200; // 2 horas — el test puede tomar hasta ~30 min
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const saveAttempts = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getClientKey(req: Request) {
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return fwd || req.headers.get('x-real-ip')?.trim() || 'local';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const cur = saveAttempts.get(key);
  if (!cur || cur.resetAt <= now) {
    saveAttempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (cur.count >= RATE_MAX) return true;
  cur.count += 1;
  return false;
}

function verifyToken(token: string, secret: string): boolean {
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const tsStr = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const ts = parseInt(tsStr, 10);
  if (!ts || isNaN(ts)) return false;
  const age = Math.floor(Date.now() / 1000) - ts;
  if (age < 0 || age > SIGNING_WINDOW_S) return false;
  const expected = createHmac('sha256', secret).update(tsStr).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (isRateLimited(getClientKey(request))) {
    return json({ ok: false, message: 'Demasiados intentos. Espera unos minutos.' }, 429);
  }

  const signingSecret = import.meta.env.API_SIGNING_SECRET ?? '';
  if (signingSecret) {
    const token = request.headers.get('x-request-token') ?? '';
    if (!verifyToken(token, signingSecret)) {
      return json({ ok: false, message: 'No autorizado.' }, 401);
    }
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: 'Payload inválido.' }, 400);
  }

  const VALID_AREAS = new Set(['C','H','A','S','I','D','E']);
  const p = payload as Record<string, unknown>;
  const codigo     = String(p.codigo ?? '').trim().toUpperCase().slice(0, 30);
  const nombres    = String(p.nombres ?? '').trim().slice(0, 80);
  const apellidos  = String(p.apellidos ?? '').trim().slice(0, 80);
  const correo     = String(p.correo ?? '').trim().toLowerCase().slice(0, 254);
  const telefono   = p.telefono ? String(p.telefono).trim().slice(0, 30) : null;
  const area1_raw     = String(p.area1_codigo ?? '').trim().toUpperCase();
  const area1_codigo  = VALID_AREAS.has(area1_raw) ? area1_raw : '';
  const area1_nombre  = String(p.area1_nombre ?? '').trim().slice(0, 100);
  const area1_puntaje = Number(p.area1_puntaje ?? 0);
  const area2_raw     = p.area2_codigo ? String(p.area2_codigo).trim().toUpperCase() : null;
  const area2_codigo  = area2_raw && VALID_AREAS.has(area2_raw) ? area2_raw : null;
  const area2_nombre  = p.area2_nombre ? String(p.area2_nombre).trim().slice(0, 100) : null;
  const area2_puntaje = p.area2_puntaje != null ? Number(p.area2_puntaje) : null;
  const acepta_contacto = Boolean(p.acepta_contacto);
  const fecha_emision = new Date().toISOString().slice(0, 10);

  if (!CODE_RE.test(codigo))   return json({ ok: false, message: 'Código inválido.' }, 400);
  if (!nombres || !apellidos)  return json({ ok: false, message: 'Nombres requeridos.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return json({ ok: false, message: 'Correo inválido.' }, 400);
  if (!area1_codigo)           return json({ ok: false, message: 'Área principal requerida.' }, 400);

  const supabaseConfigured = Boolean(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!supabaseConfigured) {
    return json({ ok: true, message: 'Supabase no configurado — omitido.' });
  }

  try {
    await guardarResultado({
      codigo, nombres, apellidos, correo, telefono,
      area1_codigo, area1_nombre, area1_puntaje,
      area2_codigo, area2_nombre, area2_puntaje,
      fecha_emision, acepta_contacto,
    });
    return json({ ok: true });
  } catch {
    return json({ ok: false, message: 'Error al guardar el resultado.' }, 500);
  }
};

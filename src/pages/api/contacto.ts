import type { APIRoute } from 'astro';
import { guardarContacto } from '@/lib/supabase';
import { templateContacto } from '@/lib/email-templates';

export const prerender = false;

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: Request) {
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return fwd || req.headers.get('x-real-ip')?.trim() || 'local';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const cur = attempts.get(key);
  if (!cur || cur.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (cur.count >= RATE_MAX) return true;
  cur.count += 1;
  return false;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  if (isRateLimited(getClientKey(request))) {
    return redirect('/contacto/?error=rate', 303);
  }

  const data = await request.formData();
  const nombre   = String(data.get('nombre')   ?? '').trim().slice(0, 100);
  const email    = String(data.get('email')    ?? '').trim().toLowerCase().slice(0, 254);
  const telefono = String(data.get('telefono') ?? '').trim().slice(0, 30);
  const mensaje  = String(data.get('mensaje')  ?? '').trim().slice(0, 2000);
  const honeypot = String(data.get('website')  ?? '').trim();

  if (honeypot)                                         return redirect('/gracias/', 303);
  if (!nombre || !email || !mensaje)                    return redirect('/contacto/?error=fields', 303);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))       return redirect('/contacto/?error=email', 303);

  const resendKey      = import.meta.env.RESEND_API_KEY;
  const emailDestino   = import.meta.env.EMAIL_DESTINO;
  const emailRemitente = import.meta.env.EMAIL_REMITENTE;

  if (!resendKey || !emailDestino || !emailRemitente) {
    return redirect('/contacto/?error=config', 303);
  }

  const fecha = new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const { subject, html } = templateContacto({ nombre, email, telefono: telefono || null, mensaje, fecha });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:     emailRemitente,
      to:       [emailDestino],
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) return redirect('/contacto/?error=send', 303);

  // Guardar en Supabase (fire and forget — no bloquea el redirect)
  const supabaseConfigured = Boolean(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
  if (supabaseConfigured) {
    guardarContacto({
      nombre,
      email,
      telefono: telefono || null,
      mensaje,
      origen: 'contacto-web',
    }).catch(() => { /* silencioso */ });
  }

  return redirect('/gracias/', 303);
};

// Plantillas HTML de correo para GESCO — usadas por /api/contacto y /api/enviar-resultado

const BRAND   = '#1b88e2';
const NAVY    = '#1a1a2e';
const ACCENT  = '#f4c430';
const MUTED   = '#64748b';
const SURFACE = '#f8f9fa';

function baseLayout(preheader: string, content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <title>GESCO</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader oculto -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&#8203;&#65279;</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:${NAVY};border-radius:12px 12px 0 0;padding:16px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <img src="https://gescovirtual.com/img/logo-negativo.png"
                       alt="GESCO"
                       width="155"
                       style="display:block;border:0;outline:none;max-width:155px;height:auto;" />
                </td>
                <td align="right">
                  <p style="margin:0;font-size:11px;color:#4e6294;">gescovirtual.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CONTENIDO -->
        <tr>
          <td style="background:#ffffff;padding:0;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:${NAVY};border-radius:0 0 12px 12px;padding:20px 32px;">
            <p style="margin:0;font-size:12px;color:#4e6294;text-align:center;">
              &#169; ${new Date().getFullYear()} Corporaci&#243;n para la Gesti&#243;n del Conocimiento &middot; Quito, Ecuador<br>
              <a href="https://gescovirtual.com" style="color:${BRAND};text-decoration:none;">gescovirtual.com</a>
              &nbsp;&middot;&nbsp;
              <a href="tel:+593999216079" style="color:#4e6294;text-decoration:none;">+593 999 216 079</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Escapa HTML y convierte todo carácter no-ASCII a entidad numérica
// Garantiza rendering correcto en Gmail, Outlook y clientes móviles
function esc(s: string) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replace(/[^\x00-\x7F]/g, c => `&#${c.codePointAt(0)};`);
}

function badge(text: string, bg = BRAND) {
  return `<span style="display:inline-block;background:${bg};color:#fff;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 10px;border-radius:20px;">${text}</span>`;
}

// ─── TEMPLATE 1: Notificación de contacto web ────────────────────────────────

interface ContactoData {
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  fecha: string;
}

export function templateContacto(data: ContactoData): { subject: string; html: string } {

  const content = `
    <!-- Banda de tipo -->
    <div style="background:${SURFACE};border-left:4px solid ${BRAND};padding:14px 32px;">
      ${badge('Formulario de contacto')}
      <span style="font-size:12px;color:${MUTED};margin-left:10px;">${esc(data.fecha)}</span>
    </div>

    <!-- Datos del contacto -->
    <div style="padding:28px 32px 0;">
      <h2 style="margin:0 0 20px;font-size:20px;color:${NAVY};">Nuevo mensaje recibido</h2>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <tr style="background:${SURFACE};">
          <td style="padding:12px 16px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;width:110px;">Nombre</td>
          <td style="padding:12px 16px;font-size:15px;font-weight:700;color:${NAVY};">${esc(data.nombre)}</td>
        </tr>
        <tr style="border-top:1px solid #e2e8f0;">
          <td style="padding:12px 16px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Email</td>
          <td style="padding:12px 16px;font-size:15px;">
            <a href="mailto:${esc(data.email)}" style="color:${BRAND};text-decoration:none;">${esc(data.email)}</a>
          </td>
        </tr>
        <tr style="border-top:1px solid #e2e8f0;background:${SURFACE};">
          <td style="padding:12px 16px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Tel&#233;fono</td>
          <td style="padding:12px 16px;font-size:15px;color:${data.telefono ? NAVY : '#aaa'};">
            ${data.telefono
              ? `<a href="tel:${esc(data.telefono)}" style="color:${NAVY};text-decoration:none;">${esc(data.telefono)}</a>`
              : 'No indicado'}
          </td>
        </tr>
      </table>
    </div>

    <!-- Mensaje -->
    <div style="padding:20px 32px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Mensaje</p>
      <div style="background:${SURFACE};border-left:3px solid ${BRAND};border-radius:4px;padding:16px;font-size:14px;color:#334155;line-height:1.7;white-space:pre-line;">${esc(data.mensaje)}</div>
    </div>

    <!-- CTA responder -->
    <div style="padding:0 32px 28px;">
      <a href="mailto:${esc(data.email)}?subject=Re:%20Contacto%20GESCO%20&#8212;%20${esc(data.nombre)}"
         style="display:inline-block;background:${BRAND};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:50px;">
        Responder a ${esc(data.nombre)}
      </a>
    </div>

    <!-- Aviso -->
    <div style="padding:16px 32px 28px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:12px;color:${MUTED};">
        Este mensaje fue enviado desde el formulario de contacto de
        <a href="https://gescovirtual.com/contacto/" style="color:${BRAND};text-decoration:none;">gescovirtual.com/contacto/</a>
      </p>
    </div>
  `;

  const preheader = esc(`Nuevo mensaje de ${data.nombre} — revisa los detalles.`);
  return { subject: `Nuevo contacto web — ${data.nombre}`, html: baseLayout(preheader, content) };
}

// ─── TEMPLATE 2: Resultado Test Vocacional CHASIDE ───────────────────────────

interface AreaResult {
  code: string;
  name: string;
  total: number;
  interests: number;
  aptitudes: number;
  description: string;
  careers: string[];
}

interface ResultadoData {
  nombres: string;
  apellidos: string;
  correo: string;
  codigo: string;
  fecha: string;
  topAreas: AreaResult[];
  allScores: Array<{ code: string; name: string; total: number; interests: number; aptitudes: number }>;
}

function levelBadge(total: number) {
  if (total >= 12) return { label: 'MUY ALTO', color: '#16a34a' };
  if (total >= 8)  return { label: 'ALTO',     color: BRAND };
  if (total >= 5)  return { label: 'MEDIO',    color: '#64748b' };
  return               { label: 'BAJO',      color: '#94a3b8' };
}

export function templateResultadoChaside(data: ResultadoData): { subject: string; html: string } {
  const fullName = `${esc(data.nombres)} ${esc(data.apellidos)}`;

  // Tarjetas de áreas principales
  const areaCards = data.topAreas.map((area, i) => {
    const lv = levelBadge(area.total);
    return `
      <td style="width:50%;padding:${i === 0 ? '0 8px 0 0' : '0 0 0 8px'};" valign="top">
        <div style="background:${SURFACE};border:1px solid #e2e8f0;border-top:3px solid ${lv.color};border-radius:8px;padding:16px;">
          <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:${lv.color};text-transform:uppercase;letter-spacing:.05em;">#${i + 1} &#193;rea de ${i === 0 ? 'Inter&#233;s' : 'Aptitud'}</p>
          <p style="margin:0 0 3px;font-size:10px;color:${MUTED};">${i === 0 ? 'Lo que m&#225;s te apasiona' : 'En lo que m&#225;s destacas'}</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${NAVY};">${esc(area.name)}</p>
          <p style="margin:0 0 10px;font-size:12px;color:${MUTED};line-height:1.5;">${esc(area.description)}</p>
          <p style="margin:0;font-size:13px;font-weight:700;color:${lv.color};">${area.total}/14 pts &middot; ${lv.label}</p>
        </div>
      </td>`;
  }).join('');

  // Tabla de puntajes
  const scoreRows = data.allScores.map((s, i) => {
    const lv = levelBadge(s.total);
    const barW = Math.round((s.total / 14) * 200);
    const isTop = i < 2;
    return `
      <tr style="background:${i % 2 === 0 ? '#fff' : SURFACE};">
        <td style="padding:8px 12px;font-size:13px;font-weight:${isTop ? '700' : '400'};color:${NAVY};">${esc(s.code)} &#8212; ${esc(s.name)}</td>
        <td style="padding:8px 12px;font-size:12px;color:${MUTED};text-align:center;">${s.interests}</td>
        <td style="padding:8px 12px;font-size:12px;color:${MUTED};text-align:center;">${s.aptitudes}</td>
        <td style="padding:8px 12px;font-size:13px;font-weight:700;color:${lv.color};text-align:center;">${s.total}</td>
        <td style="padding:8px 12px;">
          <div style="background:#e2e8f0;border-radius:4px;height:8px;width:200px;">
            <div style="background:${lv.color};border-radius:4px;height:8px;width:${barW}px;"></div>
          </div>
        </td>
      </tr>`;
  }).join('');

  // Carreras sugeridas
  const careerBlocks = data.topAreas.map(area => {
    const lv = levelBadge(area.total);
    return `
      <div style="margin-bottom:16px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${lv.color};">${esc(area.name)}</p>
        <p style="margin:0;font-size:13px;color:${MUTED};">${area.careers.map(c => esc(c)).join(' &middot; ')}</p>
      </div>`;
  }).join('');

  const content = `
    <!-- Hero del resultado -->
    <div style="background:${NAVY};padding:20px 32px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.08em;color:${ACCENT};text-transform:uppercase;">Resultado orientativo</p>
      <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;">Informe Vocacional CHASIDE</h2>
      <p style="margin:0;font-size:14px;color:#8090b0;">Preparado para <strong style="color:#fff;">${fullName}</strong> &middot; ${esc(data.fecha)}</p>
    </div>

    <!-- Áreas principales -->
    <div style="padding:24px 32px 0;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Tus dos &#225;reas principales</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>${areaCards}</tr>
      </table>
    </div>

    <!-- Tabla de puntajes -->
    <div style="padding:24px 32px 0;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Puntajes por &#225;rea</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:13px;">
        <tr style="background:${NAVY};">
          <th style="padding:10px 12px;text-align:left;color:#8090b0;font-size:11px;font-weight:700;text-transform:uppercase;">&#193;rea</th>
          <th style="padding:10px 12px;color:#8090b0;font-size:11px;font-weight:700;text-transform:uppercase;">Int.</th>
          <th style="padding:10px 12px;color:#8090b0;font-size:11px;font-weight:700;text-transform:uppercase;">Apt.</th>
          <th style="padding:10px 12px;color:#8090b0;font-size:11px;font-weight:700;text-transform:uppercase;">Total</th>
          <th style="padding:10px 12px;color:#8090b0;font-size:11px;font-weight:700;text-transform:uppercase;"></th>
        </tr>
        ${scoreRows}
      </table>
    </div>

    <!-- Carreras compatibles -->
    <div style="padding:24px 32px 0;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.05em;">Carreras compatibles</p>
      <div style="background:${SURFACE};border-radius:8px;padding:16px 20px;">
        ${careerBlocks}
      </div>
    </div>

    <!-- Código de verificación -->
    <div style="padding:20px 32px;">
      <div style="border:1px dashed #cbd5e1;border-radius:8px;padding:14px 18px;">
        <p style="margin:0;font-size:12px;color:${MUTED};">
          C&#243;digo de resultado:
          <strong style="color:${NAVY};font-family:monospace;letter-spacing:.05em;">${esc(data.codigo)}</strong>
          &nbsp;&#8212;&nbsp;
          <a href="https://gescovirtual.com/verificar/?c=${esc(data.codigo)}" style="color:${BRAND};text-decoration:none;">Verificar documento</a>
        </p>
      </div>
    </div>

    <!-- Disclaimer -->
    <div style="padding:0 32px 16px;">
      <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
        Este resultado es de car&#225;cter orientativo. No constituye un diagn&#243;stico psicol&#243;gico ni reemplaza la orientaci&#243;n vocacional profesional. Se recomienda complementarlo con una sesi&#243;n de asesor&#237;a acad&#233;mica.
      </p>
    </div>

    <!-- CTA GESCO -->
    <div style="background:${SURFACE};border-top:1px solid #e2e8f0;padding:20px 32px 28px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:${NAVY};">&#191;Quieres convertir este resultado en una decisi&#243;n segura?</p>
      <p style="margin:0 0 16px;font-size:13px;color:${MUTED};">En GESCO te ayudamos a elegir carrera, universidad y un plan de preparaci&#243;n personalizado.</p>
      <a href="https://wa.me/593999216079?text=Hola%2C%20quiero%20orientaci%C3%B3n%20sobre%20mi%20resultado%20CHASIDE"
         style="display:inline-block;background:${NAVY};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:50px;">
        Solicitar orientaci&#243;n &#8594;
      </a>
    </div>
  `;

  const preheader = esc(`Tus resultados del Test Vocacional CHASIDE están listos, ${data.nombres}.`);
  const subject   = `Tu resultado CHASIDE — ${data.nombres} ${data.apellidos}`;
  return { subject, html: baseLayout(preheader, content) };
}

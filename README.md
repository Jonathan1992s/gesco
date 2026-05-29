# GESCO — Sitio web oficial

Sitio web de **Corporación para la Gestión del Conocimiento — GESCO**, institución educativa privada ecuatoriana especializada en preparación preuniversitaria, orientación vocacional y educación continua.

**Producción:** [gescovirtual.com](https://gescovirtual.com)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| [Astro](https://astro.build) | 6.3.8 | Framework principal (SSR) |
| [@astrojs/netlify](https://docs.astro.build/en/guides/integrations-guide/netlify/) | 7.0.11 | Adaptador de despliegue |
| [Tailwind CSS](https://tailwindcss.com) | 4.3.0 | Estilos vía `@tailwindcss/vite` |
| [React](https://react.dev) | 19.2.6 | Islas interactivas (`client:visible`) |
| [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) | 5.0.6 | Blog y publicaciones en MDX |
| [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 3.7.3 | Sitemap automático |
| [TypeScript](https://www.typescriptlang.org) | 6.0.3 | Tipado estricto |
| [Sharp](https://sharp.pixelplumbing.com) | 0.34.5 | Procesamiento de imágenes |
| [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) | 2.106.2 | Base de datos PostgreSQL |
| [jsPDF](https://github.com/parallax/jsPDF) | 4.2.1 | Generación de PDF en browser |
| [qrcode](https://github.com/soldair/node-qrcode) | 1.5.4 | QR codes para documentos |
| Node.js | ≥ 22.12.0 | Runtime |

---

## Integraciones

| Servicio | Función |
|---|---|
| **Netlify** | Hosting + SSR (Netlify Functions) + deploy automático desde GitHub |
| **Resend** | Envío transaccional de emails (formulario de contacto + test vocacional) |
| **SendGrid** | Fallback de Resend para envío de emails |
| **Supabase** | Almacena resultados del test CHASIDE y mensajes del formulario de contacto |
| **Google Analytics 4** | Analytics (ID: `G-2CHP484BQ2`) |
| **Google Fonts** | Inter + Plus Jakarta Sans |
| **WhatsApp** | Canal principal de atención al cliente |
| **Plataforma Gesco** | Plataforma educativa externa (`plataformagesco.com`) |

---

## Variables de entorno

Configurar en **Netlify > Site configuration > Environment variables** (o en `.env` local):

```env
# Email (Resend — obligatorio para formulario de contacto)
RESEND_API_KEY=re_...
EMAIL_REMITENTE=reply@mail.gescovirtual.com
EMAIL_DESTINO=gescocorporacion@gmail.com

# Email fallback (SendGrid — opcional, solo para enviar-resultado)
SENDGRID_API_KEY=SG....

# Supabase (opcional — si no está configurado, las funciones de BD se omiten)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Seguridad API (opcional — firma HMAC para /api/guardar-resultado)
API_SIGNING_SECRET=cadena-secreta

# Analytics (opcionales)
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (localhost:4321)
npm run dev

# Verificar tipos TypeScript
npx astro check

# Build de producción
npm run build

# Previsualizar el build
npm run preview
```

---

## Estructura del proyecto

```
src/
├── content/
│   ├── blog/             # 20 artículos .mdx
│   └── publicaciones/    # 14 revistas .mdx (Nueva Jurisprudencia)
├── data/                 # site.ts · whatsapp.ts · programs.ts · universities.ts
│                         # navigation.ts · faqs.ts · testimonials.ts · chaside.ts
├── lib/
│   ├── supabase.ts       # cliente Supabase + interfaces ResultadoChaside / ContactoWeb
│   └── email-templates.ts # plantillas HTML (Resend / SendGrid)
├── layouts/
│   ├── BaseLayout.astro
│   ├── ProgramLayout.astro
│   └── BlogLayout.astro
├── components/
│   ├── global/           # SEO · Header · Footer · Analytics · WhatsAppButton · Breadcrumbs
│   ├── home/             # HeroHome · ProgramsGrid · Testimonials · FinalCTA · …
│   ├── program/          # ProgramHero · CurriculumGrid · FAQAccordion · …
│   ├── interactive/      # LeadQuiz.tsx · ChasideTest.tsx · Counter.tsx · MobileBottomBar
│   ├── blog/             # BlogCard · BlogHero · ArticleBody
│   └── schema/           # SchemaCourse · SchemaArticle · SchemaFAQ · SchemaBreadcrumb
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── api/
│   │   ├── contacto.ts           # POST — procesa formulario de contacto
│   │   ├── enviar-resultado.ts   # POST — envía PDF del test CHASIDE por email
│   │   └── guardar-resultado.ts  # POST — guarda resultado CHASIDE en Supabase
│   ├── universidades/[slug].astro
│   ├── blog/[...slug].astro
│   └── publicaciones/[slug].astro
└── styles/global.css     # tokens Tailwind + utilidades base
public/
├── _redirects            # 301s de URLs antiguas indexadas
├── robots.txt
└── img/                  # logos · ilustraciones SVG · fotos
```

---

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Home principal |
| `/preuniversitario/` | Programa preuniversitario integral |
| `/universidades-publicas/` | Hub universidades públicas (UCE, EPN, ESPOL, ESPE) |
| `/universidades-privadas/` | Hub universidades privadas (USFQ, UDLA, PUCE, UIDE) |
| `/universidades/[slug]/` | Landing individual por universidad (8 páginas) |
| `/refuerzo-academico/` | Refuerzo académico / salvavidas |
| `/test-vocacional/` | Test vocacional CHASIDE + quiz de ruta |
| `/clases-particulares/` | Clases particulares online |
| `/educacion-continua/` | Educación continua con certificación |
| `/capacitacion-docente/` | Capacitación docente (certificación Ministerio de Trabajo) |
| `/cursos-certificacion/` | Cursos de certificación profesional |
| `/convenios/` | Convenios institucionales |
| `/para-padres/` | Landing para padres de familia |
| `/preuniversitario-quito/` | Landing SEO ciudad de Quito |
| `/publicaciones/` | Índice Revista Nueva Jurisprudencia |
| `/publicaciones/[slug]/` | Revistas individuales (14 ediciones) |
| `/blog/` | Índice de artículos |
| `/blog/[...slug]/` | Artículos individuales (20 artículos) |
| `/contacto/` | Formulario de contacto |
| `/gracias/` | Confirmación de formulario (noindex) |
| `/verificar/` | Verificador de documentos GESCO (Supabase + QR) |
| `/404` | Página de error 404 |

---

## Despliegue

El sitio despliega automáticamente en **Netlify** con cada push a `main`.

- **Comando de build:** `npm run build`
- **Directorio publicado:** `dist`
- **Node version:** 22

Para desplegar manualmente:

```bash
git add <archivos>
git commit -m "descripción"
git push origin main
```

---

## Criterios de calidad

- Lighthouse Performance móvil ≥ 95
- Lighthouse SEO = 100
- Lighthouse Accessibility ≥ 90
- LCP < 2.5s · CLS < 0.1 · INP < 200ms
- `npx astro check` sin errores TypeScript

---

## Contacto

**GESCO — Corporación para la Gestión del Conocimiento**  
Leonardo Murialdo y Gaspar Tello, Quito, Ecuador 170514  
[+593 999 216 079](tel:+593999216079) · gescocorporacion@gmail.com  
[gescovirtual.com](https://gescovirtual.com)

/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_FORMSPREE_ID?: string;
  readonly RESEND_API_KEY?: string;
  readonly SENDGRID_API_KEY?: string;
  readonly EMAIL_DESTINO?: string;
  readonly EMAIL_REMITENTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

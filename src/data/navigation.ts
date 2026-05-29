import { WA } from './whatsapp';

export const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Preuniversitario', href: '/preuniversitario/' },
  { label: 'Universidades Públicas', href: '/universidades-publicas/' },
  { label: 'Universidades Privadas', href: '/universidades-privadas/' },
  { label: 'Refuerzo Académico', href: '/refuerzo-academico/' },
  { label: 'Test Vocacional', href: '/test-vocacional/' },
  { label: 'Publicaciones', href: '/publicaciones/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contacto', href: '/contacto/' },
] as const;

export const universidadesDropdown = [
  {
    label: 'Universidades Públicas',
    href: '/universidades-publicas/',
    desc: 'UCE, EPN, ESPOL, ESPE y más',
    external: false as const,
  },
  {
    label: 'Universidades Privadas',
    href: '/universidades-privadas/',
    desc: 'USFQ, UDLA, PUCE, UIDE y más',
    external: false as const,
  },
  {
    label: 'Simuladores',
    href: 'https://plataformagesco.com/course/index.php?categoryid=1',
    desc: 'Practica en la Plataforma Gesco',
    external: true as const,
  },
] as const;

export const mobileActions = [
  { label: 'WhatsApp', href: WA.home },
  { label: 'Ver programas', href: '/preuniversitario/' },
] as const;

export const publicacionesDropdown = [
  {
    label: 'Revista Nueva Jurisprudencia',
    href: '/publicaciones/',
    desc: 'Análisis legal y doctrina del Ecuador',
    external: false as const,
  },
  {
    label: 'Blog',
    href: '/blog/',
    desc: 'Guías y artículos para ingresar a la universidad',
    external: false as const,
  },
] as const;

export const servicesItems = [
  { label: 'Educación Continua', href: '/educacion-continua/' },
  { label: 'Capacitación Docente', href: '/capacitacion-docente/' },
  { label: 'Cursos de Certificación', href: '/cursos-certificacion/' },
  { label: 'Clases Particulares', href: '/clases-particulares/' },
  { label: 'Refuerzo Académico', href: '/refuerzo-academico/' },
  { label: 'Convenios GESCO', href: '/convenios/' },
] as const;

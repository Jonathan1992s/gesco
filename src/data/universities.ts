import type { WaKey } from './whatsapp';

export interface University {
  slug: string;
  name: string;
  shortName: string;
  waKey: WaKey;
  category: 'publica' | 'privada';
  title: string;
  description: string;
  focus: string[];
}

export const universities: University[] = [
  {
    slug: 'usfq',
    name: 'Universidad San Francisco de Quito',
    shortName: 'USFQ',
    waKey: 'usfq',
    category: 'privada',
    title: 'Preparación online para la USFQ | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Universidad San Francisco de Quito con clases en vivo, simuladores y acompañamiento.',
    focus: ['Matemática', 'Aptitud verbal', 'Inglés', 'Razonamiento lógico'],
  },
  {
    slug: 'udla',
    name: 'Universidad de Las Américas',
    shortName: 'UDLA',
    waKey: 'udla',
    category: 'privada',
    title: 'Preparación online para la UDLA | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Universidad de Las Américas con simuladores, clases en vivo y orientación de GESCO.',
    focus: ['Matemática', 'Aptitud verbal', 'Razonamiento abstracto', 'Simulacros UDLA'],
  },
  {
    slug: 'puce',
    name: 'Pontificia Universidad Católica del Ecuador',
    shortName: 'PUCE',
    waKey: 'puce',
    category: 'privada',
    title: 'Preparación online para la PUCE | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la PUCE con clases en vivo, simuladores y acompañamiento de GESCO.',
    focus: ['Razonamiento verbal', 'Razonamiento matemático', 'Razonamiento abstracto', 'Simulacros PUCE'],
  },
  {
    slug: 'uide',
    name: 'Universidad Internacional del Ecuador',
    shortName: 'UIDE',
    waKey: 'uide',
    category: 'privada',
    title: 'Preparación online para la UIDE | GESCO',
    description: 'Prepárate online para el proceso de admisión a la Universidad Internacional del Ecuador con GESCO.',
    focus: ['Matemática', 'Aptitud verbal', 'Razonamiento lógico', 'Simulacros UIDE'],
  },
  {
    slug: 'uce',
    name: 'Universidad Central del Ecuador',
    shortName: 'UCE',
    waKey: 'uce',
    category: 'publica',
    title: 'Preparación online para la UCE | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Universidad Central del Ecuador con simuladores, clases en vivo y acompañamiento.',
    focus: ['Razonamiento matemático', 'Lectura crítica', 'Aptitud verbal', 'Simuladores'],
  },
  {
    slug: 'epn',
    name: 'Escuela Politécnica Nacional',
    shortName: 'EPN',
    waKey: 'epn',
    category: 'publica',
    title: 'Preparación online para la EPN | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Escuela Politécnica Nacional con docentes especializados y simuladores.',
    focus: ['Matemática', 'Lógica', 'Física base', 'Simuladores'],
  },
  {
    slug: 'espe',
    name: 'Universidad de las Fuerzas Armadas ESPE',
    shortName: 'ESPE',
    waKey: 'espe',
    category: 'publica',
    title: 'Preparación online para la ESPE | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Universidad de las Fuerzas Armadas ESPE con GESCO.',
    focus: ['Matemática', 'Aptitud verbal', 'Lógica', 'Seguimiento'],
  },
  {
    slug: 'espol',
    name: 'Escuela Superior Politécnica del Litoral',
    shortName: 'ESPOL',
    waKey: 'espol',
    category: 'publica',
    title: 'Preparación online para la ESPOL | GESCO',
    description:
      'Prepárate online para el proceso de admisión a la Escuela Superior Politécnica del Litoral con GESCO.',
    focus: ['Matemática', 'Razonamiento', 'Simuladores', 'Plan de estudio'],
  },
];

import { useMemo, useState } from 'react';
import { SITE } from '@/data/site';

type Step = 'tipo' | 'ciudad' | 'modalidad' | 'tiempo' | 'resultado';
type AnswerKey = Exclude<Step, 'resultado'>;

interface Option {
  label: string;
  value: string;
}

interface Question {
  pregunta: string;
  opciones: Option[];
}

const steps: AnswerKey[] = ['tipo', 'ciudad', 'modalidad', 'tiempo'];

const questions: Record<AnswerKey, Question> = {
  tipo: {
    pregunta: '¿Qué necesitas?',
    opciones: [
      { label: 'Ingresar a una universidad pública', value: 'publica' },
      { label: 'Ingresar a una universidad privada', value: 'privada' },
      { label: 'Mejorar mis notas del colegio', value: 'notas' },
      { label: 'Elegir qué carrera estudiar', value: 'carrera' },
    ],
  },
  ciudad: {
    pregunta: '¿En qué ciudad estás?',
    opciones: [
      { label: 'Quito', value: 'quito' },
      { label: 'Otra ciudad del Ecuador', value: 'otra' },
    ],
  },
  modalidad: {
    pregunta: '¿Qué tipo de apoyo online necesitas?',
    opciones: [
      { label: 'Clases online en vivo', value: 'clases-online' },
      { label: 'Plataforma + simuladores', value: 'plataforma' },
      { label: 'Aún no sé qué ritmo necesito', value: 'sin-definir' },
    ],
  },
  tiempo: {
    pregunta: '¿Cuándo es tu proceso de admisión?',
    opciones: [
      { label: 'En menos de 1 mes', value: 'urgente' },
      { label: 'Entre 1 y 3 meses', value: 'pronto' },
      { label: 'En más de 3 meses', value: 'tiempo' },
      { label: 'Aún no tengo fecha', value: 'sin-fecha' },
    ],
  },
};

const labels = {
  tipo: {
    publica: 'ingresar a una universidad pública',
    privada: 'ingresar a una universidad privada',
    notas: 'mejorar mis notas del colegio',
    carrera: 'elegir qué carrera estudiar',
  },
  ciudad: {
    quito: 'Quito',
    otra: 'otra ciudad de Ecuador',
  },
  modalidad: {
    'clases-online': 'clases online en vivo',
    plataforma: 'Plataforma Gesco con simuladores',
    'sin-definir': 'orientación para definir mi ritmo online',
  },
  tiempo: {
    urgente: 'menos de 1 mes',
    pronto: '1 a 3 meses',
    tiempo: 'más de 3 meses',
    'sin-fecha': 'una fecha sin definir',
  },
} as const;

function buildMessage(answers: Record<AnswerKey, string>) {
  return `Hola, quiero apoyo para ${labels.tipo[answers.tipo as keyof typeof labels.tipo]}. Estoy en ${labels.ciudad[answers.ciudad as keyof typeof labels.ciudad]}. Necesito ${labels.modalidad[answers.modalidad as keyof typeof labels.modalidad]}. Mi proceso es en ${labels.tiempo[answers.tiempo as keyof typeof labels.tiempo]}. ¿Me pueden ayudar con una ruta de preparación online?`;
}

export default function LeadQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    tipo: '',
    ciudad: '',
    modalidad: '',
    tiempo: '',
  });

  const currentStep: Step = stepIndex >= steps.length ? 'resultado' : steps[stepIndex];
  const href = useMemo(() => {
    const message = buildMessage(answers);
    const params = new URLSearchParams({
      text: message,
      utm_source: 'web',
      utm_medium: 'cta',
      utm_campaign: 'quiz-lead',
    });

    return `https://wa.me/${SITE.whatsapp}?${params.toString()}`;
  }, [answers]);

  const choose = (key: AnswerKey, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-extrabold text-navy">Encuentra tu ruta GESCO</h2>
        <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-muted">
          {Math.min(stepIndex + 1, steps.length)} / {steps.length}
        </span>
      </div>

      {currentStep !== 'resultado' ? (
        <div>
          <p className="mb-4 text-lg font-bold text-text">{questions[currentStep].pregunta}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {questions[currentStep].opciones.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(currentStep, option.value)}
                className="min-h-11 rounded-2xl border border-black/10 px-4 py-3 text-left font-semibold text-navy transition hover:border-brand hover:bg-surface"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="text-muted">Ya tenemos una primera orientación. Escríbenos y un asesor te ayuda a aterrizar una ruta de preparación.</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-wa-source="lead-quiz"
            style={{ color: '#ffffff' }}
            className="solid-cta inline-flex min-h-11 items-center justify-center rounded-full bg-green-700 px-5 py-3 font-bold hover:bg-green-800"
          >
            Enviar mi ruta por WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setStepIndex(0)}
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Reiniciar respuestas
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

interface Props {
  target: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function Counter({ target, suffix = '', label, duration = 1400 }: Props) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasRun.current) return;
      hasRun.current = true;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setValue(Math.round(target * progress));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.disconnect();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [duration, target]);

  return (
    <div ref={elementRef} className="text-center">
      <div className="font-heading text-4xl font-extrabold text-white md:text-5xl">
        {suffix === '+' ? '+' : ''}
        {value.toLocaleString('es-EC')}
        {suffix !== '+' ? suffix : ''}
      </div>
      <p className="mt-2 text-sm font-semibold text-white/80">{label}</p>
    </div>
  );
}

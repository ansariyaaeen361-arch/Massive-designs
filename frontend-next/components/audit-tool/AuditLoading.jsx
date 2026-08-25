import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import AmbientGlow from '../motion/AmbientGlow';

const STEPS = [
  'Checking performance…',
  'Scanning SEO fundamentals…',
  'Testing mobile-friendliness…',
  'Verifying SSL & security…',
  'Reviewing accessibility basics…',
];

export default function AuditLoading({ url }) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const stepsRef = useRef([]);

  useGSAP(
    () => {
      gsap.fromTo(rootRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 1.4,
        repeat: -1,
        ease: 'linear',
      });

      const steps = stepsRef.current.filter(Boolean);
      const tl = gsap.timeline({ repeat: -1 });
      steps.forEach((el) => {
        tl.set(steps, { opacity: 0, y: 0 })
          .to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
          .to(el, { opacity: 1, duration: 1.6 })
          .to(el, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative isolate flex flex-col items-center py-20 text-center">
      <AmbientGlow position="center" size="lg" intensity="low" />

      <div ref={ringRef} className="h-16 w-16 rounded-full border-2 border-white/10 border-t-primary" />

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-primary">Auditing {url}</p>

      <div className="relative mt-4 h-6 w-full max-w-md">
        {STEPS.map((step, i) => (
          <p
            key={step}
            ref={(el) => (stepsRef.current[i] = el)}
            className="absolute inset-0 text-sm text-white/60"
          >
            {step}
          </p>
        ))}
      </div>

      <p className="mt-10 max-w-sm text-xs text-white/30">
        This usually takes 5–15 seconds while we run live performance, SEO and security checks.
      </p>
    </div>
  );
}

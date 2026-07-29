import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';

export default function CustomCursor() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useGSAP(
    () => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      document.documentElement.classList.add('has-custom-cursor');
      rootRef.current.style.display = 'block';

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });

      const dotX = gsap.quickTo(dotRef.current, 'x', { duration: reduced ? 0 : 0.12, ease: 'power3' });
      const dotY = gsap.quickTo(dotRef.current, 'y', { duration: reduced ? 0 : 0.12, ease: 'power3' });
      const ringX = gsap.quickTo(ringRef.current, 'x', { duration: reduced ? 0 : 0.35, ease: 'power3' });
      const ringY = gsap.quickTo(ringRef.current, 'y', { duration: reduced ? 0 : 0.35, ease: 'power3' });

      const handleMove = (e) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };
      window.addEventListener('mousemove', handleMove, { passive: true });

      const handleOver = (e) => {
        if (!e.target.closest(INTERACTIVE_SELECTOR)) return;
        gsap.to(ringRef.current, { scale: 1.8, duration: 0.25, ease: 'power2.out' });
        gsap.to(dotRef.current, { scale: 0, duration: 0.25, ease: 'power2.out' });
      };
      const handleOut = (e) => {
        if (!e.target.closest(INTERACTIVE_SELECTOR)) return;
        gsap.to(ringRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
        gsap.to(dotRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
      };
      document.addEventListener('mouseover', handleOver);
      document.addEventListener('mouseout', handleOut);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseover', handleOver);
        document.removeEventListener('mouseout', handleOut);
        document.documentElement.classList.remove('has-custom-cursor');
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden">
      <div ref={dotRef} className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary" />
      <div ref={ringRef} className="absolute left-0 top-0 h-8 w-8 rounded-full border border-primary/70" />
    </div>
  );
}

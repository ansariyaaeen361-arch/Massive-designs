import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

export default function AuroraBackground() {
  const rootRef = useRef(null);
  const haloRef = useRef(null);
  const litRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!hasFinePointer) {
        root.classList.add('aurora-no-cursor');
        return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 3 };

      const halo = haloRef.current;
      const lit = litRef.current;
      const wrap = (v) => ((v % 28) + 28) % 28;
      const apply = () => {
        const move = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        halo.style.transform = move;
        lit.style.transform = move;
        lit.style.backgroundPosition = `${-wrap(pos.x - 240)}px ${-wrap(pos.y - 240)}px`;
      };
      apply();

      if (prefersReducedMotion) {
        const snap = (e) => {
          pos.x = e.clientX;
          pos.y = e.clientY;
          apply();
        };
        window.addEventListener('mousemove', snap, { passive: true });
        return () => window.removeEventListener('mousemove', snap);
      }

      const xTo = gsap.quickTo(pos, 'x', { duration: 0.7, ease: 'power3', onUpdate: apply });
      const yTo = gsap.quickTo(pos, 'y', { duration: 0.7, ease: 'power3', onUpdate: apply });
      const move = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener('mousemove', move, { passive: true });
      return () => window.removeEventListener('mousemove', move);
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="aurora pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-beam" />
      <div className="aurora-dots" />
      <div ref={litRef} className="aurora-dots-lit" />
      <div ref={haloRef} className="aurora-halo" />
      <div className="aurora-vignette" />
    </div>
  );
}

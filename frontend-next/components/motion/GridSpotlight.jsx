import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

const MASK_RADIUS = 260; // px

export default function GridSpotlight() {
  const rootRef = useRef(null);
  const spotlightRef = useRef(null);

  useGSAP(
    () => {
      const spotlight = spotlightRef.current;
      if (!spotlight) return;

      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!hasFinePointer) {
        spotlight.style.display = 'none';
        return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      const applyMask = () => {
        spotlight.style.setProperty('--mx', `${pos.x}px`);
        spotlight.style.setProperty('--my', `${pos.y}px`);
      };
      applyMask();

      if (prefersReducedMotion) {
        const handleSnap = (e) => {
          pos.x = e.clientX;
          pos.y = e.clientY;
          applyMask();
        };
        window.addEventListener('mousemove', handleSnap, { passive: true });
        return () => window.removeEventListener('mousemove', handleSnap);
      }

      const xTo = gsap.quickTo(pos, 'x', { duration: 0.5, ease: 'power3', onUpdate: applyMask });
      const yTo = gsap.quickTo(pos, 'y', { duration: 0.5, ease: 'power3', onUpdate: applyMask });

      const handleMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener('mousemove', handleMove, { passive: true });

      return () => window.removeEventListener('mousemove', handleMove);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-1]">
      <div className="absolute inset-0 bg-grid-base" />
      <div
        ref={spotlightRef}
        className="absolute inset-0 bg-grid-spotlight"
        style={{
          '--mx': '50%',
          '--my': '50%',
          maskImage: `radial-gradient(circle ${MASK_RADIUS}px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(circle ${MASK_RADIUS}px at var(--mx, 50%) var(--my, 50%), black 0%, transparent 70%)`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          willChange: 'mask-image',
        }}
      />
    </div>
  );
}

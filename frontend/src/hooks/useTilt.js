import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';

export default function useTilt(ref, { max = 10, scale = 1.02 } = {}) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.set(el, { transformPerspective: 800, transformStyle: 'preserve-3d' });

      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          rotateY: px * max * 2,
          rotateX: -py * max * 2,
          scale,
          duration: 0.4,
          ease: 'power3',
          overwrite: 'auto',
        });
      };
      const handleLeave = () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.4, ease: 'power3', overwrite: 'auto' });
      };

      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
      return () => {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      };
    },
    { scope: ref, dependencies: [max, scale] },
  );
}

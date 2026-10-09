import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';

const POSITION = {
  'top-left': '-top-32 -left-32',
  'top-right': '-top-32 -right-32',
  'top-center': '-top-40 left-1/2 -translate-x-1/2',
  'bottom-left': '-bottom-32 -left-32',
  'bottom-right': '-bottom-32 -right-32',
  'bottom-center': '-bottom-40 left-1/2 -translate-x-1/2',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

// Soft radial gradients instead of CSS blur(): same look, no per-frame
// filter cost while scrolling.
const SIZE = {
  sm: 'h-[420px] w-[420px]',
  md: 'h-[640px] w-[640px]',
  lg: 'h-[860px] w-[860px]',
  xl: 'h-[1100px] w-[1100px]',
};

const INTENSITY = {
  low: 0.07,
  medium: 0.14,
  high: 0.2,
};

export default function AmbientGlow({
  position = 'top-right',
  size = 'md',
  intensity = 'medium',
  animate = true,
  className = '',
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!animate || !ref.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.to(ref.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: ref, dependencies: [animate] },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full ${POSITION[position]} ${SIZE[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, rgb(181 246 82 / ${INTENSITY[intensity]}) 0%, transparent 68%)`,
        willChange: 'transform, opacity',
      }}
    />
  );
}

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

const SIZE = {
  sm: 'h-[240px] w-[240px] blur-[90px]',
  md: 'h-[380px] w-[380px] blur-[120px]',
  lg: 'h-[520px] w-[520px] blur-[140px]',
  xl: 'h-[680px] w-[680px] blur-[160px]',
};

const INTENSITY = {
  low: 'bg-primary/5',
  medium: 'bg-primary/10',
  high: 'bg-primary/15',
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
      className={`pointer-events-none absolute -z-10 rounded-full ${POSITION[position]} ${SIZE[size]} ${INTENSITY[intensity]} ${className}`}
    />
  );
}

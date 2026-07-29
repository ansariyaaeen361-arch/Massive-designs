import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: to,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(obj.value).toString();
        },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          once: true,
        },
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.trigger === ref.current && t.kill());
    },
    { scope: ref },
  );

  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

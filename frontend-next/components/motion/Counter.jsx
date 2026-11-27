import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null);
  // Static/first-paint markup ships the real number so it reads correctly
  // without JavaScript (SEO, crawlers, no-JS). The animation resets to 0
  // and counts back up only once this hook runs on the client.
  const [display, setDisplay] = useState(to);

  useGSAP(
    () => {
      setDisplay(0);
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
      <span ref={ref}>{display}</span>
      {suffix}
    </span>
  );
}

import { useEffect, useRef, useState } from 'react';
import Reveal from '../../components/motion/Reveal';
import massiveVideo from '../../assets/video/massive.mp4';

export default function VideoShowcase() {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal y={40} className="relative aspect-video overflow-hidden rounded-[2rem] bg-white/5">
          <div ref={containerRef} className="pointer-events-none absolute -inset-16 -z-10 bg-primary/10 blur-[120px]" />
          {inView && (
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="none">
              <source src={massiveVideo} type="video/mp4" />
            </video>
          )}
        </Reveal>
      </div>
    </section>
  );
}

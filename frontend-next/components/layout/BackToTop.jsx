import { useEffect, useRef, useState } from 'react';
import { HiArrowUp } from 'react-icons/hi';
import { gsap } from '../../lib/gsap';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    gsap.to(btnRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 20,
      pointerEvents: visible ? 'auto' : 'none',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [visible]);

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{ opacity: 0 }}
      className="fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black shadow-lg transition-transform hover:-translate-y-1 lg:right-10"
    >
      <HiArrowUp className="text-lg" />
    </button>
  );
}

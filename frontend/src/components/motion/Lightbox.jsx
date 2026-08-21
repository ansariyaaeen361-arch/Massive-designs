import { useEffect, useRef } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { gsap } from '../../lib/gsap';

export default function Lightbox({ onClose, children }) {
  const overlayRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(boxRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
    >
      <div ref={boxRef} onClick={(e) => e.stopPropagation()} className="relative max-h-[85vh] max-w-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-10 right-0 text-2xl text-white/70 transition-colors hover:text-primary"
        >
          <HiXMark aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

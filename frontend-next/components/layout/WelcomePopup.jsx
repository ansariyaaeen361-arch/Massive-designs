import { useEffect, useRef, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { gsap } from '../../lib/gsap';
import { brand } from '../../lib/brand';

const SESSION_KEY = 'md_welcome_popup_shown';
const SHOW_DELAY_MS = 2500;

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      gsap.set(rootRef.current, { pointerEvents: 'auto' });
      gsap.to(rootRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' },
      );
    }
  }, [open]);

  const handleCtaClick = () => {
    fetch('/api/popup-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ popup: 'welcome-offer', page: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  };

  const handleClose = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(rootRef.current, { pointerEvents: 'none' });
        setOpen(false);
      },
    });
  };

  if (!open) return null;

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[80] opacity-0">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative flex h-full items-center justify-center overflow-y-auto p-4 py-10">
        <div
          ref={panelRef}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0c10] p-8 text-center sm:p-10"
        >
          <button
            type="button"
            aria-label="Close popup"
            onClick={handleClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary"
          >
            <HiX className="text-lg" />
          </button>

          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Join the Massive Family</p>
          <h3 className="mt-4 text-2xl text-white sm:text-3xl">Your first design is on us.</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Let&rsquo;s create something your business deserves. No commitment. Just good design.
          </p>

          <a
            href={brand.phoneTel}
            onClick={handleCtaClick}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
          >
            Get My Free Design
          </a>

          <p className="mt-5 text-xs text-white/40">New clients only. One complimentary design concept.</p>
        </div>
      </div>
    </div>
  );
}

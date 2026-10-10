import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { gsap } from '../../lib/gsap';
import { isHalloweenSeason } from '../../lib/season';
import { trackEvent } from '../../lib/analytics';

// Shows the Halloween offer card. Anything can trigger it by dispatching
// window 'hw-open-offer' (the intro's pumpkin-crack moment, the ticker's
// mascot click, etc.) so the popup itself stays decoupled from whoever
// asked for it.
export default function HalloweenOfferModal() {
  const [open, setOpen] = useState(false);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isHalloweenSeason()) return undefined;
    const handler = (e) => {
      trackEvent('halloween_popup_shown', { source: e.detail?.source || 'unknown' });
      setOpen(true);
    };
    window.addEventListener('hw-open-offer', handler);
    return () => window.removeEventListener('hw-open-offer', handler);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('welcome-popup-open');
    gsap.set(backdropRef.current, { pointerEvents: 'auto' });
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 20, scale: 0.85, rotate: -4 },
      { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.6)' },
    );
    return () => document.body.classList.remove('welcome-popup-open');
  }, [open]);

  const handleClose = (method) => {
    trackEvent('halloween_popup_closed', { source: 'halloween_offer_modal', method });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(backdropRef.current, { pointerEvents: 'none' });
        setOpen(false);
      },
    });
  };

  if (!open) return null;

  return (
    <div ref={backdropRef} className="fixed inset-0 z-[200] opacity-0">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => handleClose('backdrop')} />
      <div className="relative flex h-full items-center justify-center overflow-y-auto p-4 py-10">
        <div
          ref={panelRef}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(255,140,20,0.45)] sm:max-w-md"
        >
          <button
            type="button"
            aria-label="Close offer"
            onClick={() => handleClose('button')}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-lg backdrop-blur-sm transition-colors hover:border-[#ff9d2e] hover:text-[#ff9d2e]"
          >
            <HiX className="text-lg" />
          </button>
          <a
            href="/contact/"
            onClick={() => trackEvent('halloween_offer_click', { source: 'halloween_card_image' })}
            className="block"
          >
            <img
              src="/img/halloween/offer.webp"
              alt="Halloween All-in-One Brand Starter Package offer: professional logo design, business card design, and a 2-page informative website, everything for $99.99"
              className="block w-full"
            />
          </a>
          <div className="bg-[#0b0c10] p-4 text-center">
            <Link
              href="/contact/"
              onClick={() => trackEvent('halloween_offer_click', { source: 'halloween_card_cta' })}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff9d2e] to-[#ffce54] px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-0.5"
            >
              Claim This Offer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import { isHalloweenSeason } from '../../lib/season';
import { trackEvent } from '../../lib/analytics';

const SESSION_KEY = 'md_halloween_intro_shown';
const SPIDER_START_MS = 1100;
const PUMPKIN_START_MS = 20000;
const THREAD_LEN = 280;

const LEFT_LEGS = [
  'M30,28 Q16,20 6,24',
  'M30,33 Q14,30 2,38',
  'M30,40 Q14,42 4,52',
  'M31,46 Q18,54 10,64',
];
const RIGHT_LEGS = [
  'M50,28 Q64,20 74,24',
  'M50,33 Q66,30 78,38',
  'M50,40 Q66,42 76,52',
  'M51,46 Q62,54 70,64',
];

const CRACK = '100,20 92,45 106,62 88,85 104,105 90,128 100,150';
const LEFT_CLIP = `0,0 ${CRACK} 0,170`;
const RIGHT_CLIP = `200,0 ${CRACK} 200,170`;

const PARTICLES = [
  { dx: -70, dy: -40, rot: -140, size: 7, delay: 0, color: '#ff9d2e' },
  { dx: 60, dy: -55, rot: 160, size: 6, delay: 0.02, color: '#ffce54' },
  { dx: -90, dy: 10, rot: -90, size: 5, delay: 0.04, color: '#c9560d' },
  { dx: 85, dy: 0, rot: 120, size: 8, delay: 0.01, color: '#ff9d2e' },
  { dx: -45, dy: 55, rot: -200, size: 5, delay: 0.06, color: '#fff3cf' },
  { dx: 50, dy: 60, rot: 180, size: 6, delay: 0.03, color: '#c9560d' },
  { dx: -20, dy: -75, rot: -60, size: 5, delay: 0.05, color: '#ffce54' },
  { dx: 20, dy: -80, rot: 80, size: 6, delay: 0.02, color: '#ff9d2e' },
];

function Spider({ wrapRef, threadRef, bodyRef, legsRef }) {
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="hwi-spider-wrap pointer-events-none fixed left-1/2 top-0 z-[90]"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div ref={threadRef} className="hwi-thread" style={{ height: THREAD_LEN }} />
      <svg
        ref={bodyRef}
        className="hwi-spider"
        width="168"
        height="147"
        viewBox="0 0 80 70"
        style={{ position: 'absolute', top: THREAD_LEN - 22, left: '50%', transform: 'translateX(-50%)' }}
      >
        <ellipse cx="40" cy="58" rx="16" ry="4" fill="#000" opacity="0.18" />
        <g ref={legsRef} fill="none" stroke="#16100c" strokeWidth="2.3" strokeLinecap="round">
          {LEFT_LEGS.map((d, i) => (
            <path key={`l${i}`} className="hwi-leg" d={d} style={{ transformOrigin: '30px 30px' }} />
          ))}
          {RIGHT_LEGS.map((d, i) => (
            <path key={`r${i}`} className="hwi-leg" d={d} style={{ transformOrigin: '50px 30px' }} />
          ))}
        </g>
        <ellipse cx="40" cy="46" rx="12" ry="15" fill="url(#hwiSpiderBody)" />
        <ellipse cx="40" cy="28" rx="8" ry="9" fill="url(#hwiSpiderBody)" />
        <circle cx="37" cy="25" r="1.4" fill="#fff" />
        <circle cx="43" cy="25" r="1.4" fill="#fff" />
        <circle cx="35" cy="28" r="1" fill="#fff" opacity="0.8" />
        <circle cx="45" cy="28" r="1" fill="#fff" opacity="0.8" />
        <defs>
          <radialGradient id="hwiSpiderBody" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#443a32" />
            <stop offset="55%" stopColor="#201711" />
            <stop offset="100%" stopColor="#0c0806" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function PumpkinArt({ id }) {
  return (
    <g id={id}>
      <path
        d="M100,22 C140,18 168,40 170,88 C172,132 142,162 100,164 C58,162 28,132 30,88 C32,40 60,18 100,22 Z"
        fill="url(#hwiPumpkinBody)"
      />
      <g stroke="#9c3f09" strokeWidth="2" opacity="0.45" fill="none">
        <path d="M66,26 C46,54 44,130 68,160" />
        <path d="M84,22 C70,54 70,132 86,163" />
        <path d="M116,22 C130,54 130,132 114,163" />
        <path d="M134,26 C154,54 156,130 132,160" />
      </g>
      <g stroke="#ffb458" strokeWidth="1.3" opacity="0.35" fill="none">
        <path d="M72,26 C54,54 52,128 74,158" />
        <path d="M128,26 C146,54 148,128 126,158" />
      </g>
      <path
        d="M92,24 C90,10 96,2 108,4 C104,10 106,16 112,18 C102,22 94,24 92,24 Z"
        fill="url(#hwiStem)"
      />
      <polygon points="70,78 90,92 70,106" fill="url(#hwiGlow)" />
      <polygon points="130,78 110,92 130,106" fill="url(#hwiGlow)" />
      <polygon points="80,122 92,114 100,124 108,114 120,122 112,134 96,128 88,134" fill="url(#hwiGlow)" />
      <ellipse cx="78" cy="55" rx="14" ry="20" fill="#fff" opacity="0.08" />
    </g>
  );
}

export default function HalloweenIntro() {
  const [active, setActive] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  const spiderWrapRef = useRef(null);
  const threadRef = useRef(null);
  const spiderBodyRef = useRef(null);
  const legsGroupRef = useRef(null);

  const sceneRef = useRef(null);
  const pumpkinWrapRef = useRef(null);
  const leftHalfRef = useRef(null);
  const rightHalfRef = useRef(null);
  const flashRef = useRef(null);
  const particleRefs = useRef([]);
  const shadowRef = useRef(null);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  const spiderOverlayRef = useRef(null);
  const pumpkinOverlayRef = useRef(null);

  useEffect(() => {
    if (window.location.pathname.startsWith('/dashboard')) return;
    if (!isHalloweenSeason()) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    setActive(true);
  }, []);

  useGSAP(
    () => {
      if (!active) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        const t = setTimeout(() => openCard(), 1500);
        return () => clearTimeout(t);
      }

      // --- Spider entrance ---
      const spiderTimer = setTimeout(() => {
        const wrap = spiderWrapRef.current;
        const thread = threadRef.current;
        const spider = spiderBodyRef.current;
        const legs = legsGroupRef.current.querySelectorAll('.hwi-leg');
        if (!wrap || !thread || !spider) return;

        wrap.style.display = 'block';
        const overlay = spiderOverlayRef.current;
        overlay.style.display = 'block';
        const progress = { v: 0 };

        const tl = gsap.timeline();
        tl.to(overlay, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 0)
          .to(
            progress,
            {
              v: 1,
              duration: 1.1,
              ease: 'back.out(1.3)',
              onUpdate: () => {
                thread.style.transform = `scaleY(${progress.v})`;
                spider.style.top = `${progress.v * (THREAD_LEN - 22)}px`;
              },
            },
            0,
          )
          .to(wrap, { rotate: 5, duration: 0.7, ease: 'sine.inOut', transformOrigin: 'top center' })
          .to(wrap, { rotate: -4, duration: 0.65, ease: 'sine.inOut' })
          .to(wrap, { rotate: 2.5, duration: 0.55, ease: 'sine.inOut' })
          .to(wrap, { rotate: 0, duration: 0.5, ease: 'sine.inOut' })
          .to(
            legs,
            {
              rotate: () => gsap.utils.random(-6, 6),
              duration: 0.35,
              ease: 'sine.inOut',
              stagger: { each: 0.08, repeat: 5, yoyo: true },
            },
            '<',
          )
          .to(progress, {
            v: 0,
            duration: 0.9,
            ease: 'power2.in',
            onUpdate: () => {
              thread.style.transform = `scaleY(${progress.v})`;
              spider.style.top = `${progress.v * (THREAD_LEN - 22)}px`;
            },
            onComplete: () => {
              wrap.style.display = 'none';
            },
          })
          .to(
            overlay,
            {
              opacity: 0,
              duration: 0.9,
              ease: 'power1.in',
              onComplete: () => {
                overlay.style.display = 'none';
              },
            },
            '<',
          );
      }, SPIDER_START_MS);

      // --- Pumpkin entrance + crack ---
      const pumpkinTimer = setTimeout(() => {
        const pumpkin = pumpkinWrapRef.current;
        if (!pumpkin) return;
        pumpkin.style.display = 'block';
        const pOverlay = pumpkinOverlayRef.current;
        pOverlay.style.display = 'block';

        const tl = gsap.timeline();
        tl.to(pOverlay, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0)
          .fromTo(
            pumpkin,
            { scale: 0, opacity: 0, rotate: -8 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)' },
            0,
          )
          .fromTo(shadowRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.3, duration: 0.5 }, '<')
          .to(pumpkin, { y: -6, duration: 0.55, ease: 'sine.inOut', repeat: 2, yoyo: true })
          .to({}, { duration: 0.3 })
          .add(crackPumpkin);
      }, PUMPKIN_START_MS);

      function crackPumpkin() {
        const pOverlay = pumpkinOverlayRef.current;
        const tl = gsap.timeline();
        tl.to(sceneRef.current, { x: -4, duration: 0.05, repeat: 5, yoyo: true, ease: 'none' })
          .to(
            pOverlay,
            {
              opacity: 0,
              duration: 0.6,
              ease: 'power1.in',
              onComplete: () => {
                pOverlay.style.display = 'none';
              },
            },
            '<',
          )
          .fromTo(
            flashRef.current,
            { scale: 0, opacity: 0.95 },
            { scale: 3, opacity: 0, duration: 0.45, ease: 'power2.out' },
            '<',
          )
          .to(
            leftHalfRef.current,
            { x: -62, y: 36, rotate: -26, opacity: 0, duration: 0.65, ease: 'power2.in' },
            '<0.05',
          )
          .to(
            rightHalfRef.current,
            { x: 62, y: 36, rotate: 26, opacity: 0, duration: 0.65, ease: 'power2.in' },
            '<',
          )
          .to(
            particleRefs.current,
            {
              x: (i) => PARTICLES[i].dx,
              y: (i) => PARTICLES[i].dy,
              rotate: (i) => PARTICLES[i].rot,
              opacity: 0,
              scale: 0.4,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.015,
            },
            '<',
          )
          .add(() => openCard(), '<0.1');
      }

      function openCard() {
        trackEvent('halloween_popup_shown', { source: 'halloween_intro' });
        window.sessionStorage.setItem(SESSION_KEY, '1');
        setCardOpen(true);
      }

      return () => {
        clearTimeout(spiderTimer);
        clearTimeout(pumpkinTimer);
      };
    },
    { dependencies: [active] },
  );

  useEffect(() => {
    if (!cardOpen) return undefined;
    document.body.classList.add('welcome-popup-open');
    gsap.set(backdropRef.current, { pointerEvents: 'auto' });
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 20, scale: 0.85, rotate: -4 },
      { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.6)' },
    );
    return () => document.body.classList.remove('welcome-popup-open');
  }, [cardOpen]);

  const handleClose = (method) => {
    trackEvent('halloween_popup_closed', { source: 'halloween_intro', method });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(backdropRef.current, { pointerEvents: 'none' });
        setCardOpen(false);
      },
    });
  };

  if (!active) return null;

  return (
    <>
      <div ref={spiderOverlayRef} aria-hidden="true" className="hwi-overlay hwi-overlay-blur" />
      <div ref={pumpkinOverlayRef} aria-hidden="true" className="hwi-overlay hwi-overlay-soft" />

      <Spider wrapRef={spiderWrapRef} threadRef={threadRef} bodyRef={spiderBodyRef} legsRef={legsGroupRef} />

      <div
        ref={pumpkinWrapRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/3 z-[90] hidden -translate-x-1/2 -translate-y-1/2"
      >
        <div ref={sceneRef} className="relative">
          <div
            ref={shadowRef}
            className="absolute left-1/2 top-[248px] h-9 w-64 -translate-x-1/2 rounded-full bg-black opacity-0 blur-md"
          />
          <svg className="hwi-pumpkin-svg" viewBox="0 0 200 170" style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="hwiPumpkinBody" cx="40%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#ff9d2e" />
                <stop offset="60%" stopColor="#f2730f" />
                <stop offset="100%" stopColor="#c9560d" />
              </radialGradient>
              <linearGradient id="hwiStem" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7a5a2c" />
                <stop offset="100%" stopColor="#4a3818" />
              </linearGradient>
              <radialGradient id="hwiGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#fff6d0" />
                <stop offset="45%" stopColor="#ffb13c" />
                <stop offset="100%" stopColor="#7a2d02" />
              </radialGradient>
              <clipPath id="hwiLeftClip">
                <polygon points={LEFT_CLIP} />
              </clipPath>
              <clipPath id="hwiRightClip">
                <polygon points={RIGHT_CLIP} />
              </clipPath>
            </defs>

            <g ref={leftHalfRef} clipPath="url(#hwiLeftClip)">
              <PumpkinArt id="hwiArtL" />
            </g>
            <g ref={rightHalfRef} clipPath="url(#hwiRightClip)">
              <PumpkinArt id="hwiArtR" />
            </g>

            {PARTICLES.map((pt, i) => (
              <circle
                key={i}
                ref={(el) => {
                  particleRefs.current[i] = el;
                }}
                cx="100"
                cy="90"
                r={pt.size}
                fill={pt.color}
              />
            ))}

            <circle ref={flashRef} cx="100" cy="90" r="40" fill="#fff6cf" opacity="0" />
          </svg>
        </div>
      </div>

      {cardOpen && (
        <div ref={backdropRef} className="fixed inset-0 z-[200] opacity-0">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => handleClose('backdrop')}
          />
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
      )}
    </>
  );
}

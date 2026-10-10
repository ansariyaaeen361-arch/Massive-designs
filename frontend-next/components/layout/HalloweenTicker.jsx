import { useEffect, useState } from 'react';
import { isHalloweenSeason } from '../../lib/season';
import { trackEvent } from '../../lib/analytics';

const ITEMS = [
  'Happy Halloween from Massive Designs',
  'All-in-One Brand Starter Package',
  'Professional Logo Design',
  'Business Card Design',
  '2-Page Informative Website',
  'Everything in Just $99.99',
];

function PumpkinMascot() {
  return (
    <svg className="hwt-pumpkin" viewBox="0 0 200 190" aria-hidden="true">
      <defs>
        <radialGradient id="hwtBody" cx="36%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#ffd271" />
          <stop offset="35%" stopColor="#ff9d2e" />
          <stop offset="68%" stopColor="#e8590c" />
          <stop offset="100%" stopColor="#8f2d05" />
        </radialGradient>
        <radialGradient id="hwtGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#fffdf0" />
          <stop offset="40%" stopColor="#ffd666" />
          <stop offset="100%" stopColor="#c9560d" />
        </radialGradient>
        <linearGradient id="hwtStem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8fae4a" />
          <stop offset="100%" stopColor="#425f20" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="177" rx="56" ry="8" fill="#000" opacity="0.22" />

      {/* left arm: thick rounded limb + a hand blob, not just a thin line */}
      <path d="M38,110 Q10,120 8,144" stroke="#e07a1c" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="8" cy="144" r="10" fill="#e07a1c" />

      {/* right arm: waves as one rigid unit (limb + hand together) */}
      <g className="hwt-arm" style={{ transformOrigin: '162px 110px' }}>
        <path d="M162,110 Q190,100 192,74" stroke="#e07a1c" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="192" cy="74" r="10" fill="#e07a1c" />
      </g>

      {/* body: a proper lobed jack-o'-lantern silhouette with shaded ribs */}
      <path
        d="M100,34 C150,30 182,56 184,108 C186,156 150,189 100,191 C50,189 14,156 16,108 C18,56 50,30 100,34 Z"
        fill="url(#hwtBody)"
        stroke="#6b1f03"
        strokeWidth="2.5"
      />
      <g stroke="#7a2704" strokeWidth="6" opacity="0.55" fill="none" strokeLinecap="round">
        <path d="M44,44 C26,72 25,148 46,180" />
        <path d="M72,36 C58,70 58,150 74,184" />
        <path d="M128,36 C142,70 142,150 126,184" />
        <path d="M156,44 C174,72 175,148 154,180" />
      </g>
      <g stroke="#ffcf6b" strokeWidth="3.2" opacity="0.5" fill="none" strokeLinecap="round">
        <path d="M100,34 C96,70 96,152 100,191" />
      </g>
      <path
        d="M86,36 C80,16 98,4 118,12 C110,20 112,27 121,32 C104,40 90,41 86,36 Z"
        fill="url(#hwtStem)"
        stroke="#2e4414"
        strokeWidth="1.8"
      />
      <polygon
        points="60,88 96,112 60,134"
        fill="url(#hwtGlow)"
        stroke="#4a1702"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <polygon
        points="140,88 104,112 140,134"
        fill="url(#hwtGlow)"
        stroke="#4a1702"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M58,138 L74,154 L86,136 L100,154 L114,136 L126,154 L142,138
           L126,166 L114,150 L100,166 L86,150 L74,166 Z"
        fill="url(#hwtGlow)"
        stroke="#4a1702"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse cx="72" cy="62" rx="17" ry="24" fill="#fff" opacity="0.1" />
    </svg>
  );
}

export default function HalloweenTicker() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/dashboard')) return undefined;
    if (!isHalloweenSeason()) return undefined;
    setActive(true);
    document.documentElement.classList.add('has-hw-ticker');
    return () => document.documentElement.classList.remove('has-hw-ticker');
  }, []);

  if (!active) return null;

  const openOffer = () => {
    trackEvent('halloween_offer_click', { source: 'halloween_ticker_pumpkin' });
    window.dispatchEvent(new CustomEvent('hw-open-offer', { detail: { source: 'halloween_ticker' } }));
  };

  return (
    <>
      <button type="button" onClick={openOffer} aria-label="View Halloween offer" className="hwt-mascot-btn">
        <PumpkinMascot />
      </button>

      <div className="hwt-bar">
        <div className="hwt-track">
          <div className="hwt-track-inner">
            {[...ITEMS, ...ITEMS].map((text, i) => (
              <span className="hwt-item" key={i}>
                {text}
                <span className="hwt-dot">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

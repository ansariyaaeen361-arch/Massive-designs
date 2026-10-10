import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import { isHalloweenSeason } from '../../lib/season';

const SESSION_KEY = 'md_halloween_intro_shown';
const SPIDER_START_MS = 1100;
const PUMPKIN_START_MS = 24000;

// Each leg: a local path (attached near the body) plus the pivot point used
// for its idle rotation wobble. GAIT_A / GAIT_B split them into two
// alternating sets so the walk reads as a real tripod-style gait.
const LEGS = [
  { d: 'M30,26 Q14,14 4,18 Q-4,21 -10,12', origin: '30px 26px' },
  { d: 'M30,32 Q12,28 2,34 Q-8,38 -14,30', origin: '30px 32px' },
  { d: 'M30,40 Q12,44 2,52 Q-8,58 -12,68', origin: '30px 40px' },
  { d: 'M31,47 Q16,56 8,66 Q0,74 -8,82', origin: '31px 47px' },
  { d: 'M50,26 Q66,14 76,18 Q84,21 90,12', origin: '50px 26px' },
  { d: 'M50,32 Q68,28 78,34 Q88,38 94,30', origin: '50px 32px' },
  { d: 'M50,40 Q68,44 78,52 Q88,58 92,68', origin: '50px 40px' },
  { d: 'M49,47 Q64,56 72,66 Q80,74 88,82', origin: '49px 47px' },
];
const GAIT_A = [0, 2, 5, 7];
const GAIT_B = [1, 3, 4, 6];

const WEB_SPOKE_COUNT = 10;
const WEB_START_ANGLE = 92;
const WEB_END_ANGLE = 184;
const WEB_RING_FRACTIONS = [0.16, 0.32, 0.5, 0.68, 0.85, 1.02];

// Builds a big corner orb-web (spokes fanning from the anchor + connecting
// rings) directly in viewport pixels, so it can genuinely span the screen.
// Returns the spoke endpoints so the spider's walk can be plotted along them.
function buildWeb(group, anchor, radius) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  while (group.firstChild) group.removeChild(group.firstChild);

  const toRad = (deg) => (deg * Math.PI) / 180;
  const angles = Array.from({ length: WEB_SPOKE_COUNT }, (_, i) =>
    WEB_START_ANGLE + ((WEB_END_ANGLE - WEB_START_ANGLE) * i) / (WEB_SPOKE_COUNT - 1),
  );
  const spokePoints = angles.map((a) => ({
    x: anchor.x + radius * Math.cos(toRad(a)),
    y: anchor.y + radius * Math.sin(toRad(a)),
  }));

  spokePoints.forEach((p) => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', anchor.x);
    line.setAttribute('y1', anchor.y);
    line.setAttribute('x2', p.x);
    line.setAttribute('y2', p.y);
    group.appendChild(line);
  });

  WEB_RING_FRACTIONS.forEach((frac) => {
    const pts = angles
      .map((a) => `${anchor.x + radius * frac * Math.cos(toRad(a))},${anchor.y + radius * frac * Math.sin(toRad(a))}`)
      .join(' ');
    const poly = document.createElementNS(SVG_NS, 'polyline');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'none');
    group.appendChild(poly);
  });

  return { angles, spokePoints };
}

const CRACK = '100,20 92,45 106,62 88,85 104,105 90,128 98,148 100,170';
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

function SpiderArt({ legsRef }) {
  return (
    <g transform="translate(-40,-37)">
      <g ref={legsRef} fill="none" stroke="#120c08" strokeWidth="2.6" strokeLinecap="round">
        {LEGS.map((leg, i) => (
          <path key={i} className="hwi-leg" data-leg={i} d={leg.d} style={{ transformOrigin: leg.origin }} />
        ))}
      </g>
      <path d="M34,21 L29,15" stroke="#120c08" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M46,21 L51,15" stroke="#120c08" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="46" rx="13" ry="16" fill="url(#hwiSpiderBody2)" />
      <path
        d="M40,38 L35.5,45 L40,46.5 L44.5,45 Z M40,46.5 L35.5,54 L40,57.5 L44.5,54 Z"
        fill="#c21d1d"
        opacity="0.9"
      />
      <ellipse cx="40" cy="27" rx="8.5" ry="9.5" fill="url(#hwiSpiderBody2)" />
      <circle cx="37" cy="24" r="1.5" fill="#fff" />
      <circle cx="43" cy="24" r="1.5" fill="#fff" />
      <circle cx="35" cy="27" r="1.1" fill="#fff" opacity="0.85" />
      <circle cx="45" cy="27" r="1.1" fill="#fff" opacity="0.85" />
      <ellipse cx="36" cy="40" rx="5" ry="7" fill="#fff" opacity="0.1" />
    </g>
  );
}

function SpiderScene({ svgRef, webRef, strandRef, spiderGroupRef, legsRef }) {
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] hidden"
      style={{ width: '100vw', height: '100vh' }}
    >
      <defs>
        <radialGradient id="hwiSpiderBody2" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#4a3e35" />
          <stop offset="55%" stopColor="#1c1410" />
          <stop offset="100%" stopColor="#0a0705" />
        </radialGradient>
      </defs>

      <g ref={webRef} stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" opacity="0" />

      <line ref={strandRef} stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" x1="0" y1="0" x2="0" y2="0" />

      <g ref={spiderGroupRef} opacity="0">
        <SpiderArt legsRef={legsRef} />
      </g>
    </svg>
  );
}

function PumpkinArt({ id }) {
  return (
    <g id={id}>
      <path
        d="M100,20 C144,16 174,40 176,88 C178,134 144,166 100,168 C56,166 22,134 24,88 C26,40 56,16 100,20 Z"
        fill="url(#hwiPumpkinBody)"
        stroke="#6b1f03"
        strokeWidth="2"
      />

      {/* dark rib valleys */}
      <g stroke="#7a2704" strokeWidth="5.5" opacity="0.55" fill="none" strokeLinecap="round">
        <path d="M44,30 C26,60 24,130 46,160" />
        <path d="M70,23 C56,58 56,132 72,164" />
        <path d="M130,23 C144,58 144,132 128,164" />
        <path d="M156,30 C174,60 176,130 154,160" />
      </g>
      {/* bright rib crests */}
      <g stroke="#ffcf6b" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round">
        <path d="M58,25 C45,58 44,133 60,163" />
        <path d="M100,20 C96,58 96,134 100,168" />
        <path d="M142,25 C155,58 156,133 140,163" />
      </g>

      <path
        d="M86,23 C80,2 100,-10 122,0 C112,8 114,16 124,21 C106,30 90,29 86,23 Z"
        fill="url(#hwiStem)"
        stroke="#2e4414"
        strokeWidth="1.5"
      />

      <polygon
        points="60,74 98,100 60,124"
        fill="url(#hwiGlow)"
        stroke="#4a1702"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon
        points="140,74 102,100 140,124"
        fill="url(#hwiGlow)"
        stroke="#4a1702"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M54,124 L68,142 L80,122 L92,142 L100,126 L108,142 L120,122 L132,142 L146,124
           L132,156 L120,138 L108,156 L100,142 L92,156 L80,138 L68,156 Z"
        fill="url(#hwiGlow)"
        stroke="#4a1702"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <ellipse cx="74" cy="52" rx="15" ry="22" fill="#fff" opacity="0.1" />
    </g>
  );
}

export default function HalloweenIntro() {
  const [active, setActive] = useState(false);

  const spiderSvgRef = useRef(null);
  const webGroupRef = useRef(null);
  const strandRef = useRef(null);
  const spiderGroupRef = useRef(null);
  const legsGroupRef = useRef(null);
  const introTextRef = useRef(null);

  const sceneRef = useRef(null);
  const pumpkinWrapRef = useRef(null);
  const leftHalfRef = useRef(null);
  const rightHalfRef = useRef(null);
  const flashRef = useRef(null);
  const particleRefs = useRef([]);
  const shadowRef = useRef(null);

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

      // --- Spider entrance: a big web fills the corner, the spider roams
      // along its strands (forward and back, not a single straight line),
      // then the scene clears into a themed message. ---
      const spiderTimer = setTimeout(() => {
        const svg = spiderSvgRef.current;
        const webGroup = webGroupRef.current;
        const strand = strandRef.current;
        const spiderGroup = spiderGroupRef.current;
        const legs = legsGroupRef.current.querySelectorAll('.hwi-leg');
        const overlay = spiderOverlayRef.current;
        if (!svg || !spiderGroup) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isSmall = vw < 640;
        const spiderScale = isSmall ? 1.1 : 1.8;
        const ANCHOR = { x: vw - 14, y: -10 };
        const radius = Math.max(vw, vh) * (isSmall ? 0.75 : 0.95);

        svg.style.display = 'block';
        overlay.style.display = 'block';
        strand.setAttribute('x1', ANCHOR.x);
        strand.setAttribute('y1', ANCHOR.y);
        strand.setAttribute('x2', ANCHOR.x);
        strand.setAttribute('y2', ANCHOR.y);

        buildWeb(webGroup, ANCHOR, radius);
        const EXIT = { x: -100, y: vh * 0.62 };

        // A single, slow, steady walk straight across the web toward the
        // bottom-left, exiting off-screen.
        const WAYPOINTS = [ANCHOR, EXIT];
        const SEGMENT_DURATIONS = [7.5];

        let angle = 0;
        const pos = { x: ANCHOR.x, y: ANCHOR.y };
        const bob = { v: 0 };
        const render = () => {
          const by = Math.sin(bob.v * Math.PI * 2) * 2.2;
          spiderGroup.setAttribute(
            'transform',
            `translate(${pos.x},${pos.y + by}) rotate(${angle}) scale(${spiderScale})`,
          );
          strand.setAttribute('x2', pos.x);
          strand.setAttribute('y2', pos.y + by);
        };
        render();

        const groupA = GAIT_A.map((i) => legs[i]);
        const groupB = GAIT_B.map((i) => legs[i]);
        let bobTween;
        let legTweenA;
        let legTweenB;
        const startGait = () => {
          bobTween = gsap.to(bob, { v: 1, duration: 0.34, repeat: -1, ease: 'sine.inOut', onUpdate: render });
          legTweenA = gsap.to(groupA, { rotate: 11, duration: 0.34, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          legTweenB = gsap.fromTo(
            groupB,
            { rotate: 10 },
            { rotate: -10, duration: 0.34, yoyo: true, repeat: -1, ease: 'sine.inOut' },
          );
        };
        const stopGait = () => {
          bobTween?.kill();
          legTweenA?.kill();
          legTweenB?.kill();
        };

        const tl = gsap.timeline();
        tl.to(overlay, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0)
          .to(webGroup, { opacity: 0.6, duration: 0.6, ease: 'power1.out' }, 0)
          .to(spiderGroup, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.15)
          .add(startGait, 0.2);

        let cursor = 0.2;
        for (let i = 0; i < WAYPOINTS.length - 1; i += 1) {
          const from = WAYPOINTS[i];
          const to = WAYPOINTS[i + 1];
          const segAngle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90;
          const duration = SEGMENT_DURATIONS[i];
          tl.to(
            pos,
            {
              x: to.x,
              y: to.y,
              duration,
              ease: 'sine.inOut',
              onStart: () => {
                angle = segAngle;
              },
              onUpdate: render,
            },
            cursor,
          );
          cursor += duration;
        }
        const walkEnd = cursor;

        tl.call(stopGait, null, walkEnd)
          .to(webGroup, { opacity: 0, duration: 0.9, ease: 'power1.in' }, walkEnd - 2.2)
          .to(
            [spiderGroup, strand],
            {
              opacity: 0,
              duration: 0.5,
              ease: 'power1.in',
              onComplete: () => {
                svg.style.display = 'none';
              },
            },
            walkEnd,
          )
          .add(showIntroText, walkEnd + 0.4)
          .add(hideIntroText, walkEnd + 0.4 + 0.75 + 4.8)
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
            walkEnd + 0.4 + 0.75 + 4.8 + 0.3,
          );

        function showIntroText() {
          gsap.fromTo(
            introTextRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          );
        }
        function hideIntroText() {
          gsap.to(introTextRef.current, { opacity: 0, y: -18, duration: 1.1, ease: 'power2.in' });
        }
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
        window.sessionStorage.setItem(SESSION_KEY, '1');
        window.dispatchEvent(new CustomEvent('hw-open-offer', { detail: { source: 'halloween_intro' } }));
      }

      return () => {
        clearTimeout(spiderTimer);
        clearTimeout(pumpkinTimer);
      };
    },
    { dependencies: [active] },
  );

  if (!active) return null;

  return (
    <>
      <div ref={spiderOverlayRef} aria-hidden="true" className="hwi-overlay hwi-overlay-blur" />
      <div ref={pumpkinOverlayRef} aria-hidden="true" className="hwi-overlay hwi-overlay-soft" />

      <SpiderScene
        svgRef={spiderSvgRef}
        webRef={webGroupRef}
        strandRef={strandRef}
        spiderGroupRef={spiderGroupRef}
        legsRef={legsGroupRef}
      />

      <div
        ref={introTextRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center px-6 opacity-0"
      >
        <div className="max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-[#ff9d2e] sm:text-base">
            Happy Halloween From Massive Designs
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            Treat Your Brand to Something <span className="text-[#ff9d2e]">Massive</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-xl">
            This Halloween, get professional branding and web design built to make your business impossible to
            ignore.
          </p>
        </div>
      </div>

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
              <radialGradient id="hwiPumpkinBody" cx="38%" cy="26%" r="82%">
                <stop offset="0%" stopColor="#ffd271" />
                <stop offset="35%" stopColor="#ff9d2e" />
                <stop offset="68%" stopColor="#e8590c" />
                <stop offset="100%" stopColor="#8f2d05" />
              </radialGradient>
              <linearGradient id="hwiStem" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8fae4a" />
                <stop offset="100%" stopColor="#425f20" />
              </linearGradient>
              <radialGradient id="hwiGlow" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#fffdf0" />
                <stop offset="40%" stopColor="#ffd666" />
                <stop offset="100%" stopColor="#c9560d" />
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

    </>
  );
}

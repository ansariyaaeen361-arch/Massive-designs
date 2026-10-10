import { useEffect, useState } from 'react';
import { isHalloweenSeason } from '../../lib/season';

const WING_LEFT =
  'M47 19 C36 9 20 7 4 15 C16 17 26 21 30 25 C18 25 8 31 2 39 C16 35 28 31 36 27 C40 29 44 29 47 27 Z';
const WING_RIGHT =
  'M53 19 C64 9 80 7 96 15 C84 17 74 21 70 25 C82 25 92 31 98 39 C84 35 72 31 64 27 C60 29 56 29 53 27 Z';

function Bat({ className, delay, flapDelay }) {
  return (
    <div className={`hw-bat ${className}`} style={{ animationDelay: delay }}>
      <svg className="hw-bat-wings" style={{ animationDelay: flapDelay }} viewBox="0 0 100 42" aria-hidden="true">
        <path d={WING_LEFT} fill="currentColor" />
        <path d={WING_RIGHT} fill="currentColor" />
        <polygon points="46,11 49,3 51,12" fill="currentColor" />
        <polygon points="54,11 51,3 49,12" fill="currentColor" />
        <ellipse cx="50" cy="19" rx="5.5" ry="5" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function HalloweenFX() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isHalloweenSeason());
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="hw-root pointer-events-none fixed inset-x-0 top-0 z-[1] overflow-hidden">
      <svg className="hw-web" viewBox="0 0 160 160" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M160 0 L0 160" />
          <path d="M160 20 L20 160" />
          <path d="M160 45 L45 160" />
          <path d="M160 72 L72 160" />
          <path d="M160 100 L100 160" />
          <path d="M160 128 L128 160" />
          <path d="M 142 0 Q 60 60 0 142" />
          <path d="M 118 0 Q 50 50 0 118" />
          <path d="M 94 0 Q 40 40 0 94" />
          <path d="M 68 0 Q 28 28 0 68" />
          <path d="M 40 0 Q 16 16 0 40" />
        </g>
      </svg>

      <Bat className="hw-bat-1" delay="-4s" flapDelay="-0.2s" />
      <Bat className="hw-bat-2" delay="-14s" flapDelay="-0.5s" />
      <Bat className="hw-bat-3" delay="-24s" flapDelay="-0.1s" />
    </div>
  );
}

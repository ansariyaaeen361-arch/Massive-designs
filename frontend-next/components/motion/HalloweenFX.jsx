import { useEffect, useState } from 'react';
import { isHalloweenSeason } from '../../lib/season';

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
    </div>
  );
}

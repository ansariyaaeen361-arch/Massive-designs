import { useEffect, useState } from 'react';
import { isHalloweenSeason } from '../../lib/season';

// A tiny spider that continuously patrols around the header logo while it's
// Halloween. Pure CSS (motion-path + a leg wiggle loop) so it costs nothing
// to keep running for the whole visit.
export default function HeaderSpider() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isHalloweenSeason());
  }, []);

  if (!active) return null;

  return (
    <div className="hls-wrap" aria-hidden="true">
      <div className="hls-spider">
        <svg viewBox="0 0 40 34" width="20" height="17">
          <defs>
            <radialGradient id="hlsBody" cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#4a3e35" />
              <stop offset="55%" stopColor="#1c1410" />
              <stop offset="100%" stopColor="#0a0705" />
            </radialGradient>
          </defs>
          <g className="hls-legs" fill="none" stroke="#120c08" strokeWidth="1.7" strokeLinecap="round">
            <path className="hls-leg hls-leg-a" d="M15,14 Q7,8 2,10" />
            <path className="hls-leg hls-leg-b" d="M15,17 Q6,16 1,20" />
            <path className="hls-leg hls-leg-a" d="M15,21 Q6,23 2,29" />
            <path className="hls-leg hls-leg-b" d="M25,14 Q33,8 38,10" />
            <path className="hls-leg hls-leg-a" d="M25,17 Q34,16 39,20" />
            <path className="hls-leg hls-leg-b" d="M25,21 Q34,23 38,29" />
          </g>
          <ellipse cx="20" cy="22" rx="6.5" ry="8" fill="url(#hlsBody)" />
          <path
            d="M20,18 L17.5,22 L20,23 L22.5,22 Z M20,23 L17.5,27 L20,29 L22.5,27 Z"
            fill="#c21d1d"
            opacity="0.9"
          />
          <ellipse cx="20" cy="13" rx="4.2" ry="4.6" fill="url(#hlsBody)" />
          <circle cx="18.5" cy="12" r="0.8" fill="#fff" />
          <circle cx="21.5" cy="12" r="0.8" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

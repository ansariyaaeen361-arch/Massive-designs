import { useState } from 'react';
import Lightbox from '../motion/Lightbox';

const logos = [
  '/img/home/client-logo-1.webp',
  '/img/home/client-logo-2.webp',
  '/img/home/client-logo-3.webp',
  '/img/home/client-logo-4.webp',
  '/img/home/client-logo-5.webp',
  '/img/home/client-logo-6.webp',
  '/img/home/client-logo-7.webp',
];

export default function ClientLogos() {
  const track = [...logos, ...logos];
  const [activeLogo, setActiveLogo] = useState(null);

  return (
    <section className="border-t border-white/10 py-16 lg:py-20">
      <div className="overflow-hidden">
        <div className="marquee-mask">
          <div className="flex w-max animate-marquee items-center gap-6">
            {track.map((logo, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View client logo ${(i % logos.length) + 1} in full size`}
                aria-hidden={i >= logos.length}
                tabIndex={i >= logos.length ? -1 : 0}
                onClick={() => setActiveLogo(logo)}
                className="flex h-28 w-28 shrink-0 appearance-none items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-white/10 sm:h-32 sm:w-32"
              >
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full rounded-xl object-cover opacity-80 grayscale transition-opacity duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeLogo && (
        <Lightbox onClose={() => setActiveLogo(null)}>
          <img
            src={activeLogo}
            alt=""
            className="max-h-[85vh] w-auto rounded-2xl bg-white/5 object-contain p-8"
          />
        </Lightbox>
      )}
    </section>
  );
}

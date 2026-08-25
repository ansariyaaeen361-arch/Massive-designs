import { useRef } from 'react';
import Reveal from '../motion/Reveal';
import { gsap } from '../../lib/gsap';

// Same hover-scroll-box / hover-scroll-img effect as the Projects page's Website tab:
// the full page screenshot pans upward on hover (8s linear) and eases back down on hover-out.
function HoverScrollTile({ src, alt, href }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const isExternal = href?.startsWith('http');

  const handleEnter = () => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const overflow = img.offsetHeight - wrap.offsetHeight;
    if (overflow > 0) {
      gsap.to(img, { y: -overflow, duration: 8, ease: 'none', overwrite: 'auto' });
    }
  };

  const handleLeave = () => {
    gsap.to(imgRef.current, { y: 0, duration: 8, ease: 'none', overwrite: 'auto' });
  };

  const box = (
    <div
      ref={wrapRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-[340px] lg:h-[400px]"
    >
      <img ref={imgRef} src={src} alt={alt} loading="lazy" className="absolute left-0 top-0 w-full" />
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {box}
    </a>
  ) : (
    <a href={href || '/contact/'} className="block">
      {box}
    </a>
  );
}

export default function PortfolioHoverGrid({ heading, description, items }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">{heading}</h2>
          {description && <p className="mt-5 text-sm leading-relaxed text-white/50">{description}</p>}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <HoverScrollTile key={item.alt} src={item.src} alt={item.alt} href={item.href} />
          ))}
        </div>
      </div>
    </section>
  );
}

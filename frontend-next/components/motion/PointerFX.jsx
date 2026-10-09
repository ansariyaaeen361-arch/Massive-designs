import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

const MAGNETIC = 'a.rounded-full, button.rounded-full, [data-magnetic]';
const INTERACTIVE = 'a, button, [role="button"], summary, select, input[type="checkbox"], input[type="radio"], input[type="submit"], label';
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]';
const GLOW = '[class*="bg-white/5"], .glass-tile';

export default function PointerFX() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    let magnet = null;
    let last = null;
    let frame = 0;

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      magnet = null;
    };

    const process = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      gsap.set(dot, { x: e.clientX, y: e.clientY });
      ringX(e.clientX);
      ringY(e.clientY);

      ring.classList.toggle('is-hover', !!target?.closest(INTERACTIVE));
      const isText = !!target?.closest(TEXT_FIELD);
      ring.classList.toggle('is-text', isText);
      dot.classList.toggle('is-text', isText);

      const glowCard = target?.closest(GLOW);
      if (glowCard) {
        const r = glowCard.getBoundingClientRect();
        glowCard.style.setProperty('--gx', `${e.clientX - r.left}px`);
        glowCard.style.setProperty('--gy', `${e.clientY - r.top}px`);
      }

      if (reduceMotion) return;
      const m = target?.closest(MAGNETIC) ?? null;
      if (m !== magnet) {
        releaseMagnet();
        magnet = m;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
        gsap.to(magnet, { x: dx, y: dy, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
      }
    };

    const onMove = (e) => {
      ring.style.opacity = '';
      dot.style.opacity = '';
      last = e;
      if (!frame) frame = requestAnimationFrame(process);
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
      releaseMagnet();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      releaseMagnet();
      html.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="fx-ring" />
      <div ref={dotRef} aria-hidden="true" className="fx-dot" />
    </>
  );
}

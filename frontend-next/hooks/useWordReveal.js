import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const HEADINGS = 'main :is(h1, h2, h3)';
const BIG = /text-(3xl|4xl|5xl|6xl|7xl)/;

function splitWords(node) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === 3) {
      if (!child.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const mask = document.createElement('span');
        mask.className = 'w-mask';
        const inner = document.createElement('span');
        inner.className = 'w-inner';
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
      });
      child.replaceWith(frag);
    } else if (child.nodeType === 1 && !child.classList.contains('w-mask')) {
      splitWords(child);
    }
  });
}

export default function useWordReveal(enabled, dep) {
  const runs = useRef(0);

  useIsoLayoutEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const startDelay = runs.current === 0 ? 0.15 : 0.8;
    runs.current += 1;

    const ctx = gsap.context(() => {
      document.querySelectorAll(HEADINGS).forEach((el) => {
        if (el.classList.contains('hero-title') || el.classList.contains('sr-only')) return;
        if (!BIG.test(el.className)) return;

        if (!el.dataset.split) {
          splitWords(el);
          el.dataset.split = '1';
        }
        const words = el.querySelectorAll('.w-inner');
        if (!words.length) return;

        const inView = el.getBoundingClientRect().top < window.innerHeight * 0.9;
        gsap.fromTo(
          words,
          { yPercent: 115, rotate: 5 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.95,
            ease: 'power4.out',
            stagger: 0.07,
            delay: inView ? startDelay : 0,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [enabled, dep]);
}

import { useRef, useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import LocalBusinessSchema from './LocalBusinessSchema';
import GridSpotlight from '../motion/GridSpotlight';
import CustomCursor from '../motion/CustomCursor';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function Layout() {
  useSmoothScroll();
  const location = useLocation();
  const outlet = useOutlet();

  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const isFirstRender = useRef(true);

  const [displayedOutlet, setDisplayedOutlet] = useState(outlet);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        gsap.set(curtainRef.current, { yPercent: 100 });
        return;
      }

      const swap = () => {
        setDisplayedOutlet(outlet);
        window.scrollTo(0, 0);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        swap();
        return;
      }

      const curtain = curtainRef.current;
      gsap
        .timeline()
        .set(curtain, { display: 'block' })
        .fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' })
        .add(swap)
        .to(curtain, { yPercent: -100, duration: 0.5, ease: 'power3.inOut', delay: 0.05 })
        .set(curtain, { display: 'none', yPercent: 100 });
    },
    { scope: rootRef, dependencies: [location.pathname] },
  );

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col overflow-x-hidden">
      <LocalBusinessSchema />
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] hidden bg-black"
      />
      <GridSpotlight />
      <CustomCursor />
      <Header />
      <main className="flex-1">{displayedOutlet}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}

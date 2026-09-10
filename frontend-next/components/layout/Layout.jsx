import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import GridSpotlight from '../motion/GridSpotlight';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function Layout({ children }) {
  useSmoothScroll();
  const router = useRouter();
  const isDashboard = router.pathname === '/dashboard';

  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const isFirstRender = useRef(true);

  const [displayedChildren, setDisplayedChildren] = useState(children);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        gsap.set(curtainRef.current, { yPercent: 100 });
        return;
      }

      const swap = () => {
        setDisplayedChildren(children);
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
    { scope: rootRef, dependencies: [router.asPath] },
  );

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col overflow-x-hidden">
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] hidden bg-black"
      />
      {!isDashboard && <GridSpotlight />}
      {!isDashboard && <Header />}
      <main className="flex-1">{displayedChildren}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <BackToTop />}
    </div>
  );
}

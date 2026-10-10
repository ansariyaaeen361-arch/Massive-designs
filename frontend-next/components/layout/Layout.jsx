import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import AuroraBackground from '../motion/AuroraBackground';
import PointerFX from '../motion/PointerFX';
import HalloweenFX from '../motion/HalloweenFX';
import HalloweenTicker from './HalloweenTicker';
import HalloweenOfferModal from './HalloweenOfferModal';
import useWordReveal from '../../hooks/useWordReveal';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export default function Layout({ children }) {
  const router = useRouter();
  const isDashboard = router.pathname === '/dashboard';
  // Lenis hijacks wheel events to drive its own smooth-scroll, which breaks
  // native scrolling inside the dashboard's data tables — skip it there.
  useSmoothScroll(!isDashboard);

  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const curtain2Ref = useRef(null);
  const isFirstRender = useRef(true);

  const [displayedChildren, setDisplayedChildren] = useState(children);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        gsap.set([curtainRef.current, curtain2Ref.current], { yPercent: 100 });
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

      const lime = curtainRef.current;
      const ink = curtain2Ref.current;
      gsap
        .timeline()
        .set([lime, ink], { display: 'block' })
        .fromTo(lime, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' })
        .fromTo(ink, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.38')
        .add(swap)
        .to(ink, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '+=0.05')
        .to(lime, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '-=0.42')
        .set([lime, ink], { display: 'none', yPercent: 100 });
    },
    { scope: rootRef, dependencies: [router.asPath] },
  );

  useWordReveal(!isDashboard, displayedChildren);

  return (
    <div ref={rootRef} className={`flex min-h-screen flex-col overflow-x-hidden ${isDashboard ? '' : 'bold-theme'}`}>
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] hidden"
        style={{ background: '#b5f652' }}
      />
      <div
        ref={curtain2Ref}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[201] hidden"
        style={{ background: '#0b0c10' }}
      />
      {!isDashboard && <PointerFX />}
      {!isDashboard && <AuroraBackground />}
      {!isDashboard && <HalloweenFX />}
      {!isDashboard && <Header />}
      <main className="flex-1">{displayedChildren}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <BackToTop />}
      {!isDashboard && <HalloweenTicker />}
      {!isDashboard && <HalloweenOfferModal />}
      {!isDashboard && (
        // Invisible to real visitors (off-screen, unreachable by keyboard/
        // screen reader) so only something parsing the raw HTML would ever
        // request this URL — any hit is logged as a bot.
        <a
          href={`/api/track/trap?from=${encodeURIComponent(router.asPath)}`}
          tabIndex={-1}
          aria-hidden="true"
          rel="nofollow noindex"
          className="absolute left-[-9999px] top-[-9999px] h-px w-px overflow-hidden"
        >
          Site Map
        </a>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';

const IntroLoader = dynamic(() => import('../components/loader/IntroLoader'), { ssr: false });
const INTRO_LOADER_SESSION_KEY = 'md_intro_loader_shown';

export default function App({ Component, pageProps }) {
  // 'shield' is the only state that may ever be server-rendered/statically
  // exported, so it must stay the initial value here to avoid a hydration
  // mismatch. It also doubles as the flash-guard: a plain black overlay
  // covers the already-painted static HTML until we know, client-side,
  // whether the intro has played this session.
  const [phase, setPhase] = useState('shield');

  useEffect(() => {
    const alreadyShown = window.sessionStorage.getItem(INTRO_LOADER_SESSION_KEY);
    setPhase(alreadyShown ? 'done' : 'loader');
  }, []);

  const handleIntroComplete = useCallback(() => setPhase('done'), []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {phase === 'shield' && <div className="fixed inset-0 z-[999] bg-black" />}
      {phase === 'loader' && <IntroLoader onComplete={handleIntroComplete} />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

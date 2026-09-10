import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function PopupStats() {
  const [status, setStatus] = useState('loading');
  const [count, setCount] = useState(null);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('key');
    if (!key) {
      setStatus('error');
      return;
    }

    fetch(`/api/popup-click/count?key=${encodeURIComponent(key)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error();
        setCount(data.count);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <>
      <Head>
        <title>Popup Stats</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="mx-auto flex min-h-[70vh] max-w-[600px] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Welcome Popup</p>
        {status === 'loading' && <p className="mt-4 text-white/50">Loading...</p>}
        {status === 'error' && <p className="mt-4 text-red-400">Invalid or missing key.</p>}
        {status === 'ready' && <p className="mt-4 text-6xl text-white">{count}</p>}
        {status === 'ready' && <p className="mt-2 text-sm text-white/50">Get My Free Design clicks</p>}
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import Head from 'next/head';

function useDashboardKey() {
  const [key, setKey] = useState(null);
  useEffect(() => {
    setKey(new URLSearchParams(window.location.search).get('key'));
  }, []);
  return key;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data;
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-sm font-medium uppercase tracking-wide text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function RankTable({ rows, labelKey, extraKey }) {
  if (!rows.length) return <p className="text-sm text-white/40">No data yet.</p>;
  return (
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-white/5">
            <td className="py-2 pr-4 text-white/80">
              {row[labelKey] || '(unknown)'}
              {extraKey && row[extraKey] ? <span className="text-white/40"> · {row[extraKey]}</span> : null}
            </td>
            <td className="py-2 text-right font-medium text-primary">{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Dashboard() {
  const key = useDashboardKey();
  const [status, setStatus] = useState('loading');
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const LIMIT = 50;

  useEffect(() => {
    if (key === null) return;
    if (!key) {
      setStatus('error');
      return;
    }

    Promise.all([
      fetchJson(`/api/track/summary?key=${encodeURIComponent(key)}`),
      fetchJson(`/api/track/events?key=${encodeURIComponent(key)}&limit=${LIMIT}&skip=0`),
    ])
      .then(([summaryData, eventsData]) => {
        setSummary(summaryData);
        setEvents(eventsData.events);
        setTotal(eventsData.total);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [key]);

  const loadMore = () => {
    const nextSkip = skip + LIMIT;
    fetchJson(`/api/track/events?key=${encodeURIComponent(key)}&limit=${LIMIT}&skip=${nextSkip}`).then((data) => {
      setEvents((prev) => [...prev, ...data.events]);
      setSkip(nextSkip);
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Analytics</p>
        <h1 className="mt-3 text-3xl text-white sm:text-4xl">Click Dashboard</h1>

        {status === 'loading' && <p className="mt-8 text-white/50">Loading...</p>}
        {status === 'error' && <p className="mt-8 text-red-400">Invalid or missing key.</p>}

        {status === 'ready' && summary && (
          <>
            <p className="mt-4 text-sm text-white/50">Total events logged: {summary.total}</p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="Buttons — most clicked">
                <RankTable rows={summary.byEvent} labelKey="event" extraKey="source" />
              </Card>
              <Card title="Pages — most engagement">
                <RankTable rows={summary.byPage} labelKey="page" />
              </Card>
            </div>

            <Card title={`Recent events (${events.length} of ${total})`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-xs">
                  <thead>
                    <tr className="text-white/40">
                      <th className="pb-2 pr-4">Date/Time</th>
                      <th className="pb-2 pr-4">Event</th>
                      <th className="pb-2 pr-4">Source</th>
                      <th className="pb-2 pr-4">Page</th>
                      <th className="pb-2 pr-4">IP</th>
                      <th className="pb-2 pr-4">Location</th>
                      <th className="pb-2 pr-4">ISP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev._id} className="border-t border-white/5 text-white/70">
                        <td className="py-2 pr-4 whitespace-nowrap">{new Date(ev.createdAt).toLocaleString()}</td>
                        <td className="py-2 pr-4">{ev.event}</td>
                        <td className="py-2 pr-4">{ev.source || '—'}</td>
                        <td className="py-2 pr-4">{ev.page || '—'}</td>
                        <td className="py-2 pr-4">{ev.ip || '—'}</td>
                        <td className="py-2 pr-4">
                          {[ev.city, ev.region, ev.country].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="py-2 pr-4">{ev.isp || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {events.length < total && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="mt-4 rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-wide text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                  Load more
                </button>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}

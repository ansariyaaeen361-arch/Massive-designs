import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All time', ms: null },
];

const LIMIT = 30;

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

const LABELS = {
  'welcome_popup_shown|welcome_popup': 'New Visitor (session)',
  'welcome_popup_closed|welcome_popup': 'Popup Closed',
  'call_click|welcome_popup': 'Popup → Call Click',
  'call_click|service_hero': 'Service Page → Call Click',
  'call_click|footer': 'Footer → Call Click',
  'call_click|mobile_menu': 'Mobile Menu → Call Click',
  'email_click|service_cta': 'Service Page → Email Click',
  'email_click|mobile_menu': 'Mobile Menu → Email Click',
  'cta_click|service_hero': 'Service Hero → CTA Click',
  'cta_click|service_cta': 'Service Page → CTA Click',
  'cta_click|pricing_card': 'Pricing Card → Order Click',
  'cta_click|services_page': 'Services Page → CTA Click',
  'cta_click|audit_success': 'Audit Result → Book Call Click',
  'generate_lead|null': 'Form Submitted (New Lead)',
  'audit_started|null': 'Website Audit Started',
  'audit_completed|null': 'Website Audit Completed',
  'newsletter_signup|footer': 'Newsletter Signup',
};

function friendlyLabel(event, source) {
  return LABELS[`${event}|${source ?? 'null'}`] || event.replace(/_/g, ' ');
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-2xl text-white">{value}</p>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-white/15 bg-[#0b0c10] px-3 py-2 text-xs text-white/80 outline-none transition-colors focus:border-primary"
      style={{ colorScheme: 'dark' }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function RankList({ rows, renderLabel }) {
  if (!rows.length) return <p className="px-5 py-6 text-sm text-white/40">No data in this range.</p>;
  const max = rows[0]?.count || 1;
  return (
    <div className="max-h-[360px] overflow-y-auto">
      {rows.map((row, i) => (
        <div key={i} className="border-b border-white/5 px-5 py-3 last:border-0">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-white/80">{renderLabel(row)}</span>
            <span className="shrink-0 font-medium text-primary">{row.count}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-white/30">last: {timeAgo(row.last)}</p>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  useEffect(() => {
    const widget = document.getElementById('mf-widget-host');
    if (!widget) return undefined;
    widget.style.display = 'none';
    return () => {
      widget.style.display = '';
    };
  }, []);

  const key = useDashboardKey();
  const [status, setStatus] = useState('loading');
  const [rangeIdx, setRangeIdx] = useState(3);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState({ event: '', page: '', source: '' });
  const [visitors, setVisitors] = useState([]);

  const since = useMemo(() => {
    const ms = RANGES[rangeIdx].ms;
    return ms ? Date.now() - ms : null;
  }, [rangeIdx]);

  const buildEventsUrl = useCallback(
    (skipVal) => {
      const params = new URLSearchParams({ key, limit: LIMIT, skip: skipVal });
      if (since) params.set('since', since);
      if (filters.event) params.set('event', filters.event);
      if (filters.page) params.set('page', filters.page);
      if (filters.source) params.set('source', filters.source);
      return `/api/track/events?${params.toString()}`;
    },
    [key, since, filters],
  );

  const load = useCallback(() => {
    if (!key) return;
    setStatus('loading');
    const summaryParams = new URLSearchParams({ key });
    if (since) summaryParams.set('since', since);
    const visitorParams = new URLSearchParams({ key, event: 'welcome_popup_shown', limit: 10 });
    if (since) visitorParams.set('since', since);

    Promise.all([
      fetchJson(`/api/track/summary?${summaryParams.toString()}`),
      fetchJson(buildEventsUrl(0)),
      fetchJson(`/api/track/events?${visitorParams.toString()}`),
    ])
      .then(([summaryData, eventsData, visitorData]) => {
        setSummary(summaryData);
        setEvents(eventsData.events);
        setTotal(eventsData.total);
        setSkip(0);
        setVisitors(visitorData.events);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [key, since, buildEventsUrl]);

  useEffect(() => {
    if (key === null) return;
    if (!key) {
      setStatus('error');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rangeIdx, filters]);

  const loadMore = () => {
    const nextSkip = skip + LIMIT;
    fetchJson(buildEventsUrl(nextSkip)).then((data) => {
      setEvents((prev) => [...prev, ...data.events]);
      setSkip(nextSkip);
    });
  };

  const buttonRows = summary ? summary.byEvent.filter((r) => r.event !== 'welcome_popup_shown') : [];
  const uniquePages = summary ? new Set(summary.byPage.map((r) => r.page)).size : 0;
  const uniqueButtons = new Set(buttonRows.map((r) => r.event)).size;
  const newVisitors = summary
    ? summary.byEvent.find((r) => r.event === 'welcome_popup_shown')?.count ?? 0
    : 0;

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Analytics</p>
            <h1 className="mt-2 text-2xl text-white sm:text-3xl">Click Dashboard</h1>
          </div>
          {status === 'ready' && (
            <button
              type="button"
              onClick={load}
              className="rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-wide text-white/70 transition-colors hover:border-primary hover:text-primary"
            >
              Refresh
            </button>
          )}
        </div>

        {status === 'loading' && !summary && <p className="mt-8 text-white/50">Loading...</p>}
        {status === 'error' && <p className="mt-8 text-red-400">Invalid or missing key.</p>}

        {summary && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {RANGES.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRangeIdx(i)}
                  className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wide transition-colors ${
                    i === rangeIdx ? 'bg-primary text-black' : 'border border-white/15 text-white/60 hover:border-primary hover:text-primary'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <StatTile label="New Visitors" value={newVisitors} />
              <StatTile label="Total Events" value={summary.total} />
              <StatTile label="Unique Buttons" value={uniqueButtons} />
              <StatTile label="Unique Pages" value={uniquePages} />
              <StatTile label="Showing" value={`${events.length} / ${total}`} />
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                New Visitors — {newVisitors} (no click, just landed on the site)
              </h2>
              {!visitors.length && <p className="px-5 py-6 text-sm text-white/40">No new visitors in this range.</p>}
              {!!visitors.length && (
                <div className="max-h-[240px] overflow-auto">
                  <table className="w-full min-w-[500px] border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-[#0f1013]">
                      <tr className="text-white/40">
                        <th className="px-5 py-2 font-normal">Date/Time</th>
                        <th className="px-3 py-2 font-normal">Landed on</th>
                        <th className="px-3 py-2 font-normal">IP</th>
                        <th className="px-3 py-2 font-normal">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {visitors.map((v) => (
                        <tr key={v._id} className="text-white/70 hover:bg-white/[0.03]">
                          <td className="whitespace-nowrap px-5 py-2.5">{new Date(v.createdAt).toLocaleString()}</td>
                          <td className="px-3 py-2.5">{v.page || '—'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">{v.ip || '—'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            {[v.city, v.region, v.country].filter(Boolean).join(', ') || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Buttons — most clicked
                </h2>
                <RankList rows={buttonRows} renderLabel={(row) => friendlyLabel(row.event, row.source)} />
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Pages — most engagement
                </h2>
                <RankList rows={summary.byPage} renderLabel={(row) => row.page || '(unknown)'} />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <h2 className="text-sm font-medium uppercase tracking-wide text-primary">Event log</h2>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filters.event}
                    onChange={(v) => setFilters((f) => ({ ...f, event: v }))}
                    options={summary.filters.events}
                    placeholder="All buttons"
                  />
                  <Select
                    value={filters.page}
                    onChange={(v) => setFilters((f) => ({ ...f, page: v }))}
                    options={summary.filters.pages}
                    placeholder="All pages"
                  />
                  <Select
                    value={filters.source}
                    onChange={(v) => setFilters((f) => ({ ...f, source: v }))}
                    options={summary.filters.sources}
                    placeholder="All sources"
                  />
                  {(filters.event || filters.page || filters.source) && (
                    <button
                      type="button"
                      onClick={() => setFilters({ event: '', page: '', source: '' })}
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/60 transition-colors hover:border-primary hover:text-primary"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[420px] overflow-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-[#0f1013]">
                    <tr className="text-white/40">
                      <th className="px-5 py-2 font-normal">Date/Time</th>
                      <th className="px-3 py-2 font-normal">Event</th>
                      <th className="px-3 py-2 font-normal">Source</th>
                      <th className="px-3 py-2 font-normal">Page</th>
                      <th className="px-3 py-2 font-normal">IP</th>
                      <th className="px-3 py-2 font-normal">Location</th>
                      <th className="px-3 py-2 font-normal">ISP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev) => (
                      <tr key={ev._id} className="text-white/70 hover:bg-white/[0.03]">
                        <td className="whitespace-nowrap px-5 py-2.5">{new Date(ev.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2.5">{friendlyLabel(ev.event, ev.source)}</td>
                        <td className="px-3 py-2.5">{ev.source || '—'}</td>
                        <td className="px-3 py-2.5">{ev.page || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">{ev.ip || '—'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          {[ev.city, ev.region, ev.country].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5">{ev.isp || '—'}</td>
                      </tr>
                    ))}
                    {!events.length && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-white/40">
                          No events match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {events.length < total && (
                <div className="border-t border-white/10 px-5 py-3">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-wide text-white/70 transition-colors hover:border-primary hover:text-primary"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

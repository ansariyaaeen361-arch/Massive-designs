import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

const LIMIT = 30;
const NOT_A_CLICK = new Set(['page_view', 'page_view_duration', 'welcome_popup_shown']);

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
  'welcome_popup_closed|welcome_popup': 'Popup Closed',
  'call_click|welcome_popup': 'Popup Call Button',
  'call_click|service_hero': 'Service Page Call Button',
  'call_click|footer': 'Footer Call Button',
  'call_click|mobile_menu': 'Mobile Menu Call Button',
  'email_click|service_cta': 'Service Page Email Button',
  'email_click|mobile_menu': 'Mobile Menu Email Button',
  'cta_click|service_hero': 'Service Hero Button',
  'cta_click|service_cta': 'Service Page Button',
  'cta_click|pricing_card': 'Pricing Card Button',
  'cta_click|services_page': 'Services Page Button',
  'cta_click|audit_success': 'Audit Result Button',
  'generate_lead|null': 'Form Submitted',
  'audit_started|null': 'Website Audit Started',
  'audit_completed|null': 'Website Audit Finished',
  'newsletter_signup|footer': 'Newsletter Signup',
};

function friendlyLabel(event, source) {
  return LABELS[`${event}|${source ?? 'null'}`] || event.replace(/_/g, ' ');
}

const REASON_LABELS = {
  webdriver: 'Automated Browser (script-controlled)',
  speed: 'Fast Scraper (too many pages too fast)',
  honeypot: 'Hidden-Link Scraper',
  'popup-bypass': 'Script (bypassed the popup overlay)',
};

// The backend already names User-Agent-matched bots at the moment it flags
// them (botReason holds the real name, e.g. "Googlebot" or "AhrefsBot") — no
// separate guessing here. Only webdriver/speed/honeypot need a label lookup,
// since those are flagged for a reason rather than a self-declared name.
function botName(botReason) {
  if (!botReason) return 'Unidentified Bot';
  return REASON_LABELS[botReason] || botReason;
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

function formatDuration(ms) {
  if (!ms || ms < 1000) return '0s';
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
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

function Section({ title, children }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
        {title}
      </h2>
      {children}
    </div>
  );
}

function RankList({ rows, renderLabel }) {
  if (!rows.length) return <p className="px-5 py-6 text-sm text-white/40">No data yet.</p>;
  const max = rows[0]?.count || 1;
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {rows.map((row, i) => (
        <div key={i} className="border-b border-white/5 px-5 py-3 last:border-0">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-white/80">{renderLabel(row)}</span>
            <span className="shrink-0 font-medium text-primary">{row.count}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          {row.last && <p className="mt-1 text-[11px] text-white/30">Last: {timeAgo(row.last)}</p>}
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
  const [newVisitorRows, setNewVisitorRows] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bots, setBots] = useState({ total: 0, uniqueIpCount: 0, events: [] });

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
    const rangeParams = new URLSearchParams({ key });
    if (since) rangeParams.set('since', since);
    const newVisitorParams = new URLSearchParams({ key, event: 'page_view', isReturning: 'false', limit: 10 });
    if (since) newVisitorParams.set('since', since);
    const sessionParams = new URLSearchParams({ key, limit: 15 });
    if (since) sessionParams.set('since', since);
    const botParams = new URLSearchParams({ key, limit: 30 });
    if (since) botParams.set('since', since);

    Promise.all([
      fetchJson(`/api/track/summary?${rangeParams.toString()}`),
      fetchJson(buildEventsUrl(0)),
      fetchJson(`/api/track/events?${newVisitorParams.toString()}`),
      fetchJson(`/api/track/sessions?${sessionParams.toString()}`),
      fetchJson(`/api/track/bots?${botParams.toString()}`),
    ])
      .then(([summaryData, eventsData, newVisitorData, sessionData, botData]) => {
        setSummary(summaryData);
        setEvents(eventsData.events);
        setTotal(eventsData.total);
        setSkip(0);
        setNewVisitorRows(newVisitorData.events);
        setSessions(sessionData.sessions);
        setBots(botData);
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

  const buttonRows = summary ? summary.byEvent.filter((r) => !NOT_A_CLICK.has(r.event)) : [];
  const totalClicks = buttonRows.reduce((sum, r) => sum + r.count, 0);
  const pageRows = summary ? summary.byPage.filter((r) => r.page) : [];

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
              <StatTile label="New Visitors" value={summary.newVisitors} />
              <StatTile label="Returning Visitors" value={summary.returningVisitors} />
              <StatTile label="Total Button Clicks" value={totalClicks} />
              <StatTile label="Pages Viewed" value={pageRows.length} />
              <StatTile label="Avg. Time on Page" value={formatDuration(summary.avgDurationMs)} />
            </div>

            <Section title="New Visitors (people opening the site for the first time)">
              {!newVisitorRows.length && <p className="px-5 py-6 text-sm text-white/40">No new visitors yet in this range.</p>}
              {!!newVisitorRows.length && (
                <div className="max-h-[260px] overflow-auto">
                  <table className="w-full min-w-[750px] border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-[#0f1013]">
                      <tr className="text-white/40">
                        <th className="px-5 py-2 font-normal">Time</th>
                        <th className="px-3 py-2 font-normal">Landed On</th>
                        <th className="px-3 py-2 font-normal">Came From</th>
                        <th className="px-3 py-2 font-normal">Device</th>
                        <th className="px-3 py-2 font-normal">IP</th>
                        <th className="px-3 py-2 font-normal">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {newVisitorRows.map((v) => (
                        <tr key={v._id} className="text-white/70 hover:bg-white/[0.03]">
                          <td className="whitespace-nowrap px-5 py-2.5">{new Date(v.createdAt).toLocaleString()}</td>
                          <td className="px-3 py-2.5">{v.page || 'N/A'}</td>
                          <td className="px-3 py-2.5">{v.referrer || 'N/A'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            {v.device || 'N/A'}{v.browser ? `, ${v.browser}` : ''}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5">{v.ip || 'N/A'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            {[v.city, v.region, v.country].filter(Boolean).join(', ') || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Most Clicked Buttons
                </h2>
                <RankList rows={buttonRows} renderLabel={(row) => friendlyLabel(row.event, row.source)} />
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Most Visited Pages
                </h2>
                <RankList rows={pageRows} renderLabel={(row) => row.page} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Where Visitors Come From
                </h2>
                <RankList rows={summary.byReferrer} renderLabel={(row) => row.referrer || 'Direct'} />
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <h2 className="border-b border-white/10 px-5 py-3 text-sm font-medium uppercase tracking-wide text-primary">
                  Devices
                </h2>
                <RankList rows={summary.byDevice} renderLabel={(row) => row.device || 'Unknown'} />
              </div>
            </div>

            <Section title="Visitor Paths (what pages each visitor viewed, in order)">
              {!sessions.length && <p className="px-5 py-6 text-sm text-white/40">No visitor paths yet in this range.</p>}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
                {sessions.map((s) => {
                  const steps = s.steps.filter((st) => st.event !== 'page_view_duration');
                  return (
                    <div key={s._id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                        <span className={`rounded-full px-2 py-0.5 ${s.isReturning ? 'bg-white/10 text-white/60' : 'bg-primary/20 text-primary'}`}>
                          {s.isReturning ? 'Returning' : 'New'}
                        </span>
                        <span>{new Date(s.lastAt).toLocaleString()}</span>
                        <span>{s.device || 'N/A'}{s.browser ? `, ${s.browser}` : ''}</span>
                        <span>{[s.city, s.country].filter(Boolean).join(', ') || 'N/A'}</span>
                        <span>{s.ip || 'N/A'}</span>
                      </div>
                      <div className="mt-2 overflow-x-auto pb-1">
                        <div className="flex w-max items-center gap-2 whitespace-nowrap text-sm text-white/80">
                          {steps.map((st, i) => (
                            <span key={i} className="flex items-center gap-2">
                              {i > 0 && <span className="text-primary/60">&rarr;</span>}
                              {st.event === 'page_view' ? st.page : `${st.page || ''} (${friendlyLabel(st.event, st.source)})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="All Activity">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <span className="text-xs text-white/40">Filter the list below</span>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={filters.event}
                    onChange={(v) => setFilters((f) => ({ ...f, event: v }))}
                    options={summary.filters.events}
                    placeholder="All actions"
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
                <table className="w-full min-w-[950px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-[#0f1013]">
                    <tr className="text-white/40">
                      <th className="px-5 py-2 font-normal">Time</th>
                      <th className="px-3 py-2 font-normal">Action</th>
                      <th className="px-3 py-2 font-normal">Page</th>
                      <th className="px-3 py-2 font-normal">Device</th>
                      <th className="px-3 py-2 font-normal">IP</th>
                      <th className="px-3 py-2 font-normal">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev) => (
                      <tr key={ev._id} className="text-white/70 hover:bg-white/[0.03]">
                        <td className="whitespace-nowrap px-5 py-2.5">{new Date(ev.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2.5">{friendlyLabel(ev.event, ev.source)}</td>
                        <td className="px-3 py-2.5">{ev.page || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">{ev.device || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">{ev.ip || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          {[ev.city, ev.region, ev.country].filter(Boolean).join(', ') || 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {!events.length && (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-white/40">
                          No activity matches these filters.
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
            </Section>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Separate from visitor numbers above</p>
              <h2 className="mt-2 text-xl text-white">Bot Visits</h2>
              <p className="mt-1 text-xs text-white/40">
                Search engines, AI crawlers, and other automated traffic. These are never counted as visitors or clicks.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
                <StatTile label="Bot Visits" value={bots.total} />
                <StatTile label="Unique Bot IPs" value={bots.uniqueIpCount} />
              </div>

              <Section title="Bot Activity">
                {!bots.events.length && <p className="px-5 py-6 text-sm text-white/40">No bot visits recorded in this range.</p>}
                {!!bots.events.length && (
                  <div className="max-h-[360px] overflow-auto">
                    <table className="w-full min-w-[850px] border-collapse text-left text-xs">
                      <thead className="sticky top-0 bg-[#0f1013]">
                        <tr className="text-white/40">
                          <th className="px-5 py-2 font-normal">Time</th>
                          <th className="px-3 py-2 font-normal">Bot</th>
                          <th className="px-3 py-2 font-normal">Action</th>
                          <th className="px-3 py-2 font-normal">Page</th>
                          <th className="px-3 py-2 font-normal">IP</th>
                          <th className="px-3 py-2 font-normal">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bots.events.map((ev) => (
                          <tr key={ev._id} className="text-white/70 hover:bg-white/[0.03]">
                            <td className="whitespace-nowrap px-5 py-2.5">{new Date(ev.createdAt).toLocaleString()}</td>
                            <td className="px-3 py-2.5">{botName(ev.botReason)}</td>
                            <td className="px-3 py-2.5">{friendlyLabel(ev.event, ev.source)}</td>
                            <td className="px-3 py-2.5">{ev.page || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-2.5">{ev.ip || 'N/A'}</td>
                            <td className="whitespace-nowrap px-3 py-2.5">
                              {[ev.city, ev.region, ev.country].filter(Boolean).join(', ') || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>
            </div>
          </>
        )}
      </div>
    </>
  );
}

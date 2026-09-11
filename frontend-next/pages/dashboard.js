import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { HiRefresh } from 'react-icons/hi';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

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

function csvCell(value) {
  const str = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadCsv(filename, columns, rows) {
  const lines = [
    columns.map((c) => csvCell(c.header)).join(','),
    ...rows.map((row) => columns.map((c) => csvCell(c.get(row))).join(',')),
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Paginates through a /api/track/* list endpoint to collect every row
// matching the current filters, not just what's currently loaded on screen.
async function fetchAllPages(urlFor, listKey) {
  const PAGE = 200;
  let skip = 0;
  let all = [];
  for (;;) {
    const data = await fetchJson(urlFor(skip, PAGE));
    const page = data[listKey] ?? [];
    all = all.concat(page);
    if (page.length < PAGE || all.length >= (data.total ?? all.length)) break;
    skip += PAGE;
  }
  return all;
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

function stepLabel(st) {
  return st.event === 'page_view' ? st.page : `${st.page || ''} (${friendlyLabel(st.event, st.source)})`;
}

// One visitor's path (what page, then what page, then what click) as a single
// horizontally-scrollable line with arrows, instead of wrapping/stacking.
function Journey({ steps }) {
  if (!steps?.length) return <span className="text-white/30">N/A</span>;
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex w-max items-center gap-2 whitespace-nowrap text-sm text-white/80">
        {steps.map((st, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-primary/60">&rarr;</span>}
            {stepLabel(st)}
          </span>
        ))}
      </div>
    </div>
  );
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

function formatDuration(ms) {
  if (!ms || ms < 1000) return '0s';
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

function HeaderBar({ status, refreshing, onRefresh }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 lg:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Analytics</p>
        <h1 className="mt-2 text-xl text-white sm:text-2xl lg:text-3xl">Click Dashboard</h1>
      </div>
      {status === 'ready' && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white/80 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:py-3"
        >
          <HiRefresh className={refreshing ? 'animate-spin text-lg' : 'text-lg'} />
          Refresh
        </button>
      )}
    </div>
  );
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

function Section({ title, actions, children }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-primary">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

function DateRangeInputs({ range, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1.5 text-xs text-white/40">
        From
        <input
          type="date"
          value={range.from}
          onChange={(e) => onChange({ ...range, from: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-2 py-1.5 text-xs text-white/80 [color-scheme:dark]"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-white/40">
        To
        <input
          type="date"
          value={range.to}
          onChange={(e) => onChange({ ...range, to: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-2 py-1.5 text-xs text-white/80 [color-scheme:dark]"
        />
      </label>
      {(range.from || range.to) && (
        <button
          type="button"
          onClick={() => onChange({ from: '', to: '' })}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-primary hover:text-primary"
        >
          Clear dates
        </button>
      )}
    </div>
  );
}

function DownloadCsvButton({ onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/60 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
    >
      {loading ? 'Preparing CSV...' : 'Download CSV'}
    </button>
  );
}

function StatCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <h2 className="border-b border-white/10 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-primary">
        {title}
      </h2>
      {children}
    </div>
  );
}

function RankList({ rows, renderLabel }) {
  if (!rows.length) return <p className="px-4 py-6 text-xs text-white/40">No data yet.</p>;
  const max = rows[0]?.count || 1;
  const totalCount = rows.reduce((sum, r) => sum + r.count, 0) || 1;
  return (
    <div className="max-h-[240px] overflow-y-auto">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2.5 border-b border-white/5 px-4 py-2 last:border-0">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
              i === 0 ? 'bg-primary text-black' : 'bg-white/10 text-white/50'
            }`}
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate text-white/80" title={renderLabel(row)}>
                {renderLabel(row)}
              </span>
              <span className="shrink-0 tabular-nums text-white/40">
                {Math.round((row.count / totalCount) * 100)}%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
              <span className="shrink-0 text-[11px] font-medium tabular-nums text-primary">{row.count}</span>
            </div>
          </div>
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
  const [activeTab, setActiveTab] = useState('user');
  const [refreshing, setRefreshing] = useState(false);
  const [rangeIdx, setRangeIdx] = useState(3);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ event: '', page: '', source: '' });
  const [newVisitorRows, setNewVisitorRows] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bots, setBots] = useState({ total: 0, uniqueIpCount: 0, events: [] });

  // Per-section custom date range (From/To) — overrides the global range
  // buttons above just for that one table, when set.
  const [activityDateRange, setActivityDateRange] = useState({ from: '', to: '' });
  const [botDateRange, setBotDateRange] = useState({ from: '', to: '' });

  const since = useMemo(() => {
    const ms = RANGES[rangeIdx].ms;
    return ms ? Date.now() - ms : null;
  }, [rangeIdx]);

  const activitySince = useMemo(
    () => (activityDateRange.from ? new Date(`${activityDateRange.from}T00:00:00`).getTime() : since),
    [activityDateRange.from, since],
  );
  const activityUntil = useMemo(
    () => (activityDateRange.to ? new Date(`${activityDateRange.to}T23:59:59.999`).getTime() : null),
    [activityDateRange.to],
  );
  const botSince = useMemo(
    () => (botDateRange.from ? new Date(`${botDateRange.from}T00:00:00`).getTime() : since),
    [botDateRange.from, since],
  );
  const botUntil = useMemo(
    () => (botDateRange.to ? new Date(`${botDateRange.to}T23:59:59.999`).getTime() : null),
    [botDateRange.to],
  );

  // sessionId -> that visitor's full path, so any single event row in "All
  // Activity" can show where that visitor came from and went next.
  const sessionPaths = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      map[s._id] = s.steps.filter((st) => st.event !== 'page_view_duration');
    });
    return map;
  }, [sessions]);

  const buildEventsUrl = useCallback(
    (skipVal, limitVal) => {
      const params = new URLSearchParams({ key, limit: limitVal, skip: skipVal });
      if (activitySince) params.set('since', activitySince);
      if (activityUntil) params.set('until', activityUntil);
      if (filters.event) params.set('event', filters.event);
      if (filters.page) params.set('page', filters.page);
      if (filters.source) params.set('source', filters.source);
      return `/api/track/events?${params.toString()}`;
    },
    [key, activitySince, activityUntil, filters],
  );

  const buildBotsUrl = useCallback(
    (skipVal, limitVal) => {
      const params = new URLSearchParams({ key, limit: limitVal, skip: skipVal });
      if (botSince) params.set('since', botSince);
      if (botUntil) params.set('until', botUntil);
      return `/api/track/bots?${params.toString()}`;
    },
    [key, botSince, botUntil],
  );

  const load = useCallback(() => {
    if (!key) return;
    setStatus('loading');
    const rangeParams = new URLSearchParams({ key });
    if (since) rangeParams.set('since', since);
    const newVisitorParams = new URLSearchParams({ key, event: 'page_view', isReturning: 'false', limit: 10 });
    if (since) newVisitorParams.set('since', since);
    const sessionParams = new URLSearchParams({ key, limit: 100 });
    if (since) sessionParams.set('since', since);

    Promise.all([
      fetchJson(`/api/track/summary?${rangeParams.toString()}`),
      fetchAllPages(buildEventsUrl, 'events'),
      fetchJson(`/api/track/events?${newVisitorParams.toString()}`),
      fetchJson(`/api/track/sessions?${sessionParams.toString()}`),
      fetchAllPages(buildBotsUrl, 'events'),
    ])
      .then(([summaryData, eventRows, newVisitorData, sessionData, botRows]) => {
        setSummary(summaryData);
        setEvents(eventRows);
        setNewVisitorRows(newVisitorData.events);
        setSessions(sessionData.sessions);
        setBots({ total: botRows.length, uniqueIpCount: new Set(botRows.map((r) => r.ip)).size, events: botRows });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [key, since, buildEventsUrl, buildBotsUrl]);

  useEffect(() => {
    if (key === null) return;
    if (!key) {
      setStatus('error');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rangeIdx, filters, activityDateRange, botDateRange]);

  const [exporting, setExporting] = useState({ activity: false, bots: false });

  const exportActivityCsv = async () => {
    setExporting((e) => ({ ...e, activity: true }));
    try {
      const rows = events;
      downloadCsv(
        `visitor-activity-${Date.now()}.csv`,
        [
          { header: 'Time', get: (r) => new Date(r.createdAt).toLocaleString() },
          { header: 'Action', get: (r) => friendlyLabel(r.event, r.source) },
          { header: 'Page', get: (r) => r.page },
          { header: 'Device', get: (r) => r.device },
          { header: 'Browser', get: (r) => r.browser },
          { header: 'OS', get: (r) => r.os },
          { header: 'IP', get: (r) => r.ip },
          { header: 'City', get: (r) => r.city },
          { header: 'Region', get: (r) => r.region },
          { header: 'Country', get: (r) => r.country },
          { header: 'ISP', get: (r) => r.isp },
          { header: 'Referrer', get: (r) => r.referrer },
          { header: 'New/Returning', get: (r) => (r.isReturning ? 'Returning' : 'New') },
          { header: 'Duration (ms)', get: (r) => r.durationMs },
          { header: 'Session ID', get: (r) => r.sessionId },
          {
            header: 'Where this visitor went',
            get: (r) => (sessionPaths[r.sessionId] || []).map(stepLabel).join(' -> '),
          },
        ],
        rows,
      );
    } finally {
      setExporting((e) => ({ ...e, activity: false }));
    }
  };

  const exportBotsCsv = async () => {
    setExporting((e) => ({ ...e, bots: true }));
    try {
      const rows = bots.events;
      downloadCsv(
        `bot-activity-${Date.now()}.csv`,
        [
          { header: 'Time', get: (r) => new Date(r.createdAt).toLocaleString() },
          { header: 'Bot', get: (r) => botName(r.botReason) },
          { header: 'Action', get: (r) => friendlyLabel(r.event, r.source) },
          { header: 'Page', get: (r) => r.page },
          { header: 'IP', get: (r) => r.ip },
          { header: 'City', get: (r) => r.city },
          { header: 'Region', get: (r) => r.region },
          { header: 'Country', get: (r) => r.country },
          { header: 'ISP', get: (r) => r.isp },
          { header: 'User Agent', get: (r) => r.userAgent },
        ],
        rows,
      );
    } finally {
      setExporting((e) => ({ ...e, bots: false }));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    load();
    setTimeout(() => setRefreshing(false), 2000);
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

      {refreshing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <HiRefresh className="animate-spin text-4xl text-primary" />
            <p className="text-sm text-white/60">Refreshing...</p>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <HeaderBar status={status} refreshing={refreshing} onRefresh={handleRefresh} />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-10">
        <div aria-hidden="true" className="invisible">
          <HeaderBar status={status} refreshing={false} onRefresh={() => {}} />
        </div>

        {status === 'loading' && !summary && <p className="mt-8 text-white/50">Loading...</p>}
        {status === 'error' && <p className="mt-8 text-red-400">Invalid or missing key.</p>}

        {summary && (
          <>
            <div className="mt-6 flex gap-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wide transition-colors ${
                  activeTab === 'user' ? 'border-b-2 border-primary text-primary' : 'text-white/50 hover:text-white/80'
                }`}
              >
                User Visits
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bot')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wide transition-colors ${
                  activeTab === 'bot' ? 'border-b-2 border-primary text-primary' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Bot Visits
              </button>
            </div>

            {activeTab === 'user' && (
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

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Most Clicked Buttons">
                <RankList rows={buttonRows} renderLabel={(row) => friendlyLabel(row.event, row.source)} />
              </StatCard>
              <StatCard title="Most Visited Pages">
                <RankList rows={pageRows} renderLabel={(row) => row.page} />
              </StatCard>
              <StatCard title="Where Visitors Come From">
                <RankList rows={summary.byReferrer} renderLabel={(row) => row.referrer || 'Direct'} />
              </StatCard>
              <StatCard title="Devices">
                <RankList rows={summary.byDevice} renderLabel={(row) => row.device || 'Unknown'} />
              </StatCard>
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
                      <div className="mt-2">
                        <Journey steps={steps} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section
              title="All Activity"
              actions={<DownloadCsvButton onClick={exportActivityCsv} loading={exporting.activity} />}
            >
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <DateRangeInputs range={activityDateRange} onChange={setActivityDateRange} />
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
                <table className="w-full min-w-[1250px] border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-[#0f1013]">
                    <tr className="text-white/40">
                      <th className="px-5 py-2 font-normal">Time</th>
                      <th className="px-3 py-2 font-normal">Action</th>
                      <th className="px-3 py-2 font-normal">Page</th>
                      <th className="px-3 py-2 font-normal">Device</th>
                      <th className="px-3 py-2 font-normal">IP</th>
                      <th className="px-3 py-2 font-normal">Location</th>
                      <th className="px-3 py-2 font-normal">Where this visitor went</th>
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
                        <td className="px-3 py-2.5">
                          <Journey steps={sessionPaths[ev.sessionId]} />
                        </td>
                      </tr>
                    ))}
                    {!events.length && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-white/40">
                          No activity matches these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
            </>
            )}

            {activeTab === 'bot' && (
            <div className="mt-6">
              <p className="text-xs text-white/40">
                Search engines, AI crawlers, and other automated traffic. These are never counted as visitors or clicks.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <StatTile label="Bot Visits" value={bots.total} />
                <StatTile label="Unique Bot IPs" value={bots.uniqueIpCount} />
              </div>

              <Section
                title="Bot Activity"
                actions={<DownloadCsvButton onClick={exportBotsCsv} loading={exporting.bots} />}
              >
                <div className="border-b border-white/10 px-5 py-3">
                  <DateRangeInputs range={botDateRange} onChange={setBotDateRange} />
                </div>
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
            )}
          </>
        )}
      </div>
    </>
  );
}

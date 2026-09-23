import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getSite } from '../lib/api.js';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const site = getSite();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  const tabClass = (isActive) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            {site?.branding?.logoUrl && <img src={site.branding.logoUrl} alt="" className="h-7 w-7 rounded object-contain" />}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{site?.branding?.brandName || 'Analytics'}</p>
              <p className="text-sm font-semibold">{site?.name || site?.domain}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => tabClass(isActive)}>
              Overview
            </NavLink>
            <NavLink to="/goals" className={({ isActive }) => tabClass(isActive)}>
              Goals
            </NavLink>
            <NavLink to="/conversions" className={({ isActive }) => tabClass(isActive)}>
              Conversions
            </NavLink>
            <NavLink to="/journeys" className={({ isActive }) => tabClass(isActive)}>
              Journeys
            </NavLink>
            <NavLink to="/performance" className={({ isActive }) => tabClass(isActive)}>
              Performance
            </NavLink>
            <NavLink to="/errors" className={({ isActive }) => tabClass(isActive)}>
              Errors
            </NavLink>
            <NavLink to="/seo" className={({ isActive }) => tabClass(isActive)}>
              SEO
            </NavLink>
            <NavLink to="/page-health" className={({ isActive }) => tabClass(isActive)}>
              Page Health
            </NavLink>
            <NavLink to="/opportunities" className={({ isActive }) => tabClass(isActive)}>
              Opportunities
            </NavLink>
            <NavLink to="/anomalies" className={({ isActive }) => tabClass(isActive)}>
              Anomalies
            </NavLink>
            <NavLink to="/alerts" className={({ isActive }) => tabClass(isActive)}>
              Alerts
            </NavLink>
            <NavLink to="/ai-analyst" className={({ isActive }) => tabClass(isActive)}>
              AI Analyst
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => tabClass(isActive)}>
              Settings
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

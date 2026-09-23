import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Goals from './pages/Goals.jsx';
import Conversions from './pages/Conversions.jsx';
import Journeys from './pages/Journeys.jsx';
import Performance from './pages/Performance.jsx';
import Errors from './pages/Errors.jsx';
import Seo from './pages/Seo.jsx';
import PageHealth from './pages/PageHealth.jsx';
import Opportunities from './pages/Opportunities.jsx';
import Anomalies from './pages/Anomalies.jsx';
import Alerts from './pages/Alerts.jsx';
import AiAnalyst from './pages/AiAnalyst.jsx';
import Settings from './pages/Settings.jsx';
import AgencyLogin from './pages/AgencyLogin.jsx';
import Agency from './pages/Agency.jsx';
import Layout from './components/Layout.jsx';
import { getToken, getSite } from './lib/api.js';
import { getAdminKey } from './lib/adminApi.js';
import { applyTheme, applyBranding } from './lib/theme.js';

function RequireAuth({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

// A separate guard from RequireAuth — this checks for the admin key, not a
// tenant JWT, since the Agency console is a different auth realm entirely.
function RequireAdminAuth({ children }) {
  if (!getAdminKey()) return <Navigate to="/agency/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    const site = getSite();
    applyTheme(site?.theme);
    applyBranding(site?.branding, site?.name);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/agency/login" element={<AgencyLogin />} />
        <Route
          path="/agency"
          element={
            <RequireAdminAuth>
              <Agency />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/goals"
          element={
            <RequireAuth>
              <Layout>
                <Goals />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/conversions"
          element={
            <RequireAuth>
              <Layout>
                <Conversions />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/journeys"
          element={
            <RequireAuth>
              <Layout>
                <Journeys />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/performance"
          element={
            <RequireAuth>
              <Layout>
                <Performance />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/errors"
          element={
            <RequireAuth>
              <Layout>
                <Errors />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/seo"
          element={
            <RequireAuth>
              <Layout>
                <Seo />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/page-health"
          element={
            <RequireAuth>
              <Layout>
                <PageHealth />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/opportunities"
          element={
            <RequireAuth>
              <Layout>
                <Opportunities />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/anomalies"
          element={
            <RequireAuth>
              <Layout>
                <Anomalies />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/alerts"
          element={
            <RequireAuth>
              <Layout>
                <Alerts />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/ai-analyst"
          element={
            <RequireAuth>
              <Layout>
                <AiAnalyst />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Layout>
                <Settings />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import axios from 'axios';

const PSI_ENDPOINT = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';
const MOBILE_FRIENDLY_AUDIT_IDS = ['viewport', 'tap-targets', 'font-size', 'content-width'];

async function fetchPageSpeed(url, strategy) {
  const params = new URLSearchParams();
  params.append('url', url);
  params.append('strategy', strategy.toUpperCase());
  params.append('category', 'PERFORMANCE');
  params.append('category', 'SEO');
  params.append('category', 'ACCESSIBILITY');
  if (process.env.GOOGLE_PAGESPEED_API_KEY) {
    params.append('key', process.env.GOOGLE_PAGESPEED_API_KEY);
  }

  const { data } = await axios.get(`${PSI_ENDPOINT}?${params.toString()}`, { timeout: 45000 });
  return data;
}

function extractCoreWebVitals(lighthouseResult, loadingExperience) {
  const audits = lighthouseResult?.audits ?? {};
  const lcpMs = audits['largest-contentful-paint']?.numericValue ?? null;
  const cls = audits['cumulative-layout-shift']?.numericValue ?? null;
  const inpMs =
    audits['interaction-to-next-paint']?.numericValue ??
    loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ??
    null;

  return {
    lcp: lcpMs != null ? Number((lcpMs / 1000).toFixed(2)) : null,
    cls: cls != null ? Number(cls.toFixed(3)) : null,
    inp: inpMs != null ? Math.round(inpMs) : null,
  };
}

function extractMobileFriendlyScore(lighthouseResult) {
  const audits = lighthouseResult?.audits ?? {};
  const scores = MOBILE_FRIENDLY_AUDIT_IDS.map((id) => audits[id]?.score).filter(
    (score) => typeof score === 'number',
  );
  if (scores.length === 0) return 100;
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100);
}

export async function runPageSpeedChecks(url) {
  const [mobile, desktop] = await Promise.all([fetchPageSpeed(url, 'mobile'), fetchPageSpeed(url, 'desktop')]);

  const mobilePerformanceScore = Math.round((mobile.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
  const desktopPerformanceScore = Math.round((desktop.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
  const accessibilityScore = Math.round((mobile.lighthouseResult?.categories?.accessibility?.score ?? 0) * 100);

  return {
    performanceScore: Math.round((mobilePerformanceScore + desktopPerformanceScore) / 2),
    mobilePerformanceScore,
    desktopPerformanceScore,
    accessibilityScore,
    mobileFriendlyScore: extractMobileFriendlyScore(mobile.lighthouseResult),
    coreWebVitals: {
      mobile: extractCoreWebVitals(mobile.lighthouseResult, mobile.loadingExperience),
      desktop: extractCoreWebVitals(desktop.lighthouseResult, desktop.loadingExperience),
    },
  };
}

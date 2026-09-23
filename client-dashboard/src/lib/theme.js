// Same variable-driven theming mechanism validated in the WordPress plugin
// build (class-ma-admin.php's theme_css()), ported to a React effect: the
// client's own colors become CSS custom properties instead of hardcoded
// values, so the whole UI re-themes from one place.
export function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
  if (theme.accentColor) root.style.setProperty('--color-accent', theme.accentColor);
  root.classList.toggle('dark', theme.mode === 'dark');
}

// White-labeling: each client can be shown under their own brand name
// instead of this product's generic "Analytics" label, falling back to it
// when a site hasn't set one. Only touches the tab title — the in-page label
// is rendered directly from site data in Layout.jsx so it always matches
// what's currently in localStorage without a page reload.
export function applyBranding(branding, fallbackName) {
  document.title = `${branding?.brandName || fallbackName || 'Analytics'} Dashboard`;
}

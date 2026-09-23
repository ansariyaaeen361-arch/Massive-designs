// POST /track is a public, unauthenticated endpoint — client-supplied
// metadata is only ever accepted for known event types, against an exact
// field/type spec. This is what stops the endpoint from becoming a place to
// stuff arbitrary blobs (or oversized strings) into the database.
const MAX_STRING_LEN = 500;

const FIELD_SPECS = {
  web_vitals: { lcp: 'number', cls: 'number', inp: 'number', ttfb: 'number', loadTime: 'number' },
  js_error: { message: 'string', source: 'string', line: 'number', col: 'number' },
  resource_error: { url: 'string', status: 'number', tagName: 'string' },
  seo_audit: {
    hasTitle: 'boolean',
    titleLength: 'number',
    hasMetaDescription: 'boolean',
    metaDescriptionLength: 'number',
    h1Count: 'number',
    hasCanonical: 'boolean',
    canonicalMatchesUrl: 'boolean',
    isNoindex: 'boolean',
    imagesTotal: 'number',
    imagesMissingAlt: 'number',
  },
};

export function sanitizeMetadata(event, raw) {
  const spec = FIELD_SPECS[event];
  if (!spec || !raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const clean = {};
  Object.entries(spec).forEach(([key, type]) => {
    const val = raw[key];
    if (type === 'number') {
      if (typeof val === 'number' && Number.isFinite(val) && val >= 0) clean[key] = val;
    } else if (type === 'string') {
      if (typeof val === 'string' && val.length > 0) clean[key] = val.slice(0, MAX_STRING_LEN);
    } else if (type === 'boolean') {
      if (typeof val === 'boolean') clean[key] = val;
    }
  });
  return clean;
}

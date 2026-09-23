// Shared between routes/seo.js and routes/pageHealth.js so both apply the
// exact same rules to a page's seo_audit metadata.
export function issuesFor(a) {
  const issues = [];
  if (!a.hasTitle) issues.push('missing_title');
  if (!a.hasMetaDescription) issues.push('missing_meta_description');
  if (!a.h1Count) issues.push('missing_h1');
  else if (a.h1Count > 1) issues.push('multiple_h1');
  if (!a.hasCanonical) issues.push('missing_canonical');
  else if (!a.canonicalMatchesUrl) issues.push('canonical_mismatch');
  if (a.isNoindex) issues.push('noindex');
  if (a.imagesMissingAlt > 0) issues.push('images_missing_alt');
  return issues;
}

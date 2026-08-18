import { Helmet } from 'react-helmet-async';
import { brand } from '../../lib/brand';
import { SITE_URL, getOrganizationNode, getWebsiteNode } from '../../lib/schema';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  schemaGraph,
}) {
  const normalizedPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  const canonical = `${SITE_URL}${normalizedPath}`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const graph = [getOrganizationNode(), getWebsiteNode(), ...(schemaGraph ?? [])];

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brand.name} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
    </Helmet>
  );
}

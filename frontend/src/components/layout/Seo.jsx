import { Helmet } from 'react-helmet-async';
import { brand } from '../../lib/brand';

const SITE_URL = 'https://massive-designs.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function Seo({ title, description, path = '/', image = DEFAULT_OG_IMAGE, type = 'website' }) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

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
    </Helmet>
  );
}

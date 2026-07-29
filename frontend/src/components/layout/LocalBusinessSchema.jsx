import { Helmet } from 'react-helmet-async';
import { brand, socialLinks } from '../../lib/brand';

export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://massive-designs.com/#business',
    name: brand.name,
    url: 'https://massive-designs.com',
    logo: 'https://massive-designs.com/favicon.png',
    image: 'https://massive-designs.com/og-image.jpg',
    telephone: brand.phone,
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8350 Davis Boulevard',
      addressLocality: 'North Richland Hills',
      addressRegion: 'TX',
      postalCode: '76182',
      addressCountry: 'US',
    },
    sameAs: socialLinks.map((s) => s.url),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

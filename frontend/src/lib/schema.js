import { brand, socialLinks } from './brand';

export const SITE_URL = 'https://massive-designs.com';

export function getOrganizationNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: brand.name,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.png`,
    },
    telephone: brand.phone,
    email: brand.email,
    description:
      'Massive Designs is a Texas web design and digital marketing agency providing web design and development, SEO, branding, content marketing, social media marketing, and app development services.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8350 Davis Boulevard',
      addressLocality: 'North Richland Hills',
      addressRegion: 'TX',
      postalCode: '76182',
      addressCountry: 'US',
    },
    areaServed: { '@type': 'State', name: 'Texas' },
    serviceType: [
      'Web Design and Development',
      'Search Engine Optimization',
      'Branding and Logo Design',
      'Content Marketing',
      'Social Media Marketing',
      'Mobile App Development',
    ],
    sameAs: socialLinks.map((s) => s.url),
  };
}

export function getServicePageNodes({ slug, serviceName, serviceDescription, serviceTypes, pageName, pageDescription }) {
  const serviceId = `${SITE_URL}/${slug}/#service`;
  return [
    {
      '@type': 'Service',
      '@id': serviceId,
      name: serviceName,
      url: `${SITE_URL}/${slug}/`,
      description: serviceDescription,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'State', name: 'Texas' },
      serviceType: serviceTypes,
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${slug}/#webpage`,
      url: `${SITE_URL}/${slug}/`,
      name: pageName,
      description: pageDescription,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': serviceId },
      mainEntity: { '@id': serviceId },
      inLanguage: 'en-US',
    },
  ];
}

export function getAreaPageNodes({ slug, city, pageName, pageDescription }) {
  const serviceId = `${SITE_URL}/${slug}/#service`;
  return [
    {
      '@type': 'Service',
      '@id': serviceId,
      name: `Web Design & Digital Marketing Services in ${city}, TX`,
      url: `${SITE_URL}/${slug}/`,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: 'Texas' } },
      serviceType: [
        'Web Design and Development',
        'Search Engine Optimization',
        'Digital Marketing',
        'Branding and Logo Design',
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${slug}/#webpage`,
      url: `${SITE_URL}/${slug}/`,
      name: pageName,
      description: pageDescription,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': serviceId },
      mainEntity: { '@id': serviceId },
      inLanguage: 'en-US',
    },
  ];
}

export function getWebPageNode({ slug, pageName, pageDescription, pageType = 'WebPage' }) {
  return {
    '@type': pageType,
    '@id': `${SITE_URL}/${slug}/#webpage`,
    url: `${SITE_URL}/${slug}/`,
    name: pageName,
    description: pageDescription,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
  };
}

export function getWebsiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: brand.name,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
  };
}

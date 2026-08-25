import { useState } from 'react';
import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import { SITE_URL } from '../lib/schema';
import ServiceShowcase from '../components/service-page/ServiceShowcase';
import ServiceSlider from '../components/service-page/ServiceSlider';
import ServiceTags from '../components/service-page/ServiceTags';
import ServiceFaq from '../components/service-page/ServiceFaq';
import OrderModal from '../components/forms/OrderModal';

const SERVICE_LIST = [
  { name: 'Web Design & Development', slug: 'web-design-development' },
  { name: 'Branding & Logo Design', slug: 'branding-logo-design' },
  { name: 'SEO Services', slug: 'seo-services' },
  { name: 'App Development', slug: 'mobile-app-development' },
  { name: 'Content Marketing', slug: 'content-marketing' },
  { name: 'Social Media Marketing', slug: 'social-media-marketing' },
];

export default function Services() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <Seo
        title="Services - Massive Designs"
        description="Full digital solutions in North Richland Hills, TX: UI/UX design, branding, web & app development, SEO and social media to drive business growth."
        path="/services"
        schemaGraph={[
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/services/#webpage`,
            url: `${SITE_URL}/services/`,
            name: 'Services | Massive Designs',
            description: 'Explore web design, SEO, branding, app development, content marketing, and social media marketing services from Massive Designs for businesses across Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            mainEntity: { '@id': `${SITE_URL}/services/#services` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'ItemList',
            '@id': `${SITE_URL}/services/#services`,
            name: 'Massive Designs Services',
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            numberOfItems: SERVICE_LIST.length,
            itemListElement: SERVICE_LIST.map((service, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: service.name,
              url: `${SITE_URL}/${service.slug}/`,
            })),
          },
        ]}
      />
      <PageHeader
        title="Our Services"
        crumb="Our Services"
        action={
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
          >
            Order Now
          </button>
        }
      />
      <ServiceShowcase />
      <ServiceSlider />
      <ServiceTags />
      <ServiceFaq />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}

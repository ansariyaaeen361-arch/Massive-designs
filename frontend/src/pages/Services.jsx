import { useState } from 'react';
import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import ServiceShowcase from './services/ServiceShowcase';
import ServiceSlider from './services/ServiceSlider';
import ServiceTags from './services/ServiceTags';
import ServiceFaq from './services/ServiceFaq';
import OrderModal from '../components/forms/OrderModal';

export default function Services() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <Seo
        title="Services - Massive Designs"
        description="Full digital solutions in North Richland Hills, TX: UI/UX design, branding, web & app development, SEO and social media to drive business growth."
        path="/services"
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

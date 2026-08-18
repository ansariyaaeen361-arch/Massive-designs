import Seo from '../components/layout/Seo';
import { SITE_URL } from '../lib/schema';
import Hero from './home/Hero';
import Services from './home/Services';
import WhyChooseUs from './home/WhyChooseUs';
import PortfolioTeaser from './home/PortfolioTeaser';
import VideoShowcase from './home/VideoShowcase';
import Testimonials from './home/Testimonials';
import ServiceAreas from './home/ServiceAreas';
import ContactSection from './home/ContactSection';
import ClientLogos from './home/ClientLogos';

export default function Home() {
  return (
    <>
      <Seo
        title="Web Design, SEO & Digital Marketing Agency in Texas"
        description="From websites to SEO, we build complete growth systems for Texas businesses. Increase traffic, generate leads, and scale faster with Massive Designs."
        path="/"
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            url: `${SITE_URL}/`,
            name: 'Web Design, SEO & Digital Marketing Agency in Texas',
            description:
              'Massive Designs provides web design, SEO, branding, and digital marketing services for businesses across Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-US',
          },
        ]}
      />
      <Hero />
      <Services />
      <WhyChooseUs />
      <PortfolioTeaser />
      <VideoShowcase />
      <Testimonials />
      <ServiceAreas />
      <ContactSection />
      <ClientLogos />
    </>
  );
}

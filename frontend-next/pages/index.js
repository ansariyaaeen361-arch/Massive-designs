import Seo from '../components/layout/Seo';
import { SITE_URL } from '../lib/schema';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PortfolioTeaser from '../components/home/PortfolioTeaser';
import VideoShowcase from '../components/home/VideoShowcase';
import Testimonials from '../components/home/Testimonials';
import ServiceAreas from '../components/home/ServiceAreas';
import ContactSection from '../components/home/ContactSection';
import ClientLogos from '../components/home/ClientLogos';

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

import Seo from '../components/layout/Seo';
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

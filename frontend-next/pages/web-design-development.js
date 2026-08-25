import Link from 'next/link';
import Seo from '../components/layout/Seo';
import ServiceHero from '../components/service-page/ServiceHero';
import FeatureGrid from '../components/service-page/FeatureGrid';
import ProcessSteps from '../components/service-page/ProcessSteps';
import PortfolioHoverGrid from '../components/service-page/PortfolioHoverGrid';
import ServiceCta from '../components/service-page/ServiceCta';
import { brand } from '../lib/brand';
import { getServicePageNodes } from '../lib/schema';

const portfolioItems = [
  { src: '/img/web-projects/optimized/web-project-1.webp', alt: "Aguilera's Home Repair" },
  { src: '/img/web-projects/optimized/web-project-7.webp', alt: "Pete's Dumpster Rentals" },
  { src: '/img/web-projects/optimized/web-project-10.webp', alt: 'Mental Forge AI Automation' },
  { src: '/img/web-projects/optimized/web-project-13.webp', alt: 'Global Desk News' },
  { src: '/img/web-projects/optimized/web-project-18.webp', alt: 'Carpet Repair Nevada' },
  { src: '/img/web-projects/optimized/web-project-19.webp', alt: 'AtlasLearners', href: 'https://atlaslearners.com/' },
  { src: '/img/web-projects/optimized/web-project-20.webp', alt: 'MentalForge Media' },
  { src: '/img/web-projects/optimized/web-project-24.webp', alt: 'FitRoutine' },
];

export default function WebDesignDevelopment() {
  return (
    <>
      <Seo
        title="High-Converting Web Design Services for Small Businesses Texas"
        description="We don't just design websites, we build sales machines. Get a fast, modern website that turns visitors into customers. View our results."
        path="/web-design-development"
        schemaGraph={getServicePageNodes({
          slug: 'web-design-development',
          serviceName: 'Web Design & Development',
          serviceDescription:
            'Custom web design and development services for businesses in Texas, including strategic website planning, responsive design, user experience, website development, SEO-friendly structure, performance optimization, security, and third-party integrations.',
          serviceTypes: [
            'Web Design',
            'Website Development',
            'Responsive Web Design',
            'Custom Website Development',
            'User Experience Design',
            'Website Performance Optimization',
            'Website SEO',
            'CRM Integration',
            'Payment Integration',
            'Analytics Integration',
          ],
          pageName: 'Web Design & Development in Texas | Massive Designs',
          pageDescription:
            'Massive Designs provides custom web design and development services for Texas businesses, with a focus on responsive design, user experience, performance, SEO, security, and scalable website solutions.',
        })}
      />
      <ServiceHero
        title="Web Design and Development for Texas Brands"
        lead="We help Texas companies strengthen their online presence through well-structured design and practical development."
        crumb="Web Design & Development"
      />

      <FeatureGrid
        heading="Custom Website Design for Texas Brands"
        description="Your website should feel like your best storefront online, clear, fast, and easy to trust. We plan, design, and develop custom websites for businesses across North and South Texas, acting as a practical web design and development partner. After launching dozens of projects in the region, our team focuses on navigation, performance, and mobile usability, so visitors move naturally from browsing to action."
        items={[
          { title: 'Strategic Design', description: 'Modern clean layouts designed to guide visitors toward conversion.' },
          { title: 'User Experience First', description: 'Fast-loading pages, intuitive navigation and visually engaging structure.' },
          { title: 'Custom Development', description: 'No templates. Every website handcrafted for brand success.' },
        ]}
      />

      <FeatureGrid
        heading="Web Development that Delivers Speed, Security & Performance"
        description={
          <>
            A good looking website is pointless if it feels slow or unreliable. Solid performance has to come
            first. Our development team builds secure, fast, and scalable websites with clean code, stable
            infrastructure, and modern security practices so your site stays reliable over time. As a dedicated web
            development team in Texas, we use up-to-date technologies and performance optimization techniques to
            keep your pages loading quickly and running smoothly. We then fine-tune everything for page speed and{' '}
            <Link href="/seo-services" className="text-primary hover:underline">
              search engine optimization
            </Link>{' '}
            so your content is easy to discover.
          </>
        }
        items={[
          { title: 'Performance Optimized', description: 'Speed and SEO focused coding techniques for top search rankings.' },
          { title: 'Integrated Business Tools', description: 'Payment systems, analytics, and CRM integrations ready for growth.' },
          { title: 'Future Ready', description: 'Built scalable, keeping long-term performance in mind.' },
        ]}
      />

      <ProcessSteps
        heading="Our Proven Process: Plan – Design – Launch"
        description="A clear path that keeps your project on track and success measurable."
        steps={[
          { number: '01', title: 'Plan', description: 'We learn your business goals and build the structure for success.' },
          { number: '02', title: 'Design', description: 'Creative layouts and visuals presenting your brand story beautifully.' },
          { number: '03', title: 'Launch', description: 'Development, testing and deployment for a flawless go-live.' },
        ]}
      />

      <PortfolioHoverGrid
        heading="A Portfolio that Speaks for Itself"
        description="View how we combine aesthetics and functionality for Texas businesses."
        items={portfolioItems}
      />

      <FeatureGrid
        heading="Why Texas Businesses Choose Massive Designs?"
        description={
          <>
            <Link href="/" className="text-primary hover:underline">
              Massive Designs
            </Link>{' '}
            builds websites that help Texas companies manage their online presence with confidence. We plan and
            develop every site around real business needs, clear structure, dependable performance, and easy
            upkeep. Our team has worked with businesses in Austin, North Richland Hills, and San Antonio, combining
            design and development to keep their websites practical and consistent. As a Texas web design company,
            we focus on straightforward solutions built to last and support ongoing growth.
          </>
        }
        items={[
          { title: 'Local Texas Experts', description: 'Trusted by Houston, Austin, Dallas & San Antonio businesses.' },
          { title: 'Quality + Performance', description: 'Every design crafted for growth and user engagement.' },
          { title: 'Client Focused', description: 'We build relationships based on trust and support.' },
        ]}
      />

      <ServiceCta
        heading="Success Begins with the Right Web Design Partner"
        paragraphs={[
          'Selecting a credible web design partner is the key to online success. A strategic website develops trust, optimizes exposure, and extends interactions. Massive Designs ensures your business progresses through objective-based effective web solutions.',
          'Our team knows the Texas market, and your audience can get websites resonating with your audience. From Austin, Texas, website design to San Antonio web design, our expertise spans across the state.',
          'We shall take your brand to the next level by designing it to work. Start your journey with Massive Designs today and experience what a dedicated web design team can do for your business.',
          'Get in touch with us now to have your free consultation and make the first step towards your dream website.',
        ]}
        buttonLabel="Request Free Consultation"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

import { useState } from 'react';
import Link from 'next/link';
import Seo from '../../components/layout/Seo';
import { getAreaPageNodes } from '../../lib/schema';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import AreaMapHighlight from '../../components/service-page/AreaMapHighlight';
import PortfolioHoverGrid from '../../components/service-page/PortfolioHoverGrid';
import ServiceCta from '../../components/service-page/ServiceCta';
import OrderModal from '../../components/forms/OrderModal';
import { brand } from '../../lib/brand';

const portfolioItems = [
  { src: '/img/arias-portfolio-images/houston/optimized/houston-website-1.webp', alt: 'Houston Business Website Design' },
  { src: '/img/arias-portfolio-images/houston/optimized/houston-website-2.webp', alt: 'Houston Business Website Design 2' },
  { src: '/img/arias-portfolio-images/houston/optimized/houston-website-3.webp', alt: 'Houston Business Website Design 3' },
];

export default function Houston() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design Company Houston TX"
        description="Massive Designs builds custom, mobile-first websites for Houston businesses across the region's energy, medical, logistics, and retail sectors, with local SEO structured in from the first wireframe."
        path="/areas-we-serve/houston"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/houston',
          city: 'Houston',
          pageName: 'Web Design & Development in Houston, TX | Massive Designs',
          pageDescription: 'Massive Designs builds custom, mobile-first websites for Houston businesses across the region\'s energy, medical, logistics, and retail sectors, with local SEO structured in from the first wireframe.',
        })}
      />
      <ServiceHero
        title="Web Design & Development in Houston, TX"
        lead="Houston is the fourth-largest U.S. city, with a metro workforce of over 3.4 million. Twenty-four Fortune 500 companies are headquartered here, the Texas Medical Center is the world's largest medical campus, and the Port of Houston handles more total tonnage than any other U.S. port. In a market that large and that economically diverse, competing online means being specific about your sector, your location within the city, and who you actually serve. Massive Designs builds websites for Houston businesses across that full range, custom-designed, mobile-first, and structured around local SEO from the first wireframe."
        crumb="Houston"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Houston Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for Houston Businesses"
        description={
          <>
            Houston&rsquo;s search environment is genuinely local within a very large city. A business in Katy
            competes differently than one in Midtown or Pearland. Different customers, different competitors,
            different conversion paths. We account for that when planning site architecture rather than treating
            Houston as a single undifferentiated market.
          </>
        }
        items={[
          {
            title: 'Custom Website Design',
            description:
              'Layouts built around how Houston customers in your specific sector and neighborhood search and decide. Energy procurement teams evaluate very differently than patients booking a specialist.',
          },
          {
            title: 'Website Development',
            description:
              "Secure, scalable development with ERP, CRM, booking, and payment integrations. Houston's regulated industries need clean, reliable code.",
          },
          {
            title: 'SEO & Local Visibility',
            description:
              "Technical and local SEO from day one. Houston's geographic size means local SEO has to account for multiple neighborhoods or suburbs to be effective.",
          },
        ]}
      />

      <ProcessSteps
        heading="What a Houston Growth Plan Looks Like"
        description="Every Houston project follows four stages shaped by your specific sector and position within this large, economically diverse city."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description:
              'We map who your Houston customers are and how they search. An energy procurement team searches differently than a patient in the Medical Center area or a logistics buyer comparing carriers.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description:
              "Fast, mobile-first, and organized for your specific Houston audience. Houston's international population makes multilingual design a legitimate consideration for some businesses.",
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description:
              'We target at the right geographic level: Energy Corridor, Texas Medical Center area, Katy, Pearland, rather than just a broad Houston keyword that the largest competitors already dominate.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description: 'After launch we continue building through content and social support.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Houston Market"
        description="Large healthcare systems, national franchise chains, and energy companies with in-house SEO all appear in the same Houston search results as independently owned businesses. Houston's constant flow of new residents and relocating companies has also intensified competition in categories that had limited competition just a few years ago."
        mapQuery="Houston, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          "Faster mobile-first design built for Houston's high-proportion mobile audience",
          'Search visibility at the right geographic level: Energy Corridor, Katy, The Woodlands, Pearland, Midtown',
          'A clearer path from homepage to phone call, quote request, appointment, or purchase',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across Houston and Texas"
        description="Website, branding, and digital marketing work for businesses across Texas, including projects for businesses operating across Houston's range of industries."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With Houston Clients"
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description:
              "We start with your customers and your competitive position within Houston's specific industry segments. Houston's diversity means the specifics vary considerably from project to project.",
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description:
              'For Houston businesses in healthcare or energy services, that often starts with content quality and technical SEO rather than visual design.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description:
              'You see real drafts early. Houston businesses in regulated industries need to review specific content at each stage, and we build that review into the process.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description:
              'After launch we track how Houston traffic behaves and adjust. Businesses with energy market cycles or seasonal patterns benefit from optimization adjustments that account for those cycles.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Houston Businesses Choose Massive Designs"
        items={[
          {
            title: 'Strategy Before Design',
            description: "Your customers' search and evaluation behavior comes first. Design follows.",
          },
          {
            title: 'Design and Development Under One Team',
            description: 'The same team handles design and development. No translation errors between disciplines.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description: "Technical foundations supporting search visibility from launch, essential in Houston's competitive environment.",
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your Houston business?"
        paragraphs={[
          <>
            If you want a web design company that understands Houston&rsquo;s scale and builds with SEO in mind
            from day one, let&rsquo;s talk. Take a look at our full{' '}
            <Link href="/services" className="text-primary hover:underline">
              range of services
            </Link>{' '}
            to see what&rsquo;s included, then let&rsquo;s talk about your project.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

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
  { src: '/img/arias-portfolio-images/san-antonio/optimized/san-antonio-website-1.webp', alt: 'San Antonio Business Website Design' },
  { src: '/img/arias-portfolio-images/san-antonio/optimized/san-antonio-website-2.webp', alt: 'San Antonio Business Website Design 2' },
  { src: '/img/arias-portfolio-images/san-antonio/optimized/san-antonio-website-3.webp', alt: 'San Antonio Business Website Design 3' },
];

export default function SanAntonio() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design Company San Antonio TX"
        description="Massive Designs builds custom, mobile-first websites for San Antonio businesses across military, medical, tourism, and local service audiences, with local SEO built in from the start."
        path="/areas-we-serve/san-antonio"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/san-antonio',
          city: 'San Antonio',
          pageName: 'Web Design & Development in San Antonio, TX | Massive Designs',
          pageDescription: 'Massive Designs builds custom, mobile-first websites for San Antonio businesses across military, medical, tourism, and local service audiences, with local SEO built in from the start.',
        })}
      />
      <ServiceHero
        title="Web Design & Development in San Antonio, TX"
        lead="San Antonio is Texas's second-largest city, with over 1.5 million residents and a metro area of approximately 2.5 million. Joint Base San Antonio brings over 80,000 active-duty military personnel and their families to the area, the South Texas Medical Center is one of the state's largest medical complexes, and Valero Energy and USAA are headquartered here. Massive Designs builds for San Antonio businesses across all of those contexts, custom and mobile-first, with local SEO built into the site from the start."
        crumb="San Antonio"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your San Antonio Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for San Antonio Businesses"
        description={
          <>
            San Antonio&rsquo;s distinct audience segments do not overlap. Military families near JBSA search for
            services differently than long-term residents. Medical Center patients have different trust signals
            than River Walk tourists. Pearl District businesses serve both local and visitor traffic
            simultaneously. Each requires a different site structure, content strategy, and conversion path.
          </>
        }
        items={[
          {
            title: 'Custom Website Design',
            description:
              'Layouts built around how your specific San Antonio audience searches and evaluates. Military families, medical patients, tourists, and local service customers all behave differently and the design accounts for that.',
          },
          {
            title: 'Website Development',
            description:
              'Secure, scalable development with booking, payment, CRM, and multilingual content support where the audience genuinely calls for it.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              'Technical and local SEO from day one, in both English and Spanish where keyword research and your actual customer data support that investment.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a San Antonio Growth Plan Looks Like"
        description="Every San Antonio project follows four stages shaped by your specific audience, whether that is the JBSA military community, the Medical Center corridor, River Walk tourism, B2B services, or local residential customers."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description:
              "We map your customers' actual search behavior. For businesses near JBSA, that means understanding PCS relocation search patterns. For tourism-facing businesses, it means visitors planning a San Antonio trip on their phones.",
          },
          {
            number: '02',
            title: 'Design & Development',
            description:
              'Fast, mobile-first, and organized for your specific audience. For bilingual businesses, this stage includes an evidence-based decision about whether Spanish-language content actually improves your conversion path, based on your customer data rather than a blanket assumption.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description:
              'On-page and technical SEO targeting the terms your customers search. For bilingual sites, we use correct hreflang implementation and URL structure from the start to prevent duplicate content issues.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description:
              'After launch we continue building. Tourism patterns, JBSA relocation cycles, and seasonal events can shape the content calendar.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Perform in a Competitive San Antonio Market"
        description="San Antonio's growth has brought more businesses and more competition, and national chains and franchise operators appear in the same local search results as independently owned businesses. The city's bilingual market also creates a real opportunity: a business investing in substantive Spanish-language content can reach an audience its English-only competitors are effectively invisible to."
        mapQuery="San Antonio, TX"
        highlightsTitle="What Changes With Us"
        highlightsDescription="San Antonio businesses notice these differences quickly, especially where bilingual search and mobile performance are concerned."
        highlights={[
          "Faster mobile-first design for San Antonio's predominantly mobile search audience",
          'Search visibility in both English and Spanish where audience data and keyword research support that investment',
          'A clearer path from homepage to appointment request, quote, reservation, or phone call',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across San Antonio and Texas"
        description="Website, branding, and digital marketing work for businesses across Texas, including a sample of what we've built for San Antonio clients specifically."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With San Antonio Clients"
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description:
              'We start with your customers and competitive position. For businesses serving bilingual audiences or the military community, we ask about those specifics rather than assuming.',
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description:
              'For businesses with Spanish-speaking customers, this includes an honest conversation about whether bilingual content produces a real conversion advantage or adds complexity without proportional benefit.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description:
              'For bilingual builds, you see how Spanish-language pages function alongside English pages and how navigation between them is handled before anything is launched.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description:
              'After launch we track how San Antonio traffic behaves and adjust. Tourism patterns, JBSA relocation cycles, and San Antonio events shape the optimization calendar.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why San Antonio Businesses Choose Massive Designs"
        items={[
          {
            title: 'Strategy Before Design',
            description: "Your customers' actual search behavior and conversion path come first. Design follows.",
          },
          {
            title: 'Design and Development Under One Team',
            description:
              'For bilingual projects especially, keeping design and development under one team prevents the structural errors that happen when they are handled separately.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description:
              'Technical foundations including correct hreflang architecture for bilingual sites, preventing duplicate content problems from the start.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your San Antonio business?"
        paragraphs={[
          <>
            If you want a web design company that understands San Antonio&rsquo;s bilingual market, military
            community, and tourism economy and builds with SEO in mind from day one, let&rsquo;s talk. Look through
            our full{' '}
            <Link href="/services" className="text-primary hover:underline">
              services
            </Link>{' '}
            and let&rsquo;s map out where to start.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

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
  { src: '/img/web-projects/optimized/web-project-18.webp', alt: 'Carpet Repair Nevada' },
  { src: '/img/web-projects/optimized/web-project-9.webp', alt: 'MFM Designs' },
  { src: '/img/web-projects/optimized/web-project-10.webp', alt: 'Mental Forge AI Automation' },
  { src: '/img/web-projects/optimized/web-project-24.webp', alt: 'FitRoutine' },
];

export default function NorthRichlandHills() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Development in North Richland Hills, TX | Massive Designs"
        description="Massive Designs is headquartered at 8350 Davis Boulevard, North Richland Hills, TX, building SEO-friendly websites for businesses across the Davis Boulevard corridor and the wider Mid-Cities market."
        path="/areas-we-serve/north-richland-hills"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/north-richland-hills',
          city: 'North Richland Hills',
          pageName: 'Web Design & Development in North Richland Hills, TX | Massive Designs',
          pageDescription: 'Massive Designs is headquartered at 8350 Davis Boulevard, North Richland Hills, TX, building SEO-friendly websites for businesses across the Davis Boulevard corridor and the wider Mid-Cities market.',
        })}
      />
      <ServiceHero
        title="Web Design & Development in North Richland Hills, TX"
        lead="Massive Designs is headquartered at 8350 Davis Boulevard, North Richland Hills, TX. This is where our team works, not a service area we list from a distance. For an NRH business, that means a web design partner who can meet in person, knows the Davis Boulevard corridor by name, and has a genuine stake in the community's success."
        crumb="North Richland Hills"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your North Richland Hills Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for North Richland Hills Businesses"
        description={
          <>
            NRH customers comparison-shop across city lines. A retail business on Davis Boulevard is compared
            against Southlake Town Square. A service business in NRH competes with providers in Hurst, Euless,
            Bedford, Colleyville, and Keller. The comparison set is sophisticated and the alternatives are close. A
            site that looks like it belongs in a less demanding market costs the business before a prospect reads a
            single word.
          </>
        }
        items={[
          {
            title: 'Custom Website Design',
            description:
              'Layouts built around how NRH customers and Mid-Cities residents search, compare, and decide, reflecting the quality this market expects.',
          },
          {
            title: 'Website Development',
            description:
              'Fast, secure development with booking, payment, and CRM integrations built in where the project requires them.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              'Technical and local SEO from day one, targeting NRH and the surrounding communities: Keller, Colleyville, Hurst, Euless, Bedford, and Watauga.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a North Richland Hills Growth Plan Looks Like"
        description="Every NRH project follows four stages. Being based in NRH means the strategy work for a local business draws on direct familiarity with the Davis Boulevard corridor and the surrounding Mid-Cities competitive landscape."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description:
              'We map how NRH customers search for what you offer and what competitors in the Mid-Cities corridor are presenting. Local knowledge here is direct, not researched from afar.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description:
              'Fast, mobile-first, and structured so NRH residents and Mid-Cities customers move from search to inquiry without friction. The design reflects the quality this market expects.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description:
              'We structure content and local signals to support visibility in Keller, Colleyville, Hurst, Euless, Bedford, and Watauga, not just within NRH city limits, because your customers search across city lines.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description:
              'After launch we build through content and social support. NRH businesses with strong community ties can extend that reach digitally.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Perform in a Competitive North Richland Hills Market"
        description="NRH businesses do not compete only against other NRH businesses. Service providers from Hurst, Euless, Bedford, Colleyville, and Keller all appear in the same local search results. The site architecture and content need to support visibility across the full Mid-Cities corridor where customers are actually searching."
        mapQuery="North Richland Hills, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          "Faster mobile-first design for the Mid-Cities corridor's suburban commuter audience",
          'Search visibility across NRH and surrounding communities: Keller, Colleyville, Hurst, Euless, Bedford, Watauga',
          'A clearer path from homepage to phone call, quote, appointment, or purchase',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across North Richland Hills and DFW"
        description="Website, branding, and digital marketing work for businesses in NRH, the DFW Mid-Cities area, and across Texas. Our work here reflects genuine local familiarity because we are based in this community."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With North Richland Hills Clients"
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description:
              'We start with your customers and competitive position in the NRH and Mid-Cities market. Being based here means we bring direct local knowledge, not research from a distance.',
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description:
              'For NRH businesses competing across the Mid-Cities corridor, that often starts with local search visibility and mobile performance.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description:
              'For NRH businesses that want in-person design reviews, we are available because our office is here in the community. You do not have to schedule a remote call when meeting in person is simpler.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description:
              'After launch we track NRH and Mid-Cities traffic and adjust based on real data. Ongoing support is local support, not a help-desk relationship from another city.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why North Richland Hills Businesses Choose Massive Designs"
        items={[
          {
            title: 'Local Presence, Not Remote Service',
            description:
              'We are based at 8350 Davis Boulevard in North Richland Hills, not a regional office listing NRH as a service area. In-person collaboration, genuine local market knowledge, and a long-term relationship with a provider invested in the community.',
          },
          {
            title: 'Strategy Before Design',
            description:
              'NRH and Mid-Cities customer search behavior comes first. Design follows from that specific local context.',
          },
          {
            title: 'Design and Development Under One Team',
            description: 'The same team handles design and development. What gets designed gets built to spec.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your North Richland Hills business?"
        paragraphs={[
          <>
            If you want a local web design company in North Richland Hills that builds with SEO in mind from day
            one and that you can meet with in person, let&rsquo;s talk. Browse our past{' '}
            <Link href="/projects" className="text-primary hover:underline">
              projects
            </Link>{' '}
            first if you want to see the work.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

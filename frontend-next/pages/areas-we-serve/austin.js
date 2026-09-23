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
  { src: '/img/arias-portfolio-images/austin/optimized/austin-website-1.webp', alt: 'Austin Business Website Design' },
  { src: '/img/arias-portfolio-images/austin/optimized/austin-website-2.webp', alt: 'Austin Business Website Design 2' },
  { src: '/img/arias-portfolio-images/austin/optimized/austin-website-3.webp', alt: 'Austin Business Website Design 3' },
];

export default function Austin() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Development in Austin, TX | Massive Designs"
        description="Massive Designs builds custom, mobile-first websites for Austin businesses competing in one of the most tech-dense, digitally competitive markets in Texas, with SEO built into the architecture from the start."
        path="/areas-we-serve/austin"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/austin',
          city: 'Austin',
          pageName: 'Web Design & Development in Austin, TX | Massive Designs',
          pageDescription: 'Massive Designs builds custom, mobile-first websites for Austin businesses competing in one of the most tech-dense, digitally competitive markets in Texas, with SEO built into the architecture from the start.',
        })}
      />
      <ServiceHero
        title="Web Design & Development in Austin, TX"
        lead="Austin ranked fifth in CBRE's 2024 Scoring Tech Talent report, with a tech workforce that grew 29.1 percent between 2018 and 2023, the highest growth rate of any U.S. tech market. Apple's North Austin campus employs approximately 15,000 people, and Tesla's Gigafactory has more than 22,000. That density of technology employers has raised the bar for what Austin customers expect from any business website, not just tech companies. Massive Designs builds for Austin businesses that need to compete in that environment, custom and mobile-first, with SEO built into the site architecture from the start."
        crumb="Austin"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Austin Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for Austin Businesses"
        description={
          <>
            Austin&rsquo;s market is more varied than its tech reputation suggests. The Domain has tech offices
            alongside the retail and hospitality serving their employees. East Austin has creative agencies and
            independent restaurants with loyal followings. South Congress is boutique retail competing on visual
            identity. The Capitol district draws law firms and professional services firms. Each segment has
            different website requirements and a different competitive landscape.
          </>
        }
        items={[
          {
            title: 'Custom Website Design',
            description:
              "Layouts built around how Austin customers in your specific neighborhood and sector search and decide. Austin audiences notice visual quality, and design decisions carry more weight here than in most Texas markets.",
          },
          {
            title: 'Website Development',
            description:
              'Fast, secure development with API integrations, CRM connections, and custom functionality for businesses with specific requirements.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              'Technical and local SEO built in from day one. Austin search results are competitive across most categories, with well-funded companies competing for the same local terms as independent businesses.',
          },
        ]}
      />

      <ProcessSteps
        heading="What an Austin Growth Plan Looks Like"
        description="Every Austin project follows four stages shaped by your specific market segment, whether that is the Domain tech sector, East Austin creative, South Congress boutique, or Capitol district professional services."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description:
              "We map your Austin customers' search behavior and what competitors are presenting to those same searchers. In Austin, some competitors have dedicated SEO programs, so the strategy work upfront matters more here than in most Texas markets.",
          },
          {
            number: '02',
            title: 'Design & Development',
            description:
              'Fast, mobile-first, and organized so visitors find what they came for quickly. Austin audiences notice visual quality, and a well-designed site measurably outperforms a merely functional one here.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description:
              "Structured data, page speed, and mobile usability carry extra weight in Austin's tech-aware market. We build to those technical standards from the start.",
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description:
              "Austin's competitive categories benefit from a content program that keeps building search visibility after launch.",
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Austin Market"
        description="Austin is the most digitally competitive local market in Texas. Search results in most business categories include content from companies with in-house marketing teams and sustained SEO investment. A business competing in Austin with a site that has not been updated in three years is actively losing leads to competitors who have invested more recently."
        mapQuery="Austin, TX"
        highlightsTitle="What Changes With Us"
        highlightsDescription="These are the shifts Austin businesses notice once a project is underway."
        highlights={[
          "Faster, mobile-first design meeting the expectations of Austin's technology-aware audience",
          'Search visibility for the terms Austin customers actually use: The Domain, East Austin, South Congress, Williamson County',
          'A clearer conversion path to trial sign-up, quote request, or booked appointment',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across Austin and Texas"
        description="Website, branding, and digital marketing work for businesses across Texas, including recent design and marketing projects for businesses competing in and around the Austin market."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With Austin Clients"
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description:
              "We start with your customers and competitive position in Austin's specific market segments. Austin businesses often have clear ideas about their positioning, and the initial conversation helps translate that into design and content.",
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description:
              'For Austin businesses in competitive categories, that often starts with content quality and technical performance rather than visual redesign.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description:
              'You see real drafts early. Austin clients tend to be engaged in design reviews, and the site should reflect how the business wants to present itself in this market.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description:
              'Austin businesses in competitive search categories benefit from more frequent optimization cycles after launch than businesses in less contested markets.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Austin Businesses Choose Massive Designs"
        items={[
          {
            title: 'Strategy Before Design',
            description: "Austin's sophisticated audience rewards strategy-first design more than aesthetic-first design.",
          },
          {
            title: 'Design and Development Under One Team',
            description:
              'The same team handles design and development, preventing the translation errors that happen when agencies separate the two disciplines.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description:
              'Technical foundations supporting search visibility from day one. Falling behind technically in Austin is harder to recover from than in most other Texas markets.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your Austin business?"
        paragraphs={[
          <>
            If you want a web design company that understands Austin&rsquo;s market and builds with SEO in mind
            from day one, let&rsquo;s talk. Take a look at{' '}
            <Link href="/services" className="text-primary hover:underline">
              what we offer
            </Link>{' '}
            and we&rsquo;ll go from there.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

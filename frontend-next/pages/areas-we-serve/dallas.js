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
  { src: '/img/web-projects/optimized/web-project-7.webp', alt: "Pete's Dumpster Rentals" },
  { src: '/img/web-projects/optimized/web-project-8.webp', alt: 'Mustard Seed Yard Care' },
  { src: '/img/web-projects/optimized/web-project-9.webp', alt: 'MFM Designs' },
  { src: '/img/web-projects/optimized/web-project-10.webp', alt: 'Mental Forge AI Automation' },
  { src: '/img/web-projects/optimized/web-project-11.webp', alt: 'Jedi Atlantis' },
  { src: '/img/web-projects/optimized/web-project-12.webp', alt: 'Happy Homes LLP' },
];

export default function Dallas() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Development in Dallas, TX | Massive Designs"
        description="Massive Designs builds custom, mobile-first websites for Dallas businesses competing in one of the most Fortune-500-dense markets in Texas, with local SEO built in from the first wireframe."
        path="/areas-we-serve/dallas"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/dallas',
          city: 'Dallas',
          pageName: 'Web Design & Development in Dallas, TX | Massive Designs',
          pageDescription: 'Massive Designs builds custom, mobile-first websites for Dallas businesses competing in one of the most Fortune-500-dense markets in Texas, with local SEO built in from the first wireframe.',
        })}
      />
      <ServiceHero
        title="Web Design & Development in Dallas, TX"
        lead="Dallas has 19 Fortune 500 headquarters in its metro, and the businesses competing for customers here know it. A slow site or unclear service page doesn't just lose a visitor, it sends that prospect directly to whoever shows up next in the search results. Massive Designs builds websites for Dallas businesses that need to compete at that level: custom-designed, mobile-first, and built with local SEO from the first wireframe."
        crumb="Dallas"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Dallas Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for Dallas Businesses"
        description={
          <>
            Dallas businesses come to us at different stages. Some have strong offline reputations but websites that
            generate no inquiries. Others are newer companies trying to compete in a market where competitors have
            invested seriously online. The shared problem is that underinvestment in your site is visible to every
            prospect who compares you to a competitor.
          </>
        }
        items={[
          {
            title: 'Custom Website Design',
            description:
              'Layouts and conversion paths designed around how Dallas customers in your specific sector search and decide, not a template built for the average business.',
          },
          {
            title: 'Website Development',
            description:
              'Fast, secure development with CRM connections, booking systems, and payment integrations built in where the project needs them.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              'Technical and local SEO built into the site from day one. Dallas search results are competitive across virtually every commercial category.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a Dallas Growth Plan Looks Like"
        description="Every Dallas project follows the same four-stage process, adjusted for your industry and the part of the city you serve."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description: 'We map how Dallas customers in your category search and evaluate options before any design work begins. That research shapes the site architecture.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description: 'Fast, mobile-first, and organized so visitors get to the right page in a click or two. Dallas audiences judge credibility quickly and the design has to earn that.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description: 'Technical and on-page SEO go in from launch, targeted at the specific terms Dallas customers use. National brands compete here, so precision matters.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description: 'After launch we continue through content, branding refinements, and social support.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Dallas Market"
        description="National brands, regional agencies with SEO programs, and franchise operators all appear in the same Dallas local search results as independently owned businesses. The businesses holding their positions have faster sites, cleaner architecture, and stronger on-page content."
        mapQuery="Dallas, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Faster load times and mobile-first design that reduce bounce from slow-loading pages',
          'Stronger visibility for the search terms Dallas customers actually use, whether in Uptown, Oak Lawn, Deep Ellum, or Las Colinas',
          'A clearer path from homepage to phone call, quote request, or booked meeting',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across Dallas and Texas"
        description="Website, branding, and digital marketing work for businesses across Texas, including the Dallas-Fort Worth area."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With Dallas Clients"
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description: 'We start with your customers, your competitive position in Dallas, and what your current site is or is not doing, including which neighborhoods and search categories matter most.',
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description: 'We identify what is actually costing the business inquiries and agree on what gets addressed first.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description: 'You see real drafts and site structure early, not a single reveal at the end. Regular check-ins and deliverables at each stage.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description: 'After launch we track how Dallas traffic actually behaves and adjust based on real data. Optimization continues after the site goes live.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Dallas Businesses Choose Massive Designs"
        items={[
          {
            title: 'Strategy Before Design',
            description: 'Business goals and customer search behavior come first. Design follows from that.',
          },
          {
            title: 'Design and Development Under One Team',
            description: 'The same team handles design and development. What gets designed gets built to spec with no handoff errors.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description: 'Technical foundations that support search visibility from launch, not rework required months later.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your Dallas business?"
        paragraphs={[
          <>
            If you want a web design company in Dallas that builds with SEO in mind from day one, let&rsquo;s talk.
            Take a look at our full{' '}
            <Link href="/services" className="text-primary hover:underline">
              range of services
            </Link>{' '}
            and let&rsquo;s go from there.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

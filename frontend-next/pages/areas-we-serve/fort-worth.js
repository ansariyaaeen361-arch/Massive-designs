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
  { src: '/img/web-projects/optimized/web-project-20.webp', alt: 'MentalForge Media' },
  { src: '/img/web-projects/optimized/web-project-21.webp', alt: 'TopFreeTools' },
  { src: '/img/web-projects/optimized/web-project-22.webp', alt: 'VertexTechHub' },
  { src: '/img/web-projects/optimized/web-project-23.webp', alt: 'SaaSComparely' },
];

export default function FortWorth() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design Company Fort Worth TX | Massive Designs"
        description="Need a web design company in Fort Worth, TX? Massive Designs builds professional, SEO-friendly websites designed to improve online visibility and help local businesses generate leads."
        path="/areas-we-serve/fort-worth"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/fort-worth',
          city: 'Fort Worth',
          pageName: 'Web Design Company Fort Worth TX | Massive Designs',
          pageDescription: 'Need a web design company in Fort Worth, TX? Massive Designs builds professional, SEO-friendly websites designed to improve online visibility and help local businesses generate leads.',
        })}
      />
      <ServiceHero
        title="Web Design Services in Fort Worth, TX"
        lead="Fort Worth now ranks as the 13th largest city in the country, growing faster than most Texas metros while marketing competition here lags behind. That gap is where we help Fort Worth businesses move first."
        crumb="Fort Worth"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="A City Growing Faster Than Its Reputation Suggests"
        description={
          <>
            Fort Worth doesn&rsquo;t get talked about the way Dallas or Houston do, which is a little strange
            considering it&rsquo;s now the 13th largest city in the country and closing in on a million residents.
            Aerospace manufacturers, logistics companies, and a steady wave of corporate relocations have reshaped
            the local economy over the past few years, even as the city holds onto its Stockyards-era identity as a
            place where business still gets done on a handshake. We build for that mix: the aerospace supplier who
            needs to look established, and the small retailer counting on foot traffic and word of mouth. Our
            approach to{' '}
            <Link href="/seo-services" className="text-primary hover:underline">
              search visibility
            </Link>{' '}
            reflects that same range, tuned to a market where the competition is real but nowhere near as saturated
            as it is thirty miles east.
          </>
        }
        items={[
          {
            title: 'Sites Built to Keep Up With Growth',
            description:
              'As Fort Worth adds new residents and new employers every quarter, your website needs to compete with businesses moving in from bigger markets, not just the shop next door.',
          },
          {
            title: "Search Visibility While the Market's Still Open",
            description:
              "Fort Worth's search competition hasn't caught up to its population growth yet, which means there's real opportunity for businesses that show up early and stay consistent.",
          },
          {
            title: 'A Brand That Fits a City in Transition',
            description:
              "From Stockyards-heritage names to new aerospace suppliers, we build identities that make sense for where Fort Worth is headed, not just where it's been.",
          },
        ]}
      />

      <ProcessSteps
        heading="The Shape of a Fort Worth Strategy"
        description="Fort Worth is changing quickly enough that a plan built for it needs a different starting point than one built for a market that's already settled."
        steps={[
          {
            number: '01',
            title: 'Audience & Competitor Mapping',
            description:
              "We look at who's actually moving into your market and who's already serving them, since the competitive landscape here shifts faster than in most cities this size.",
          },
          {
            number: '02',
            title: 'Search Positioning',
            description:
              "We target the terms your Fort Worth customers are searching right now, before larger out-of-town competitors notice the opportunity.",
          },
          {
            number: '03',
            title: 'Visual Identity',
            description:
              'Your brand gets built to earn trust with both longtime Fort Worth clients and the newer companies relocating here.',
          },
          {
            number: '04',
            title: 'Ongoing Content',
            description: 'Regular content keeps your business visible as new residents and new companies keep arriving month after month.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Designed for Momentum, Not Just Day One"
        description="A website that looked competitive two years ago might already be behind in a city adding this many new businesses every quarter."
        mapQuery="Fort Worth, TX"
        highlightsTitle="The Difference in Practice"
        highlightsDescription="Here's what typically shifts for a Fort Worth client within the first few months."
        highlights={[
          'A homepage that explains what you do within seconds, not paragraphs',
          "Visibility for searches your competitors haven't claimed yet",
          'A steadier flow of inquiries instead of relying on referrals alone',
        ]}
      />

      <PortfolioHoverGrid
        heading="Work From Around Fort Worth and Tarrant County"
        description="Examples of the design and marketing work we've done for businesses growing alongside Fort Worth itself."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="Working With a Fort Worth Business, Step by Step"
        steps={[
          {
            number: '01',
            title: 'Learn the Landscape',
            description: 'We spend real time understanding your customers and who else in Fort Worth is chasing them before recommending anything.',
          },
          {
            number: '02',
            title: 'Set the Priorities Together',
            description: "You weigh in on what matters most, whether that's visibility, leads, or simply catching up to where your industry already is online.",
          },
          {
            number: '03',
            title: 'Show the Work as It Happens',
            description: 'Nothing sits hidden until a big reveal. You see pages and drafts as they come together.',
          },
          {
            number: '04',
            title: 'Keep Adjusting After Launch',
            description: 'Fort Worth keeps changing, so we keep checking whether the strategy still fits six months in, not just at the start.',
          },
        ]}
      />

      <FeatureGrid
        heading="What Working With Us Actually Looks Like"
        items={[
          {
            title: 'Priced for a Growing Business, Not a Fortune 500',
            description:
              "Fort Worth's cost of doing business runs lower than Dallas or Houston, and we think your marketing budget should reflect that same advantage.",
          },
          {
            title: 'Straightforward, No Middlemen',
            description: 'You deal directly with the people doing the work, not an account manager relaying updates from somewhere else.',
          },
          {
            title: 'Familiar With Where the City Is Headed',
            description:
              "We pay attention to what's actually moving into Fort Worth, aerospace, manufacturing, logistics, so your strategy accounts for who's arriving, not just who's already here.",
          },
        ]}
      />

      <ServiceCta
        heading="Let's Build Something for Where Fort Worth Is Going"
        paragraphs={[
          <>
            Fort Worth isn&rsquo;t waiting around, and your marketing shouldn&rsquo;t either. Take a look at{' '}
            <Link href="/services" className="text-primary hover:underline">
              everything we do
            </Link>{' '}
            and let&rsquo;s figure out where to start for your business specifically.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

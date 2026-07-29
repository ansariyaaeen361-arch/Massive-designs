import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import AreaMapHighlight from '../../components/service-page/AreaMapHighlight';
import PortfolioGrid from '../../components/service-page/PortfolioGrid';
import ServiceCta from '../../components/service-page/ServiceCta';
import OrderModal from '../../components/forms/OrderModal';
import { brand } from '../../lib/brand';

import site1 from '../../assets/img/services/webdesign-portfolio/site1.webp';
import site2 from '../../assets/img/services/webdesign-portfolio/site2.webp';
import site3 from '../../assets/img/services/webdesign-portfolio/site3.webp';
import site4 from '../../assets/img/services/webdesign-portfolio/site4.webp';
import site5 from '../../assets/img/services/webdesign-portfolio/site5.webp';
import site6 from '../../assets/img/services/webdesign-portfolio/site6.webp';
import site7 from '../../assets/img/services/webdesign-portfolio/site7.webp';
import site8 from '../../assets/img/services/webdesign-portfolio/site8.webp';

const portfolioItems = [
  { src: site1, alt: 'Mental Forge', href: 'https://mentalforge.ai/' },
  { src: site2, alt: 'Leanops AI', href: 'https://abc.massive-designs.com/' },
  { src: site3, alt: 'Nickolas Shymar', href: 'https://nickolasshymar.com/' },
  { src: site4, alt: 'Enhanced Bears', href: 'https://enhancedbears.massive-designs.com/' },
  { src: site5, alt: 'Crazy Strong Sarms', href: 'https://crazystrongsarms.massive-designs.com/' },
  { src: site6, alt: 'Kendras Meals LLC', href: 'https://kendrasmealsllc.com/' },
  { src: site7, alt: 'SRrealty Brokerage', href: 'https://srrealtybrokerage.com/' },
  { src: site8, alt: 'Bonney Building', href: 'https://bonneybuilding.com/' },
];

export default function SanAntonio() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Digital Marketing Agency in San Antonio, TX | Massive Designs"
        description="Massive Designs helps San Antonio businesses claim the search visibility their market size deserves, in one of Texas's most overlooked digital landscapes."
        path="/areas-we-serve/san-antonio"
      />
      <ServiceHero
        title="Web Design & Digital Marketing Services San Antonio, TX"
        lead="San Antonio is the seventh largest US city, yet it draws far less marketing attention than Austin or Dallas. We see that as an opportunity: visibility for San Antonio businesses willing to claim it first."
        crumb="San Antonio"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="A Major City That Marketing Has Underrated"
        description={
          <>
            San Antonio rarely gets mentioned in the same breath as Austin or Dallas, even though more people live
            here than in either one. The city runs on a different mix of industries than its neighbors, anchored by
            the military, a substantial healthcare and bioscience sector, and a tourism economy built around the
            Alamo and the River Walk that draws visitors year-round. Add a population that&rsquo;s majority Hispanic
            and largely bilingual, and generic, one-size-fits-all messaging leaves real ground on the table. We
            treat that combination as an opportunity rather than a complication, and it shapes how we handle{' '}
            <Link to="/seo-services" className="text-primary hover:underline">
              search visibility
            </Link>{' '}
            here specifically, since the terms worth targeting in San Antonio aren&rsquo;t always the ones that work
            elsewhere in the state.
          </>
        }
        items={[
          {
            title: 'Websites Built Around Two Audiences at Once',
            description:
              "A large share of San Antonio's market speaks Spanish at home, so we design and write for that reality instead of defaulting to English-only assumptions.",
          },
          {
            title: 'An Opportunity Most Agencies Overlook',
            description:
              "National and even Texas-based agencies chase Austin and Dallas first, which leaves San Antonio's search results noticeably less crowded than a city this size would suggest.",
          },
          {
            title: 'Branding Rooted in a Specific Local Identity',
            description:
              'From Alamo Heights to the Medical Center area, we build identities around what actually makes San Antonio distinct, not an import of what works in a different part of Texas.',
          },
        ]}
      />

      <ProcessSteps
        heading="Where a San Antonio Strategy Actually Starts"
        description="San Antonio's economy runs on different engines than the rest of Texas, so the research for a project here starts from a different place too."
        steps={[
          {
            number: '01',
            title: 'Market & Language Research',
            description: 'We look at who your customers actually are, including whether Spanish-language search and content should be part of the strategy from day one.',
          },
          {
            number: '02',
            title: 'Search Opportunity Mapping',
            description: "We identify where the gap between San Antonio's population and the attention it gets from most marketers creates room to move up in results.",
          },
          {
            number: '03',
            title: 'Identity & Messaging',
            description: 'We shape your identity around what actually resonates locally, rather than a statewide message that happens to mention San Antonio.',
          },
          {
            number: '04',
            title: 'Content Calendar',
            description: 'Ongoing content keeps you visible to both English- and Spanish-speaking segments of your audience over time.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Reaching an Audience Other Agencies Simplify"
        description="Treating San Antonio as one uniform audience means missing a meaningful share of the market, so we don't approach it that way."
        mapQuery="San Antonio, TX"
        highlightsTitle="Signs It's Working"
        highlightsDescription="Clients typically notice these shifts within the first couple of months."
        highlights={[
          'Search visibility in a market with noticeably less digital competition',
          'Messaging that speaks to both English- and Spanish-speaking customers',
          'A brand that reflects San Antonio specifically, not Texas in general',
        ]}
      />

      <PortfolioGrid
        heading="Projects We've Built for San Antonio Businesses"
        description="Examples of websites, brand identities, and campaigns we've delivered for San Antonio clients."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="Our Process for San Antonio Clients"
        steps={[
          {
            number: '01',
            title: 'Start With Your Actual Customers',
            description: "We find out who's buying from you now and who you're missing before writing a single page of copy.",
          },
          {
            number: '02',
            title: 'Decide What Comes First',
            description: "Together we agree on the highest-impact fix, whether that's a slow website, missing local SEO, or a brand that doesn't match your customer base.",
          },
          {
            number: '03',
            title: 'Share Progress as We Build',
            description: 'You see drafts and structure throughout the project instead of a single reveal at the finish line.',
          },
          {
            number: '04',
            title: "Confirm It's Working",
            description: "Once launched, we check actual performance data against the plan and adjust anything that isn't delivering.",
          },
        ]}
      />

      <FeatureGrid
        heading="What San Antonio Clients Get That Others Miss"
        items={[
          {
            title: "We Don't Treat This Market as an Extension of Austin or Dallas",
            description:
              "San Antonio often gets folded into a broader statewide strategy by agencies based elsewhere. We build for this market on its own terms, language included.",
          },
          {
            title: 'Fewer Layers Between You and the Work',
            description: "You talk to the person actually building your site or writing your content, not an intermediary passing notes back and forth.",
          },
          {
            title: 'Realistic About the Opportunity Here',
            description: "Less digital competition doesn't mean no competition. We're upfront about what's genuinely achievable and on what timeline.",
          },
        ]}
      />

      <ServiceCta
        heading="Let's Put San Antonio's Opportunity to Work"
        paragraphs={[
          <>
            There&rsquo;s real room to build visibility here before your competitors catch up to it. Look through
            our full{' '}
            <Link to="/services" className="text-primary hover:underline">
              services
            </Link>{' '}
            and let&rsquo;s map out where to start.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

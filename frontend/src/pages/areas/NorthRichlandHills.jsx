import { useState } from 'react';
import { Link } from 'react-router-dom';
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

import web18 from '../../assets/img/web-projects/optimized/web-project-18.webp';
import web9 from '../../assets/img/web-projects/optimized/web-project-9.webp';
import web10 from '../../assets/img/web-projects/optimized/web-project-10.webp';
import web24 from '../../assets/img/web-projects/optimized/web-project-24.webp';

const portfolioItems = [
  { src: web18, alt: 'Carpet Repair Nevada' },
  { src: web9, alt: 'MFM Designs' },
  { src: web10, alt: 'Mental Forge AI Automation' },
  { src: web24, alt: 'FitRoutine' },
];

export default function NorthRichlandHills() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Digital Marketing Services North Richland Hills, TX | Massive Designs"
        description="Our office sits a few minutes from Iron Horse Boulevard, right in the middle of North Richland Hills. That proximity shapes how we build sites and handle local search for businesses across the city."
        path="/areas-we-serve/north-richland-hills/"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/north-richland-hills',
          city: 'North Richland Hills',
          pageName: 'Web Design & Digital Marketing Services North Richland Hills, TX | Massive Designs',
          pageDescription: 'Our office sits a few minutes from Iron Horse Boulevard, right in the middle of North Richland Hills. That proximity shapes how we build sites and handle local search for businesses across the city.',
        })}
      />
      <ServiceHero
        title="Web Design & Digital Marketing Services North Richland Hills, TX"
        lead="Our office sits a few minutes from Iron Horse Boulevard, right in the middle of North Richland Hills. That proximity shapes how we build sites and handle local search for businesses across the city."
        crumb="North Richland Hills"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="A digital marketing team that actually lives in North Richland Hills"
        description={
          <>
            North Richland Hills is where we drive to work every morning, not a project we fly in for. Roughly
            1,200 businesses now operate inside the city limits, and new ones pick up their certificate of
            occupancy on a regular basis. That kind of growth means plenty of new websites competing for the same
            searches within a few square miles. We help shops, contractors, clinics and startups from Boulevard 26
            to the Iron Horse and Smithfield rail stops get found before a customer decides to drive toward Fort
            Worth or Southlake instead.
          </>
        }
        items={[
          {
            title: 'Sites that load before someone taps away',
            description:
              'New storefronts and offices are opening around Boulevard 26 and Grapevine Highway on a regular basis. We build mobile-first sites fast enough to beat that competition, and simple enough for you to update yourself once we hand it over.',
          },
          {
            title: 'Found by neighbors before they drive to Southlake',
            description:
              'Local searches decide who gets the first call. We tune your Google Business profile, service pages and map listings so North Richland Hills customers find you before they widen the search to a bigger, pricier suburb.',
          },
          {
            title: "A brand that sounds like this city, not a template",
            description:
              "Your logo, site copy and social posts should read like a business actually run from here, not boilerplate pulled from an agency's back catalog. We build voice and visuals around what makes your business specific.",
          },
        ]}
      />

      <ProcessSteps
        heading="How a North Richland Hills project actually moves"
        description="No two businesses here are chasing the same customer, so we start by mapping what yours actually searches for before a single page gets designed."
        steps={[
          {
            number: '01',
            title: 'Find the real search terms',
            description:
              'We look at what NRH customers actually type into Google, not a generic keyword list, before deciding on site structure or content.',
          },
          {
            number: '02',
            title: 'Build around local behavior',
            description:
              'Pages, navigation and calls to action get built around how people here shop, whether that means a same-day service call or a slower buying decision.',
          },
          {
            number: '03',
            title: 'Layer in trust signals',
            description:
              'Reviews, licensing, service areas and local photography go in during the build, not bolted on after launch, so the site reads as credible on day one.',
          },
          {
            number: '04',
            title: 'Keep publishing after launch',
            description:
              "Rankings move when new content keeps landing. We keep adding pages, posts and local updates well after the site goes live, not just for the first month.",
          },
        ]}
      />

      <AreaMapHighlight
        heading="What actually changes on your website"
        description="Most of the sites we inherit in North Richland Hills load slowly on phones and rank for almost nothing local. We fix the technical foundation first, then layer in the content and local signals that get you found."
        mapQuery="North Richland Hills, TX"
        highlightsTitle="What you'll notice first"
        highlights={[
          'Pages that load in under three seconds',
          'Map pack visibility for NRH searches',
          'Leads from people ready to buy',
        ]}
      />

      <PortfolioHoverGrid
        heading="Recent builds around North Richland Hills and Tarrant County"
        description="A sample of the design, SEO and content work we've shipped for businesses in this part of DFW, most of it within a short drive of our own office."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With North Richland Hills Clients"
        steps={[
          {
            number: '01',
            title: 'Understand Your Business',
            description:
              "We learn what you actually sell and who's already buying it locally before recommending anything, whether that's a service call near Boulevard 26 or foot traffic off Grapevine Highway.",
          },
          {
            number: '02',
            title: 'Prioritize the Gaps',
            description:
              'We identify which pages or search terms are sending customers toward Southlake or Fort Worth instead of you, then agree on what gets fixed first.',
          },
          {
            number: '03',
            title: 'Build and Collaborate',
            description: "You see real drafts as we go, and since our office is a few minutes away, that conversation can happen in person, not just over email.",
          },
          {
            number: '04',
            title: 'Track and Adjust',
            description: 'We watch how your North Richland Hills traffic behaves specifically, then adjust based on what the data actually shows.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why North Richland Hills Businesses Choose Massive Designs"
        items={[
          {
            title: 'An Agency You Can Actually Drive To',
            description:
              "We're not a remote team guessing at what this city needs. Our office sits minutes from Iron Horse Boulevard, so meetings happen in person when you want them to.",
          },
          {
            title: 'One Team, Every Step',
            description:
              'The same people who design your site handle your SEO, your content, and your brand, so nothing gets lost in translation.',
          },
          {
            title: 'Built for a City Still Filling In',
            description:
              "With roughly 1,200 businesses already operating here and new ones opening regularly, we build sites and SEO strategy that account for how fast this market is moving.",
          },
        ]}
      />

      <ServiceCta
        heading="Ready to see what a North Richland Hills site should actually look like?"
        paragraphs={[
          <>
            Tell us what isn&rsquo;t working on your current site, and we&rsquo;ll walk you through what a rebuild
            looks like before you commit to anything. Browse our past{' '}
            <Link to="/projects" className="text-primary hover:underline">
              projects
            </Link>{' '}
            first if you want to see the work.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

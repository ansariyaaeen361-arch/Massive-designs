import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import AreaMapHighlight from '../../components/service-page/AreaMapHighlight';
import PortfolioHoverGrid from '../../components/service-page/PortfolioHoverGrid';
import ServiceCta from '../../components/service-page/ServiceCta';
import OrderModal from '../../components/forms/OrderModal';
import { brand } from '../../lib/brand';

import web7 from '../../assets/img/web-projects/optimized/web-project-7.webp';
import web8 from '../../assets/img/web-projects/optimized/web-project-8.webp';
import web9 from '../../assets/img/web-projects/optimized/web-project-9.webp';
import web10 from '../../assets/img/web-projects/optimized/web-project-10.webp';
import web11 from '../../assets/img/web-projects/optimized/web-project-11.webp';
import web12 from '../../assets/img/web-projects/optimized/web-project-12.webp';

const portfolioItems = [
  { src: web7, alt: "Pete's Dumpster Rentals" },
  { src: web8, alt: 'Mustard Seed Yard Care' },
  { src: web9, alt: 'MFM Designs' },
  { src: web10, alt: 'Mental Forge AI Automation' },
  { src: web11, alt: 'Jedi Atlantis' },
  { src: web12, alt: 'Happy Homes LLP' },
];

export default function Dallas() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Digital Marketing Agency in Dallas, TX | Massive Designs"
        description="Massive Designs is a web design and digital marketing agency serving Dallas, TX with SEO, branding, and content built for the local market."
        path="/areas-we-serve/dallas"
      />
      <ServiceHero
        title="Web Design & Digital Marketing Services Dallas, TX"
        lead="Dallas is one of Texas's most competitive marketing environments, which means generic websites and generic SEO simply don't cut through here. Our strategies are built for that pressure, turning Dallas searches into steady, measurable leads."
        crumb="Dallas"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="Digital marketing built for a crowded Dallas market"
        description={
          <>
            Dallas is one of the toughest markets in Texas to stand out in, so generic marketing doesn&rsquo;t hold
            up here. We work with small and growing businesses across the DFW metroplex, from Uptown startups to
            established firms out toward Las Colinas, building sites and campaigns around how people actually
            search rather than what looks good in a pitch deck. Every project starts with strategy and{' '}
            <Link to="/seo-services" className="text-primary hover:underline">
              SEO
            </Link>
            , not a template, so your site earns trust fast and turns visits into real inquiries.
          </>
        }
        items={[
          {
            title: 'Website Design & Development',
            description:
              'We design fast, conversion-focused sites for Dallas businesses that need to look sharp and load faster than the competition.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              "Our SEO work is built to rank for the searches that actually bring in Dallas customers, not just traffic for traffic's sake.",
          },
          {
            title: 'Branding & Content',
            description:
              'From logos to landing pages, we give Dallas brands a consistent voice across every channel they show up on.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a Dallas growth plan looks like"
        description="Every Dallas project runs through the same four stages, adjusted to your industry and whoever you're competing against locally."
        steps={[
          {
            number: '01',
            title: 'Website Strategy & Design',
            description: 'We map your site around what Dallas customers actually search for first, then design around that.',
          },
          {
            number: '02',
            title: 'SEO & Local Search',
            description: 'Technical SEO, on-page work, and local search signals working together so you show up when Dallas buyers are ready.',
          },
          {
            number: '03',
            title: 'Branding & Identity',
            description: 'Logo, messaging, and visual identity built to hold up in a market where first impressions decide a lot.',
          },
          {
            number: '04',
            title: 'Content & Social Media',
            description: 'Blog posts, service pages, and social content written for a Dallas audience, not recycled Texas boilerplate.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to perform in a crowded Dallas market"
        description="We turn slow, generic sites into fast, focused ones that convert the traffic Dallas already sends you."
        mapQuery="Dallas, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Faster load times and cleaner design',
          'Rankings for the terms that matter locally',
          'More qualified inquiries from your website',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our work across Dallas and DFW"
        description="A look at the kind of design, branding, and marketing work we've built for businesses across the Dallas–Fort Worth area."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How we work with Dallas clients"
        steps={[
          {
            number: '01',
            title: 'Understand Your Market',
            description: "We learn who your Dallas customers are, what they're searching for, and where your current site or strategy is falling short.",
          },
          {
            number: '02',
            title: 'Prioritize the Gaps',
            description: 'We flag the pages, messaging, or SEO gaps costing you the most, then agree on what gets fixed first.',
          },
          {
            number: '03',
            title: 'Build and Collaborate',
            description: "We share drafts and structure early, so you're reviewing real work instead of guessing where things stand.",
          },
          {
            number: '04',
            title: 'Track and Adjust',
            description: 'We watch how your Dallas traffic actually behaves, then adjust strategy off real numbers instead of assumptions.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Dallas businesses choose Massive Designs"
        items={[
          {
            title: 'Search-First Approach',
            description: 'Every page is built around what Dallas customers are typing into Google, not what sounds good in a meeting.',
          },
          {
            title: 'One Team, Start to Finish',
            description: 'The same team handling your design also handles your SEO and content, so nothing gets lost between departments.',
          },
          {
            title: 'Local Market Understanding',
            description: 'We know what works in Dallas and what works two hours away, and we build accordingly.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to grow your Dallas business?"
        paragraphs={[
          <>
            If you&rsquo;re looking for a{' '}
            <Link to="/services" className="text-primary hover:underline">
              web design and digital marketing
            </Link>{' '}
            agency in Dallas that understands the local market and builds with SEO in mind from day one, let&rsquo;s
            talk about what that could look like for you.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

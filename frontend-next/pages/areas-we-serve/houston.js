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
  { src: '/img/web-projects/optimized/web-project-13.webp', alt: 'Global Desk News' },
  { src: '/img/web-projects/optimized/web-project-14.webp', alt: 'Elevate VR' },
  { src: '/img/web-projects/optimized/web-project-15.webp', alt: 'Carpet Repair Nevada' },
  { src: '/img/web-projects/optimized/web-project-16.webp', alt: 'Baldovinos General Construction' },
  { src: '/img/web-projects/optimized/web-project-17.webp', alt: 'Dana McGuffin CPA' },
  { src: '/img/web-projects/optimized/web-project-19.webp', alt: 'AtlasLearners', href: 'https://atlaslearners.com/' },
];

export default function Houston() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design Company Houston TX | Massive Designs"
        description="Massive Designs is a web design company serving Houston, TX, creating modern, SEO-friendly websites that help businesses strengthen their online presence and attract customers."
        path="/areas-we-serve/houston"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/houston',
          city: 'Houston',
          pageName: 'Web Design Company Houston TX | Massive Designs',
          pageDescription: 'Massive Designs is a web design company serving Houston, TX, creating modern, SEO-friendly websites that help businesses strengthen their online presence and attract customers.',
        })}
      />
      <ServiceHero
        title="Web Design Services in Houston, TX"
        lead="Houston spans energy, healthcare, logistics, and retail all at once, so no single marketing template works citywide. We build websites and digital marketing strategies tailored to whichever part of Houston's economy your business competes in."
        crumb="Houston"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="Built for the Size and Range of Houston"
        description={
          <>
            Houston isn&rsquo;t just big, it&rsquo;s a collection of different economies running at the same time.
            Energy companies in the Corridor, hospital systems around the Medical Center, logistics operations tied
            to the Port, and a retail and restaurant scene that serves one of the most diverse populations in the
            country. A marketing plan that works for one of those doesn&rsquo;t automatically work for the rest,
            which is why our process starts with figuring out which part of Houston&rsquo;s economy you&rsquo;re
            actually in before we touch design or copy. We handle{' '}
            <Link href="/seo-services" className="text-primary hover:underline">
              SEO
            </Link>{' '}
            the same way, treating a Medical Center practice and an energy services company as two different
            ranking problems, because they are.
          </>
        }
        items={[
          {
            title: 'Website Design & Development',
            description:
              "Houston's business mix runs from energy startups to family medical practices, so we design around who's actually visiting your site, not a generic Texas template.",
          },
          {
            title: 'SEO & Local Search',
            description:
              'Ranking in Houston means competing at a different scale than most Texas cities. Our SEO work is built around that, not scaled down from a smaller market.',
          },
          {
            title: 'Branding & Content',
            description:
              'A brand voice that reads clearly whether your customer is downtown, out in Katy, or across the bay in Clear Lake.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a Houston Growth Plan Looks Like"
        description="Houston's economy doesn't move as one block, so neither does our process."
        steps={[
          {
            number: '01',
            title: 'Website Strategy & Design',
            description:
              "We figure out which part of Houston's economy you're actually selling into first, then build the site around that specific audience.",
          },
          {
            number: '02',
            title: 'SEO & Local Search',
            description:
              'Search competition in Houston shifts by neighborhood and industry, so keyword strategy gets built around your specific market instead of one citywide playbook.',
          },
          {
            number: '03',
            title: 'Branding & Identity',
            description: 'Visual identity that holds up whether your customer is in the Energy Corridor or out near Sugar Land.',
          },
          {
            number: '04',
            title: 'Content & Social Media',
            description: "Content written with Houston's genuinely diverse audience in mind, not copy that assumes one kind of reader.",
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built for a Market That Doesn't Sit Still"
        description="Houston moves fast and covers a lot of ground. We build sites that keep pace with both."
        mapQuery="Houston, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Messaging shaped around your specific industry',
          "SEO strategy that accounts for Houston's scale",
          'A site that holds up across every device your customers use',
        ]}
      />

      <PortfolioHoverGrid
        heading="Our Work Across Houston and Southeast Texas"
        description="A look at the kind of design, branding, and marketing work we've built for businesses operating across Houston's range of industries."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="How We Work With Houston Clients"
        steps={[
          {
            number: '01',
            title: 'Understand Your Industry',
            description: "We learn which part of Houston's economy you compete in first, since that changes nearly everything downstream.",
          },
          {
            number: '02',
            title: 'Prioritize the Gaps',
            description: 'We identify which pages or search terms are costing you the most business, then agree on what gets fixed first.',
          },
          {
            number: '03',
            title: 'Build and Collaborate',
            description: 'You see real drafts as we go instead of one reveal at the end.',
          },
          {
            number: '04',
            title: 'Track and Adjust',
            description: 'We watch how your Houston traffic behaves specifically, then adjust based on what the data actually shows.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Houston Businesses Choose Massive Designs"
        items={[
          {
            title: 'Industry-Aware Strategy',
            description:
              "We don't run the same plan for an energy company that we'd run for a medical practice, and you shouldn't want us to.",
          },
          {
            title: 'One Team, Every Step',
            description:
              'The same people who design your site handle your SEO, your content, and your brand, so nothing gets lost in translation.',
          },
          {
            title: "Built for Houston's Scale",
            description: "Houston isn't a small market, and our research, SEO, and design work all reflect that from day one.",
          },
        ]}
      />

      <ServiceCta
        heading="Ready to Grow Your Houston Business?"
        paragraphs={[
          <>
            Whether you&rsquo;re in the Energy Corridor, the Medical Center, or somewhere else across the city, we
            build web design and digital marketing strategies suited to your specific corner of Houston. Take a
            look at our full{' '}
            <Link href="/services" className="text-primary hover:underline">
              range of services
            </Link>{' '}
            to see what&rsquo;s included, then let&rsquo;s talk about your project.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

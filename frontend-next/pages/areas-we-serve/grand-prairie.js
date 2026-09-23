import { useState } from 'react';
import Link from 'next/link';
import { HiChevronDown } from 'react-icons/hi';
import Seo from '../../components/layout/Seo';
import { SITE_URL } from '../../lib/schema';
import Reveal from '../../components/motion/Reveal';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import AreaMapHighlight from '../../components/service-page/AreaMapHighlight';
import PortfolioHoverGrid from '../../components/service-page/PortfolioHoverGrid';
import ServiceCta from '../../components/service-page/ServiceCta';
import OrderModal from '../../components/forms/OrderModal';
import { brand } from '../../lib/brand';

const portfolioItems = [
  { src: '/img/arias-portfolio-images/grand-prairie/optimized/grand-prairie-website-1.webp', alt: 'Grand Prairie Business Website Design' },
  { src: '/img/arias-portfolio-images/grand-prairie/optimized/grand-prairie-website-2.webp', alt: 'Grand Prairie Business Website Design 2' },
  { src: '/img/arias-portfolio-images/grand-prairie/optimized/grand-prairie-website-3.webp', alt: 'Grand Prairie Business Website Design 3' },
];

const faqs = [
  {
    q: 'How much does a business website cost in Grand Prairie?',
    a: 'It depends on the scope of the project. A modernization of an existing site typically costs less than a full custom build with ecommerce. We provide a clear quote after understanding what you need.',
  },
  {
    q: 'How long does a redesign take?',
    a: 'Most redesigns take a few weeks from approved direction to launch, depending on the size of the site and how much content needs to be reworked.',
  },
  {
    q: 'Can you modernize an existing website instead of starting over?',
    a: "Yes. A lot of our Grand Prairie projects are modernizations rather than full rebuilds, especially when the site's content and structure are mostly sound.",
  },
  {
    q: 'Do you build mobile-friendly websites?',
    a: "Every site is rebuilt or designed mobile-first, since that's typically where most local traffic starts.",
  },
  {
    q: 'Is SEO included with web design?',
    a: 'Yes. Local SEO and technical SEO are part of the same project, not a separate add-on after launch.',
  },
  {
    q: 'Can you build an e-commerce website?',
    a: 'Yes, including product structure, checkout, and secure payment integration.',
  },
  {
    q: 'Do you work with small, local businesses?',
    a: 'Yes. Most of our Grand Prairie work is with small and mid-sized local businesses looking to modernize an outdated site.',
  },
  {
    q: 'Do you provide support after the site launches?',
    a: 'Yes. We offer ongoing support and can continue with SEO, content, and social media once the site is live.',
  },
];

function GrandPrairieFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">Frequently Asked Questions About Web Design in Grand Prairie</h2>
        </Reveal>

        <Reveal delay={0.1} as="div" className="mt-10 flex flex-col">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className={`text-base sm:text-lg ${isOpen ? 'text-primary' : 'text-white'}`}>{item.q}</span>
                  <HiChevronDown
                    className={`shrink-0 text-lg transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : 'text-white/40'
                    }`}
                  />
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-white/50">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export default function GrandPrairie() {
  const [contactOpen, setContactOpen] = useState(false);
  const slug = 'areas-we-serve/grand-prairie';

  return (
    <>
      <Seo
        title="Web Design Company in Grand Prairie TX"
        description="Massive Designs provides custom web design, development, SEO, branding, and digital marketing services for businesses in Grand Prairie, TX."
        path={`/${slug}`}
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${slug}/#webpage`,
            url: `${SITE_URL}/${slug}/`,
            name: 'Web Design Company in Grand Prairie, TX | Massive Designs',
            headline: 'Web Design & Development in Grand Prairie, TX',
            description:
              'Massive Designs provides custom web design, website development, SEO, branding, and digital marketing services for businesses in Grand Prairie, TX.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/${slug}/#service` },
            breadcrumb: { '@id': `${SITE_URL}/${slug}/#breadcrumb` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'Service',
            '@id': `${SITE_URL}/${slug}/#service`,
            name: 'Web Design & Development in Grand Prairie, TX',
            serviceType: ['Web Design', 'Website Design', 'Website Development', 'Website Redesign', 'E-commerce Web Design'],
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'City', name: 'Grand Prairie', containedInPlace: { '@type': 'State', name: 'Texas' } },
            url: `${SITE_URL}/${slug}/`,
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${SITE_URL}/${slug}/#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Areas We Serve', item: `${SITE_URL}/areas-we-serve/` },
              { '@type': 'ListItem', position: 3, name: 'Grand Prairie', item: `${SITE_URL}/${slug}/` },
            ],
          },
        ]}
      />

      <ServiceHero
        title="Web Design & Development in Grand Prairie, TX"
        lead="A lot of Grand Prairie businesses come to us with the same starting point: a website that was built years ago, hasn't been touched since, and no longer reflects how the business actually operates today. Massive Designs builds and modernizes websites for Grand Prairie businesses with a practical focus, faster pages, clearer navigation, a mobile experience that actually works, and a foundation that supports local search instead of working against it."
        crumb="Grand Prairie"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Grand Prairie Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for Grand Prairie Businesses"
        description="The most common problems we see with Grand Prairie business sites aren't complicated: outdated design that doesn't match the business today, a mobile experience that was clearly an afterthought, navigation that buries the pages customers actually want, and a site that isn't showing up when local customers search. We build new sites and modernize existing ones with those specific problems in mind, rather than treating every project as a from-scratch redesign."
        items={[
          {
            title: 'Custom Website Design',
            description: 'Layouts and branding built around how customers actually use the site.',
          },
          {
            title: 'Website Development',
            description: 'Custom functionality, integrations, and performance handled by one team.',
          },
          {
            title: 'Local SEO',
            description: 'A local keyword strategy and technical foundation built to support search visibility.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a Grand Prairie Growth Plan Looks Like"
        description="Most Grand Prairie projects start with modernizing an existing site rather than building from nothing, so our process is built around that reality."
        steps={[
          {
            number: '01',
            title: 'Website & Digital Audit',
            description: "We start by identifying what's actually working on your current site and what's costing you visitors or inquiries.",
          },
          {
            number: '02',
            title: 'Modern Design & Development',
            description: 'We rebuild the design and technical foundation together, mobile-first and built to load quickly.',
          },
          {
            number: '03',
            title: 'Local SEO Rebuild',
            description: 'Technical and local SEO get rebuilt alongside the site, so the update improves visibility instead of resetting it.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Visibility',
            description: 'We keep supporting the site with content and local SEO after launch, so the improvement holds.',
          },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Custom Website Design</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Design work covers business websites built around how customers actually use them, responsive layouts
              that work across phones, tablets, and desktops, a user experience that gets visitors to the right page
              quickly, a conversion path that leads somewhere, and branding that&rsquo;s consistent from the homepage
              to the contact form.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Website Development</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              On the development side, we handle custom functionality where a project needs it, integrations with
              the tools a business already uses, performance so pages load quickly, security, and a structure built
              to scale as the business adds pages, services, or products.
            </p>
          </Reveal>
        </div>
      </section>

      <AreaMapHighlight
        heading="Built to Perform in a Crowded Grand Prairie Market"
        description="An outdated site doesn't just look dated, it quietly loses ground to newer, faster competitors in local search. We rebuild sites to close that gap."
        mapQuery="Grand Prairie, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Faster load times and a modern, mobile-first design',
          'Rebuilt local search visibility for the terms that matter',
          'Clear navigation and calls to action that actually get used',
          'A technical foundation that supports growth instead of holding it back',
        ]}
      />

      <FeatureGrid
        heading="Website Redesign"
        columns={5}
        items={[
          {
            title: 'Modernize Your Design',
            description: 'We update the visual design so the site matches how the business presents itself today, not how it looked five or ten years ago.',
          },
          {
            title: 'Improve Mobile Experience',
            description: "Layouts, navigation, and forms are rebuilt mobile-first, since that's where most local traffic starts.",
          },
          {
            title: 'Simplify Navigation',
            description: "Menus and page structure get reorganized around what customers are actually looking for, cutting anything that just adds clutter.",
          },
          {
            title: 'Improve Calls to Action',
            description: 'Buttons, forms, and contact paths are placed where visitors will actually see and use them, not buried at the bottom of the page.',
          },
          {
            title: 'Build a Better SEO Foundation',
            description: 'The technical structure behind the site, speed, indexing, page structure, gets rebuilt to support search visibility instead of holding it back.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">E-Commerce Web Design</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              For Grand Prairie businesses selling online, we build around clear product presentation, simple
              navigation, mobile-friendly shopping, streamlined checkout, and secure payment integration, with
              analytics in place from launch so the business can see what&rsquo;s actually converting.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioHoverGrid
        heading="Our Work Across Grand Prairie and DFW"
        description="A look at recent website design and development work for Grand Prairie businesses."
        items={portfolioItems}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Local SEO for Grand Prairie Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A modernized site still needs to be found locally. That means a local keyword strategy built around
              how Grand Prairie customers actually search, on-page optimization, technical SEO, Google Business
              Profile management, local search visibility, supporting content, and consistent business citations.
              For a closer look at how we approach that work, visit our{' '}
              <Link href="/seo-services" className="text-primary hover:underline">
                SEO Services
              </Link>{' '}
              page.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Content Marketing & Social Media</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              The website works best as the center of a larger system: the site leads to content, content supports
              search, search and social media marketing bring in traffic, and that traffic turns into leads. We
              handle content marketing and social alongside the website itself, so those pieces stay connected
              instead of operating as separate, disconnected efforts.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSteps
        heading="How We Work With Grand Prairie Clients"
        description="Every project follows the same underlying process: understand the business, plan, design, develop, launch, then adjust based on real performance."
        steps={[
          {
            number: '01',
            title: 'Assess the Current Site',
            description: "We review what exists today and identify exactly what's holding it back.",
          },
          {
            number: '02',
            title: 'Decide What to Fix First',
            description: "We prioritize based on what's actually costing you visitors or leads, not guesswork.",
          },
          {
            number: '03',
            title: 'Rebuild Together',
            description: 'Design and development happen side by side, with drafts shared as we go.',
          },
          {
            number: '04',
            title: 'Watch Performance and Adjust',
            description: 'After launch, we monitor how the site performs and adjust based on results.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Grand Prairie Businesses Choose Massive Designs"
        columns={5}
        items={[
          {
            title: 'Strategy Before Design',
            description: 'Every project starts with the business, not a template.',
          },
          {
            title: 'One Team, Start to Finish',
            description: 'Design, development, and SEO handled together.',
          },
          {
            title: 'Texas-Based Team',
            description: 'Working across Grand Prairie and the DFW area.',
          },
          {
            title: 'Built to Support Growth',
            description: 'Every site is built on a technical foundation that supports SEO instead of fighting it.',
          },
          {
            title: 'Marketing Beyond Launch',
            description: 'We stay involved after launch through SEO, content, and social media support.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Serving Grand Prairie and the DFW Area</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Beyond Grand Prairie, we also build and support websites for businesses in Arlington, Irving,{' '}
              <Link href="/areas-we-serve/dallas" className="text-primary hover:underline">
                Dallas
              </Link>
              , and{' '}
              <Link href="/areas-we-serve/fort-worth" className="text-primary hover:underline">
                Fort Worth
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <GrandPrairieFaq />

      <ServiceCta
        heading="Ready to modernize your Grand Prairie website?"
        paragraphs={[
          "If you're looking for a web design company in Grand Prairie that can modernize an existing site and rebuild local visibility, let's talk about what that could look like for you.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

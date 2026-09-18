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
  { src: '/img/web-projects/optimized/web-project-7.webp', alt: 'Dumpster Rentals in Eagle, Idaho' },
  { src: '/img/web-projects/optimized/web-project-8.webp', alt: "Denver's Go-To Yard Care and Landscaping" },
  { src: '/img/web-projects/optimized/web-project-9.webp', alt: 'Custom Comic Book Illustration & Manga Art Services' },
  { src: '/img/web-projects/optimized/web-project-10.webp', alt: 'AI Automation Systems for North Texas Businesses' },
  { src: '/img/web-projects/optimized/web-project-11.webp', alt: 'Jedi Atlantis' },
  { src: '/img/web-projects/optimized/web-project-12.webp', alt: 'Happy Homes Lath, Plaster, and Roofing' },
];

const faqs = [
  {
    q: 'How much does a business website cost in Irving?',
    a: 'Cost depends on scope, page count, and whether the project involves custom functionality or ecommerce. We provide a clear quote after an initial discussion about your goals.',
  },
  {
    q: 'How long does a website project take?',
    a: 'Most business websites launch within a few weeks of approved design, depending on content readiness and complexity.',
  },
  {
    q: 'Do you redesign existing websites?',
    a: "Yes, redesign is one of our most common projects, especially for businesses whose current site no longer matches how they operate.",
  },
  {
    q: 'Do you build mobile-friendly, responsive sites?',
    a: "Every site is designed mobile-first, since that's where most search traffic starts, even for corporate and B2B audiences.",
  },
  {
    q: 'Is SEO included with web design?',
    a: 'Yes. SEO is built into the site structure from the start, and we offer ongoing SEO support after launch.',
  },
  {
    q: 'Can you build an e-commerce site?',
    a: 'Yes, including product presentation, checkout, and secure payment integration.',
  },
  {
    q: 'Do you work with corporate and professional service businesses?',
    a: 'Yes. A large share of our Irving work is with corporate and professional service companies that need a site built to generate qualified leads.',
  },
  {
    q: 'Do you support the site after it launches?',
    a: 'Yes. We offer ongoing support and can also handle SEO, content, and social media once the site is live.',
  },
];

function IrvingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">Frequently Asked Questions About Web Design in Irving</h2>
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

export default function Irving() {
  const [contactOpen, setContactOpen] = useState(false);
  const slug = 'areas-we-serve/irving';

  return (
    <>
      <Seo
        title="Web Design Company in Irving, TX | Massive Designs"
        description="Massive Designs provides custom web design, development, SEO, branding, and digital marketing services for businesses in Irving, TX."
        path={`/${slug}`}
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${slug}/#webpage`,
            url: `${SITE_URL}/${slug}/`,
            name: 'Web Design Company in Irving, TX | Massive Designs',
            headline: 'Web Design & Development in Irving, TX',
            description:
              'Massive Designs provides custom web design, website development, SEO, branding, and digital marketing services for businesses in Irving, TX.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/${slug}/#service` },
            breadcrumb: { '@id': `${SITE_URL}/${slug}/#breadcrumb` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'Service',
            '@id': `${SITE_URL}/${slug}/#service`,
            name: 'Web Design & Development in Irving, TX',
            serviceType: ['Web Design', 'Website Design', 'Website Development', 'Website Redesign', 'E-commerce Web Design'],
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'City', name: 'Irving', containedInPlace: { '@type': 'State', name: 'Texas' } },
            url: `${SITE_URL}/${slug}/`,
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${SITE_URL}/${slug}/#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Areas We Serve', item: `${SITE_URL}/areas-we-serve/` },
              { '@type': 'ListItem', position: 3, name: 'Irving', item: `${SITE_URL}/${slug}/` },
            ],
          },
        ]}
      />

      <ServiceHero
        title="Web Design & Development in Irving, TX"
        lead={
          <>
            Irving is home to a dense mix of corporate offices, service businesses, and companies working with
            clients well outside city limits. Massive Designs builds websites for that kind of audience:
            professional, fast, and structured to convert a visitor into a lead rather than just present
            information.
            <br />
            <br />
            Whether you need a first corporate site, a redesign, or a stronger path from homepage to contact form,
            every build starts with how your business actually generates leads.
          </>
        }
        crumb="Irving"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Irving Website Project"
        ctaHref={brand.phoneTel}
        secondaryCtaLabel="View Our Web Design Work"
        secondaryCtaHref="/projects"
      />

      <FeatureGrid
        heading="Web Design for Irving Businesses"
        description="Irving's business base leans heavier toward corporate and professional services than some surrounding cities, and that changes what a website needs to do. We build for businesses that need professional corporate websites that hold up to scrutiny from other companies, service-business sites built to generate leads rather than just list services, ecommerce for companies selling products online, and modernization for sites that no longer reflect how the business operates, all with a strong mobile experience built in from the start."
        items={[
          {
            title: 'Responsive Web Design',
            description: 'Mobile-first design that scales up cleanly to tablet and desktop.',
          },
          {
            title: 'UX & Navigation',
            description: 'Menus and structure built around how prospective clients actually look for information.',
          },
          {
            title: 'Conversion-Focused Design',
            description: 'Layouts built to move visitors toward a specific next step.',
          },
        ]}
      />

      <ProcessSteps
        heading="What an Irving Growth Plan Looks Like"
        description="Corporate and professional-services businesses in Irving need a plan that holds up to scrutiny from other companies, not just consumers. Every project runs through four stages built around that."
        steps={[
          {
            number: '01',
            title: 'Business & Audience Strategy',
            description: "We start with who you're trying to reach, other businesses, decision-makers, or a mix, and how they evaluate a company online.",
          },
          {
            number: '02',
            title: 'Conversion-Focused Design',
            description: 'Every page is designed around a next step: a form, a call, or a scheduled meeting, instead of leaving visitors to figure out what to do next.',
          },
          {
            number: '03',
            title: 'Technical SEO & Search Foundation',
            description: 'We build a technical foundation that supports visibility for corporate and local searches alike.',
          },
          {
            number: '04',
            title: 'Content & Lead Generation',
            description: 'Ongoing content and follow-through keep the site generating qualified leads after launch.',
          },
        ]}
      />

      <FeatureGrid
        heading="Custom Website Design"
        description="There's no single template for an effective Irving business website, because the right structure depends on your industry, your audience, how they search, how they move toward a decision, and the technology your business runs on. A corporate services firm and a retail company selling online need different navigation, different content, and different conversion paths, even if both are based in Irving. We build the site around those specifics rather than starting from a generic industry template and hoping it fits."
        items={[
          {
            title: 'Responsive Web Design',
            description: 'Design starts mobile-first and scales up, since a growing share of even B2B research now begins on a phone.',
          },
          {
            title: 'UX & Navigation',
            description: "Menus and page structure are built around how a prospective client actually looks for information about your business, not around your internal org chart.",
          },
          {
            title: 'Conversion-Focused Design',
            description: 'Every page is built with a next step in mind, a form, a call, a scheduled meeting, instead of leaving visitors to figure out what to do next.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Website Development</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Beyond design, we handle the technical side that keeps a site reliable: performance tuning so pages
              load quickly, functionality and integrations with the tools your business already uses, scalability
              as the company adds services or content, security, and an SEO-friendly site architecture built in from
              the ground up rather than retrofitted later.
            </p>
          </Reveal>
        </div>
      </section>

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Irving Market"
        description="Irving sits inside one of the most corporate-dense parts of DFW, which means your website is often being compared to companies with much bigger budgets. We build sites that compete on substance instead."
        mapQuery="Irving, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'A professional, fast-loading site that holds up to scrutiny from other businesses',
          'Search visibility for the corporate and local terms Irving prospects use',
          'A clear conversion path from homepage to lead',
          'A technical foundation built to scale as your business grows',
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Website Redesign in Irving</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              If your current site is outdated, slow, difficult to navigate, hard to update without calling a
              developer, not mobile-friendly, or simply not generating inquiries, a redesign usually needs to fix
              more than the way the site looks. Our process starts with identifying which of those problems is
              actually costing you business, then rebuilds the site&rsquo;s structure, design, and back end around
              fixing it.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioHoverGrid
        heading="Our Work Across Irving and DFW"
        description="A look at the kind of website, branding, and marketing work we've built for businesses across the Dallas-Fort Worth area. We don't yet have a published Irving case study, so rather than manufacture one, this section reflects the range and quality of work behind every project we take on."
        items={portfolioItems}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">SEO for Irving Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              We handle technical SEO, local SEO, on-page optimization, content, Google Business Profile management,
              and local search visibility as part of the same project as the website itself. For a closer look at
              how we approach that work, visit our{' '}
              <Link href="/seo-services" className="text-primary hover:underline">
                SEO Services
              </Link>{' '}
              page.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Content Marketing & Social Media</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Your website works best when it&rsquo;s backed by ongoing content and a consistent presence elsewhere.
              Our content marketing work is built around strategy, SEO, landing pages, and the kind of content that
              actually drives qualified traffic, not just posts for the sake of posting. We pair that with social
              media marketing so your online presence stays consistent across every channel a prospective client
              might find you on.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">A Website Built Around Your Business Goals</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              There&rsquo;s no single template for an effective Irving business website, because the right structure
              depends on your industry, your audience, how they search, how they move toward a decision, and the
              technology your business runs on. A corporate services firm and a retail company selling online need
              different navigation, different content, and different conversion paths, even if both are based in
              Irving. We build the site around those specifics rather than starting from a generic industry template
              and hoping it fits.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSteps
        heading="How We Work With Irving Clients"
        description="Our process is built to move at the pace a busy corporate or professional-services client needs, without cutting corners."
        steps={[
          {
            number: '01',
            title: 'Discovery Call',
            description: "We start by learning your business, your audience, and what your current site is or isn't doing.",
          },
          {
            number: '02',
            title: 'Strategy & Scope',
            description: 'We agree on priorities and lay out a clear plan and timeline before any design work starts.',
          },
          {
            number: '03',
            title: 'Design & Development Sprint',
            description: 'Design and development happen together, with regular check-ins instead of a single big reveal.',
          },
          {
            number: '04',
            title: 'Launch & Ongoing Support',
            description: 'After launch, we track performance and continue supporting SEO, content, and updates.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Massive Designs"
        columns={5}
        items={[
          {
            title: 'Strategy First',
            description: 'Every build starts with your business goals.',
          },
          {
            title: 'SEO-Friendly Architecture',
            description: 'Search visibility built in, not retrofitted.',
          },
          {
            title: 'Texas-Based Team',
            description: 'Working across Irving and the broader DFW area.',
          },
          {
            title: 'One Team, One Project',
            description: 'Design and development stay under one team, from strategy to launch.',
          },
          {
            title: 'Marketing Beyond Launch',
            description: 'We support marketing after launch, not just at delivery.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Serving Irving and Nearby DFW Communities</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              We also build and support websites for businesses in{' '}
              <Link href="/areas-we-serve/dallas" className="text-primary hover:underline">
                Dallas
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/fort-worth" className="text-primary hover:underline">
                Fort Worth
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/arlington" className="text-primary hover:underline">
                Arlington
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/grand-prairie" className="text-primary hover:underline">
                Grand Prairie
              </Link>
              , and{' '}
              <Link href="/areas-we-serve/north-richland-hills" className="text-primary hover:underline">
                North Richland Hills
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <IrvingFaq />

      <ServiceCta
        heading="Ready to grow your Irving business?"
        paragraphs={[
          "If you're looking for a web design company in Irving built around lead generation and conversion, let's talk about what that could look like for you.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

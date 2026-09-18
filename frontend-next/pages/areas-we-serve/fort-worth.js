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
    q: 'How much does a business website cost in Fort Worth?',
    a: 'It depends on scope: a straightforward business site costs less than a custom build with ecommerce or specialized integrations. We provide a clear quote after understanding what your project actually needs.',
  },
  {
    q: 'How long does website development take?',
    a: 'Most projects take a few weeks from approved design to launch, depending on page count, content readiness, and any custom functionality involved.',
  },
  {
    q: 'Do you work with startups and new businesses?',
    a: 'Yes. We regularly build first websites for entrepreneurs and early-stage Fort Worth businesses, alongside redesigns for established companies.',
  },
  {
    q: 'Do you redesign existing websites?',
    a: "Yes, redesign is one of our most common projects, whether that's a full rebuild or targeted fixes to design and usability.",
  },
  {
    q: 'Do you build mobile-friendly websites?',
    a: "Every site is designed mobile-first, since that's where most local and search traffic begins.",
  },
  {
    q: 'Do you provide SEO with web design?',
    a: 'Yes. SEO is built into the site from the start and can continue as an ongoing service after launch.',
  },
  {
    q: 'Can you build an e-commerce website?',
    a: 'Yes, including product structure, checkout flow, and secure payment integration.',
  },
  {
    q: 'Can you support our business as we grow and add services?',
    a: 'Yes. Sites are built to scale, and we offer ongoing support, SEO, content, and social media as your business grows.',
  },
];

function FortWorthFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">Frequently Asked Questions About Web Design in Fort Worth</h2>
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

export default function FortWorth() {
  const [contactOpen, setContactOpen] = useState(false);
  const slug = 'areas-we-serve/fort-worth';

  return (
    <>
      <Seo
        title="Web Design Company in Fort Worth, TX | Massive Designs"
        description="Massive Designs provides custom web design, development, SEO, branding, and digital marketing services for businesses in Fort Worth, TX."
        path={`/${slug}`}
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${slug}/#webpage`,
            url: `${SITE_URL}/${slug}/`,
            name: 'Web Design Company in Fort Worth, TX | Massive Designs',
            headline: 'Web Design & Development in Fort Worth, TX',
            description:
              'Massive Designs provides custom web design, website development, SEO, branding, and digital marketing services for businesses in Fort Worth, TX.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/${slug}/#service` },
            breadcrumb: { '@id': `${SITE_URL}/${slug}/#breadcrumb` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'Service',
            '@id': `${SITE_URL}/${slug}/#service`,
            name: 'Web Design & Development in Fort Worth, TX',
            serviceType: ['Web Design', 'Website Design', 'Website Development', 'Website Redesign', 'E-commerce Web Design'],
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'City', name: 'Fort Worth', containedInPlace: { '@type': 'State', name: 'Texas' } },
            url: `${SITE_URL}/${slug}/`,
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${SITE_URL}/${slug}/#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Areas We Serve', item: `${SITE_URL}/areas-we-serve/` },
              { '@type': 'ListItem', position: 3, name: 'Fort Worth', item: `${SITE_URL}/${slug}/` },
            ],
          },
        ]}
      />

      <ServiceHero
        title="Web Design & Development in Fort Worth, TX"
        lead={
          <>
            Fort Worth has built a lot of its recent growth around attracting entrepreneurs and creative companies,
            alongside supporting the established small businesses that have operated here for years. Massive
            Designs builds websites for both ends of that range: fast, custom-designed sites for founders launching
            a new brand, and full rebuilds for established Fort Worth companies whose current site no longer
            reflects where the business is today.
            <br />
            <br />
            Every project is built mobile-first and structured around search from the start, so the site is working
            for you the day it launches, not months later.
          </>
        }
        crumb="Fort Worth"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Fort Worth Website Project"
        ctaHref={brand.phoneTel}
        secondaryCtaLabel="View Our Web Design Work"
        secondaryCtaHref="/projects"
      />

      <FeatureGrid
        heading="Web Design for Fort Worth Businesses"
        description="The businesses we hear from in Fort Worth tend to fall into a few groups: entrepreneurs and startups building their first real website, established local businesses whose site hasn't been touched in years, professional services firms that need to look credible to new clients, companies mid-rebrand who need a site that matches a new identity, and businesses expanding into new services or locations that need a site built to grow with them."
        items={[
          {
            title: 'Custom Design & Development',
            description: 'Responsive design and dependable development from the same team, start to finish.',
          },
          {
            title: 'Website Redesign',
            description: "For sites that were fine years ago and haven't kept up with the business since.",
          },
          {
            title: 'Branding, Content & Social',
            description: 'Consistent identity and marketing for businesses that are rebranding or scaling.',
          },
        ]}
      />

      <ProcessSteps
        heading="What a Fort Worth Growth Plan Looks Like"
        description="Whether you're an early-stage founder or an established Fort Worth company, every project runs through the same four stages."
        steps={[
          {
            number: '01',
            title: 'Brand & Website Strategy',
            description: 'We start with where your business is today, a new brand needing its first real site, or an established company whose site no longer fits, and plan around that.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description: 'Sites are custom-designed and built mobile-first, with development that keeps pages fast and stable as the business grows.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description: 'Technical and local SEO go in from the start, so the site is positioned to show up for Fort Worth searches from day one.',
          },
          {
            number: '04',
            title: 'Content, Social & Growth',
            description: 'We continue supporting the site with content and social media after launch, so early traction turns into steady growth.',
          },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Custom Web Design & Development</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Every Fort Worth project starts with the same foundation: custom design based on the business and its
              customers, not a reused template, paired with development that keeps pages fast and stable as the site
              grows. That includes responsive design across devices, a navigation structure built around what
              customers are looking for, clear calls to action, and back-end work, integrations, performance,
              security, and scalability, handled by the same team that designed the site.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Websites Built for Growing Fort Worth Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A website for a five-person startup and a website for a company that&rsquo;s operated for fifteen
              years need different things, even in the same industry. We build sites that match where a business
              actually is: simple and fast for early-stage companies that need to launch quickly, and more
              structured, content-heavy builds for established businesses that need to organize multiple services,
              locations, or team members without the site turning into a maze. Either way, the site is built to grow
              with the business instead of requiring a full rebuild every time something changes.
            </p>
          </Reveal>
        </div>
      </section>

      <AreaMapHighlight
        heading="Built to Perform in a Growing Fort Worth Market"
        description="Fort Worth's mix of new companies and long-established businesses means the competition for attention looks different depending on your industry. We build sites that hold their own either way."
        mapQuery="Fort Worth, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Faster, cleaner sites that load well on any connection',
          'Search visibility for the terms Fort Worth customers use',
          'A site structured to add services, locations, or content as you grow',
          'Clear calls to action that turn visits into inquiries',
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Website Redesign for Fort Worth Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Established Fort Worth businesses often come to us with a site that was fine five or ten years ago and
              hasn&rsquo;t kept up since: outdated design, clunky navigation, slow load times, or a mobile
              experience that was clearly an afterthought. Our redesign process starts by identifying what&rsquo;s
              actually costing the business inquiries, then rebuilds the site&rsquo;s structure, design, and
              technical foundation to fix that specific problem instead of just giving it a new coat of paint.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">E-Commerce Website Development</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              For Fort Worth businesses selling online, we build ecommerce sites around clear product presentation,
              straightforward navigation, a mobile-friendly shopping experience, a simplified checkout, secure
              payment integrations, and product and category structure that makes sense to a shopper. Analytics are
              set up from launch, so the business can see what&rsquo;s actually selling.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioHoverGrid
        heading="Our Work Across Fort Worth and the DFW Metroplex"
        description="A look at the kind of website, branding, and marketing work we've built for businesses across the Dallas-Fort Worth metroplex. We don't yet have a published Fort Worth case study, so rather than manufacture one, this section reflects the range and quality of work behind every project we take on."
        items={portfolioItems}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">SEO & Local Search for Fort Worth Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A new or redesigned site still needs to show up when Fort Worth customers search. We handle technical
              SEO, on-page optimization, keyword research, local SEO and Google Business Profile setup, supporting
              content, and internal linking, all built around the site rather than treated as a separate project.
              For a closer look at how we approach that work, visit our{' '}
              <Link href="/seo-services" className="text-primary hover:underline">
                SEO Services
              </Link>{' '}
              page.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Branding, Content & Social Media</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A lot of the Fort Worth businesses we work with are mid-rebrand, or building a brand identity for the
              first time as they scale. We handle branding, content marketing, and social media marketing alongside
              web design and development, so the website, the visual identity, and the ongoing marketing all stay
              consistent instead of being handled by three separate vendors with three separate opinions.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSteps
        heading="How We Work With Fort Worth Clients"
        description="Every project follows the same basic process, adjusted for the business, plan, design, develop, launch, optimize."
        steps={[
          {
            number: '01',
            title: "Understand Where You're Starting",
            description: 'We look at your current site (or lack of one), your goals, and your competition.',
          },
          {
            number: '02',
            title: 'Identify What Matters Most',
            description: "We agree on which problems are actually costing you business and prioritize those first.",
          },
          {
            number: '03',
            title: 'Build in the Open',
            description: 'Design and development happen together, with drafts and structure shared as we go.',
          },
          {
            number: '04',
            title: 'Adjust Based on Results',
            description: 'After launch, we track how the site performs and adjust the strategy based on real behavior.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Fort Worth Businesses Work With Massive Designs"
        columns={5}
        items={[
          {
            title: 'Strategy Comes First',
            description: "Every project starts with the business's goals, not a template pulled off the shelf.",
          },
          {
            title: 'One Team, Design to Development',
            description: 'Design and development sit under one roof, so nothing gets lost between the two.',
          },
          {
            title: 'SEO-Friendly From Day One',
            description: 'Sites are built on technical foundations that support search visibility instead of requiring rework later.',
          },
          {
            title: 'Marketing Beyond Launch',
            description: "We support SEO, content, and social media after the site is live, not just at delivery.",
          },
          {
            title: 'A Texas-Based Team',
            description: "We work across the DFW metroplex, including Fort Worth, rather than managing the relationship remotely from out of state.",
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Serving Fort Worth and the DFW Metroplex</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Beyond Fort Worth, we build and support websites for businesses across the metroplex, including{' '}
              <Link href="/areas-we-serve/arlington" className="text-primary hover:underline">
                Arlington
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/north-richland-hills" className="text-primary hover:underline">
                North Richland Hills
              </Link>
              , Keller, and Southlake.
            </p>
          </Reveal>
        </div>
      </section>

      <FortWorthFaq />

      <ServiceCta
        heading="Ready to grow your Fort Worth business?"
        paragraphs={[
          "If you're looking for a web design company in Fort Worth that understands entrepreneurs and established businesses alike, let's talk about your project.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

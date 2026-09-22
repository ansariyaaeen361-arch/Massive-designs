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
    q: 'How long does a Fort Worth web design project take?',
    a: 'Most business sites launch within a few weeks of approved design. B2B projects for the aerospace or manufacturing supply chain take longer due to additional technical requirements and content review. We give you a realistic estimate before work starts.',
  },
  {
    q: 'Should I redesign my site or build a new one?',
    a: 'If the structure is sound and main problems are visual or mobile-related, a redesign is more efficient. If the platform is limiting performance or the business has changed substantially, starting fresh tends to produce better long-term results.',
  },
  {
    q: 'Can you build an ecommerce site for my Fort Worth business?',
    a: 'Yes, including B2B ecommerce for the aerospace and manufacturing supply chain, with bulk order management, account-based pricing, and RFQ workflows alongside standard checkout.',
  },
  {
    q: 'Is SEO included with web design?',
    a: 'Yes. SEO is built into the site from the start and can continue as an ongoing service after launch.',
  },
  {
    q: 'Do you understand the aerospace sector digital needs?',
    a: "We work with businesses in Fort Worth's aerospace supply chain. The design priorities, content requirements, and conversion paths for a procurement-focused B2B site are different from those for a consumer-facing business. We build for what your specific audience is evaluating.",
  },
  {
    q: 'Do you build mobile-friendly websites?',
    a: "Every site is designed mobile-first, since that's where most local and search traffic begins.",
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
        title="Web Design & Development in Fort Worth, TX | Massive Designs"
        description="Massive Designs builds custom, mobile-first websites for Fort Worth's aerospace and defense supply chain, hospitality, and healthcare businesses, with local SEO built in from the first wireframe."
        path={`/${slug}`}
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${slug}/#webpage`,
            url: `${SITE_URL}/${slug}/`,
            name: 'Web Design & Development in Fort Worth, TX | Massive Designs',
            headline: 'Web Design & Development in Fort Worth, TX',
            description:
              "Massive Designs builds custom, mobile-first websites for Fort Worth's aerospace and defense supply chain, hospitality, and healthcare businesses, with local SEO built in from the first wireframe.",
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
            Fort Worth has a different economic foundation than Dallas. Lockheed Martin employs approximately
            18,700 people in the metro producing the F-35. Bell Textron is investing $632 million in a new
            manufacturing facility nearby. Over 600 aerospace and defense companies anchor the area. A B2B supplier
            in that supply chain has completely different website needs than a restaurant near Sundance Square or a
            healthcare provider in a growing Fort Worth suburb.
            <br />
            <br />
            Massive Designs builds for that full range of Fort Worth businesses. Custom, mobile-first, with local
            SEO built into the site from the first wireframe.
          </>
        }
        crumb="Fort Worth"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Fort Worth Website Project"
        ctaHref={brand.phoneTel}
      />

      <FeatureGrid
        heading="Web Design for Fort Worth Businesses"
        description="Fort Worth's growth has brought more businesses and more competition in most local search categories. The businesses that invested in search visibility earlier have measurable advantages today. Getting the technical foundations right from the beginning costs less than correcting problems later."
        items={[
          {
            title: 'Custom Website Design',
            description:
              'Layouts built around how Fort Worth B2B buyers and local customers evaluate options. Procurement teams and consumers booking a service have different evaluation processes and the site design reflects that.',
          },
          {
            title: 'Website Development',
            description:
              'Scalable development with ERP connections, document management, booking systems, and payment integrations where the project needs them.',
          },
          {
            title: 'SEO & Local Visibility',
            description:
              "Technical and local SEO from day one. Fort Worth's search competition has grown alongside its population, and national brands appear here alongside local businesses.",
          },
        ]}
      />

      <ProcessSteps
        heading="What a Fort Worth Growth Plan Looks Like"
        description="Every Fort Worth project follows four stages. A precision machining supplier needs a very different strategy than a Cultural District restaurant or a medical practice in a growing suburb."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description:
              'We map how Fort Worth customers and B2B procurement teams search for what you offer, then build the site architecture around that specific behavior.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description:
              'Fast, mobile-first, and visually appropriate to your market: industrial credibility for B2B suppliers, energy and character for hospitality businesses near the Stockyards.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description:
              'On-page and technical SEO from launch. For businesses serving both Fort Worth and Dallas, we structure the site to support both markets from the start.',
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description: 'After launch we build through content and social support.',
          },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Custom Website Design in Fort Worth</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              No single template works across Fort Worth&rsquo;s range of industries. A procurement-focused B2B
              site needs to hold up to technical scrutiny. A Stockyards-area hospitality business needs to drive
              reservations from mobile visitors. A medical practice needs a clear appointment path. Every site is
              designed mobile-first, since Fort Worth&rsquo;s manufacturing and logistics workforce searches
              heavily from phones during shift changes and commutes. For B2B businesses, that means a clear
              capability verification path and RFQ form; for consumer businesses, service description and booking
              in two clicks or fewer.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Website Development for Fort Worth Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Sites built to load quickly and scale. For aerospace suppliers presenting technical documentation, we
              build the back-end architecture to support that. Front-end speed, back-end functionality,
              integrations, and SEO-ready architecture come standard, and for businesses also serving Dallas, the
              multi-city structure is built in from day one.
            </p>
          </Reveal>
        </div>
      </section>

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Fort Worth Market"
        description="National chains, large employers with marketing teams, and franchise operators appear in the same Fort Worth search results as local businesses. For B2B buyers in the aerospace supply chain, credibility and proven capability matter more than marketing language."
        mapQuery="Fort Worth, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          "Faster mobile-first design for Fort Worth's high proportion of mobile searchers, including workers searching from phones on shift",
          'Search visibility for the terms Fort Worth customers use in the Alliance corridor, Cultural District, Medical District, and growing suburbs',
          'A clearer path from homepage to RFQ, booking, or phone call',
          'Site architecture ready to expand to Dallas, North Richland Hills, and other Texas markets',
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">Website Redesign in Fort Worth</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Common triggers: a site that looks dated compared to competitors who invested more recently, a mobile
              experience that loses visitors before they reach the contact page, or navigation built around an old
              version of the business. We audit what the current site is costing the business before touching
              anything.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">E-Commerce Website Design in Fort Worth</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              For Fort Worth B2B ecommerce, we build bulk order management, account-based pricing, and RFQ
              functionality alongside standard checkout. Consumer ecommerce gets mobile checkout, secure payments,
              and analytics from day one.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioHoverGrid
        heading="Our Work Across Fort Worth and Texas"
        description="Website, branding, and digital marketing work for businesses across Texas. We don't yet have a published Fort Worth case study, so rather than manufacture one, this section reflects the range and quality of work behind every project we take on."
        items={portfolioItems}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">SEO for Fort Worth Business Websites</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Technical SEO, on-page optimization, Google Business Profile management, and content targeting Fort
              Worth search terms. SEO is part of the same project as web design, not a separate add-on. For a closer
              look at how we approach that work, visit our{' '}
              <Link href="/seo-services" className="text-primary hover:underline">
                SEO Services
              </Link>{' '}
              page.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Branding and Content That Support Your Website</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              For aerospace and manufacturing suppliers, a visual identity that projects precision and reliability.
              For Stockyards-area hospitality, one that feels genuine. We handle branding, content marketing, and
              social media marketing alongside web design and development, so the website, the visual identity, and
              the ongoing marketing all stay consistent.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSteps
        heading="How We Work With Fort Worth Clients"
        description="Plan, design, develop, launch, optimize, adjusted for whether you're a B2B supplier or a consumer-facing business."
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description:
              "We start with your customers and your industry's purchasing or procurement process in Fort Worth. For B2B businesses, that includes understanding how procurement teams evaluate suppliers online before making contact.",
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description: 'We identify what is limiting site performance and agree on what to address first. For most Fort Worth businesses, that starts with mobile performance.',
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description: 'You see real drafts early. Fort Worth businesses dealing with long procurement cycles value knowing exactly where the project stands at each stage.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description: 'After launch we track Fort Worth traffic and adjust based on real data. We stay available for ongoing SEO, content, and development support.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Fort Worth Businesses Choose Massive Designs"
        columns={5}
        items={[
          {
            title: 'Strategy Before Design',
            description: "Your customers' search behavior and evaluation criteria come first. Design follows from that.",
          },
          {
            title: 'Design and Development Under One Team',
            description: 'The same team handles design and development. No handoff errors between disciplines.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description: 'Technical foundations supporting search visibility from day one, in a market that has grown more competitive as the city has grown.',
          },
          {
            title: 'Marketing Beyond Launch',
            description: 'SEO, content, and social support continue after launch.',
          },
          {
            title: 'Texas-Based Team',
            description: 'Based at 8350 Davis Boulevard, North Richland Hills, TX, in the Mid-Cities area between Fort Worth and Dallas.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Serving Fort Worth and Nearby Texas Cities</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              We also build and support websites for{' '}
              <Link href="/areas-we-serve/dallas" className="text-primary hover:underline">
                Dallas
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/north-richland-hills" className="text-primary hover:underline">
                North Richland Hills
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
              <Link href="/areas-we-serve/irving" className="text-primary hover:underline">
                Irving
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <FortWorthFaq />

      <ServiceCta
        heading="Ready to grow your Fort Worth business?"
        paragraphs={[
          "If you want a web design company in Fort Worth that builds with SEO in mind from day one, let's talk.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

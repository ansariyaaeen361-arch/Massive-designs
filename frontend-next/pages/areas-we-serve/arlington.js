import { useState } from 'react';
import Link from 'next/link';
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

export default function Arlington() {
  const [contactOpen, setContactOpen] = useState(false);
  const slug = 'areas-we-serve/arlington';

  return (
    <>
      <Seo
        title="Web Design Company in Arlington, TX | Massive Designs"
        description="Massive Designs provides custom web design, development, SEO, branding, and digital marketing services for businesses in Arlington, TX."
        path={`/${slug}`}
        schemaGraph={[
          {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${slug}/#webpage`,
            url: `${SITE_URL}/${slug}/`,
            name: 'Web Design Company in Arlington, TX | Massive Designs',
            headline: 'Web Design & Development in Arlington, TX',
            description:
              'Massive Designs provides custom web design, website development, SEO, branding, and digital marketing services for businesses in Arlington, TX.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/${slug}/#service` },
            breadcrumb: { '@id': `${SITE_URL}/${slug}/#breadcrumb` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'Service',
            '@id': `${SITE_URL}/${slug}/#service`,
            name: 'Web Design & Development in Arlington, TX',
            serviceType: ['Web Design', 'Website Design', 'Website Development', 'Website Redesign', 'E-commerce Web Design'],
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'City', name: 'Arlington', containedInPlace: { '@type': 'State', name: 'Texas' } },
            url: `${SITE_URL}/${slug}/`,
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${SITE_URL}/${slug}/#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Areas We Serve', item: `${SITE_URL}/areas-we-serve/` },
              { '@type': 'ListItem', position: 3, name: 'Arlington', item: `${SITE_URL}/${slug}/` },
            ],
          },
        ]}
      />

      <ServiceHero
        title="Web Design & Development in Arlington, TX"
        lead={
          <>
            Arlington&rsquo;s business base runs from manufacturing and logistics near I-20 to retail, healthcare,
            and professional services closer to downtown and the entertainment district. Massive Designs builds
            websites for that range: custom-designed, mobile-first, and structured around search engine optimization
            from the first wireframe rather than added on after launch.
            <br />
            <br />
            Every site we build for an Arlington business is meant to do one job well: turn more of your visitors
            into calls, quote requests, and booked appointments.
          </>
        }
        crumb="Arlington"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Discuss Your Arlington Website Project"
        ctaHref={brand.phoneTel}
        secondaryCtaLabel="View Our Web Design Work"
        secondaryCtaHref="/projects"
      />

      <FeatureGrid
        heading="Web Design for Arlington Businesses"
        description="Not every Arlington business needs the same thing from its website. Some are launching a first real site after years of running on a Facebook page and word of mouth. Others already have a site that no longer matches how the company operates, or one that was built years ago and never updated for mobile. We work with businesses at each of those stages, whether that means a first professional website, a full redesign, a stronger mobile experience, ecommerce functionality, a clearer path from homepage to contact form, better visibility in local search, or branding that finally looks like the business behind it."
        items={[
          {
            title: 'Custom Website Design',
            description: 'Layouts, navigation, and calls to action built around how Arlington customers actually search and shop.',
          },
          {
            title: 'Website Development',
            description: 'Fast, secure, scalable development with integrations built in where the project needs them.',
          },
          {
            title: 'SEO & Local Visibility',
            description: 'Technical and local SEO built into the site from day one, not bolted on after launch.',
          },
        ]}
      />

      <ProcessSteps
        heading="What an Arlington Growth Plan Looks Like"
        description="Every Arlington project we take on moves through the same four stages, adjusted for your industry and the part of the city you serve."
        steps={[
          {
            number: '01',
            title: 'Business & Website Strategy',
            description: 'We start by mapping how Arlington customers actually search and buy, from shoppers near the entertainment district to companies working out of the I-20 corridor, then plan the site around that.',
          },
          {
            number: '02',
            title: 'Design & Development',
            description: 'Your site gets built around that strategy: fast, mobile-first, and structured so visitors can find what they came for in a click or two.',
          },
          {
            number: '03',
            title: 'SEO & Local Search',
            description: "Technical and on-page SEO go in from day one, built around the terms Arlington customers are already typing into Google.",
          },
          {
            number: '04',
            title: 'Content & Ongoing Growth',
            description: "Once the site is live, we keep building on it with content, branding refinements, and social support, so growth doesn't stop at launch.",
          },
        ]}
      />

      <FeatureGrid
        heading="Custom Website Design in Arlington"
        description="A website built from a generic template rarely fits a specific business for long. Our design process starts with how Arlington customers actually search and shop, then builds the layout, navigation, and calls to action around that behavior instead of an industry template. That includes brand alignment, a clear user experience, responsive design across phones and tablets, navigation that gets visitors to the right page in a click or two, and a structure built to convert rather than just look good in a screenshot."
        items={[
          {
            title: 'Responsive Web Design',
            description: 'Every site we build is designed mobile-first, then adapted up to tablet and desktop. That order matters, because most local searches, especially for services and retail, start on a phone.',
          },
          {
            title: 'User-Focused Website Structure',
            description: 'We organize pages around what a visitor is actually trying to do: find a service, check pricing, see examples of past work, or get in touch. Menus and internal links are built to support that path, not just list every page the business happens to have.',
          },
          {
            title: 'Custom Website Development',
            description: 'Design decisions only hold up if the development behind them is solid. We build sites that load quickly, hold up under real traffic, and leave room to add pages or features later without a full rebuild.',
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Website Development for Arlington Businesses</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Development is where design either holds up or falls apart. Our front-end work focuses on speed and
              clean code so pages load fast on any connection. Where a business needs more than a brochure site, we
              handle back-end functionality, third-party integrations, and connections to tools the business already
              uses, from booking calendars to CRM and payment systems where that&rsquo;s part of the project. Every
              build accounts for performance, basic security hardening, and analytics from day one, and is
              structured so it can scale as the business adds services, locations, or products.
            </p>
          </Reveal>
        </div>
      </section>

      <AreaMapHighlight
        heading="Built to Perform in a Competitive Arlington Market"
        description="Arlington businesses compete with companies across the wider DFW area, not just down the street, so a website that blends in doesn't do much good. We build sites meant to stand out and hold up under that competition."
        mapQuery="Arlington, TX"
        highlightsTitle="What Changes With Us"
        highlights={[
          'Faster load times and a cleaner, mobile-first design',
          'Stronger visibility for the searches Arlington customers actually use',
          'A clearer path from homepage to phone call, quote request, or booking',
          'A site built to grow as your services or locations expand',
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Website Redesign in Arlington</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Most redesign conversations start with a specific frustration, not a general sense that a site is old.
              Common issues we see with Arlington businesses include outdated design that no longer matches how the
              company presents itself, poor mobile usability, navigation that buries the pages people actually want,
              slow load times, weak or missing calls to action, branding that&rsquo;s inconsistent from page to page,
              and a backend that makes it hard to update content without calling a developer every time.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Our redesign process starts with an audit of the existing site: what&rsquo;s working, what&rsquo;s
              costing the business inquiries, and what content is worth keeping versus rebuilding. From there we
              rebuild the structure, design, and technical foundation together, so the new site solves the actual
              problem instead of simply looking different.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">E-Commerce Website Design in Arlington</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              For Arlington businesses selling products online, the website has to do more than list items. We build
              ecommerce sites around clear product presentation, category structure that makes sense to a shopper
              rather than internal inventory logic, a mobile shopping experience that doesn&rsquo;t require pinching
              and zooming, a checkout process with as few steps as possible, and payment integrations that are
              secure and familiar to customers. Analytics are built in from launch, so the business can see which
              products and pages are actually driving sales.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioHoverGrid
        heading="Our Work Across Arlington and DFW"
        description="A look at the kind of website, branding, and marketing work we've built for businesses across the Dallas-Fort Worth area. We don't yet have a published Arlington case study, so rather than manufacture one, this section reflects the range and quality of work behind every project we take on."
        items={portfolioItems}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:px-10">
          <Reveal>
            <h3 className="text-lg text-primary">SEO for Arlington Business Websites</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A well-built website still needs to be found. Our SEO work covers technical SEO, on-page optimization,
              keyword research based on what Arlington customers are actually typing into Google, local SEO and
              Google Business Profile management, content that supports both users and search intent, and internal
              linking that helps visitors and search engines understand the site. We treat this as part of the same
              project as web design and development, not something added after launch. For a closer look at how we
              approach that work, visit our{' '}
              <Link href="/seo-services" className="text-primary hover:underline">
                SEO Services
              </Link>{' '}
              page.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-lg text-primary">Branding and Content That Support Your Website</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              A website is one part of a larger system: brand leads into website, website leads into SEO, SEO leads
              into content, and content feeds social. When those pieces are handled separately by different
              vendors, they tend to drift apart, mismatched colors, inconsistent messaging, content that doesn&rsquo;t
              match what the site promises. We handle branding, content marketing, and social media marketing
              alongside web design, so an Arlington business ends up with one consistent presence instead of four
              disconnected ones.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSteps
        heading="How We Work With Arlington Clients"
        description="Our process stays consistent from the first conversation to launch and beyond."
        steps={[
          {
            number: '01',
            title: 'Learn Your Business',
            description: "We start by understanding your customers, your competition, and what your current site is or isn't doing for you.",
          },
          {
            number: '02',
            title: 'Map the Priorities',
            description: "We flag what's actually costing you inquiries, then agree on what gets fixed first.",
          },
          {
            number: '03',
            title: 'Design and Build Together',
            description: 'You see real drafts and structure early, not a single reveal at the end.',
          },
          {
            number: '04',
            title: 'Launch and Adjust',
            description: 'Once the site is live, we watch how Arlington traffic behaves and adjust based on real data, not guesses.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Arlington Businesses Choose Massive Designs"
        columns={5}
        items={[
          {
            title: 'Strategy Before Design',
            description: 'We start with your business goals and how customers move through your site, then design around that, not the other way around.',
          },
          {
            title: 'Design + Development Under One Team',
            description: 'The same team handles design and development, so nothing gets lost in translation between the two.',
          },
          {
            title: 'SEO-Friendly Foundations',
            description: 'Sites are built on a technical foundation, clean code, fast load times, proper structure, that supports search visibility from day one instead of requiring rework later.',
          },
          {
            title: 'Marketing Beyond Launch',
            description: "Launch isn't the finish line. We support SEO, content, and social media after the site is live, so the traffic keeps growing.",
          },
          {
            title: 'Texas-Based Team',
            description: "We're based in North Richland Hills and work with businesses across the DFW area, including Arlington, in person and remotely.",
          },
        ]}
      />

      <section className="pb-14 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h3 className="text-lg text-primary">Serving Arlington and the DFW Area</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Arlington sits inside a larger DFW business market, and many of the companies we work with need
              visibility across more than one city. Beyond Arlington, we build and support websites for businesses
              in{' '}
              <Link href="/areas-we-serve/north-richland-hills" className="text-primary hover:underline">
                North Richland Hills
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/fort-worth" className="text-primary hover:underline">
                Fort Worth
              </Link>
              , Irving,{' '}
              <Link href="/areas-we-serve/grand-prairie" className="text-primary hover:underline">
                Grand Prairie
              </Link>
              , Keller, and Southlake.
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceCta
        heading="Ready to grow your Arlington business?"
        paragraphs={[
          "If you're looking for a web design company in Arlington that builds with SEO and your business goals in mind from day one, let's talk about what that could look like for you.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        onButtonClick={() => setContactOpen(true)}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

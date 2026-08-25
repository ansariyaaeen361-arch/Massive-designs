import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import ServiceCta from '../../components/service-page/ServiceCta';
import Reveal from '../../components/motion/Reveal';
import { brand } from '../../lib/brand';
import { getServicePageNodes } from '../../lib/schema';

import beforeAfter from '../../assets/img/services/content-marketing/before-after-content.webp';
import galleryOne from '../../assets/img/services/content-marketing/content-writting-services-one.webp';
import galleryTwo from '../../assets/img/services/content-marketing/content-writting-services-two.webp';
import galleryThree from '../../assets/img/services/content-marketing/content-writting-services-three.webp';

const gallery = [
  { src: galleryOne, alt: 'Content Marketing Strategy Graphic' },
  { src: galleryTwo, alt: 'Content Distribution Graphic' },
  { src: galleryThree, alt: 'Texas Local Content Marketing Graphic' },
];

export default function ContentMarketing() {
  return (
    <>
      <Seo
        title="Content Writing Services North Richland Hills TX – Massive Designs"
        description="Professional content writing services in North Richland Hills, TX. Massive Designs crafts compelling content to enhance your brand and online presence."
        path="/content-marketing/"
        schemaGraph={getServicePageNodes({
          slug: 'content-marketing',
          serviceName: 'Content Marketing',
          serviceDescription:
            'Content marketing services for businesses in Texas, including strategic content planning, SEO content creation, website content, blog content, and other content designed to attract, engage, and convert target audiences.',
          serviceTypes: [
            'Content Marketing',
            'Content Strategy',
            'SEO Content Writing',
            'Blog Content',
            'Website Content',
            'Content Creation',
            'Content Optimization',
          ],
          pageName: 'Content Marketing in Texas | Massive Designs',
          pageDescription:
            'Massive Designs provides content marketing services for Texas businesses, creating strategic, SEO-focused content that attracts audiences, builds brand authority, and supports business growth.',
        })}
      />
      <ServiceHero
        title="Content Writing Services North Richland Hills TX"
        lead="We provide strategic content marketing and writing services for Texas businesses and turn local searches into consistent leads, stronger visibility, and measurable revenue."
        crumb="Content Marketing"
      />

      <FeatureGrid
        heading="Data Driven Content That Turns Every Texas Click into a Customer"
        description={
          <>
            Turn every search, click, and scroll into a growth opportunity with bespoke content marketing services
            designed specifically for SMBs and startups across Texas from Dallas and Houston to cities across the
            state. From strategy and Search Engine Optimization (SEO) to publishing and{' '}
            <Link to="/social-media-marketing" className="text-primary hover:underline">
              social media marketing
            </Link>
            , every piece of content is engineered to attract qualified traffic, generate leads, and move prospects
            closer to becoming paying customers. Whether you're building brand awareness or driving direct
            conversions, a results-driven content marketing strategy in Texas keeps your business visible where your
            audience is searching.
          </>
        }
        items={[
          { title: 'Content Strategy Plans', description: 'We build Texas-focused content strategies that drive qualified traffic, leads, and sales for growing businesses.' },
          { title: 'SEO Content Creation', description: 'We craft SEO content for Texas that ranks, attracts buyers, and converts visits into enquiries.' },
          { title: 'Multi-Channel Promotion', description: 'We promote your content across email, social media, and platforms, turning Texas visibility into measurable revenue.' },
        ]}
      />

      <ProcessSteps
        heading="The Content Engine Behind Results"
        description="Build a unified content engine that supports search, social, and paid campaigns while positioning your business as a trusted authority. From Abilene to Austin and Irving to Houston, your content is tailored to local markets but guided by a state-wide growth strategy."
        steps={[
          { number: '01', title: 'Content Strategy Roadmaps', description: 'We plan what to publish, when, and why, aligning every asset with clear marketing goals and measurable business outcomes.' },
          { number: '02', title: 'Blog & Article Writing', description: 'We create focused articles that answer real customer questions, increase visibility, and move local readers toward your offers.' },
          { number: '03', title: 'B2B Content Marketing', description: 'We develop thought-leadership, comparisons, and case studies that support longer sales cycles and help decision-makers choose confidently.' },
          { number: '04', title: 'SEO, PPC, Landing Page Content', description: 'We write and optimize landing pages that match ad messaging, capture intent, and convert both organic and paid visitors.' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Build Content That Actually Gets Read</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              We turn quiet pages into high-performing content assets that attract the right visitors and support
              sales across Texas.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <Reveal className="overflow-hidden rounded-3xl lg:col-span-2">
              <img
                src={beforeAfter}
                alt="Content Marketing Texas"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg text-primary">What Changes With Us</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Your content shifts from scattered posts to a focused system that consistently attracts, educates,
                and converts buyers.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Visitors stay longer on key pages
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Messages feel clearer and more focused
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  More qualified enquiries from content
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Our Creative Content Marketing Work</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Explore a few of our content samples and ad creatives that helped brands across Texas build meaningful
              connections with their audiences.
            </p>
          </Reveal>

          <Reveal delay={0.1} as="div" className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.alt} className="overflow-hidden rounded-3xl">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        columns={4}
        heading="How We Work on Your Content"
        description="We keep the process simple and transparent so your team always knows what is happening and why."
        items={[
          { title: '01 — Understand Your Reality', description: 'We learn how your buyers search, what they struggle with, and which touchpoints already influence their decisions.' },
          { title: '02 — Prioritize Content Gaps', description: 'We highlight missing answers, weak pages, and unclear messages, then agree on which problems to solve first together.' },
          { title: '03 — Collaborate on Drafts', description: 'We share structured outlines and drafts in stages, making feedback easier and keeping approvals moving without delays.' },
          { title: '04 — Learn from Behaviour', description: 'We review how people interact with your content, then adjust topics, angles, and depth based on real usage.' },
        ]}
      />

      <FeatureGrid
        heading="Why Teams Choose Our Content Marketing Services"
        description="We focus on intent, performance, and local insight so your content supports real growth—not just more pages."
        items={[
          { title: 'Search-First Approach', description: 'Content aligns with real queries, helping the right people find you when they actively need solutions.' },
          { title: 'Integrated Support Model', description: 'Strategy, writing, and optimization work together, reducing guesswork and keeping campaigns aligned across channels.' },
          { title: 'Local Market Understanding', description: 'Experience with Texas markets means messaging, examples, and topics feel relevant to your regional audience.' },
        ]}
      />

      <ServiceCta
        heading="Ready to Turn Texas Traffic Into Customers?"
        paragraphs={[
          "If you're looking for a content marketing agency in Texas that genuinely understands local markets, modern SEO best practices, and conversion-focused strategy, a tailored content plan can help you compete and win in search.",
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

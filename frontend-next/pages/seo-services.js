import Link from 'next/link';
import Seo from '../components/layout/Seo';
import ServiceHero from '../components/service-page/ServiceHero';
import FeatureGrid from '../components/service-page/FeatureGrid';
import ProcessSteps from '../components/service-page/ProcessSteps';
import ServiceCta from '../components/service-page/ServiceCta';
import Reveal from '../components/motion/Reveal';
import { brand } from '../lib/brand';
import { getServicePageNodes } from '../lib/schema';

const gallery = [
  { src: '/img/services/seo/seo-gallery-1.webp', alt: 'SEO Strategy Plan' },
  { src: '/img/services/seo/seo-gallery-2.webp', alt: 'Marketing Team' },
  { src: '/img/services/seo/seo-gallery-3.webp', alt: 'Analytics Dashboard' },
];

export default function SeoServices() {
  return (
    <>
      <Seo
        title="SEO Services in North Richland Hills Texas – Massive Designs"
        description="Expert SEO services in North Richland Hills, TX local SEO, technical optimisation, and content strategies to grow your business online."
        path="/seo-services"
        schemaGraph={getServicePageNodes({
          slug: 'seo-services',
          serviceName: 'SEO Services',
          serviceDescription:
            'SEO services for businesses in Texas, including search engine optimization strategies designed to improve organic visibility, search rankings, website traffic, and long-term online growth.',
          serviceTypes: [
            'Search Engine Optimization',
            'SEO Services',
            'Local SEO',
            'On-Page SEO',
            'Technical SEO',
            'SEO Content Optimization',
            'Keyword Research',
            'Organic Search Optimization',
          ],
          pageName: 'SEO Services in Texas | Massive Designs',
          pageDescription:
            'Massive Designs provides SEO services for Texas businesses to improve search visibility, organic rankings, website traffic, and long-term online growth.',
        })}
      />
      <ServiceHero
        title="SEO Services in North Richland Hills Texas"
        lead="Texas is crowded, but your business shouldn't be. Our SEO services mix affordable options with smart SEO optimization services to turn searches into real customers."
        crumb="SEO Services"
        ctaLabel="Call +1 786 936 4483"
        ctaHref="tel:+17869364483"
      />

      <FeatureGrid
        heading="Search Engine Optimization Best Practices for Websites"
        description={
          <>
            Over the past decade, our SEO services have helped Texas businesses turn stagnant websites into steady
            leads and revenue by following real search engine optimization best practices for websites, not
            shortcuts. Each SEO strategy is built on research, analytics, and technical fixes that make your site
            faster, clearer, and easier to find. When combined with our{' '}
            <Link href="/content-marketing" className="text-primary hover:underline">
              Content Marketing Services
            </Link>
            , your SEO efforts work together to attract qualified visitors and convert more of them into paying
            customers.
          </>
        }
        items={[
          { title: 'Local SEO Expertise', description: 'Win more nearby customers with local SEO services that optimize maps, local keywords, and your Google Business Profile.' },
          { title: 'Content & Link Authority', description: 'Build trust with search engines through high-quality content and ethical backlink strategies that strengthen your domain authority.' },
          { title: 'Performance & Reporting Insights', description: "Stay informed with clear monthly reporting on traffic, rankings, conversions, and what we're improving next." },
        ]}
      />

      <ProcessSteps
        heading="How Our SEO Process Delivers Consistent Growth?"
        description="From initial audit to ongoing refinement, each step in our SEO process is designed to improve visibility and long-term results."
        steps={[
          { number: '01', title: 'Discovery, Audit & Strategy', description: 'We review your website, analytics, and competitors to uncover technical issues, search opportunities, and a clear roadmap for growth.' },
          { number: '02', title: 'On-Page Optimization', description: 'From titles and internal links to UX, we refine key pages so search engines understand your site and visitors find what they need.' },
          { number: '03', title: 'Search Visibility & Link Growth', description: 'We strengthen your presence in search results with targeted improvements and relevant links that support stronger rankings over time.' },
          { number: '04', title: 'Measurement & Refinement', description: 'We track rankings, traffic, and leads regularly so your SEO keeps pace with algorithm changes and shifting user behavior.' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">SEO Results That Transform Visibility</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Our SEO services help brands climb search rankings, boost organic traffic, and grow long-term digital
              authority.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <Reveal className="overflow-hidden rounded-3xl lg:col-span-2">
              <img
                src="/img/services/seo/before-after-seo.webp"
                alt="SEO growth analytics"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg text-primary">Houston, Austin & San Antonio SEO</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                We help Texas businesses in major cities grow with localized, targeted SEO campaigns.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  City-specific keyword optimization
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Technical site enhancements
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Continuous performance tracking
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Our SEO Work & Results</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              See how we've helped Texas brands grow visibility, traffic, and conversions with strategic SEO.
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
        heading="Targeted SEO Solutions for Texas Growth"
        description="We deliver affordable SEO services in Texas focused on steady visibility, quality traffic, and clear ROI."
        items={[
          { title: 'Local Search Visibility', description: 'Local SEO services help you appear in nearby searches, map results, and review-rich listings.' },
          { title: 'Technical Site Health', description: 'Technical SEO services improve crawlability, structure, and speed so search engines understand your website.' },
          { title: 'Content Optimization', description: 'We shape on-page content around user intent, turning search visits into meaningful inquiries and sales.' },
          { title: 'Clear Performance Reporting', description: 'You receive concise monthly reports highlighting growth, key wins, and next SEO priorities for your business.' },
        ]}
      />

      <FeatureGrid
        heading="Why Choose Massive Designs for SEO?"
        description="We blend strategy, creativity, and data to deliver powerful, long-term SEO results for Texas businesses."
        items={[
          { title: 'Affordable Packages', description: 'Get premium results at competitive prices with full transparency.' },
          { title: 'Proven Local Expertise', description: "We've delivered measurable SEO growth for businesses across Texas." },
          { title: 'Result-Driven Approach', description: 'We focus on leads, conversions, and ROI — not just rankings.' },
        ]}
      />

      <ServiceCta
        heading="Ready to Grow? Let's Build Your SEO Success"
        paragraphs={[
          "It's time to secure more exposure, clients, and growth. Massive Designs provides proven SEO strategies that help Texas companies beat the competition and grow faster.",
        ]}
        buttonLabel="Rank Higher and Generate More Leads"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

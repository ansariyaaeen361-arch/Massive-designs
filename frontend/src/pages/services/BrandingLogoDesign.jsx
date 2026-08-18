import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import ServiceCta from '../../components/service-page/ServiceCta';
import Reveal from '../../components/motion/Reveal';
import { brand } from '../../lib/brand';
import { getServicePageNodes } from '../../lib/schema';

import beforeAfter from '../../assets/img/services/before-after-branding.webp';
import logo1 from '../../assets/img/services/branding-logos/logo-1.webp';
import logo2 from '../../assets/img/services/branding-logos/logo-2.webp';
import logo3 from '../../assets/img/services/branding-logos/logo-3.webp';
import logo4 from '../../assets/img/services/branding-logos/logo-4.webp';
import logo5 from '../../assets/img/services/branding-logos/logo-5.webp';

const galleryLogos = [
  { src: logo1, alt: 'Bun and Guns logo' },
  { src: logo2, alt: 'Anointed Hands Logo' },
  { src: logo3, alt: "Brooklyn's Logo" },
  { src: logo4, alt: 'Trinity Logo' },
  { src: logo5, alt: '2 Twenty Customs Logo' },
];

export default function BrandingLogoDesign() {
  return (
    <>
      <Seo
        title="Branding & Logo Design North Richland Hills Texas – Massive Designs"
        description="Massive Designs offers professional branding and logo design in North Richland Hills, TX building strong, creative, and growth-focused brand identities."
        path="/branding-logo-design"
        schemaGraph={getServicePageNodes({
          slug: 'branding-logo-design',
          serviceName: 'Branding & Logo Design',
          serviceDescription:
            'Strategic branding and logo design services for businesses in Texas, including custom logo design, brand identity, brand guidelines, business cards, brochures, flyers, and digital brand assets.',
          serviceTypes: [
            'Logo Design',
            'Brand Identity Design',
            'Brand Guidelines',
            'Business Card Design',
            'Brochure Design',
            'Flyer Design',
            'Digital Brand Asset Design',
          ],
          pageName: 'Branding & Logo Design in Texas | Massive Designs',
          pageDescription:
            'Massive Designs provides strategic branding and logo design services for Texas businesses, including custom logos, brand identity systems, brand guidelines, and digital and print assets.',
        })}
      />
      <ServiceHero
        title="Creative Branding & Logo Design Texas"
        lead="We design strategic brand identities and custom logos that boost recognition and drive business growth statewide."
        crumb="Branding Logo Design"
      />

      <FeatureGrid
        heading="Strategic Brand Identity and Design Solutions"
        description={
          <>
            Your logo should speak with purpose, not just style. Based in North Richland Hills, massive designs
            crafts brand identities that connect emotionally and perform commercially. Through creative logo design
            and{' '}
            <Link to="/content-marketing" className="text-primary hover:underline">
              content marketing
            </Link>
            , we turn visuals into strategies that attract customers, strengthen credibility, and grow your brand
            naturally.
          </>
        }
        items={[
          { title: 'Research-first Approach', description: 'Every detail of your logo design will contribute — the psychology of colors, typography, and positioning.' },
          { title: 'Cross-platform Ready', description: 'We create visuals that scale perfectly across web, print, and social platforms.' },
          { title: 'Strategic Visuals', description: 'Designs that communicate brand values and convert visitors into customers.' },
        ]}
      />

      <ProcessSteps
        heading="Our Simple Yet Powerful Branding Process"
        description="Every good brand begins with a strategy. We start with discovery, research the market, create concepts, and deliver a final brand kit ready for digital and print."
        steps={[
          { number: '01', title: 'Discovery', description: 'We run a focused session to learn your vision, audience and business goals.' },
          { number: '02', title: 'Research', description: 'Market & competitor research to find differentiation and visual opportunity.' },
          { number: '03', title: 'Concept Creation', description: 'Multiple directions are developed with typography, color studies and variations.' },
          { number: '04', title: 'Delivery', description: 'Final logos, assets, and implementation support for print and digital use.' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Before and After — A Visual Transformation</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              See how professional design transforms business perception and increases recognition.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <Reveal className="overflow-hidden rounded-3xl lg:col-span-2">
              <img
                src={beforeAfter}
                alt="Texas Brand Identity Services"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg text-primary">Rebranding Impact</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                A refreshed identity signals quality, trust, and innovation — converting more viewers into customers.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Higher brand recognition
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Stronger customer trust
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Consistent multi-platform presence
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Explore Our Logo Gallery</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Browse recent logos designed for startups, small businesses and established brands in Texas.
            </p>
          </Reveal>

          <Reveal delay={0.1} as="div" className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {galleryLogos.map((logo) => (
              <div
                key={logo.alt}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 hover:border-primary/40"
              >
                <img src={logo.src} alt={logo.alt} loading="lazy" className="aspect-square w-full object-cover" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        columns={4}
        heading="Complete Texas Brand Identity Services"
        description="Logo design is just the start. We build full identities including business cards, brochures, flyers and brand guidelines for a cohesive presence."
        items={[
          { title: 'Business Cards', description: 'Create memorable first impressions with high-quality card layouts and print-ready files.' },
          { title: 'Brochures & Flyers', description: 'Print-ready campaigns designed to match your brand tone and marketing goals.' },
          { title: 'Brand Guidelines', description: 'Typography, color systems, usage rules and logo variations to keep your brand consistent.' },
          { title: 'Digital Assets', description: 'Social, web, and presentation assets optimized for each platform.' },
        ]}
      />

      <FeatureGrid
        heading="Why Choose Massive Designs?"
        description="We combine strategy and creativity so your brand is remembered locally across Texas and online. No templates — custom work that fits your goals and budget."
        items={[
          { title: 'Creative + Strategic', description: 'Designs that are beautiful and purposeful.' },
          { title: 'Affordable Packages', description: 'Premium work without wasting budget.' },
          { title: 'Local Expertise', description: 'We know Houston, Austin, Dallas & San Antonio markets.' },
        ]}
      />

      <ServiceCta
        heading="Building Your Brand Together"
        paragraphs={[
          'Begin the road to a stronger brand identity. Contact Massive Designs and get a free consultation.',
        ]}
        buttonLabel="Request Free Consultation"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

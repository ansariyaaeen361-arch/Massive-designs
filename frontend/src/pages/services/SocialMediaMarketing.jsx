import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import ServiceCta from '../../components/service-page/ServiceCta';
import Reveal from '../../components/motion/Reveal';
import { brand } from '../../lib/brand';

import beforeAfter from '../../assets/img/home/dm-srv003.webp';
import galleryClients from '../../assets/img/services/social-gallery/gallery-clients.webp';
import galleryStrategy from '../../assets/img/services/social-gallery/gallery-strategy.webp';
import galleryAds from '../../assets/img/services/social-gallery/gallery-ads.webp';

const gallery = [
  { src: galleryClients, alt: 'Social Media Post Design' },
  { src: galleryStrategy, alt: 'Social Media Strategy' },
  { src: galleryAds, alt: 'Ad Campaign Design' },
];

export default function SocialMediaMarketing() {
  return (
    <>
      <Seo
        title="Social Media Marketing Services in Texas | Massive Designs"
        description="Boost your brand engagement and online presence with professional Social Media Marketing services in Texas. Massive Designs helps you grow across Facebook, Instagram, LinkedIn, and more through creative strategy and performance-driven campaigns."
        path="/social-media-marketing"
      />
      <ServiceHero
        title="Social Media Marketing in Texas for Growing Local Brands"
        lead="Texas businesses get strategic social media marketing that builds awareness, engagement, and dependable leads through locally focused campaigns."
        crumb="Social Media Marketing"
      />

      <FeatureGrid
        heading="Top Social Media Marketing Agency in Texas"
        description={
          <>
            At Massive Designs, we build your social media campaigns around your specific Texas audience, industry,
            and growth goals. From content calendars and paid campaigns to community engagement, we align your
            social media with your broader digital presence, including{' '}
            <Link to="/web-design-development" className="text-primary hover:underline">
              web design & development
            </Link>
            , logo & branding, so your brand feels consistent and trustworthy. With creative content, targeted ads,
            and consistent engagement across Facebook, Instagram, LinkedIn, and other key platforms, we build loyal
            communities, generate qualified leads, and turn your social presence into a measurable growth engine.
          </>
        }
        items={[
          { title: 'Engaging Content Creation', description: 'We design creative posts, stories, and reels that represent your brand identity and inspire action among followers.' },
          { title: 'Targeted Advertising Campaigns', description: 'Our social media ads reach the right audience at the right time, maximizing engagement and return on investment.' },
          { title: 'Analytics & Growth Tracking', description: 'We monitor insights, optimize content, and deliver clear performance reports to ensure consistent growth.' },
        ]}
      />

      <ProcessSteps
        heading="How We Grow Texas Brands on Social"
        description="Our process blends creativity with data to deliver impactful social media results. From planning to execution, we focus on connecting your brand with your audience effectively."
        steps={[
          { number: '01', title: 'Research & Strategy', description: 'We study your Texas market, audience, and competitors, then map a focused social media strategy.' },
          { number: '02', title: 'Content Creation', description: 'Our team designs on-brand visuals and writes clear captions that speak to your local customers.' },
          { number: '03', title: 'Campaign Management', description: 'We manage targeted Facebook, Instagram, and LinkedIn campaigns to increase visibility, engagement, and qualified leads.' },
          { number: '04', title: 'Analytics & Optimization', description: 'We track performance, review what works, and refine your social media marketing for better long-term results.' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Transform Your Brand&rsquo;s Social Media Presence</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              From low engagement to powerful brand awareness — our social media strategies help businesses grow
              followers, reach, and conversions.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <Reveal className="overflow-hidden rounded-3xl lg:col-span-2">
              <img
                src={beforeAfter}
                alt="Social Media Marketing Texas"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg text-primary">Before & After Impact</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                We turn inactive profiles into consistent, creative, and high-performing social pages with measurable
                growth.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Improved engagement rates
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Strong brand storytelling
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Better follower retention
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Our Creative Social Media Work</h2>
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
        heading="Social Media Platforms We Manage"
        description="We help Texas businesses show up consistently on the social media platforms that matter most to their customers."
        items={[
          { title: 'Instagram Marketing', description: 'Eye-catching visuals and captions that reflect your brand tone and message.' },
          { title: 'LinkedIn Marketing', description: 'Publish professional content that builds authority, supports B2B relationships, and attracts qualified leads across Texas.' },
          { title: 'Facebook Marketing', description: 'Run targeted Facebook campaigns that boost local visibility, nurture interest, and turn followers into loyal buyers.' },
          { title: 'TikTok Marketing', description: 'Use short, trend-aware videos to introduce your brand, spark curiosity, and reach new audiences quickly.' },
        ]}
      />

      <FeatureGrid
        heading="Why Choose Massive Designs for Social Media Marketing?"
        description="We combine creativity with analytics to help brands communicate effectively, gain loyal audiences, and achieve consistent growth across platforms."
        items={[
          { title: 'Creative Team', description: 'Our designers and strategists build unique, brand-driven content that performs.' },
          { title: 'Targeted Growth', description: 'We focus on audience targeting that brings real engagement and conversions.' },
          { title: 'Transparent Reporting', description: 'Track results with regular performance reports and analytics insights.' },
        ]}
      />

      <ServiceCta
        heading="Let&rsquo;s Grow Your Brand on Social Media"
        paragraphs={[
          <>
            Ready to build meaningful connections and boost engagement? Partner with{' '}
            <Link to="/" className="text-primary hover:underline">
              Massive Designs
            </Link>{' '}
            for expert social media marketing in Texas.
          </>,
          "We'll help you create impactful strategies that bring visibility, credibility, and loyal followers to your brand.",
        ]}
        buttonLabel="Request Free Consultation"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

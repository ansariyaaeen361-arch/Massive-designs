import { Link } from 'react-router-dom';
import Seo from '../../components/layout/Seo';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import ServiceCta from '../../components/service-page/ServiceCta';
import Reveal from '../../components/motion/Reveal';
import { brand } from '../../lib/brand';
import { getServicePageNodes } from '../../lib/schema';

import beforeAfter from '../../assets/img/services/mobile-app/before-after-app.webp';
import galleryOne from '../../assets/img/services/mobile-app/app-gallery-1.webp';
import galleryTwo from '../../assets/img/services/mobile-app/app-gallery-2.webp';
import galleryThree from '../../assets/img/services/mobile-app/app-gallery-3.webp';

const gallery = [
  { src: galleryOne, alt: 'Mobile App UI Screens' },
  { src: galleryTwo, alt: 'Travel App Booking Screens' },
  { src: galleryThree, alt: 'Travel App Promo Screens' },
];

export default function MobileAppDevelopment() {
  return (
    <>
      <Seo
        title="Mobile App Development North Richland Hills TX – Massive Designs"
        description="We create mobile apps in North Richland Hills, TX that combine creativity, strategy, and performance to drive growth and user engagement."
        path="/mobile-app-development"
        schemaGraph={getServicePageNodes({
          slug: 'mobile-app-development',
          serviceName: 'Mobile App Development',
          serviceDescription:
            'Mobile app development services for businesses in Texas, including custom mobile application design and development focused on performance, usability, scalability, and business needs.',
          serviceTypes: [
            'Mobile App Development',
            'Custom App Development',
            'iOS App Development',
            'Android App Development',
            'Mobile Application Design',
            'Cross-Platform App Development',
            'App UI/UX Design',
          ],
          pageName: 'Mobile App Development in Texas | Massive Designs',
          pageDescription:
            'Massive Designs provides custom mobile app development services for Texas businesses, creating scalable, user-friendly applications designed around business goals and customer needs.',
        })}
      />
      <ServiceHero
        title="Texas Mobile App Development for Growing Businesses"
        lead="We provide end-to-end mobile app development services, designing secure iOS and Android apps that help Texas companies streamline operations and drive measurable growth."
        crumb="Mobile App Development"
      />

      <FeatureGrid
        heading="Custom Mobile App Development Services for Texas Brands"
        description={
          <>
            <Link to="/" className="text-primary hover:underline">
              Massive Designs
            </Link>{' '}
            works with Texas companies to plan, design, and launch custom mobile apps that tackle everyday
            operational problems and open up new digital revenue streams through expert mobile app development
            services. Each product is shaped to fit your brand and connected to your existing{' '}
            <Link to="/web-design-development" className="text-primary hover:underline">
              web design and development
            </Link>{' '}
            presence, so customers move naturally between your website and app without friction.
          </>
        }
        items={[
          { title: 'Beautiful UI/UX Design', description: 'Our design team crafts intuitive interfaces and smooth interactions focused on accessibility, usability and engagement.' },
          { title: 'Expert iOS & Android Development', description: 'We build native and cross-platform apps using modern frameworks and best practices for performance and security.' },
          { title: 'Scalable, Reliable Solutions', description: 'From real-time features to complex databases, we deliver scalable apps that grow with your business.' },
        ]}
      />

      <ProcessSteps
        heading="Our App Development Process"
        description="We start with your vision, analyse user behaviour, and follow a scalable plan. Our team designs, develops, tests and deploys your app with clear communication at every step."
        steps={[
          { number: '01', title: 'Discovery', description: 'We run focused sessions to understand your idea, users and business goals.' },
          { number: '02', title: 'Planning & Design', description: 'UI/UX wireframes, prototypes and user flows are created to validate the experience.' },
          { number: '03', title: 'Development', description: 'We implement the app using the right stack — Swift, Kotlin, React Native or Flutter — with emphasis on stability and performance.' },
          { number: '04', title: 'QA & Launch', description: 'Thorough testing, app store submission support, and post-launch monitoring ensure a smooth release.' },
        ]}
      />

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Mobile Experiences That Improve Business Efficiency</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              We build business apps that automate workflows, reduce manual tasks, and increase productivity — from
              sales tracking to inventory management.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <Reveal className="overflow-hidden rounded-3xl lg:col-span-2">
              <img
                src={beforeAfter}
                alt="Cross-Platform Mobile App Development"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg text-primary">Custom Business Apps</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                We build workflow-oriented apps tailored to your operations — saving time and reducing errors through
                smart automation.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/50">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Automated workflows
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  System integrations
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Improved team efficiency
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Examples & Screenshots</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Browse sample screens and app concepts we have designed for startups and enterprises across Texas.
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
        heading="Mobile App Services We Provide"
        description="We provide end-to-end mobile app services that turn ideas into reliable products."
        items={[
          { title: 'Custom App Design & Development', description: 'We plan, design and build custom mobile apps that match your goals and deliver smooth user experiences.' },
          { title: 'Cross-Platform App Development', description: 'We develop iOS and Android apps together, reducing costs while keeping performance, security and usability consistently high.' },
          { title: 'App Maintenance & Support', description: 'We manage app updates, bug fixes and improvements so your product remains stable, secure and user-friendly long term.' },
          { title: 'Analytics, Strategy & Monetization', description: 'We track user behavior, shape product strategy and refine monetization models to grow engagement and recurring revenue.' },
        ]}
      />

      <FeatureGrid
        heading="Why Choose Massive Designs for App Development?"
        description="We are your technology partners — delivering research-driven, dependable mobile products. Our team has experience with startups, local businesses and enterprises across Texas, providing speed, quality and results."
        items={[
          { title: 'Experienced Team', description: 'Developers and designers who build production-ready apps.' },
          { title: 'Affordable Packages', description: 'Transparent pricing and flexible engagement models without compromising quality.' },
          { title: 'Cross-platform Expertise', description: 'Native and cross-platform solutions using Swift, Kotlin, React Native and Flutter.' },
        ]}
      />

      <ServiceCta
        heading="Your Success Is Our Priority — Let's Build Something Great Together"
        paragraphs={[
          'Willing to make your vision come true? Collaborate with Massive Designs and get the best mobile app development in Texas. Our team will take you through the initial idea to launch with effective communication and professional assistance.',
          'Get in touch with us, and we will create an application to expand your business and make users happy.',
        ]}
        buttonLabel="Request Free Consultation"
        buttonHref={brand.emailLink}
      />
    </>
  );
}

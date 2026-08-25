import { HiOutlineGlobeAlt, HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';
import AmbientGlow from '../components/motion/AmbientGlow';
import ContactForm from '../components/forms/ContactForm';
import SocialLinks from '../components/layout/SocialLinks';
import { brand } from '../lib/brand';
import { SITE_URL } from '../lib/schema';

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us - Massive Designs"
        description="Have a project? Reach out to Massive Designs in Texas for custom websites, branding or marketing solutions that help your business shine online."
        path="/contact"
        schemaGraph={[
          {
            '@type': 'ContactPage',
            '@id': `${SITE_URL}/contact/#webpage`,
            url: `${SITE_URL}/contact/`,
            name: 'Contact Massive Designs',
            description:
              'Contact Massive Designs for web design, SEO, branding, content marketing, social media marketing, and mobile app development services in Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            mainEntity: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-US',
          },
        ]}
      />
      <PageHeader title="Contact us" crumb="Contact us" />

      <section className="relative isolate py-16 lg:py-24">
        <AmbientGlow position="top-right" size="md" intensity="low" />
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl">
              Let&rsquo;s Build Something Massive &ndash; Contact Massive Designs Today
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
              Ready to take the next step? Call, email or fill out the contact form now. Our team is going to be
              responsive to talk about your ideas. Together, we must create something massive and make your online
              presence memorable in Texas and beyond.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
              <div className="flex items-start gap-4 sm:pr-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HiOutlineLocationMarker className="text-lg" />
                </span>
                <div>
                  <h3 className="text-sm text-white">Location</h3>
                  <p className="mt-1 text-sm text-white/50">{brand.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:px-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HiOutlineMail className="text-lg" />
                </span>
                <div>
                  <h3 className="text-sm text-white">Contact</h3>
                  <p className="mt-1 text-sm text-white/50">
                    <a href={brand.emailLink} className="transition-colors hover:text-primary">
                      {brand.email}
                    </a>{' '}
                    or call{' '}
                    <a href={brand.phoneTel} className="transition-colors hover:text-primary">
                      {brand.phoneDisplay}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:pl-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HiOutlineGlobeAlt className="text-lg" />
                </span>
                <div>
                  <h3 className="text-sm text-white">Social</h3>
                  <SocialLinks className="mt-3" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-16 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Get In Touch</p>
            <h3 className="mt-4 text-2xl text-white sm:text-3xl">
              Share your creative ideas with us and get back designs that impress and engage
            </h3>
          </Reveal>

          <Reveal delay={0.2} className="mt-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-12">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

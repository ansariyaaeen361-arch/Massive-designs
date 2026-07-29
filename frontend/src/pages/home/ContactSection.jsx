import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import Reveal from '../../components/motion/Reveal';
import AmbientGlow from '../../components/motion/AmbientGlow';
import ContactForm from '../../components/forms/ContactForm';
import SocialLinks from '../../components/layout/SocialLinks';
import { brand } from '../../lib/brand';

const infoItems = [
  { icon: HiOutlineLocationMarker, label: 'Office', value: brand.location },
  { icon: HiOutlinePhone, label: 'Phone', value: brand.phoneDisplay, href: brand.phoneTel },
  { icon: HiOutlineMail, label: 'Email', value: brand.email, href: brand.emailLink },
  { icon: HiOutlineClock, label: 'Working Days', value: brand.openDays },
];

export default function ContactSection() {
  return (
    <section className="relative isolate py-16 lg:py-24">
      <AmbientGlow position="top-left" size="lg" intensity="low" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h3 className="text-4xl sm:text-5xl">
              Let&apos;s Build Something <span className="text-primary">Great Together</span>
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/50">
              Submit your creative ideas and get a response on appealing and inspiring designs. Our plan combines
              design, development, and marketing to enhance successful business expansion.
            </p>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.15} y={36} className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Get In Touch</p>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Prefer to reach out directly? Here&apos;s everything you need to talk to our team.
              </p>

              <ul className="mt-8 flex flex-col gap-6">
                {infoItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="text-lg" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-white/40">{label}</span>
                      {href ? (
                        <a href={href} className="mt-1 block text-sm text-white transition-colors hover:text-primary">
                          {value}
                        </a>
                      ) : (
                        <span className="mt-1 block text-sm text-white">{value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-wide text-white/40">Follow Us</p>
                <SocialLinks className="mt-4" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

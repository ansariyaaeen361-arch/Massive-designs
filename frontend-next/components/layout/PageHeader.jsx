import Link from 'next/link';
import Reveal from '../motion/Reveal';
import AmbientGlow from '../motion/AmbientGlow';

export default function PageHeader({ title, crumb, action }) {
  return (
    <section className="relative isolate border-b border-white/10 pb-14 pt-36 lg:pt-44">
      <AmbientGlow position="top-center" size="lg" intensity="low" />
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <Reveal as="h1" className="text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </Reveal>
        <Reveal delay={0.1} as="nav" aria-label="Breadcrumb" className="mt-5">
          <ol className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-white/40">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-primary">{crumb ?? title}</li>
          </ol>
        </Reveal>
        {action && (
          <Reveal delay={0.15} as="div" className="mt-8">
            {action}
          </Reveal>
        )}
      </div>
    </section>
  );
}

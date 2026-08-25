import { useRef } from 'react';
import Link from 'next/link';
import { HiCheck } from 'react-icons/hi';
import useTilt from '../../hooks/useTilt';

export default function PricingCard({ badge, title, sub, oldPrice, price, features, highlight }) {
  const cardRef = useRef(null);
  useTilt(cardRef);

  return (
    <div
      ref={cardRef}
      className={`flex h-full flex-col rounded-3xl border p-8 ${
        highlight ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-white/5'
      }`}
    >
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-primary/15 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {badge}
        </span>
      )}
      <h3 className="mt-5 text-xl text-white">{title}</h3>
      {sub && <p className="mt-2 text-sm text-white/50">{sub}</p>}

      <div className="mt-5 flex items-end gap-3">
        {oldPrice && <span className="text-sm text-white/30 line-through">{oldPrice}</span>}
        <span className="font-heading text-3xl text-primary">{price}</span>
        <span className="pb-1 text-xs uppercase tracking-wide text-white/50">one-time</span>
      </div>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm text-white/60">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <HiCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
      >
        Order Now
      </Link>
    </div>
  );
}

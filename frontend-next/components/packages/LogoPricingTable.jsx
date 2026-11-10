import Link from 'next/link';
import { HiCheck, HiMinus } from 'react-icons/hi';
import { trackEvent } from '../../lib/analytics';

const ROWS = [
  { label: 'Logo Design', sub: 'Revisions', standard: 'Unlimited revisions', premium: 'Unlimited revisions' },
  { label: 'PDF Files', sub: 'Print-ready files', standard: true, premium: true },
  { label: 'Vector Files', sub: 'Infinitely scalable', standard: 'AI, EPS & SVG', premium: 'AI, EPS & SVG' },
  { label: 'Image Files', sub: 'Transparent and opaque files', standard: 'PNG & JPG', premium: 'PNG & JPG' },
  { label: 'Colors', sub: 'Color options', standard: 'Multiple colors', premium: 'Multiple colors' },
  { label: '', sub: 'Metallic finishes', standard: 'Gold & silver', premium: 'Gold, silver & copper' },
  { label: '', sub: 'Gradients', standard: 'Optional', premium: 'Optional' },
  { label: 'Logo Wording', sub: 'Custom logo wording', standard: true, premium: true },
  { label: 'Mockups', sub: 'Mockups to showcase your logo', standard: false, premium: 'Business card mockup' },
  { label: 'Video Showcase', sub: 'A video featuring your logo', standard: false, premium: true },
];

const PLANS = [
  { key: 'standard', name: 'Standard', tagline: 'Static logo', price: '$100', priceNote: 'Best Value' },
  { key: 'premium', name: 'Premium', tagline: 'Customizable', price: '$250', priceNote: 'From', highlight: true },
];

function Cell({ value }) {
  if (value === true) return <HiCheck className="mx-auto h-5 w-5 text-primary" />;
  if (value === false) return <HiMinus className="mx-auto h-4 w-4 text-white/20" />;
  return <span className="text-sm text-white/70">{value}</span>;
}

export default function LogoPricingTable() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-[38%] px-6 py-6 sm:px-8">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Explore Pricing</p>
                <h3 className="mt-2 text-xl text-white sm:text-2xl">Comparison</h3>
              </th>
              {PLANS.map((plan) => (
                <th
                  key={plan.key}
                  className={`px-4 py-6 text-center sm:px-6 ${plan.highlight ? 'bg-primary/5' : ''}`}
                >
                  <p className={`font-heading text-lg sm:text-xl ${plan.highlight ? 'text-primary' : 'text-white'}`}>
                    {plan.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{plan.tagline}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-4 sm:px-8">
                  {row.label && <p className="text-sm font-medium text-white">{row.label}</p>}
                  <p className="text-xs text-white/50">{row.sub}</p>
                </td>
                <td className="px-4 py-4 text-center sm:px-6">
                  <Cell value={row.standard} />
                </td>
                <td className="bg-primary/5 px-4 py-4 text-center sm:px-6">
                  <Cell value={row.premium} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="px-6 py-8 sm:px-8" />
              {PLANS.map((plan) => (
                <td
                  key={plan.key}
                  className={`px-4 py-8 text-center sm:px-6 ${plan.highlight ? 'bg-primary/5' : ''}`}
                >
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${
                      plan.highlight ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {plan.priceNote}
                  </span>
                  <p className={`mt-2 font-heading text-3xl sm:text-4xl ${plan.highlight ? 'text-primary' : 'text-white'}`}>
                    {plan.price}
                  </p>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-white/10 p-6 sm:grid-cols-2 sm:p-8">
        {PLANS.map((plan) => (
          <Link
            key={plan.key}
            href="/contact"
            onClick={() => trackEvent('cta_click', { source: 'logo_pricing_table', package: plan.name })}
            className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition-colors ${
              plan.highlight
                ? 'border-primary/50 bg-primary/10 hover:bg-primary/15'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-sm text-white">{plan.name}</span>
            <span className={`text-sm font-medium ${plan.highlight ? 'text-primary' : 'text-white/70'}`}>
              {plan.priceNote} <span className="font-heading text-base">{plan.price}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

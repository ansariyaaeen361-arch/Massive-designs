import Counter from './Counter';

export default function StatBadge({ value, suffix = '', label, className = '' }) {
  return (
    <div className={`absolute rounded-2xl bg-primary px-8 py-8 shadow-2xl sm:px-10 sm:py-10 ${className}`}>
      <p className="font-heading text-5xl leading-none text-black sm:text-6xl">
        <Counter to={value} suffix={suffix} />
      </p>
      <p className="mt-3 max-w-[9rem] text-xs font-medium uppercase leading-snug tracking-wide text-black/70 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

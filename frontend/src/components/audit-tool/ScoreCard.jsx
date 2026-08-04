import Counter from '../motion/Counter';

function scoreColor(score) {
  if (score >= 80) return 'text-primary';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export default function ScoreCard({ icon: Icon, label, score }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="text-lg" />
      </span>
      <p className={`mt-4 font-heading text-4xl leading-none ${scoreColor(score)}`}>
        <Counter to={score} />
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/50">{label}</p>
    </div>
  );
}

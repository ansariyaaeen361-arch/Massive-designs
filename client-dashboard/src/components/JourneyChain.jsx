// Renders one visitor's path as a chain of arrows — page views plain,
// goal/conversion events highlighted so the moment of conversion stands out
// from the pages that led to it.
export default function JourneyChain({ origin, steps }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      {origin && (
        <>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800">{origin}</span>
          <span className="text-accent">&rarr;</span>
        </>
      )}
      {steps.map((st, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span
            className={
              st.event === 'page_view'
                ? ''
                : 'rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent'
            }
          >
            {st.label}
          </span>
          {i < steps.length - 1 && <span className="text-accent">&rarr;</span>}
        </span>
      ))}
    </div>
  );
}

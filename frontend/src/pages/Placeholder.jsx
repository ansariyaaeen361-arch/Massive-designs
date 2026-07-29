export default function Placeholder({ title }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Coming soon</p>
      <h1 className="mt-4 text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-sm text-white/50">
        This page will be rebuilt in an upcoming step.
      </p>
    </div>
  );
}

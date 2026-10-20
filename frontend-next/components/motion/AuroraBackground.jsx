export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="aurora pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-beam" />
      <div className="aurora-dots" />
      <div className="aurora-vignette" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-radar-canvas" aria-busy="true">
      <div className="text-center">
        <span className="mx-auto block size-3 animate-pulse rounded-full bg-radar-positive" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-radar-muted">
          A iniciar o Radar
        </p>
      </div>
    </main>
  );
}

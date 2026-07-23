export default function Loading() {
  return (
    <main className="flex-1 animate-pulse" aria-busy="true" aria-label="Loading page">
      <div className="h-64 w-full bg-surface-subtle md:h-80" />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-14">
        <div className="mx-auto h-8 w-48 rounded bg-surface-subtle" />
        <div className="mx-auto h-4 w-full max-w-2xl rounded bg-surface-subtle" />
        <div className="mx-auto h-4 w-full max-w-xl rounded bg-surface-subtle" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-[length:var(--radius-card)] bg-surface-subtle" />
          <div className="h-48 rounded-[length:var(--radius-card)] bg-surface-subtle" />
          <div className="h-48 rounded-[length:var(--radius-card)] bg-surface-subtle" />
        </div>
      </div>
    </main>
  );
}

export default function DashboardLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-9 w-60 animate-pulse rounded-lg bg-muted" />
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}

export default function DashboardLoading() {
  return (
    <main className="flex-1 flex flex-col relative w-full pt-4 md:pt-8 pb-24 md:pb-12 bg-surface px-margin-sm sm:px-6 lg:px-8 max-w-5xl mx-auto animate-pulse">
      <div className="flex flex-col w-full gap-space-md">
        {/* 1. Header Skeleton */}
        <section className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <div className="w-10 h-10 rounded-full bg-surface-container-high" />
              <div className="space-y-1.5">
                <div className="h-6 w-48 rounded-md bg-surface-container-high" />
                <div className="h-3 w-32 rounded bg-surface-container" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 rounded-full bg-surface-container-high" />
              <div className="h-9 w-20 rounded-lg bg-surface-container-high" />
            </div>
          </div>
          <div className="h-4 w-72 rounded bg-surface-container mt-1" />
          <div className="h-10 w-full rounded-xl bg-surface-container-high mt-1" />
        </section>

        {/* 2. Readiness Score Card Skeleton */}
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-container">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-surface-container" />
              <div className="h-6 w-36 rounded bg-surface-container-high" />
            </div>
            <div className="h-6 w-28 rounded-full bg-surface-container-high" />
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="w-40 h-40 rounded-full border-[10px] border-surface-container-high flex items-center justify-center" />
          </div>

          <div className="h-10 w-full rounded-lg bg-surface-container-low" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="h-14 rounded-lg bg-surface-container" />
            <div className="h-14 rounded-lg bg-surface-container" />
            <div className="h-14 rounded-lg bg-surface-container" />
            <div className="h-14 rounded-lg bg-surface-container" />
          </div>
        </section>

        {/* 3. Upcoming Tests Skeleton */}
        <section className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 rounded bg-surface-container-high" />
            <div className="h-4 w-20 rounded bg-surface-container" />
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm space-y-3 border border-surface-container">
            <div className="h-4 w-32 rounded bg-surface-container-high" />
            <div className="h-5 w-60 rounded bg-surface-container-high" />
            <div className="h-3 w-48 rounded bg-surface-container" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-11 rounded-lg bg-surface-container" />
              <div className="h-11 rounded-lg bg-surface-container" />
            </div>
          </div>
        </section>

        {/* 4. Next Priority Actions Skeleton */}
        <section className="flex flex-col gap-space-xs">
          <div className="h-6 w-44 rounded bg-surface-container-high" />
          <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm space-y-3 border border-surface-container">
            <div className="h-4 w-32 rounded bg-surface-container-high" />
            <div className="h-5 w-72 rounded bg-surface-container-high" />
            <div className="h-10 rounded-lg bg-surface-container" />
          </div>
        </section>
      </div>
    </main>
  );
}

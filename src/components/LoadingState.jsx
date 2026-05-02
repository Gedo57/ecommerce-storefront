export default function LoadingState() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.8rem] border border-brand-900/10 bg-white shadow-card">
          <div className="aspect-[4/4.2] animate-pulse bg-[linear-gradient(180deg,#f7efe4_0%,#efe4d4_100%)]" />
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-6 w-24 animate-pulse rounded-full bg-brand-100" />
              <div className="h-5 w-12 animate-pulse rounded bg-brand-100" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-brand-100" />
              <div className="h-8 w-24 animate-pulse rounded bg-brand-100" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-2xl bg-brand-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

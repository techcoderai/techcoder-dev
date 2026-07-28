/**
 * Blog index skeleton — mirrors the real layout's rhythm so the swap to content
 * is calm (no jump). Shimmer + reduced-motion handling live in `globals.css`.
 */
export default function BlogListLoading() {
  return (
    <div className="section-padding pt-24 sm:pt-28 md:pt-32">
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="skeleton mb-5 h-7 w-32 rounded-full" />
          <div className="skeleton mb-3 h-10 w-64 max-w-full" />
          <div className="skeleton h-5 w-full max-w-xl" />
        </div>

        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row">
          <div className="skeleton h-12 flex-1 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-tc-border bg-tc-bg-card"
            >
              <div className="skeleton aspect-[16/9] rounded-none" />
              <div className="p-3.5">
                <div className="skeleton mb-2 h-4 w-full" />
                <div className="skeleton mb-3 h-4 w-2/3" />
                <div className="skeleton h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

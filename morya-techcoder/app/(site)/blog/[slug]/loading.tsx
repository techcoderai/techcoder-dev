/**
 * Article skeleton — matches the reading layout (article column + sidebar) so
 * the transition into content stays still. Shimmer lives in `globals.css`.
 */
export default function ArticleLoading() {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20">
      <div className="container-wide mx-auto px-4 sm:px-6 md:px-8">
        <div className="skeleton mb-6 h-5 w-32 sm:mb-10" />

        <div className="mx-auto max-w-[1180px] lg:grid lg:grid-cols-[minmax(0,1fr)_248px] lg:gap-14">
          {/* Article column */}
          <div className="min-w-0">
            <div className="mb-8 max-w-[720px] sm:mb-10">
              <div className="mb-4 flex gap-2.5 sm:mb-5">
                <div className="skeleton h-6 w-24 rounded-full" />
                <div className="skeleton h-6 w-24 rounded-full" />
              </div>
              <div className="skeleton mb-3 h-10 w-full" />
              <div className="skeleton mb-5 h-10 w-3/4" />
              <div className="skeleton mb-2 h-5 w-full" />
              <div className="skeleton h-5 w-2/3" />
            </div>

            <div className="skeleton mb-8 aspect-[16/9] max-h-[248px] w-full max-w-[720px] rounded-2xl sm:mb-10 sm:max-h-none" />

            <div className="max-w-[720px] space-y-3.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-4"
                  style={{ width: `${[100, 96, 88, 100, 70, 100, 92, 100, 60][i]}%` }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-7">
              <div className="skeleton h-40 rounded-2xl" />
              <div className="skeleton h-56 rounded-2xl" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive, privacy-friendly YouTube embed (uses youtube-nocookie).
 *
 * MDX usage:
 *   <YouTube id="dQw4w9WgXcQ" title="Intro to Next.js" />
 */
export default function YouTube({
  id,
  title = "YouTube video",
}: {
  id: string;
  title?: string;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-tc-bg-elevated">
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

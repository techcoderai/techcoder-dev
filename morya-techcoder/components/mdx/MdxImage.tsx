import NextImage from "next/image";

/**
 * Image wrapper used for both markdown `![alt](src)` and explicit `<Image />`
 * in MDX. Uses Next.js image optimization and a rounded frame.
 *
 * MDX usage:
 *   ![A diagram](/content/blog/diagram.png)
 *   <Image src="/content/blog/diagram.png" alt="A diagram" caption="Fig 1." />
 *
 * Note: Uses <span> wrapper instead of <figure> to avoid hydration errors.
 * MDX wraps inline images in <p> tags, and <figure> cannot be a child of <p>.
 */
export default function MdxImage({
  src,
  alt = "",
  caption,
  width = 800,
  height = 450,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  if (!src) return null;

  return (
    <span className="my-6 block">
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-xl"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      {caption && (
        <span className="mt-2 block text-center text-xs text-tc-text-light">
          {caption}
        </span>
      )}
    </span>
  );
}

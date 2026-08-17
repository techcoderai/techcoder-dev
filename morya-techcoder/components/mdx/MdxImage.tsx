import NextImage from "next/image";

/**
 * Image wrapper used for both markdown `![alt](src)` and explicit `<Image />`
 * in MDX. Uses Next.js image optimization and a rounded frame.
 *
 * MDX usage:
 *   ![A diagram](/content/blog/diagram.png "Fig 1. The request path")
 *   <Image src="/content/blog/diagram.png" alt="A diagram" caption="Fig 1." />
 *
 * The markdown *title* (the quoted string after the URL) becomes the caption.
 * That's what Keystatic's image dialog writes, so a caption added in the editor
 * renders here without a second image syntax.
 *
 * Width and height are filled in at compile time from the file itself (see
 * `content/rehype-image-size.ts`); the defaults below only apply to remote
 * images, where no file is available to measure.
 *
 * Note: Uses <span> wrapper instead of <figure> to avoid hydration errors.
 * MDX wraps inline images in <p> tags, and <figure> cannot be a child of <p>.
 */
export default function MdxImage({
  src,
  alt = "",
  caption,
  title,
  width = 800,
  height = 450,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  title?: string;
  width?: number;
  height?: number;
}) {
  if (!src) return null;

  const text = caption || title;

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
      {text && (
        <span className="mt-2 block text-center text-xs text-tc-text-light">
          {text}
        </span>
      )}
    </span>
  );
}

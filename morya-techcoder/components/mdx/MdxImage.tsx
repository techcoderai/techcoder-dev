import NextImage from "next/image";

/**
 * Image wrapper used for both markdown `![alt](src)` and explicit `<Image />`
 * in MDX. Uses Next.js image optimization and a rounded frame.
 *
 * MDX usage:
 *   ![A diagram](/content/blog/diagram.png)
 *   <Image src="/content/blog/diagram.png" alt="A diagram" caption="Fig 1." />
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
    <figure className="my-6">
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-xl"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-tc-text-light">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

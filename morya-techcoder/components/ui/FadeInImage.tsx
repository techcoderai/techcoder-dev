"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Drop-in `next/image` that never pops in: on load it eases from
 * `opacity: 0; scale: 0.98` to rest over ~300ms on the shared motion curve.
 *
 * Use for standalone imagery (article heroes, MDX figures). Avoid on
 * `.card-premium-media` images — those already animate `transform` on hover,
 * and a second transform transition would fight it.
 */
export default function FadeInImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Ref callback also catches images served straight from cache (already
  // complete before React attaches an onLoad handler).
  const captureRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <Image
      {...props}
      alt={alt}
      ref={captureRef}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(
        "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] motion-reduce:transition-none",
        loaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
        className
      )}
    />
  );
}

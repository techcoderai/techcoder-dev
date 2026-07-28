"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function TiltSurface({
  children,
  className,
  surfaceClassName,
}: {
  children: ReactNode;
  className?: string;
  surfaceClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const frameRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };
    update();
    media.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frameRef.current);
      media.removeEventListener("change", update);
    };
  }, []);

  const reset = () => {
    cancelAnimationFrame(frameRef.current);
    boundsRef.current = null;
    if (surfaceRef.current) {
      surfaceRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => {
        if (reducedMotionRef.current) return;
        boundsRef.current = containerRef.current?.getBoundingClientRect() ?? null;
      }}
      onMouseMove={(event) => {
        if (reducedMotionRef.current) return;
        const rect = boundsRef.current;
        if (!rect || !surfaceRef.current) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
          if (!surfaceRef.current) return;
          surfaceRef.current.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
        });
      }}
      onMouseLeave={reset}
    >
      <div
        ref={surfaceRef}
        className={cn("hero-browser-tilt", surfaceClassName)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <div
      className={`reveal-on-view ${className ?? ""}`}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-delay": `${Math.min(delay * 100, 12)}%`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

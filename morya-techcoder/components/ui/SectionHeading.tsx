import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      <span className="chip mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-tc-primary" />
        {eyebrow}
      </span>
      <h2 className="heading-lg max-w-2xl">{title}</h2>
      {description && (
        <p className={`mt-4 body-lg max-w-xl ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

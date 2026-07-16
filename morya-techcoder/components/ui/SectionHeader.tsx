import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  labelColor?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}

export default function SectionHeader({
  label,
  labelColor = "text-tc-primary",
  href,
  hrefLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-10 sm:mb-12", className)}>
      <div className="section-label flex-1">
        <span className={cn("overline shrink-0", labelColor)}>{label}</span>
      </div>
      {href && (
        <Link
          href={href}
          className="focus-ring group shrink-0 inline-flex items-center gap-1 text-[12.5px] font-semibold text-tc-text-muted hover:text-tc-text transition-colors duration-200"
        >
          {hrefLabel}
          <ArrowRight
            size={13}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      )}
    </div>
  );
}

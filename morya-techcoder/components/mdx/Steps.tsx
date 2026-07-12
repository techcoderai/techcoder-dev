import { cn } from "@/lib/utils";

/**
 * A numbered step-by-step list. Wrap `<Step>` items in `<Steps>`.
 *
 * MDX usage:
 *   <Steps>
 *   <Step title="Install dependencies">
 *   Run `npm install`.
 *   </Step>
 *   <Step title="Start the dev server">
 *   Run `npm run dev`.
 *   </Step>
 *   </Steps>
 */
export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex flex-col gap-5 border-l border-tc-border pl-6 [counter-reset:step]">
      {children}
    </div>
  );
}

export function Step({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative [counter-increment:step]">
      <span
        className={cn(
          "absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full",
          "bg-tc-primary text-[12px] font-bold text-white",
          "before:content-[counter(step)]"
        )}
        aria-hidden="true"
      />
      {title && <p className="mb-1 font-semibold text-tc-text">{title}</p>}
      <div className="text-sm leading-relaxed text-tc-text-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

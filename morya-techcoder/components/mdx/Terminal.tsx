import { cn } from "@/lib/utils";

/**
 * A styled terminal window. Put shell commands and output inside as text.
 * Prefix a line with `$ ` for commands (rendered with a green prompt).
 *
 * MDX usage:
 *   <Terminal title="bash">
 *   $ npm install
 *   added 242 packages
 *   </Terminal>
 */
export default function Terminal({
  title = "bash",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.filter((c) => typeof c === "string").join("")
        : "";
  const lines = text.replace(/^\n+|\n+$/g, "").split("\n");

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-[#0B0B0D] shadow-[var(--tc-shadow-md)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 text-xs font-medium text-white/50">{title}</span>
      </div>
      <pre className="!my-0 overflow-x-auto bg-transparent p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => {
          const isCommand = line.trimStart().startsWith("$ ");
          return (
            <div key={i} className={cn(isCommand ? "text-white" : "text-white/55")}>
              {isCommand ? (
                <>
                  <span className="select-none text-[#27C93F]">$ </span>
                  {line.replace(/^\s*\$\s/, "")}
                </>
              ) : (
                line || "\u00A0"
              )}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

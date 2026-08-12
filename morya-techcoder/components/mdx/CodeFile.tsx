import { FileCode2 } from "lucide-react";

/**
 * Puts a filename bar above a code block, so a reader knows *where* the snippet
 * goes, not just what it says.
 *
 * Hand-written MDX can use the fence's own meta string instead —
 * ```` ```ts title="app/page.tsx" ```` — which rehype-pretty-code renders
 * identically. This wrapper exists because Keystatic's code block only stores a
 * language, so it's the only way to author a filename from the editor.
 *
 * MDX usage:
 *   <CodeFile name="app/page.tsx">
 *   ```tsx
 *   export default function Page() { return <h1>Hi</h1> }
 *   ```
 *   </CodeFile>
 */
export default function CodeFile({
  name,
  children,
}: {
  name?: string;
  children: React.ReactNode;
}) {
  if (!name) return <>{children}</>;

  return (
    <>
      <div className="tc-code-title">
        <FileCode2 size={14} aria-hidden="true" />
        {name}
      </div>
      <div>{children}</div>
    </>
  );
}

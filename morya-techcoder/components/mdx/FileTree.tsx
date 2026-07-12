import { Folder as FolderIcon, File as FileIcon } from "lucide-react";

/**
 * A visual file/folder tree. Compose with `<Folder>` and `<File>`.
 *
 * MDX usage:
 *   <FileTree>
 *   <Folder name="app">
 *   <File name="page.tsx" />
 *   <Folder name="blog">
 *   <File name="page.tsx" />
 *   </Folder>
 *   </Folder>
 *   </FileTree>
 */
export function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-tc-border bg-tc-bg-elevated p-4 font-mono text-[13px] text-tc-text-muted">
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

export function Folder({
  name,
  children,
}: {
  name: string;
  children?: React.ReactNode;
}) {
  return (
    <li>
      <span className="flex items-center gap-2 font-medium text-tc-text">
        <FolderIcon size={15} className="text-tc-primary" />
        {name}
      </span>
      {children && (
        <ul className="mt-1 flex flex-col gap-1 border-l border-tc-border pl-4">
          {children}
        </ul>
      )}
    </li>
  );
}

export function File({ name }: { name: string }) {
  return (
    <li className="flex items-center gap-2">
      <FileIcon size={15} className="text-tc-text-light" />
      {name}
    </li>
  );
}

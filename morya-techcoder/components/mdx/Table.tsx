/**
 * A horizontally scrollable wrapper for wide tables. Markdown tables are
 * already styled via the element mapping in `content/mdx-components.tsx`;
 * use this only when you want an explicit scroll container.
 *
 * MDX usage:
 *   <Table>
 *   | Feature | Support |
 *   | ------- | ------- |
 *   | MDX     | Yes     |
 *   </Table>
 */
export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-tc-border">
      <div className="[&_table]:my-0 [&_table]:w-full">{children}</div>
    </div>
  );
}

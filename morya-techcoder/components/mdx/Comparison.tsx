type Row = {
  /** Row header — the attribute being compared, e.g. "Cold start". */
  label?: string;
  /** One value per column, in the same order as `columns`. */
  values?: (string | null)[];
};

/**
 * A structured comparison table: products, frameworks, or plans down the
 * columns and the attributes being compared down the rows.
 *
 * Unlike a hand-written Markdown table, the shape is data — which is what makes
 * it editable row-by-row in Keystatic and safe to restyle later without
 * touching content. Reach for a plain Markdown table when the content is prose
 * rather than a grid of short values.
 *
 * MDX usage:
 *   <Comparison
 *     columns={["Next.js", "Remix"]}
 *     rows={[{ label: "Routing", values: ["App Router", "Nested routes"] }]}
 *     caption="Framework comparison, as of v16."
 *   />
 */
export default function Comparison({
  columns = [],
  rows = [],
  label = "Comparison",
  caption,
}: {
  columns?: string[];
  rows?: Row[];
  /** Header for the leftmost column of attribute names. */
  label?: string;
  caption?: string;
}) {
  if (columns.length === 0 || rows.length === 0) return null;

  return (
    <figure className="my-7">
      <div
        className="tc-table-scroll"
        role="region"
        tabIndex={0}
        aria-label={caption || "Comparison table"}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">{label}</th>
              {columns.map((column, i) => (
                <th key={i} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <th scope="row" className="font-medium">
                  {row.label}
                </th>
                {/* Iterate the columns, not the values, so a row with missing
                    entries still lines up with its headers. */}
                {columns.map((_, column) => (
                  <td key={column}>{row.values?.[column] || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-tc-text-light">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

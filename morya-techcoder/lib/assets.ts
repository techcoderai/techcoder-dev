/**
 * Normalizes an image reference from frontmatter/JSON into a usable `src`.
 * Absolute URLs and root-relative paths pass through unchanged; a bare
 * filename (as Keystatic's image fields store) is resolved under `publicPath`.
 */
export function resolveAsset(value: unknown, publicPath: string): string {
  if (typeof value !== "string" || value === "") return "";
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  return `${publicPath}/${value}`;
}

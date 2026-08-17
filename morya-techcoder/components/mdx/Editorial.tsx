import { Zap, Key, ServerCog } from "lucide-react";
import EditorialPanel from "@/components/mdx/EditorialPanel";

/**
 * The summary box that opens a long article: three to five bullets a reader can
 * skim before deciding to commit. Place it directly under the intro.
 *
 * MDX usage:
 *   <TLDR>
 *   - Container runtimes are standardised by the OCI, not by Docker.
 *   - Kubernetes talks to containerd directly.
 *   </TLDR>
 */
export function TLDR({ children }: { children: React.ReactNode }) {
  return (
    <EditorialPanel icon={Zap} eyebrow="TL;DR" tone="primary">
      {children}
    </EditorialPanel>
  );
}

/**
 * The single idea a reader should leave a section with. Use sparingly — one or
 * two per article, otherwise it stops meaning anything.
 *
 * MDX usage:
 *   <KeyTakeaway title="Standards outlive tools">
 *   Betting on the OCI spec rather than one vendor's CLI is what keeps images
 *   portable across runtimes.
 *   </KeyTakeaway>
 */
export function KeyTakeaway({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <EditorialPanel icon={Key} eyebrow="Key takeaway" title={title} tone="blue">
      {children}
    </EditorialPanel>
  );
}

/**
 * What the thing being written about actually behaves like in production —
 * the gotcha, the cost, the scaling limit that a getting-started guide skips.
 *
 * MDX usage:
 *   <ProductionInsight title="Cold starts dominate at low traffic">
 *   Below roughly ten requests a minute, most of the latency you measure is
 *   the runtime waking up, not your code.
 *   </ProductionInsight>
 */
export function ProductionInsight({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <EditorialPanel
      icon={ServerCog}
      eyebrow="Production insight"
      title={title}
      tone="slate"
    >
      {children}
    </EditorialPanel>
  );
}

import { useId } from "react";

// Lucide's `hand` (ISC), drawn twice: a back hand offset up-right and a front
// hand that hides it where they overlap, plus three short burst marks.
const HAND = [
  "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",
  "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",
  "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",
  "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
];
// The same hand as one closed outline, for the knockout and the active tint.
const SILHOUETTE =
  "M6 14V6a2 2 0 0 1 4 0V4a2 2 0 0 1 4 0V6a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82Z";
const SCALE = 0.74;
const BACK = `translate(14.6 10.2) rotate(14) scale(${SCALE}) translate(-12 -12)`;
const FRONT = `translate(9.4 14.4) rotate(-8) scale(${SCALE}) translate(-12 -12)`;
const STROKE = 1.3 / SCALE;

function Hand({ transform, filled }: { transform: string; filled: boolean }) {
  return (
    <g transform={transform} strokeWidth={STROKE}>
      {filled && <path d={SILHOUETTE} fill="currentColor" fillOpacity={0.18} stroke="none" />}
      {HAND.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/**
 * Applause mark for the article clap control. Outline by default; `active`
 * adds a soft tint. Inherits size and colour from `currentColor`.
 */
export default function ClapIcon({
  size = 20,
  active = false,
  className,
}: {
  size?: number;
  active?: boolean;
  className?: string;
}) {
  const maskId = `clap-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" stroke="none" />
          <path transform={FRONT} d={SILHOUETTE} fill="black" stroke="black" strokeWidth={STROKE + 2.2} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <Hand transform={BACK} filled={active} />
      </g>
      <Hand transform={FRONT} filled={active} />
      <path d="M5.2 4.4 4.1 3.2M7.7 3.1 7.4 1.6M3.3 6.8 1.8 6.4" strokeWidth={1.3} />
    </svg>
  );
}

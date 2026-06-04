import { clsx } from "@/lib/clsx";

type Tone =
  | "container"
  | "low"
  | "high"
  | "highest";

const TONE: Record<Tone, string> = {
  low: "bg-surface-container-low",
  container: "bg-surface-container",
  high: "bg-surface-container-high",
  highest: "bg-surface-container-highest",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** Adds the soft ambient lift used on dashboard cards */
  elevated?: boolean;
  /** Subtle linen weave overlay for tactile surfaces */
  linen?: boolean;
  /** Accent top-border, e.g. for "peak planting" windows */
  accent?: "primary" | "secondary";
}

/**
 * Primary tactile container. Tonal navy surfaces, hairline silver border,
 * green-tinted ambient shadow — never stark black.
 */
export function Card({
  tone = "high",
  elevated = false,
  linen = false,
  accent,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-outline-variant/10",
        TONE[tone],
        elevated && "shadow-lg shadow-primary/5",
        accent === "primary" && "border-t-2 border-t-primary",
        accent === "secondary" && "border-t-2 border-t-secondary",
        className,
      )}
      {...rest}
    >
      {linen && <div className="linen-overlay absolute inset-0" />}
      {linen ? <div className="relative">{children}</div> : children}
    </div>
  );
}

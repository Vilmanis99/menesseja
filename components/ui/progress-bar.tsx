import { clsx } from "@/lib/clsx";

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  tone?: "primary" | "secondary" | "outline";
  /** Add the moonlit glow used for ripening / peak states */
  glow?: boolean;
  className?: string;
}

const FILL: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  outline: "bg-outline",
};

const GLOW: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  primary: "shadow-[0_0_8px_rgba(172,207,182,0.5)]",
  secondary: "shadow-[0_0_8px_rgba(255,181,156,0.4)]",
  outline: "",
};

export function ProgressBar({
  value,
  tone = "primary",
  glow = false,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={clsx(
        "h-2 w-full overflow-hidden rounded-full bg-surface-variant",
        className,
      )}
    >
      <div
        className={clsx("h-full rounded-full", FILL[tone], glow && GLOW[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

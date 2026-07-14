import { clsx } from "@/lib/clsx";

type ChipTone = "primary" | "secondary" | "tertiary" | "neutral";

const TONE: Record<ChipTone, string> = {
  primary: "bg-primary-container/30 text-on-primary-container",
  secondary: "bg-secondary-container/30 text-on-secondary-container",
  tertiary: "bg-tertiary-container/40 text-on-tertiary-container",
  neutral: "bg-surface-variant/50 text-on-surface-variant",
};

interface ChipProps {
  tone?: ChipTone;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/** Pill tag for soil types, plant categories, region filters. */
export function Chip({
  tone = "secondary",
  active = false,
  className,
  children,
  onClick,
}: ChipProps) {
  const classes = clsx(
    "inline-flex items-center rounded-full text-label-sm font-medium transition-all duration-200",
    onClick ? "min-h-11 px-4" : "px-3 py-1",
    active ? "bg-primary text-on-primary" : TONE[tone],
    className,
  );

  if (onClick) {
    return <button type="button" aria-pressed={active} onClick={onClick} className={clsx(classes, "active:scale-[0.98]")}>{children}</button>;
  }
  return <span className={classes}>{children}</span>;
}

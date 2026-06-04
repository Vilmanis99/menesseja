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
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-label-sm font-medium transition-colors",
        active ? "bg-primary text-on-primary" : TONE[tone],
        onClick && "active:scale-95",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

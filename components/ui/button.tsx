import { clsx } from "@/lib/clsx";
import { Icon } from "./icon";

type Variant = "primary" | "outline" | "secondary-outline" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-md shadow-primary/20 hover:brightness-110",
  outline:
    "border border-primary text-primary hover:bg-primary/10",
  "secondary-outline":
    "border border-secondary text-secondary hover:bg-secondary/10 uppercase tracking-widest",
  ghost:
    "border border-outline-variant text-on-surface-variant hover:bg-surface-variant",
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Leading Material Symbols icon */
  icon?: string;
  fullWidth?: boolean;
}

/**
 * Sturdy 8px-radius action. Filled forest-green primary by default;
 * moonlit-silver and terracotta outline variants for secondary actions.
 */
export function Button({
  variant = "primary",
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-xs rounded-lg px-md py-sm",
        "text-label-md font-bold transition-all active:scale-95",
        "disabled:pointer-events-none disabled:opacity-50",
        fullWidth && "w-full",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size="20px" />}
      {children}
    </button>
  );
}

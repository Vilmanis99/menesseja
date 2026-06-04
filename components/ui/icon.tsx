import { clsx } from "@/lib/clsx";

interface IconProps {
  /** Material Symbols name, e.g. "calendar_month" */
  name: string;
  /** Render the filled variant */
  fill?: boolean;
  className?: string;
  /** Inline font-size override, e.g. "32px" or "2rem" */
  size?: string;
}

/**
 * Thin wrapper around Google Material Symbols (loaded in layout head).
 * Sizing is driven by font-size, so pass `size` or a text-* class.
 */
export function Icon({ name, fill, className, size }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx("material-symbols-outlined", fill && "fill", className)}
      style={size ? { fontSize: size } : undefined}
    >
      {name}
    </span>
  );
}

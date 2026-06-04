import { clsx } from "@/lib/clsx";
import { Icon } from "./icon";

interface SectionLabelProps {
  icon?: string;
  iconClassName?: string;
  className?: string;
  children: React.ReactNode;
}

/** Uppercase tracked data-header, e.g. "ŠODIENAS ATGĀDINĀJUMI". */
export function SectionLabel({
  icon,
  iconClassName,
  className,
  children,
}: SectionLabelProps) {
  return (
    <div className={clsx("flex items-center gap-xs", className)}>
      {icon && (
        <Icon name={icon} size="16px" className={iconClassName ?? "text-secondary"} />
      )}
      <h3 className="text-label-md uppercase tracking-widest text-on-surface-variant">
        {children}
      </h3>
    </div>
  );
}

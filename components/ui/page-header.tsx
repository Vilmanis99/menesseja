import { clsx } from "@/lib/clsx";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  display?: boolean;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  display = false,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={clsx(
        "mb-lg flex flex-col justify-between gap-md md:flex-row md:items-end",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-xs text-label-sm uppercase tracking-[0.2em] text-tertiary">
            {eyebrow}
          </p>
        )}
        <h1
          className={clsx(
            "text-on-surface",
            display
              ? "text-headline-lg-mobile text-primary md:text-display-lg"
              : "text-headline-lg-mobile md:text-headline-lg",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-xs max-w-2xl text-body-md text-on-surface-variant md:text-body-lg">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

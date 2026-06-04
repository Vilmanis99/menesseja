import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { DATA_REVIEWED, SOURCES, PLANTING_PROVENANCE, MOON_HEDGE } from "@/lib/sources";

/**
 * Provenance / honesty line shown wherever planting or Moon advice is asserted.
 * Directly answers "where does this come from / is it reliable".
 */
export function DataNote({
  variant = "planting",
  withSources = false,
  className = "",
}: {
  variant?: "planting" | "moon";
  withSources?: boolean;
  className?: string;
}) {
  const text = variant === "moon" ? MOON_HEDGE : PLANTING_PROVENANCE;
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-low/60 px-3 py-2 text-label-sm text-on-surface-variant ${className}`}
    >
      <Icon name="info" size="16px" className="mt-0.5 shrink-0 text-tertiary" />
      <p className="leading-relaxed">
        {text}{" "}
        <Link href={variant === "moon" ? "/macies" : "/par"} className="text-primary hover:underline">
          {variant === "moon" ? "Kas ir Mēness sēja?" : "Par datiem"}
        </Link>
        {withSources && (
          <>
            {" · Avoti: "}
            {SOURCES.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {s.label.split(" (")[0]}
                </a>
              </span>
            ))}
            {` · Pārskatīts: ${DATA_REVIEWED}`}
          </>
        )}
      </p>
    </div>
  );
}

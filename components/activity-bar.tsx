import { ACTIVITY_KEYS, ACTIVITY_META, MONTHS_LV, type Crop } from "@/lib/planting-crops";

const PCT = 100 / 12;

/** Pick a readable label colour (dark vs white) for a given capsule colour. */
function labelColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#1b1e1a" : "#ffffff";
}

/** A 12-month timeline with one capsule per activity range (sow/transplant/harvest). */
export function ActivityBar({ crop, currentMonth }: { crop: Crop; currentMonth: number }) {
  const present = ACTIVITY_KEYS.filter((k) => crop[k]);
  return (
    <div className="space-y-1.5">
      {/* Month ruler */}
      <div className="grid grid-cols-12 text-[10px] text-on-surface-variant/60">
        {MONTHS_LV.map((m, i) => (
          <span
            key={m}
            className={`text-center ${i + 1 === currentMonth ? "font-bold text-secondary" : ""}`}
          >
            {m[0]}
          </span>
        ))}
      </div>
      {/* One track per activity */}
      {present.map((k) => {
        const range = crop[k]!;
        const left = (range[0] - 1) * PCT;
        const width = (range[1] - range[0] + 1) * PCT;
        const meta = ACTIVITY_META[k];
        return (
          <div key={k} className="relative h-5 overflow-hidden rounded bg-background/40">
            {/* current-month marker */}
            <div
              className="absolute top-0 bottom-0 bg-secondary/15"
              style={{ left: `${(currentMonth - 1) * PCT}%`, width: `${PCT}%` }}
            />
            <div
              className="absolute top-0 bottom-0 flex items-center rounded px-1.5"
              style={{ left: `${left}%`, width: `${width}%`, backgroundColor: meta.color }}
            >
              <span className="truncate text-[10px] font-semibold" style={{ color: labelColor(meta.color) }}>
                {meta.short}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

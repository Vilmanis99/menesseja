"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useGarden } from "@/components/garden-context";
import { cropById } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";

/** Transient confirmation when a plant is added, so the user sees what happened.
 *  Also surfaces cloud-sync failures (writes roll back silently otherwise). */
export function GardenToast() {
  const { lastAddedId, plants, syncError, clearSyncError } = useGarden();
  const [msg, setMsg] = useState<{ text: string; emoji: string } | null>(null);

  useEffect(() => {
    if (!syncError) return;
    const t = setTimeout(clearSyncError, 5000);
    return () => clearTimeout(t);
  }, [syncError, clearSyncError]);

  useEffect(() => {
    if (!lastAddedId) return;
    const plant = plants.find((p) => p.id === lastAddedId);
    if (!plant) return;
    const crop = cropById(plant.cropId);
    setMsg({ text: `${crop?.name ?? "Augs"} pievienots — ${plant.area}`, emoji: cropEmoji(plant.cropId) });
    const t = setTimeout(() => setMsg(null), 3200);
    return () => clearTimeout(t);
  }, [lastAddedId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!msg && !syncError) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[150] flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      {syncError && (
        <div className="flex items-center gap-2 rounded-full border border-error/40 bg-surface-container-highest px-4 py-2.5 text-body-md text-on-surface shadow-2xl">
          <Icon name="cloud_off" size="20px" className="text-error" />
          {syncError}
        </div>
      )}
      {msg && (
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface-container-highest px-4 py-2.5 text-body-md text-on-surface shadow-2xl">
          <Icon name="check_circle" size="20px" className="text-primary" />
          <span className="text-lg leading-none">{msg.emoji}</span>
          {msg.text}
        </div>
      )}
    </div>
  );
}

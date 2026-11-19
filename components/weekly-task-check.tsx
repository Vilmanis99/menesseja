"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { storageGet, storageRemove, storageSet } from "@/lib/safe-storage";

export function WeeklyTaskCheck({ task, week, heading }: { task: string; week: string; heading: string }) {
  const key = `meness-seja:nedelas-darbs:${task}`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    const refresh = () => setDone(storageGet(key) === week);
    refresh();
    const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) refresh(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, week]);

  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-label-md text-on-surface">
      <input type="checkbox" checked={done} aria-label={`Paveikts: ${heading}`}
        className="h-5 w-5 shrink-0 accent-primary" onChange={(event) => {
          const checked = event.target.checked;
          setDone(checked);
          if (checked) {
            storageSet(key, week);
            track("weekly_task_completed", { plan_week: week, task_id: task });
          } else if (storageGet(key) === week) {
            storageRemove(key);
          }
        }} />
      Paveikts
    </label>
  );
}

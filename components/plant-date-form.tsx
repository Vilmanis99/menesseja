"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { latviaDateKey } from "@/lib/day-anchor";
import { gardenStartActions, isGardenDate, plantDateError, type Plant, type PlantStart } from "@/lib/garden";
import type { Crop } from "@/lib/planting-crops";

const fieldClass = "min-h-11 w-full min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface";

function knownDate(plant: Plant | undefined, action: PlantStart["action"]) {
  if (action === "sown") return plant?.sownOn;
  if (action === "planted") return plant?.plantedOn;
}

export function PlantDateForm({ crop, plant, disabled, onSave, onCancel, children }: {
  crop: Crop;
  children?: ReactNode;
  plant?: Plant;
  disabled: boolean;
  onSave: (start: PlantStart) => void | boolean | Promise<boolean | void>;
  onCancel: () => void;
}) {
  const today = latviaDateKey();
  const actions = gardenStartActions(crop);
  const [action, setAction] = useState<PlantStart["action"]>(() =>
    plant ? (actions.find((option) => !knownDate(plant, option)) ?? actions[0]) : "unknown",
  );
  const [date, setDate] = useState(() => knownDate(plant, action) || today);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const transplant = Boolean(crop.sowIndoors && crop.transplant);
  const dateLabel = action === "sown" ? "Sējas datums" : transplant ? "Izstādīšanas datums" : "Stādīšanas datums";
  const dateError = action === "unknown" ? null : plant
    ? plantDateError(plant, action, date, today)
    : !isGardenDate(date, today) ? "Norādi derīgu datumu līdz šodienai." : null;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || saving || dateError) return;
    setSaving(true);
    setSaveError(false);
    try {
      const result = await onSave(action === "unknown" ? { action } : { action, date });
      if (result === false) setSaveError(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-sm">
      {children && <fieldset className="min-w-0" disabled={saving || disabled}>{children}</fieldset>}
      <label className="block space-y-1 text-label-md font-semibold text-on-surface">
        <span>Darbība</span>
        <select
          value={action}
          disabled={saving}
          onChange={(event) => {
            const next = event.target.value as PlantStart["action"];
            setAction(next);
            setDate(knownDate(plant, next) || today);
            setSaveError(false);
          }}
          className={fieldClass}
        >
          {!plant && <option value="unknown">Datumu nezinu</option>}
          {actions.map((option) => (
            <option key={option} value={option}>
              {option === "sown" ? "Iesēju" : transplant ? "Izstādīju dēstu" : "Iestādīju"}
            </option>
          ))}
        </select>
      </label>
      {action !== "unknown" && (
        <label className="block space-y-1 text-label-md font-semibold text-on-surface">
          <span>{dateLabel}</span>
          <input type="date" required min="0001-01-01" max={today} value={date} disabled={saving} aria-invalid={Boolean(dateError)}
            onChange={(event) => { setDate(event.target.value); setSaveError(false); }} className={fieldClass} />
        </label>
      )}
      {dateError && <p role="status" className="text-body-md text-error">{dateError}</p>}
      {saveError && <p role="alert" className="text-body-md text-error">Neizdevās saglabāt. Mēģini vēlreiz.</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" icon={plant ? "check" : "add"} disabled={disabled || saving || Boolean(dateError)}>
          {plant ? "Saglabāt datumu" : "Pievienot dārzam"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          {plant ? "Atcelt" : "Izvēlēties citu augu"}
        </Button>
      </div>
    </form>
  );
}

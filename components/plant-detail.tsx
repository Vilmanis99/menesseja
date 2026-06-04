"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGarden } from "@/components/garden-context";
import { cropById, plantStatus, LOG_META, type Plant, type LogType } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { cropPart, PART_ELEMENT } from "@/lib/crop-part";
import { ELEMENT_META } from "@/lib/biodynamic";
import { SOIL_TEMP_MIN } from "@/lib/sowing-thresholds";
import { nextSowing } from "@/lib/succession";
import { DIFFICULTY_LABEL, MONTHS_LV_FULL } from "@/lib/planting-crops";

const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric" });
const SHORT_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "short" });

function harvestEstimate(plant: Plant): string {
  const crop = cropById(plant.cropId);
  if (!crop) return "—";
  const nums = crop.daysToHarvest?.match(/\d+/g);
  if (nums) {
    const avg = nums[1] ? (parseInt(nums[0]) + parseInt(nums[1])) / 2 : parseInt(nums[0]);
    const d = new Date(plant.sownAt);
    d.setDate(d.getDate() + avg);
    return `~${DATE_FMT.format(d)}`;
  }
  if (crop.harvest) return `${MONTHS_LV_FULL[crop.harvest[0] - 1]}–${MONTHS_LV_FULL[crop.harvest[1] - 1]}`;
  return "Daudzgadīgs";
}

export function PlantDetail({
  plant,
  onClose,
  onRemove,
}: {
  plant: Plant;
  onClose: () => void;
  onRemove: () => void;
}) {
  const { plants, addLog, removeLog, addPlant } = useGarden();
  const live = plants.find((p) => p.id === plant.id) ?? plant;
  const crop = cropById(live.cropId);

  const [logType, setLogType] = useState<LogType>("laistits");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  if (!crop) return null;
  const st = plantStatus(live);
  const elem = ELEMENT_META[PART_ELEMENT[cropPart(live.cropId)]];
  const soil = SOIL_TEMP_MIN[live.cropId];
  const succ = nextSowing(live);

  function submitLog() {
    addLog(live.id, {
      date: new Date().toISOString().slice(0, 10),
      type: logType,
      note: note.trim() || undefined,
      amount: logType === "raza" && amount ? Number(amount) : undefined,
      unit: logType === "raza" ? "kg" : undefined,
    });
    setNote("");
    setAmount("");
  }

  const rows: { icon: string; label: string; value: string }[] = [
    { icon: "location_on", label: "Zona", value: live.area },
    { icon: "event", label: "Iestādīts", value: DATE_FMT.format(new Date(live.sownAt)) },
    { icon: "agriculture", label: "Gaidāmā raža", value: harvestEstimate(live) },
    { icon: elem.icon, label: "Labākā Mēness diena", value: `${elem.partLabel} (${elem.label})` },
    ...(soil ? [{ icon: "thermostat", label: "Augsne sējai", value: `≥ ${soil}°C` }] : []),
    ...(crop.sun ? [{ icon: "wb_sunny", label: "Gaisma", value: crop.sun }] : []),
    { icon: "eco", label: "Grūtība", value: DIFFICULTY_LABEL[crop.difficulty] },
  ];

  return (
    <Modal
      onClose={onClose}
      zClass="z-[120]"
      labelledBy="plant-detail-title"
      panelClassName="flex max-h-[88vh] w-full flex-col overflow-y-auto rounded-t-2xl border border-outline-variant/20 bg-surface-container-high shadow-2xl sm:max-w-[32rem] sm:rounded-2xl"
    >
      <>
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between gap-2 border-b border-outline-variant/10 bg-surface-container-high p-md">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{cropEmoji(live.cropId)}</span>
            <div>
              <h3 id="plant-detail-title" className="text-headline-md text-on-surface">{crop.name}</h3>
              <p className="text-body-md text-on-surface-variant">{st.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Aizvērt"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-md p-md">
          <ProgressBar value={st.progress} tone={st.tone} glow={st.tone === "secondary"} />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center gap-2 rounded-lg bg-background/40 p-sm">
                <Icon name={r.icon} size="20px" className="text-primary" />
                <div>
                  <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{r.label}</p>
                  <p className="text-body-md text-on-surface">{r.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Succession */}
          {succ && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary-container/10 p-sm">
              <Icon name="restart_alt" size="20px" className="text-primary" />
              <span className="text-body-md text-on-surface">
                Atkārtotā sēja: nākamā partija ~{SHORT_FMT.format(succ.date)}
                {!succ.inWindow && " (ārpus sējas loga)"}
              </span>
              <Button
                variant="outline"
                className="ml-auto px-sm py-xs"
                onClick={() => addPlant(live.cropId, live.area)}
              >
                Atzīmēt kā iesētu
              </Button>
            </div>
          )}

          {crop.note && (
            <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-container/10 p-sm">
              <Icon name="tips_and_updates" size="20px" className="text-primary" />
              <p className="text-body-md italic text-on-surface-variant">{crop.note}</p>
            </div>
          )}

          {/* Care log */}
          <div>
            <h4 className="mb-sm text-label-md uppercase tracking-wider text-on-surface">Kopšanas žurnāls</h4>
            <div className="mb-sm flex flex-wrap gap-2">
              {(Object.keys(LOG_META) as LogType[]).map((t) => (
                <Chip key={t} tone="neutral" active={t === logType} onClick={() => setLogType(t)}>
                  {LOG_META[t].label}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {logType === "raza" && (
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  inputMode="decimal"
                  placeholder="kg"
                  aria-label="Ražas daudzums kg"
                  className="w-20 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                />
              )}
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitLog()}
                placeholder="Piezīme (neobligāti)"
                aria-label="Piezīme"
                className="min-w-0 flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
              />
              <Button icon="add" className="px-sm py-xs" onClick={submitLog}>
                Pievienot
              </Button>
            </div>

            {live.log && live.log.length > 0 && (
              <ul className="mt-sm space-y-1.5">
                {live.log.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2 text-body-md">
                    <Icon name={LOG_META[l.type].icon} size="18px" className="text-primary" />
                    <span className="text-on-surface">{LOG_META[l.type].label}</span>
                    {l.amount != null && <span className="text-secondary">{l.amount} {l.unit}</span>}
                    {l.note && <span className="text-on-surface-variant">— {l.note}</span>}
                    <span className="ml-auto text-label-sm capitalize text-on-surface-variant/70">
                      {SHORT_FMT.format(new Date(l.date))}
                    </span>
                    <button
                      onClick={() => removeLog(live.id, l.id)}
                      aria-label="Dzēst ierakstu"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant/70 hover:bg-surface-variant/50 hover:text-error"
                    >
                      <Icon name="close" size="14px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            variant="ghost"
            icon="delete"
            fullWidth
            onClick={() => {
              onRemove();
              onClose();
            }}
          >
            Izņemt no dārza
          </Button>
        </div>
      </>
    </Modal>
  );
}

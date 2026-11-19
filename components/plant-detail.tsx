"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PlantCultivarEditor } from "@/components/cultivar-field";
import { plantDisplayName } from "@/lib/plant-display-name";
import { PlantDateForm } from "@/components/plant-date-form";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGarden } from "@/components/garden-context";
import { cropById, harvestAmountError, harvestDateError, harvestEstimate, isGardenDate, plantStatus, LOG_META, type Plant, type LogEntry, type LogType } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { cropPart, PART_ELEMENT } from "@/lib/crop-part";
import { ELEMENT_META } from "@/lib/biodynamic";
import { soilTemperatureFact } from "@/lib/sowing-thresholds";
import { nextSowing } from "@/lib/succession";
import { latviaDateKey } from "@/lib/day-anchor";
import { DIFFICULTY_LABEL } from "@/lib/planting-crops";

const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga", day: "numeric", month: "long", year: "numeric" });
const QUANTITY_FMT = new Intl.NumberFormat("lv-LV", { maximumFractionDigits: 10 });
const LOG_DATE_FMT = new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga", day: "2-digit", month: "2-digit", year: "numeric" });
const SHORT_FMT = new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga", day: "numeric", month: "short" });

export function PlantDetail({
  plant,
  onClose,
  onRemove,
}: {
  plant: Plant;
  onClose: () => void;
  onRemove: () => void;
}) {
  const { plants, addLog, removeLog, addPlant, recordPlantDate, syncing } = useGarden();
  const live = plants.find((p) => p.id === plant.id) ?? plant;
  const crop = cropById(live.cropId);

  const [editingDates, setEditingDates] = useState(false);
  const [logType, setLogType] = useState<LogType>("laistits");
  const [note, setNote] = useState("");
  const [savingLog, setSavingLog] = useState(false);
  const [logFailed, setLogFailed] = useState(false);
  const [savedLog, setSavedLog] = useState<Pick<LogEntry, "type" | "date"> | null>(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [amount, setAmount] = useState("");
  const [harvestUnit, setHarvestUnit] = useState<NonNullable<LogEntry["unit"]>>("kg");
  const [harvestDate, setHarvestDate] = useState<string | null>(null);

  if (!crop) return null;
  const st = plantStatus(live);
  const elem = ELEMENT_META[PART_ELEMENT[cropPart(live.cropId)]];
  const soil = soilTemperatureFact(crop);
  const succ = nextSowing(live);
  const today = latviaDateKey();
  const sownOn = isGardenDate(live.sownOn, today) ? live.sownOn : null;
  const amountError = logType === "raza" ? harvestAmountError(amount, harvestUnit) : null;
  const harvestError = logType === "raza" ? harvestDateError(live, harvestDate ?? today, today) : null;
  const plantedOn = live.plantedOn && isGardenDate(live.plantedOn) ? live.plantedOn : null;
  const entries = [...(live.log ?? [])].sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));

  async function submitLog() {
    if (live.seed || savingLog || syncing) return;
    const currentDay = latviaDateKey();
    const date = logType === "raza" ? harvestDate ?? currentDay : currentDay;
    if (logType === "raza" && (harvestDateError(live, date, currentDay) || amountError)) return;
    setSavingLog(true);
    setLogFailed(false);
    setSavedLog(null);
    try {
      const saved = await addLog(live.id, {
        date,
        type: logType,
        note: note.trim() || undefined,
        amount: logType === "raza" && amount ? Number(amount) : undefined,
        unit: logType === "raza" && amount ? harvestUnit : undefined,
      });
      if (saved) {
        setSavedLog({ type: logType, date });
        if (entries.filter((entry) => entry.date > date).length >= 3) setShowAllLogs(true);
        setNote("");
        setAmount("");
        setHarvestDate(null);
        setHarvestUnit("kg");
      } else setLogFailed(true);
    } catch {
      setLogFailed(true);
    } finally {
      setSavingLog(false);
    }
  }

  const rows: { icon: string; label: string; value: string }[] = [
    { icon: "location_on", label: "Zona", value: live.area },
    { icon: "agriculture", label: crop.category === "pukes" ? "Aptuvenais ziedēšanas laiks" : "Aptuvenais ražas laiks", value: harvestEstimate(live) },
    { icon: elem.icon, label: "Labākā Mēness diena", value: `${elem.partLabel} (${elem.label})` },
    ...(soil ? [{ icon: "thermostat", label: soil.label, value: soil.value }] : []),
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
        <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b border-outline-variant/10 bg-surface-container-high p-md">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-4xl leading-none">{cropEmoji(live.cropId)}</span>
            <div className="min-w-0">
              <h3 id="plant-detail-title" className="text-headline-md text-on-surface [overflow-wrap:anywhere]">{plantDisplayName(live)}</h3>
              <p className="text-body-md text-on-surface-variant">{live.seed ? "Parauga augs" : live.area}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Aizvērt"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-md p-md">
          {/* Care log */}
          {live.seed ? (
            <section className="space-y-2" aria-labelledby="example-care-heading">
              <h4 id="example-care-heading" className="text-title-md text-on-surface">Kopšanas žurnāla piemērs</h4>
              <p className="text-body-md text-on-surface-variant">Savā dārzā vari pierakstīt, kad augu laistīji, mēsloji vai ievāci ražu.</p>
              <div className="flex items-center gap-sm rounded-lg bg-background/40 p-sm text-on-surface">
                <Icon name="water_drop" className="text-primary" size="20px" />
                <div>
                  <p className="font-semibold">Laistīts · <time dateTime={today}>{LOG_DATE_FMT.format(new Date(today))}</time></p>
                  <p className="text-body-md text-on-surface-variant">Aplaistīju pēc augsnes mitruma pārbaudes.</p>
                </div>
              </div>
            </section>
          ) : (
            <section aria-labelledby="plant-care-heading">
              <h4 id="plant-care-heading" className="mb-sm text-title-md text-on-surface">Kopšanas žurnāls</h4>
              <fieldset disabled={savingLog || syncing} aria-label="Ieraksta veids" className="mb-sm flex flex-wrap gap-2">
                {(Object.keys(LOG_META) as LogType[]).map((t) => (
                  <Chip key={t} tone="neutral" active={t === logType} onClick={() => { setLogType(t); setLogFailed(false); setSavedLog(null); }}>
                    {LOG_META[t].label}
                  </Chip>
                ))}
              </fieldset>
              <form onSubmit={(event) => { event.preventDefault(); void submitLog(); }}>
                <fieldset disabled={savingLog || syncing} aria-label="Kopšanas ieraksts" className="flex min-w-0 flex-wrap gap-2">
                  {logType === "raza" && (
                    <>
                      <div className="w-full">
                        <label className="inline-flex max-w-full flex-col gap-1 text-label-md text-on-surface">
                          Ražas novākšanas datums
                          <input type="date" required min={sownOn ?? undefined} max={today} value={harvestDate ?? today}
                            onChange={(event) => setHarvestDate(event.target.value)} aria-invalid={Boolean(harvestError)}
                            aria-describedby={harvestError ? "harvest-date-error" : undefined}
                            className="min-h-11 min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface" />
                        </label>
                        {harvestError && <p id="harvest-date-error" role="status" className="mt-1 text-body-sm text-error">{harvestError}</p>}
                      </div>
                      <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(5.5rem,0.55fr)] gap-2">
                        <label className="flex min-w-0 flex-col gap-1 text-label-md text-on-surface">
                          Ražas daudzums
                          <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)}
                            inputMode={harvestUnit === "gab" ? "numeric" : "decimal"} step={harvestUnit === "gab" ? "1" : "any"} min={harvestUnit === "gab" ? "1" : "0"}
                            aria-invalid={Boolean(amountError)} aria-describedby={amountError ? "harvest-amount-error" : "harvest-amount-help"}
                            className="min-h-11 min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface" />
                        </label>
                        <label className="flex min-w-0 flex-col gap-1 text-label-md text-on-surface">
                          Mērvienība
                          <select value={harvestUnit} onChange={(event) => setHarvestUnit(event.target.value === "gab" ? "gab" : "kg")}
                            className="min-h-11 min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-2 py-2 text-body-md text-on-surface">
                            <option value="kg">kg</option>
                            <option value="gab">gab.</option>
                          </select>
                        </label>
                      </div>
                      <p id="harvest-amount-help" className="w-full text-body-sm text-on-surface-variant">Ja pieraksti tikai ražas datumu, daudzumu atstāj tukšu.</p>
                      {amountError && <p id="harvest-amount-error" role="status" className="w-full text-body-sm text-error">{amountError}</p>}
                    </>
                  )}
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Piezīme (neobligāti)"
                    aria-label="Piezīme"
                    className="min-w-0 flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                  />
                  <Button type="submit" icon="check" className="px-sm py-xs" disabled={Boolean(harvestError || amountError)}>
                    Saglabāt ierakstu
                  </Button>
                  {logFailed && <p role="alert" className="w-full text-body-sm text-error">Ieraksta saglabāšana neizdevās. Vari mēģināt vēlreiz.</p>}
                </fieldset>
              </form>

              <div role="status" aria-live="polite" className={savedLog ? "mt-xs text-body-md text-primary" : "sr-only"}>
                {savedLog && <>Saglabāts auga žurnālā. {LOG_META[savedLog.type].label} · <time dateTime={savedLog.date}>{LOG_DATE_FMT.format(new Date(savedLog.date))}</time></>}
              </div>
              {entries.length > 0 && (
                <ul className="mt-sm space-y-1.5" aria-label="Saglabātie kopšanas ieraksti">
                  {(showAllLogs ? entries : entries.slice(0, 3)).map((l) => (
                    <li key={l.id} className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2 text-body-md">
                      <Icon name={LOG_META[l.type]?.icon ?? "edit_note"} size="18px" className="shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <span className="text-on-surface">{LOG_META[l.type]?.label ?? "Kopšanas ieraksts"}</span>
                        {typeof l.amount === "number" && Number.isFinite(l.amount) && <span className="ml-2 text-secondary">{QUANTITY_FMT.format(l.amount)}{l.unit === "gab" ? " gab." : l.unit === "kg" ? " kg" : ""}</span>}
                        {l.note && <p className="break-words text-on-surface-variant">{l.note}</p>}
                      </div>
                      {isGardenDate(l.date, today)
                        ? <time dateTime={l.date} className="whitespace-nowrap text-label-sm text-on-surface-variant">{LOG_DATE_FMT.format(new Date(l.date))}</time>
                        : <span className="text-label-sm text-on-surface-variant">Datums nav zināms</span>}
                      <button
                        onClick={() => { setSavedLog(null); removeLog(live.id, l.id); }}
                        aria-label="Dzēst ierakstu"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant/70 transition-colors hover:bg-surface-variant/50 hover:text-error"
                      >
                        <Icon name="close" size="14px" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {entries.length > 3 && (
                <button type="button" aria-expanded={showAllLogs} onClick={() => setShowAllLogs(!showAllLogs)}
                  className="mt-1 inline-flex min-h-11 items-center text-label-md font-semibold text-primary underline underline-offset-2">
                  {showAllLogs ? "Rādīt pēdējos trīs" : `Skatīt visus ierakstus (${entries.length})`}
                </button>
              )}
            </section>
          )}

          {!live.seed && <PlantCultivarEditor key={live.id} plant={live} />}
          {st.progress !== null && (
            <div className="space-y-1">
              <p className="text-body-sm text-on-surface-variant">{st.label}</p>
              <ProgressBar value={st.progress} tone={st.tone} glow={st.tone === "secondary"} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center gap-2 rounded-lg bg-background/40 p-sm">
                <Icon name={r.icon} size="20px" className="text-primary" />
                <div>
                  <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{r.label}</p>
                  <p className="text-body-md text-on-surface">{r.value}</p>
                  {r.icon === "agriculture" && <p className="text-label-sm text-on-surface-variant">Laiku ietekmē šķirne un augšanas apstākļi.</p>}
                </div>
              </div>
            ))}
          </div>

          <section className="space-y-sm">
            <h4 className="text-label-md font-semibold text-on-surface">Sējas un stādīšanas datumi</h4>
            {sownOn && (
              <p className="text-body-md text-on-surface">Iesēts {DATE_FMT.format(new Date(sownOn))}</p>
            )}
            {plantedOn && (
              <p className="text-body-md text-on-surface">{crop.sowIndoors && crop.transplant ? "Dēsts izstādīts" : "Iestādīts"} {DATE_FMT.format(new Date(plantedOn))}</p>
            )}
            {!sownOn && !plantedOn && <p className="text-body-md text-on-surface-variant">Datums nav norādīts.</p>}
            {!live.seed && (editingDates ? (
              <PlantDateForm
                crop={crop}
                plant={live}
                disabled={syncing}
                onSave={async (start) => {
                  if (start.action === "unknown") return false;
                  const saved = await recordPlantDate(live.id, start.action, start.date);
                  if (saved) setEditingDates(false);
                  return saved;
                }}
                onCancel={() => setEditingDates(false)}
              />
            ) : (
              <Button variant="outline" icon="edit" disabled={syncing} onClick={() => setEditingDates(true)}>
                {sownOn || plantedOn ? "Labot vai papildināt datumus" : "Pierakstīt datumu"}
              </Button>
            ))}
          </section>

          {/* Succession */}
          {succ && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary-container/10 p-sm">
              <Icon name="restart_alt" size="20px" className="text-primary" />
              <span className="text-body-md text-on-surface">
                Atkārtotā sēja: nākamā partija ~{SHORT_FMT.format(succ.date)}
                {!succ.inWindow && " (ārpus sējas loga)"}
              </span>
              {!live.seed && <Button
                variant="outline"
                className="ml-auto px-sm py-xs"
                onClick={() => addPlant(live.cropId, live.area, { action: "sown", date: latviaDateKey() }, live.cultivar ?? undefined)}
              >
                Atzīmēt kā iesētu
              </Button>}
            </div>
          )}

          {crop.note && (
            <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-container/10 p-sm">
              <Icon name="tips_and_updates" size="20px" className="text-primary" />
              <p className="text-body-md italic text-on-surface-variant">{crop.note}</p>
            </div>
          )}

          {!live.seed && <Button
            variant="ghost"
            icon="delete"
            fullWidth
            onClick={() => {
              onRemove();
              onClose();
            }}
          >
            Izņemt no dārza
          </Button>}
        </div>
      </>
    </Modal>
  );
}

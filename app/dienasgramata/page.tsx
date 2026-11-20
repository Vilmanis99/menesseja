"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlantDetail } from "@/components/plant-detail";
import { useGarden } from "@/components/garden-context";
import { plantDisplayName } from "@/lib/plant-display-name";
import { isGardenDate, LOG_META } from "@/lib/garden";
import { latviaDateKey } from "@/lib/day-anchor";
import { moonForDate } from "@/lib/moon";

interface Entry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  title: string;
  body: string;
  tags: string[];
}

const STORAGE_KEY = "meness-seja:journal";
const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { dateStyle: "long", timeZone: "Europe/Riga" });
const QUANTITY_FMT = new Intl.NumberFormat("lv-LV", { maximumFractionDigits: 10 });

function readNotes(): Entry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const notes: unknown = JSON.parse(raw);
  if (!Array.isArray(notes) || !notes.every((note) => note && typeof note.id === "string"
    && isGardenDate(note.date, "9999-12-31") && typeof note.title === "string" && typeof note.body === "string"
    && Array.isArray(note.tags) && note.tags.every((tag: unknown) => typeof tag === "string"))) {
    throw new Error("Neizdevās nolasīt piezīmes.");
  }
  return notes;
}

let counter = 0;
const newId = () => globalThis.crypto?.randomUUID?.() ?? `e-${Date.now().toString(36)}-${counter++}`;

export default function DienasgramataPage() {
  const { plants, hydrated: gardenReady, removePlant } = useGarden();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [composing, setComposing] = useState(false);
  const [openPlantId, setOpenPlantId] = useState<string | null>(null);
  const openPlant = plants.find((plant) => plant.id === openPlantId);

  useEffect(() => {
    function refresh(event?: StorageEvent) {
      if (event && event.key !== null && event.key !== STORAGE_KEY) return;
      try {
        setEntries(readNotes());
        setStorageError("");
      } catch {
        setStorageError("Neizdevās nolasīt šajā pārlūkā saglabātās piezīmes.");
      }
      setHydrated(true);
    }
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const { timeline, harvestCount, floweringCount } = useMemo(() => {
    const notes = entries.map((entry) => ({
      kind: "note" as const, key: `note:${entry.id}`, date: entry.date, entry,
    }));
    const plantEvents = plants.filter((plant) => !plant.seed).flatMap((plant) =>
      (plant.log ?? [])
        .filter((log) => (log.type === "raza" || log.type === "ziedesana") && isGardenDate(log.date))
        .map((log) => ({ kind: "plant" as const, key: `event:${plant.id}:${log.id}`, date: log.date, plant, log })),
    );
    const harvestCount = plantEvents.filter(({ log }) => log.type === "raza").length;
    return {
      timeline: [...notes, ...plantEvents].sort((a, b) => b.date.localeCompare(a.date) || b.key.localeCompare(a.key)),
      harvestCount,
      floweringCount: plantEvents.length - harvestCount,
    };
  }, [entries, plants]);

  function changeNotes(update: (stored: Entry[]) => Entry[]): boolean {
    try {
      const next = update(readNotes());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setEntries(next);
      setStorageError("");
      return true;
    } catch {
      setStorageError("Piezīmes izmaiņas neizdevās saglabāt šajā pārlūkā.");
      return false;
    }
  }

  function addEntry(entry: Omit<Entry, "id">) {
    if (changeNotes((stored) => [{ ...entry, id: newId() }, ...stored])) setComposing(false);
  }

  return (
    <>
      <PageHeader
        title="Dārza dienasgrāmata"
        subtitle="Tavas piezīmes, augu ziedēšana un raža datumu secībā."
        action={<Button disabled={!hydrated} icon="edit_note" onClick={() => setComposing(true)}>Jauns ieraksts</Button>}
      />

      {composing && <ComposeSheet onClose={() => setComposing(false)} onSave={addEntry} error={storageError} />}
      {openPlant && <PlantDetail key={openPlant.id} plant={openPlant} onClose={() => setOpenPlantId(null)}
        onRemove={() => removePlant(openPlant.id)} />}
      {storageError && !composing && <p role="alert" className="mb-sm text-body-md text-error">{storageError}</p>}

      {hydrated && gardenReady ? <>
        <dl className="mb-md flex flex-wrap gap-x-md gap-y-1 text-body-md text-on-surface-variant">
          <div className="flex gap-2"><dt>Piezīmes</dt><dd className="font-semibold text-on-surface">{entries.length}</dd></div>
          <div className="flex gap-2"><dt>Ziedēšanas ieraksti</dt><dd className="font-semibold text-on-surface">{floweringCount}</dd></div>
          <div className="flex gap-2"><dt>Ražas ieraksti</dt><dd className="font-semibold text-on-surface">{harvestCount}</dd></div>
        </dl>
        {timeline.length === 0 ? <p className="mb-md text-body-md text-on-surface-variant">Pievieno pirmo piezīmi. Šeit parādīsies arī ziedēšana un raža, ko pierakstīsi auga kopšanas žurnālā.</p> :
          <ol aria-label="Dienasgrāmatas ieraksti" className="space-y-md">
            {timeline.map((row) => (
              <li key={row.key}>
                <Card tone="high" className="p-md">
                  <time dateTime={row.date} className="text-label-md text-secondary">{DATE_FMT.format(new Date(row.date))}</time>
                  {row.kind === "plant" ? <>
                    <h2 className="mt-1 break-words text-headline-md text-on-surface">{LOG_META[row.log.type].label} · {plantDisplayName(row.plant)}</h2>
                    <p className="mt-1 text-body-md text-on-surface">
                      {row.plant.area}
                      {row.log.type === "raza" && typeof row.log.amount === "number" && Number.isFinite(row.log.amount) && <> · {QUANTITY_FMT.format(row.log.amount)}{row.log.unit === "kg" ? " kg" : row.log.unit === "gab" ? " gab." : ""}</>}
                    </p>
                    {row.log.note && <p className="mt-1 whitespace-pre-wrap break-words text-body-md text-on-surface-variant">{row.log.note}</p>}
                    <button type="button" onClick={() => setOpenPlantId(row.plant.id)}
                      aria-label={`Atvērt kopšanas žurnālu · ${plantDisplayName(row.plant)}`}
                      className="mt-1 inline-flex min-h-11 items-center text-body-md text-primary underline underline-offset-2">
                      Atvērt kopšanas žurnālu
                    </button>
                  </> : <>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="mt-1 min-w-0 break-words text-headline-md text-on-surface">{row.entry.title}</h2>
                      <button type="button" onClick={() => changeNotes((stored) => stored.filter((entry) => entry.id !== row.entry.id))}
                        aria-label={`Dzēst ierakstu · ${row.entry.title}`} title="Dzēst ierakstu"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:text-error">
                        <Icon name="delete" size="18px" />
                      </button>
                    </div>
                    {row.entry.body && <p className="mt-1 whitespace-pre-wrap break-words text-body-md text-on-surface-variant">{row.entry.body}</p>}
                    {row.entry.tags.length > 0 && <div className="mt-sm flex flex-wrap gap-2">
                      {row.entry.tags.map((tag, i) => <Chip key={i} tone="primary">{tag}</Chip>)}
                    </div>}
                  </>}
                </Card>
              </li>
            ))}
          </ol>}
      </> : <p role="status" className="text-body-md text-on-surface-variant">Ielādē dienasgrāmatu…</p>}
    </>
  );
}

function ComposeSheet({
  onClose,
  onSave,
  error,
}: {
  onClose: () => void;
  onSave: (e: Omit<Entry, "id">) => void;
  error: string;
}) {
  const today = latviaDateKey();
  const moonTag = moonForDate(new Date()).name;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");

  function submit() {
    if (!title.trim()) return;
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ date: today, title: title.trim(), body: body.trim(), tags: [moonTag, ...tags] });
  }

  return (
    <Modal
      onClose={onClose}
      zClass="z-[100]"
      labelledBy="compose-title"
      panelClassName="flex max-h-[88vh] w-full flex-col gap-sm overflow-y-auto rounded-t-2xl border border-outline-variant/20 bg-surface-container-high p-md shadow-2xl sm:max-w-[32rem] sm:rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <h3 id="compose-title" className="text-headline-md text-on-surface">Jauns ieraksts</h3>
        <button
          onClick={onClose}
          aria-label="Aizvērt"
          className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
        >
          <Icon name="close" />
        </button>
      </div>
      <p className="text-label-sm uppercase tracking-wider text-tertiary">
        <Icon name="brightness_3" size="14px" className="mr-1 align-middle" />
        {moonTag} · {DATE_FMT.format(new Date(today))}
      </p>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Virsraksts (piem. Pirmie redīsi)"
        aria-label="Ieraksta virsraksts"
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Ko šodien novēroji dārzā?"
        rows={4}
        aria-label="Ieraksta teksts"
        className="resize-none rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
      />
      <input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Birkas, atdalītas ar komatu (piem. Siltumnīca, Tomāti)"
        aria-label="Birkas"
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
      />
      {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
      <Button icon="check" fullWidth onClick={submit} className="mt-sm" disabled={!title.trim()}>
        Saglabāt ierakstu
      </Button>
    </Modal>
  );
}

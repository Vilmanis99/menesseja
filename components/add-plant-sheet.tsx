"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { CROPS, CATEGORIES, type Category, type Crop } from "@/lib/planting-crops";
import { CultivarField } from "@/components/cultivar-field";
import { PlantDateForm } from "@/components/plant-date-form";
import { cropById, GARDEN_AREAS } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { useGarden } from "@/components/garden-context";
import { track } from "@/lib/analytics";
import { normalizeArticleQuery } from "@/lib/article-search";

/** "Pievienot augu" — opens an accessible sheet/modal. Also auto-opens when a
 *  crop page deep-links via ?pievienot=<cropId>. */
export function AddPlantButton({ label = "Pievienot augu", onAdded, handleDeepLink = false }: {
  label?: string;
  onAdded?: () => void;
  handleDeepLink?: boolean;
} = {}) {
  const [selection, setSelection] = useState<{ cropId?: string; missingCrop?: boolean } | null>(null);

  useEffect(() => {
    if (!handleDeepLink) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get("pievienot");
    if (id === null) return;
    const cropId = cropById(id)?.id;
    setSelection({ cropId, missingCrop: !cropId && id !== "izveleties" });
    track("garden_add_started", { crop_id: cropId, source: "deep_link" });
    url.searchParams.delete("pievienot");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [handleDeepLink]);

  return (
    <>
      <Button icon="add" onClick={() => { track("garden_add_started", { source: "dashboard" }); setSelection({}); }}>
        {label}
      </Button>
      {selection && (
        <AddPlantSheet initialCrop={selection.cropId} missingCrop={selection.missingCrop} onAdded={onAdded} onClose={() => setSelection(null)} />
      )}
    </>
  );
}

function AddPlantSheet({ onClose, initialCrop, missingCrop, onAdded }: {
  onClose: () => void;
  initialCrop?: string;
  missingCrop?: boolean;
  onAdded?: () => void;
}) {
  const { addPlant, hydrated } = useGarden();
  const [selectedCrop, setSelectedCrop] = useState(() => initialCrop ? cropById(initialCrop) : undefined);
  const [cat, setCat] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("");
  const [cultivar, setCultivar] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const firstResult = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const normalizedQuery = normalizeArticleQuery(query);
  const compactQuery = normalizedQuery.replaceAll(" ", "");
  const crops = CROPS.filter((crop) =>
    (cat === "all" || crop.category === cat) &&
    (!compactQuery || [crop.name, ...(crop.aliases ?? [])].some((name) =>
      normalizeArticleQuery(name).replaceAll(" ", "").includes(compactQuery),
    )),
  );

  function chooseCrop(crop: Crop) {
    setSelectedCrop(crop);
    requestAnimationFrame(() => heading.current?.focus());
  }

  return (
    <Modal
      onClose={onClose}
      zClass="z-[100]"
      labelledBy="add-plant-title"
      panelClassName="modal-panel-safe flex w-full flex-col rounded-t-2xl border border-outline-variant/20 bg-surface-container-high shadow-2xl sm:max-w-[32rem] sm:rounded-2xl"
    >
      {/* Header */}
      <div className="border-b border-outline-variant/10 p-md">
        <div className="flex items-center justify-between">
          <h3 id="add-plant-title" ref={heading} tabIndex={-1} className="text-headline-md text-on-surface">{selectedCrop?.name ?? "Pievienot augu"}</h3>
          <button
            onClick={onClose}
            aria-label="Aizvērt"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {selectedCrop ? "Norādi, kur augs aug un kad to sēji vai stādīji." : missingCrop ? "Saitē norādīto augu neatradām. Izvēlies augu no saraksta." : "Izvēlies augu, ko pievienot savam dārzam."}
        </p>
      </div>

      {selectedCrop ? (
        <div className="custom-scrollbar min-h-0 space-y-md overflow-y-auto p-md">
          <PlantDateForm
            key={selectedCrop.id}
            crop={selectedCrop}
            disabled={!hydrated}
            onSave={async (start) => {
              if (!area || !await addPlant(selectedCrop.id, area, start, cultivar)) return false;
              onAdded?.();
              onClose();
            }}
            onCancel={() => {
              setSelectedCrop(undefined);
              setCultivar("");
              setArea("");
              requestAnimationFrame(() => searchInput.current?.focus());
            }}
          >
            <fieldset className="mb-sm">
              <legend className="mb-1 text-label-md font-semibold text-on-surface">Kur augs aug?</legend>
              <p className="mb-2 text-body-md text-on-surface-variant">Izvēlies vienu vietu savā dārzā vai mājās.</p>
              <div className="flex flex-wrap gap-2">
                {GARDEN_AREAS.map((place) => (
                  <label key={place} className="relative cursor-pointer">
                    <input className="peer sr-only" type="radio" name="garden-area" value={place} required
                      checked={place === area} onChange={() => setArea(place)} />
                    <span className="inline-flex min-h-11 items-center rounded-full bg-surface-variant/50 px-4 text-label-sm font-medium text-on-surface-variant peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">{place}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <CultivarField value={cultivar} onChange={setCultivar} />
          </PlantDateForm>
        </div>
      ) : (
        <>
          <form role="search" aria-label="Augu meklēšana" className="px-md pt-sm" onSubmit={(event) => {
            event.preventDefault();
            if (!normalizedQuery || !hydrated || !crops.length) return;
            if (crops.length === 1) chooseCrop(crops[0]);
            else firstResult.current?.focus();
          }}>
            <label htmlFor="add-plant-search" className="text-label-md font-semibold text-on-surface">Meklēt augu</label>
            <input id="add-plant-search" ref={searchInput} type="search" enterKeyHint="search" autoComplete="off"
              aria-controls="add-plant-results" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Piemēram, tomāti" className="mt-1 min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface" />
          </form>
          <div className="custom-scrollbar min-h-0 overflow-y-auto px-md pb-md">
            <div role="group" aria-label="Augu kategorijas" className="mt-sm flex flex-wrap gap-2">
              <Chip tone="neutral" active={cat === "all"} onClick={() => setCat("all")}>
                Visi
              </Chip>
              {CATEGORIES.map((c) => (
                <Chip key={c.id} tone="neutral" active={cat === c.id} onClick={() => setCat(c.id)}>
                  {c.label}
                </Chip>
              ))}
            </div>
            <p role="status" className="sr-only">{`Atrasto augu skaits ${crops.length}.`}</p>
            <div id="add-plant-results" className="mt-sm grid grid-cols-2 gap-2 sm:grid-cols-3">
              {crops.map((c, index) => (
                <button
                  key={c.id}
                  ref={index === 0 ? firstResult : undefined}
                  type="button"
                  onClick={() => chooseCrop(c)}
                  disabled={!hydrated}
                  className="flex min-h-14 items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container p-sm text-left transition-all duration-200 hover:border-primary/50 active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/40">
                    <span aria-hidden="true" className="text-xl leading-none">{cropEmoji(c.id)}</span>
                  </div>
                  <span className="text-body-md text-on-surface">{c.name}</span>
                </button>
              ))}
              {crops.length === 0 && (
                <div className="col-span-full py-sm">
                  <p className="text-body-md text-on-surface-variant">{cat === "all" ? "Augu ar šādu nosaukumu neatradām." : "Šajā kategorijā augu ar šādu nosaukumu neatradām."}</p>
                  <Button type="button" variant="ghost" onClick={() => {
                    setQuery("");
                    setCat("all");
                    searchInput.current?.focus();
                  }}>Rādīt visus augus</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {!hydrated && <p role="status" className="px-md pb-sm text-body-md text-on-surface-variant">Dārzs ielādējas…</p>}
    </Modal>
  );
}

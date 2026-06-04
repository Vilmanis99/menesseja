"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { CROPS, CATEGORIES, type Category } from "@/lib/planting-crops";
import { cropById, GARDEN_AREAS } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { useGarden } from "@/components/garden-context";

/** "Pievienot augu" — opens an accessible sheet/modal. Also auto-opens when a
 *  crop page deep-links via ?pievienot=<cropId>. */
export function AddPlantButton() {
  const [open, setOpen] = useState(false);
  const [initialCrop, setInitialCrop] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("pievienot");
    if (id && cropById(id)) {
      setInitialCrop(id);
      setOpen(true);
      // clean the URL so refresh doesn't re-open
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <>
      <Button icon="add" onClick={() => setOpen(true)}>
        Pievienot augu
      </Button>
      {open && (
        <AddPlantSheet
          initialCrop={initialCrop}
          onClose={() => {
            setOpen(false);
            setInitialCrop(null);
          }}
        />
      )}
    </>
  );
}

function AddPlantSheet({ onClose, initialCrop }: { onClose: () => void; initialCrop?: string | null }) {
  const { addPlant } = useGarden();
  const initialCat = (initialCrop && cropById(initialCrop)?.category) || "all";
  const [cat, setCat] = useState<Category | "all">(initialCat);
  const [area, setArea] = useState<string>(GARDEN_AREAS[0]);

  const crops = CROPS.filter((c) => cat === "all" || c.category === cat);

  const pick = (cropId: string) => {
    addPlant(cropId, area);
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      zClass="z-[100]"
      labelledBy="add-plant-title"
      panelClassName="flex max-h-[85vh] w-full flex-col rounded-t-2xl border border-outline-variant/20 bg-surface-container-high shadow-2xl sm:max-w-[32rem] sm:rounded-2xl"
    >
      {/* Header */}
      <div className="border-b border-outline-variant/10 p-md">
        <div className="flex items-center justify-between">
          <h3 id="add-plant-title" className="text-headline-md text-on-surface">Pievienot augu</h3>
          <button
            onClick={onClose}
            aria-label="Aizvērt"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Izvēlies zonu un augu. Tas parādīsies tavā dārzā — sekosim augšanai un atgādināsim darbus.
        </p>
      </div>

      {/* Area selector */}
      <div className="border-b border-outline-variant/10 px-md py-sm">
        <p className="mb-2 text-label-sm uppercase tracking-widest text-on-surface-variant">Zona</p>
        <div className="flex flex-wrap gap-2">
          {GARDEN_AREAS.map((a) => (
            <Chip key={a} tone="neutral" active={a === area} onClick={() => setArea(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="px-md pt-sm">
        <div className="flex flex-wrap gap-2">
          <Chip tone="neutral" active={cat === "all"} onClick={() => setCat("all")}>
            Visi
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} tone="neutral" active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Crop grid */}
      <div className="custom-scrollbar grid grid-cols-2 gap-2 overflow-y-auto p-md sm:grid-cols-3">
        {crops.map((c) => (
          <button
            key={c.id}
            onClick={() => pick(c.id)}
            className={`flex items-center gap-2 rounded-xl border bg-surface-container p-sm text-left transition-all hover:border-primary/50 active:scale-95 ${
              c.id === initialCrop ? "border-primary ring-1 ring-primary" : "border-outline-variant/20"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/40">
              <span className="text-xl leading-none">{cropEmoji(c.id)}</span>
            </div>
            <span className="text-body-md text-on-surface">{c.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

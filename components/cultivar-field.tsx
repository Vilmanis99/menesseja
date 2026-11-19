"use client";

import { useState, type FormEvent } from "react";
import { useGarden } from "@/components/garden-context";
import { Button } from "@/components/ui/button";
import { CULTIVAR_MAX_LENGTH, type Plant } from "@/lib/garden";

export function CultivarField({ value, onChange, disabled = false }: {
  value: string; onChange: (value: string) => void; disabled?: boolean;
}) {
  return (
    <label className="block space-y-1 text-label-md font-semibold text-on-surface">
      <span>Šķirne <span className="font-normal text-on-surface-variant">(neobligāti)</span></span>
      <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}
        maxLength={CULTIVAR_MAX_LENGTH} placeholder="Nosaukums uz paciņas vai etiķetes"
        className="min-h-11 w-full min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface" />
    </label>
  );
}

export function PlantCultivarEditor({ plant }: { plant: Plant }) {
  const { updateCultivar, syncing } = useGarden();
  const [draft, setDraft] = useState<{ original: Plant["cultivar"]; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving || syncing) return;
    setSaving(true);
    setFailed(false);
    try {
      if (await updateCultivar(plant.id, draft.value, draft.original)) setDraft(null);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  if (!draft) return (
    <Button type="button" variant="outline" icon="edit" disabled={syncing}
      onClick={() => { setDraft({ original: plant.cultivar, value: plant.cultivar ?? "" }); setFailed(false); }}>
      {plant.cultivar ? "Labot šķirni" : "Pievienot šķirnes nosaukumu"}
    </Button>
  );

  return (
    <form onSubmit={save} className="space-y-2">
      <CultivarField value={draft.value} disabled={saving} onChange={(value) => { setDraft({ ...draft, value }); setFailed(false); }} />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" icon="check" disabled={syncing || saving}>Saglabāt šķirni</Button>
        <Button type="button" variant="ghost" disabled={saving} onClick={() => setDraft(null)}>Atcelt</Button>
      </div>
      {failed && <p role="alert" className="text-body-sm text-error">Šķirnes izmaiņas neizdevās saglabāt. Tavs ievadītais nosaukums ir pieejams šajā laukā.</p>}
    </form>
  );
}

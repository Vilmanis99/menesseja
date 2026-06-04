"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SectionLabel } from "@/components/ui/section-label";
import { moonForDate } from "@/lib/moon";

interface Entry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  title: string;
  body: string;
  tags: string[];
}

const STORAGE_KEY = "meness-seja:journal";
const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric" });

const SAMPLES: Entry[] = [
  {
    id: "sample-1",
    date: "2026-05-12",
    title: "Tomātu stādīšana siltumnīcā",
    body: "Šodien beidzot pārvietoju 'Marmande' un 'Vērša Sirds' stādus uz pastāvīgo vietu. Zeme jau pietiekami sasilusi. Pievienoju nedaudz koka pelnu katrā bedrītē, kā vecmāmiņa mācīja.",
    tags: ["Siltumnīca", "Tomāti"],
  },
  {
    id: "sample-2",
    date: "2026-05-05",
    title: "Pirmā piparmētru raža",
    body: "Piparmētras dobē jau ir nepārspēti kuplas. Pirmā tēja no svaigām lapām garšo pēc īstas vasaras sākuma. Novācu dilstošā Mēness fāzē, kaltēšanai.",
    tags: ["Garšaugi", "Dilstošs mēness"],
  },
];

let counter = 0;
const newId = () => `e-${Date.now().toString(36)}-${counter++}`;

export default function DienasgramataPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw) as Entry[]);
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  const all = useMemo(
    () => [...entries, ...SAMPLES].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  );

  function addEntry(e: Omit<Entry, "id">) {
    setEntries((prev) => [{ ...e, id: newId() }, ...prev]);
    setComposing(false);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <>
      <PageHeader
        title="Dārza dienasgrāmata"
        subtitle="Dokumentē dabas ritmu, savus atklājumus un sezonālās pārmaiņas savā personīgajā dārza hronikā."
        action={<Button icon="edit_note" onClick={() => setComposing(true)}>Jauns ieraksts</Button>}
      />

      {composing && <ComposeSheet onClose={() => setComposing(false)} onSave={addEntry} />}

      {/* Season summary */}
      <div className="mb-lg grid grid-cols-1 gap-md md:grid-cols-3">
        <Card tone="high" elevated linen className="p-md md:col-span-2">
          <SectionLabel icon="eco" iconClassName="text-primary" className="mb-sm">
            Sezonas kopsavilkums
          </SectionLabel>
          <div className="grid grid-cols-2 gap-md">
            {[
              { label: "Tavi ieraksti", value: `${entries.length}`, note: "šosezon" },
              { label: "Pēdējais", value: all[0] ? DATE_FMT.format(new Date(all[0].date)) : "—", note: all[0]?.title ?? "" },
            ].map((c) => (
              <div key={c.label} className="rounded-xl bg-background/40 p-sm">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">{c.label}</p>
                <p className="mt-1 truncate text-headline-md text-primary">{c.value}</p>
                <p className="truncate text-label-sm text-on-surface-variant">{c.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card tone="highest" accent="secondary" className="flex flex-col justify-center gap-sm p-md text-center">
          <Icon name="local_fire_department" className="mx-auto text-secondary" size="32px" />
          <p className="text-display-lg leading-none text-secondary">{entries.length + SAMPLES.length}</p>
          <p className="text-label-md uppercase tracking-wider text-on-surface-variant">Ieraksti kopā</p>
        </Card>
      </div>

      {/* Chronological flow */}
      <SectionLabel icon="history" iconClassName="text-tertiary" className="mb-md">
        Hronoloģiskā plūsma
      </SectionLabel>
      <div className="space-y-md">
        {all.map((e) => {
          const isMine = entries.some((x) => x.id === e.id);
          return (
            <Card key={e.id} tone="high" elevated className="flex flex-col gap-md p-md sm:flex-row">
              <div className="flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary-container/20 to-surface-container sm:w-48">
                <Icon name="photo_camera" className="text-primary/40" size="40px" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-label-md uppercase tracking-wider text-secondary">
                    {DATE_FMT.format(new Date(e.date))}
                  </p>
                  {isMine && (
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="text-on-surface-variant/60 transition-colors hover:text-error"
                      title="Dzēst ierakstu"
                    >
                      <Icon name="delete" size="18px" />
                    </button>
                  )}
                </div>
                <h3 className="text-headline-md text-on-surface">{e.title}</h3>
                <p className="mt-1 text-body-md text-on-surface-variant">{e.body}</p>
                {e.tags.length > 0 && (
                  <div className="mt-sm flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <Chip key={t} tone="primary">
                        {t}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function ComposeSheet({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (e: Omit<Entry, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
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
      <Button icon="check" fullWidth onClick={submit} className="mt-sm" disabled={!title.trim()}>
        Saglabāt ierakstu
      </Button>
    </Modal>
  );
}

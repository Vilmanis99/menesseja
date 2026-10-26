"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storageGetJson, storageSet } from "@/lib/safe-storage";
import { Icon } from "@/components/ui/icon";

const ITEMS = [
  { id: "seeds", name: "Sēklas un šķirņu saraksts", note: "Pārbaudi atlikumus, dīgtspēju un vietu dobēs.", href: "/raksti/ka-izveleties-seklas-darzam" },
  { id: "containers", name: "Sēšanas trauki un paliktņi", note: "Vispirms iztīri esošos un pārbaudi drenāžas atveres.", href: "/raksti/destu-audzesana-uz-palodzes" },
  { id: "soil", name: "Sējai piemērots substrāts", note: "Daudzumu rēķini pēc plānotajiem traukiem.", href: "/raksti/destu-audzesana-uz-palodzes" },
  { id: "labels", name: "Etiķetes un pieraksti", note: "Atzīmē šķirni, sējas datumu un audzēšanas vietu.", href: "/raksti/kad-set-destus-rekini-atpakal" },
  { id: "light", name: "Gaisma dēstiem", note: "Lampu izvēlies tikai pēc vietas un sējas laika izvērtēšanas.", href: "/raksti/destu-audzesana-uz-palodzes" },
  { id: "frost", name: "Segums salnu laikā", note: "Izvērtē savas vietas salnu risku un aizsargājamo platību.", href: "/raksti/salnas-latvija" },
  { id: "supports", name: "Balsti un piesiešanas materiāli", note: "Pārbaudi esošos balstus un izvēlēto augu vajadzības.", href: "/raksti/tomatu-veidosana" },
  { id: "watering", name: "Laistīšanas piederumi", note: "Ieplāno ūdens pieejamību dobēm, podiem un siltumnīcai.", href: "/raksti/ka-laistit-darzu-karstuma" },
];
const KEY = "meness-seja:supplies:v1";
const OPTIONS = { review: "Izvērtēšu", have: "Jau ir", need: "Jāsagādā", skip: "Nav vajadzīgs" };
type Choice = keyof typeof OPTIONS;

export function SupplyChecklist() {
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    const stored = storageGetJson<Record<string, unknown>>(KEY);
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      setChoices(Object.fromEntries(ITEMS.filter((item) => typeof stored[item.id] === "string" && Object.hasOwn(OPTIONS, stored[item.id] as string)).map((item) => [item.id, stored[item.id] as Choice])));
    }
    setReady(true);
  }, []);
  const needed = ITEMS.filter((item) => choices[item.id] === "need");
  return <section id="pirkumu-saraksts" className="mb-xl scroll-mt-24" aria-labelledby="supply-title">
    <h2 id="supply-title" className="text-headline-lg-mobile text-on-surface">Pavasara piederumu kontrolsaraksts</h2>
    <p className="mt-sm max-w-2xl text-body-md text-on-surface-variant">Atzīmē, kas jau ir un kas vēl jāsagādā. Šis saraksts palīdz plānot; visi piederumi nav vajadzīgi katram dārzam.</p>
    <div className="mt-md grid gap-sm sm:grid-cols-2">
      {ITEMS.map((item) => <div key={item.id} className="rounded-xl border border-outline-variant/15 bg-surface-container p-md">
        <label htmlFor={`supply-${item.id}`} className="block text-title-md text-on-surface">{item.name}</label>
        <p className="mt-xs text-body-md text-on-surface-variant">{item.note}</p>
        <select id={`supply-${item.id}`} disabled={!ready} value={choices[item.id] ?? "review"} onChange={(event) => {
          const next = { ...choices, [item.id]: event.target.value as Choice };
          setChoices(next);
          setSaved(storageSet(KEY, JSON.stringify(next)));
        }} className="mt-sm min-h-11 w-full rounded-lg border border-outline-variant/30 bg-background px-3 text-body-md text-on-surface">
          {Object.entries(OPTIONS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Link href={item.href} className="mt-xs inline-flex min-h-11 items-center gap-1 text-body-md text-primary hover:underline">Kā izvēlēties <Icon name="arrow_forward" size="16px" /></Link>
      </div>)}
    </div>
    <div className="mt-md rounded-xl border border-primary/20 p-md" aria-live="polite">
      <p className="font-semibold text-on-surface">Jāsagādā: {needed.length === 0 ? "vēl nekas nav atzīmēts" : needed.map((item) => item.name.toLocaleLowerCase("lv")).join(", ")}.</p>
      <p className="mt-xs text-label-md text-on-surface-variant">{saved ? "Tava izvēle saglabājas šajā pārlūkā." : "Šajā pārlūkā izvēli neizdevās saglabāt. Pirms lapas aizvēršanas pieraksti savu sarakstu."}</p>
    </div>
  </section>;
}

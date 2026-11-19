"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import {
  GERMINATION_ANCHOR, batchHash, batchIdFromHash, parseSampleCounts, readSeedTests,
  samplePercentage, saveSeedTest, type SeedTestEntry, type SeedTestInput,
} from "@/lib/seed-germination";

const empty: SeedTestInput = { name: "", tested: "", sprouted: "" };
const labelClass = "flex min-w-0 flex-col gap-1 text-label-md text-on-surface";
const inputClass = "min-h-11 w-full min-w-0 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 text-body-md text-on-surface";
const dateFormat = new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium" });

export function SeedGerminationNotebook() {
  const [input, setInput] = useState(empty);
  const [current, setCurrent] = useState<SeedTestEntry | null>(null);
  const [notebook, setNotebook] = useState<ReturnType<typeof readSeedTests>>({ entries: [], warning: "" });
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const counts = parseSampleCounts(input);

  function edit(entry: SeedTestEntry | null) {
    const batch = entry?.batch;
    setCurrent(entry);
    setInput(batch ? { name: batch.name, tested: String(batch.tested), sprouted: batch.sprouted === null ? "" : String(batch.sprouted) } : empty);
    setMessage("");
  }

  function openLinkedBatch() {
    const saved = readSeedTests();
    setNotebook(saved);
    const hash = window.location.hash;
    if (hash === "#" + GERMINATION_ANCHOR) edit(null);
    if (!hash.startsWith("#" + GERMINATION_ANCHOR + "?")) return;
    const id = batchIdFromHash(hash);
    const entry = saved.entries.find((item) => item.batch.id === id) ?? null;
    edit(entry);
    if (!entry) setMessage("Šim pierakstam šajā pārlūkā nav pieejamu datu. Var sākt jaunu partiju.");
    const heading = document.getElementById(GERMINATION_ANCHOR);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView();
    }
  }

  useEffect(() => {
    openLinkedBatch();
    setReady(true);
    function refreshList() { setNotebook(readSeedTests()); }
    window.addEventListener("hashchange", openLinkedBatch);
    window.addEventListener("storage", refreshList);
    return () => {
      window.removeEventListener("hashchange", openLinkedBatch);
      window.removeEventListener("storage", refreshList);
    };
  }, []);

  function change(field: keyof SeedTestInput, value: string) {
    setInput((previous) => ({ ...previous, [field]: value }));
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = saveSeedTest(input, current);
    if ("error" in result) {
      setMessage(result.error);
      return;
    }
    edit(result);
    setNotebook(readSeedTests());
    window.history.replaceState(window.history.state, "", batchHash(result.batch.id));
    setMessage(result.batch.sprouted === null ? "Partija saglabāta. Kad sēklas būs sadīgušas, atver šo pierakstu un papildini rezultātu." : "Partijas rezultāts saglabāts.");
  }

  function startNew() {
    edit(null);
    window.history.replaceState(window.history.state, "", "#" + GERMINATION_ANCHOR);
    nameField.current?.focus();
  }

  function reopen(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (window.location.hash === batchHash(id)) {
      event.preventDefault();
      openLinkedBatch();
    }
  }

  return (
    <div className="rounded-xl border border-primary/35 bg-surface-container p-sm sm:p-md">
      <noscript><p className="mb-2 text-body-sm text-on-surface">Partiju pierakstam ieslēdz JavaScript. Aprēķina piemēru atradīsi nākamajā sadaļā.</p></noscript>
      <form onSubmit={save} aria-labelledby={GERMINATION_ANCHOR}>
        <label className={labelClass}>Partija vai šķirne
          <input disabled={!ready} ref={nameField} className={inputClass} value={input.name} onChange={(e) => change("name", e.target.value)} maxLength={120} required placeholder="Piemēram, burkāni ‘Nantes’, 2025" />
        </label>
        <div className="mt-sm grid gap-sm sm:grid-cols-2">
          <label className={labelClass}>Pārbaudīto sēklu skaits
            <input disabled={!ready} className={inputClass} value={input.tested} onChange={(e) => change("tested", e.target.value)} type="text" inputMode="numeric" pattern="[0-9]+" required />
          </label>
          <label className={labelClass}>Sadīgušo sēklu skaits
            <input disabled={!ready} className={inputClass} value={input.sprouted} onChange={(e) => change("sprouted", e.target.value)} type="text" inputMode="numeric" pattern="[0-9]+" aria-describedby="seed-test-pending" />
          </label>
        </div>
        <p id="seed-test-pending" className="mt-2 text-body-sm text-on-surface-variant">Kamēr gaidi rezultātu, sadīgušo skaitu atstāj tukšu. Ja pārbaudes beigās nesadīga neviena, ieraksti 0.</p>
        <div aria-live="polite" aria-atomic="true" className="mt-sm text-body-md">
          {"error" in counts
            ? (input.tested || input.sprouted) && <p className="text-on-surface">{counts.error}</p>
            : counts.sprouted !== null && <p className="rounded-lg bg-primary-container/40 p-sm text-on-surface">Sadīga <strong>{counts.sprouted} no {counts.tested}</strong> sēklām. Parauga dīgtspēja <strong>{samplePercentage(counts.tested, counts.sprouted)}</strong>.</p>}
        </div>
        <div className="mt-sm flex flex-wrap gap-2">
          <button disabled={!ready} className="min-h-11 rounded-lg bg-primary px-4 text-label-md text-on-primary disabled:opacity-50" type="submit">{current ? "Saglabāt izmaiņas" : "Saglabāt partiju"}</button>
          {current && <button className="min-h-11 rounded-lg border border-outline-variant/50 px-4 text-label-md text-primary" type="button" onClick={startNew}>Sākt jaunu partiju</button>}
        </div>
        <p role="status" aria-atomic="true" className="mt-2 text-body-sm text-on-surface">{message}</p>
        {notebook.warning && <p className="text-body-sm text-on-surface">{notebook.warning}</p>}
      </form>
      {notebook.entries.length > 0 && (
        <div className="mt-sm border-t border-outline-variant/35 pt-sm">
          <h3 className="text-title-md text-on-surface">Manas saglabātās partijas</h3>
          <ul className="mt-2 divide-y divide-outline-variant/30">
            {notebook.entries.map(({ batch }) => (
              <li key={batch.id}>
                <a href={batchHash(batch.id)} onClick={(event) => reopen(event, batch.id)} aria-current={current?.batch.id === batch.id ? "true" : undefined} className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-3 rounded py-2 text-body-sm">
                  <span className="min-w-0 break-words text-primary underline underline-offset-2 [overflow-wrap:anywhere]">{batch.name}</span>
                  <span className="text-on-surface-variant">{dateFormat.format(new Date(batch.startedAt))} · {batch.sprouted === null ? "Pārbaudē " + batch.tested : batch.sprouted + " no " + batch.tested + " · " + samplePercentage(batch.tested, batch.sprouted)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { clsx } from "@/lib/clsx";
import { EMPTY_PROBLEM_FILTERS, matchesProblem, problemSearchParams, readProblemFilters, type ProblemFilters } from "@/lib/problem-search";

export interface ProblemLibraryItem {
  slug: string;
  type: "kaiteklis" | "slimiba";
  searchText: string;
  card: ReactNode;
}

const TYPES = [{ id: "visi", label: "Visi" }, { id: "kaiteklis", label: "Kaitēkļi" }, { id: "slimiba", label: "Slimības" }] as const;

export function ProblemLibrary({ items }: { items: ProblemLibraryItem[] }) {
  const [filters, setFilters] = useState<ProblemFilters>(EMPTY_PROBLEM_FILTERS);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visible = items.filter((item) => matchesProblem(item, filters));
  const active = Boolean(filters.query.trim()) || filters.type !== "visi";

  useEffect(() => {
    const restore = () => { clearTimeout(timer.current); setFilters(readProblemFilters(window.location.search)); };
    restore();
    window.addEventListener("popstate", restore);
    return () => { clearTimeout(timer.current); window.removeEventListener("popstate", restore); };
  }, []);

  function save(next = filters) {
    clearTimeout(timer.current);
    const query = problemSearchParams(next, window.location.search);
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  function update(next: ProblemFilters) {
    setFilters(next);
    clearTimeout(timer.current);
    if (next.type !== filters.type) save(next);
    else timer.current = setTimeout(() => save(next), 300);
  }

  function reset() { setFilters(EMPTY_PROBLEM_FILTERS); save(EMPTY_PROBLEM_FILTERS); input.current?.focus(); }

  return <div onClickCapture={(event) => { if ((event.target as Element).closest("a") && active) save(); }}>
    <form role="search" aria-label="Kaitēkļu un slimību meklēšana" className="mb-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm sm:p-md" onSubmit={(event) => { event.preventDefault(); save(); results.current?.focus({ preventScroll: true }); results.current?.scrollIntoView({ block: "start" }); }}>
      <label htmlFor="problem-search" className="mb-2 block text-title-md text-on-surface">Meklē pēc nosaukuma, auga vai pazīmes</label>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input ref={input} id="problem-search" name="q" type="search" value={filters.query} maxLength={120} onChange={(event) => update({ ...filters, query: event.target.value })} onBlur={() => save()} placeholder="Laputis, tomāti…" aria-controls="problem-results" aria-describedby="problem-search-help" className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container px-3 text-body-md text-on-surface focus:border-primary" />
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary hover:brightness-110">Meklēt</button>
      </div>
      <p id="problem-search-help" className="mt-2 text-label-md text-on-surface-variant">Der arī teksts bez garumzīmēm. Salīdzini vairākas pazīmes, pirms izvēlies rīcību.</p>
      <div role="group" aria-label="Ceļvežu veids" className="mt-sm flex flex-wrap gap-2">
        {TYPES.map((type) => <button key={type.id} type="button" aria-pressed={filters.type === type.id} onClick={() => update({ ...filters, type: type.id })} className={clsx("min-h-11 rounded-full border px-3 text-label-md", filters.type === type.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/50")}>
          {type.label} <span className="ml-1">{type.id === "visi" ? items.length : items.filter((item) => item.type === type.id).length}</span>
        </button>)}
      </div>
      {active && <button type="button" onClick={reset} className="mt-sm inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-2"><Icon name="close" size="18px" /> Notīrīt meklējumu un filtrus</button>}
    </form>

    <section id="problem-results" aria-labelledby="problem-results-heading">
      <div className="mb-sm flex items-center justify-between gap-sm">
        <h2 ref={results} tabIndex={-1} id="problem-results-heading" className="scroll-mt-24 text-headline-md text-on-surface">{active ? "Meklēšanas rezultāti" : "Atpazīšanas ceļveži"}</h2>
        <span role="status" aria-atomic="true" className="shrink-0 text-label-sm text-on-surface-variant">{visible.length} no {items.length}</span>
      </div>
      {visible.length ? <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <div key={item.slug}>{item.card}</div>)}</div> : <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-md text-center">
        <p className="text-body-lg text-on-surface">Nekas netika atrasts.</p>
        <p className="mt-2 text-body-md text-on-surface-variant">Pamēģini auga nosaukumu vai vienu pazīmi, piemēram, “plankumi”.</p>
        <button type="button" onClick={reset} className="mt-sm min-h-11 rounded-lg border border-primary/40 px-4 text-body-md text-primary">Skatīt visus ceļvežus</button>
      </div>}
    </section>
    <aside className="mt-lg rounded-xl border border-outline-variant/20 bg-surface-container-low p-md">
      <h2 className="text-title-md text-on-surface">Augs nīkuļo, bet kaitēkli neredzi?</h2>
      <p className="mt-2 text-body-md text-on-surface-variant">Pārbaudi arī laistīšanu, gaismu un temperatūru. Līdzīgas pazīmes var rasties dažādu iemeslu dēļ.</p>
      <Link href="/raksti?kategorija=Probl%C4%93mas" className="mt-2 inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-2">Skatīt augu kopšanas problēmas <Icon name="arrow_forward" size="18px" /></Link>
    </aside>
  </div>;
}

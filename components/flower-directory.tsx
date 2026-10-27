"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { flowerSearchParams, matchesFlower, readFlowerQuery, type FlowerDirectoryEntry } from "@/lib/flower-directory";

export interface FlowerDirectoryItem extends FlowerDirectoryEntry { photo?: ReactNode }

export function FlowerDirectory({ items }: { items: FlowerDirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visible = items.filter((item) => matchesFlower(item, query));
  const photos = visible.filter((item) => item.photo);
  const groups = new Map<string, FlowerDirectoryItem[]>();
  for (const item of visible) {
    const letter = item.name.charAt(0).toLocaleUpperCase("lv");
    groups.set(letter, [...(groups.get(letter) ?? []), item]);
  }

  useEffect(() => {
    const restore = () => { clearTimeout(timer.current); setQuery(readFlowerQuery(window.location.search)); };
    restore();
    window.addEventListener("popstate", restore);
    return () => { clearTimeout(timer.current); window.removeEventListener("popstate", restore); };
  }, []);

  function save(value = query) {
    clearTimeout(timer.current);
    const search = flowerSearchParams(value, window.location.search);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
  }
  function update(value: string) {
    setQuery(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(value), 300);
  }
  function reset() { setQuery(""); save(""); input.current?.focus(); }

  return <div onClickCapture={(event) => { if ((event.target as Element).closest("a")) save(); }}>
    <form role="search" aria-label="Puķu nosaukumu meklēšana" className="mb-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm sm:p-md" onSubmit={(event) => { event.preventDefault(); save(); heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start" }); }}>
      <label htmlFor="flower-search" className="mb-2 block text-title-md text-on-surface">Meklē puķi pēc nosaukuma</label>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input ref={input} id="flower-search" type="search" name="q" maxLength={120} value={query} onChange={(event) => update(event.target.value)} onBlur={() => save()} aria-controls="puku-nosaukumi puku-atteli" aria-describedby="flower-search-help" placeholder="Peonijas, pujenes, Paeonia…" className="min-h-11 min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container px-3 text-body-md text-on-surface focus:border-primary" />
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary hover:brightness-110">Meklēt</button>
      </div>
      <p id="flower-search-help" className="mt-2 text-body-sm text-on-surface-variant">Der latviskais, latīniskais vai tautas nosaukums, arī bez garumzīmēm. Meklēšana atlasa gan sarakstu, gan attēlus.</p>
      {query && <button type="button" onClick={reset} className="mt-2 min-h-11 text-body-md text-primary underline underline-offset-2">Notīrīt meklējumu</button>}
    </form>

    <nav aria-label="Puķu saraksta sadaļas" className="mb-md flex flex-wrap gap-2">
      {[["#puku-nosaukumi", "Nosaukumi A–Z"], ["#puku-atteli", `Attēli (${photos.length})`], ["#tautas-nosaukumi", "Tautas nosaukumi"], ["#puku-izvele", "Izvēle dārzam"]].map(([href, label]) => <a key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/30 px-4 text-body-sm text-primary hover:bg-surface-container">{label}</a>)}
    </nav>

    <section id="puku-nosaukumi" className="mb-lg scroll-mt-24" aria-labelledby="flower-names-title">
      <h2 ref={heading} tabIndex={-1} id="flower-names-title" className="scroll-mt-24 text-headline-md text-on-surface">{query.trim() ? "Atrasti puķu nosaukumi" : "Visi puķu nosaukumi alfabēta secībā (A–Z)"}</h2>
      <p role="status" aria-atomic="true" className="mt-2 text-body-sm text-on-surface-variant">{visible.length} no {items.length} nosaukumiem · {photos.length} ar attēlu</p>
      {!visible.length ? <div className="mt-sm rounded-xl bg-surface-container p-md">
        <p className="text-body-md text-on-surface">Šāds nosaukums sarakstā nav atrasts. Pamēģini īsāku vārdu vai latīnisko nosaukumu.</p>
        <button type="button" onClick={reset} className="mt-2 min-h-11 text-primary underline underline-offset-2">Rādīt visus nosaukumus</button>
      </div> : <>
        {!query.trim() && <nav aria-label="Alfabēts" className="my-md flex flex-wrap gap-2">
          {[...groups.keys()].map((letter) => <a key={letter} href={`#burts-${letter.toLocaleLowerCase("lv")}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-label-md font-semibold text-on-surface hover:bg-primary hover:text-on-primary">{letter}</a>)}
        </nav>}
        <div className="space-y-md">
          {[...groups].map(([letter, entries]) => <div key={letter}>
            <h3 id={`burts-${letter.toLocaleLowerCase("lv")}`} className={query.trim() && groups.size === 1 ? "sr-only" : "mb-1 scroll-mt-24 border-b border-outline-variant/20 pb-1 text-headline-md text-tertiary"}>{letter}</h3>
            <ul className="grid gap-x-md sm:grid-cols-2">
              {entries.map((item) => <li key={item.id} className="border-b border-outline-variant/10 py-sm">
                {item.href ? <Link href={item.href} className="inline-flex min-h-11 flex-wrap items-baseline gap-x-2 py-2 text-body-md font-semibold text-primary hover:underline"><span>{item.name}</span><span className="text-label-sm font-normal">{item.name === "Neļķes" ? "Turku neļķu ceļvedis" : "Ceļvedis"} →</span></Link> : <p className="text-body-md font-semibold text-on-surface">{item.name}</p>}
                {item.latin && <p className="text-body-sm italic text-on-surface-variant">{item.latin}</p>}
                {item.note && <p className="mt-1 text-body-sm text-on-surface-variant">{item.note}</p>}
                {item.aliases.length > 0 && <p className="mt-1 text-body-sm text-on-surface-variant">Arī: {item.aliases.join(", ")}. <a href="#tautas-nosaukumi" className="text-primary underline underline-offset-2">Nosaukumu skaidrojumi</a></p>}
              </li>)}
            </ul>
          </div>)}
        </div>
      </>}
    </section>

    <section id="puku-atteli" className="mb-lg scroll-mt-24" aria-labelledby="flower-photos-title">
      <h2 id="flower-photos-title" className="text-headline-md text-on-surface">Puķu nosaukumi un attēli</h2>
      <p className="mt-2 max-w-3xl text-body-md text-on-surface-variant">Foto palīdz salīdzināt izskatu. Pārbaudi arī lapas, auga augumu un etiķeti — ar zieda krāsu vien nepietiek sugas vai šķirnes noteikšanai.</p>
      {photos.length ? <div className="mt-md grid items-start gap-md sm:grid-cols-2 xl:grid-cols-3">{photos.map((item) => <div key={item.id}>{item.photo}</div>)}</div> : <p className="mt-sm rounded-xl bg-surface-container p-md text-body-md text-on-surface-variant">{visible.length ? "Šiem nosaukumiem pārbaudīts foto vēl nav pievienots." : "Attēli parādīsies, ja meklējumam būs atbilstošs nosaukums ar foto."}</p>}
    </section>
  </div>;
}

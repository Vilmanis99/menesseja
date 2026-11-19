import type { Metadata } from "next";
import Link from "next/link";
import { PortalSearchForm } from "@/components/portal-search-form";
import { portalQuery, searchPortal, type PortalResult } from "@/lib/portal-search";

export const metadata: Metadata = {
  title: "Meklēšana portālā",
  description: "Meklē augus, kopšanas padomus, mēnešu kalendārus un dārza rīkus.",
  alternates: { canonical: "/meklet" },
  robots: { index: false, follow: true },
};

function ResultList({ items }: { items: PortalResult[] }) {
  return <ul className="divide-y divide-outline-variant/25">
    {items.map((item) => <li key={item.href} className="py-2">
      <Link href={item.href} prefetch={false} className="inline-flex min-h-11 items-center text-title-md text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">{item.title}</Link>
      {item.description && <p className="max-w-3xl text-body-md text-on-surface-variant">{item.description}</p>}
    </li>)}
  </ul>;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const query = portalQuery((await searchParams).q);
  const results = searchPortal(query);
  const groups = new Map<PortalResult["group"], PortalResult[]>();
  for (const item of results) {
    const group = groups.get(item.group);
    if (group) group.push(item);
    else groups.set(item.group, [item]);
  }

  return <div className="mx-auto max-w-3xl">
    <h1 className="mb-sm text-headline-lg-mobile text-primary md:text-display-lg">Meklēšana</h1>
    <PortalSearchForm query={query} />
    {query && <p className="mb-md break-words text-body-md text-on-surface-variant">{results.length
      ? <>Rezultātu skaits vaicājumam «{query}» — {results.length}.</>
      : <>Vaicājumam «{query}» nekas netika atrasts. Mēģini īsāku nosaukumu vai citu vārdu.</>}</p>}
    {[...groups].map(([name, items]) => <section key={name} className="mb-lg">
      <h2 className="mb-1 text-headline-md text-on-surface">{name}</h2>
      <ResultList items={items.slice(0, 5)} />
      {items.length > 5 && <details>
        <summary className="w-fit cursor-pointer py-3 text-body-md font-semibold text-primary">Vēl {items.length - 5}</summary>
        <ResultList items={items.slice(5)} />
      </details>}
    </section>)}
  </div>;
}

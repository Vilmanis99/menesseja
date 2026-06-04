import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getTopList, getAllTopLists, topSlugs } from "@/lib/tops";
import { cropEmoji } from "@/lib/crop-visual";
import { cropById } from "@/lib/garden";
import { canonical, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return topSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopList(slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: canonical(`/topi/${t.slug}`) },
    openGraph: { title: t.title, description: t.subtitle, type: "article" },
  };
}

export default async function TopListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTopList(slug);
  if (!t) notFound();
  const items = [...t.items].sort((a, b) => a.rank - b.rank);
  const related = getAllTopLists().filter((x) => x.slug !== t.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.title,
    description: t.subtitle,
    inLanguage: "lv",
    itemListElement: items.map((it) => ({
      "@type": "ListItem",
      position: it.rank,
      name: it.name,
      url: canonical(`/augi/${it.cropId}`),
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Topi", item: canonical("/topi") },
      { "@type": "ListItem", position: 2, name: t.title, item: canonical(`/topi/${t.slug}`) },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/topi" className="hover:text-primary">Topi</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{t.category}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">{t.category}</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-lg">{t.title}</h1>
        <p className="mt-xs text-body-lg text-on-surface-variant">{t.subtitle}</p>
      </header>

      <div className="mb-lg space-y-md">
        {t.intro.map((p, i) => (
          <p key={i} className="text-body-lg leading-relaxed text-on-surface-variant">{p}</p>
        ))}
      </div>

      <ol className="mb-lg space-y-md">
        {items.map((it) => {
          const exists = !!cropById(it.cropId);
          const inner = (
            <Card tone="high" elevated className="flex items-start gap-md p-md">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-headline-md font-bold text-primary-fixed">
                {it.rank}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="flex items-center gap-2 text-headline-md text-on-surface">
                  <span className="text-xl leading-none">{cropEmoji(it.cropId)}</span>
                  {it.name}
                  {exists && <Icon name="arrow_outward" size="16px" className="text-on-surface-variant" />}
                </h2>
                <p className="mt-1 text-body-md leading-relaxed text-on-surface-variant">{it.blurb}</p>
              </div>
            </Card>
          );
          return (
            <li key={it.rank}>
              {exists ? (
                <Link href={`/augi/${it.cropId}`} className="block transition-opacity hover:opacity-90">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>

      <p className="mb-lg text-body-lg leading-relaxed text-on-surface-variant">{t.outro}</p>

      <DataNote variant="planting" withSources className="mb-lg" />

      {related.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Citi topi</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/topi/${r.slug}`} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="16px" /> {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

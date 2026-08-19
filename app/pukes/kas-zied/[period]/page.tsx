import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { BLOOM_PERIODS, ALL_SUMMER_ARTICLE, getBloomPeriod, flowersForPeriod } from "@/lib/bloom-periods";
import { FLOWER_TYPE_META, FLOWER_TYPE_ORDER } from "@/lib/flowers";
import { canonical, og, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOOM_PERIODS.map((p) => ({ period: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ period: string }>;
}): Promise<Metadata> {
  const { period } = await params;
  const p = getBloomPeriod(period);
  if (!p) return {};
  const path = `/pukes/kas-zied/${p.slug}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: canonical(path) },
    openGraph: og({ path, title: p.title, description: p.description, type: "article" }),
  };
}

export default async function BloomPeriodPage({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  const p = getBloomPeriod(period);
  if (!p) notFound();

  const flowers = flowersForPeriod(p);
  const byType = FLOWER_TYPE_ORDER.map((type) => ({
    type,
    meta: FLOWER_TYPE_META[type],
    items: flowers.filter((f) => f.type === type),
  })).filter((g) => g.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: p.h1,
    inLanguage: "lv",
    numberOfItems: flowers.length,
    itemListElement: flowers.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.name,
      url: canonical(`/pukes/${f.slug}`),
    })),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "lv",
    mainEntity: p.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const others = BLOOM_PERIODS.filter((o) => o.slug !== p.slug);

  return (
    <div className="mx-auto max-w-5xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />

      <PageHeader
        eyebrow="Puķu saraksts"
        title={p.h1}
        display
        subtitle={`${flowers.length} puķes Latvijas dārzam — ar ziedēšanas laiku, augstumu un vietu.`}
      />

      <p className="mb-md max-w-2xl text-body-lg text-on-surface-variant">{p.lead}</p>

      <Card tone="container" className="mb-lg flex items-start gap-sm p-md">
        <Icon name="event_available" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <h2 className="text-title-md text-on-surface">Ko darīt tagad</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">{p.now}</p>
        </div>
      </Card>

      <div className="space-y-lg">
        {byType.map((g) => (
          <section key={g.type}>
            <div className="mb-1 flex items-center gap-2">
              <Icon name={g.meta.icon} className="text-primary" />
              <h2 className="text-headline-md text-on-surface">
                {g.meta.label} ({g.items.length})
              </h2>
            </div>
            <p className="mb-sm text-body-md text-on-surface-variant">{g.meta.blurb}</p>
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              {g.items.map((f) => (
                <Link key={f.slug} href={`/pukes/${f.slug}`}>
                  <Card
                    tone="high"
                    elevated
                    className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest"
                  >
                    <span className="text-4xl leading-none">{f.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-headline-md text-on-surface">{f.name}</h3>
                      <p className="mt-0.5 text-body-md text-on-surface-variant">{f.tagline}</p>
                      <div className="mt-sm flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                          <Icon name="filter_vintage" size="14px" /> {f.bloom}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                          <Icon name="straighten" size="14px" /> {f.height}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                          <Icon name="wb_sunny" size="14px" /> {f.sun}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
        <div className="space-y-sm">
          {p.faq.map((f) => (
            <Card key={f.q} tone="low" className="p-md">
              <h3 className="text-title-md text-on-surface">{f.q}</h3>
              <p className="mt-1 text-body-md text-on-surface-variant">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Citi puķu saraksti</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/pukes/kas-zied/${o.slug}`}
              className="inline-flex min-h-11 items-center rounded-full bg-surface-container px-4 py-2 text-label-md text-on-surface hover:text-primary"
            >
              {o.h1}
            </Link>
          ))}
          <Link
            href={ALL_SUMMER_ARTICLE}
            className="inline-flex min-h-11 items-center rounded-full bg-surface-container px-4 py-2 text-label-md text-on-surface hover:text-primary"
          >
            Puķes, kas zied visu vasaru
          </Link>
          <Link
            href="/pukes"
            className="inline-flex min-h-11 items-center rounded-full bg-surface-container px-4 py-2 text-label-md text-on-surface hover:text-primary"
          >
            Visi puķu nosaukumi A–Z
          </Link>
        </div>
      </section>
    </div>
  );
}

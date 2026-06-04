import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { RecipeTodayBadge } from "@/components/recipe-today-badge";
import { getFlower, getAllFlowers, flowerSlugs, FLOWER_TYPE_META } from "@/lib/flowers";
import { canonical, SITE_NAME } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";

export const dynamicParams = false;

export function generateStaticParams() {
  return flowerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFlower(slug);
  if (!f) return {};
  const title = `${f.name} — kad stādīt, kā kopt un Mēness laiks Latvijā`;
  const description = `${f.tagline} Stādīšana, kopšana, ziedēšana (${f.bloom}) un labākā Mēness diena ${f.name.toLowerCase()} Latvijas dārzā.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/pukes/${f.slug}`) },
    openGraph: { title, description, type: "article" },
  };
}

export default async function FlowerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = getFlower(slug);
  if (!f) notFound();

  const tm = FLOWER_TYPE_META[f.type];
  const all = getAllFlowers();
  const related = (f.related ?? [])
    .map((s) => all.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 4);
  const siblings = related.length
    ? related
    : all.filter((x) => x.type === f.type && x.slug !== f.slug).slice(0, 4);

  const facts: { label: string; value: string }[] = [
    { label: "Ziedēšana", value: f.bloom },
    { label: "Augstums", value: f.height },
    { label: "Gaisma", value: f.sun },
    { label: "Stādīšana", value: f.plantWhen },
    { label: "Grūtība", value: f.difficulty },
    { label: "Pārziemo Latvijā", value: f.hardy ? "Jā" : "Nē — jāizrok / jāsedz" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${f.name} — kad stādīt un kā kopt Latvijā`,
    about: f.name,
    inLanguage: "lv",
    dateModified: `${DATA_REVIEWED}-01`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Puķes", item: canonical("/pukes") },
      { "@type": "ListItem", position: 2, name: f.name, item: canonical(`/pukes/${f.slug}`) },
    ],
  };
  const faqJsonLd = f.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: f.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      }
    : null;

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/pukes" className="hover:text-primary">Puķes</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{f.name}</span>
      </nav>

      <header className="mb-lg flex items-center gap-md">
        <span className="text-6xl leading-none">{f.emoji}</span>
        <div>
          <p className="flex items-center gap-1.5 text-label-sm uppercase tracking-[0.2em] text-tertiary">
            <Icon name={tm.icon} size="16px" /> {tm.label}
          </p>
          <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">{f.name}</h1>
          {f.latin && <p className="text-body-md italic text-on-surface-variant">{f.latin}</p>}
          <p className="mt-1 text-body-lg text-on-surface-variant">{f.tagline}</p>
        </div>
      </header>

      <div className="mb-lg space-y-sm">
        {f.intro.map((p, i) => (
          <p key={i} className="text-body-lg leading-relaxed text-on-surface-variant">{p}</p>
        ))}
      </div>

      {/* Facts */}
      <h2 className="mb-sm text-headline-md text-on-surface">Galvenais īsumā</h2>
      <div className="mb-lg grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facts.map((x) => (
          <Card key={x.label} tone="container" className="p-sm">
            <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{x.label}</p>
            <p className="text-body-md text-on-surface">{x.value}</p>
          </Card>
        ))}
      </div>

      {/* Moon timing — signature feature */}
      <Card tone="highest" elevated accent="primary" className="mb-lg p-md">
        <div className="mb-sm flex items-center gap-2">
          <Icon name="brightness_3" className="text-primary" />
          <h2 className="text-headline-md text-on-surface">Labākais laiks pēc Mēness</h2>
        </div>
        <p className="mb-sm text-body-md text-on-surface">{f.moonText}</p>
        <RecipeTodayBadge phase={f.moonPhase} element={f.moonElement} />
      </Card>

      {/* Planting */}
      <h2 className="mb-sm text-headline-md text-on-surface">Kā stādīt</h2>
      <Card tone="high" elevated className="mb-lg p-md">
        <ol className="space-y-sm">
          {f.planting.map((s, i) => (
            <li key={i} className="flex items-start gap-md">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-label-md font-bold text-primary-fixed">
                {i + 1}
              </span>
              <p className="pt-0.5 text-body-md leading-relaxed text-on-surface-variant">{s}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Care */}
      <h2 className="mb-sm text-headline-md text-on-surface">Kopšana</h2>
      <Card tone="high" className="mb-lg p-md">
        <ul className="space-y-1.5">
          {f.care.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
              <Icon name="check" size="16px" className="mt-1 shrink-0 text-primary" /> {s}
            </li>
          ))}
        </ul>
      </Card>

      {f.winter?.trim() && (
        <Card tone="container" accent="secondary" className="mb-lg flex items-start gap-sm p-md">
          <Icon name="ac_unit" className="text-secondary" size="20px" />
          <div>
            <p className="text-label-md uppercase tracking-wide text-secondary">Pārziemošana</p>
            <p className="mt-1 text-body-md text-on-surface-variant">{f.winter}</p>
          </div>
        </Card>
      )}

      {f.problems?.length ? (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Biežākās problēmas</h2>
          <Card tone="high" className="mb-lg p-md">
            <ul className="space-y-1.5">
              {f.problems.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <Icon name="bug_report" size="16px" className="mt-1 shrink-0 text-tertiary" /> {s}
                </li>
              ))}
            </ul>
            <Link href="/kaitekli" className="mt-sm inline-flex items-center gap-1 text-label-md text-primary hover:underline">
              Skatīt kaitēkļu un slimību ceļvedi <Icon name="arrow_forward" size="16px" />
            </Link>
          </Card>
        </>
      ) : null}

      {f.folklore?.trim() && (
        <Card tone="high" linen className="mb-lg flex items-start gap-sm p-md">
          <Icon name="auto_stories" className="text-tertiary" size="20px" />
          <p className="text-body-md italic text-on-surface">«{f.folklore}»</p>
        </Card>
      )}

      {f.faq?.length ? (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
          <div className="mb-lg space-y-2">
            {f.faq.map((q) => (
              <Card key={q.q} tone="container" className="p-md">
                <p className="mb-1 font-semibold text-on-surface">{q.q}</p>
                <p className="text-body-md text-on-surface-variant">{q.a}</p>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      <DataNote variant="moon" className="mb-lg" />

      {siblings.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Citas puķes</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} href={`/pukes/${x.slug}`} className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                {x.emoji} {x.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-md flex flex-wrap gap-3">
        <Link href="/pukes" className="text-label-md text-on-surface-variant hover:text-primary">← Visas puķes</Link>
        <Link href="/kalendars" className="text-label-md text-on-surface-variant hover:text-primary">Mēness kalendārs</Link>
        <Link href="/receptes" className="text-label-md text-on-surface-variant hover:text-primary">Mēslojuma receptes</Link>
      </div>
    </article>
  );
}

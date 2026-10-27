import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { ContentFigure } from "@/components/content-figure";
import { contentImage } from "@/lib/content-images";
import { getFlower, getAllFlowers, flowerSlugs, FLOWER_TYPE_META, type Flower, type FlowerSourceSection } from "@/lib/flowers";
import { CROPS } from "@/lib/planting-crops";
import { canonical, SITE_NAME, og } from "@/lib/seo";
import { BLOOM_PERIODS } from "@/lib/bloom-periods";
import { SEASONAL_LINKS_UPDATED_AT } from "@/lib/seasonal";

export const dynamicParams = false;

function SectionSources({ flower, section }: { flower: Flower; section: FlowerSourceSection }) {
  const references = flower.sectionSources?.[section];
  if (!references?.length) return null;
  return (
    <p className="mt-sm flex flex-wrap items-center gap-1 text-label-sm text-on-surface-variant">
      Sadaļas avoti:
      {references.map((url) => {
        const index = flower.sources?.findIndex((source) => source.url === url) ?? -1;
        const source = flower.sources?.[index];
        if (!source) return null;
        return <a key={url} href={`#avots-${index + 1}`} aria-label={`Avots ${index + 1}: ${source.label}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-primary underline underline-offset-2">[{index + 1}]</a>;
      })}
    </p>
  );
}

export function generateStaticParams() {
  return flowerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFlower(slug);
  if (!f) return {};
  const title = f.seoTitle ?? `${f.name} — kad stādīt, kā kopt un Mēness laiks Latvijā`;
  const description =
    f.seoDescription ??
    `${f.tagline} Stādīšana, kopšana, ziedēšana (${f.bloom}), pārziemošana un tradīcijas Mēness dienas Latvijas dārzā.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/pukes/${f.slug}`) },
    openGraph: og({ path: `/pukes/${f.slug}`, title, description, ...(f.image ? { image: contentImage(f.image.id).src } : {}) }),
  };
}

export default async function FlowerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = getFlower(slug);
  if (!f) notFound();

  const tm = FLOWER_TYPE_META[f.type];
  const nameAcc = f.nameAcc ?? f.name.toLowerCase();
  const all = getAllFlowers();
  const related = (f.related ?? [])
    .map((s) => all.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 4);
  const siblings = related.length
    ? related
    : all.filter((x) => x.type === f.type && x.slug !== f.slug).slice(0, 4);

  const facts: { label: string; value: string; href?: string }[] = [
    { label: "Ziedēšana", value: f.bloom },
    { label: "Augstums", value: f.height },
    { label: "Gaisma", value: f.sun },
    { label: "Stādīšana", value: f.plantWhen },
    { label: "Grūtība", value: f.difficulty },
    { label: "Pārziemošana", value: "Skatīt šī auga nosacījumus →", href: "#parziemosana" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${f.name} — kad stādīt un kā kopt Latvijā`,
    about: f.name,
    inLanguage: "lv",
    dateModified: f.updatedAt && f.updatedAt > SEASONAL_LINKS_UPDATED_AT ? f.updatedAt : SEASONAL_LINKS_UPDATED_AT,
    mainEntityOfPage: canonical(`/pukes/${f.slug}`),
    ...(f.sources?.length ? { citation: f.sources.map((source) => source.url) } : {}),
    ...(f.image ? { image: canonical(contentImage(f.image.id).src) } : {}),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
    author: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
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

      <nav aria-label="Atrašanās vieta" className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/pukes" className="hover:text-primary">Puķes</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{f.name}</span>
      </nav>

      <header className="mb-md flex items-center gap-md sm:mb-lg">
        <span aria-hidden="true" className="hidden shrink-0 text-6xl leading-none sm:block">{f.emoji}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-label-sm uppercase tracking-[0.2em] text-tertiary">
            <Icon name={tm.icon} size="16px" /> {tm.label}
          </p>
          <h1 className="break-words text-headline-lg-mobile text-primary md:text-display-lg">{f.name}</h1>
          {f.latin && <p className="text-body-md italic text-on-surface-variant">{f.latin}</p>}
          <p className="mt-1 text-body-lg text-on-surface-variant">{f.tagline}</p>
          {f.updatedAt && <p className="mt-2 text-label-sm text-on-surface-variant">Atjaunots <time dateTime={f.updatedAt}>{new Intl.DateTimeFormat("lv-LV", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${f.updatedAt}T00:00:00Z`))}</time></p>}
        </div>
      </header>

      {f.shortAnswer && <Card tone="container" accent="primary" className="mb-md p-md sm:mb-lg"><p className="text-body-md leading-relaxed text-on-surface sm:text-body-lg">{f.shortAnswer}</p></Card>}

      <nav aria-label="Ceļveža sadaļas" className="mb-md flex flex-wrap gap-2 sm:mb-lg">
        {[
          ...(f.comparison ? [{ href: "#augu-atskiribas", label: "Augu atšķirības" }] : []),
          { href: "#stadisana", label: "Stādīšana" },
          { href: "#kopsana", label: "Kopšana" },
          ...(f.winter?.trim() ? [{ href: "#parziemosana", label: "Pārziemošana" }] : []),
          ...(f.problems?.length ? [{ href: "#problemas", label: "Problēmas" }] : []),
          ...(f.faq?.length ? [{ href: "#jautajumi", label: "Jautājumi" }] : []),
          ...(f.sources?.length ? [{ href: "#avoti", label: "Avoti" }] : []),
        ].map((link) => <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-full bg-surface-container px-4 py-2 text-label-md text-primary hover:underline">{link.label}</a>)}
      </nav>

      {f.image && <ContentFigure image={f.image} priority />}

      {/* Conversion into the app — only for flowers tracked in the crop data */}
      {CROPS.some((c) => c.id === f.slug) && (
        <Link
          href={`/?pievienot=${f.slug}`}
          className="mb-lg flex items-center gap-2 rounded-xl bg-primary px-md py-sm font-bold text-on-primary shadow-md shadow-primary/20 transition-all hover:brightness-110"
        >
          <Icon name="add" size="20px" />
          Pievienot {nameAcc} savā dārzā
          <Icon name="arrow_forward" size="18px" className="ml-auto" />
        </Link>
      )}

      <div className="mb-lg space-y-sm">
        {f.intro.map((p, i) => (
          <p key={i} className="text-body-lg leading-relaxed text-on-surface-variant">{p}</p>
        ))}
        <SectionSources flower={f} section="intro" />
      </div>

      {/* Facts */}
      <h2 className="mb-sm text-headline-md text-on-surface">Galvenais īsumā</h2>
      <div className="mb-lg grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facts.map((x) => (
          <Card key={x.label} tone="container" className="p-sm">
            <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{x.label}</p>
            {x.href ? <a href={x.href} className="inline-flex min-h-11 items-center text-body-md text-primary underline underline-offset-2">{x.value}</a> : <p className="text-body-md text-on-surface">{x.value}</p>}
          </Card>
        ))}
        {f.lifeCycle && <Card tone="container" className="col-span-2 p-sm sm:col-span-3"><p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Dzīves cikls un audzēšana</p><p className="text-body-md text-on-surface">{f.lifeCycle}</p></Card>}
      </div>

      {f.comparison && (
        <section className="mb-lg" aria-labelledby="augu-atskiribas">
          <h2 id="augu-atskiribas" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">{f.comparison.heading}</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {f.comparison.items.map((item) => (
              <div key={item.name} className="rounded-xl border border-outline-variant/20 bg-surface-container p-md">
                <dt className="mb-2 font-semibold text-on-surface">{item.name}</dt>
                <dd className="text-body-md leading-relaxed text-on-surface-variant">{item.description}</dd>
              </div>
            ))}
          </dl>
          <SectionSources flower={f} section="comparison" />
        </section>
      )}

      {/* Planting */}
      <h2 id="stadisana" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Kā stādīt</h2>
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
        <SectionSources flower={f} section="planting" />
      </Card>

      {/* Care */}
      <h2 id="kopsana" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Kā kopt {nameAcc}</h2>
      <Card tone="high" className="mb-lg p-md">
        <ul className="space-y-1.5">
          {f.care.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
              <Icon name="check" size="16px" className="mt-1 shrink-0 text-primary" /> {s}
            </li>
          ))}
        </ul>
        <SectionSources flower={f} section="care" />
      </Card>

      {f.winter?.trim() && (
        <section className="mb-lg">
          <h2 id="parziemosana" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Kā pārziemot {nameAcc}</h2>
          <Card tone="container" accent="secondary" className="flex items-start gap-sm p-md">
            <Icon name="ac_unit" className="shrink-0 text-secondary" size="20px" />
            <div className="space-y-sm">{f.winter.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="text-body-md leading-relaxed text-on-surface-variant">{paragraph}</p>)}</div>
          </Card>
          <SectionSources flower={f} section="winter" />
          {f.winterImage && <ContentFigure image={f.winterImage} />}
        </section>
      )}

      {f.problems?.length ? (
        <>
          <h2 id="problemas" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Biežākās problēmas</h2>
          <Card tone="high" className="mb-lg p-md">
            <ul className="space-y-1.5">
              {f.problems.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <Icon name="bug_report" size="16px" className="mt-1 shrink-0 text-tertiary" /> {s}
                </li>
              ))}
            </ul>
            <SectionSources flower={f} section="problems" />
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
          <h2 id="jautajumi" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Biežākie jautājumi</h2>
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

      {f.sources?.length ? <section className="mb-lg rounded-xl border border-outline-variant/20 p-md" aria-labelledby="avoti">
        <h2 id="avoti" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Avoti un audzēšanas apstākļi</h2>
        <p className="mb-sm text-body-md leading-relaxed text-on-surface-variant">Šie avoti pamato augu īpašības un kopšanas paņēmienus. Ārvalstu kalendāros minētie mēneši un ziemcietības vērtējumi nav garantija Latvijas dārzam: darbu laiku pielāgo vietējām salnām, augsnei un konkrētajai šķirnei.</p>
        <ol className="space-y-1">{f.sources.map((source, index) => <li key={source.url} id={`avots-${index + 1}`} className="flex scroll-mt-24 items-baseline gap-2 text-body-md"><span className="shrink-0 text-on-surface-variant">[{index + 1}]</span><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center break-words py-2 text-primary underline underline-offset-2">{source.label}</a></li>)}</ol>
      </section> : null}

      <Card tone="highest" accent="primary" className="mb-lg p-md">
        <div className="mb-sm flex items-center gap-2">
          <Icon name="brightness_3" className="shrink-0 text-primary" />
          <h2 className="text-headline-md text-on-surface">Mēness tradīcijas orientieris</h2>
        </div>
        <p className="text-body-md leading-relaxed text-on-surface">{f.moonText}</p>
      </Card>
      <DataNote variant="moon" className="mb-lg" />

      {f.links?.length ? (
        <div className="mb-lg border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Lasi vairāk par {nameAcc}</h2>
          <ul className="space-y-2">
            {f.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="16px" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {f.slug !== "balkona-pukes" && (
        <section className="mb-lg">
          <h2 className="mb-sm text-headline-md text-on-surface">Puķes ar līdzīgu ziedēšanas laiku</h2>
          <div className="flex flex-wrap gap-2">
            {BLOOM_PERIODS.filter((p) => p.months.some((m) => f.bloomMonths.includes(m))).map((p) => (
              <Link key={p.slug} href={`/pukes/kas-zied/${p.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-surface-container px-4 py-2 text-label-md text-primary hover:underline">{p.h1}</Link>
            ))}
          </div>
        </section>
      )}

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

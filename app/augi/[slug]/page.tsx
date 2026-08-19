import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { flowerSlugs, cropHref } from "@/lib/flowers";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ActivityBar } from "@/components/activity-bar";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import {
  CROPS,
  CATEGORIES,
  ACTIVITY_KEYS,
  ACTIVITY_META,
  DIFFICULTY_LABEL,
  MONTHS_LV_FULL,
} from "@/lib/planting-crops";
import { cropEmoji } from "@/lib/crop-visual";
import { cropPart, PART_ELEMENT } from "@/lib/crop-part";
import { ELEMENT_META, PART_GENITIVE } from "@/lib/biodynamic";
import { SOIL_TEMP_MIN } from "@/lib/sowing-thresholds";
import { goodCompanions, badCompanions } from "@/lib/companions";
import { pestsForCrop } from "@/lib/crop-pests";
import { canonical, SITE_NAME, MONTH_SLUGS, MONTHS_LV_LOCATIVE, og } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";
import { getCropContent } from "@/lib/crop-content";
import { getAllArticles } from "@/lib/articles";
import { TrackedLink } from "@/components/tracked-link";

const CAL_YEAR = 2026;

export const dynamicParams = false;

export function generateStaticParams() {
  return CROPS.map((c) => ({ slug: c.id }));
}

function rangeText(r?: [number, number]): string | null {
  if (!r) return null;
  return r[0] === r[1] ? MONTHS_LV_FULL[r[0] - 1] : `${MONTHS_LV_FULL[r[0] - 1]}–${MONTHS_LV_FULL[r[1] - 1]}`;
}

function TextParagraphs({ text }: { text: string }) {
  return text
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const crop = CROPS.find((c) => c.id === slug);
  if (!crop) return {};
  const sow = rangeText(crop.sowOutdoors ?? crop.sowIndoors);
  const title = crop.id === "rediisi"
    ? "Kad sēt redīsus un kā tos audzēt Latvijā"
    : `${crop.name} — kad sēt, stādīt un novākt Latvijā`;
  const description = crop.id === "rediisi"
    ? "Kad sēt redīsus pavasarī un vasaras otrajā pusē, cik dziļi sēt, kā laistīt un ko darīt, ja neveidojas sakne. Praktiski padomi Latvijai."
    : (`${crop.name}: kad sēt${sow ? ` (${sow})` : ""}, stādīt un novākt Latvijas klimatam, ` +
      `labākās Mēness dienas un kaimiņaugi. ${crop.note ?? ""}`).trim();
  return {
    title,
    description,
    alternates: { canonical: canonical(`/augi/${crop.id}`) },
    openGraph: og({ path: `/augi/${crop.id}`, title, description }),
  };
}

export default async function CropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Ornamental flowers have a much richer page under /pukes — one canonical
  // home per plant, no thin duplicate competing in search.
  // 308, not 307: a permanent redirect lets Google fold the old URL's ranking
  // signals into /pukes/* instead of keeping /augi/* indexed alongside it.
  if (flowerSlugs().includes(slug)) permanentRedirect(`/pukes/${slug}`);
  const crop = CROPS.find((c) => c.id === slug);
  if (!crop) notFound();

  const category = CATEGORIES.find((c) => c.id === crop.category);
  const elem = ELEMENT_META[PART_ELEMENT[cropPart(crop.id)]];
  const soil = SOIL_TEMP_MIN[crop.id];
  const good = goodCompanions(crop.id);
  const bad = badCompanions(crop.id);
  const pests = pestsForCrop(crop);

  const content = getCropContent(crop.id);
  const relatedArticles = getAllArticles()
    .filter((article) => article.entities?.crops?.includes(crop.id))
    .sort((a, b) => Number(b.intent === "problem") - Number(a.intent === "problem") || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  const activities = ACTIVITY_KEYS.filter((k) => crop[k]).map((k) => ({
    label: ACTIVITY_META[k].label,
    when: rangeText(crop[k]),
  }));

  // Months in the crop's primary sow window → link to that month's moon calendar
  const sowRange = crop.sowOutdoors ?? crop.sowIndoors;
  const sowMonths = sowRange
    ? Array.from({ length: sowRange[1] - sowRange[0] + 1 }, (_, i) => sowRange[0] + i)
    : [];

  const facts: { label: string; value: string }[] = [
    ...(crop.daysToHarvest ? [{ label: "Līdz ražai", value: crop.daysToHarvest }] : []),
    ...(crop.sun ? [{ label: "Gaisma", value: crop.sun }] : []),
    ...(soil ? [{ label: "Augsne sējai", value: `≥ ${soil}°C` }] : []),
    { label: "Grūtība", value: DIFFICULTY_LABEL[crop.difficulty] },
    { label: "Labākā Mēness diena", value: `${elem.partLabel} (${elem.label})` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${crop.name} — kad sēt un stādīt Latvijā`,
    about: crop.name,
    inLanguage: "lv",
    dateModified: content?.updatedAt ?? `${DATA_REVIEWED}-01`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
    author: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  // Data-driven FAQ (real answers from the crop data)
  const sowWhen = rangeText(crop.sowOutdoors ?? crop.sowIndoors);
  const harvestLoc = crop.harvest
    ? crop.harvest[0] === crop.harvest[1]
      ? MONTHS_LV_LOCATIVE[crop.harvest[0] - 1]
      : `${MONTHS_LV_LOCATIVE[crop.harvest[0] - 1]}–${MONTHS_LV_LOCATIVE[crop.harvest[1] - 1]}`
    : null;
  const currentMonth = new Date().getMonth() + 1;
  const isSowingNow = Boolean(sowRange && currentMonth >= sowRange[0] && currentMonth <= sowRange[1]);
  const isHarvestingNow = Boolean(crop.harvest && currentMonth >= crop.harvest[0] && currentMonth <= crop.harvest[1]);
  const currentMonthName = MONTHS_LV_LOCATIVE[currentMonth - 1];
  const capitalizedMonth = `${currentMonthName[0].toUpperCase()}${currentMonthName.slice(1)}`;
  const seasonMessage = isSowingNow && isHarvestingNow
    ? `${capitalizedMonth} vari gan sēt nākamo porciju, gan novākt gatavos augus.`
    : isSowingNow
      ? `${capitalizedMonth} šis augs ir sējams.`
      : isHarvestingNow
        ? `${capitalizedMonth} ir šī auga ražas laiks.`
        : null;
  const daysClause = crop.daysToHarvest && /\d/.test(crop.daysToHarvest)
    ? ` No sējas līdz ražai aptuveni ${crop.daysToHarvest.toLowerCase()}.`
    : "";
  const faq: { q: string; a: string }[] = [
    sowWhen ? { q: `${crop.name} — kad sēt Latvijā?`, a: `Parasti sēj ${sowWhen}. Precīzs laiks atkarīgs no laikapstākļiem un tava reģiona — siltummīļus laukā tikai pēc pēdējās salnas.` } : null,
    harvestLoc ? { q: `${crop.name} — kad novākt?`, a: `Parasti novāc ${harvestLoc}.${daysClause}` } : null,
    soil ? { q: `${crop.name} — cik siltai jābūt augsnei?`, a: `Sējai augsnei vajadzētu būt vismaz ${soil}°C. Vēsākā augsnē sēklas dīgst lēni vai sapūst.` } : null,
    good.length ? { q: `Ar ko ${crop.name.toLowerCase()} sader dārzā?`, a: `Labi kaimiņi: ${good.map((id) => CROPS.find((c) => c.id === id)?.name).filter(Boolean).join(", ")}.` } : null,
  ].filter((x): x is { q: string; a: string } => x !== null).concat(content?.faq ?? []);

  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Augi", item: canonical("/augi") },
      { "@type": "ListItem", position: 2, name: crop.name, item: canonical(`/augi/${crop.id}`) },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Breadcrumb */}
      <nav className="mb-sm flex items-center gap-1 text-label-sm text-on-surface-variant" aria-label="Atpakaļceļš">
        <Link href="/augi" className="inline-flex min-h-11 items-center hover:text-primary">Augi</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{crop.name}</span>
      </nav>

      <Card tone="highest" elevated linen className="crop-hero mb-md p-md sm:p-lg">
        <header className="flex items-start gap-md">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-container/25 text-5xl leading-none sm:h-20 sm:w-20 sm:text-6xl"
            aria-hidden="true"
          >
            {cropEmoji(crop.id)}
          </span>
          <div className="min-w-0">
            <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">{category?.label}</p>
            <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">{crop.name}</h1>
            <p className="mt-1 max-w-[36rem] text-body-lg text-on-surface-variant">
              Praktiska audzēšanas rokasgrāmata Latvijas apstākļiem
            </p>
          </div>
        </header>

        <div className="mt-md flex flex-wrap gap-2 text-label-sm text-on-surface-variant">
          {sowWhen && (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-surface-container px-3">
              <Icon name="psychiatry" size="16px" className="text-primary" /> Sēj: {sowWhen}
            </span>
          )}
          {harvestLoc && (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-surface-container px-3">
              <Icon name="nutrition" size="16px" className="text-tertiary" /> Novāc: {harvestLoc}
            </span>
          )}
        </div>

        <TrackedLink
          href={`/?pievienot=${crop.id}`}
          source={`augs:${crop.id}`}
          placement="hero"
          className="mt-md flex min-h-12 items-center gap-2 rounded-xl bg-primary px-md py-sm font-bold text-on-primary shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Icon name="add" size="20px" />
          Pievienot {crop.name} savā dārzā
          <Icon name="arrow_forward" size="18px" className="ml-auto" />
        </TrackedLink>
        <p className="mt-2 text-label-sm text-on-surface-variant">
          Bez reģistrācijas — saņemsi šim augam atbilstošos darbus.
        </p>
      </Card>

      {seasonMessage && (
        <div className="mb-md flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-container/15 px-md py-sm text-body-md text-on-surface">
          <Icon name="today" size="20px" className="mt-0.5 shrink-0 text-primary" />
          <p><strong>Šobrīd aktuāli:</strong> {seasonMessage}</p>
        </div>
      )}

      {crop.note && (
        <Card tone="container" className="mb-md flex items-start gap-sm p-md">
          <Icon name="tips_and_updates" className="text-primary" />
          <p className="text-body-lg text-on-surface-variant">{crop.note}</p>
        </Card>
      )}

      {/* Timeline */}
      <h2 className="mb-sm text-headline-md text-on-surface">Sējas un ražas laiki</h2>
      <Card tone="high" elevated className="mb-md p-md">
        <ActivityBar crop={crop} currentMonth={0} />
        <ul className="mt-md space-y-2">
          {activities.map((a) => (
            <li key={a.label} className="flex items-center gap-2 text-body-md text-on-surface">
              <Icon name="event" size="18px" className="text-primary" />
              <span className="font-semibold">{a.label}:</span> {a.when}
            </li>
          ))}
        </ul>
        {sowMonths.length > 0 && (
          <p className="mt-md flex flex-wrap items-center gap-x-2 gap-y-1 text-label-md">
            <span className="text-on-surface-variant">Mēness kalendārs:</span>
            {sowMonths.map((m) => (
              <Link key={m} href={`/kalendars/${CAL_YEAR}/${MONTH_SLUGS[m - 1]}`} className="inline-flex min-h-11 items-center capitalize text-primary hover:underline">
                {MONTHS_LV_FULL[m - 1]}
              </Link>
            ))}
          </p>
        )}
        <DataNote variant="planting" withSources className="mt-md" />
      </Card>

      {/* Facts */}
      <h2 className="mb-sm text-headline-md text-on-surface">Galvenais īsumā</h2>
      <div className="mb-md grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facts.map((f) => (
          <Card key={f.label} tone="container" className="p-sm">
            <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{f.label}</p>
            <p className="text-body-md text-on-surface">{f.value}</p>
          </Card>
        ))}
      </div>

      {/* Companions */}
      {(good.length > 0 || bad.length > 0) && (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Kaimiņaugi</h2>
          <Card tone="high" className="mb-md flex flex-col gap-sm p-md sm:flex-row">
            <div className="flex-1">
              <p className="mb-1 flex items-center gap-1.5 text-label-md text-primary">
                <Icon name="thumb_up" size="16px" /> Labi kaimiņi
              </p>
              <div className="flex flex-wrap gap-2">
                {good.length ? good.map((id) => (
                  <Link key={id} href={cropHref(id)} className="inline-flex min-h-11 items-center rounded-full bg-primary-container/30 px-3 py-1 text-label-sm text-on-primary-container hover:brightness-110">
                    {cropEmoji(id)} {CROPS.find((c) => c.id === id)?.name}
                  </Link>
                )) : <span className="text-label-sm text-on-surface-variant">—</span>}
              </div>
            </div>
            <div className="flex-1">
              <p className="mb-1 flex items-center gap-1.5 text-label-md text-error">
                <Icon name="thumb_down" size="16px" /> Izvairies no
              </p>
              <div className="flex flex-wrap gap-2">
                {bad.length ? bad.map((id) => (
                  <Link key={id} href={cropHref(id)} className="inline-flex min-h-11 items-center rounded-full bg-error-container/25 px-3 py-1 text-label-sm text-error hover:brightness-110">
                    {cropEmoji(id)} {CROPS.find((c) => c.id === id)?.name}
                  </Link>
                )) : <span className="text-label-sm text-on-surface-variant">—</span>}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Pests & diseases that affect this crop (cross-links the kaitēkļi cluster) */}
      {pests.length > 0 && (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Kaitēkļi un slimības, kas skar {crop.name.toLowerCase()}</h2>
          <Card tone="high" className="mb-md p-md">
            <div className="flex flex-wrap gap-2">
              {pests.map((p) => (
                <Link
                  key={p.slug}
                  href={`/kaitekli/${p.slug}`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary"
                >
                  <span className="text-base leading-none">{p.emoji}</span> {p.name}
                </Link>
              ))}
            </div>
            <Link href="/kaitekli" className="mt-sm inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
              Dabīgā apkarošana visiem kaitēkļiem <Icon name="arrow_forward" size="16px" />
            </Link>
          </Card>
        </>
      )}

      {content && (
        <section className="article-reading-surface -mx-2 mb-lg p-4 sm:mx-0 sm:p-lg" aria-labelledby="growing-guide-heading">
          <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">No sējas līdz ražai</p>
          <h2 id="growing-guide-heading" className="mb-md text-headline-lg-mobile text-on-surface">{crop.name} audzēšana</h2>
          {content.intro && (
            <div className="mb-lg space-y-3 text-body-lg leading-relaxed text-on-surface-variant">
              <TextParagraphs text={content.intro} />
            </div>
          )}
          {content.sections.map((s) => (
            <div key={s.heading} className="border-t border-outline-variant/15 py-md first:border-t-0 first:pt-0">
              <h2 className="mb-sm text-headline-md text-on-surface">{s.heading}</h2>
              <div className="space-y-3 text-body-lg leading-relaxed text-on-surface-variant">
                <TextParagraphs text={s.body} />
              </div>
            </div>
          ))}
          {content.folklore && (
            <Card tone="container" className="flex items-start gap-sm p-md">
              <Icon name="auto_stories" className="text-tertiary" />
              <p className="text-body-md italic text-on-surface-variant">{content.folklore}</p>
            </Card>
          )}
          {content.relatedLinks && content.relatedLinks.length > 0 && (
            <div className="mt-md border-t border-outline-variant/15 pt-md">
              <p className="mb-2 text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">Turpini ar saistītu padomu</p>
              <div className="flex flex-wrap gap-2">
                {content.relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-container px-3 text-label-md text-primary hover:underline">
                    {link.label} <Icon name="arrow_forward" size="16px" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="mb-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Padomi un problēmu risinājumi</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {relatedArticles.map((article) => (
              <Link key={article.slug} href={`/raksti/${article.slug}`} className="flex min-h-20 flex-col justify-center rounded-xl border border-outline-variant/10 bg-surface-container p-sm transition-colors hover:bg-surface-container-high">
                <span className="text-label-sm text-tertiary">{article.intent === "problem" ? "Problēma" : "Pamācība"}</span>
                <span className="mt-1 block text-body-md font-semibold text-on-surface">{article.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Moon day explainer + CTA */}
      <Card tone="highest" elevated accent="primary" className="mb-md p-md">
        <h2 className="mb-1 flex items-center gap-2 text-headline-md text-on-surface">
          <Icon name={elem.icon} className={elem.color} /> Labākās Mēness dienas
        </h2>
        <p className="text-body-md text-on-surface-variant">
          {crop.name} ir {PART_GENITIVE[elem.part].toLowerCase()} kultūra — sēj un kop to{" "}
          <strong className="text-on-surface">{PART_GENITIVE[elem.part].toLowerCase()} dienās</strong> ({elem.label} elements),
          kad Mēness atrodas atbilstošajā zvaigznājā.
        </p>
        <Link href="/kalendars" className="mt-sm inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
          Skatīt interaktīvo Mēness kalendāru <Icon name="arrow_forward" size="16px" />
        </Link>
        <DataNote variant="moon" className="mt-sm" />
      </Card>

      {faq.length > 0 && (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
          <div className="mb-md divide-y divide-outline-variant/15 overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container">
            {faq.map((f) => (
              <details key={f.q} className="group px-md open:bg-surface-container-high">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-2 py-sm font-semibold text-on-surface marker:content-none">
                  <span className="flex-1">{f.q}</span>
                  <Icon name="expand_more" size="20px" className="shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-md text-body-md leading-relaxed text-on-surface-variant">{f.a}</p>
              </details>
            ))}
          </div>
        </>
      )}

      {content?.sources && content.sources.length > 0 && (
        <section className="mb-md border-t border-outline-variant/10 pt-md" aria-labelledby="crop-sources-heading">
          <h2 id="crop-sources-heading" className="text-headline-md text-on-surface">Avoti un pārbaude</h2>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Saturs pārbaudīts {content.updatedAt ? new Intl.DateTimeFormat("lv-LV").format(new Date(`${content.updatedAt}T12:00:00Z`)) : "redakcijas pārbaudē"}.
          </p>
          <ul className="mt-2 space-y-1">
            {content.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
                  {source.label} <Icon name="open_in_new" size="15px" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(() => {
        const siblings = CROPS.filter((c) => c.category === crop.category && c.id !== crop.id).slice(0, 8);
        return siblings.length ? (
          <div className="mb-md border-t border-outline-variant/10 pt-md">
            <h2 className="mb-sm text-headline-md text-on-surface">Citi — {category?.label.toLowerCase()}</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((c) => (
                <Link key={c.id} href={cropHref(c.id)} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                  {cropEmoji(c.id)} {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-outline-variant/10 pt-md">
        <Link href="/augi" className="inline-flex min-h-11 items-center text-label-md text-on-surface-variant hover:text-primary">← Visi augi</Link>
        <Link href="/raksti" className="inline-flex min-h-11 items-center text-label-md text-on-surface-variant hover:text-primary">Raksti</Link>
        <Link href="/par" className="inline-flex min-h-11 items-center text-label-md text-on-surface-variant hover:text-primary">Par datiem</Link>
        <Link href="/macies" className="inline-flex min-h-11 items-center text-label-md text-on-surface-variant hover:text-primary">Kas ir Mēness sēja?</Link>
      </div>
    </article>
  );
}

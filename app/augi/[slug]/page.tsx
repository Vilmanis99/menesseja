import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { flowerSlugs } from "@/lib/flowers";
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
import { canonical, SITE_NAME, MONTH_SLUGS } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";
import { getCropContent } from "@/lib/crop-content";

const CAL_YEAR = 2026;

export const dynamicParams = false;

export function generateStaticParams() {
  return CROPS.map((c) => ({ slug: c.id }));
}

function rangeText(r?: [number, number]): string | null {
  if (!r) return null;
  return r[0] === r[1] ? MONTHS_LV_FULL[r[0] - 1] : `${MONTHS_LV_FULL[r[0] - 1]}–${MONTHS_LV_FULL[r[1] - 1]}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const crop = CROPS.find((c) => c.id === slug);
  if (!crop) return {};
  const sow = rangeText(crop.sowOutdoors ?? crop.sowIndoors);
  const title = `${crop.name} — kad sēt, stādīt un novākt Latvijā`;
  const description =
    `${crop.name}: kad sēt${sow ? ` (${sow})` : ""}, stādīt un novākt Latvijas klimatam, ` +
    `labākās Mēness dienas un kaimiņaugi. ${crop.note ?? ""}`.trim();
  return {
    title,
    description,
    alternates: { canonical: canonical(`/augi/${crop.id}`) },
    openGraph: { title, description, type: "article" },
  };
}

export default async function CropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Ornamental flowers have a much richer page under /pukes — one canonical
  // home per plant, no thin duplicate competing in search.
  if (flowerSlugs().includes(slug)) redirect(`/pukes/${slug}`);
  const crop = CROPS.find((c) => c.id === slug);
  if (!crop) notFound();

  const category = CATEGORIES.find((c) => c.id === crop.category);
  const elem = ELEMENT_META[PART_ELEMENT[cropPart(crop.id)]];
  const soil = SOIL_TEMP_MIN[crop.id];
  const good = goodCompanions(crop.id);
  const bad = badCompanions(crop.id);

  const content = getCropContent(crop.id);

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
    dateModified: `${DATA_REVIEWED}-01`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  // Data-driven FAQ (real answers from the crop data)
  const sowWhen = rangeText(crop.sowOutdoors ?? crop.sowIndoors);
  const faq: { q: string; a: string }[] = [
    sowWhen ? { q: `Kad sēt ${crop.name.toLowerCase()} Latvijā?`, a: `${crop.name} parasti sēj ${sowWhen}. Precīzs laiks atkarīgs no laikapstākļiem un tava reģiona — siltummīļus laukā tikai pēc pēdējās salnas.` } : null,
    soil ? { q: `Cik silta augsne vajadzīga ${crop.name.toLowerCase()}?`, a: `Sējai augsnei vajadzētu būt vismaz ${soil}°C. Vēsākā augsnē sēklas dīgst lēni vai sapūst.` } : null,
    good.length ? { q: `Ar ko ${crop.name.toLowerCase()} sader dārzā?`, a: `Labi kaimiņi: ${good.map((id) => CROPS.find((c) => c.id === id)?.name).filter(Boolean).join(", ")}.` } : null,
  ].filter((x): x is { q: string; a: string } => x !== null);

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
      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/augi" className="hover:text-primary">Augi</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{crop.name}</span>
      </nav>

      <header className="mb-lg flex items-center gap-md">
        <span className="text-6xl leading-none">{cropEmoji(crop.id)}</span>
        <div>
          <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">{category?.label}</p>
          <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">{crop.name}</h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            Kad sēt, stādīt un novākt Latvijā · Mēness sējas kalendārs
          </p>
        </div>
      </header>

      {/* Conversion CTA into the app */}
      <Link
        href={`/?pievienot=${crop.id}`}
        className="mb-md flex items-center gap-2 rounded-xl bg-primary px-md py-sm font-bold text-on-primary shadow-md shadow-primary/20 transition-all hover:brightness-110"
      >
        <Icon name="add" size="20px" />
        Pievienot {crop.name} savā dārzā
        <Icon name="arrow_forward" size="18px" className="ml-auto" />
      </Link>

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
              <Link key={m} href={`/kalendars/${CAL_YEAR}/${MONTH_SLUGS[m - 1]}`} className="capitalize text-primary hover:underline">
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
                  <Link key={id} href={`/augi/${id}`} className="rounded-full bg-primary-container/30 px-2.5 py-1 text-label-sm text-on-primary-container hover:brightness-110">
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
                  <Link key={id} href={`/augi/${id}`} className="rounded-full bg-error-container/25 px-2.5 py-1 text-label-sm text-error hover:brightness-110">
                    {cropEmoji(id)} {CROPS.find((c) => c.id === id)?.name}
                  </Link>
                )) : <span className="text-label-sm text-on-surface-variant">—</span>}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Full growing guide (generated prose) */}
      {content && (
        <section className="mb-md">
          {content.intro && (
            <p className="mb-md text-body-lg leading-relaxed text-on-surface-variant">{content.intro}</p>
          )}
          {content.sections.map((s) => (
            <div key={s.heading} className="mb-md">
              <h2 className="mb-sm text-headline-md text-on-surface">{s.heading}</h2>
              <p className="text-body-lg leading-relaxed text-on-surface-variant">{s.body}</p>
            </div>
          ))}
          {content.folklore && (
            <Card tone="container" className="flex items-start gap-sm p-md">
              <Icon name="auto_stories" className="text-tertiary" />
              <p className="text-body-md italic text-on-surface-variant">{content.folklore}</p>
            </Card>
          )}
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
        <Link href="/kalendars" className="mt-sm inline-flex items-center gap-1 text-label-md text-primary hover:underline">
          Skatīt interaktīvo Mēness kalendāru <Icon name="arrow_forward" size="16px" />
        </Link>
        <DataNote variant="moon" className="mt-sm" />
      </Card>

      {faq.length > 0 && (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
          <div className="mb-md space-y-2">
            {faq.map((f) => (
              <Card key={f.q} tone="container" className="p-md">
                <p className="mb-1 font-semibold text-on-surface">{f.q}</p>
                <p className="text-body-md text-on-surface-variant">{f.a}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {(() => {
        const siblings = CROPS.filter((c) => c.category === crop.category && c.id !== crop.id).slice(0, 8);
        return siblings.length ? (
          <div className="mb-md border-t border-outline-variant/10 pt-md">
            <h2 className="mb-sm text-headline-md text-on-surface">Citi — {category?.label.toLowerCase()}</h2>
            <div className="flex flex-wrap gap-2">
              {siblings.map((c) => (
                <Link key={c.id} href={`/augi/${c.id}`} className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                  {cropEmoji(c.id)} {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      <div className="flex flex-wrap gap-3">
        <Link href="/augi" className="text-label-md text-on-surface-variant hover:text-primary">← Visi augi</Link>
        <Link href="/raksti" className="text-label-md text-on-surface-variant hover:text-primary">Raksti</Link>
        <Link href="/par" className="text-label-md text-on-surface-variant hover:text-primary">Par datiem</Link>
        <Link href="/macies" className="text-label-md text-on-surface-variant hover:text-primary">Kas ir Mēness sēja?</Link>
      </div>
    </article>
  );
}

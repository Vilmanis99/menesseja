import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getAllFlowers, FLOWER_TYPE_META, FLOWER_TYPE_ORDER } from "@/lib/flowers";
import { BLOOM_PERIODS, ALL_SUMMER_ARTICLE, flowersForPeriod } from "@/lib/bloom-periods";
import { EXTRA_FLOWER_NAMES, FOLK_NAMES } from "@/lib/flower-names";
import { canonical, SITE_NAME, og } from "@/lib/seo";

// One merged name list: 31 full guides (linked) + name-only entries. The real
// total drives the title/H1 — "puķu nosaukumi" searchers want a BIG list.
const TOTAL_NAMES = getAllFlowers().length + EXTRA_FLOWER_NAMES.length;

// NB: the root layout template appends "· Mēness Sēja" — don't repeat it here.
const TITLE = `Puķu nosaukumi no A līdz Z — ${TOTAL_NAMES} Latvijas dārza puķes`;
const DESCRIPTION = `Pilns puķu nosaukumu saraksts alfabēta secībā: ${TOTAL_NAMES} Latvijas dārza puķes no A līdz Z ar latīniskajiem nosaukumiem — asteres, dālijas, īrisi, peonijas, tulpes un citas. Arī tautas nosaukumi: pujenes, jurģīnes, kreimenes, mārtiņrozes.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/pukes") },
  openGraph: og({ path: "/pukes", title: TITLE, description: DESCRIPTION, type: "website" }),
};

const FAQ = [
  {
    q: "Kas ir pujenes?",
    a: "Pujenes ir peoniju tautas nosaukums — tā šīs kuplās maija–jūnija puķes sauc daudzās Latvijas sētās. Botāniski tā ir Paeonia. Mūsu peoniju ceļvedī atradīsi, kad tās stādīt, pārstādīt un kāpēc tās dažkārt nezied.",
  },
  {
    q: "Kas ir jurģīnes?",
    a: "Jurģīnes ir dāliju tautas nosaukums (no vecā vārda Georgina). Tās ir vasaras otrās puses gumu puķes, kas zied no jūlija līdz salnām; gumus rudenī izrok un uzglabā vēsumā.",
  },
  {
    q: "Kuras puķes zied visu vasaru?",
    a: "Visilgāk zied viengadīgās — samtenes, petūnijas, kliņģerītes, kosmejas, lobēlijas un begonijas zied no jūnija līdz pat salnām, ja regulāri noņem noziedējušos ziedus. No ziemcietēm ilgi zied rudbekijas un dienziedes.",
  },
  {
    q: "Kuras puķes ir visvieglāk izaudzēt iesācējam?",
    a: "Samtenes, kliņģerītes, saulespuķes, kosmejas un rudzupuķes — tās visas sēj tieši dobē maijā, tās ātri dīgst un piedod kļūdas. No sīpolpuķēm visvieglākās ir narcises un krokusi: iestādi rudenī, un tie zied gadiem.",
  },
  {
    q: "Kad stādīt puķes pēc Mēness kalendāra?",
    a: "Tradīcijā ziedu augus sēj un stāda ziedu dienās — kad Mēness iet caur Dvīņu, Svaru vai Ūdensvīra zvaigznāju. Tā ir senču tradīcija, ne garantija: vispirms izšķir augsne, siltums un mitrums, un tikai tad kalendārs.",
  },
];

export default function PukesPage() {
  const flowers = getAllFlowers();

  // Merge full guides + name-only entries into one Latvian-alphabetical list.
  const allNames = [
    ...flowers.map((f) => ({ name: f.name, latin: f.latin, note: undefined as string | undefined, slug: f.slug })),
    ...EXTRA_FLOWER_NAMES.map((e) => ({ name: e.name, latin: e.latin, note: e.note, slug: undefined as string | undefined })),
  ].sort((x, y) => x.name.localeCompare(y.name, "lv"));

  // Group by first letter (Latvian letters — Č, Ī, Ķ… stay distinct).
  const letterGroups: { letter: string; items: typeof allNames }[] = [];
  for (const item of allNames) {
    const letter = item.name.charAt(0).toUpperCase();
    const group = letterGroups.find((g) => g.letter === letter);
    if (group) group.items.push(item);
    else letterGroups.push({ letter, items: [item] });
  }

  const byType = FLOWER_TYPE_ORDER.map((t) => ({
    type: t,
    meta: FLOWER_TYPE_META[t],
    items: flowers.filter((f) => f.type === t),
  })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Puķu nosaukumi no A līdz Z",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    mainEntity: {
      "@type": "ItemList",
      name: "Puķu nosaukumi alfabēta secībā (A–Z)",
      numberOfItems: allNames.length,
      itemListElement: allNames.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.name,
        ...(f.slug ? { url: canonical(`/pukes/${f.slug}`) } : {}),
      })),
    },
    hasPart: flowers.map((f) => ({ "@type": "Article", name: f.name, url: canonical(`/pukes/${f.slug}`) })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />
      <PageHeader
        eyebrow="Puķu ceļvedis"
        title={`Puķu nosaukumi: ${TOTAL_NAMES} Latvijas dārza puķes no A līdz Z`}
        subtitle="Pilns saraksts alfabēta secībā ar latīniskajiem nosaukumiem — un tautas nosaukumi, ko citur neatradīsi: pujenes, jurģīnes, kreimenes, mārtiņrozes."
      />

      <p className="mb-lg max-w-3xl text-body-md text-on-surface-variant">
        Šeit ir mūsu puķu nosaukumu saraksts alfabēta secībā — {TOTAL_NAMES} Latvijas dārzos audzētas
        puķes no A līdz Z ar latīnisko nosaukumu un īsu raksturojumu. Puķēm ar zaļo saiti esam uzrakstījuši
        pilnu ceļvedi: kad stādīt, kā kopt un kura ir labākā Mēness diena. Sarakstu papildinām, tāpēc
        pievieno lapu grāmatzīmēm.
      </p>

      {/* Letter jump bar */}
      <nav aria-label="Alfabēts" className="mb-lg flex flex-wrap gap-1.5">
        {letterGroups.map((g) => (
          <a
            key={g.letter}
            href={`#burts-${g.letter.toLowerCase()}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-label-md font-semibold text-on-surface transition-colors hover:bg-primary hover:text-on-primary active:scale-[0.97]"
          >
            {g.letter}
          </a>
        ))}
      </nav>

      {/* Bloom-period cuts. The A–Z index alone was absorbing every list-intent
          query and converting almost none of them; these give each cut a page. */}
      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Puķes pēc ziedēšanas laika</h2>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          {BLOOM_PERIODS.map((period) => (
            <Link key={period.slug} href={`/pukes/kas-zied/${period.slug}`}>
              <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
                <Icon name="filter_vintage" className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-title-md text-on-surface">{period.h1}</h3>
                  <p className="mt-0.5 text-body-md text-on-surface-variant">
                    {flowersForPeriod(period).length} puķes sarakstā
                  </p>
                </div>
              </Card>
            </Link>
          ))}
          <Link href={ALL_SUMMER_ARTICLE}>
            <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
              <Icon name="filter_vintage" className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <h3 className="text-title-md text-on-surface">Puķes, kas zied visu vasaru</h3>
                <p className="mt-0.5 text-body-md text-on-surface-variant">15 izvēles un kā tās apvienot</p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Visi puķu nosaukumi alfabēta secībā (A–Z)</h2>
        <div className="space-y-md">
          {letterGroups.map((g) => (
            <div key={g.letter}>
              <h3
                id={`burts-${g.letter.toLowerCase()}`}
                className="mb-1 scroll-mt-24 border-b border-outline-variant/10 pb-1 text-headline-md text-tertiary"
              >
                {g.letter}
              </h3>
              <ul className="grid grid-cols-1 gap-x-md gap-y-1 sm:grid-cols-2">
                {g.items.map((f) => (
                  <li key={f.name} className="text-body-md">
                    {f.slug ? (
                      <Link
                        href={`/pukes/${f.slug}`}
                        className="inline-flex flex-wrap items-baseline gap-x-1.5 font-semibold text-primary transition-colors hover:underline"
                      >
                        <span>{f.name}</span>
                        {f.latin && <span className="text-body-sm font-normal italic text-on-surface-variant">({f.latin})</span>}
                      </Link>
                    ) : (
                      <span className="inline-flex flex-wrap items-baseline gap-x-1.5 text-on-surface">
                        <span>{f.name}</span>
                        {f.latin && <span className="text-body-sm italic text-on-surface-variant">({f.latin})</span>}
                        {f.note && <span className="text-body-sm text-on-surface-variant">— {f.note}</span>}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Folk names — unique Latvian content no competitor has gathered */}
      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Puķu tautas nosaukumi: kā puķes sauc sētās</h2>
        <p className="mb-sm max-w-3xl text-body-md text-on-surface-variant">
          Daudzām puķēm Latvijā ir divi vārdi — grāmatas nosaukums un tas, ko lieto vecmāmiņa. Ja meklē
          puķi pēc tautas nosaukuma, šī tabula palīdzēs to atpazīt.
        </p>
        <Card tone="high" elevated className="overflow-x-auto p-md">
          <table className="w-full text-left text-body-md">
            <thead>
              <tr className="border-b border-outline-variant/20 text-label-md uppercase tracking-wide text-on-surface-variant">
                <th className="py-2 pr-md font-semibold">Tautas nosaukums</th>
                <th className="py-2 font-semibold">Izplatītākais nosaukums</th>
              </tr>
            </thead>
            <tbody>
              {FOLK_NAMES.map((f) => (
                <tr key={f.folk} className="border-b border-outline-variant/10 last:border-0">
                  <td className="py-2 pr-md text-on-surface">{f.folk}</td>
                  <td className="py-2">
                    {f.slug ? (
                      <Link href={`/pukes/${f.slug}`} className="text-primary hover:underline">
                        {f.standard}
                      </Link>
                    ) : (
                      <span className="text-on-surface-variant">{f.standard}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="local_florist" className="text-tertiary" />
        <div>
          <p className="text-body-md text-on-surface-variant">
            Biodinamikā ziedu augus sēj un kopj <span className="text-on-surface">ziedu dienās</span> (gaisa elements),
            kad Mēness iet caur Dvīņu, Svaru vai Ūdensvīra zvaigznāju. Katrai puķei esam pievienojuši šo
            tradicionālo laiku — kā gadsimtiem darīja senči, kad sēja, lai zied, nevis lai aug lapas.
          </p>
        </div>
      </Card>

      <h2 className="mb-md text-headline-md text-on-surface">Puķes pēc veida</h2>

      {byType.length === 0 ? (
        <Card tone="container" className="p-lg text-center text-on-surface-variant">
          Puķu lapas drīz būs šeit.
        </Card>
      ) : (
        <div className="space-y-lg">
          {byType.map((g) => (
            <section key={g.type}>
              <div className="mb-1 flex items-center gap-2">
                <Icon name={g.meta.icon} className="text-primary" />
                <h3 className="text-headline-md text-on-surface">{g.meta.label}</h3>
              </div>
              <p className="mb-sm text-body-md text-on-surface-variant">{g.meta.blurb}</p>
              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                {g.items.map((f) => (
                  <Link key={f.slug} href={`/pukes/${f.slug}`}>
                    <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
                      <span className="text-4xl leading-none">{f.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-headline-md text-on-surface">{f.name}</h4>
                        <p className="mt-0.5 text-body-md text-on-surface-variant">{f.tagline}</p>
                        <div className="mt-sm flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                            <Icon name="filter_vintage" size="14px" /> {f.bloom}
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
      )}

      {/* FAQ — visible text matches the FAQPage JSON-LD above */}
      <section className="mt-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi par puķu nosaukumiem</h2>
        <div className="space-y-2">
          {FAQ.map((q) => (
            <Card key={q.q} tone="container" className="p-md">
              <p className="mb-1 font-semibold text-on-surface">{q.q}</p>
              <p className="text-body-md text-on-surface-variant">{q.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <DataNote variant="moon" className="mt-lg" />
    </>
  );
}

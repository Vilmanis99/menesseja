import type { Metadata } from "next";
import Link from "next/link";
import { FlowerDirectory } from "@/components/flower-directory";
import { FlowerPhotoCard } from "@/components/flower-gallery";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getAllFlowers } from "@/lib/flowers";
import { BLOOM_PERIODS, ALL_SUMMER_ARTICLE } from "@/lib/bloom-periods";
import { FOLK_NAMES, FLOWER_NAME_SOURCES } from "@/lib/flower-names";
import { flowerDirectoryEntries } from "@/lib/flower-directory";
import { canonical, SITE_NAME, og } from "@/lib/seo";

const TOTAL_NAMES = flowerDirectoryEntries(getAllFlowers()).length;
const TITLE = `Puķu nosaukumi no A līdz Z — ${TOTAL_NAMES} Latvijas dārza puķes`;
const DESCRIPTION = `Puķu nosaukumi alfabēta secībā: ${TOTAL_NAMES} nosaukumu ieraksti ar latīniskajiem un tautas nosaukumiem. Meklē puķi, salīdzini īstas fotogrāfijas un atver audzēšanas ceļvedi.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/pukes") },
  openGraph: og({ path: "/pukes", title: TITLE, description: DESCRIPTION, type: "website" }),
};

const FAQ = [
  { q: "Kā atrast puķi, ja zinu tikai tautas nosaukumu?", a: "Ieraksti to meklētājā, piemēram, pujenes, jurģīnes vai kreimenes. Saraksts parādīs saistīto nosaukumu un pieejamo attēlu. Tautas nosaukumi mēdz būt divdomīgi, tāpēc salīdzini arī latīnisko nosaukumu un nosaukumu skaidrojumu." },
  { q: "Kas ir pujenes un jurģīnes?", a: "Pujenes ir peoniju, bet jurģīnes — dāliju tautas nosaukums. Sarakstā meklē Peonijas (Paeonia) un Dālijas (Dahlia); pie šiem nosaukumiem ir saites uz audzēšanas ceļvežiem." },
  { q: "Vai ģerānijas un pelargonijas ir viens un tas pats?", a: "Sarunvalodā par ģerānijām bieži sauc pelargonijas (Pelargonium), taču botāniskais nosaukums Geranium apzīmē citu ģinti — gandrenes. Pērkot vai meklējot kopšanas padomus, pārbaudi latīnisko nosaukumu uz etiķetes." },
  { q: "Vai pēc viena zieda foto var noteikt šķirni?", a: "Bieži nevar. Līdzīgi ziedi var būt dažādām sugām un šķirnēm, bet vienas šķirnes izskatu ietekmē augšanas apstākļi. Salīdzini ziedu, lapas, stublāju un visu augu; šķirnes nosaukumu visdrošāk saglabāt no uzticamas stāda vai sēklu etiķetes." },
  { q: "Vai saraksta skaits nozīmē tikpat daudz puķu sugu?", a: "Nē. Šis ir nosaukumu saraksts: tajā ir gan ģintis, piemēram, neļķes (Dianthus), gan konkrētāki augi, piemēram, turku neļķes (Dianthus barbatus). Tematiskie ceļveži, piemēram, balkona puķes, nav ieskaitīti kā atsevišķs auga nosaukums." },
  { q: "Kā izvēlēties puķes, lai dobē ilgāk būtu ziedi?", a: "Apvieno augus ar atšķirīgiem ziedēšanas laikiem un izvēlies tos atbilstoši gaismai, augsnei un kopšanas iespējām. Vienas ģints nosaukums nenozīmē, ka visas tās sugas vai šķirnes zied vienā laikā. Apskati pavasara, vasaras un rudens atlases un pēc tam konkrētā auga ceļvedi." },
];

export default function PukesPage() {
  const flowers = getAllFlowers();
  const allNames = flowerDirectoryEntries(flowers);
  const items = allNames.map((item) => {
    const flower = flowers.find((f) => item.href === `/pukes/${f.slug}`);
    // A species-specific entry gets its own photo, never a generic genus photo.
    const image = flower?.image ?? (item.name === "Turku neļķes" ? { id: "turku-nelkes", caption: "Turku neļķu (Dianthus barbatus) ziedkopas. Citu neļķu sugu izskats un audzēšana var atšķirties." } : undefined);
    const photo = image && item.href && (flower?.name === item.name || item.name === "Turku neļķes")
      ? <FlowerPhotoCard name={item.name} latin={item.latin} href={item.href} imageId={image.id} caption={image.caption} /> : undefined;
    return { ...item, photo };
  });
  const jsonLd = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Puķu nosaukumi no A līdz Z", inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    mainEntity: { "@type": "ItemList", name: "Puķu nosaukumi alfabēta secībā (A–Z)", numberOfItems: allNames.length,
      itemListElement: allNames.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.name, ...(f.href ? { url: canonical(f.href) } : {}) })),
    },
    hasPart: flowers.map((f) => ({ "@type": "Article", name: f.name, url: canonical(`/pukes/${f.slug}`) })),
  };

  return <>
    <JsonLd data={jsonLd} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })) }} />
    <PageHeader eyebrow="Puķu ceļvedis" title="Puķu nosaukumi no A līdz Z" subtitle={`${TOTAL_NAMES} nosaukumi: atrodi puķi, salīdzini īstas fotogrāfijas un izvēlies, ko audzēt savā dārzā.`} />
    <p className="mb-md max-w-3xl text-body-md text-on-surface-variant">Apkopoti dārzos audzētu puķu nosaukumi — ģintis, sugas un audzēšanas grupas. Saite “Ceļvedis” atver stādīšanas un kopšanas aprakstu; pārējiem nosaukumiem šeit ir īsa uzziņa.</p>

    <FlowerDirectory items={items} />

    <section id="tautas-nosaukumi" className="mb-lg scroll-mt-24" aria-labelledby="folk-names-title">
      <h2 id="folk-names-title" className="text-headline-md text-on-surface">Puķu tautas un sarunvalodas nosaukumi</h2>
      <p className="mt-2 mb-md max-w-3xl text-body-md text-on-surface-variant">Vienam augam var būt vairāki vārdi, bet vienu sadzīves nosaukumu mēdz lietot atšķirīgiem augiem. Precizējums palīdz nesajaukt to kopšanu.</p>
      <dl className="grid gap-sm sm:grid-cols-2">
        {FOLK_NAMES.map((entry) => <div key={entry.folk} className="rounded-xl border border-outline-variant/20 bg-surface-container p-sm">
          <dt className="text-title-md text-on-surface">{entry.folk}</dt>
          <dd className="mt-1 text-body-md text-on-surface-variant">
            {entry.slug ? <Link href={`/pukes/${entry.slug}`} className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">{entry.standard} →</Link> : <a href={`/pukes?q=${encodeURIComponent(entry.standard.split("(")[0].trim())}#puku-nosaukumi`} className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">{entry.standard} →</a>}
            {entry.note && <p className="mt-1 text-body-sm">{entry.note}</p>}
            {entry.sourceUrl && <a href={entry.sourceUrl} className="mt-1 inline-flex min-h-11 items-center text-body-sm text-primary underline underline-offset-2">Nosaukuma avots</a>}
          </dd>
        </div>)}
      </dl>
    </section>

    <section id="puku-izvele" className="mb-lg scroll-mt-24" aria-labelledby="flower-choice-title">
      <h2 id="flower-choice-title" className="mb-sm text-headline-md text-on-surface">No nosaukuma līdz piemērotai puķei dārzā</h2>
      <div className="grid gap-md lg:grid-cols-3">
        <Card tone="container" className="p-md">
          <h3 className="text-title-md text-on-surface">Ziedēšanas laiks</h3>
          <p className="mt-2 text-body-md text-on-surface-variant">Kombinē dažādus ziedēšanas posmus. Laiks atšķiras pēc sugas, šķirnes un sezonas apstākļiem.</p>
          <ul className="mt-2">{BLOOM_PERIODS.map((period) => <li key={period.slug}><Link href={`/pukes/kas-zied/${period.slug}`} className="inline-flex min-h-11 items-center text-primary hover:underline">{period.h1} →</Link></li>)}<li><Link href={ALL_SUMMER_ARTICLE} className="inline-flex min-h-11 items-center text-primary hover:underline">Kā plānot ziedus visai vasarai →</Link></li></ul>
        </Card>
        <Card tone="container" className="p-md">
          <h3 className="text-title-md text-on-surface">Vieta un kopšana</h3>
          <p className="mt-2 text-body-md text-on-surface-variant">Pirms pirkuma salīdzini auga gaismas prasības, pieauguša auga izmēru, vietas mitrumu un laistīšanas iespējas.</p>
          <Link href="/pukes/balkona-pukes" className="mt-2 inline-flex min-h-11 items-center text-primary hover:underline">Puķu izvēle balkonam →</Link>
          <Link href="/raksti/kapu-pukes" className="inline-flex min-h-11 items-center text-primary hover:underline">Puķes kapu apstādījumiem →</Link>
        </Card>
        <Card tone="container" className="p-md">
          <h3 className="text-title-md text-on-surface">Pārziemošana</h3>
          <p className="mt-2 text-body-md text-on-surface-variant">“Daudzgadīgs” vēl nenozīmē, ka augs pārziemos tavā dobē. Pārbaudi konkrēto sugu, šķirni un audzēšanu podā vai zemē.</p>
          <Link href="/raksti/ka-glabat-dalijas-ziema" className="mt-2 inline-flex min-h-11 items-center text-primary hover:underline">Dāliju bumbuļu glabāšana →</Link>
          <Link href="/pukes/pelargonijas" className="inline-flex min-h-11 items-center text-primary hover:underline">Pelargoniju kopšana un ziema →</Link>
        </Card>
      </div>
    </section>

    <section className="mb-lg" aria-labelledby="flower-faq-title">
      <h2 id="flower-faq-title" className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi par puķu nosaukumiem</h2>
      <div className="space-y-sm">{FAQ.map((q) => <Card key={q.q} tone="container" className="p-md"><h3 className="mb-2 text-title-md text-on-surface">{q.q}</h3><p className="text-body-md text-on-surface-variant">{q.a}</p></Card>)}</div>
    </section>

    <section aria-labelledby="flower-sources-title" className="rounded-xl border border-outline-variant/20 p-md">
      <h2 id="flower-sources-title" className="text-title-md text-on-surface">Nosaukumu un atpazīšanas avoti</h2>
      <p className="mt-2 text-body-sm text-on-surface-variant">Nosaukumu precizējumi pārskatīti 2026. gada 27. oktobrī. Avoti palīdz izprast konkrētu nosaukumu vai atpazīšanas principu; tie nav visu saistīto kopšanas ceļvežu ekspertīze. Katras fotogrāfijas avots un licence norādīti pie attēla.</p>
      <ul className="mt-sm space-y-2 text-body-md">
        {FLOWER_NAME_SOURCES.map((source) => <li key={source.url}><a href={source.url} className="text-primary underline underline-offset-2">{source.label}</a></li>)}
        <li><a href="https://botsoc.scot/learn/" className="text-primary underline underline-offset-2">Botanical Society of Scotland: augu nosaukumi un pazīmes atpazīšanai</a></li>
        <li><a href="https://www.rhs.org.uk/plants/roses/choosing-the-best" className="text-primary underline underline-offset-2">RHS: sugu, šķirņu un tirdzniecības nosaukumu atšķirības</a></li>
      </ul>
    </section>
    <DataNote variant="moon" className="mt-lg" />
  </>;
}

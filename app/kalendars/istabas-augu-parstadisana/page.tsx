import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { ContentFigure } from "@/components/content-figure";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { newsletterConfigured } from "@/lib/brevo";
import { repottingDays, dayRanges, repottingPlanYear, REPOT_SEASON_NOTE, type RepotDay } from "@/lib/repotting";
import { seasonForMonth } from "@/lib/seasonal";
import { PART_GENITIVE } from "@/lib/biodynamic";
import { latviaDateParts, latviaNoon } from "@/lib/day-anchor";
import { contentImage } from "@/lib/content-images";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";
import { MONTH_SLUGS, CALENDAR_YEARS, canonical, SITE_NAME, og } from "@/lib/seo";

// "Tuvākās dienas" is dated; refresh hourly like the other calendar hubs.
export const revalidate = 3600;

const PATH = "/kalendars/istabas-augu-parstadisana";
const DAY_FMT = new Intl.DateTimeFormat("lv-LV", { weekday: "short", day: "numeric", month: "long", timeZone: "Europe/Riga" });
const dayLabel = (date: Date) => { const s = DAY_FMT.format(date); return s.charAt(0).toUpperCase() + s.slice(1); };

const SOURCES = [
  { label: "RHS: How to repot a plant", url: "https://www.rhs.org.uk/container-gardening/how-to-repot-a-plant" },
  { label: "University of Illinois Extension: Tips for repotting houseplants", url: "https://extension.illinois.edu/blogs/good-growing/2018-03-19-tips-repotting-houseplants" },
  { label: "RHS: Hippeastrum growing guide", url: "https://www.rhs.org.uk/plants/hippeastrum/growing-guide" },
];

const FAQ = [
  {
    q: "Vai istabas augus drīkst pārstādīt ziemā?",
    a: "Ja nav steidzama iemesla, labāk nogaidi līdz pavasarim. Ziemā augs aug lēni, un lielā podā svaiga zeme ilgi paliek mitra. Uzreiz pārstādi tikai tad, ja pods ir saplīsis vai saknes pūst.",
  },
  {
    q: "Cik lielu podu izvēlēties?",
    a: "Podam līdz 25 cm diametrā pietiek ar 2,5–5 cm lielāku diametru un dziļumu. Pārāk liels pods ilgi saglabā mitrumu ap saknēm, un tās var sākt pūt.",
  },
  {
    q: "Vai poda apakšā jāber keramzīts vai grants?",
    a: "Nē. Grants kārta apakšā drenāžu neuzlabo; ūdens labāk notek, ja podam ir caurumi un visā podā ir vienāds substrāts.",
  },
  {
    q: "Kurā Mēness fāzē pārstādīt istabas augus?",
    a: "Marijas Tūnas biodinamiskajā kalendārā svarīga nav fāze, bet krītošā Mēness periods, kad Mēness ceļš pie debesīm katru dienu ir zemāk. Tas ir tradīcijas ieteikums, ne garantija: auga stāvoklis, gaisma un pareizs pods ietekmē rezultātu vairāk.",
  },
];

function monthRows(year: number) {
  return MONTH_SLUGS.map((slug, i) => {
    const days = repottingDays(year, i + 1);
    const pick = (part: RepotDay["part"]) => dayRanges(days.filter((d) => d.part === part).map((d) => d.day)) || "—";
    return { month: i + 1, slug, name: MONTHS_LV_FULL[i], all: dayRanges(days.map((d) => d.day)), lapas: pick("lapas"), ziedi: pick("ziedi") };
  });
}

function upcoming(from: Date, count: number): RepotDay[] {
  const { year, month, day } = latviaDateParts(from);
  const out: RepotDay[] = [];
  for (let offset = 0; offset < 3 && out.length < count; offset++) {
    const m = ((month - 1 + offset) % 12) + 1;
    const y = year + Math.floor((month - 1 + offset) / 12);
    for (const d of repottingDays(y, m)) {
      if (latviaNoon(y, m, d.day) >= latviaNoon(year, month, day)) out.push(d);
    }
  }
  return out.slice(0, count);
}

export function generateMetadata(): Metadata {
  const { year, month } = latviaDateParts();
  const plan = repottingPlanYear(year, month);
  const title = `Istabas augu pārstādīšanas kalendārs ${plan} — labākās dienas pēc Mēness`;
  const description = `Istabas augu pārstādīšanas dienas ${plan}. gadam pēc Mēness kalendāra un praktiski padomi: kad augam vajag lielāku podu, kā pārstādīt un kad to nedarīt.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(PATH) },
    openGraph: og({ path: PATH, title, description, image: contentImage("hlorofits-saknu-kamols").src }),
  };
}

export default function RepottingCalendarPage() {
  const now = new Date();
  const { year, month } = latviaDateParts(now);
  const planYear = repottingPlanYear(year, month);
  const next = upcoming(now, 8);
  const rest = planYear > year ? monthRows(year).filter((r) => r.month >= month) : [];
  const plan = monthRows(planYear);
  const calendarYear = CALENDAR_YEARS.includes(planYear) ? planYear : null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Istabas augu pārstādīšanas kalendārs ${planYear}`,
    inLanguage: "lv",
    image: canonical(contentImage("hlorofits-saknu-kamols").src),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  const monthName = (r: ReturnType<typeof monthRows>[number], y: number) =>
    CALENDAR_YEARS.includes(y) ? <Link href={`/kalendars/${y}/${r.slug}`} className="text-primary hover:underline">{r.name}</Link> : r.name;
  const table = (rows: ReturnType<typeof monthRows>, y: number) => (
    <>
    <div className="space-y-2 sm:hidden">
      {rows.map((r) => (
        <dl key={`${y}-${r.slug}-card`} className="rounded-xl border border-outline-variant/20 bg-surface-container p-sm">
          <dt className="text-title-md font-semibold capitalize">{monthName(r, y)}</dt>
          <dd className="mt-1 text-body-md text-on-surface">{r.all || "—"}</dd>
          <dd className="mt-1 text-label-md text-on-surface-variant">Lapu augiem: {r.lapas} · Ziedošiem: {r.ziedi}</dd>
        </dl>
      ))}
    </div>
    <div className="hidden overflow-x-auto rounded-xl border border-outline-variant/20 sm:block">
      <table className="w-full border-collapse text-left text-body-md">
        <thead className="bg-surface-container-high">
          <tr>
            <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Mēnesis</th>
            <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Visas piemērotās dienas</th>
            <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Lapu augiem</th>
            <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Ziedošiem augiem</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${y}-${r.slug}`} className="border-t border-outline-variant/10 align-top">
              <th scope="row" className="px-sm py-2 font-semibold capitalize text-on-surface">{monthName(r, y)}</th>
              <td className="px-sm py-2 text-on-surface-variant">{r.all || "—"}</td>
              <td className="px-sm py-2 text-on-surface-variant">{r.lapas}</td>
              <td className="px-sm py-2 text-on-surface-variant">{r.ziedi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/kalendars" className="hover:text-primary">Kalendārs</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">Istabas augu pārstādīšana</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Istabas augi · Mēness kalendārs</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Istabas augu pārstādīšanas kalendārs {planYear}</h1>
      </header>

      <aside className="mb-lg rounded-xl border border-primary/30 border-l-4 bg-primary-container/20 p-md">
        <p className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-primary"><Icon name="lightbulb" size="18px" /> Īsā atbilde</p>
        <p className="mt-1 text-body-lg leading-relaxed text-on-surface">
          Istabas augus vislabāk pārstādīt pavasarī, kad dienas kļūst garākas un augs sāk augt — parasti martā un aprīlī.
          Mēness tradīcijā pārstādīšanai izvēlas krītošā Mēness dienas; tās redzi tabulā. Ziemā pārstādi tikai tad, ja pods ir
          saplīsis vai saknes pūst.
        </p>
      </aside>

      <section className="mb-lg" aria-labelledby="tuvakas-dienas">
        <h2 id="tuvakas-dienas" className="mb-xs scroll-mt-24 text-headline-md text-on-surface">Tuvākās pārstādīšanas dienas</h2>
        <p className="mb-sm text-body-md text-on-surface-variant">{REPOT_SEASON_NOTE[seasonForMonth(month)]}</p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {next.map((d) => (
            <li key={d.date.toISOString()} className="flex items-center justify-between gap-2 rounded-xl border border-outline-variant/20 bg-surface-container px-md py-2">
              <span className="text-body-md text-on-surface">{dayLabel(d.date)}</span>
              <span className="text-label-md text-on-surface-variant">{PART_GENITIVE[d.part]} diena</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-label-sm text-on-surface-variant">Lapu dienas tradicionāli izvēlas zaļlapu augiem (monsterai, fikusam, hlorofitam), ziedu dienas — ziedošiem augiem.</p>
      </section>

      {rest.length > 0 && (
        <section className="mb-lg" aria-labelledby="sogad">
          <h2 id="sogad" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Vēl {year}. gadā</h2>
          {table(rest, year)}
        </section>
      )}

      <section className="mb-lg" aria-labelledby="gada-tabula">
        <h2 id="gada-tabula" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Pārstādīšanas dienas {planYear}. gadā</h2>
        {table(plan, planYear)}
        <p className="mt-2 text-label-sm text-on-surface-variant">
          Dienas aprēķinātas pēc Latvijas laika: krītošā Mēness dienas bez Mēness mezglu atpūtas dienām.
          {calendarYear && <> <Link href={`/kalendars/${calendarYear}`} className="text-primary hover:underline">Mēness kalendārs {calendarYear} →</Link></>}
        </p>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Kā saprast, ka augam vajag lielāku podu</h2>
        <ul className="space-y-2 text-body-lg leading-relaxed text-on-surface-variant">
          {[
            "Saknes izaug cauri poda drenāžas caurumiem vai parādās virs zemes.",
            "Izņemot augu no poda, redzi biezu sakņu kamolu, kas riņķo gar poda malām, un tajā ir maz zemes.",
            "Pēc laistīšanas zeme izžūst daudz ātrāk nekā agrāk.",
            "Podam nav drenāžas caurumu — tad pārstādi arī tad, ja saknes vēl ir maz.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2"><Icon name="check_circle" size="18px" className="mt-1 shrink-0 text-primary" /><span>{t}</span></li>
          ))}
        </ul>
        <ContentFigure image={{ id: "hlorofits-saknu-kamols", caption: "Hlorofita sakņu kamols, kas aizpildījis visu podu. Šādas saknes pirms stādīšanas jaunajā podā uzmanīgi atbrīvo." }} />
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Kā pārstādīt istabas augu</h2>
        <ol className="list-decimal space-y-2 pl-6 text-body-lg leading-relaxed text-on-surface-variant">
          <li>Apmēram stundu pirms pārstādīšanas augu aplej — mitrs kamols vieglāk iznāk no poda.</li>
          <li>Izvēlies podu ar drenāžas caurumiem, 2,5–5 cm platāku un dziļāku par veco. Apakšā grants vai keramzīta kārtu neber.</li>
          <li>Lielākajai daļai istabas augu izmanto vieglu istabas augu substrātu, nevis smagu dārza zemi.</li>
          <li>Izņem augu un uzmanīgi atbrīvo saknes, kas riņķo gar kamola malām.</li>
          <li>Iestādi tādā pašā dziļumā kā iepriekš un atstāj apmēram 2,5 cm brīvas vietas līdz poda malai laistīšanai.</li>
          <li>Aplej, līdz ūdens iztek pa caurumiem. Pēc 20 minūtēm izlej apakštasītē palikušo ūdeni.</li>
        </ol>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Kad pārstādīšanu labāk atlikt</h2>
        <div className="space-y-sm text-body-lg leading-relaxed text-on-surface-variant">
          <p>Rudenī un ziemā augi aug lēni, un svaigs substrāts lielākā podā ilgi paliek slapjš. Ja saknes ir veselas, pagaidi līdz pavasarim.</p>
          <p>Ziedošu augu pārstādīšanu parasti atliek līdz brīdim pēc ziedēšanas. Piemēram, amarilli pārstāda reizi divos vai trijos gados pēc ziedēšanas; starplaikā pietiek nomainīt augšējos 2,5–5 cm substrāta.</p>
          <p>Ja augu nevēlies pārcelt lielākā podā, to var atstāt vecajā: izņem, apgriez daļu ārējo sakņu un papildini ar svaigu substrātu.</p>
        </div>
        <ContentFigure image={{ id: "orhideja-palodze", caption: "Ziedoša orhideja uz palodzes. Ja augs zied un saknes ir veselas, pārstādīšanu atliec līdz ziedēšanas beigām." }} />
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Ziemas istabas augi</h2>
        <div className="flex flex-col gap-2">
          {[
            { href: "/raksti/ziemassvetku-zvaigzne-puansetija", label: "Ziemassvētku zvaigzne: kā kopt, lai nenomet lapas" },
            { href: "/raksti/amarillis-pec-ziedesanas", label: "Amarillis: kā kopt pēc ziedēšanas" },
            { href: "/raksti/hiacintes-podina-un-glaze", label: "Hiacintes podiņā un glāzē" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center gap-1 text-body-md text-primary hover:underline"><Icon name="arrow_forward" size="16px" /> {l.label}</Link>
          ))}
        </div>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
        <div className="space-y-sm">
          {FAQ.map((f) => (
            <Card key={f.q} tone="container" className="p-md">
              <h3 className="text-title-md text-on-surface">{f.q}</h3>
              <p className="mt-1 text-body-md leading-relaxed text-on-surface-variant">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <DataNote variant="moon" className="mb-lg" />

      {newsletterConfigured() && <NewsletterSignup source="kalendars:istabas-augi" />}

      <section className="mt-lg border-t border-outline-variant/10 pt-md">
        <h2 className="mb-sm text-headline-md text-on-surface">Avoti</h2>
        <ul className="space-y-1 text-body-sm text-on-surface-variant">
          {SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{s.label}</a></li>)}
        </ul>
      </section>
    </article>
  );
}

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { TrackedLink } from "@/components/tracked-link";
import { MONTH_PLANS } from "@/lib/month-plan";
import { MONTH_SLUGS } from "@/lib/seo";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";
import { SupplyChecklist } from "@/components/supply-checklist";

const PATHS = [
  { title: "Plāno pirmo dārzu", text: "Vieta, dobes un audzējamais apjoms.", icon: "grid_on", href: "/raksti/pirmais-darzs-no-nulles" },
  { title: "Izvēlies augus", text: "Augu prasības, sēja un kopšana.", icon: "eco", href: "/augi" },
  { title: "Iepazīsti puķes", text: "Nosaukumi, ziedēšana un audzēšana.", icon: "local_florist", href: "/pukes" },
  { title: "Atrodi problēmas cēloni", text: "Pazīmes, iespējamie cēloņi un rīcība.", icon: "pest_control", href: "#augu-problemas" },
];
const PROBLEMS = [
  { label: "Lapas kļūst dzeltenas", href: "/raksti/kapec-lapas-dzelte" },
  { label: "Sēklas nedīgst", href: "/raksti/kapec-seklas-nedigst" },
  { label: "Dēsti izstīdz", href: "/raksti/desti-izstidz" },
  { label: "Hortenzijas nezied", href: "/raksti/kapec-hortenzijas-nezied" },
  { label: "Tomāti zied, bet augļu nav", href: "/raksti/kapec-tomati-zied-bet-neveidojas-augli" },
  { label: "Gurķu lapām ir balts aplikums", href: "/raksti/kapec-gurkiem-balts-aplikums-uz-lapam" },
];
const SPRING = [
  { title: "1. Izvēlies vietu un apjomu", text: "Sāc ar gaismu, ūdens pieejamību un laiku, ko vari veltīt dārzam.", links: [{ label: "Dārza plānošana", href: "/raksti/darza-planosana-iesacejam" }, { label: "Cik liela pirmā dobe", href: "/raksti/cik-liela-pirma-dobe" }, { label: "Augu maiņa", href: "/raksti/augu-maina-darza" }] },
  { title: "2. Pārbaudi sēklas un piederumus", text: "Izvēlies šķirnes pēc audzēšanas vietas un pārbaudi esošos krājumus.", links: [{ label: "Sēklu izvēle", href: "/raksti/ka-izveleties-seklas-darzam" }, { label: "Dīgtspējas pārbaude", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju" }, { label: "Piederumu saraksts", href: "#pirkumu-saraksts" }] },
  { title: "3. Ieplāno sēju un izstādīšanu", text: "Rēķini atpakaļ no plānotās izstādīšanas. Ņem vērā gaismu, augsni un salnas.", links: [{ label: "Kad sēt dēstus", href: "/raksti/kad-set-destus-rekini-atpakal" }, { label: "Dēsti uz palodzes", href: "/raksti/destu-audzesana-uz-palodzes" }, { label: "Siltumnīcas sagatavošana", href: "/raksti/siltumnicas-sagatavosana-sezonai" }] },
];

export function KnowledgeHub({ currentMonth }: { currentMonth: number }) {
  return <>
    <nav className="mb-lg flex flex-wrap gap-sm" aria-label="Zināšanu krātuves sadaļas">
      {[ ["#gada-plans", "Darbi pa mēnešiem"], ["#pavasara-plans", "Plāno pavasari"], ["#pirkumu-saraksts", "Pirms pirkuma"], ["#rakstu-biblioteka", "Meklē rakstu"] ].map(([href, label]) => <TrackedLink key={href} href={href} source="knowledge-hub" placement="section-navigation" className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/30 px-4 text-body-md text-primary hover:bg-surface-container">{label}</TrackedLink>)}
    </nav>
    <div className="mb-xl grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
      {PATHS.map((item) => <TrackedLink key={item.href} href={item.href} source="knowledge-hub" placement="topic" className="rounded-xl border border-outline-variant/15 bg-surface-container p-md hover:border-primary/40">
        <Icon name={item.icon} className="text-primary" />
        <h2 className="mt-sm text-title-md text-on-surface">{item.title}</h2>
        <p className="mt-xs text-body-md text-on-surface-variant">{item.text}</p>
      </TrackedLink>)}
    </div>
    <section id="gada-plans" className="mb-xl scroll-mt-24" aria-labelledby="year-plan-title">
      <h2 id="year-plan-title" className="text-headline-lg-mobile text-on-surface">Dārza gads pa mēnešiem</h2>
      <p className="mt-sm text-body-md text-on-surface-variant">Visi mēneši ir pieejami jau tagad. Izvēlies darbu, ko dari šodien, vai sagatavojies nākamajai sezonai.</p>
      <div className="mt-md grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {MONTH_PLANS.map((plan, index) => <TrackedLink key={plan.title} href={`/ko-set/${MONTH_SLUGS[index]}`} source="knowledge-hub" placement="year-plan" className={`rounded-xl border p-md hover:border-primary/60 ${index + 1 === currentMonth ? "border-primary/50 bg-primary-container/20" : "border-outline-variant/15 bg-surface-container"}`}>
          <p className="text-label-md capitalize text-primary">{MONTHS_LV_FULL[index]}{index + 1 === currentMonth && <span className="ml-2 text-label-sm normal-case">Šomēnes</span>}</p>
          <h3 className="mt-xs text-title-md text-on-surface">{plan.title}</h3>
          <p className="mt-xs text-body-md text-on-surface-variant">{plan.action}</p>
        </TrackedLink>)}
      </div>
    </section>
    <section id="pavasara-plans" className="mb-xl scroll-mt-24" aria-labelledby="spring-plan-title">
      <h2 id="spring-plan-title" className="text-headline-lg-mobile text-on-surface">Pavasaris sākas ar plānu</h2>
      <p className="mt-sm text-body-md text-on-surface-variant">Šos soļus vari iziet jebkurā gadalaikā. Agrāka sagatavošanās nenozīmē, ka viss jāsēj agrāk.</p>
      <div className="mt-md grid gap-sm md:grid-cols-3">
        {SPRING.map((step) => <Card key={step.title} tone="container" className="p-md">
          <h3 className="text-title-md text-on-surface">{step.title}</h3>
          <p className="mt-sm text-body-md text-on-surface-variant">{step.text}</p>
          <ul className="mt-sm">{step.links.map((link) => <li key={link.href}><TrackedLink href={link.href} source="knowledge-hub" placement="spring-plan" className="inline-flex min-h-11 items-center gap-1 text-body-md text-primary hover:underline">{link.label}<Icon name="arrow_forward" size="16px" /></TrackedLink></li>)}</ul>
        </Card>)}
      </div>
    </section>
    <SupplyChecklist />
    <section id="augu-problemas" className="mb-xl scroll-mt-24" aria-labelledby="problems-title">
      <h2 id="problems-title" className="text-headline-lg-mobile text-on-surface">Kas noticis ar manu augu?</h2>
      <p className="mt-sm text-body-md text-on-surface-variant">Sāc ar redzamo pazīmi. Vienai pazīmei var būt vairāki cēloņi — pirms rīkojies, pārbaudi arī laistīšanu, gaismu un augsni.</p>
      <div className="mt-md grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((item) => <TrackedLink key={item.href} href={item.href} source="knowledge-hub" placement="problem" className="flex min-h-14 items-center justify-between gap-sm rounded-xl border border-outline-variant/15 bg-surface-container p-md text-body-md text-primary hover:border-primary/40">{item.label}<Icon name="arrow_forward" size="18px" /></TrackedLink>)}
      </div>
      <TrackedLink href="/kaitekli" source="knowledge-hub" placement="problem" className="mt-sm inline-flex min-h-11 items-center text-body-md text-primary hover:underline">Kaitēkļu un slimību ceļvedis →</TrackedLink>
    </section>
    <section className="mb-xl grid gap-md md:grid-cols-2" aria-label="Audzēšanas apstākļi">
      <Card tone="container" className="p-md">
        <h2 className="text-headline-md text-on-surface">Dārzs var sākties arī uz balkona</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">Arī dažiem podiem vajag plānu: piemērotu gaismu, vietu saknēm un iespēju regulāri laistīt.</p>
        <ul className="mt-sm">{[{ href: "/raksti/balkona-darzs-iesacejam", label: "Balkona dārzs iesācējam" }, { href: "/raksti/cik-liels-pods-darzeniem", label: "Kāda izmēra podu izvēlēties" }].map((link) => <li key={link.href}><TrackedLink href={link.href} source="knowledge-hub" placement="balcony" className="inline-flex min-h-11 items-center text-body-md text-primary hover:underline">{link.label} →</TrackedLink></li>)}</ul>
      </Card>
      <Card tone="container" className="p-md">
        <h2 className="text-headline-md text-on-surface">Pirms sēj vai stādi laukā</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">Pārbaudi vietējo nakts temperatūras prognozi, augsnes siltumu un mitrumu. Kalendāra mēnesis viens pats nenosaka drošu izstādīšanas dienu.</p>
        <ul className="mt-sm">{[{ href: "/raksti/salnas-latvija", label: "Salnas un augu aizsardzība" }, { href: "/raksti/augsnes-temperatura", label: "Augsnes temperatūra sējai" }, { href: "/raksti/ka-rudit-destus", label: "Kā rūdīt dēstus" }].map((link) => <li key={link.href}><TrackedLink href={link.href} source="knowledge-hub" placement="conditions" className="inline-flex min-h-11 items-center text-body-md text-primary hover:underline">{link.label} →</TrackedLink></li>)}</ul>
      </Card>
    </section>
  </>;
}

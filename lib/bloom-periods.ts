import { getAllFlowers, type Flower } from "@/lib/flowers";

/** Preserve each season's search intent year-round. The all-summer article
 * already covers continuous flowering, so it gets links rather than a second
 * page targeting the same question. */
export const ALL_SUMMER_ARTICLE = "/raksti/darza-pukes-kas-zied-visu-vasaru";

export interface BloomPeriod {
  slug: string;
  /** Months that qualify. `every: true` requires all of them, not just one. */
  months: number[];
  every?: boolean;
  h1: string;
  title: string;
  description: string;
  lead: string;
  /** Named-season advice: useful even when opened during another season. */
  care: string;
  updatedAt: string;
  relatedLinks: { href: string; label: string }[];
  faq: { q: string; a: string }[];
}

export const BLOOM_PERIODS: BloomPeriod[] = [
  {
    slug: "rudeni",
    updatedAt: "2026-10-06",
    months: [9, 10],
    h1: "Puķes, kas zied rudenī",
    title: "Rudens puķes — kas zied septembrī un oktobrī Latvijā",
    description:
      "Kuras dārza puķes zied septembrī un oktobrī Latvijā: asteres, krizantēmas, dālijas, rudbekijas un citas, ar ziedēšanas laiku, augstumu un kopšanu.",
    lead:
      "Rudens dārzā krāsu tur tie augi, kas iztur vēsās naktis un zied līdz pirmajām salnām. Šeit ir puķes, kas Latvijā zied septembrī un oktobrī — ar to ziedēšanas laiku, augstumu un vietu, kur tās jūtas labi.",
    care:
      "Septembrī un oktobrī vēl var stādīt daudzgadīgo puķu ceru dalījumus un sīpolpuķes nākamajam pavasarim, kamēr augsne nav sasalusi. Neizturīgo augu — dāliju un gladiolu — gumus un sīpolus izroc pēc pirmajām salnām un glabā vēsā, sausā telpā.",
    relatedLinks: [
      { href: "/raksti/ka-glabat-dalijas-ziema", label: "Kad izrakt un kā glabāt dālijas" },
      { href: "/raksti/tulpju-stadisana-rudeni", label: "Tulpju stādīšana nākamajam pavasarim" },
      { href: "/ko-set/oktobris", label: "Dārza darbi oktobrī" },
    ],
    faq: [
      {
        q: "Kuras puķes Latvijā zied visilgāk rudenī?",
        a: "Vistālāk rudenī tiek asteres, krizantēmas, rudbekijas, samtenes un dālijas — tās zied līdz pirmajām nopietnajām salnām, parasti oktobra vidum. Atraitnītes pacieš salnas un var ziedēt vēl vēlāk.",
      },
      {
        q: "Vai rudenī ziedošās puķes var stādīt rudenī?",
        a: "Daudzgadīgās var — septembris ir labs laiks ceru dalīšanai un pārstādīšanai, kamēr augsne vēl silta un augs paspēj iesakņoties. Viengadīgās, piemēram, samtenes un asteres, sēj pavasarī.",
      },
      {
        q: "Kas jādara ar dālijām un gladiolām rudenī?",
        a: "Tās Latvijā zemē nepārziemo. Pēc pirmajām salnām, kad lapas nomelnē, gumus un sīpolus izroc, nožāvē un glabā vēsā (4–8 °C), sausā, vēdināmā telpā līdz pavasarim.",
      },
    ],
  },
  {
    slug: "vasara",
    updatedAt: "2026-10-06",
    months: [6, 7, 8],
    h1: "Vasaras puķes",
    title: "Vasaras puķu nosaukumi — kas zied jūnijā, jūlijā un augustā",
    description:
      "Vasaras puķes Latvijas dārzam: kas zied jūnijā, jūlijā un augustā, ar ziedēšanas laiku, augstumu, saules prasībām un kopšanu.",
    lead:
      "Puķes, kas Latvijā zied vasarā — jūnijā, jūlijā vai augustā. Dažas tur visu sezonu, citas uzzied īsu, spilgtu vilni; sarakstā redzi katras ziedēšanas laiku.",
    care:
      "Vasaras vidū galvenais darbs ir noziedējušo ziedu noņemšana un laistīšana sausumā. Augusta beigās sāc plānot rudens stādīšanu — ceru dalīšanu un sīpolpuķes nākamajam pavasarim.",
    relatedLinks: [
      { href: ALL_SUMMER_ARTICLE, label: "Kā izvēlēties puķes, kas zied visu vasaru" },
      { href: "/raksti/ka-laistit-darzu-karstuma", label: "Laistīšana karstumā un sausumā" },
      { href: "/raksti/kapec-hortenzijas-nezied", label: "Kāpēc hortenzijas nezied" },
    ],
    faq: [
      {
        q: "Kad Latvijā sāk ziedēt vasaras puķes?",
        a: "Pirmās uzzied jūnija sākumā — peonijas, lilijas un astilbes. Jūlijā pievienojas floksi, ehinacija, hortenzijas un gladiolas, bet augustā — saulespuķes un asteres.",
      },
      {
        q: "Kuras vasaras puķes ir vieglākās iesācējam?",
        a: "Samtenes, atraitnītes, saulespuķes un rudbekijas — tās nav izvēlīgas pret augsni, iztur sausumu un ziedē droši arī bez īpašas kopšanas.",
      },
    ],
  },
  {
    slug: "pavasari",
    updatedAt: "2026-10-06",
    months: [3, 4, 5],
    h1: "Pavasara puķes",
    title: "Pavasara puķes — kas zied martā, aprīlī un maijā Latvijā",
    description:
      "Pavasara puķes Latvijā: krokusi, narcises, tulpes, hiacintes un citas, kas zied martā, aprīlī un maijā — ar stādīšanas laiku un kopšanu.",
    lead:
      "Pirmās krāsas pēc ziemas — no krokusiem un narcisēm līdz atraitnītēm un vēlāk ziedošām daudzgadīgajām puķēm. Sarakstā ir augi, kuru ziedēšanas laiks Latvijā iekrīt martā, aprīlī vai maijā.",
    care:
      "Tulpju, narcišu un krokusu sīpolus nākamā pavasara ziedēšanai parasti stāda iepriekšējā rudenī. Pavasarī kop jau augošās puķes un pēc sīpolpuķu noziedēšanas ļauj lapām dabiski nodzeltēt. Citu puķu stādīšanas laiku pārbaudi katra auga ceļvedī — visam sarakstam viens termiņš neder.",
    relatedLinks: [
      { href: "/raksti/tulpju-stadisana-rudeni", label: "Kad stādīt tulpju sīpolus" },
      { href: "/pukes/narcises", label: "Narcišu stādīšana un kopšana" },
      { href: "/ko-set/aprilis", label: "Ko sēt un stādīt aprīlī" },
    ],
    faq: [
      {
        q: "Kad stādīt pavasara puķu sīpolus Latvijā?",
        a: "Rudenī — no septembra līdz oktobra beigām, kamēr augsne vēl nav sasalusi. Sīpoliem vajag dažas nedēļas, lai pirms ziemas iesakņotos.",
      },
      {
        q: "Kuras pavasara puķes zied vispirms?",
        a: "Krokusi un sniegpulkstenīši — tie parādās jau martā, bieži vēl starp sniega laukumiem. Tiem seko narcises un hiacintes aprīlī, tad tulpes aprīlī–maijā.",
      },
    ],
  },
];

export function getBloomPeriod(slug: string): BloomPeriod | null {
  return BLOOM_PERIODS.find((p) => p.slug === slug) ?? null;
}

/** `balkona-pukes` is a category page, not a species — it would read as an odd
 *  row in a list of individual plants. */
const NOT_A_SPECIES = new Set(["balkona-pukes"]);

export function flowersForPeriod(period: BloomPeriod): Flower[] {
  return getAllFlowers()
    .filter((f) => !NOT_A_SPECIES.has(f.slug))
    .filter((f) =>
      period.every
        ? period.months.every((m) => f.bloomMonths.includes(m))
        : period.months.some((m) => f.bloomMonths.includes(m)),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "lv"));
}

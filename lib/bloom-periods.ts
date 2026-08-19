import { getAllFlowers, type Flower } from "@/lib/flowers";

/**
 * Bloom-period list pages. GSC shows 24 list-intent flower queries carrying
 * 1 004 impressions, but only /pukes ranks (position 2.4, 85 clicks) — the
 * other 715 impressions return 13 clicks because every cut of the list lands
 * on the same generic A–Z index. Each period below is a measured query.
 */
/** `kas zied visu vasaru` deliberately has no period page: the article
 *  /raksti/darza-pukes-kas-zied-visu-vasaru already owns that intent (207
 *  impressions). Two pages for one query is the cannibalisation this site is
 *  already paying for elsewhere — link to the article instead. */
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
  /** Seasonal note — what the reader should actually do about it now. */
  now: string;
  faq: { q: string; a: string }[];
}

export const BLOOM_PERIODS: BloomPeriod[] = [
  {
    slug: "rudeni",
    months: [9, 10],
    h1: "Puķes, kas zied rudenī",
    title: "Rudens puķes — kas zied septembrī un oktobrī Latvijā",
    description:
      "Kuras dārza puķes zied septembrī un oktobrī Latvijā: asteres, krizantēmas, dālijas, rudbekijas un citas, ar ziedēšanas laiku, augstumu un kopšanu.",
    lead:
      "Rudens dārzā krāsu tur tie augi, kas iztur vēsās naktis un ziedē līdz pirmajām salnām. Šeit ir puķes, kas Latvijā zied septembrī un oktobrī — ar to ziedēšanas laiku, augstumu un vietu, kur tās jūtas labi.",
    now:
      "Septembrī un oktobrī vēl var stādīt daudzgadīgo puķu ceru dalījumus un sīpolpuķes nākamajam pavasarim, kamēr augsne nav sasalusi. Neizturīgo augu — dāliju un gladiolu — gumus un sīpolus izroc pēc pirmajām salnām un glabā vēsā, sausā telpā.",
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
    months: [6, 7, 8],
    h1: "Vasaras puķes",
    title: "Vasaras puķu nosaukumi — kas zied jūnijā, jūlijā un augustā",
    description:
      "Vasaras puķes Latvijas dārzam: kas zied jūnijā, jūlijā un augustā, ar ziedēšanas laiku, augstumu, saules prasībām un kopšanu.",
    lead:
      "Puķes, kas Latvijā zied vasarā — jūnijā, jūlijā vai augustā. Dažas tur visu sezonu, citas uzzied īsu, spilgtu vilni; sarakstā redzi katras ziedēšanas laiku.",
    now:
      "Vasaras vidū galvenais darbs ir noziedējušo ziedu noņemšana un laistīšana sausumā. Augusta beigās sāc plānot rudens stādīšanu — ceru dalīšanu un sīpolpuķes nākamajam pavasarim.",
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
    months: [3, 4, 5],
    h1: "Pavasara puķes",
    title: "Pavasara puķes — kas zied martā, aprīlī un maijā Latvijā",
    description:
      "Pavasara puķes Latvijā: krokusi, narcises, tulpes, hiacintes un citas, kas zied martā, aprīlī un maijā — ar stādīšanas laiku un kopšanu.",
    lead:
      "Pirmās krāsas pēc ziemas. Gandrīz visas šīs puķes ir sīpolpuķes, un tas nozīmē vienu: lai tās pavasarī ziedētu, sīpoli zemē jāieliek iepriekšējā rudenī.",
    now:
      "Ja gribi šīs puķes nākampavasar, sīpoli jāstāda tagad — no septembra līdz oktobra beigām, kamēr augsne nav sasalusi. Pavasarī stādīt vairs nav jēgas.",
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

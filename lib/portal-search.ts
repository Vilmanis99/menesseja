import { ARTICLE_QUERY_LIMIT, normalizeArticleQuery } from "./article-search";
import { getAllArticles, headingSlug } from "./articles";
import { BLOOM_PERIODS } from "./bloom-periods";
import { getCropContent } from "./crop-content";
import { flowerDirectoryEntries } from "./flower-directory";
import { getAllFlowers } from "./flowers";
import { getAllProblems } from "./kaitekli";
import { MONTH_GUIDES } from "./month-guides";
import { CROPS, MONTHS_LV_FULL, MONTHS_LV_GENITIVE } from "./planting-crops";
import { problemSearchText } from "./problem-search";
import { getAllRecipes } from "./recipes";
import { calendarYears, MONTH_SLUGS, MONTHS_LV_LOCATIVE } from "./seo";
import { getAllTopLists } from "./tops";

type Group = "Kalendārs un Mēness" | "Augi un puķes" | "Kaitēkļi un slimības" | "Raksti un padomi" | "Dārza rīki" | "Dārza receptes";
export interface PortalResult { href: string; title: string; description: string; group: Group }
interface Page extends PortalResult { aliases?: string[]; details?: string }
interface IndexedPage { page: PortalResult; names: string[]; nameWords: string[]; words: string[] }

function collections(): Page[] {
  const pages: Page[] = [
    { href: "/pukes", title: "Puķu atlants", group: "Augi un puķes", description: "Puķu nosaukumi no A līdz Z, fotogrāfijas un kopšanas ceļveži.", aliases: ["puķes", "puķu nosaukumi", "puķu nosaukumi alfabēta secībā"] },
    { href: "/pukes/sniegpulkstenites#kad-zied-latvija", title: "Kad zied Latvijā? Sniegpulkstenītes Ukros un Rankā", group: "Augi un puķes",
      description: "Salīdzini abās vietās reģistrēto ziedēšanas sākumu 16 gados.", aliases: ["kad zied Latvijā", "kad zied sniegpulkstenītes", "sniegpulkstenīšu ziedēšanas datumi"] },
    { href: "/augi", title: "Augu enciklopēdija", group: "Augi un puķes", description: "Dārzeņu, ogu, garšaugu un puķu audzēšanas ceļveži." },
    { href: "/kaitekli", title: "Kaitēkļi un slimības", group: "Kaitēkļi un slimības", description: "Augu bojājumu pazīmes un rīcība dārzā." },
    { href: "/meness", title: "Mēness fāze šodien", group: "Kalendārs un Mēness", description: "Mēness fāze, vecums, lēkts un riets Latvijā.", aliases: ["mēness šodien", "kāds mēness šodien", "mēness fāzes"] },
    { href: "/kalendars", title: "Dārza darbu kalendārs", group: "Kalendārs un Mēness", description: "Mēness fāzes un dārza darbi pa gadiem un mēnešiem.", aliases: ["kalendārs", "Mēness kalendārs", "sējas kalendārs"] },
    { href: "/kalendars/istabas-augu-parstadisana", title: "Istabas augu pārstādīšanas kalendārs", group: "Kalendārs un Mēness", description: "Kad un kā pārstādīt telpaugus." },
    { href: "/darza-darbi-sonedel", title: "Dārza darbi šonedēļ", group: "Kalendārs un Mēness", description: "Pārskati nedēļas darbus un atzīmē paveikto." },
    { href: "/ko-set", title: "Ko sēt pa mēnešiem", group: "Kalendārs un Mēness", description: "Sēšanas un stādīšanas darbi Latvijas dārzā." },
    { href: "/celvedis", title: "Sējas ceļvedis", group: "Dārza rīki", description: "Atlasi augus pēc mēneša un dārza darba." },
    { href: "/planotajs", title: "Dobes plānotājs", group: "Dārza rīki", description: "Plāno stādījumus un pārbaudi blakus augošās kultūras.", aliases: ["dārza plānotājs", "dobes plāns", "kaimiņaugi"] },
    { href: "/dienasgramata", title: "Dārza dienasgrāmata", group: "Dārza rīki", description: "Atver savas piezīmes un stādījumu ražas pierakstus." },
    { href: "/#mans-darzs", title: "Mans dārzs", group: "Dārza rīki", description: "Pievieno stādījumu un pieraksti tā kopšanu vai ražu." },
    { href: "/raksti", title: "Dārza zināšanu krātuve", group: "Raksti un padomi", description: "Raksti par augu izvēli, kopšanu un sezonas darbiem." },
    { href: "/receptes", title: "Dārza receptes", group: "Dārza receptes", description: "Mēslošanas, augsnes un augu kopšanas receptes." },
  ];

  for (const article of getAllArticles()) {
    const href = `/raksti/${article.slug}`;
    pages.push({ href, title: article.title, description: article.excerpt, group: "Raksti un padomi",
      aliases: [article.primaryQuery, ...(article.aliases ?? [])] });
    for (const section of article.body) {
      if (section.calculator && section.heading) {
        pages.push({ href: href + "#" + headingSlug(section.heading), title: section.heading, group: "Dārza rīki",
          description: article.title, aliases: section.calculator === "seedling-sowing"
            ? ["dēstu sējas kalkulators", "aprēķināt sējas laiku"] : ["sēklu pārbaude", "sēklu dīgtspējas pārbaude"] });
      }
    }
  }
  const flowers = getAllFlowers();
  for (const flower of flowers) {
    pages.push({ href: `/pukes/${flower.slug}`, title: flower.name, description: flower.tagline, group: "Augi un puķes" });
  }
  const flowerSlugs = new Set(flowers.map((flower) => flower.slug));
  for (const crop of CROPS) {
    if (flowerSlugs.has(crop.id)) continue; // The crop route redirects to its flower profile.
    const content = getCropContent(crop.id);
    pages.push({ href: `/augi/${crop.id}`, title: crop.name, description: content?.description || crop.note || "",
      aliases: content?.title ? [content.title] : [], group: "Augi un puķes" });
  }
  const byHref = new Map(pages.map((page) => [page.href, page]));
  for (const flower of flowerDirectoryEntries(flowers)) {
    const aliases = [flower.name, flower.latin ?? "", ...flower.aliases];
    const page = flower.href && byHref.get(flower.href);
    if (page) page.aliases = [...(page.aliases ?? []), ...aliases];
    else if (!flower.href) {
      pages.push({ href: `/pukes#burts-${flower.name[0].toLocaleLowerCase("lv")}`, title: flower.name, aliases,
        group: "Augi un puķes", description: flower.note || "Nosaukums puķu atlanta alfabētiskajā sarakstā." });
    }
  }
  for (const period of BLOOM_PERIODS) {
    pages.push({ href: `/pukes/kas-zied/${period.slug}`, title: period.h1, aliases: [period.title], description: period.description, group: "Augi un puķes" });
  }
  for (const problem of getAllProblems()) {
    pages.push({ href: `/kaitekli/${problem.slug}`, title: problem.name, description: problem.tagline,
      group: "Kaitēkļi un slimības", aliases: [problem.latin ?? ""], details: problemSearchText(problem) });
  }
  for (const recipe of getAllRecipes()) {
    pages.push({ href: `/receptes/${recipe.slug}`, title: recipe.name, description: recipe.tagline, group: "Dārza receptes" });
  }
  for (const list of getAllTopLists()) {
    pages.push({ href: `/topi/${list.slug}`, title: list.title, description: list.subtitle, group: "Raksti un padomi" });
  }
  return pages;
}

function calendarPages(years: number[]): Page[] {
  const group = "Kalendārs un Mēness";
  const pages: Page[] = [];
  for (const [i, slug] of MONTH_SLUGS.entries()) {
    const month = MONTHS_LV_FULL[i];
    pages.push({ href: `/ko-set/${slug}`, group, title: `Ko sēt ${MONTHS_LV_LOCATIVE[i]}`,
      description: MONTH_GUIDES[i + 1]?.description ?? "Šī mēneša sēšanas un stādīšanas darbi." });
    for (const year of years) {
      pages.push({ href: `/kalendars/${year}/${slug}`, group, title: `Dārza darbu kalendārs — ${month} ${year}`,
        aliases: [`${month} ${year}`, `${year}. gada ${MONTHS_LV_GENITIVE[i]} kalendārs`, `${MONTHS_LV_LOCATIVE[i]} ${year}`],
        description: "Mēneša darbi, Mēness fāzes un dienu tabula." });
    }
  }
  for (const year of years) {
    pages.push({ href: `/kalendars/${year}`, group, title: `${year}. gada dārza darbu kalendārs`,
      description: "Izvēlies mēnesi, lai atvērtu tā kalendāru.", aliases: [`${year}`, `kalendārs ${year}`] });
  }
  return pages;
}

let cached: { lastYear: number; documents: IndexedPage[] } | undefined;
function searchIndex(asOf: Date): IndexedPage[] {
  const years = calendarYears(asOf);
  const lastYear = years[years.length - 1];
  if (cached?.lastYear === lastYear) return cached.documents;
  const documents = [...collections(), ...calendarPages(years)].map(({ aliases = [], details = "", ...page }) => {
    const names = [page.title, ...aliases].map(normalizeArticleQuery).filter(Boolean);
    const nameWords = [...new Set(names.join(" ").split(" "))];
    const words = [...new Set([...nameWords, ...normalizeArticleQuery(page.description + " " + details).split(" ")])];
    return { page, names, nameWords, words };
  });
  cached = { lastYear, documents };
  return documents;
}

export function portalQuery(raw: string | string[] | undefined): string {
  return (Array.isArray(raw) ? raw[0] ?? "" : raw ?? "").trim().slice(0, ARTICLE_QUERY_LIMIT);
}

export function searchPortal(raw: string, asOf = new Date()): PortalResult[] {
  const query = normalizeArticleQuery(portalQuery(raw));
  if (!query) return [];
  const terms = [...new Set(query.split(" "))];
  // A Latvian singular can prefix its plural. Years and short words must match in full.
  const matches = (word: string, term: string) => word === term || (term.length >= 3 && !/^\d+$/.test(term) && word.startsWith(term));
  const ranked: { page: PortalResult; score: number }[] = [];
  for (const { page, names, nameWords, words } of searchIndex(asOf)) {
    if (!terms.every((term) => words.some((word) => matches(word, term)))) continue;
    const named = terms.filter((term) => nameWords.some((word) => matches(word, term))).length;
    const score = (names[0] === query ? 1000 : names.includes(query) ? 900 : 0)
      + (named === terms.length ? 200 : 0) + named * 5
      + Number(names[0].includes(query)) * 30 + terms.filter((term) => nameWords.includes(term)).length;
    ranked.push({ page, score });
  }
  ranked.sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title, "lv"));
  const seen = new Set<string>();
  return ranked.map((match) => match.page).filter((page) => {
    const path = page.href.split("#")[0];
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

import { latviaDateParts } from "./day-anchor";
import { CALENDAR_YEARS, MONTH_SLUGS } from "./seo";

export const SEASONAL_LINKS_UPDATED_AT = "2026-10-27";

/** Adjacent calendar months, including December → January. */
export function adjacentMonth(year: number, month: number, offset: number) {
  seasonForMonth(month);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 10));
  const target = { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
  return { ...target, href: CALENDAR_YEARS.includes(target.year)
    ? `/kalendars/${target.year}/${MONTH_SLUGS[target.month - 1]}`
    : `/ko-set/${MONTH_SLUGS[target.month - 1]}` };
}

export function seasonForMonth(month: number): "ziema" | "pavasaris" | "vasara" | "rudens" {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError("Invalid month");
  if (month >= 3 && month <= 5) return "pavasaris";
  if (month >= 6 && month <= 8) return "vasara";
  if (month >= 9 && month <= 11) return "rudens";
  return "ziema";
}

/** Evergreen monthly guides keep their URL when the calendar year changes. */
export function monthCalendarHref(month: number, date = new Date()): string {
  seasonForMonth(month);
  const year = latviaDateParts(date).year;
  return CALENDAR_YEARS.includes(year) ? `/kalendars/${year}/${MONTH_SLUGS[month - 1]}` : "/kalendars";
}

export interface SeasonalLink { href: string; label: string }
const article = (slug: string, label: string): SeasonalLink => ({ href: `/raksti/${slug}`, label });
const flower = (slug: string, label: string): SeasonalLink => ({ href: `/pukes/${slug}`, label });
const bloom = (period: string, label: string): SeasonalLink => ({ href: `/pukes/kas-zied/${period}`, label });

/** Editorial links rotate by Riga's calendar month. Autumn traffic does not
 * decide which spring or summer pages remain available. */
const MONTH_LINKS: SeasonalLink[][] = [
  [article("ka-izveleties-seklas-darzam", "Sēklu izvēle savam dārzam"), article("ka-glabat-seklas-un-parbaudit-digtspeju", "Sēklu dīgtspējas pārbaude"), article("darza-planosana-iesacejam", "Dārza plānošana iesācējam"), article("amarillis-pec-ziedesanas", "Amarillis pēc ziedēšanas"), article("hiacintes-podina-un-glaze", "Hiacintes podiņā un glāzē"), article("ziemassvetku-kaktuss-nezied", "Ziemassvētku kaktusa kopšana ziemā")],
  [article("kad-set-destus-rekini-atpakal", "Kad sākt dēstu sēju"), article("destu-audzesana-uz-palodzes", "Dēsti uz palodzes"), bloom("pavasari", "Pavasara puķes")],
  [article("destu-audzesana-uz-palodzes", "Dēstu audzēšana uz palodzes"), article("hortenziju-apgriesana", "Hortenziju griešana pēc sugas"), article("desti-izstidz", "Kāpēc dēsti izstīdz"), bloom("pavasari", "Puķes, kas zied pavasarī")],
  [article("augsnes-temperatura", "Kad augsne gatava sējai"), article("hortenziju-apgriesana", "Hortenziju apgriešana pavasarī"), article("ka-apgriezt-rozes-pavasari", "Rožu apgriešana pavasarī"), bloom("pavasari", "Pavasara puķes")],
  [article("ka-rudit-destus", "Dēstu norūdīšana"), article("kad-stadit-destus-lauka", "Kad stādīt dēstus laukā"), bloom("pavasari", "Kas zied maijā")],
  [article("ka-laistit-darzu-karstuma", "Laistīšana karstumā"), article("kapec-hortenzijas-nezied", "Kāpēc hortenzijas nezied"), bloom("vasara", "Puķes, kas zied vasarā")],
  [article("darza-darbi-julija", "Dārza darbi jūlijā"), article("ko-set-julija-augusta", "Sēja otrajai ražai"), bloom("vasara", "Vasaras puķes")],
  [article("zemenu-stadisana-augusta", "Zemeņu stādīšana augustā"), article("kad-parstadit-peonijas", "Peoniju pārstādīšana"), bloom("vasara", "Kas zied augustā")],
  [article("ka-kopt-geranijas", "Pelargoniju sagatavošana ziemošanai"), article("tulpju-stadisana-rudeni", "Tulpju stādīšana rudenī"), article("baltas-sinepes-pec-razas", "Zaļmēslojums pēc ražas"), bloom("rudeni", "Puķes, kas zied rudenī")],
  [article("hortenziju-apgriesana", "Hortenzijas: ko griezt rudenī un ko atstāt"), article("siltumnicas-sagatavosana-sezonai", "Siltumnīcas sagatavošana ziemai"), article("ka-kopt-geranijas", "Pelargoniju pārziemošanas iespējas"), article("ka-glabat-dalijas-ziema", "Dāliju izrakšana un glabāšana"), article("tulpju-stadisana-rudeni", "Tulpju stādīšana rudenī"), bloom("rudeni", "Rudens puķes"), article("ka-uzglabat-darzenus-ziema", "Dārzeņu glabāšana ziemā")],
  [article("siltumnicas-sagatavosana-sezonai", "Siltumnīca pirms sala un sniega"), article("ziemassvetku-kaktuss-nezied", "Ziemassvētku kaktuss: pumpuri un kopšana"), flower("rozes#parziemosana", "Rožu ziemošana dobē un podā"), article("ka-uzglabat-darzenus-ziema", "Dārzeņu glabāšana ziemā"), article("hortenziju-apgriesana", "Hortenziju rudens darbi un griešanas laiks"), article("ka-glabat-dalijas-ziema", "Dāliju glabāšana ziemā"), article("ka-glabat-seklas-un-parbaudit-digtspeju", "Sēklu glabāšana")],
  [article("ziemassvetku-kaktuss-nezied", "Kāpēc Ziemassvētku kaktuss nezied vai met pumpurus"), article("ziemassvetku-zvaigzne-puansetija", "Ziemassvētku zvaigznes kopšana"), article("amarillis-pec-ziedesanas", "Amarillis: kopšana un atkārtota ziedēšana"), article("siltumnicas-sagatavosana-sezonai", "Siltumnīcas apskate ziemā"), article("ka-izveleties-seklas-darzam", "Sēklu izvēle nākamajai sezonai"), article("augu-maina-darza", "Augu maiņas plāns")],
];

export function seasonalLinks(month: number): SeasonalLink[] {
  seasonForMonth(month); // validate before indexing
  return MONTH_LINKS[month - 1];
}

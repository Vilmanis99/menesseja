/** Canonical site origin (override via NEXT_PUBLIC_SITE_URL when deploying). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.menesseja.lv").replace(/\/$/, "");
export const SITE_NAME = "Mēness Sēja";

/** ASCII-safe month slugs (URL-friendly) ↔ month number 1–12. */
export const MONTH_SLUGS = [
  "janvaris", "februaris", "marts", "aprilis", "maijs", "junijs",
  "julijs", "augusts", "septembris", "oktobris", "novembris", "decembris",
] as const;

export function monthFromSlug(slug: string): number | null {
  const i = MONTH_SLUGS.indexOf(slug as (typeof MONTH_SLUGS)[number]);
  return i === -1 ? null : i + 1;
}

/** Locative month forms ("maijā") for "ko sēt {month}ā" phrasing (index 0 = Jan). */
export const MONTHS_LV_LOCATIVE = [
  "janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā",
  "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī",
];

/** Years we statically generate moon-calendar pages for. */
export const CALENDAR_YEARS = [2025, 2026, 2027];

/** Per-month seasonal tasks + folklore (index 0 = January) — unique editorial
 *  copy so month pages aren't pure templates. */
export const MONTH_TIPS = [
  "Atpūtas un plānošanas laiks — pārskati sēklas un plāno dobes. Senči vēroja: kāds laiks Zvaigznes dienā, tāds pavasaris.",
  "Sagatavo vietu dēstiem un rēķini sējas laiku no izstādīšanas. Papriku un selerijas sēj pēc šķirnes prasībām; tumšā palodzē nesteidzies ar agru tomātu sēju.",
  "Sēja uz palodzes un siltumnīcas sagatavošana. Izvēlies sējas laiku pēc šķirnes un izstādīšanas plāna; ārā strādā tikai atkususi, ne pārmitra augsne.",
  "Augsne sāk sasilt — sēj aukstumizturīgos tieši laukā (redīsi, salāti, zirņi, burkāni). Uzmanies no nakts salnām.",
  "Galvenais sējas mēnesis. Siltummīļus laukā tikai pēc pēdējās salnas (mēneša beigas) — “ledus vīri” ap 12.–15. maiju.",
  "Stādi gurķus, ķirbjus un tomātus laukā. Jāņos — gada īsākā nakts; pēc Jāņiem zāle aug lēnāk.",
  "Ravēšana, laistīšana un pirmā raža. Sēj atkārtoti salātus un dilles vasaras un rudens ražai.",
  "Lielā novākšana un konservēšana. Sēj ziemas salātus un spinātus; stādi zemenes nākamgadam.",
  "Novāc un atlasi ražu glabāšanai. Sīpolpuķēm un zaļmēslojumam izvēlies sugai piemērotu laiku; ziemas ķiploku stādīšanu pielāgo rudens gaitai.",
  "Atdzisušā, nesasalušā augsnē stādi ziemas ķiplokus un tulpes. Sagatavo dālijas glabāšanai un sakop siltumnīcu pēc ražas.",
  "Pārbaudi glabāto ražu un sagatavo augus ziemai atbilstoši to prasībām. Iztīri un nožāvē instrumentus, savāc lapas kompostam.",
  "Atpūta un nākamā gada plānošana. Ziemas saulgrieži — gaisma sāk atgriezties.",
];

export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Complete Open Graph block for a page — own title/description + absolute url +
 *  the site OG image (otherwise pages that define their own `openGraph` ship a
 *  null og:image and a generic/duplicate social card). Twitter inherits the image. */
export function og(opts: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
}) {
  return {
    title: opts.title,
    description: opts.description,
    url: canonical(opts.path),
    siteName: SITE_NAME,
    locale: "lv_LV",
    type: opts.type ?? "article",
    images: [opts.image ? canonical(opts.image) : `${SITE_URL}/opengraph-image`],
  };
}

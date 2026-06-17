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
  "Sēj telpās tomātus, papriku un selerijas — tām vajag garu augšanas laiku. Sveču dienā lāse no jumta vēstī agru pavasari.",
  "Pirmā nopietnā sēja uz palodzes — kāposti, baziliks, puķes. Gaisma strauji pieaug, augi mostas.",
  "Augsne sāk sasilt — sēj aukstumizturīgos tieši laukā (redīsi, salāti, zirņi, burkāni). Uzmanies no nakts salnām.",
  "Galvenais sējas mēnesis. Siltummīļus laukā tikai pēc pēdējās salnas (mēneša beigas) — “ledus vīri” ap 12.–15. maiju.",
  "Stādi gurķus, ķirbjus un tomātus laukā. Jāņos — gada īsākā nakts; pēc Jāņiem zāle aug lēnāk.",
  "Ravēšana, laistīšana un pirmā raža. Sēj atkārtoti salātus un dilles vasaras un rudens ražai.",
  "Lielā novākšana un konservēšana. Sēj ziemas salātus un spinātus; stādi zemenes nākamgadam.",
  "Novāc saknes glabāšanai un stādi ķiplokus ziemai. Tukšajās dobēs sēj zaļmēslojumu.",
  "Sakop dobes, mulčē un stādi augļu kokus un krūmus. Pēc salnām pastinaks un kāļi kļūst saldāki.",
  "Apsedz jutīgos augus un savāc lapas kompostam. Sākas dārza miera laiks.",
  "Atpūta un nākamā gada plānošana. Ziemas saulgrieži — gaisma sāk atgriezties.",
];

export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

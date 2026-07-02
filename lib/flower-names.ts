/**
 * Supplementary flower-name entries for the /pukes A–Z index ("puķu nosaukumi"
 * is a proven search term). These are NAMES ONLY — no thin pages get created;
 * they render as plain list entries alongside the 31 full flower guides.
 * Every name checked for correct Latvian spelling (garumzīmes, mīkstinājumi).
 */

export interface FlowerNameEntry {
  name: string;
  latin?: string;
  /** Īss, noderīgs raksturojums sarakstam (≤ ~8 vārdi). */
  note?: string;
}

export const EXTRA_FLOWER_NAMES: FlowerNameEntry[] = [
  // — viengadīgās un divgadīgās —
  { name: "Alises", latin: "Lobularia maritima", note: "zemas, medaini smaržīgas apmaļu puķes" },
  { name: "Balzamīnes", latin: "Impatiens walleriana", note: "ziedi ēnainām dobēm un podiem" },
  { name: "Cīnijas", latin: "Zinnia elegans", note: "spilgtas vasaras puķes griešanai" },
  { name: "Fuksijas", latin: "Fuchsia", note: "nokarenas balkona “laterniņas” ēnai" },
  { name: "Gazānijas", latin: "Gazania rigens", note: "saules mīles karstām, sausām vietām" },
  { name: "Ipomejas (tītenīši)", latin: "Ipomoea", note: "ātri augoši vīteņi ar piltuvveida ziediem" },
  { name: "Kāršrozes", latin: "Alcea rosea", note: "augstās lauku sētu puķes gar žogiem" },
  { name: "Kliņģerītes", latin: "Calendula officinalis", note: "ārstniecības puķe, zied līdz salnām" },
  { name: "Kosmejas", latin: "Cosmos bipinnatus", note: "vieglas, mežģīņlapainas vasaras puķes" },
  { name: "Kreses (nasturcijas)", latin: "Tropaeolum majus", note: "ēdami ziedi dobju malām" },
  { name: "Lauvmutītes", latin: "Antirrhinum majus", note: "bērnu iemīļotās “runājošās” puķes" },
  { name: "Leduspuķes", latin: "Dorotheanthus bellidiformis", note: "mirdzoši ziedi saulainām, sausām vietām" },
  { name: "Levkojas", latin: "Matthiola incana", note: "vakaros smaržojošas dobju puķes" },
  { name: "Lobēlijas", latin: "Lobelia erinus", note: "zilu ziedu mākoņi podiem un kastēm" },
  { name: "Magones", latin: "Papaver", note: "vasaras klasika, sēj tieši dobē" },
  { name: "Naktsvijoles", latin: "Hesperis matronalis", note: "divgadīga, smaržo vakaros" },
  { name: "Portulakas", latin: "Portulaca grandiflora", note: "sukulentas puķītes karstumam" },
  { name: "Rudzupuķes", latin: "Centaurea cyanus", note: "zilā lauka klasika, viegli sējama" },
  { name: "Salvijas (krāšņās)", latin: "Salvia splendens", note: "sarkanās dobju “sveces”" },
  { name: "Sausziedi", latin: "Xerochrysum bracteatum", note: "žāvēšanai un ziemas pušķiem" },
  { name: "Smaržīgie zirnīši", latin: "Lathyrus odoratus", note: "smaržīgi vīteņi pie atbalsta" },
  { name: "Turku neļķes", latin: "Dianthus barbatus", note: "divgadīgās sētu neļķes" },
  { name: "Uzpirkstītes", latin: "Digitalis purpurea", note: "augsti ziedu torņi; augs indīgs" },

  // — daudzgadīgās (ziemcietes) —
  { name: "Akvilēģijas", latin: "Aquilegia", note: "vieglas ziemcietes ar piešainiem ziediem" },
  { name: "Anemones (rudens)", latin: "Anemone hupehensis", note: "zied augustā–oktobrī, mīl pusēnu" },
  { name: "Bergēnijas", latin: "Bergenia", note: "biezlapu ziemciete apmalēm un ēnai" },
  { name: "Delfīnijas", latin: "Delphinium", note: "zilie ziedu torņi dobes fonam" },
  { name: "Dienziedes (dienlilijas)", latin: "Hemerocallis", note: "izturīgas; katrs zieds zied vienu dienu" },
  { name: "Helēnijas", latin: "Helenium", note: "rudens oranžā un sarkanā liesma" },
  { name: "Īrisi (skalbes)", latin: "Iris", note: "varavīksnes ziedi maijā–jūnijā" },
  { name: "Lauztā sirds", latin: "Lamprocapnos spectabilis", note: "sirsniņveida ziedi ēnainām vietām" },
  { name: "Liatres", latin: "Liatris spicata", note: "violetas ziedu sveces tauriņiem" },
  { name: "Lupīnas", latin: "Lupinus polyphyllus", note: "krāšņas ziedu vārpas jūnijā" },
  { name: "Maijpuķītes (kreimenes)", latin: "Convallaria majalis", note: "smaržīgā maija klasika ēnā" },
  { name: "Margrietiņas (mārpuķītes)", latin: "Bellis perennis", note: "mazās pavasara zālāja puķītes" },
  { name: "Neļķes", latin: "Dianthus", note: "smaržīgas apmaļu un dobju puķes" },
  { name: "Pīpenes", latin: "Leucanthemum", note: "lielās baltās “margrietiņas” dobēm" },
  { name: "Prīmulas (gaiļbiksītes)", latin: "Primula", note: "pirmās pavasara krāsas" },
  { name: "Pulkstenītes", latin: "Campanula", note: "zilie zvaniņi jūnijā–jūlijā" },
  { name: "Rudens asteres (siliņi)", latin: "Symphyotrichum", note: "zied līdz pat salnām" },
  { name: "Sedumi (laimiņi)", latin: "Hylotelephium", note: "sukulentas rudens ziemcietes bitēm" },
  { name: "Vijolītes", latin: "Viola odorata", note: "smaržīgās pavasara vijolītes" },
  { name: "Ziepenītes", latin: "Saponaria", note: "rozā ziedu spilventiņi akmeņdārzam" },

  // — sīpolpuķes un gumu puķes —
  { name: "Dekoratīvie sīpoli (alliji)", latin: "Allium", note: "violetas ziedu lodes virs dobes" },
  { name: "Kallas", latin: "Zantedeschia", note: "elegantas piltuves podiem un dobēm" },
  { name: "Kannas", latin: "Canna", note: "eksotiski gumi vasaras dobēm" },
  { name: "Ķeizarkroņi", latin: "Fritillaria imperialis", note: "majestātiski pavasara kroņi; atbaida peles" },
  { name: "Muskari (peļu hiacintes)", latin: "Muscari", note: "zilās pavasara pērlītes" },
  { name: "Puškīnijas", latin: "Puschkinia scilloides", note: "maigi zilas agrā pavasara puķītes" },
  { name: "Sniegpulkstenītes", latin: "Galanthus nivalis", note: "pirmās puķes cauri sniegam" },
  { name: "Zilsniedzes", latin: "Scilla siberica", note: "koši zils pavasara paklājs" },

  // — ziedoši krūmi —
  { name: "Ceriņi", latin: "Syringa vulgaris", note: "smaržīgā maija klasika sētmalēs" },
  { name: "Filadelfi (dārza jasmīni)", latin: "Philadelphus coronarius", note: "balti, smaržīgi ziedi jūnijā" },
  { name: "Forsītijas", latin: "Forsythia", note: "dzeltenais pavasara sākums" },
  { name: "Rododendri", latin: "Rhododendron", note: "krāšņie maija krūmi skābai augsnei" },
  { name: "Spirejas", latin: "Spiraea", note: "nekaprīzi balti vai rozā ziedu krūmi" },
];

/** Tautas (sarunvalodas) nosaukumi → izplatītākais nosaukums. Reāli meklēti
 *  vārdi (pujenes, jurģīnes…), ko neviens LV konkurents nav apkopojis vienuviet. */
export interface FolkName {
  folk: string;
  standard: string;
  /** /pukes lapas slug, ja tāda ir. */
  slug?: string;
}

export const FOLK_NAMES: FolkName[] = [
  { folk: "Pujenes", standard: "Peonijas", slug: "peonijas" },
  { folk: "Jurģīnes", standard: "Dālijas", slug: "dalijas" },
  { folk: "Ģerānijas", standard: "Pelargonijas", slug: "pelargonijas" },
  { folk: "Kreimenes", standard: "Maijpuķītes" },
  { folk: "Mārtiņrozes", standard: "Krizantēmas", slug: "krizantemas" },
  { folk: "Siliņi / miķelīši", standard: "Rudens asteres" },
  { folk: "Skalbes", standard: "Īrisi" },
  { folk: "Nasturcijas", standard: "Kreses" },
  { folk: "Surfīnijas", standard: "Petūnijas (nokarenās)", slug: "petunijas" },
  { folk: "Mārpuķītes", standard: "Margrietiņas" },
  { folk: "Peļu hiacintes", standard: "Muskari" },
];

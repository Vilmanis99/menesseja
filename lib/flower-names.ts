/**
 * Papildu nosaukumi /pukes A–Z rādītājam. Ieraksti aptver ģintis, sugas un
 * dārzkopības grupas; ierakstu skaits nav unikālu sugu skaits.
 * Prioritāro atbilstību pārbaude un avoti:
 * content/audits/flower-names-review-2026-10-27.json.
 * Tas nav visu nosaukumu un audzēšanas īpašību pilns botāniskais audits.
 */

export interface FlowerNameEntry {
  name: string;
  href?: string;
  latin?: string;
  /** Īss, noderīgs raksturojums sarakstam (≤ ~8 vārdi). */
  note?: string;
}

export const EXTRA_FLOWER_NAMES: FlowerNameEntry[] = [
  // — vasaras puķes un divgadīgās; daļa sugu ir sala neizturīgas ziemcietes —
  { name: "Alises", latin: "Lobularia maritima", note: "zemas, medaini smaržīgas apmaļu puķes" },
  { name: "Balzamīnes", latin: "Impatiens walleriana", note: "ziedi ēnainām dobēm un podiem" },
  { name: "Cīnijas", latin: "Zinnia elegans", note: "spilgtas vasaras puķes griešanai" },
  { name: "Fuksijas", latin: "Fuchsia", note: "nokarenas balkona “laterniņas” ēnai" },
  { name: "Gazānijas", latin: "Gazania rigens", note: "saules mīles karstām, sausām vietām" },
  { name: "Ipomejas (tītenīši)", latin: "Ipomoea", note: "ātri augoši vīteņi ar piltuvveida ziediem" },
  { name: "Kāršrozes", latin: "Alcea rosea", note: "augstās lauku sētu puķes gar žogiem" },
  { name: "Kliņģerītes", latin: "Calendula officinalis", note: "dzelteni un oranži vasaras ziedi" },
  { name: "Kosmejas", latin: "Cosmos bipinnatus", note: "vieglas, mežģīņlapainas vasaras puķes" },
  { name: "Kreses", latin: "Tropaeolum majus", note: "apaļas lapas un spilgti ziedi" },
  { name: "Lauvmutītes", latin: "Antirrhinum majus", note: "bērnu iemīļotās “runājošās” puķes" },
  { name: "Leduspuķes (ilgziedu begonijas)", href: "/pukes/begonijas", latin: "Begonia Semperflorens Cultorum Group", note: "kompaktas begonijas dobēm un podiem" },
  { name: "Levkojas", latin: "Matthiola incana", note: "smaržīgas ziedkopas dobēm un pušķiem" },
  { name: "Lobēlijas", latin: "Lobelia erinus", note: "zilu ziedu mākoņi podiem un kastēm" },
  { name: "Magones", latin: "Papaver", note: "vasaras klasika, sēj tieši dobē" },
  { name: "Smaržīgās vakarenes", latin: "Hesperis matronalis", note: "divgadīga, smaržo vakaros" },
  { name: "Portulakas", latin: "Portulaca grandiflora", note: "sukulentas puķītes karstumam" },
  { name: "Rudzupuķes", latin: "Centaurea cyanus", note: "zilā lauka klasika, viegli sējama" },
  { name: "Salvijas (krāšņās)", latin: "Salvia splendens", note: "sarkanās dobju “sveces”" },
  { name: "Seglapu salmenes", latin: "Xerochrysum bracteatum", note: "sausziedes žāvēšanai un ziemas pušķiem" },
  { name: "Smaržīgie zirnīši", latin: "Lathyrus odoratus", note: "smaržīgi vīteņi pie atbalsta" },
  { name: "Turku neļķes", href: "/augi/nelkes", latin: "Dianthus barbatus", note: "divgadīgās sētu neļķes" },
  { name: "Uzpirkstītes", latin: "Digitalis purpurea", note: "augsti ziedu torņi; augs indīgs" },

  // — daudzgadīgās (ziemcietes) —
  { name: "Akvilejas", latin: "Aquilegia", note: "vieglas ziemcietes ar piešainiem ziediem" },
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
  { name: "Mārpuķītes", latin: "Bellis perennis", note: "mazās pavasara zālāja puķītes" },
  { name: "Neļķes", href: "/augi/nelkes", latin: "Dianthus", note: "smaržīgas apmaļu un dobju puķes" },
  { name: "Pīpenes", latin: "Leucanthemum", note: "lielās baltās “margrietiņas” dobēm" },
  { name: "Prīmulas", latin: "Primula", note: "dažādas sugas un dārza hibrīdi" },
  { name: "Pulkstenītes", latin: "Campanula", note: "zilie zvaniņi jūnijā–jūlijā" },
  { name: "Rudens asteres (ziemasteres)", latin: "Symphyotrichum", note: "daudzgadīgas asteres vasaras nogalei un rudenim" },
  { name: "Čīkstenes", latin: "Hylotelephium", note: "sulīgas lapas un blīvas ziedkopas" },
  { name: "Laimiņi (sedumi)", latin: "Sedum", note: "biezlapu augi, arī zemas paklājveida sugas" },
  { name: "Smaržīgās vijolītes", latin: "Viola odorata", note: "zemi ceri ar smaržīgiem pavasara ziediem" },
  { name: "Ziepenītes", latin: "Saponaria", note: "rozā ziedu spilventiņi akmeņdārzam" },

  // — sīpolpuķes, gumu un sakneņu puķes —
  { name: "Dekoratīvie sīpoli (alliji)", latin: "Allium", note: "violetas ziedu lodes virs dobes" },
  { name: "Kallas", latin: "Zantedeschia", note: "elegantas piltuves podiem un dobēm" },
  { name: "Kannas", latin: "Canna", note: "lielas lapas un koši vasaras ziedi" },
  { name: "Ķeizarkroņi", latin: "Fritillaria imperialis", note: "augstas pavasara puķes ar nokareniem ziediem" },
  { name: "Muskari", latin: "Muscari", note: "zilās pavasara pērlītes" },
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

/** Sarunvalodas, apvidu un tirdzniecības nosaukumi ar nozīmes precizējumiem. */
export interface FolkName {
  folk: string;
  standard: string;
  /** Puķes ceļveža slug (/pukes/[slug]), ja tāds ir. */
  slug?: string;
  /** Lietojuma robežas, ja nosaukums nav viennozīmīgs sinonīms. */
  note?: string;
  /** Avots konkrētajam nosaukumam vai tā lietojuma precizējumam. */
  sourceUrl?: string;
}

export const FOLK_NAMES: FolkName[] = [
  {
    folk: "Pujenes",
    standard: "Peonijas",
    slug: "peonijas",
    sourceUrl: "https://mlvv.tezaurs.lv/pujene:1",
  },
  {
    folk: "Jurģīnes",
    standard: "Dālijas",
    slug: "dalijas",
    note: "Apvidvārds; izlokšņu avotos sastopami arī citi šā nosaukuma varianti.",
    sourceUrl: "https://lavi.lu.lv/wp-content/uploads/2021/03/NIV-J-K-publicesanai-30.06.2020.pdf",
  },
  {
    folk: "Gerānijas (ģerānijas)",
    standard: "Pelargonijas",
    slug: "pelargonijas",
    note: "Podu puķu sarunvalodas nosaukums. Vārds gerānija apzīmē arī gandrenes (Geranium) — tā ir cita ģints.",
    sourceUrl: "https://tezaurs.lv/gerānija",
  },
  {
    folk: "Kreimenes",
    standard: "Maijpuķītes",
    note: "Šeit domāta parastā kreimene jeb maijpuķīte (Convallaria majalis).",
    sourceUrl: "https://tezaurs.lv/kreimene",
  },
  {
    folk: "Mārtiņrozes",
    standard: "Krizantēmas (sīkziedu)",
    slug: "krizantemas",
    note: "Sarunvalodā ar šo vārdu apzīmē sīkziedu krizantēmas.",
    sourceUrl: "https://llvv.tezaurs.lv/mārtiņroze",
  },
  {
    folk: "Miķelīši (miķelītes)",
    standard: "Rudens asteres",
    note: "Nosaukums aptver dažādas daudzgadīgās asteres. Symphyotrichum ģints augus sauc arī par ziemasterēm.",
    sourceUrl: "https://tezaurs.lv/miķelīte:1",
  },
  {
    folk: "Skalbes",
    standard: "Īrisi",
    sourceUrl: "https://tezaurs.lv/skalbe:1",
  },
  {
    folk: "Surfīnijas",
    standard: "Petūnijas",
    slug: "petunijas",
    note: "Surfinia® ir petūniju šķirņu sērija. Ne katra nokarena petūnija ir surfīnija.",
    sourceUrl: "https://suntoryflowers.com/retailers/surfinia/",
  },
  {
    folk: "Margrietiņas",
    standard: "Pīpenes",
    note: "Bieži — parastā pīpene (Leucanthemum vulgare); apvidvārdos arī citi augi, piemēram, mārpuķītes.",
    sourceUrl: "https://tezaurs.lv/margrietiņas:1",
  },
];

/** Avoti nosaukumu atbilstību skaidrojumiem; tie neapliecina visu sarakstu. */
export const FLOWER_NAME_SOURCES: { label: string; url: string }[] = [
  {
    label: "Jelgavas pašvaldība — leduspuķes apstādījumos",
    url: "https://www.jelgava.lv/jaunumi/driksas-krasta-uzziedejusi-puku-dobe-latvijas-konturas-forma-pilsetas-apstadijumus-sovasar-rotas-vairak-neka-30-000-puku/",
  },
  {
    label: "RHS — ilgziedu begoniju grupa",
    url: "https://www.rhs.org.uk/plants/25707/begonia-semperflorens-hort/details",
  },
  {
    label: "A. Stalažs (2024) — Latvijas vaskulāro augu nosaukumi",
    url: "https://www.darzkopibasinstituts.lv/sites/dobele/files/files/articles/Stalazs_2024a.pdf",
  },
  {
    label: "Tēzaurs — nosaukuma gerānija nozīmes",
    url: "https://tezaurs.lv/gerānija",
  },
  {
    label: "Tēzaurs — nosaukuma margrietiņas nozīmes",
    url: "https://tezaurs.lv/margrietiņas:1",
  },
  {
    label: "Suntory Flowers — Surfinia® petūniju sērija",
    url: "https://suntoryflowers.com/retailers/surfinia/",
  },
];

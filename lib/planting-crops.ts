/**
 * Planting-window data for the interactive "Ko audzēt un kad?" tool.
 * Month numbers are 1–12. Ranges are inclusive [start, end].
 * Windows are BEST-GUESS for Latvia's climate — Karlis verifies/refines.
 *
 * activities:
 *   sowIndoors  — sēt telpās (start seedlings indoors)
 *   sowOutdoors — sēt tieši laukā (direct sow)  [for potatoes/garlic = plant]
 *   transplant  — stādīt laukā (move seedlings outdoors)
 *   harvest     — novākt
 */

export type MonthRange = [number, number];
export type Category = "darzeni" | "garsaugi" | "ogas" | "pukes";

export interface Crop {
  id: string;
  name: string; // Latvian
  category: Category;
  difficulty: 1 | 2 | 3; // 1 = easy (beginner), 3 = trickier
  daysToHarvest?: string; // e.g. "60–80 dienas"
  sun?: string; // "Saule" | "Saule / pussēna" | "Pussēna"
  sowIndoors?: MonthRange;
  sowOutdoors?: MonthRange;
  transplant?: MonthRange;
  harvest?: MonthRange;
  note?: string; // beginner tip (Latvian)
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "darzeni", label: "Dārzeņi" },
  { id: "garsaugi", label: "Garšaugi" },
  { id: "ogas", label: "Ogas un augļi" },
  { id: "pukes", label: "Puķes" },
];

export const CROPS: Crop[] = [
  // ── Dārzeņi ───────────────────────────────────────────────
  { id: "rediisi", name: "Redīsi", category: "darzeni", difficulty: 1, daysToHarvest: "25–35 dienas", sun: "Saule / pussēna", sowOutdoors: [4, 8], harvest: [5, 9], note: "Ātri un viegli — ideāli pirmajai sējai. Sēj pa nedaudz visu sezonu." },
  { id: "salati", name: "Salāti", category: "darzeni", difficulty: 1, daysToHarvest: "40–60 dienas", sun: "Saule / pussēna", sowOutdoors: [4, 8], harvest: [5, 9], note: "Sēj ik pa 2 nedēļām, lai raža būtu visu vasaru." },
  { id: "zirni", name: "Zirņi", category: "darzeni", difficulty: 1, daysToHarvest: "60–70 dienas", sun: "Saule", sowOutdoors: [4, 5], harvest: [6, 8], note: "Aukstumizturīgi — var sēt agri. Vajadzīgs atbalsts rāpšanai." },
  { id: "kartupeli", name: "Kartupeļi", category: "darzeni", difficulty: 1, daysToHarvest: "70–120 dienas", sun: "Saule", sowOutdoors: [5, 5], harvest: [8, 9], note: "Stāda, kad augsne sasilusi līdz ~8 °C — maija pirmajā pusē." },
  { id: "burkani", name: "Burkāni", category: "darzeni", difficulty: 2, daysToHarvest: "70–100 dienas", sun: "Saule", sowOutdoors: [4, 6], harvest: [7, 10], note: "Sēj tieši laukā — nepatīk pārstādīšana. Sēklas dīgst lēni." },
  { id: "bietes", name: "Bietes", category: "darzeni", difficulty: 1, daysToHarvest: "70–90 dienas", sun: "Saule", sowOutdoors: [5, 6], harvest: [8, 10], note: "Katra sēkla dod vairākus dīgstus — izretina. Glabājas labi pagrabā visu ziemu." },
  { id: "sipoli", name: "Sīpoli", category: "darzeni", difficulty: 1, daysToHarvest: "90–120 dienas", sun: "Saule", sowOutdoors: [4, 5], harvest: [8, 9], note: "Visvieglāk no sīpolu lociņiem (sēklas sīpoliem)." },
  { id: "kiploki", name: "Ķiploki", category: "darzeni", difficulty: 1, daysToHarvest: "Ziemo", sun: "Saule", sowOutdoors: [9, 10], harvest: [7, 8], note: "Stāda RUDENĪ nākamai sezonai — tā galviņas ir lielākas." },
  { id: "tomati", name: "Tomāti", category: "darzeni", difficulty: 2, daysToHarvest: "60–85 dienas pēc stādīšanas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [7, 9], note: "Laukā tikai pēc salnām (maija beigas). Viena salna nakts nogalina stādus." },
  { id: "gurki", name: "Gurķi", category: "darzeni", difficulty: 2, daysToHarvest: "50–70 dienas", sun: "Saule", sowIndoors: [4, 5], transplant: [6, 6], harvest: [7, 9], note: "Siltummīļi — laukā tikai pēc salnām vai siltumnīcā." },
  { id: "kabaci", name: "Kabači / cukīni", category: "darzeni", difficulty: 1, daysToHarvest: "50–60 dienas", sun: "Saule", sowIndoors: [5, 5], transplant: [6, 6], harvest: [7, 9], note: "Viens augs dod daudz — iesācējam pietiek ar 2–3 stādiem." },
  { id: "kirbji", name: "Ķirbji", category: "darzeni", difficulty: 2, daysToHarvest: "95–120 dienas", sun: "Saule", sowIndoors: [5, 5], transplant: [6, 6], harvest: [9, 10], note: "Vajag daudz vietas — vīteņi izplešas plaši." },
  { id: "paprika", name: "Paprika", category: "darzeni", difficulty: 3, daysToHarvest: "80–100 dienas pēc stādīšanas", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [7, 9], note: "Vajag siltumu — labāk siltumnīcā. Sēj agri, aug lēni." },
  { id: "kaposti", name: "Kāposti", category: "darzeni", difficulty: 2, daysToHarvest: "80–120 dienas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [8, 10], note: "Vajag barojošu augsni un vienmērīgu mitrumu. Sargā no kāpostu tauriņa kāpuriem." },
  { id: "brokoli", name: "Brokoļi", category: "darzeni", difficulty: 2, daysToHarvest: "70–100 dienas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [7, 9], note: "Novāc galviņu, kamēr pumpuri cieši un zaļi. Pēc tam dod mazākus sānu dzinumus." },
  { id: "spinati", name: "Spināti", category: "darzeni", difficulty: 1, daysToHarvest: "40–50 dienas", sun: "Pussēna", sowOutdoors: [4, 8], harvest: [5, 10], note: "Karstumā ātri iziet ziedos — labāk pavasarī un rudenī." },
  { id: "pupas", name: "Pupas", category: "darzeni", difficulty: 1, daysToHarvest: "55–70 dienas", sun: "Saule", sowOutdoors: [5, 6], harvest: [7, 9], note: "Aukstumizturīgas, bagātina augsni ar slāpekli. Neliec blakus sīpoliem un ķiplokiem." },

  // ── Garšaugi ──────────────────────────────────────────────
  { id: "dilles", name: "Dilles", category: "garsaugi", difficulty: 1, daysToHarvest: "40–60 dienas", sun: "Saule", sowOutdoors: [4, 7], harvest: [6, 9], note: "Sēj tieši — pārstādīšanu nemīl. Sēj atkārtoti." },
  { id: "petersili", name: "Pētersīļi", category: "garsaugi", difficulty: 2, daysToHarvest: "70–90 dienas", sun: "Saule / pussēna", sowOutdoors: [4, 6], harvest: [6, 10], note: "Dīgst lēni (līdz 3 ned.) — neuztraucies, ja ilgi nekā." },
  { id: "baziliks", name: "Baziliks", category: "garsaugi", difficulty: 2, daysToHarvest: "60–70 dienas", sun: "Saule", sowIndoors: [4, 5], transplant: [6, 6], harvest: [7, 9], note: "Siltummīlis — laukā tikai pēc salnām vai uz palodzes." },
  { id: "metra", name: "Piparmētra", category: "garsaugi", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Pussēna", transplant: [5, 6], harvest: [6, 9], note: "Aug ļoti strauji — labāk podā, citādi pārņem dobi." },
  { id: "timians", name: "Timiāns", category: "garsaugi", difficulty: 2, daysToHarvest: "Daudzgadīgs", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [6, 9], note: "Mūžzaļš zem sniega. Mīl sausu, saulainu vietu — nepārlej, citādi puvs saknes." },

  // ── Ogas un augļi ─────────────────────────────────────────
  { id: "zemenes", name: "Zemenes", category: "ogas", difficulty: 2, daysToHarvest: "Daudzgadīgas", sun: "Saule", transplant: [5, 8], harvest: [6, 7], note: "Stādi pavasarī vai augustā. Pirmā pilnā raža nākamgad." },
  { id: "avenes", name: "Avenes", category: "ogas", difficulty: 2, daysToHarvest: "Daudzgadīgas", sun: "Saule / pussēna", transplant: [4, 5], harvest: [7, 9], note: "Stādi pavasarī vai rudenī. Vajag atbalstu un vietu." },
  { id: "upenes", name: "Upenes", category: "ogas", difficulty: 1, daysToHarvest: "Daudzgadīgas", sun: "Saule / pussēna", transplant: [4, 5], harvest: [7, 8], note: "Izturīgs krūms — labi der Latvijas klimatam." },
  { id: "janogas", name: "Jāņogas", category: "ogas", difficulty: 1, daysToHarvest: "Daudzgadīgas", sun: "Saule / pussēna", transplant: [4, 5], harvest: [7, 8], note: "Izturīgas un ražīgas. Sarkanās un baltās šķirnes." },
  { id: "erkskogas", name: "Ērkšķogas", category: "ogas", difficulty: 2, daysToHarvest: "Daudzgadīgas", sun: "Saule", transplant: [4, 5], harvest: [7, 8], note: "Vajag gaisīgu vietu — mitrumā slimo ar miltrasu." },
  { id: "rabarberi", name: "Rabarberi", category: "ogas", difficulty: 1, daysToHarvest: "Daudzgadīgi", sun: "Saule / pussēna", transplant: [4, 5], harvest: [5, 7], note: "Pirmo gadu nelasa. Ražo daudzus gadus." },

  // ── Dārzeņi (papildu) ─────────────────────────────────────
  { id: "pastinaks", name: "Pastinaks", category: "darzeni", difficulty: 2, daysToHarvest: "100–120 dienas", sun: "Saule", sowOutdoors: [4, 5], harvest: [9, 11], note: "Garš sakņaugs. Pēc pirmajām salnām kļūst saldāks." },
  { id: "kalji", name: "Kāļi", category: "darzeni", difficulty: 1, daysToHarvest: "80–100 dienas", sun: "Saule", sowOutdoors: [5, 6], harvest: [9, 10], note: "Tradicionāls latviešu sakņaugs ziemas glabāšanai." },
  { id: "raceni", name: "Rāceņi", category: "darzeni", difficulty: 1, daysToHarvest: "50–70 dienas", sun: "Saule / pussēna", sowOutdoors: [5, 7], harvest: [7, 10], note: "Aug ātri — labi der starpkultūrai. Vēsā laikā saldāki un sulīgāki." },
  { id: "selerijas", name: "Selerijas", category: "darzeni", difficulty: 3, daysToHarvest: "120–150 dienas", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [9, 10], note: "Sēj agri telpās — aug ļoti lēni." },
  { id: "puravi", name: "Puravi (lauki)", category: "darzeni", difficulty: 2, daysToHarvest: "120–150 dienas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [9, 11], note: "Apber stublāju ar zemi, lai baltā daļa būtu garāka." },
  { id: "marrutki", name: "Mārrutki", category: "darzeni", difficulty: 1, daysToHarvest: "Daudzgadīgi", sun: "Saule / pussēna", transplant: [4, 5], harvest: [9, 11], note: "Aug agresīvi — labāk atsevišķā vietā vai traukā." },
  { id: "topinamburs", name: "Topinambūrs", category: "darzeni", difficulty: 1, daysToHarvest: "Daudzgadīgs", sun: "Saule", sowOutdoors: [4, 5], harvest: [10, 11], note: "Ļoti izturīgs. Bumbuļus var atstāt zemē par ziemu." },
  { id: "laukapupas", name: "Lauka pupas", category: "darzeni", difficulty: 1, daysToHarvest: "90–110 dienas", sun: "Saule", sowOutdoors: [4, 5], harvest: [7, 8], note: "Aukstumizturīgas — sēj agri. Bagātina augsni ar slāpekli." },

  // ── Garšaugi (papildu) ────────────────────────────────────
  { id: "koriandrs", name: "Koriandrs", category: "garsaugi", difficulty: 2, daysToHarvest: "40–60 dienas", sun: "Saule / pussēna", sowOutdoors: [4, 7], harvest: [6, 9], note: "Karstumā ātri zied — sēj atkārtoti pussēnā." },
  { id: "salvija", name: "Salvija", category: "garsaugi", difficulty: 2, daysToHarvest: "Daudzgadīga", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [6, 9], note: "Daudzgadīga un izturīga. Apgriez pavasarī, lai krūms nepaliek koksnains." },
  { id: "melisa", name: "Melisa", category: "garsaugi", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Saule / pussēna", transplant: [5, 6], harvest: [6, 9], note: "Citronu aromāts. Aug strauji, ierobežo kā piparmētru." },
  { id: "oregano", name: "Oregano", category: "garsaugi", difficulty: 2, daysToHarvest: "Daudzgadīgs", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [7, 9], note: "Visaromātiskākais saulē un nabadzīgā augsnē. Žāvēšanai griez tieši pirms ziedēšanas." },

  // ── Puķes ─────────────────────────────────────────────────
  { id: "kalendula", name: "Kliņģerītes", category: "pukes", difficulty: 1, daysToHarvest: "50–60 dienas", sun: "Saule", sowOutdoors: [4, 6], harvest: [6, 10], note: "Atvaira kaitēkļus — lieliska dārzeņu kaimiņe. Ziedi ēdami." },
  { id: "samtenes", name: "Samtenes", category: "pukes", difficulty: 1, daysToHarvest: "50–70 dienas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [6, 10], note: "Atbaida nematodes un laputis — sēj starp dārzeņiem." },
  { id: "saulespukes", name: "Saulespuķes", category: "pukes", difficulty: 1, daysToHarvest: "80–100 dienas", sun: "Saule", sowOutdoors: [5, 5], harvest: [8, 9], note: "Sēj tieši laukā pēc salnām. Bērniem ļoti pateicīgas." },
  { id: "nelkes", name: "Neļķes", category: "pukes", difficulty: 2, daysToHarvest: "Daudzgadīgas", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [6, 8], note: "Smaržīgas dobju malām. Daudzgadīgās šķirnes ziemo zem vieglas segas." },
  // Dekoratīvās puķes no /pukes ceļveža — "harvest" = ziedēšana.
  { id: "peonijas", name: "Peonijas", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Saule / pussēna", sowOutdoors: [9, 10], harvest: [6, 7], note: "Sakneņus stāda rudenī, pumpurus tikai 2–5 cm dziļi — citādi neziedēs." },
  { id: "tulpes", name: "Tulpes", category: "pukes", difficulty: 1, daysToHarvest: "Zied pavasarī", sun: "Saule", sowOutdoors: [9, 10], harvest: [4, 5], note: "Sīpolus stāda rudenī ~15 cm dziļi. Pavasara klasika." },
  { id: "narcises", name: "Narcises", category: "pukes", difficulty: 1, daysToHarvest: "Zied pavasarī", sun: "Saule / pussēna", sowOutdoors: [9, 10], harvest: [4, 5], note: "Stāda rudenī; grauzēji sīpolus neaiztiek. Vairojas pati." },
  { id: "begonijas", name: "Begonijas", category: "pukes", difficulty: 2, daysToHarvest: "Zied visu vasaru", sun: "Pussēna", sowIndoors: [3, 4], transplant: [6, 6], harvest: [6, 9], note: "Ēnas karaliene. Bumbuļus rudenī izrok un glabā vēsumā." },
  { id: "pelargonijas", name: "Pelargonijas", category: "pukes", difficulty: 1, daysToHarvest: "Zied visu vasaru", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [6, 9], note: "Balkona klasika. Rudenī ienes telpās pārziemot uz palodzes." },
  { id: "petunijas", name: "Petūnijas", category: "pukes", difficulty: 2, daysToHarvest: "Zied visu vasaru", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [6, 9], note: "Sēklas ļoti sīkas — sēj virspusē, neapber. Laukā pēc salnām." },
  { id: "ehinacija", name: "Ehinācija", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Saule", sowIndoors: [3, 4], sowOutdoors: [5, 6], harvest: [7, 9], note: "Ziemcietīga saulmīle, pievelk bites un tauriņus. Arī ārstniecības augs." },
  { id: "budlejas", name: "Budlejas", category: "pukes", difficulty: 2, daysToHarvest: "Zied no jūlija", sun: "Saule", transplant: [5, 6], harvest: [7, 9], note: "Tauriņu krūms. Pavasarī stipri apgriež — zied uz jaunajiem dzinumiem." },
  { id: "ranunkuli", name: "Ranunkuli", category: "pukes", difficulty: 2, daysToHarvest: "Zied vasarā", sun: "Saule", sowOutdoors: [4, 5], harvest: [6, 7], note: "Gumus pirms stādīšanas izmērcē. Rudenī izrok un glabā vēsumā." },
  { id: "verbena", name: "Verbēna", category: "pukes", difficulty: 2, daysToHarvest: "Zied visu vasaru", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [6, 9], note: "Zied nenogurstoši līdz salnām. Audzē kā viengadīgu." },
  { id: "dalijas", name: "Dālijas", category: "pukes", difficulty: 2, daysToHarvest: "Zied līdz salnām", sun: "Saule", sowOutdoors: [5, 6], harvest: [7, 10], note: "Gumus stāda pēc salnām; rudenī izrok un glabā vēsumā." },
  { id: "gladiolas", name: "Gladiolas", category: "pukes", difficulty: 2, daysToHarvest: "Zied vasaras otrā pusē", sun: "Saule", sowOutdoors: [5, 5], harvest: [7, 9], note: "Bumbuļsīpolus stāda maijā, rudenī izrok. Griezto ziedu klasika." },
  { id: "lilijas", name: "Lilijas", category: "pukes", difficulty: 2, daysToHarvest: "Daudzgadīga", sun: "Saule / pussēna", sowOutdoors: [9, 10], harvest: [6, 8], note: "Ziemcietīgas — neizrok. Āzijas hibrīdi Latvijā visdrošākie." },
  { id: "rozes", name: "Rozes", category: "pukes", difficulty: 3, daysToHarvest: "Daudzgadīga", sun: "Saule", transplant: [4, 5], harvest: [6, 10], note: "Stādot potcelma vietu 5–10 cm zem augsnes; ziemai apkrauj." },
  { id: "krokusi", name: "Krokusi", category: "pukes", difficulty: 1, daysToHarvest: "Zied agri pavasarī", sun: "Saule", sowOutdoors: [9, 10], harvest: [3, 4], note: "Pirmie pavasara ziedi. Naturalizējas zālienā — neizrok." },
  { id: "hiacintes", name: "Hiacintes", category: "pukes", difficulty: 1, daysToHarvest: "Zied pavasarī", sun: "Saule", sowOutdoors: [9, 10], harvest: [4, 5], note: "Stāda rudenī ~15 cm dziļi. Smaržo visa dobe." },
  { id: "floksi", name: "Flokši", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Saule / pussēna", transplant: [4, 5], harvest: [7, 9], note: "Vecmāmiņu dārzu klasika. Retināts stādījums pasargā no miltrasas." },
  { id: "rudbekijas", name: "Rudbekijas", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [7, 10], note: "«Zelta lodes» pie lauku mājām — zied līdz pat oktobrim." },
  { id: "hostas", name: "Hostas", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Pussēna", transplant: [4, 5], harvest: [7, 8], note: "Ēnas karaliene ar krāšņām lapām. Galvenais ienaidnieks — gliemeži." },
  { id: "lavanda", name: "Lavanda", category: "pukes", difficulty: 3, daysToHarvest: "Daudzgadīga", sun: "Saule", sowIndoors: [2, 3], transplant: [5, 6], harvest: [7, 8], note: "Tikai šaurlapu lavanda ziemo Latvijā — saulē, sausā augsnē, ar segumu." },
  { id: "astilbes", name: "Astilbes", category: "pukes", difficulty: 1, daysToHarvest: "Daudzgadīga", sun: "Pussēna", transplant: [4, 5], harvest: [6, 8], note: "Pussēnai un mitrākai vietai — nekad neļauj izžūt." },
  { id: "atraitnites", name: "Atraitnītes", category: "pukes", difficulty: 1, daysToHarvest: "Zied no agra pavasara", sun: "Saule / pussēna", sowIndoors: [2, 3], transplant: [4, 5], harvest: [4, 10], note: "Pacieš pavasara salnas — var stādīt agri. Balkona klasika." },
  { id: "hortenzijas", name: "Hortenzijas", category: "pukes", difficulty: 2, daysToHarvest: "Daudzgadīga", sun: "Saule / pussēna", transplant: [5, 6], harvest: [7, 9], note: "Skarainā un koka hortenzija ziemcietīgas; liellapu var apsalt pumpurus. Mīl mitru, skābāku augsni." },
  { id: "klematis", name: "Klematis", category: "pukes", difficulty: 2, daysToHarvest: "Daudzgadīga", sun: "Saule", transplant: [5, 6], harvest: [6, 9], note: "Vītenis ar atbalstu: «galva saulē, kājas ēnā». Potcelmu iedziļina ~8–10 cm." },
  { id: "krizantemas", name: "Krizantēmas", category: "pukes", difficulty: 2, daysToHarvest: "Zied rudenī", sun: "Saule", transplant: [5, 6], harvest: [9, 10], note: "Rudens un kapu puķe. Dārza šķirnes ziemo ar segumu; podu krizantēmas parasti nē." },
  { id: "asteres", name: "Asteres", category: "pukes", difficulty: 1, daysToHarvest: "Zied rudenī", sun: "Saule", sowIndoors: [3, 4], transplant: [5, 6], harvest: [8, 10], note: "Viengadīgās sēj no sēklām; maina vietu katru gadu (fuzarioze)." },
  { id: "magnolijas", name: "Magnolijas", category: "pukes", difficulty: 3, daysToHarvest: "Daudzgadīga", sun: "Saule", transplant: [4, 5], harvest: [5, 5], note: "Izturīgākās — zvaigžņu un Loebnera magnolija. Aizsargātā vietā bez rīta saules pumpuriem." },
  { id: "neaizmirstules", name: "Neaizmirstulītes", category: "pukes", difficulty: 1, daysToHarvest: "Zied pavasarī", sun: "Saule / pussēna", sowOutdoors: [6, 7], harvest: [5, 6], note: "Divgadīga — sēj vasarā, zied nākampavasar. Pašizsējas un atgriežas." },
];

export const MONTHS_LV = [
  "Jan", "Feb", "Mar", "Apr", "Mai", "Jūn",
  "Jūl", "Aug", "Sep", "Okt", "Nov", "Dec",
];

export const MONTHS_LV_FULL = [
  "janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs",
  "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris",
];

/** Genitive month forms ("jūnija") for "{year}. gada {month}" and
 *  "{month} kalendārs" — nominative ("jūnijs") is ungrammatical there. */
export const MONTHS_LV_GENITIVE = [
  "janvāra", "februāra", "marta", "aprīļa", "maija", "jūnija",
  "jūlija", "augusta", "septembra", "oktobra", "novembra", "decembra",
];

export const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Viegli",
  2: "Vidēji",
  3: "Grūtāk",
};

export const ACTIVITY_KEYS = [
  "sowIndoors",
  "sowOutdoors",
  "transplant",
  "harvest",
] as const;

export type ActivityKey = (typeof ACTIVITY_KEYS)[number];

export const ACTIVITY_META: Record<
  ActivityKey,
  { label: string; short: string; color: string }
> = {
  sowIndoors: { label: "Sēt telpās", short: "Telpās", color: "#C9A227" },
  sowOutdoors: { label: "Sēt laukā", short: "Sēt", color: "#1F3A2D" },
  transplant: { label: "Stādīt laukā", short: "Stādīt", color: "#3E7CB1" },
  harvest: { label: "Novākt", short: "Raža", color: "#B85C38" },
};

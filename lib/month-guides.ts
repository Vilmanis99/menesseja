import { SEEDLING_CALCULATOR_HREF } from "./seedling-sowing";

export interface MonthGuide {
  title?: string;
  description: string;
  shortAnswer: string;
  checklistTitle: string;
  priorityCropIds: string[];
  cropNotes: Record<string, string>;
  checklist: { title: string; text: string; icon: string; link?: { label: string; href: string } }[];
  relatedLinks: { label: string; href: string }[];
  sources: { label: string; url: string }[];
  updatedAt: string;
}

/**
 * Redakcionāli pārbaudīts papildinājums mēneša datu sarakstam.
 * Kalendāra intervāli rāda plašu iespēju logu, bet šeit izskaidrojam
 * šķirnes, karstuma un atlikušās sezonas nianses.
 */
export const MONTH_GUIDES: Partial<Record<number, MonthGuide>> = {
  1: {
    description: "Janvārī pārbaudi sēklu dīgtspēju un saplāno dobes. Noskaidro, kad sākt dēstus telpās un kā novērtēt, vai tiem pietiks gaismas.",
    shortAnswer: "Janvārī Latvijas dobēs parasti nesēj. Pārskati atlikušās sēklas, pārbaudi vecāko paciņu dīgtspēju un uzzīmē dobju plānu. Dēstu sējas datumus rēķini no paredzētās izstādīšanas, nevis sāc visu uzreiz. Agrīna sēja ir lietderīga tikai tad, ja vari nodrošināt konkrētajam augam vajadzīgo gaismu un temperatūru.",
    checklistTitle: "Sagatavo sezonu bez steigas",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      {
        title: "Pārskati sēklas", icon: "inventory_2",
        text: "Pieraksti augu, šķirni un atlikumu. Pirms jauna pirkuma pārbaudi šaubīgo sēklu dīgtspēju.",
        link: { label: "Pierakstīt sēklu dīgtspējas pārbaudi", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju#mana-seklu-digtspejas-parbaude" },
      },
      {
        title: "Uzzīmē dobes", icon: "grid_on",
        text: "Atzīmē iepriekšējo sezonu stādījumus un vietas, kur pietiek saules un ir pieejams ūdens.",
        link: { label: "Izkārtot augus dobju plānotājā", href: "/planotajs" },
      },
      { title: "Pārbaudi glabātavu", text: "Apskati glabāto ražu un dāliju bumbuļus. Bojātos izņem un noskaidro mitruma vai temperatūras cēloni.", icon: "thermostat" },
    ],
    relatedLinks: [
      { label: "Kā izvēlēties sēklas savam dārzam", href: "/raksti/ka-izveleties-seklas-darzam" },
      { label: "Kad sēt dēstus: rēķini atpakaļ", href: "/raksti/kad-set-destus-rekini-atpakal" },
    ],
    sources: [
      { label: "RHS — ziemas darbi un augu maiņas plānošana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/january-jobs" },
      { label: "University of Minnesota Extension — sezonas un šķirņu plānošana", url: "https://extension.umn.edu/about/our-stories/news/garden-planning-in-the-new-year" },
    ], updatedAt: "2026-11-19",
  },
  2: {
    description: "Februārī telpās vari sēt papriku un selerijas. Sējas laiku izvēlies pēc šķirnes, pieejamās gaismas un plānotās izstādīšanas.",
    shortAnswer: "Februārī vari sākt paprikas un seleriju dēstus, ja izvēlētās šķirnes audzēšanas ilgums un izstādīšanas plāns to prasa. Uz tumšas palodzes nesteidzies ar tomātiem un gurķiem. Vispirms sagatavo tīrus sēšanas traukus, substrātu un gaismu; ārā nesēj sasalušā vai pārmitrā augsnē.",
    checklistTitle: "Pirms pirmās dēstu sējas",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      {
        title: "Aprēķini sējas laiku", icon: "schedule",
        text: "No sējas līdz izstādīšanai paprikai rēķini aptuveni 8–10 nedēļas, kātu un sakņu selerijām 10–12 nedēļas. Dīgšana šajā laikā jau ietilpst. Pārbaudi arī šķirnes norādes.",
        link: { label: "Atvērt sējas kalkulatoru", href: SEEDLING_CALCULATOR_HREF },
      },
      {
        title: "Novērtē gaismu", icon: "light_mode",
        text: "Siltumā ar nepietiekamu gaismu dēsti izstīdz. Ja februārī sēj nokarenās petūnijas agrīnai ziedēšanai, jau iepriekš sagatavo gaišu vietu dēstiem.",
        link: { label: "Petūniju sēklas un jaunstādi", href: "/pukes/petunijas#augu-atskiribas" },
      },
      { title: "Sagatavo traukus", text: "Iztīri atkārtoti lietojamos podus un pārliecinies, ka tiem ir drenāžas atveres un paliktnis.", icon: "potted_plant" },
    ],
    relatedLinks: [
      { label: "Dēstu audzēšana uz palodzes", href: "/raksti/destu-audzesana-uz-palodzes" },
      { label: "Kāpēc dēsti izstīdz", href: "/raksti/desti-izstidz" },
      { label: "Kā izvēlēties sēklas", href: "/raksti/ka-izveleties-seklas-darzam" },
    ],
    sources: [
      { label: "University of Minnesota Extension — dēstu sākšana telpās", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/starting-seeds-indoors" },
      { label: "Merilendas Universitāte — dēstu sējas laiks pirms izstādīšanas", url: "https://extension.umd.edu/resource/starting-vegetable-seeds-indoors" },
      { label: "Kentuki Universitāte — kātu un sakņu seleriju audzēšana", url: "https://ccd.uky.edu/sites/default/files/2024-11/ccd-cp-092_celery-and-celeriac.pdf" },
      { label: "RHS — sējas sagatavošana ziemas beigās", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/february-jobs" },
    ], updatedAt: "2026-11-18",
  },
  3: {
    description: "Martā sēj tomātus dēstiem un sagatavo siltumnīcu. Pārbaudi, kad augsne dobēs ir pietiekami apžuvusi pirmajiem darbiem.",
    shortAnswer: "Martā sēj tomātus un citus dēstus atbilstoši šķirnei un paredzētajai izstādīšanas vietai. Sagatavo siltumnīcu un seko dēstu gaismai un mitrumam. Dārza dobes apstrādā tikai tad, kad augsne ir atkususi un nav pārmitra; mēneša nosaukums pats par sevi vēl nenozīmē, ka var sēt laukā.",
    checklistTitle: "Sēja un siltumnīcas sagatavošana",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Marķē sējumus", text: "Pie katra trauka atzīmē šķirni un sējas datumu. Sēj tik daudz, cik vēlāk varēsi pārstādīt.", icon: "label" },
      { title: "Vēro dēstus", text: "Pārbaudi substrāta mitrumu un gaismu. Ūdens paliktnī nav iemesls turēt saknes pastāvīgi slapjas.", icon: "water_drop" },
      { title: "Iztīri siltumnīcu", text: "Iznes veco augu atliekas, notīri segumu un pārbaudi, vai darbojas durvis un vēdināšanas logi.", icon: "cleaning_services" },
    ],
    relatedLinks: [
      { label: "Siltumnīcas sagatavošana sezonai", href: "/raksti/siltumnicas-sagatavosana-sezonai" },
      { label: "Ko darīt ar pārlaistītiem dēstiem", href: "/raksti/parlaisti-desti" },
      { label: "Sēklu glabāšana un dīgtspēja", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju" },
    ],
    sources: [
      { label: "RHS — sēja telpās un dobju sagatavošana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/march-jobs" },
      { label: "RHS — siltumnīcas tīrīšana", url: "https://www.rhs.org.uk/garden-features/cleaning-greenhouses" },
    ], updatedAt: "2026-10-06",
  },
  4: {
    description: "Aprīlī dobēs var sēt zirņus, redīsus, burkānus un salātus, kad zeme atkususi un apžuvusi. Skaties, kurus dēstus vēl paturēt telpās.",
    shortAnswer: "Aprīlī atkususi, pietiekami iesilusi un apstrādājama augsne ļauj sākt aukstumizturīgo kultūru sēju: zirņus, redīsus, burkānus un salātus. Termiņi piekrastē un Latvijas iekšzemē atšķiras. Siltummīļus vēl audzē aizsargātos apstākļos, bet esošos dēstus vajadzības gadījumā pārstādi lielākos traukos.",
    checklistTitle: "Pirmās sējas laukā",
    priorityCropIds: ["zirni", "rediisi", "burkani", "salati"],
    cropNotes: { zirni: "Sēj sagatavotā, ne pārmitrā dobē; balstus ieplāno jau pirms sadīgšanas.", rediisi: "Sēj nelielu rindiņu un uzturi vienmērīgu mitrumu.", burkani: "Sagatavo irdenu virskārtu un neļauj tai izkalst, kamēr sēklas dīgst.", salati: "Sēj pakāpeniski; lielu vienlaicīgu ražu būs grūtāk izmantot." },
    checklist: [
      { title: "Pārbaudi augsni", text: "Ja zeme ir sasalusi vai pielīp instrumentam slapjos pikučos, atliek sēju un intensīvu apstrādi.", icon: "thermostat" },
      { title: "Sēj pakāpeniski", text: "Izvēlies kultūrai piemērotu sējas dziļumu un atstarpes. Neizsēj visu paciņu vienā reizē.", icon: "grass" },
      { title: "Seko salnām", text: "Sagatavo segumu jutīgiem dēstiem, bet neatstāj tos pārkarst zem seguma saulainā dienā.", icon: "cloud" },
    ],
    relatedLinks: [
      { label: "Augsnes temperatūra un sēja", href: "/raksti/augsnes-temperatura" },
      { label: "Salnas Latvijā", href: "/raksti/salnas-latvija" },
      { label: "Rožu apgriešana pavasarī", href: "/raksti/ka-apgriezt-rozes-pavasari" },
    ],
    sources: [
      { label: "RHS — pavasara sēja un dēstu pārstādīšana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/april-jobs" },
      { label: "University of Minnesota Extension — vēsās sezonas kultūras", url: "https://extension.umn.edu/planting-and-growing-guides/non-pest-issues-cool-season-crops" },
    ], updatedAt: "2026-10-06",
  },
  5: {
    title: "Ko sēt maijā Latvijā un kad izstādīt dēstus",
    description: "Ko maijā sēt tieši dobē un ko audzēt podiņos? Augsnes siltums biešu sējai, nakts temperatūra gurķiem siltumnīcā un dēstu sagatavošana āra dobei.",
    shortAnswer: "Maijā burkānus un zirņus vari sēt tieši dobē, tiklīdz zeme ir apžuvusi un viegli irdināma. Bietēm vajag siltāku augsni. Tomātus un kabačus, kas auguši telpās, pakāpeniski pieradini pie āra apstākļiem un izstādi, kad zeme iesilusi un vietējā prognoze vairs nesola salnas.",
    checklistTitle: "Ko sēt dobē, ko podiņā un kad stādīt siltumnīcā?",
    priorityCropIds: ["burkani", "zirni", "bietes", "dilles"],
    cropNotes: { bietes: "Vēlāk izretini sadīgušās bietes, ievērojot uz sēklu paciņas norādīto attālumu.", dilles: "Sēj nelielās porcijās, lai svaigi zaļumi būtu ilgāk.", pupas: "Aukstā un pārmitrā augsnē sēklu bojāšanās risks ir lielāks. Ja audzē pākšu pupiņas, pagaidi, līdz augsne iesilusi un salnu draudi pārgājuši." },
    checklist: [
      {
        title: "Bietes atklātā dobē",
        text: "Pārbaudi augsni sējas dziļumā. Dārzkopības institūts galda bietēm iesaka sagaidīt 8–10 °C siltu augsni. Biešu dīgsti ir jutīgi pret salnām.",
        icon: "grass",
        link: { label: "Kā sēt bietes", href: "/augi/bietes" },
      },
      {
        title: "Lauka gurķi podiņos",
        text: "Ja līdz plānotajai izstādīšanai atlikušas apmēram divas nedēļas, sēj katru gurķi atsevišķā podiņā. Tā vēlāk varēsi pārcelt visu sakņu kamolu.",
        icon: "potted_plant",
        link: { label: "Aprēķini sējas laiku", href: SEEDLING_CALCULATOR_HREF },
      },
      {
        title: "Gurķi neapkurinātā siltumnīcā",
        text: "Ar minimālās temperatūras termometru pārbaudi, cik vēss siltumnīcā kļūst naktī. Gurķu dēstus stādi pastāvīgajā vietā, kad temperatūra arī naktī turas virs 12 °C.",
        icon: "thermostat",
        link: { label: "Gurķu audzēšana", href: "/augi/gurki" },
      },
    ],
    relatedLinks: [
      { label: "Kā norūdīt dēstus", href: "/raksti/ka-rudit-destus" },
      { label: "Kad dēstus stādīt laukā", href: "/raksti/kad-stadit-destus-lauka" },
      { label: "Balkona dārzs iesācējam", href: "/raksti/balkona-darzs-iesacejam" },
    ],
    sources: [
      { label: "Dārzkopības institūts — burkānu, zirņu un biešu sēja", url: "https://www.darzkopibasinstituts.lv/lv/raksts/2020-04-06/stastam-par-aprili-daramajiem-darbiem-un-darzenu-sesanu" },
      { label: "Zemkopības ministrija — lauka gurķu sēja un dēstu audzēšana (PDF, 9.–10. lpp.)", url: "https://www.zm.gov.lv/lv/media/765/download?attachment=#page=9" },
      { label: "RHS — gurķu sēja podiņos un temperatūra siltumnīcā", url: "https://www.rhs.org.uk/vegetables/cucumbers/grow-your-own" },
      { label: "RHS — norūdīšana un izstādīšana pēc salnām", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/may-jobs" },
    ], updatedAt: "2026-11-18",
  },
  6: {
    title: "Ko sēt jūnijā Latvijā un ko stādīt pēc salnām",
    description: "Ko jūnijā iesēt pēc redīsu novākšanas un kad dobē izstādīt lauka gurķus vai kabačus? Praktiski orientieri sējai, dēstiem un nākamajai salātu ražai.",
    shortAnswer: "Jūnijā pēc redīsu novākšanas vari sēt lapu salātus vai agrīnus burkānus. Lauka gurķu, kabaču un tomātu dēstus izstādi, kad augsne iesilusi un salnu draudi tavā dārzā pārgājuši. Aukstums Latvijā iespējams arī mēneša sākumā. Piemēram, 2023. gada 2. jūnijā Stendē reģistrēja −2,4 °C.",
    checklistTitle: "Ko darīt ar gurķu sēklām, gataviem dēstiem un brīvu dobi?",
    priorityCropIds: ["salati", "burkani", "dilles", "pupas"],
    cropNotes: { pupas: "Vīteņšķirnēm pirms sējas ierīko stabilus balstus.", dilles: "Sēj atkārtoti nelielās porcijās un uzturi mitru sējas virskārtu.", salati: "Karstā vietā izvēlies vasarai piemērotu šķirni un nelielu sējumu." },
    checklist: [
      {
        title: "Man ir lauka gurķu sēklas",
        text: "Kad salnu risks pārgājis, izmēri augsnes temperatūru 2–3 cm dziļumā, kur sēsi gurķus. Virs 15 °C sēklas var sākt dīgt. Visstraujāk tās sadīgst 22–25 °C siltā augsnē.",
        icon: "thermostat",
        link: { label: "Kā sēt lauka gurķus", href: "/augi/gurki" },
      },
      {
        title: "Man ir gurķu vai kabaču dēsti",
        text: "Ja dēsti auguši telpās, vispirms pakāpeniski pieradini tos pie saules un vēja. Iesilušā dobē pārstādi ar visu sakņu kamolu un aplaisti. Ja atkal sola salnu, podiņus uz nakti ienes telpās.",
        icon: "potted_plant",
        link: { label: "Kad izstādīt dēstus laukā", href: "/raksti/kad-stadit-destus-lauka" },
      },
      {
        title: "Dobē novākti pirmie redīsi",
        text: "Iesēj īsu lapu salātu rindu un atstāj vietu nākamajai. Kad pirmajam sējumam izaugušas aptuveni četras īstās lapas, sēj nākamo rindu. Tā varēsi vākt svaigas lapas pakāpeniski.",
        icon: "grass",
        link: { label: "Salātu šķirnes un kopšana", href: "/augi/salati" },
      },
    ],
    relatedLinks: [
      { label: "Kā laistīt dārzu karstumā", href: "/raksti/ka-laistit-darzu-karstuma" },
      { label: "Tomātu veidošana", href: "/raksti/tomatu-veidosana" },
      { label: "Salnu risks Latvijas dārzos", href: "/raksti/salnas-latvija" },
    ],
    sources: [
      { label: "LVĢMC — 2023. gada jūnija sākuma salnas Latvijā", url: "https://klimats.meteo.lv/operativais_klimats/laikapstaklu_apskati/2023/junijs/" },
      { label: "Zemkopības ministrija — lauka gurķu sēja un dēstu izstādīšana (PDF, 9.–10. lpp.)", url: "https://www.zm.gov.lv/lv/media/765/download?attachment=#page=9" },
      { label: "RHS — salātu un citu dārzeņu atkārtota sēja", url: "https://www.rhs.org.uk/vegetables/successional-sowing" },
      { label: "RHS — vasaras sēja un augu balsti", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/june-jobs" },
    ], updatedAt: "2026-11-18",
  },
  7: {
    title: "Ko vēl sēt jūlijā otrajai ražai Latvijā",
    description: "Ko jūlijā vēl paspēt iesēt rudens ražai: Ķīnas kāposti, kolrābji, rāceņi, dilles, redīsi un salāti ar svarīgām karstuma niansēm.",
    checklistTitle: "Trīs noteikumi otrajai ražai",
    shortAnswer:
      "Jūlijā vēl vari sēt Ķīnas kāpostus, kolrābjus, rāceņus, dilles un koriandru rudens ražai. Redīsus un lapu salātus sēj mazās porcijās, izvēloties vasarai piemērotu šķirni un vietu ar vieglu pēcpusdienas ēnu. Spinātus karstā laikā labāk atstāt jūlija beigām vai augusta sākumam, jo garā diena un sausums veicina izziedēšanu.",
    priorityCropIds: ["kinas-kaposti", "kolrabji", "raceni", "dilles", "koriandrs", "rediisi", "salati"],
    cropNotes: {
      "kinas-kaposti": "Sēj tieši dobē rudens ražai; uzturi vienmērīgu mitrumu.",
      kolrabji: "Ātra šķirne vēl paspēj izveidot sulīgu rudens bumbuli.",
      raceni: "Sēj rudens ražai; pēc sadīgšanas noteikti izretini.",
      dilles: "Sēj nelielu rindiņu, nevis visu paciņu uzreiz.",
      koriandrs: "Karstumā izvēlies pussēnu un neļauj augsnei izžūt.",
      rediisi: "Vasaras šķirni sēj mazā porcijā; karstumā dod vieglu ēnu.",
      salati: "Izvēlies lapu vai karstumizturīgu šķirni un sēj atkārtoti.",
      spinati: "Drošāk sēt jūlija beigās vai augustā, kad naktis kļūst vēsākas.",
      neaizmirstules: "Sēj tagad, lai izveidotu rozeti nākamā pavasara ziedēšanai.",
    },
    checklist: [
      {
        title: "Izvēlies īsu ražas laiku",
        text: "Salīdzini uz paciņas norādītās dienas līdz ražai ar sava reģiona pirmās salnas laiku.",
        icon: "schedule",
      },
      {
        title: "Atjauno atbrīvoto dobi",
        text: "Novāc iepriekšējā auga atliekas, uzirdini augsni un pirms sējas to vienmērīgi samitrini.",
        icon: "compost",
      },
      {
        title: "Sargā dīgstus no karstuma",
        text: "Sēj vakarā, sausumā pārbaudi virskārtu katru dienu un vajadzības gadījumā dod vieglu noēnojumu.",
        icon: "water_drop",
      },
    ],
    relatedLinks: [
      { label: "Plašāks ceļvedis jūlijam un augustam", href: "/raksti/ko-set-julija-augusta" },
      { label: "Visi dārza darbi jūlijā", href: "/raksti/darza-darbi-julija" },
      { label: "Kad Latvijā sākas rudens salnas", href: "/raksti/salnas-latvija" },
    ],
    sources: [
      {
        label: "Dārzkopības institūts — dārzeņu audzēšanas rokasgrāmata",
        url: "https://www.darzkopibasinstituts.lv/sites/dobele/files/files/articles/RokasgramataDarzi2018_lv.pdf",
      },
      {
        label: "University of Minnesota Extension — dārzeņi rudens ražai",
        url: "https://extension.umn.edu/planting-and-growing-guides/planting-vegetables-midsummer-fall-harvest",
      },
      {
        label: "University of Minnesota Extension — vēsās sezonas dārzeņi",
        url: "https://extension.umn.edu/planting-and-growing-guides/non-pest-issues-cool-season-crops",
      },
    ],
    updatedAt: "2026-07-14",
  },
  8: {
    description: "Augustā pēc agrās ražas dobē vēl var sēt redīsus, spinātus un salātus. Izvēlies īsa augšanas laika šķirni un pieskati mitrumu.",
    shortAnswer: "Augustā novāc ražu un brīvajās dobēs izvēlies īsu augšanas laiku: redīsus, salātus, dilles vai spinātus, kad karstums mazinājies. Sējas iespējas sarūk līdz ar īsāku dienu un rudens salnu tuvošanos. Ja stādi zemenes vai dali peonijas, atstāj tām laiku iesakņoties un seko mitrumam.",
    checklistTitle: "Raža un nākamie stādījumi",
    priorityCropIds: ["spinati", "rediisi", "salati", "dilles"],
    cropNotes: { spinati: "Vēsākā laikā sēj rudens ražai; pārbaudi šķirnes termiņus.", rediisi: "Izvēlies ātru šķirni un uzturi mitru augsni, īpaši pēc sausas vasaras.", salati: "Sēj nelielu apjomu un rēķinies ar lēnāku augšanu sezonas beigās.", dilles: "Izmanto ātras šķirnes zaļumiem un salīdzini ražas laiku ar atlikušās sezonas garumu." },
    checklist: [
      { title: "Novāc īstajā laikā", text: "Ražu glabāšanai atlasi bez puves un bojājumiem. Neber slimos augļus kopā ar veselajiem.", icon: "agriculture" },
      { title: "Aprēķini atlikušo sezonu", text: "Uz paciņas norādītais laiks līdz ražai ir orientieris; vēsumā un īsākā dienā augšana palēninās.", icon: "schedule" },
      { title: "Ieplāno stādījumus", text: "Zemenēm un ziemcietēm izvēlies piemērotu vietu. Jaunajiem stādījumiem sausumā vajadzīga uzmanība.", icon: "yard" },
    ],
    relatedLinks: [
      { label: "Visi dārza darbi augustā", href: "/raksti/darza-darbi-augusta" },
      { label: "Zemeņu stādīšana", href: "/raksti/zemenu-stadisana-augusta" },
      { label: "Kad pārstādīt peonijas", href: "/raksti/kad-parstadit-peonijas" },
    ],
    sources: [
      { label: "RHS — vasaras beigu stādījumi un ražas kopšana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/august-jobs" },
      { label: "University of Minnesota Extension — sēja rudens ražai", url: "https://extension.umn.edu/planting-and-growing-guides/planting-vegetables-midsummer-fall-harvest" },
    ], updatedAt: "2026-10-06",
  },
  9: {
    description: "Septembrī atlasi dārzeņus glabāšanai un plāno sīpolpuķu stādīšanu. Noskaidro, ko vēl var iesēt atbrīvotajās dobēs.",
    shortAnswer: "Septembrī galvenie darbi ir ražas novākšana, atlase glabāšanai un tukšo dobju sagatavošana. Sīpolpuķes stādi pēc konkrētās sugas ieteikumiem; tulpēm nesteidzies, ja augsne vēl silta. Vēlu sējot zaļmēslojumu vai lapu kultūras, ņem vērā, vai tās paspēs ieaugt līdz aukstumam.",
    checklistTitle: "Sagatavo dārzu rudenim",
    priorityCropIds: ["narcises", "krokusi", "hiacintes"],
    cropNotes: { tulpes: "Stādi, kad augsne atdzisusi, bet vēl nav sasalusi; siltā rudenī termiņš var pārcelties uz oktobri.", narcises: "Sīpolus stādi piemērotā, ūdeni caurlaidīgā vietā atbilstoši sugas un šķirnes prasībām.", krokusi: "Izvēlies vietu bez ilgstoši stāvoša ūdens un marķē stādījumu." },
    checklist: [
      { title: "Atlasi ražu", text: "Glabāšanai atstāj veselus, nebojātus dārzeņus. Bojājumus un puvi izvērtē jau novākšanas brīdī.", icon: "inventory_2" },
      { title: "Nosedz brīvās dobes", text: "Izvēlies augsnes segumu vai vēl piemērotu zaļmēslojumu. Nesēj tikai tāpēc, ka dobe ir tukša.", icon: "compost" },
      { title: "Seko laikapstākļiem", text: "Siltummīļu pēdējo ražu un izrakšanu plāno pēc vietējās salnu prognozes, ne vienas valsts mēroga dienas.", icon: "cloud" },
    ],
    relatedLinks: [
      { label: "Tulpju stādīšana rudenī", href: "/raksti/tulpju-stadisana-rudeni" },
      { label: "Zaļmēslojums pēc ražas", href: "/raksti/baltas-sinepes-pec-razas" },
      { label: "Kad novākt sīpolus", href: "/raksti/kad-novakt-sipolus" },
    ],
    sources: [
      { label: "RHS — rudens raža un augsnes aizsardzība", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/september-jobs" },
      { label: "University of Minnesota Extension — ziemcietīgo sīpolpuķu stādīšana", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/planting-bulbs-tubers-and-rhizomes" },
    ], updatedAt: "2026-10-06",
  },
  10: {
    description: "Oktobrī atdzisušā, nesasalušā augsnē stādi ziemas ķiplokus un tulpes. Apskati arī dāliju izrakšanas un siltumnīcas sakopšanas darbus.",
    shortAnswer: "Oktobrī atdzisušā, vēl nesasalušā augsnē stādi ziemas ķiplokus un tulpes, ja vieta nav pārmitra. Dālijas izroc pirms augsnes sasalšanas un sagatavo glabāšanai. Pēc vasaras kultūru novākšanas iztīri siltumnīcu, bet tukšās dobes pasargā ar piemērotu segumu.",
    checklistTitle: "Stādīšana un glabāšana pirms ziemas",
    priorityCropIds: ["kiploki", "tulpes"],
    cropNotes: { kiploki: "Izvēlies veselīgu stādmateriālu un vietu bez stāvoša ūdens; pirms ziemas daivām jāiesakņojas.", tulpes: "Stādi atdzisušā augsnē un ievēro sīpola izmēram atbilstošu dziļumu.", lilijas: "Pārbaudi konkrētās lilijas audzēšanas prasības un izvairies no pārmitras vietas." },
    checklist: [
      { title: "Stādi piemērotā augsnē", text: "Sīpolus un daivas neiespiež sasalušā vai piemirkušā zemē. Darba laiku pielāgo rudens gaitai.", icon: "grass" },
      { title: "Sagatavo glabātavu", text: "Dāliju bumbuļiem vajag vēsu vietu bez sala. Vispirms pārbaudi telpas temperatūru un mitrumu.", icon: "thermostat" },
      { title: "Sakop siltumnīcu", text: "Iznes atliekas un notīri segumu. Pārbaudi bojājumus un konstrukcijas norādes par ziemas slodzi.", icon: "cleaning_services" },
    ],
    relatedLinks: [
      { label: "Kad izrakt un kā glabāt dālijas", href: "/raksti/ka-glabat-dalijas-ziema" },
      { label: "Tulpju stādīšana", href: "/raksti/tulpju-stadisana-rudeni" },
      { label: "Siltumnīcas sagatavošana sezonai", href: "/raksti/siltumnicas-sagatavosana-sezonai" },
    ],
    sources: [
      { label: "RHS — ķiploku stādīšana un rudens sakopšana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/october-jobs" },
      { label: "RHS — dāliju pārziemināšana", url: "https://www.rhs.org.uk/plants/dahlia/growing-guide/" },
    ], updatedAt: "2026-10-06",
  },
  11: {
    description: "Novembrī pārbaudi pagrabā glabātās saknes un bumbuļus. Ja novāc kāpostus skābēšanai, izvēlies sākuma laiku pēc ražas stāvokļa.",
    shortAnswer: "Novembrī pārbaudi glabāto ražu un gatavo dārzu ziemai. Ja novāc kāpostus skābēšanai, sāc 24–48 stundas pēc novākšanas, kamēr galviņas ir svaigas un stingras. Mēness fāzi vari izvēlēties pēc ģimenes tradīcijas. Jutīgo augu aizsardzību pielāgo sugai un laika prognozei. Nožāvē instrumentus un pārskati sēklas, kamēr dobes ir sasalušas vai pārmitras.",
    checklistTitle: "Pārziemošana un inventāra kopšana",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Vēro glabāto ražu", text: "Regulāri izņem bojātos dārzeņus un bumbuļus. Pārbaudi, vai telpā nekrājas mitrums un nav sala.", icon: "thermostat" },
      { title: "Sakop instrumentus", text: "Notīri zemi, nožāvē metālu un rokturus un glabā zem jumta. Bojātos instrumentus salabo laikus.", icon: "build" },
      { title: "Noskaidro auga prasības", text: "Segums dobē un glabāšana bez sala ir atšķirīgas lietas. Izvēlies metodi konkrētajam augam.", icon: "yard" },
    ],
    relatedLinks: [
      { label: "Dāliju glabāšana ziemā", href: "/raksti/ka-glabat-dalijas-ziema" },
      { label: "Sēklu glabāšana", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju" },
      { label: "Lapas un komposts", href: "/raksti/komposts-ka-sakt" },
    ],
    sources: [
      { label: "RHS — rudens beigu darbi un glabātās ražas pārbaude", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/november-jobs" },
      { label: "RHS — dārza instrumentu tīrīšana un glabāšana", url: "https://www.rhs.org.uk/garden-jobs/cleaning-tools" },
      { label: "NCHFP — svaigu kāpostu izvēle un skābēšanas laiks", url: "https://nchfp.uga.edu/how/ferment/recipes/sauerkraut/" },
    ], updatedAt: "2026-11-18",
  },
  12: {
    description: "Decembrī pārskati sēklu krājumus un sagatavo nākamās sezonas sējas plānu. Pārbaudi, kā glabājas dālijas un citi dārza krājumi.",
    shortAnswer: "Decembrī plāno nākamo sezonu: atzīmē, kas izdevās, izvēlies audzēšanas vietai piemērotas šķirnes un pārskati esošos piederumus. Turpini pārbaudīt sēklas un glabātos dāliju bumbuļus. Sēju telpās sāc tikai tad, ja vari nodrošināt konkrētā auga prasības; agrāks datums pats par sevi negarantē labāku rezultātu.",
    checklistTitle: "Nākamās sezonas plāns",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Pieraksti pieredzi", text: "Atzīmē ražu, kopšanas grūtības un šķirnes. Nākamās sezonas izvēles balsti savā audzēšanas vietā.", icon: "edit_note" },
      {
        title: "Izveido īsu sarakstu", text: "Pārskati sēklu krājumus un pieraksti trūkstošās šķirnes. Ja šaubies par vecas paciņas dīgtspēju, sāc ar nelielu saskaitītu paraugu.", icon: "checklist",
        link: { label: "Sākt sēklu dīgtspējas pārbaudi", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju#mana-seklu-digtspejas-parbaude" },
      },
      { title: "Pārbaudi glabāšanu", text: "Sēklu paciņas turi sausas un marķētas. Bumbuļu glabātavai vajag stabilu vēsumu bez sasalšanas.", icon: "inventory_2" },
    ],
    relatedLinks: [
      { label: "Kā izvēlēties sēklas dārzam", href: "/raksti/ka-izveleties-seklas-darzam" },
      { label: "Augu maiņas plāns", href: "/raksti/augu-maina-darza" },
      { label: "Pirmā dārza plānošana", href: "/raksti/darza-planosana-iesacejam" },
    ],
    sources: [
      { label: "University of Minnesota Extension — nākamās sezonas plānošana", url: "https://extension.umn.edu/about/our-stories/news/garden-planning-in-the-new-year" },
      { label: "RHS — sēklu glabāšana", url: "https://www.rhs.org.uk/propagation/seed-collecting-storing" },
    ], updatedAt: "2026-11-19",
  },
};

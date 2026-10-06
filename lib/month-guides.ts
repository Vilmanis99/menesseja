export interface MonthGuide {
  shortAnswer: string;
  checklistTitle: string;
  priorityCropIds: string[];
  cropNotes: Record<string, string>;
  checklist: { title: string; text: string; icon: string }[];
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
    shortAnswer: "Janvārī Latvijas dobēs parasti nesēj. Pārskati atlikušās sēklas, pārbaudi vecāko paciņu dīgtspēju un uzzīmē dobju plānu. Dēstu sējas datumus rēķini no paredzētās izstādīšanas, nevis sāc visu uzreiz. Agrīna sēja ir lietderīga tikai tad, ja vari nodrošināt konkrētajam augam vajadzīgo gaismu un temperatūru.",
    checklistTitle: "Sagatavo sezonu bez steigas",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Pārskati sēklas", text: "Pieraksti augu, šķirni un atlikumu. Pirms jauna pirkuma pārbaudi šaubīgo sēklu dīgtspēju.", icon: "inventory_2" },
      { title: "Uzzīmē dobes", text: "Atzīmē iepriekšējo sezonu stādījumus un vietas, kur pietiek saules un ir pieejams ūdens.", icon: "grid_on" },
      { title: "Pārbaudi glabātavu", text: "Apskati glabāto ražu un dāliju bumbuļus. Bojātos izņem un noskaidro mitruma vai temperatūras cēloni.", icon: "thermostat" },
    ],
    relatedLinks: [
      { label: "Kā izvēlēties sēklas savam dārzam", href: "/raksti/ka-izveleties-seklas-darzam" },
      { label: "Sēklu glabāšana un dīgtspējas pārbaude", href: "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju" },
      { label: "Kad sēt dēstus: rēķini atpakaļ", href: "/raksti/kad-set-destus-rekini-atpakal" },
    ],
    sources: [
      { label: "RHS — ziemas darbi un augu maiņas plānošana", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/january-jobs" },
      { label: "University of Minnesota Extension — sezonas un šķirņu plānošana", url: "https://extension.umn.edu/about/our-stories/news/garden-planning-in-the-new-year" },
    ], updatedAt: "2026-10-06",
  },
  2: {
    shortAnswer: "Februārī vari sākt paprikas un seleriju dēstus, ja izvēlētās šķirnes audzēšanas ilgums un izstādīšanas plāns to prasa. Uz tumšas palodzes nesteidzies ar tomātiem un gurķiem. Vispirms sagatavo tīrus sēšanas traukus, substrātu un gaismu; ārā nesēj sasalušā vai pārmitrā augsnē.",
    checklistTitle: "Pirms pirmās dēstu sējas",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Aprēķini sējas laiku", text: "Siltumnīcai un laukam būs atšķirīgs izstādīšanas laiks. Pārbaudi konkrētās šķirnes ieteikumus.", icon: "schedule" },
      { title: "Novērtē gaismu", text: "Siltumā ar nepietiekamu gaismu dēsti izstīdz. Ierobežo sējumu daudzumu līdz aprūpējamam apjomam.", icon: "light_mode" },
      { title: "Sagatavo traukus", text: "Iztīri atkārtoti lietojamos podus un pārliecinies, ka tiem ir drenāžas atveres un paliktnis.", icon: "potted_plant" },
    ],
    relatedLinks: [
      { label: "Dēstu audzēšana uz palodzes", href: "/raksti/destu-audzesana-uz-palodzes" },
      { label: "Kāpēc dēsti izstīdz", href: "/raksti/desti-izstidz" },
      { label: "Kā izvēlēties sēklas", href: "/raksti/ka-izveleties-seklas-darzam" },
    ],
    sources: [
      { label: "University of Minnesota Extension — dēstu sākšana telpās", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/starting-seeds-indoors" },
      { label: "RHS — sējas sagatavošana ziemas beigās", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/february-jobs" },
    ], updatedAt: "2026-10-06",
  },
  3: {
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
    shortAnswer: "Maijā turpini aukstumizturīgo kultūru sēju un pakāpeniski norūdi dēstus. Tomātus, gurķus, papriku un ķirbjaugus laukā izstādi tikai pēc vietējiem salnu draudiem un pietiekamas augsnes iesilšanas. Neapkurināta siltumnīca aukstā naktī nav garantēta aizsardzība; dažviet jāgaida līdz jūnijam.",
    checklistTitle: "Droša dēstu izstādīšana",
    priorityCropIds: ["burkani", "bietes", "salati", "dilles"],
    cropNotes: { bietes: "Sēj iesilušā, sagatavotā dobē un vēlāk izretini.", dilles: "Sēj nelielās porcijās, lai svaigi zaļumi būtu ilgāk.", gurki: "Tiešo sēju sāc tikai siltā augsnē pēc salnu draudiem; aukstā vietā nogaidi.", pupas: "Aukstā un pārmitrā augsnē sēklu bojāšanās risks ir lielāks; gaidi piemērotus apstākļus." },
    checklist: [
      { title: "Norūdi pakāpeniski", text: "Palielini āra laiku pamazām. Pirmajās dienās sargā dēstus no stipras saules, vēja un aukstuma.", icon: "wb_twilight" },
      { title: "Vēro nakts temperatūru", text: "Pārbaudi prognozi savā vietā un sagatavo plānu, kā dēstus pasargāsi pēkšņā aukstumā.", icon: "thermostat" },
      { title: "Sagatavo vietu", text: "Balstus un laistīšanas iespēju ierīko laikus. Ievēro konkrētā auga attālumus, nevis sablīvē stādījumus.", icon: "potted_plant" },
    ],
    relatedLinks: [
      { label: "Kā norūdīt dēstus", href: "/raksti/ka-rudit-destus" },
      { label: "Kad dēstus stādīt laukā", href: "/raksti/kad-stadit-destus-lauka" },
      { label: "Balkona dārzs iesācējam", href: "/raksti/balkona-darzs-iesacejam" },
    ],
    sources: [
      { label: "RHS — norūdīšana un izstādīšana pēc salnām", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/may-jobs" },
      { label: "University of Minnesota Extension — dēstu audzēšana un izstādīšana", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/starting-seeds-indoors" },
    ], updatedAt: "2026-10-06",
  },
  6: {
    shortAnswer: "Jūnijā, kad salnu draudi beigušies un augsne iesilusi, vari izstādīt siltummīļus un sēt ātraudzīgas kultūras. Galvenie darbi ir vienmērīga laistīšana, ravēšana, balstu pārbaude un siltumnīcas vēdināšana. Salātus un dilles sēj mazās porcijās; karstumā izvēlies piemērotu šķirni un sargā jaunos sējumus no izžūšanas.",
    checklistTitle: "Palīdzi jaunajiem stādījumiem ieaugt",
    priorityCropIds: ["pupas", "dilles", "salati", "gurki"],
    cropNotes: { pupas: "Vīteņšķirnēm pirms sējas ierīko stabilus balstus.", dilles: "Sēj atkārtoti nelielās porcijās un uzturi mitru sējas virskārtu.", salati: "Karstā vietā izvēlies vasarai piemērotu šķirni un nelielu sējumu.", gurki: "Siltā augsnē izvēlies konkrētajai audzēšanas vietai piemērotu šķirni." },
    checklist: [
      { title: "Pārbaudi mitrumu", text: "Vēro augsni sakņu dziļumā un podus, kas izžūst ātrāk. Laisti pēc vajadzības, ne pēc viena grafika.", icon: "water_drop" },
      { title: "Ierīko balstus", text: "Tomātus un vīteņpupas piesien, augot augumā. Pārbaudi, vai saites neiegriežas stublājā.", icon: "yard" },
      { title: "Vēro siltumnīcu", text: "Saulainās dienās vēdini un apskati lapu apakšpuses. Problēmu vispirms atpazīsti, tikai tad izvēlies rīcību.", icon: "visibility" },
    ],
    relatedLinks: [
      { label: "Kā laistīt dārzu karstumā", href: "/raksti/ka-laistit-darzu-karstuma" },
      { label: "Tomātu veidošana", href: "/raksti/tomatu-veidosana" },
      { label: "Kāpēc hortenzijas nezied", href: "/raksti/kapec-hortenzijas-nezied" },
    ],
    sources: [
      { label: "RHS — vasaras sēja un augu balsti", url: "https://www.rhs.org.uk/advice/grow-your-own/in-month/june-jobs" },
      { label: "University of Minnesota Extension — gurķu audzēšana", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-cucumbers" },
    ], updatedAt: "2026-10-06",
  },
  7: {
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
    shortAnswer: "Novembrī vairāk rūpējies par glabāto ražu un dārza sagatavošanu ziemai nekā sēju laukā. Jutīgo augu aizsardzību izvēlies pēc sugas, audzēšanas vietas un prognozes. Iztīri un nožāvē instrumentus, pārskati sēklas un neapstrādā dobes, ja augsne ir sasalusi vai pārmitra.",
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
    ], updatedAt: "2026-10-06",
  },
  12: {
    shortAnswer: "Decembrī plāno nākamo sezonu: atzīmē, kas izdevās, izvēlies audzēšanas vietai piemērotas šķirnes un pārskati esošos piederumus. Turpini pārbaudīt sēklas un glabātos dāliju bumbuļus. Sēju telpās sāc tikai tad, ja vari nodrošināt konkrētā auga prasības; agrāks datums pats par sevi negarantē labāku rezultātu.",
    checklistTitle: "Nākamās sezonas plāns",
    priorityCropIds: [], cropNotes: {},
    checklist: [
      { title: "Pieraksti pieredzi", text: "Atzīmē ražu, kopšanas grūtības un šķirnes. Nākamās sezonas izvēles balsti savā audzēšanas vietā.", icon: "edit_note" },
      { title: "Izveido īsu sarakstu", text: "Vispirms izvēlies augus un aprēķini daudzumu, pēc tam sēklas. Pārbaudi, kas jau ir mājās.", icon: "checklist" },
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
    ], updatedAt: "2026-10-06",
  },
};

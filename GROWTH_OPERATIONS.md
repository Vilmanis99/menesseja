# Mēness Sēja — gada saturs un izaugsmes darba kārtība

## Sējas ceļveža sezonas filtri — 2026-10-27

Lietotājs pamanīja, ka oktobra sējas ceļvedī redzami burkāni un bietes. Cēlonis bija divējāds: sākumā rādījās visa gada katalogs, bet filtrs “Šomēnes” ieskaitīja arī ražas novākšanu un ziedēšanu. **Labojums sagatavots un pārbaudīts lokāli; nav publicēts.**

- `/celvedis` sākas ar pašreizējo mēnesi pēc Latvijas laika un darbību “Sēja un stādīšana”. Ražas novākšanai, ziedēšanai un visām darbībām ir atsevišķi skati. Var izvēlēties jebkuru mēnesi vai visu gadu; meklēšana saglabā sezonas ierobežojumu un atbalsta nosaukumus bez garumzīmēm un esošos sinonīmus.
- Kartītē skaidri norādīta izvēlētā mēneša darbība. Ražas un ziedēšanas skatā nerāda vispārīgos sēšanas padomus. Gada joslas ir atsevišķi atveramas, pilnā serverī renderētā tabula skaidri nosaukta par visa gada plānu. Tukšs rezultāts piedāvā pāriet uz gada skatu vai izvēlētā mēneša darbu ceļvedi.
- 13 kultūrām atzīmēts, ka vēsturiskais datu lauks `sowOutdoors` nozīmē sīpolu, bumbuļu, daiviņu vai sakneņu stādīšanu. Gada tabula, laika joslas, mēneša saraksti un saistītās augu lapas izmanto pareizo darbības nosaukumu.
- Pēc lietotāja precizējuma rudens ķiploku ieraksts nosaukts “Ziemas ķiploki”, saglabājot esošo ID un adresi. Paskaidrots, ka vasaras ķiplokiem paredzēta agra pavasara stādīšana. Precizēts saistītā ceļveža ievads un stādīšanas sadaļas nosaukums, FAQ un sezonas paziņojums. Avots pie atšķirības: [G. Riekstiņa, J. Vilcāne, L. Purmale, “Ziemas ķiploki”, Dārzs un Drava](https://www.saimnieks.lv/raksts/ziemas-kiploki). Vecā LLKC PDF saite pārbaudē novirzīja uz sākumlapu, tāpēc tā nav izmantota gala lapā.

Pārbaudes: 19 domēna testi izturēti (5 jauni sezonas un darbību regresijas testi), TypeScript un UI validācija sekmīga, būve izveido 326 lapas. Satura validācijā saglabājas 66 iepriekšējie redakcionālie papildinājumi. Pārlūkā pārbaudīti visi 12 mēneši, oktobra ražas un ziedēšanas skati, tukšs meklējums un pāreja uz gada plānu, atgriešanās pie pašreizējā mēneša, mēneša darbu un ziemas ķiploku saites. Pie 320, 375 un 1280 px nav horizontālas pārplūdes; nav JavaScript kļūdu. Sākotnējā HTML ir 75 tabulas rindas ar pareizi atdalītām sējas, stādīšanas un ražas ailēm; ķiploku FAQ un strukturētie dati lieto “stādīt”. Pieraksts: `content/audits/sowing-guide-season-review-2026-10-27.json`.

Atlikušais darbs: tas ir atlases un darbību nosaukumu labojums, ne visu 75 kultūru agronomisko periodu audits. Atsevišķi jāpārbauda šķirņu grupas, pavasara/rudens stādīšanas iespējas un īpašās metodes (piemēram, pirmsziemas sēja); nedrīkst vispārīgo mēneša logu pasniegt kā garantiju konkrētai dienai. Vasaras ķiplokiem vēl nav atsevišķas kalendāra kartītes. Pilnā ķiploku ceļveža pārējie audzēšanas un kaimiņaugu padomi šajā kārtā nav pilnībā auditēti.


## Četru puķu audzēšanas ceļvežu pārbaude — 2026-10-27

Pēc lietotāja apstiprinātās prioritātes pilnībā pārskatīti `/pukes/asteres`, `/pukes/verbena`, `/pukes/neaizmirstules` un `/pukes/krizantemas`. Trīs aģenti pārbaudīja saturu un sagatavoja redakcijas; galvenais aģents pārskatīja visus četrus gala tekstus, neatkarīgi pārbaudīja būtiskos primāros avotus un ieviesa kopīgo lapas atbalstu. **Izmaiņas sagatavotas lokāli; šajā kārtā nav publicētas.**

- Katram ceļvedim ir īsā atbilde, dzīves cikls, augu grupu salīdzinājums, pārstrādāta stādīšana, kopšana, ziemošana un problēmu izvērtēšana, pieci FAQ un 6–7 konkrēti avoti. Sadaļu atsauces ved uz numurētu avotu sarakstu. Redzamais satura datums ir 27.10.2026.; JSON-LD un sitemap izmanto attiecīgās lapas pēdējo satura vai sezonālo saišu izmaiņu datumu.
- Asterēm nošķirta viengadīgā `Callistephus chinensis` no `Aster` un `Symphyotrichum`. Sējas orientieris 6–8 nedēļas, plāns segums, ap 21 °C un 7–10 dienas balstīts Iowa State datos; salnu un šķirnes nosacījumi saglabāti. Vīte vairs netiek automātiski pasludināta par fuzariozi, un augseka netiek solīta kā dobes attīrīšanas garantija.
- Verbēnas ceļvedis attiecas uz zemajiem `Glandularia × hybrida` hibrīdiem. Nošķirtas citas verbēnu sugas, precizēts vienas sezonas audzēšanas un bioloģiskās daudzgadības jēdziens. Izņemts padoms veidot grants slāni poda dibenā, universāli mēslošanas grafiki un fiksēti izstādīšanas datumi Latvijas reģioniem.
- `Myosotis sylvatica` raksturota kā īsmūžīga daudzgadīga suga, ko bieži audzē divgadīgā ciklā; pievienota atbilstoša grupa sezonu sarakstos. Benary Sylva un PanAmerican Mon Amie norādes pamato, kāpēc sēklu apbēršana, gaisma un aukstuma perioda vajadzība jāvērtē šķirnei. Esošā foto paraksts godīgi norāda avotā nenoteikto sugu.
- Krizantēmām atsevišķi izskaidrota dārza šķirne, nezināmas šķirnes rudens pods un floristikas augs. Ziemošanas padomi nošķir dobi, lapainu podaugu un miera stāvokli; augstums vai zieda izmērs vairs netiek izmantots kā ziemcietības pierādījums.
- Saglabātas četras īstas licencētas fotogrāfijas un kanoniskās adreses. Kopīgajā veidnē pievienota sadaļu navigācija, pārskatāms salīdzinājums un atsevišķas ziemošanas rindkopas. Mēness tradīcijas skaidrojums atrodas aiz praktiskās informācijas; puķu lapās izņemts receptēm paredzētais šodienas datumu paziņojums.

Avotu robežas: izmantoti RHS, Kew, universitāšu dārzkopības dienesti un konkrētu sēklu sēriju ražotāju norādes. Ārvalstu kalendāra datumi un ziemcietības vērtējumi nav pasniegti kā Latvijas izmēģinājumu rezultāti. MoBot verbēnas lapa pārbaudīta pilnā indeksētā primārā avota tekstā; tiešais atvērums pārbaudes laikā atgrieza 502. Auditi: `content/audits/flower-guides-asteres-neaizmirstules-2026-10-27.json`, `flower-guide-verbena-2026-10-27.json`, `flower-guide-krizantemas-2026-10-27.json`.

Pārbaudes: 14 domēna testi izturēti; TypeScript, UI un satura validācija sekmīga. Gala produkcijas būve izveido 326 lapas. Visu 31 puķu lapu sākotnējā HTML pārbaudīts viens H1, unikāli enkuri, iekšējās pārejas un attēli; četrām pārskatītajām lapām arī avotu atsauces, FAQ, redzamie datumi un JSON-LD. Sitemap visām četrām saglabā pareizo kanonisko URL un 27.10.2026. datumu. Pārlūkā izietas visu četru lapu 320/375 px pārbaudes, atsevišķi arī 812 un 1440 px; nav horizontālas pārplūdes. Stādīšanas, ziemošanas un konkrēta avota saites strādā, fotogrāfijas ielādējas, krizantēmu ziemošana sadalīta trīs rindkopās. Saglabāti ekrānattēli un integrācijas pieraksts `content/audits/flower-guides-integration-2026-10-27.json`. Validatorā 66 uzskaitīti papildinājumi: 27 vēl pārskatāmi puķu ceļveži un 39 agrākie citu sadaļu brīdinājumi.

**Atlikušais apjoms:** 27 no 31 puķu ceļvežiem vēl nav iziets šis padziļinātais faktu un sadaļu avotu pārskats. Validatorā šis trūkums tagad ir atsevišķi uzskaitīts, ne klusi uzskatīts par atrisinātu. Nākamo kārtu veidot no pieprasītajām peonijām, hortenzijām, rozēm un pelargonijām, sākot ar sugu/šķirņu tvērumu, stādīšanas dziļumu, griešanu un ziemošanu; prioritāti precizēt pēc jaunākā GSC lapu un vaicājumu griezuma.

## Puķu nosaukumu lapas kvalitāte — 2026-10-27

Pēc lietotāja norādes pārbaudīta publicētā `/pukes` lapa, vietējā veidne, nosaukumu dati un puķu ceļvežu struktūra. Iepriekšējā 2026-10-26 GSC izvērtējumā šai lapai fiksēti 207 klikšķi un 4559 iespaidi; tas ir jau dokumentētais periods, ne šodien atkārtoti iegūti dati. Saglabāts veiksmīgais A–Z meklēšanas nolūks un kanoniskā adrese. **Šīs kārtas izmaiņas sagatavotas un pārbaudītas lokāli, vēl nav publicētas.**

Trīs aģenti palīdzēja ar nosaukumu faktu pārbaudi, foto/satura izlases auditu un lietojamības izvērtējumu. Galvenais aģents pieņēma izmaiņas, pārbaudīja avotus, ieviesa lapu un pārbaudīja pārlūkā.

- Meklētājs atrod latviskos, latīniskos un redakcionāli sasaistītos tautas nosaukumus, arī bez garumzīmēm. Tas atlasa gan A–Z, gan pieejamos foto; meklējums saglabājas adresē, atgriežoties un pārlādējot lapu. Ir atšķirīgi ziņojumi neatrastam nosaukumam un atrastam nosaukumam, kuram vēl nav atbilstoša foto. Tautas nosaukumu skaidrojumi ved uz ceļvedi vai attiecīgo saraksta rezultātu.
- A–Z saraksts ir uzreiz aiz meklēšanas, ar ātrām pārejām uz attēliem, tautas nosaukumiem un puķu izvēli. Agrākos atkārtotos garos audzēšanas kartīšu blokus aizstāj īsas saites pēc lasītāja vajadzības. “Ceļvedis” tekstā norāda, kur ir audzēšanas apraksts; norāde nepaļaujas tikai uz saites krāsu.
- Precizētas leduspuķes (ilgziedu begoniju grupa), seglapu salmenes, atdalītas čīkstenes un laimiņi. Skaidrotas gerāniju/ģerāniju, mārtiņrožu, surfīniju un citu nosaukumu robežas. Avoti: Latvijas leksikogrāfiskie un botāniskie materiāli, RHS un Surfinia selekcionārs. Mērķētā audita pilns pamatojums un nepārbaudītās daļas: `content/audits/flower-names-review-2026-10-27.json`.
- Sarakstā ir 87 nosaukumu ieraksti: 30 puķu ceļvežu nosaukumi un 57 papildu nosaukumi. “Balkona puķes” vairs netiek skaitītas kā augs, bet tematiskā saite saglabāta; atsevišķi pievienota čīksteņu/laimiņu atšķirība. Skaits apzīmē nosaukumus, ne 87 unikālas sugas.
- Galerijā saglabāta 31 esoša īsta fotogrāfija; netiek pieskaitīta balkona kompozīcija. Tiek rādīts pilns kadrs, konkrētās sugas/šķirnes paskaidrojums un pārveidojuma norāde līdzās autoram, avotam un licencei. Krizantēmu foto parakstā noņemts apgalvojums par nenosaukto šķirņu ziemcietību; [RHS ceļvedis](https://www.rhs.org.uk/plants/chrysanthemum/growing-guide) nošķir grupas un pārziemošanas apstākļus. Leduspuķu meklējumam netiek rādīts neatbilstošs bumbuļbegonijas foto.
- Pilno puķu lapu vienkāršotais “pārziemo jā/nē” aizstāts ar saiti uz jau esošo konkrētā auga pārziemošanas sadaļu. “Labākais laiks pēc Mēness” virsraksts precizēts uz tradīcijas orientieri. Tas nav visu šo ceļvežu padomu pārrakstīšanas vai faktu audita apliecinājums.

Pārbaudes: 14 testi izturēti, TypeScript, UI un satura validācija sekmīga, produkcijas būve izveido 326 lapas. Sākotnējais HTML satur 87 strukturēto datu ierakstus, 31 foto, visas ceļvežu saites, unikālus enkurus un vienu H1; nav ligzdotu saišu. Pārlūkā izieti tautas nosaukuma meklējums, foto neesamība, tukšs rezultāts/atiestatīšana, A–Z latviešu burti, tautas nosaukumu saites, atgriešanās no ceļveža un pārlāde. Pie 320, 375, 812 un 1440 px nav horizontālas pārplūdes. Saglabāti reālo lapu ekrānattēli; foto ielādējas un saglabā pilnu kadru. Iepriekšējie 39 citu satura sadaļu papildinājumu brīdinājumi saglabājas.

**Nākamā satura prioritāte:** pilnajiem puķu ceļvežiem ieviest konkrētus avotus un atsevišķu satura pārskatīšanas datumu. Sākt ar asterēm (Callistephus/Aster/Symphyotrichum nošķīrums), verbēnām (dobēm paredzēto hibrīdu tvērums), neaizmirstulītēm (suga un dzīves cikls) un krizantēmu ziemošanu. Visu 31 ceļvežu pilns botāniskais audits šajā kārtā nav veikts. Nosaukumu lapas avotu saraksts šo trūkumu neaizstāj.

## Kaitēkļu atpazīšana un fotogrāfijas rakstu kartītēs — 2026-10-27

Darbs sadalīts trim aģentiem: prioritāro ceļvežu faktu un avotu pārbaude, īstu simptomu fotogrāfiju atlase ar licencēm un esošo rakstu fotogrāfiju ieviešana bibliotēkas kartītēs. Galvenais aģents pārskatīja rezultātus, neatkarīgi pārbaudīja būtiskos avotus un visus trīs jaunos attēlus, integrēja izmaiņas un veica funkcionālo un vizuālo pārbaudi. **Šī kārta sagatavota lokāli, vēl nav publicēta.**

- `/kaitekli` tagad meklē visos 23 ceļvežos pēc nosaukuma, auga un pazīmēm. Darbojas teksts bez garumzīmēm un redakcionāli precizēti vaicājumi, piemēram, “balts aplikums”, “lipigas lapas” un “tīkls”. Meklējums un kaitēkļu/slimību filtrs saglabājas adresē, atgriežoties un pārlādējot lapu. Ir rezultātu skaits, skaidrs tukšais stāvoklis un filtru notīrīšana.
- Laputu, īstās miltrasas un lakstu puves ceļveži pārstrādāti: īsa atbilde, pazīmju salīdzināšana, rīcība, profilakse, biežie jautājumi un katram seši konkrēti avoti. Noņemti nepamatoti mājas smidzinājumu iedarbības un devu ieteikumi. Precizēta miltrasas saimniekaugu atšķirība un atšķirīgā rīcība tomātiem un kartupeļiem lakstu puves gadījumā. Ceļvežu sadaļām ir tiešas pārejas. Kataloga ievads un metadati vairs nesola universālu tautas līdzekļu iedarbību.
- Pievienotas trīs pārbaudītas, licencētas simptomu fotogrāfijas: laputu kolonija uz rozes, cukīni lapas dabiskā raksta un miltrasas salīdzinājums, lakstu puves bojāta tomāta lapa. Attēli saglabāti pilnā kadrā ar paskaidrojumu, autoru, avotu un licenci. Reģistrā tagad ir 67 attēli. Atlases un satura pārbaudes pieraksti glabājas `content/audits/pest-photo-review-2026-10-27.json` un `content/audits/pest-content-review-2026-10-27.json`.
- 15 no 84 rakstu kartītēm izmantots rakstā jau esošais, reģistrētais foto. Nosaukums un apraksts paliek pirms foto; autora un licences saites ir atsevišķas no raksta saites. Fotogrāfijas netiek apgrieztas. Sezonas rakstu bloks pārveidots par trim dabiska augstuma kartītēm, novēršot lielos tukšos laukumus iepriekšējā izkārtojumā.

Pārbaudes: visi 13 testi izturēti; TypeScript, UI un satura validācija sekmīga; produkcijas būve izveido 326 lapas. Sākotnējā HTML saglabātas visu 23 ceļvežu un 84 rakstu saites, kanoniskās adreses un vienīgais H1; foto atribūciju saites nav ligzdotas citās saitēs. Pārlūkā pārbaudīta meklēšana pēc pazīmēm, veida filtrs, tukšs rezultāts, atiestatīšana, foto saites, atgriešanās un pārlāde. Pie 320, 375 un 1440 px nav horizontālas pārplūdes. Attēli ielādējas, ceļveža enkurs telefonā paliek zem galvenes, nav pārlūka JavaScript kļūdu.

Atlikušais kvalitātes darbs: validācija uzrāda 39 redakcionālus papildinājumus — 18 kaitēkļu/slimību ceļvežiem vēl nav konkrētu avotu un 21 rakstam saglabājas iepriekš zināms FAQ papildināšanas uzdevums. Šie 18 ceļveži nav uzskatāmi par šajā kārtā pārbaudītiem. Nākamo kārtu sākt ar pelēm un strupastēm, pelēko puvi un ziemojošu telpaugu kaitēkļiem; paralēli saskaņot saistīto problēmu rakstu ieteikumus, lai dažādās lapās nerastos pretrunas. Jaunus foto atlasīt pēc konkrētas atpazīšanas vajadzības.

## Pastāvīgā kvalitātes un lietojamības prioritāte — 2026-10-26

Lietotājs sagaida proaktīvus, konkrētus ieteikumus projekta attīstībai katrā darba posmā. Darbu izvēlas pēc lasītāja vajadzības, sezonas un redzamajiem datiem. Novērtē visu ceļu: kā cilvēks atrod tēmu, saprot atbildi, izvēlas darbību un atrod nākamo noderīgo lapu. Ieteikumam norāda novēroto problēmu, paredzēto ieguvumu un veidu, kā pārbaudīt rezultātu.

Šīs kārtas konkrētais labojums: `/raksti` mēnešu kartītes un rakstu mēneša filtra saite ved tieši uz padziļinātā kalendāra darbu sadaļu. Arī katra `/ko-set/[month]` pārskata sākumā ir skaidra pāreja uz pilno darbu ceļvedi. Saistīto kalendāru gads tiek noteikts serverī pēc Latvijas laika; ja šim gadam kalendāru vēl nav, zināšanu krātuve saglabā derīgas saites uz bezgada sējas pārskatiem. Labojums sagatavots lokāli nākamajam laidienam.

Pārbaudes: produkcijas būve izveidoja 318 lapas, visi 10 esošie testi izturēti. Sākotnējā HTML pārbaudītas visas 12 mēnešu kartīšu un 12 sējas pārskatu saites un mērķa sadaļas. Pārlūkā 375 px platumā novembra kartīte un decembra filtra saite atver darbu sadaļu zem galvenes; sējas pārskata jaunā saite ir redzama un darbojas. Pie 375 un 812 px platuma nav horizontālas pārplūdes.

**Rakstu atrašana — pabeigta lokāli 2026-10-26.** Meklētājs pārvietots uz `/raksti` sākumu. Tas meklē virsrakstā, aprakstā, kategorijā un redakcionālajos atslēgvārdos, pieņem tekstu bez latviešu diakritiskajām zīmēm un neatkarīgi no vārdu secības. Piemēram, “daliju glabasana” atrod dāliju pārziemināšanas rakstu. Meklējot uzreiz redzami rezultāti; gada plāns un citi atklāšanas bloki paliek sākotnējā skatā. Teksts, kategorija un mēnesis saglabājas adresē, atgriežoties no raksta un pārlādējot lapu. Ir skaidra filtru notīrīšana, arī tad, ja rezultātu nav.

Šīs kārtas pārbaudes: 12 testi izturēti, satura validācija aptver 84 rakstus, 12 mēnešu ceļvežus un 64 fotogrāfijas; saglabājas 21 iepriekš zināms FAQ brīdinājums. Produkcijas būve sekmīgi izveido 326 lapas. Sākotnējais `/raksti` HTML satur visu 84 rakstu saites un 12 mēnešu kartītes, meklētājs ir pirms gada plāna un kanoniskā adrese saglabāta. Pārlūkā pārbaudīta meklēšana, kombinēti filtri, atgriešanās no raksta, pārlāde, tukši rezultāti un notīrīšana. Pie 320, 375 un 1440 px nav horizontālas pārplūdes; meklētāja vadīklas ir vismaz 44 px augstas. Šī kārta vēl nav publicēta.

**Sākumlapa un pirmā apmeklējuma ceļš — pabeigts lokāli 2026-10-26.** Sākumā redzamas trīs pārejas: šī mēneša praktiskie darbi, augu enciklopēdija un atlasītie problēmu raksti. Sezonālais bloks izmanto kopīgo mēneša plānu un jau pārbaudīto ceļveža fotogrāfiju ar paskaidrojumu, autoru un licenci. Tas automātiski mainās pēc Latvijas mēneša un atjaunojas reizi stundā. Pašreizējā un nākamā mēneša saites izmanto esošo gada pārejas loģiku; ārpus pieejamajiem kalendāra gadiem tās ved uz bezgada pārskatiem.

Personīgais dārzs, augi un pievienošanas logs saglabāti; lapas sākumā ir tieša saite uz dārza sadaļu. Lielais parauga dārza ievads aizstāts ar īsu paskaidrojumu. Agrāk automātiskais trīs soļu ievads tagad atveras tikai ar pogu “Īsā pamācība”. Soļu virsraksti saņem tastatūras fokusu, bet pēc aizvēršanas tas atgriežas pie atvēršanas pogas. Datora sānu izvēlne ir ritināma, tāpēc zemākā logā var sasniegt arī tās pēdējās sadaļas; aktīvā saite marķēta ar `aria-current`.

Pārbaudes: 12 esošie testi un produkcijas būve izturēti, izveidotas 326 lapas. Sākotnējā HTML pārbaudītas trīs ieejas, kanoniskā adrese, vienīgais H1 un dārza enkurs, kalendāra mērķa enkuri un foto atribūcija. Pārlūkā pārejas atver oktobra darbu sadaļu, augu katalogu un 29 problēmu rakstus. Pārbaudīta dārza saite, auga pievienošanas loga atvēršana/aizvēršana, brīvprātīgās pamācības soļi un tastatūras fokuss. Pie 320, 375, 812 un 1440 px nav horizontālas pārplūdes; 812 × 375 skatā ritināmās sānu izvēlnes iestatījumu saite ir sasniedzama. Fotogrāfija ielādējas. Sākumlapa un iepriekšējie meklēšanas/navigācijas labojumi vēl nav publicēti.

Nākamā pārskata prioritātes:

1. **Atbildes atrašana.** Meklētāja uzlabojums sagatavots un pārbaudīts lokāli. Pēc publicēšanas vērtēt konkrētus neveiksmīgas meklēšanas piemērus; redakcionālos sinonīmus papildināt pēc vajadzības, nepievienojot visu rakstu tekstu klienta datiem.
2. **Sākumlapa jaunam lasītājam.** Trīs ieejas, sezonālais foto un tiešā pāreja uz personīgo dārzu sagatavotas un pārbaudītas lokāli. Pēc publicēšanas vērtēt esošos piekrišanai atbilstošos `internal_cta_click` notikumus ar avotu `home` un katras pārejas izvietojumu.
3. **Noderīgi vizuālie materiāli.** Prioritārajām lapām izvēlēties identificētu augu foto, simptomu salīdzinājumus un darbu secības. Sugu, šķirni un attēlā patiešām redzamo pazīmi pārbaudīt; pievienot autoru un licenci. Sākt ar lapām, kurām jau ir pieprasījums, piemēram, hortenzijām un puķu direktoriju.
4. **Vienots satura standarts.** Īsa atbilde, rīcības apstākļi, secīgi soļi, kļūdas, konkrēti avoti un saistītie raksti. Atsevišķi pārskatīt vispārīgus solījumus par “labākajām Mēness dienām”, lai tradīcija netiktu pasniegta kā pārbaudīta audzēšanas garantija. `/kaitekli` ievads un trīs prioritārie ceļveži sakārtoti 2026-10-27 lokālajā kārtā; turpināt atlikušo ceļvežu avotu un ieteikumu pārbaudi.
5. **Pārbaudāma kvalitāte.** Katrā laidienā pārbaudīt mainīto lietotāja ceļu telefonā, tastatūras fokusu, attēlu ielādi, saites un būvi. Pēc publicēšanas vērtēt Search Console lapu datus un piekrišanai atbilstošos rīku lietojuma notikumus; nākamo prioritāti pārskatīt pēc rezultāta.

Publicētais kalendāru laidiens: `9fdba57`, Vercel izvietošana sekmīga. Dzīvajā vietnē pārbaudītas 36 mēnešu lapas, 16 fotogrāfijas un novembra/decembra mobilais skats. Google Search Console pārlūkā apstiprināja novembra un decembra atkārtotas indeksēšanas pieprasījumus un vietnes kartes iesniegšanu. Tas apliecina pieprasījumu saņemšanu, ne jaunā satura pārindeksēšanas pabeigšanu.

## Mēnešu kalendāru saturs un īstās fotogrāfijas — 2026-10-26

Pēc lietotāja precizētās prioritātes sagatavoti visu 12 mēnešu darbu ceļveži esošajām kalendāra adresēm. Īpaši izvērsts novembris un decembris; oktobra URL un lapas galvenais nolūks saglabāti. Kopīgā veidne papildina 36 esošās 2025.–2027. gada lapas. Lietotājs 2026-10-26 pieprasīja šo izmaiņu un iepriekš sagatavoto vietnes labojumu publicēšanu dzīvajā versijā; šī sadaļa fiksē laidiena saturu un pirms publicēšanas veiktās pārbaudes.

- Pēc lietotāja atgriezeniskās saites īsie pārskati pārstrādāti par 67 praktiskiem darbu aprakstiem: novembrim 8, decembrim 7, pārējiem mēnešiem 5–6. Katram ir sākšanas laiks vai apstākļu pazīme, trīs izpildes soļi, bieža kļūda, konkrētie avoti un turpmākās lasīšanas saite. Mēneša sākuma, vidus un beigu darba posmi ved tieši uz attiecīgo aprakstu; tie ir plānošanas orientieri, ne laika prognoze. Novembrim un decembrim ir četri FAQ jautājumi, pārējiem divi.
- Katrā ceļvedī ir īsta fotogrāfija ar paskaidrojumu, autoru, avotu un licenci. Atlasīti astoņi kalendāra foto, papildus izmantots esošais tulpju attēls; dažiem radniecīgiem mēnešiem ir kopīgs foto. Attēli nav pasniegti kā pašu Latvijas dārza izmēģinājumi. Ģenerētais tomātu ilustrācijas prototips šajā kārtā nav ievietots.
- `content/calendar-guides.json` glabā redakcionālo saturu un tematiskos RHS, University of Minnesota Extension un LLKC avotus. Ārvalstu sējas datumus nepārņem kā Latvijas termiņus; darbi ir saistīti ar augsni, vietējām salnām un augu prasībām.
- Kalendārā redzamas visas četras galvenās Mēness fāzes, arī mēneši ar pieciem fāžu notikumiem. Notikumu laiks ir Latvijas laikā; dienu skaits un klasifikācija nav atkarīga no būves servera laika joslas. Atkārtotiem fāžu zīmējumiem ir atsevišķi SVG identifikatori.
- Lapas sākumā ir saites uz ceļvedi, fāzēm, sēju un dienu tabulu. Padziļinātais ceļvedis pārvietots pirms dienu tabulas, lai darbi nebūtu jāmeklē aiz 30 vai 31 rindas; tam ir atsevišķs darbu satura rādītājs. Drukas izkārtojums rāda mēneša kopsavilkumu, fāzes un dienas; garais ceļvedis un foto paliek ekrānam. Novērsta drukā parādījusies pieejamības pārejas saite un liekā mobilās navigācijas atstarpe.
- `content/images.json` ir kopīgais 16 fotogrāfiju reģistrs. Atkārtoti izmantojamais attēla bloks ieviests arī rakstu, augu un puķu veidnēs; pirmie foto pievienoti desmit esošajām satura lapām. Tā ir sākuma kārta, ne visas bibliotēkas ilustrēšana.

Satura validācija aptver visus 12 ceļvežus, 67 darbu aprakstu soļus un avotus, darba posmu saites, 16 attēlu failus un licences atsauces. Esošie 10 testi izturēti, produkcijas būve sekmīgi izveido 318 lapas. Visu 36 kalendāru sākotnējā HTML pārbaudīti dienu skaiti, attēla esamība, unikāli enkuri un 1999 iekšējās saites un darba enkuri. Visus 12 mēnešus pārbaudot 360 px pārlūkā, nav horizontālas pārplūdes, attēli ielādējas un nav JavaScript izpildes kļūdu. Visu 12 2026. gada mēnešu drukas priekšskatījumi testa pārlūkā ietilpst vienā A4 lapā ar 10 mm malām; novembris un maijs pārbaudīti arī vizuāli. Pēc padziļinātā satura pārrakstīšanas atkārtoti pārbaudītas visu 12 mēnešu saites uz konkrētu darbu 360 px pārlūkā; novembra, decembra un maija izdrukas joprojām ietilpst vienā A4 lapā. Saglabājas 21 iepriekš zināms FAQ papildināšanas brīdinājums citos rakstos.

Atklāts turpmākā satura iztrūkums: nav atsevišķu ābeļu, bumbieru un citu augļu koku profilu, uz kuriem balstīt padziļinātu augļu dārza gada kopšanas ciklu. Šajā kārtā jauni šādu profilu URL nav veidoti.

Nākamais redakcionālais solis: katrai pieprasītākajai tēmai atlasīt konkrētu noderīgu vizuālo materiālu — atpazīšanas foto, darbu secību vai salīdzinājumu. Pašu Latvijas dārzu foto ar vietas tipu, datumu un šķirni būtu vērtīgākais papildinājums. Prioritāti izvēlēties pēc lapu vaicājumiem un sezonas, ne visu projektu veidot ap vienu kultūru. Pēc publicēšanas novembra un decembra lapu rezultātus vērtēt atsevišķi no oktobra sezonas krituma.


## Search Console izvērtējums un nākamo četru nedēļu plāns — 2026-10-26

**Lēmums:** vispirms uzlabot jau pieprasītos kalendārus, Mēness uzziņu un puķu saturu. Meklēšanas apmeklējums aug, bet vēl nav izmērīts, cik lasītāju izmanto rīkus, atgriežas vai apstiprina e-pasta abonēšanu. Šī sadaļa ir darba plāns; tās sagatavošanā vietnes kods un saturs nav mainīti.

### Dati un to robežas

Avots: [2026-10-26 GSC eksports](/Users/karlis/Downloads/menesseja.lv-Performance-on-Search-2026-10-26.xlsx), meklēšanas veids `Web (text-based)`. Faktiskais periods ir **25.07.–24.10.2026.**, ne līdz eksporta datumam. Vietnes kopējie rezultāti aprēķināti no `Chart!A2:E93`; pilnajā periodā ir **940 klikšķi un 25 173 iespaidi**, CTR **3,73%**.

| Rādītājs | 30.08.–26.09. (28 dienas) | 27.09.–24.10. (28 dienas) | Izmaiņa |
|---|---:|---:|---:|
| Klikšķi | 96 | 636 | +562,5% jeb 6,63 reizes |
| Iespaidi | 2 200 | 20 093 | +813,3% jeb 9,13 reizes |
| CTR | 4,36% | 3,17% | −1,20 procentpunkti |
| Vidējā pozīcija, aptuveni | 8,69 | 6,77 | Uzlabojums |

Periodu avoti: `Chart!A38:E65` un `Chart!A66:E93`. CTR aprēķināts no klikšķu un iespaidu summām; pozīcija ir ar iespaidiem svērta no noapaļotajām dienas pozīcijām. Pēdējo četru nedēļu klikšķi ir **132, 144, 150 un 210** (`Chart!A66:E93`, secīgi septiņu dienu posmi). Tātad pieaugums redzams arī pēc zemās salīdzinājuma bāzes; pēdējā nedēļā ir vidēji 30 klikšķu dienā. Šie dati paši nepierāda, kura iepriekšējā izmaiņa izraisījusi pieaugumu.

Mobilās ierīces dod **701 no 940 klikšķiem jeb 74,6%** (`Devices!A2:E4`), Latvija — **927 jeb 98,6%** (`Countries!A2:E2`). Prioritāro lapu izmaiņas vispirms pārbauda telefonā un latviešu valodā.

Lapu un vaicājumu tabulas aptver visas 92 dienas; tās neparāda atsevišķu lapu pēdējo 28 dienu pieaugumu. `Queries` rindās ir tikai 354 klikšķi, tāpēc redzamie vaicājumi nav pilns meklējumu sadalījums. `Pages` summa ir 942 klikšķi un 25 995 iespaidi; to neizmanto vietnes kopējo rādītāju vietā. Adreses ar `#sadaļa` nav pieskaitītas pamatadreses rezultātiem. Vaicājumu piesaiste konkrētām lapām jāpārbauda ar GSC lapas filtru; atsevišķās eksporta tabulas nav savienoti dati. [Google skaidrojums par griezumiem un izmaiņu vērtēšanu](https://support.google.com/webmasters/answer/17010961?hl=en).

### Kur ir iespēja

Visi šīs tabulas lapu rādītāji attiecas uz **25.07.–24.10.2026.**, un izmantota precīza pamatadrese bez fragmenta.

| Lapa | Klikšķi | Iespaidi | CTR | Pozīcija | Darbs |
|---|---:|---:|---:|---:|---|
| `/kalendars/2026/oktobris` | 233 | 1 042 | 22,36% | 4,53 | Veiksmīgo mēneša pieeju turpināt novembrī un decembrī |
| `/pukes` | 207 | 4 559 | 4,54% | 8,70 | Saglabāt A–Z nolūku; uzlabot saites un atpazīšanas iespējas |
| `/raksti/kapec-hortenzijas-nezied` | 95 | 304 | 31,25% | 1,99 | Saglabāt uzvarētāju; izmantot tā skaidro problēmas struktūru citur |
| `/meness` | 74 | 4 506 | 1,64% | 6,45 | Pārbaudīt meklēšanas rezultātu un precizēt pilnmēness dienas atbildi |
| `/kalendars` | 33 | 2 908 | 1,13% | 8,86 | Precizēt virsrakstu, sezonas atbildi un pāreju uz aktuālo mēnesi |
| `/augi/nelkes` | 10 | 933 | 1,07% | 8,51 | Puķēm piemērota veidne, sugu atšķiršana un saite no A–Z |
| `/raksti/kad-parstadit-peonijas` | 13 | 673 | 1,93% | 6,55 | Izvērtēt precīzu atbildi un rezultāta aprakstu; sezonāli zemāka steidzamība |

Avoti: `Pages!A2:E5`, `Pages!A7:E7`, `Pages!A9:E10`. Papildu kandidāti pēc šīs kārtas: tīklērces — 0/268 (`Pages!A95:E95`), asteres — 0/187 (`Pages!A96:E96`), narcises — 2/231 (`Pages!A39:E39`). Nulles klikšķi nav automātisks pamats jaunai lapai vai URL maiņai.

Vaicājumi palīdz nošķirt nolūkus. `puķu nosaukumi alfabēta secībā` jau dod **104 klikšķus no 366 iespaidiem**, pozīcija **1,18** (`Queries!A2:E2`), kamēr plašais `puķes` dod 3/1 241 (`Queries!A15:E15`). A–Z lapas kopējais CTR nav pierādījums, ka tās esošais virsraksts nestrādā. Savukārt `mēness fāze šodien` ir 34/1 796, pozīcija 5,91 (`Queries!A4:E4`), un `mēness kalendārs` — 3/1 408, pozīcija 8,67 (`Queries!A14:E14`): tās ir prioritāras grupas detalizētai pārbaudei. Zema CTR iemesls var būt gan nolūks un rezultāta izskats, gan atbilde pašā meklētājā; pēdējais šajā auditā nav pierādīts.

### Jau izdarītais un konkrētie trūkumi

2026-10-26 pārbaudīts publisko `/meness`, `/kalendars`, `/pukes`, `/augi/nelkes` un `/kalendars/2027/janvaris` lapu sākotnējais HTML un atbilstošais lokālais kods. Pārbaude nav GSC URL Inspection vai Core Web Vitals audits.

- `/meness` un `/kalendars` jau atdod datumus un galveno saturu servera HTML. Abām ir sava kanoniskā adrese. Agrāk konstatētā tukšā sākotnējā atveidojuma labojums nav atkārtoti jāievieš.
- Novembra un 2027. gada kalendāri jau ir izveidoti. Janvāra publiskajā HTML ir atjaunotie Latvijas laiki un sezonālās saites. Uzdevums ir stiprināt to noderīgumu un atklājamību. Novembrim GSC ir 9 klikšķi un 24 iespaidi (`Pages!A12:E12`); par 37,5% CTR stabilitāti šis apjoms vēl neko drošu nepasaka.
- `/kalendars` 26. oktobra kartītē ir vispārīgais aicinājums sēt tomātus, pupas un ķirbjus. Tas konfliktē ar tālāk redzamo rudens saturu. Cēlonis ir no sezonas neatkarīgais padoms `lib/biodynamic.ts`, ko parāda `app/kalendars/page.tsx`.
- Neļķu rezultāta virsraksts ir “Neļķes — kad sēt, stādīt un novākt Latvijā”; lapā redzami “Raža” un “Līdz ražai”. Tas nāk no kopīgās augu veidnes. A–Z lapā nav saites uz esošo `/augi/nelkes` profilu.
- `/pukes` sākotnējā HTML nav fotogrāfiju. Tā ir iespēja nelielam atpazīšanas uzlabojumam, ne pierādījums, ka fotogrāfiju pievienošana paaugstinās pozīciju.
- Kodā jau ir `article_engaged`, `internal_cta_click`, `garden_activated`, `garden_return` un abonēšanas notikumi. Kalendāra drukāšanas poga tikai izsauc `window.print()`. Esošo notikumu faktiskā nonākšana analītikā un abonentu apstiprinājumi šajā auditā nav pārbaudīti.

### Darbu secība

| Laiks | Prioritāte un darbs | Pabeigšanas kritērijs |
|---|---|---|
| 26.10.–01.11. | **P0: kalendāra sezonālā pareizība.** Atdalīt elementu dienas skaidrojumu no konkrēta sēšanas uzdevuma. Uzdevumu atlasīt pēc mēneša un audzēšanas apstākļiem; ja piemērotas sējas nav, dot pamatotu sezonas darbu. | Oktobra un novembra “šodien” blokā nav sezonai neatbilstoša aicinājuma sēt siltummīļus. Pārbaudīti ziemas un pavasara piemēri, kā arī gada pāreja. |
| 26.10.–01.11. | **P1: novembra kalendārs.** Izcelt saites “Šis mēnesis” un “Nākamais mēnesis”; papildināt novembra lapu ar īsu, pārbaudītu darbu sarakstu un esošajiem glabāšanas, siltumnīcas un sēklu ceļvežiem. Tukšai sadaļai “Ko sēt” dot jēgpilnu skaidrojumu vai to nerādīt. | Novembris viegli sasniedzams no kalendāra un oktobra lapas. Pamatdarbi ir servera HTML, saitēs nav kļūdu, mobilajā un drukā saturs ir lasāms. |
| 02.11.–08.11. | **P1: `/meness` un `/kalendars` atbilstība meklējumam.** Vispirms iegūt katras lapas pēdējo 28 dienu vaicājumus un apskatīt attiecīgos Latvijas mobilos meklēšanas rezultātus. Kalendāram testēt precīzāku virsrakstu; Mēness lapā skaidri parādīt, vai pilnmēness notikums ir šodien, un tā laiku, arī ja tas jau pagājis. | Katram URL ir atšķirīgs uzdevums: šodienas astronomiskā atbilde, kalendāra pārskats vai konkrētā mēneša darbi. Saglabāta datumu precizitāte un Latvijas laiks. Izmaiņas pierakstītas atsevišķi. |
| 09.11.–15.11. | **P1: neļķes un puķu direktorijs.** Esošajā neļķu URL labot virsrakstu un ziedēšanas terminus, pārbaudīt sugu un ziemcietības atšķirības, pievienot precīzus avotus. No A–Z pievienot saiti uz profilu. Izmēģināt 6–8 tiesiski izmantojamas, pareizi identificētas puķu fotogrāfijas. | Nav dublēta neļķu URL. Puķu laukos netiek sajaukta ziedēšana ar ražu. A–Z saraksts un tā veiksmīgais nosaukums saglabāti; attēli nepasliktina mobilo lietošanu. |
| 16.11.–22.11. | **P2: decembris, 2027. gada sākums un nākamā satura kārta.** Papildināt esošās mēnešu lapas, pārskatīt peoniju pārstādīšanas atbildi un sagatavot vienu nākamo rakstu pēc aktuālajiem lapas vaicājumiem. | Decembra un janvāra saturs atbild uz mēneša praktiskajiem jautājumiem. Pirms jauna raksta pārbaudīta esošā bibliotēka. Pavasara saturs sagatavots laicīgi, nebalstot tā pieprasījumu tikai rudens eksportā. |

Kalendāra iespējamais virsraksta tests: **“Mēness kalendārs 2026 — fāzes un sējas dienas Latvijā”**, ar automātisku gada maiņu un atbilstošu H1. Neļķu variants: **“Neļķes — veidi, audzēšana un pārziemošana Latvijā”**, pēc šo jautājumu pārbaudes un precizēšanas lapā. Mēness lapas esošais virsraksts jau precīzi nosauc šodienas vaicājumu, tādēļ to nemaina tikai zema kopējā CTR dēļ. Google var veidot virsrakstu un aprakstu no vairākiem lapas elementiem; teksta maiņa negarantē konkrētu attēlojumu. [Virsrakstu vadlīnijas](https://developers.google.com/search/docs/appearance/title-link), [aprakstu vadlīnijas](https://developers.google.com/search/docs/appearance/snippet).

Pirmās īstenošanas izmaiņu vietas: `lib/biodynamic.ts`, `app/kalendars/page.tsx`, mēnešu kalendāra veidne un esošie `lib/month-guides.ts` / `lib/seasonal.ts` dati. Neļķu darbā — `content/crops/nelkes.json`, augu veidnes puķu atzars un `app/pukes/page.tsx`. Izvērtēt visas vispārīgā padoma izmantošanas vietas, lai sezonālā neatbilstība nepaliek citā skatā. Neveidot jaunus gada vai mēnešu URL, ja attiecīgais saturs jau pastāv.

### Kā mērīsim rezultātu

1. **Pirms pirmās publicēšanas:** eksportēt GSC pēdējās 28 dienas pret iepriekšējām 28 atsevišķi prioritārajām lapām. Vaicājumu grupas: šodienas Mēness, Mēness kalendārs, mēneša dārza darbi, puķu nosaukumi un neļķes. Latvijas mobilos datus analizēt atsevišķi. Fiksēt publicēšanas datumu un to, ko tieši mainījām.
2. **Pirmajā nedēļā:** pārbaudīt, ka pēc piekrišanas esošie analītikas notikumi patiešām pienāk. Pievienot `calendar_print` drukas pogas klikšķim un izmantot `internal_cta_click` svarīgajām pārejām uz nākamo mēnesi vai saistīto ceļvedi. Drukas klikšķis nav pierādījums pabeigtai drukāšanai. Pārlūka notikumus nesajaukt ar visiem GSC apmeklējumiem.
3. **Lietotāja nākamais solis:** kalendārā izmēģināt vienu sezonai atbilstošu aicinājumu pēc noderīgā satura, piemēram, apstiprināt abonēšanu nākamā mēneša darbu saņemšanai. Izmantot esošo abonēšanas sistēmu. Pirms šāda solījuma pārbaudīt, ka izsūtīšanas process tiešām darbojas. Neļķu un citu augu lapās mērīt esošo pievienošanu dārzam.
4. **Ik nedēļu:** sekot klikšķiem un iespaidiem, aktuālā un nākamā mēneša kalendāriem, kā arī izmaiņām tajos pašos vaicājumos un pozīciju diapazonos. CTR pieaugumu nevērtēt atrauti no meklējumu sastāva. Samazinājums oktobra lapā novembrī pats par sevi nav neveiksme.
5. **Pēc 28 dienām kopš attiecīgās izmaiņas:** salīdzināt lapas un vaicājumus, reālos rīku lietojumus un apstiprinātus abonentus. Ja lapai vēl ir maz iespaidu, pagarināt novērojumu, nepasludināt uzvarētāju pēc dažiem klikšķiem. Noteikt nākamo izmēģinājumu pēc šiem datiem, ne pēc universāla CTR mērķa.

Līdz šīs kārtas izvērtēšanai nepaplašināt darbu uz desmitiem jaunu rakstu, visu virsrakstu nomaiņu vai jaunu veikalu. Augstāk minētās lapas dod konkrētāku pārbaudāmu iespēju. Affiliate sagatavošanu turpināt atbilstoši zemāk esošajam gada plānam pēc satura un lietotāja ceļa pārbaudes.

## Rakstu kvalitātes audits un Latvijas portālu salīdzinājums — 2026-10-06

**Secinājums:** tēmu izvēle ir noderīga, bet esošā satura vienveidīgais ievads, nepārbaudāmi vispārīgie avoti un pārlieku drošie kopšanas solījumi ierobežo kvalitāti. Priekšrocību var veidot skaidra problēmas atšķiršana, izpildāmi soļi, Latvijas apstākļu pamatojums un saikne ar dārza plānošanas rīkiem. Vairāk vārdu vai vairāk rakstu vien šo priekšrocību nerada.

### Aptvērums un robežas

Izvērtētas visu **80 rakstu** tēmas, īsās atbildes, struktūra, iekšējās saites un avotu saraksti. Vienpadsmit prioritārajiem rakstiem galvenās norādes pārbaudītas pēc konkrētiem tematiskiem avotiem un teksts pārrakstīts; augusta pārskatā labotas atlasītas vietas. Pārējiem 68 rakstiem šis ir sākotnējs redakcionāls izvērtējums, ne pilns katra apgalvojuma faktu audits. [Katras lapas statuss un nākamais darbs](content/audits/article-review-2026-10-06.json) glabājas atsevišķi no publicējamajiem rakstiem.

Konkurentu izvērtējums ir konkrētu publiski pieejamu lapu izlase, ne visa Latvijas tirgus vai konkurentu apmeklējuma analīze. Santa abonentiem paredzētajā tomātu dēstu rakstā vērtēts tikai redzamais ievads un ekspertu norādes. Tā pilnais teksts nav izmantots salīdzinājumā.

GSC periods ir **04.07.–03.10.2026.** Tas palīdz izvēlēties jau pieprasītus rakstus, bet neizmēra pavasara meklējumu pieprasījumu. Hortenziju neziedēšanas lapai tajā ir **97 klikšķi, 319 iespaidi un vidējā pozīcija 2,37**. Šai lapai saglabāts esošais URL un virsraksts; uzlabota atbilde un sugu atšķiršana. Neizdarām secinājumu, ka visas tēmas varēs iegūt līdzīgus rezultātus.

### Ko rāda esošie raksti

- Pirms šīs kārtas **66 no 80 rakstiem** saturēja LLKC sākumlapu vai vispārīgo RHS padomu lapu avotu vietā — kopā 130 šādu atsauču. Organizācijas reputācija pati par sevi nepamato konkrētu devu vai iedarbības solījumu. Vienpadsmit pārrakstītajos rakstos šīs atsauces aizstātas; 55 citos tās vēl jāizvērtē.
- Īsā atbilde bieži atkārto stāstījuma sākumu: “Tu stāvi…”, “galvā griežas…”, “sirds saraujas…”. Tas atliek atbildi un atkārto iesācēja satraukumu. Piemēram, dēstu, poda tilpuma un pirmās dobes jautājumā vajadzīga izvēle vai darbība jau pirmajā teikumā.
- Tikai trijos rakstos sākotnēji bija salīdzinājuma tabula. Tagad tādas ir astoņos. Tabulu pievieno tad, ja jāatšķir suga, simptoms vai aprēķins; tā nav prasība katram rakstam.
- Daļa norāžu bija pārāk kategoriskas: skarainai hortenzijai stipra griešana padarīta par ziedēšanas priekšnoteikumu, gurķu rūgtums nosaukts par nekaitīgu, skābēšana apsolīta 3–7 dienās. Pārrakstītajos rakstos šie apgalvojumi laboti. Citās lapās vēl atsevišķi pārbaudāmas mājas maisījumu devas un iedarbība.
- Vairāki pirmā dārza raksti pārklājas. Tas ir redakcionāls pārklājums, ne pierādīta SEO kanibalizācija. Katram jāpiešķir atšķirīgs uzdevums; URL nedzēš bez meklējumu datiem un pāradresāciju pamatojuma.
- Rakstos trūkst oriģinālu simptomu fotogrāfiju un nosaukta Latvijas speciālista ieguldījuma. Atsauce uz ekspertu publicētu darbu nav tas pats, kas šī eksperta pārbaudīts mūsu raksts. Šādu norādi drīkst pievienot tikai pēc faktiskas sadarbības.

### Ko dara Latvijas portāli un ko no tā pārņemt

| Portāls un pārbaudītais piemērs | Novērotā stiprā puse | Mūsu praktiskais uzdevums |
|---|---|---|
| [DārzaABC: tomātu sēklu dīgšana](https://www.darzaabc.lv/lv/tomatu-seklu-digsana) un [tulpju ceļvedis](https://www.darzaabc.lv/lv/pilditas-agras-tulpes) | Rakstā ir audzēšanas informācija, attēls un saistītie produkti. Tomātu piemērā zem teksta redzams plašs sēklu un mēslojuma piedāvājums. | Darba soļus sasaistīt ar vajadzību pēc piederuma. Vēlāk piedāvāt 2–3 pamatotas izvēles un paskaidrot, kad pirkums nav vajadzīgs. Pašu noliktava šādam ceļam nav nepieciešama. |
| [Santa: vai pirkt istabas siltumnīcu](https://www.santa.lv/raksts/mansdarzs/vai-verts-iegadaties-istabas-siltumnicu-63811/) | Konkrēts lasītājas jautājums, nosaukta agronome Mārīte Gailīte, apsvērta arī esošo trauku izmantošana. [Dēstu raksta ievadā](https://www.santa.lv/raksts/mansdarzs/12-vertigi-padomi-tomatu-destu-audzesana-25404/) nosaukta pieredzējusi audzētāja Elga Bražūne; tālāk ir abonēšanas ierobežojums. | Uzticamību veidot ar reālu vietējo ekspertu pieredzi un godīgiem izvēles kritērijiem. Ja atbildi un darbības publicējam brīvi, tām jābūt pietiekami pilnīgām arī bez papildu pirkuma. |
| [LA.lv: hortenziju apgriešana](https://www.la.lv/hortenziju-apgriesana/) | Lasītājas situācijai atbild stādaudzētavas speciāliste Zaiga Graudiņa. Īss, konkrēts jautājuma un atbildes formāts. Pārbaudītajā lapā lasījumu pārtrauc arī ar tēmu nesaistītas ieteikto rakstu saites. | Saglabāt koncentrētu lasījumu un padarīt sugu atšķirības redzamas tabulā. Nosaukt, kādu papildu informāciju lasītājam vajag diagnozei. |
| [LLKC: sausuma riski pavasarī](https://llkc.lv/aktualitates/sausuma-riski-pavasari/) | Māris Narvils saista ieteikumus ar konkrētās Latvijas sezonas mitrumu, vēju, reljefu un dēstu termiņiem. Raksts datēts ar 06.05.2026. | Atsaukties uz konkrēto publikāciju, paskaidrojot tās gadu. Nošķirt pastāvīgu audzēšanas principu no vienas sezonas novērojuma un pārvērst to saprotamā mājas dārza pārbaudē. |

Šie novērojumi nepierāda konkurentu pārdošanu, lasītāju apmierinātību vai meklēšanas pozīcijas. Mūsu secinājums par iespēju dot ērtāku atbildi izriet no salīdzinātās struktūras un mūsu atrastajām satura problēmām.

### Pārrakstītais saturs šajā kārtā

| Raksts | Būtiskais uzlabojums |
|---|---|
| `kapec-hortenzijas-nezied` | Sugu un atkārtoti ziedošo šķirņu tabula; pumpuru, griešanas un augšanas apstākļu pārbaude. |
| `destu-audzesana-uz-palodzes` | Gaisma, temperatūra, trauki un laistīšana pēc vajadzības; lampa nav automātiski obligāts pirkums. |
| `kad-set-destus-rekini-atpakal` | Skaidrs aprēķina sākumpunkts; dīgšanu un norūdīšanu neskaita divreiz; datēts piemērs nav Latvijas universāls termiņš. |
| `tulpju-stadisana-rudeni` | Stādīšana pēc augsnes apstākļiem; dziļuma piemērs ar norādītu mērījuma sākumu. |
| `kapec-gurkiem-balts-aplikums-uz-lapam` | Pazīmju salīdzinājums; noņemtas nepamatotas mājas smidzinājumu receptes. |
| `zemesvezis-siltumnica-ka-atbrivoties` | Vispirms atpazīšana un novērošana; noņemti garantētas iedarbības solījumi par mājas paņēmieniem. |
| `fitoftora-tomatiem` | Rīcība bez ražas glābšanas garantijas; noņemta nepamatotā silta ūdens dezinfekcija un universālā Bordo šķidruma deva. |
| `kapec-tomatiem-bruni-plankumi-uz-lapam` | Vairāku iespējamo cēloņu salīdzinājums; viens simptoms nenosaka mēslojumu vai ārstēšanu. |
| `kapec-gurki-rugti` | Izlabots apgalvojums, ka izteikts rūgtums ir nekaitīgs; to nemaskē ar marinādi. |
| `ka-marinet-gurkus-kraukskigus` | Noņemta nepārbaudīta ilgai glabāšanai paredzēta recepte. Kraukšķīguma ceļvedis novirza uz pilnu pārbaudītu konservēšanas metodi. |
| `skabeti-kaposti` | Sāls svēršana, temperatūra, procesa ilgums un glabāšanas atšķirības pēc pārtikas saglabāšanas avotiem. |

Augusta darbu rakstā papildus labotas īsā atbilde un ražas atlases, lakstu puves un konservēšanas norādes; pārējais teksts vēl nav pārskatīts pilnībā. Pārtikas saglabāšanas raksti netiek noslēgti ar nesaistītu augu pievienošanas vai dārza plānotāja aicinājumu.

Rakstu veidnē pievienoti avoti pie konkrētās sadaļas, ja redaktors tos norādījis. Datuma etiķete ir **“Atjaunots”**; tā neapgalvo, ka rakstu pārbaudījis speciālists. Sākotnējie publicēšanas datumi saglabāti. Tās ir lokāli sagatavotas izmaiņas, ne apstiprinājums, ka saturs jau publicēts.

Pārrakstītajos rakstos saglabāti arī veco sadaļu enkuri pie saturiski atbilstošajām jaunajām vietām. GSC eksportā ir gan raksta URL, gan atsevišķas saites ar `#sadaļa`; tās nav saskaitītas kā atsevišķu lapu apmeklējumi vai izmantotas raksta pamatadreses rādītāju aizstāšanai.

### Nākamās prioritātes

1. **Apgalvojumu pārbaude:** gurķu aizmetņu raksta borskābes deva; sīpolu mušu novēršanas sālsūdens/karstā ūdens paņēmieni; kosas, pelnu un citu uzlējumu efektivitāte rožu, kartupeļu un zemeņu slimībām. Atrastā vieta ir pārbaudes uzdevums, ne automātisks slēdziens, ka viss raksts ir nepareizs.
2. **Pirms pavasara:** norūdīšana, izstādīšana, izstīdzējuši/pārlaistīti dēsti, sēklu nedīgšana, augsnes temperatūra un salnas. Vienā sistēmā jābūt aprēķinam, apstākļu pārbaudei un atbildei, ko darīt, ja pavasaris kavējas.
3. **Iesācēja tēmu sakārtošana:** `pirmais-darzs-no-nulles` ir galvenais darbu ceļvedis; `darza-planosana-iesacejam` ir vietas un dobju plāns; `cik-liela-pirma-dobe` palīdz izvēlēties apjomu; `vieglakie-darzeni-iesacejiem` salīdzina kultūras; `pirma-gada-gaidas` palīdz izvērtēt laiku un rezultātu. Saglabāt katras lapas atšķirīgo nolūku.
4. **Pašu materiāli:** iegūt tiesības uz īstām Latvijas dārzu fotogrāfijām, norādīt datumu, audzēšanas vietas tipu un apstākļus. Ģenerēts attēls nedrīkst aizstāt faktiskas diagnozes vai pašu izmēģinājuma pierādījumu. Vienoties ar ekspertu par konkrētu rakstu pārbaudi; šajā darbā nevienam nav nosūtīta ziņa.
5. **Affiliate pēc satura:** palodzes, sēklu izvēles un siltumnīcas ceļvežos vispirms palīdzēt pieņemt lēmumu, tad dot sezonai atbilstošu piedāvājumu. Nepievienot preci slimības rakstā pirms diagnozes un nepieciešamības pamatojuma.

Jauna raksta tēmu vispirms salīdzina ar esošo bibliotēku. Nākamā rudens iespējamais iztrūkums ir izvērsts ziemas ķiploku stādīšanas ceļvedis; tas jāvērtē kopā ar esošo auga profilu un mēneša ceļvedi, neveidojot dublējošu lapu tikai atslēgvārda dēļ.

### Raksta forma turpmāk

Īsā atbilde → ko pārbaudīt → pazīmju vai izvēļu salīdzinājums, ja vajadzīgs → pirmie izpildāmie soļi → nosacījumi, kad padoms neder → profilakse → īsti papildu jautājumi → avoti un nākamais noderīgais rīks. Garumu nosaka jautājums. Saglabāt draudzīgu **tu** uzrunu, bet neatkārtot lasītāja paniku un nesolīt rezultātu, ko nevar pamatot. Mēness tradīciju skaidrot tai atbilstošajā kontekstā, neatkārtojot vienādu atkāpi katrā slimību rakstā.

### Izmaiņu pārbaude

Satura validācija izturēta visiem 80 rakstiem; paliek 21 jau zināms brīdinājums par nepievienotu FAQ. Produkcijas būve izveido 318 lapas, izturēti astoņi esošie regresijas testi. Ģenerētajos 80 rakstos pārbaudīta 5941 saite un 61 vecās sadaļas enkurs; kļūdu nav. Hortenziju rakstā 360 px skatā lapas platums ir 360 px un salīdzinājuma tabula kļūst par trim kartītēm. Šīs pārbaudes apliecina satura struktūru un attēlojumu, ne pārējo 68 rakstu faktu pareizību.

## Gada saturs un affiliate ieviešana

Vienošanās 2026-10-06: vispirms uzlabojam noderīgu saturu visam gadam, pēc tam pievienojam konkrētā auga un sezonas darbam atbilstošus partneru piedāvājumus. Rudens meklējumu sadalījumu nepārnesam uz pavasari. Pavasara pieprasījums ir darba hipotēze, ko pārbaudām 2027. gada pavasarī; pievienotais GSC pārskats aptver 04.07.–03.10.2026.

### Satura pamats, kas sagatavots lokālajā projektā

- Visiem 12 `/ko-set/{menesis}` ceļvežiem ir īsā atbilde, praktiski darbi, saites uz turpmāku lasāmvielu un konkrēti avoti. Jūlija esošā otrās ražas izlase saglabāta. Ārvalstu audzēšanas paņēmieni pielāgoti Latvijas apstākļiem, nepārņemot sējas datumus kā vietējos termiņus.
- Rakstu bibliotēkā pievienota mēneša izvēle. Sezonālie mēneši pievienoti 63 esošajiem rakstiem, saglabājot to sākotnējos teksta pārskatīšanas datumus. Seši vispārīgie Mēness un biodinamikas uzziņas raksti paliek pieejami visa gada bibliotēkā.
- Pievienoti trīs ceļveži: sēklu izvēle, sēklu glabāšana un dīgtspējas pārbaude, siltumnīcas sagatavošana sezonai. Tie savienoti ar mēnešu un radniecīgajiem rakstiem.
- Dāliju glabāšanas raksts pārskatīts pēc tematiskiem RHS un universitātes avotiem. Laboti glabāšanas apstākļi un neapkurināta šķūņa ieteikums; noņemti nesaistītie avoti un nepamatotā skaidu pretsēņu priekšrocība.
- Visu 80 rakstu sākotnējais izvērtējums un vienpadsmit pārrakstīto rakstu kārta aprakstīta augstāk. Atlikušo rakstu apgalvojumus turpina pārbaudīt atbilstoši konkrētās lapas statusam.

### Gada tēmas un preču konteksts

Preču kolonna ir redakcionāls virziens nākamajam posmam, ne aktivizēts sortiments. Piedāvājumu izvēlas tikai tad, ja raksts pamato vajadzību, ir piemērots partneris un pārbaudīta piegāde uz Latviju.

| Mēnesis | Satura uzdevums | Iespējamā vajadzība pēc precēm |
|---|---|---|
| Janvāris | Dobju plāns, sēklu atlikumi, dīgtspējas pārbaude | Marķieri un sēklu glabāšana; vispirms izmantot esošos piederumus |
| Februāris | Dēstu laika aprēķins, šķirnes, gaisma | Sēšanas trauki, substrāts, audzēšanas lampa, ja tā vajadzīga |
| Marts | Tomātu dēsti, laistīšana, siltumnīcas sagatavošana | Podi, paliktņi, termometrs; sēklas pēc audzēšanas vietas |
| Aprīlis | Aukstumizturīgo sēja, augsnes stāvoklis, salnas | Sēklas, augsnes termometrs, segmateriāls |
| Maijs | Norūdīšana, stādīšana, balkona un puķu izvēle | Vietējie stādi, balsti, podi un stādīšanas piederumi |
| Jūnijs | Ieaugšana, balsti, vēdināšana, laistīšana | Piesienamie materiāli un laistīšanas aprīkojums |
| Jūlijs | Otrā raža un problēmu atpazīšana | Atbilstošās sēklas, laistīšana; pirkums tikai pēc diagnozes |
| Augusts | Raža, zemenes, ziemciešu dalīšana | Stādi un ražas savākšanas piederumi |
| Septembris | Ražas atlase, sīpolpuķes, augsnes segums | Sīpolpuķes un stādīšanas piederumi atbilstoši sugas termiņiem |
| Oktobris | Ziemas ķiploki, tulpes, dāliju izrakšana | Stādmateriāls, kastes, glabātavas termometrs |
| Novembris | Pārziemošana, instrumenti, glabāšana | Augam piemērots segums, piederumi instrumentu kopšanai |
| Decembris | Sezonas izvērtēšana un nākamā gada saraksts | Plānota izvēle pēc vajadzības; bez mākslīgas steidzināšanas |

### Darba secība līdz 2027. gada pavasarim

1. **2026. gada oktobris–novembris:** turpināt ķiploku, ražas glabāšanas un ziemas aizsardzības ceļvežu pārbaudi. Tulpju un dāliju raksti jau uzlaboti. Konservēšanas un skābēšanas norādes pārskatītas atsevišķi pēc pārtikas saglabāšanas avotiem.
2. **Decembris–janvāris:** pārskatīt pirmā dārza, augu maiņas un šķirņu izvēles saturu. Pavasara rakstus sagatavot iepriekš, negaidot pirmo klikšķu pieaugumu. Trīs jaunie sagatavošanas ceļveži ir šī posma sākums.
3. **Janvāris–februāris:** pārbaudīt partneru aktuālos nosacījumus un atlasīt vienu inventāra partneri un vienu vietējo audzētāju. Dēstu laika aprēķins un palodzes ceļvedis jau pārrakstīti; pārskatīt atlikušos norūdīšanas, izstādīšanas un problēmu rakstus.
4. **Februāris–marts:** pēc partnera apstiprinājuma un satura pārbaudes izvietot nelielu izmēģinājumu piecās piemērotās lapās ar 10–15 atlasītiem piedāvājumiem. Sākt ar sēklām, dēstu piederumiem un siltumnīcas sagatavošanu; nepārdot universālu līdzekli visām augu problēmām.
5. **Aprīlis–maijs:** piedāvājumus rotēt uz norūdīšanu, izstādīšanu un vietējiem stādiem. Novērtēt apstiprinātos pirkumus un piegādes pieredzi pa kategorijām. Tikai pēc pirkumu pierādījumiem izvērtēt nelielu savu sortimentu ar partnera piegādi.

Šie ir darba posmi, ne izveidota automatizācija vai garantēti partneru līgumi. Saturu publicē pēc pārbaudes, lai meklētāji var to atklāt pirms sezonas; publicēšana negarantē indeksāciju vai pozīcijas.

### Partneru kandidāti un nezināmie nosacījumi

- **220.lv / Tradedoubler:** [publiska programma](https://directory.tradedoubler.com/sv/programs/380228-220-lv), līdz 10% par apstiprinātu pārdošanu, 30 dienu attiecināšanas periods, dziļās saites un produktu datu plūsmas. Konkrētā dārza kategorijas komisija un vietnes pieņemšana vēl jāpārbauda. Programmas aprakstā un formātu tabulā ir atšķirības par teksta saitēm; piemēroto redakcionālo formātu saskaņo ar programmas pārvaldītāju. Marketplace piedāvājumiem atsevišķi pārbauda pārdevēju, pieejamību un piegādi.
- **Vietējā stādaudzētava:** piemēram, [Siguldas dārznieks](https://www.siguldasdarznieks.lv/) vai [Skaisto Dārzu Darbnīca](https://sdd.lv/stadu-audzetava/) ar atbilstošu sortimentu un pasūtīšanu internetā. Publiska affiliate vienošanās nav apstiprināta. Sarunai sagatavo komisiju par apmaksātiem pasūtījumiem, kodu vai izsekošanas saiti un mēneša saskaņošanu; partneris pieņem pasūtījumu un izpilda piegādi.
- **Preces Saimniecībai:** [publiski piedāvā tiešu piegādi klientam](https://precessaimniecibai.lv/vairumtirdznieciba/). Pirms sava veikala jānoskaidro faktiskā starpība starp iepirkuma un pārdošanas cenu, nosūtīšanas izmaksas, atlikumu atjaunošana, atgriešana un atbildību sadalījums. Pirmajā affiliate izmēģinājumā savs checkout nav vajadzīgs.
- **Amazon.de:** [standarta dārza kategorijas komisija pašlaik ir 3%](https://partnernet.amazon.de/help/node/topic/GRXPHT8U84RAYDXZ?web=1). Izvērtē tikai konkrētus plānotus aprīkojuma pirkumus ar pārbaudītu piegādi uz Latviju un gala cenu. Tā nav vietējo stādu partnera aizstāšana.

Nosacījumi pārbaudīti 2026-10-06; pirms ieviešanas pārbauda vēlreiz. Neviena programma vai individuāla sadarbība šajā darbā nav aktivizēta.

### Kā ieviesīsim affiliate piedāvājumus

Pirmā versija: raksts vai mēneša darbs → īss vajadzības skaidrojums → 2–3 atlasīti piedāvājumi → pirkums pie nosauktā partnera. Vienam darbam vēlams vienā veikalā iegādājams piedāvājums, lai maziem pirkumiem nesakrājas vairākas piegādes maksas. Ja piederums jau ir mājās, raksts iesaka to izmantot.

- Atsevišķi glabā **darba tēmu** un **tirgotāja piedāvājumu**. Darba tēmai ir mēneši, attiecīgās lapas un izvēles kritēriji; piedāvājumam ir `offer_id`, `merchant_id`, preces saite, apstiprinātā tracking saite, Latvijas piegādes nosacījumi un pārbaudes datums. Gadskārtēju URL nemaina, kad mainās partneris.
- Mēnesis nosaka piedāvājuma piemērotību, ne pienākumu parādīt preci. Salnas, laistīšana un augu problēmas jāizvērtē pēc faktiskajiem apstākļiem. Konkrēta “Mans dārzs” auga piesaiste ir nākamais posms pēc izmēģinājuma rezultātiem.
- Cenu un pieejamību rāda tikai no uzturama datu avota. Ja nav uzticamas atjaunošanas, aicina pārbaudīt cenu un piegādi pie partnera. Novecojušu vai nepieejamu piedāvājumu izņem; neģenerē pilnu veikala katalogu bez noderīga skaidrojuma.
- Skaidri norāda, ka saite ir partnera piedāvājums un vietne var saņemt komisiju. Apmaksātām saitēm lieto `rel="sponsored"`; [Google norādes](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links). Produktam nepiedēvē personīgu pārbaudi, atsauksmes vai vērtējumu, kas nav iegūts.
- Pēc aktivizēšanas pievieno `affiliate_outbound` notikumu ar piedāvājuma, partnera un izvietojuma ID. Esošie mēneša, gada un sezonas parametri saglabā kontekstu; analītiku sūta tikai ar piekrišanu. Partnera pasūtījumu uzskaiti saskaņo atsevišķi — izejošs klikšķis vēl nav pirkums.

### Izmēģinājuma vērtēšana

Skaita piedāvājuma skatījumus, pārejas pie partnera, apstiprinātos pasūtījumus, noraidītās vai atgrieztās pārdošanas un faktiski apstiprināto komisiju. Aprēķina pāreju īpatsvaru un komisiju uz vienu pāreju. Satura apmeklējumu denominatori nāk no analītikas ar skaidri norādītu piekrišanas aptvērumu; GSC klikšķi nav visi vietnes apmeklējumi.

Salīdzina vienā sezonā, pa preču kategorijām un partneriem. Ar mazu pāreju skaitu vienas nedēļas nulles pārdošana nepierāda, ka modelis neder. Ņem vērā partnera apstiprināšanas aizkavi; pēc dažiem pirkumiem vēl nesola stabilus ienākumus. Pievienotajā GSC pārskatā pēdējās 28 dienās ir 208 klikšķi, tāpēc pirmais uzdevums ir pārbaudīt pirkumu ceļu un vienlaikus turpināt satura izaugsmi.

## Sezonalitāte un salīdzināšana

- Rudens eksports nosaka rudens prioritātes. Tas nepasaka, kuras tēmas būs svarīgākās pavasarī: dēsti, sēja, salnas un stādīšana jāvērtē savā sezonā.
- Iepriekšējās 28 dienas izmanto īstermiņa diagnostikai. SEO izmaiņu ietekmi vērtē pie salīdzināma vaicājumu, lapu un ierīču sadalījuma; kad ir vēsture, salīdzina arī to pašu periodu iepriekšējā gadā.
- Kopējais CTR un vidējā pozīcija var mainīties, jo mainās vaicājumu sastāvs. Šie rādītāji vieni paši nepierāda ne sezonālu kritumu, ne tehnisku problēmu.
- Vietnes kopējos rādītājus ņem no GSC grafika (`Chart`), nevis saskaita `Pages` rindas. Lapu griezums var summēt vairākus vienas meklēšanas rezultātus.
- Sezonālo saturu un URL saglabā visu gadu. Nākamās sezonas svarīgākās lapas pārskata 6–8 nedēļas pirms darbu sākuma; neaktīvas sezonas klikšķu kritums nav iemesls dzēšanai vai pāradresācijai.
- Nulle iespaidu nav pierādījums neindeksētai lapai. Statusu pārbauda URL Inspection un lapu indeksācijas atskaitē, ņemot vērā atskaites atjaunošanas datumu.

## Latviešu valodas kvalitātes vārti

Rakstu nedrīkst publicēt, kamēr nav izpildīts viss saraksts:

- Teksts skan kā latviešu dārznieka teikts, nevis tulkots no angļu valodas.
- Visur lietota viena uzruna — **tu** — un pareizi locīti augu nosaukumi.
- Virsrakstā un ievadā nav mehāniski sabāztu atslēgvārdu vai viena teikuma atkārtojumu.
- Īsā atbilde uzreiz atbild uz jautājumu; tajā nav dekoratīva ievada.
- Norādījumi ir izpildāmi Latvijas apstākļos un neizsaka nepamatotu pārliecību.
- Devas, pārtikas drošības ieteikumi, sāls, mēslojums un augu aizsardzības līdzekļi pārbaudīti atsevišķi.
- Vismaz divi avoti tieši atbalsta raksta galvenos apgalvojumus.
- Rakstu skaļi pārlasa. Neveiklas konstrukcijas, kalki un pārlieku gari teikumi tiek pārrakstīti.
- `npm run content:validate` un `npm run build` beidzas bez kļūdām.

## Nedēļas cikls

### Pirmdiena — dati un izvēle (60 min)

1. Search Console eksportē “Last 28 days” un iepriekšējās 28 dienas.
2. Pieraksta klikšķus, iespaidus, pozīcijas un CTR, Brevo apstiprinātos kontaktus, saglabātus pirmos augus un atgriešanos dārzā. Atzīmē mēnesi un sezonu.
3. Atjauno vienu lapu ar vismaz 20 seansiem, 4.–15. pozīciju un CTR zem 5%.
4. Izvēlas divas sezonālas tēmas, pārbaudot, vai vietnē jau nav lapas ar tādu pašu meklēšanas nolūku.

### Otrdiena–ceturtdiena — saturs

- Vispirms divi būtiski prioritāro rakstu atjauninājumi. Jaunu rakstu pievieno tikai atsevišķam neatbildētam jautājumam, kas nedublē esošo saturu; apjomu pakārto pārbaudes iespējām.
- Katram rakstam aizpilda intentu, primāro vaicājumu, īso atbildi, entītijas, datumus, avotus un saites.
- Saites ved uz augu, kaitēkli, recepti, kalendāru un nākamo noderīgo rakstu, ja tie tiešām attiecas uz tēmu.

### Piektdiena — pārbaude un izplatīšana

1. Palaiž satura validāciju un produkcijas būvi.
2. Mobilajā 360 px skatā pārbauda īso atbildi, satura rādītāju, tabulas, e-pasta formu un CTA.
3. Publicē vienu atbildes kartīti un vienu sezonas darbu sarakstu.
4. UTMs: `utm_source=facebook&utm_medium=organic_social&utm_campaign=lv_garden_{year}_q{quarter}&utm_content={slug}-{answer|checklist}`; gadu un ceturksni aizpilda pēc publicēšanas datuma.
5. Pieraksta izvietošanas datumu, mainīto SEO virsrakstu un sākuma rādītājus.

## Brevo iestatīšana

1. Izveido aktīvu Double Opt-in transakcijas veidni un tās ID ievieto `BREVO_DOI_TEMPLATE_ID`.
2. Veidnē lieto Brevo DOI saiti un skaidri pasaki, ka cilvēks apstiprina Mēness Sējas sezonas jaunumu saņemšanu.
3. Izveido automatizāciju: **kontakts pievienots sarakstam 5 → nosūtīt vienu sveiciena vēstuli**.
4. Sveiciena vēstules tēma: `Tavs Mēness Sējas sezonas ceļvedis`.
5. Vēstules saturs: īss aktuālajam mēnesim atbilstošs darbu saraksts, saite uz `/ko-set`, saite uz `/kalendars`, poga uz `/?pievienot=izveleties`, privātuma un atrakstīšanās saites. Brevo veidnes un automatizācijas pārskata atsevišķi — koda izmaiņas tās neatjauno.

## Sociālo ierakstu forma

Atbildes kartīte dod atbildi pašā ierakstā: simptoms → ticamākais cēlonis → pirmā darbība. Saite ved uz pilnu diagnostiku. Sezonas kartīte rāda 5–7 darbus, ko Latvijā darīt šonedēļ. Publicē tikai grupās, kuru noteikumi atļauj projekta saites; automātiska pārpublicēšana nav atļauta.

## Lēmumu robežas

- Vienu SEO virsrakstu nemaina biežāk kā reizi 21 dienā.
- Ja divas nedēļas pēc kārtas atjauninātai lapai klikšķi krīt vairāk par 25% bez sezonāla iemesla, atjauno iepriekšējo virsrakstu un aprakstu.
- AdSense paliek izslēgts līdz 10 000 mēneša seansiem.
- Kontu sinhronizāciju nereklamē līdz 300 īstām viesu dārza aktivizācijām vai atkārtotiem pieprasījumiem pēc sinhronizācijas.
- Ja sezonāli aktuāls klasteris 45 dienas nerāda iespaidus, vispirms pārbauda indeksāciju un meklēšanas nolūku. Ārpus sezonas saglabā saturu un vērtē to nākamajā atbilstošajā periodā.

## Nedēļas lēmumu žurnāls

### 2026-10-06 — sezonāla prioritāšu rotācija un mērījumu precizitāte

Jaunā eksporta grafiks (04.07.–03.10.): **619 klikšķi, 12 731 iespaids, CTR 4,86%, vidējā pozīcija 10,65**. Vienāda garuma periodi: 09.08.–05.09. — 149 klikšķi / 1 971 iespaids; 06.09.–03.10. — 208 / 6 489. Pieaugums un vaicājumu maiņa nav automātiski piedēvējami SEO izmaiņām. Šis ir vasaras beigu un rudens bāzes periods; pavasara veiktspēja jāvērtē atsevišķi.

Ieviests kodā:

1. Mēness fāžu astronomisks aprēķins un Latvijas laika zonas robežas. Oktobra jaunais Mēness ir **10.10.2026. plkst. 18.50**, nevis 11. oktobrī. Regresijas pārbauda 27 USNO fāžu laikus un visus 36 ģenerētos mēnešus. Biodinamisko elementu dienu modelis paliek atsevišķs.
2. Sezonas saites katram no 12 mēnešiem kalendārā un sējas ceļvežos; rakstu izlase atjaunojas katru stundu pēc Latvijas mēneša. Pavasara, vasaras un rudens puķu lapām ir abpusējas saites ar augu ceļvežiem un tematiski kopšanas raksti. Teksts vairs nesauc rudens stādīšanu par “tagad” visa gada garumā.
3. Jaunumu apstiprinājuma lapas nākamais solis atbilst pašreizējam mēnesim; auga izvēle nav piesaistīta tomātiem. Sitemap datumi atjaunoti tikai mainītajām lapām.
4. GA4 notikumiem pievienoti `garden_year`, `garden_month`, `garden_season` un `page_path`. Google rindā lietots standarta `arguments` objekts. Notikumi tiek sūtīti tikai ar analītikas piekrišanu.

Mērījumu definīcijas pēc izvietošanas:

| Notikums | Ko tas nozīmē |
|---|---|
| `garden_add_completed` | Augs saglabāts pārlūka krātuvē vai veiksmīgi mākonī; piemēraugi netiek skaitīti. |
| `garden_activated` | Saglabāts pirmais īstais augs līdz tam tukšā dārzā. GA4 vērtē unikālos lietotājus; iztukšota dārza sākšana var atkārtot notikumu. |
| `garden_return` | Apmeklētājs ar īstu dārzu atgriezies citā Latvijas kalendāra dienā; ne vairāk kā viens notikums dienā šajā pārlūkā. |
| `newsletter_submit` | Formas nosūtīšanas mēģinājums. |
| `newsletter_pending` | Brevo pieņēmis DOI pieprasījumu; adrese vēl jāapstiprina. |
| `newsletter_confirmation_view` | Atvērta publiskā lapa pēc DOI saites. Tas neaizstāj Brevo apstiprināto kontaktu skaitu. Iepriekšējais `newsletter_confirmed` šo atšķirību nenodalīja. |

GA4 jāreģistrē mēneša, gada un sezonas parametri kā notikumu pielāgotās dimensijas, un pēc izvietošanas jāpārbauda jaunie notikumi. Faktiskos DOI apstiprinājumus vērtē Brevo; koda HTTP 400 kļūda vairs netiek interpretēta kā jau apstiprināta adrese. Šajā darbā Brevo automatizācijas un GA4 administrācijas iestatījumi nav mainīti.

Indeksācijas pārbaude: 21.09. atskaite ir vēsturiska; 06.10. URL Inspection `/pukes/kas-zied/rudeni` uzrādīja “URL unknown to Google”. Pēc izvietošanas pārbauda šo URL, kā arī pavasara un vasaras lapas, un vajadzības gadījumā pieprasa indeksāciju. Iekšējās saites un sitemap palīdz atklāšanai, bet negarantē indeksāciju.

Piezīme agrākajiem ierakstiem: augustā minētie URL bez iespaidiem nebija pārbaudīti ar URL Inspection, tāpēc tos nevar uzskatīt par apstiprināti neindeksētiem. Vēsturiskās `Pages` summas arī nav vietnes grafika kopējie iespaidi; tās nedrīkst tieši salīdzināt ar jaunā eksporta kopējiem rādītājiem.

### 2026-07-14 — Search Console eksports līdz 2026-07-10

Salīdzinātas kumulatīvās `2026-06-29` un `2026-07-13` izklājlapas. Tā kā vietne ir jaunāka par 28 dienām, šajā ciklā izmantots viss pieejamais dienu griezums un no jaunākā kumulatīvā eksporta atņemts iepriekšējais.

| Periods | Dienas | Klikšķi | Iespaidi | CTR | Klikšķi dienā | Iespaidi dienā |
|---|---:|---:|---:|---:|---:|---:|
| 16.–27. jūnijs | 12 | 57 | 821 | 6,94% | 4,75 | 68,4 |
| 28. jūnijs–10. jūlijs | 13 | 229 | 4 292 | 5,34% | 17,62 | 330,2 |

Klikšķu temps pieauga 3,7 reizes, bet iespaidu temps — 4,8 reizes. CTR kritums par 1,6 procentpunktiem šajā posmā sakrīt ar strauju jaunu vaicājumu un lapu parādīšanos, tāpēc galvenais darbs ir uzlabot jau pirmajā lapā esošo rezultātu atbilstību, nevis mainīt uzvarētāju virsrakstus.

Augstākās jaunā perioda lapu iespējas pēc noteikuma `iespaidi ≥ 20, pozīcija 4–15, CTR < 5%`:

| Lapa | Klikšķi | Iespaidi | CTR | Pozīcija | Lēmums |
|---|---:|---:|---:|---:|---|
| `/raksti/kapec-gurkiem-dzelte-lapas` | 2 | 208 | 0,96% | 9,45 | Virsraksts atsvaidzināts 14.07.; nemainīt līdz 04.08. Stiprināt apakšklasteri un iekšējās saites. |
| `/raksti/kapec-gurku-aizmetni-dzelte-un-nokrit` | 7 | 150 | 4,67% | 8,62 | Nākamais kandidāts, ja nav mainīts pēdējās 21 dienās. |
| `/augi/rediisi` | 2 | 124 | 1,61% | 6,70 | Jau atsvaidzināts; mērīt, nevis uzreiz mainīt vēlreiz. |
| `/ko-set/julijs` | 4 | 107 | 3,74% | 7,43 | Jau pastiprināts; saglabāt URL un mērīt līdz sezonas beigām. |
| `/raksti/kad-parstadit-peonijas` | 3 | 101 | 2,97% | 10,73 | Augusta sākuma sezonālais kandidāts. |
| `/kaitekli/tiklerces` | 3 | 96 | 3,13% | 8,52 | Jau atsvaidzināts; uzlabot ienākošās saites no gurķu klastera. |

Vaicājums `magnija trūkums gurķiem` deva 93 jaunus iespaidus, 0 klikšķu un aptuveno pozīciju 8,93. Lēmums: nemainīt tikko atsvaidzināto galvenā gurķu raksta SEO virsrakstu; pārbūvēt `/raksti/magnija-trukums-augiem` kā drošu diagnostikas apakšlapu ar primāro vaicājumu `magnija trūkums augiem`, precīziem Latvijas un universitāšu avotiem, bez universālām Epsom sāls vai dolomīta devām, un abpusējām iekšējām saitēm.

### 2026-08-19 — Search Console eksports (pēdējie 3 mēneši)

Salīdzinātas `2026-07-13` un `2026-08-19` kumulatīvās izklājlapas.

| Eksports | Klikšķi | Iespaidi | CTR | Lapas ar iespaidiem |
|---|---:|---:|---:|---:|
| 13.07. | 286 | 5 447 | 5,25% | 174 |
| 19.08. | 501 | 9 216 | 5,44% | 220 |
| Starpība | +215 | +3 769 | — | +46 |

Latvija dod 496 no 501 klikšķa. Mobilajā pozīcija 6,93 un CTR 6,78%; datorā pozīcija 26,24 un CTR 3,92% — datora iespaidi nāk galvenokārt no puķu galvas vaicājumiem, kuros vietne ierindojas dziļi.

**Sezonalitāte pret redzamības svārstībām — divi atsevišķi efekti.** Klasteru delta starp visiem četriem eksportiem:

| Klasteris | 22.→29. jūn | 29. jūn→13. jūl | 13. jūl→19. aug |
|---|---:|---:|---:|
| Puķes | +281 | +1 624 | +1 902 |
| Tomāti | +98 | +562 | +212 |
| Gurķi | +66 | +464 | +109 |
| Sīpoli | +88 | +262 | +63 |
| Cukīni | 0 | +200 | +45 |
| Kaitēkļi | +28 | +178 | +201 |
| Kalendārs | +34 | +298 | +292 |

Mēneša mērogā tēmu rotācija ir reāla un nosaka plānošanu: dārzeņu problēmu klasteri atdziest (tomāti −62%, gurķi −76%, cukīni −78%, sīpoli −76%), kamēr puķes, kaitēkļi un kalendārs aug.

Dienas mērogā darbojas atsevišķs efekts, ko sezonalitāte neizskaidro. Grafiks sadalās divos režīmos: 33 “labās” dienas ar vidēji 219 iespaidiem pie pozīcijas 10,6 un 27 “klusās” ar vidēji 49 iespaidiem pie pozīcijas 36,3. Trīs pārbaudes to nošķir no pieprasījuma: pozīcija pasliktinās 3,4 reizes vienlaikus ar kritumu, lai gan sezonāls pieprasījums maina tikai iespaidu skaitu pie nemainīgas pozīcijas; klusākais posms (12.–29. jūlijs) sakrīt ar puķu sezonas maksimumu, kad puķes dod 55% iespaidu; un atgriešanās ir pēkšņa — 29. jūlijā 18 iespaidi pozīcijā 39,4, bet 31. jūlijā 292 iespaidi pozīcijā 7,6. Nedēļas dienu sadalījums neuzrāda modeli. Klusajās dienās vidējais iespaidu skaits ir zemāks nekā viss ne-puķu saturs kopā (~90 dienā), tāpēc efekts ir vietnes līmeņa, ne viena klastera.

**Indeksācijas caurums.** 65 no 263 sitemap URL trīs mēnešos nav devuši nevienu iespaidu, tostarp visi 22 raksti, kas publicēti 6. jūlijā (`fitoftora-tomatiem`, `darza-darbi-augusta`, `ka-marinet-gurkus-kraukskigus`, `avenu-apgriesana-pec-razas` u.c.). Visi 77 raksti ir SSR HTML `/raksti` sarakstā, tātad tie nav bāreņi — problēma ir indeksācijā, ne atklāšanā. Sitemap gan visiem rakstiem lika vienu un to pašu `lastmod`, tāpēc Google nesaņēma signālu, ka 6. jūlijā parādījās kaut kas jauns.

**Kanibalizācija — cēlonis nav tas, kas izskatījās.** `/augi/samtenes` un `/augi/saulespukes` jau pāradresēja uz `/pukes/*`, bet ar Next.js `redirect()`, kas dod **307 (pagaidu)**. Google pagaidu pāradresācijā nesaliek kopā ranga signālus un patur veco URL indeksā. Neļķes ir atsevišķs gadījums: tās dzīvo tikai `/augi/nelkes` (186 iespaidi, pozīcija 19,83, 1 klikšķis), lai gan vaicājums `neļķes` ir puķu nolūka (135 iespaidi, pozīcija 23,46, 0 klikšķu) un `/pukes` sadaļā satura lapas nav.

**Kodola lapas nesasniedz meklētāju.** `/kalendars`, `/celvedis`, `/meness` un `/planotajs` ir `"use client"` komponentes ar `if (!mounted) return staticHeader`, tāpēc pirmsatveidotajā HTML nonāk tikai navigācija un viena rindkopa — `/kalendars` gadījumā 267 prozas vārdi. Tas izskaidro, kāpēc vietnes nosaukuma vaicājums `mēness kalendārs` ir pozīcijā 22,69 un `/kalendars` — pozīcijā 33,76 ar 1,1% CTR, kamēr servera pusē atveidotā `/kalendars/2026/augusts` ir pozīcijā 6,48 ar 21,1% CTR.

**Puķu klasteris — galvenā iespēja.** `/pukes` A–Z lapa dod 1 658 iespaidus un 124 klikšķus; vaicājums `puķu nosaukumi alfabēta secībā` ir pozīcijā 2,42 ar 29,5% CTR. Atsevišķās puķu lapas turpretī nekonkurē: `/pukes/tulpes` 84 iespaidi pozīcijā 47,7; `/pukes/peonijas` 74 pozīcijā 41,5; `/pukes/rozes` 38 pozīcijā 46,5; `/pukes/narcises` 28 pozīcijā 32,0; `/pukes/hortenzijas` 28 pozīcijā 33,7. Rudens ir sīpolpuķu stādīšanas sezona, tāpēc tulpes un narcises jāstiprina tagad.

**Iespaidi bez klikšķiem pie labas pozīcijas.** `magnija trūkums gurķiem` 107 iespaidi, pozīcija 8,87, 0 klikšķu (tas pats lēmums pierakstīts 14.07. un nav izpildīts). `ziemas redīsi` 63 pozīcijā 10,08. `fitoftora tomātiem` 51 pozīcijā 10,02, kamēr veltītais raksts nav indeksēts. `tīklērces apkarošana` 43 pozīcijā 9,37. `daudzgadīgās puķes kas zied visu vasaru` 44 pozīcijā 9,89. `kad pārstādīt peonijas` 32 pozīcijā 9,88.

**Izpildīts 19.08.**

1. `/augi/[slug]` puķu pāradresācija pārslēgta no `redirect()` uz `permanentRedirect()` — pārbaudīts, atbild 308.
2. Sitemap saņem īstus datumus: raksti no `updatedAt`, kaitēkļu lapas no to `updatedAt`, `/raksti` no jaunākā raksta. Deviņi atšķirīgi `lastmod` viena vietā. Datu lapas (augi, puķes, mēneši) patur `DATA_REVIEWED`, kas ir reāls pārskatīšanas datums.
3. `/kalendars` pārbūvēta par servera komponenti: interaktīvais režģis pārcelts uz `components/calendar-explorer.tsx`, bet lapa servera pusē atveido šodienas Mēness fāzi un elementu dienu, mēneša jauno un pilno Mēnesi, nelabvēlīgās dienas, mēneša padomu un visas četras elementu dienu grupas ar saitēm uz sējamajiem augiem. `revalidate = 3600`, lai datētais bloks nenoveco.

4. `/meness` pārtaisīta par tīru servera lapu. Tajā nebija ne stāvokļa, ne notikumu apstrādes — `useMounted` bija tikai hidratācijas dēļ, tāpēc klienta puse nebija vajadzīga vispār. Mēness fāze, tuvākās fāzes un nedēļas elementu dienas tagad ir HTML.
5. `/celvedis` sadalīta tāpat kā kalendārs: filtrs pārcelts uz `components/sowing-guide.tsx`, bet lapa servera pusē atveido pilnu 75 kultūru sējas un ražas tabulu pa kategorijām, ar saitēm uz katra auga lapu.
6. `cropHref()` izcelts `lib/flowers.ts`. Šis modelis jau bija `app/augi/page.tsx` un `app/kaitekli/[slug]/page.tsx`, bet septiņas citas lapas to nelietoja un saitēja uz `/augi/<puķe>`, kas tagad pāradresē. Pirmsatveidotajā HTML bija 17 tādas saites; tagad nav nevienas.

Prozas vārdi pirmsatveidotajā HTML: `/celvedis` 670, `/kalendars` 442, `/meness` 329.

**Nezināmais, kas jāizlemj atsevišķi.** `lib/moon.ts` lieto vidējo sinodisko modeli — lineāru skaitīšanu no zināma jauna Mēness ar fiksētu 29,530588853 dienu periodu, bez Mēness anomālijas korekcijas. Tas ir pietiekami, lai pateiktu, vai Mēness aug vai dilst, bet precīzie pilnmēness datumi atšķiras no īstajiem līdz vienai dienai. Tāpēc `/meness` lapā iesāktā gada pilnmēness tabula tika noņemta — 26 datumu saraksts ir pārbaudāms sekundēs, un kļūda tieši tajā apdraud to, ko vietne pārdod. Tā pati nobīde jau ir mēneša lapu blokos «Jauns Mēness» un «Pilns Mēness». Modeļa uzlabošana skartu katru kalendāra lapu un elementu dienu klasifikāciju, tāpēc tas ir atsevišķs lēmums.

**Nākamie soļi.**

1. `/planotajs` atstāta kā ir. Tas ir īsts interaktīvs rīks ar `localStorage` plāniem, tam meklēšanas pieprasījuma praktiski nav, un servera pusē tur nav ko godīgi atveidot.
2. 22 neindeksētie 6. jūlija raksti jāpārbauda GSC lapu indeksācijas atskaitē; sitemap datumi tagad dod Google iemeslu tos pārrāpot.
3. `/pukes/nelkes` jāizveido un `/augi/nelkes` jāpāradresē uz to.
4. Rudens saturs jāraksta pirms pieprasījuma, ne pēc: sīpolpuķu stādīšana (`tulpes` pozīcijā 47,7 un `narcises` pozīcijā 32,0 tieši pirms savas sezonas), ziemas ķiploki, ražas glabāšana un skābēšana. Septembrī raksta oktobri.
5. Dārzeņu problēmu raksti netiek dzēsti — tie atkal iedegsies maijā un jūnijā. Tagad tur laiku neiegulda.
6. `magnija-trukums-augiem` darbs no 14.07. joprojām nav izpildīts; 107 iespaidi pozīcijā 8,87 bez neviena klikšķa ir lielākā atsevišķā nepaņemtā iespēja.

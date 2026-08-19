# Mēness Sēja — 90 dienu izaugsmes darba kārtība

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
2. Pieraksta klikšķus, seansus, pozīcijas, CTR, apstiprinātos e-pastus un dārza darbības.
3. Atjauno vienu lapu ar vismaz 20 seansiem, 4.–15. pozīciju un CTR zem 5%.
4. Izvēlas divas sezonālas tēmas, pārbaudot, vai vietnē jau nav lapas ar tādu pašu meklēšanas nolūku.

### Otrdiena–ceturtdiena — saturs

- Divi jauni raksti un viens jauns raksts vai būtisks atjauninājums.
- Katram rakstam aizpilda intentu, primāro vaicājumu, īso atbildi, entītijas, datumus, avotus un saites.
- Saites ved uz augu, kaitēkli, recepti, kalendāru un nākamo noderīgo rakstu, ja tie tiešām attiecas uz tēmu.

### Piektdiena — pārbaude un izplatīšana

1. Palaiž satura validāciju un produkcijas būvi.
2. Mobilajā 360 px skatā pārbauda īso atbildi, satura rādītāju, tabulas, e-pasta formu un CTA.
3. Publicē vienu atbildes kartīti un vienu sezonas darbu sarakstu.
4. UTMs: `utm_source=facebook&utm_medium=organic_social&utm_campaign=lv_garden_2026_q3&utm_content={slug}-{answer|checklist}`.
5. Pieraksta izvietošanas datumu, mainīto SEO virsrakstu un sākuma rādītājus.

## Brevo iestatīšana

1. Izveido aktīvu Double Opt-in transakcijas veidni un tās ID ievieto `BREVO_DOI_TEMPLATE_ID`.
2. Veidnē lieto Brevo DOI saiti un skaidri pasaki, ka cilvēks apstiprina Mēness Sējas sezonas jaunumu saņemšanu.
3. Izveido automatizāciju: **kontakts pievienots sarakstam 5 → nosūtīt vienu sveiciena vēstuli**.
4. Sveiciena vēstules tēma: `Tavs Mēness Sējas sezonas ceļvedis`.
5. Vēstules saturs: īss aktuālo darbu saraksts, saite uz `/raksti/darza-darbi-augusta`, saite uz `/kalendars`, poga uz `/?pievienot=tomati`, privātuma un atrakstīšanās saites.

## Sociālo ierakstu forma

Atbildes kartīte dod atbildi pašā ierakstā: simptoms → ticamākais cēlonis → pirmā darbība. Saite ved uz pilnu diagnostiku. Sezonas kartīte rāda 5–7 darbus, ko Latvijā darīt šonedēļ. Publicē tikai grupās, kuru noteikumi atļauj projekta saites; automātiska pārpublicēšana nav atļauta.

## Lēmumu robežas

- Vienu SEO virsrakstu nemaina biežāk kā reizi 21 dienā.
- Ja divas nedēļas pēc kārtas atjauninātai lapai klikšķi krīt vairāk par 25% bez sezonāla iemesla, atjauno iepriekšējo virsrakstu un aprakstu.
- AdSense paliek izslēgts līdz 10 000 mēneša seansiem.
- Kontu sinhronizāciju nereklamē līdz 300 īstām viesu dārza aktivizācijām vai atkārtotiem pieprasījumiem pēc sinhronizācijas.
- Ja 45. dienā klasteris nerāda ne seansus, ne pozīciju pieaugumu, laiku novirza sezonālām problēmām, puķēm un kaitēkļiem.

## Nedēļas lēmumu žurnāls

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

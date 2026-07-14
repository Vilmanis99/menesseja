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

export interface MonthGuide {
  shortAnswer: string;
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
  7: {
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
};

import { SITE_URL } from "@/lib/seo";
import { getAllFlowers } from "@/lib/flowers";
import { getAllProblems } from "@/lib/kaitekli";
import { getAllRecipes } from "@/lib/recipes";

/**
 * /llms.txt — the emerging convention for a concise, LLM-friendly map of the site
 * (https://llmstxt.org). Generated from real content so it stays current. Helps
 * ChatGPT / Claude / Perplexity find and cite our factual Latvian gardening content.
 */
export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => `${SITE_URL}${p}`;
  const list = (items: { name: string; slug: string; tagline?: string }[], base: string) =>
    items.map((i) => `- [${i.name}](${u(`${base}/${i.slug}`)})${i.tagline ? `: ${i.tagline}` : ""}`).join("\n");

  const body = `# Mēness Sēja

> Latviešu Mēness sējas un biodinamiskais dārza kalendārs. Apvieno Mēness ritmu, Latvijas klimatu (laikapstākļi, augsnes temperatūra, pēdējās salnas pa reģioniem) un latviešu senču gudrību. Viss saturs latviešu valodā un balstīts reālos datos. Mēness sēja ir tradīcija, ne garantija — laikapstākļi un augsnes temperatūra ir svarīgāki.

## Galvenās sadaļas
- [Mēness kalendārs](${u("/kalendars")}): interaktīvs sējas kalendārs ar Mēness fāzēm un biodinamiskajām elementu dienām (saknes/lapas/ziedi/augļi)
- [Augu enciklopēdija](${u("/augi")}): kad sēt, stādīt un novākt dārzeņus, garšaugus un ogas Latvijā, ar kaimiņaugiem un labākajām Mēness dienām
- [Puķu ceļvedis](${u("/pukes")}): dekoratīvās puķes ar stādīšanas laiku un Mēness ziedu-dienu
- [Kaitēkļi un slimības](${u("/kaitekli")}): kā atpazīt un dabīgi apkarot biežākās dārza problēmas
- [Dabīgā mēslojuma receptes](${u("/receptes")}): nātru virca, koku pelnu šķīdums u.c., katra saskaņota ar Mēness ritmu
- [Dārza topi](${u("/topi")}): augu ieteikumu saraksti iesācējiem un apstākļiem
- [Raksti iesācējiem](${u("/raksti")}): Mēness sējas un biodinamikas pamati
- [Reģioni](${u("/regioni")}): Latvijas reģionu mikroklimats un salnu laiki
- [Par mums](${u("/par")}): projekta stāsts un datu avoti

## Puķes
${list(getAllFlowers(), "/pukes")}

## Kaitēkļi un slimības
${list(getAllProblems(), "/kaitekli")}

## Dabīgā mēslojuma receptes
${list(getAllRecipes(), "/receptes")}

## Par projektu
Mēness Sēja digitalizē latviešu senču dārza gudrību — receptes, ticējumus un paražas. Māsu projekts: https://www.globalverticalgardening.net
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

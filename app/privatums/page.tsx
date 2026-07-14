import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privātums un sīkdatnes",
  description: "Kā Mēness Sēja izmanto ierīces glabātuvi, analītiku, e-pastu un dārza datus.",
  alternates: { canonical: canonical("/privatums") },
};

const sections = [
  ["Kas tiek glabāts tavā ierīcē", "Bez konta tavs dārzs, plāni, dienasgrāmata, reģions un privātuma izvēle tiek glabāti pārlūka localStorage. Šie dati nodrošina vietnes funkcijas un netiek izmantoti reklāmas profilēšanai."],
  ["Analītika", "Tikai pēc tavas piekrišanas tiek ielādēti Google Analytics un Ahrefs Web Analytics. Tie palīdz saprast apmeklētās lapas, lasīšanas iesaisti un funkciju izmantošanu. Piekrišanu jebkurā brīdī vari mainīt vietnes kājenē."],
  ["E-pasta jaunumi", "Pierakstoties jaunumiem, e-pasta adrese un pieraksta avots tiek nosūtīti Brevo. Adrese sarakstam tiek pievienota tikai pēc apstiprinājuma e-pastā. Katrā vēstulē ir atrakstīšanās saite."],
  ["Dārza konts un Supabase", "Kontu funkcija pašlaik netiek reklamēta. Ja tā ir pieejama un tu apzināti ielogojies, Supabase glabā e-pastu, profilu, augus un dārza ierakstus, lai tos sinhronizētu starp ierīcēm."],
  ["Kopiena un iesūtījumi", "Kopienas ieraksti, reakcijas un iesūtītā senču gudrība tiek glabāti Neon datubāzē. Publiski rāda tikai tevis izvēlēto vārdu un iesūtīto saturu; iesūtījumi pirms publicēšanas var tikt moderēti."],
  ["Laikapstākļi un atrašanās vieta", "Ja atļauj atrašanās vietu, koordinātes izmanto laikapstākļu pieprasījumam Open-Meteo. Mēness Sēja tās neizmanto reklāmai."],
  ["Cik ilgi datus glabā", "Lokālie dati paliek ierīcē, līdz tos izdzēs tu vai pārlūks. Brevo glabā apstiprināto adresi līdz atrakstīšanās vai dzēšanas pieprasījumam. Supabase un Neon ierakstus glabā līdz attiecīgā konta vai satura dzēšanai. Analītikas datu termiņu nosaka projekta iestatījumi pie pakalpojuma sniedzēja; vietnes īpašniekam tas jāpārbauda pirms šī apraksta galīgās apstiprināšanas."],
  ["Dzēšana un jautājumi", "Lokālos datus vari dzēst iestatījumos vai pārlūkā. E-pasta datus vari dzēst ar atrakstīšanās saiti. Konta vai kopienas datu dzēšanai raksti uz zemāk norādīto projekta kontaktadresi."],
] as const;

export default function PrivacyPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Caurspīdīgi</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Privātums un sīkdatnes</h1>
        <p className="mt-xs text-body-lg text-on-surface-variant">Šis ir praktisks skaidrojums par vietnes datu plūsmām, ne juridiska konsultācija. Pēdējoreiz atjaunots 2026. gada jūlijā.</p>
      </header>
      <div className="space-y-md">
        {sections.map(([title, body]) => <Card key={title} tone="container" className="p-md"><h2 className="text-headline-md text-on-surface">{title}</h2><p className="mt-1 text-body-md leading-relaxed text-on-surface-variant">{body}</p></Card>)}
      </div>
      <Card tone="highest" className="mt-md p-md">
        <h2 className="text-headline-md text-on-surface">Datu pārziņa kontakts</h2>
        {contactEmail ? (
          <p className="mt-1 text-body-md text-on-surface-variant">Par personas datiem un dzēšanas pieprasījumiem raksti uz <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>.</p>
        ) : (
          <p className="mt-1 text-body-md text-error">Pirms lapas publicēšanas vietnes īpašniekam Vercel jāpievieno <code>NEXT_PUBLIC_CONTACT_EMAIL</code> un jāveic šī apraksta juridiskā pārbaude.</p>
        )}
      </Card>
      <p className="mt-lg text-body-md text-on-surface-variant">Skati arī <Link href="/par" className="text-primary hover:underline">datu avotus un projekta aprakstu</Link>.</p>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { SOURCES, DATA_REVIEWED } from "@/lib/sources";
import { canonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Par mums — kas veido Mēness Sēju un no kurienes dati",
  description:
    "Kas stāv aiz Mēness Sējas, kā tiek aprēķinātas Mēness fāzes un elementu dienas, no kurienes nāk sējas un salnu dati, un godīgi par biodinamikas zinātnisko pamatu.",
  alternates: { canonical: canonical("/par") },
};

export default function ParPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Par mums",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Caurspīdīgi</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Par Mēness Sēju</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Mēness Sēja ir latviešu dārznieka veidots rīks, kas apvieno Mēness ritmu, reālus
          laikapstākļus un senču gudrību — Latvijas klimatam. Mēs ticam caurspīdīgumam, tāpēc te
          atklāti pastāstām, no kurienes nāk dati un cik tiem var uzticēties.
        </p>
      </header>

      {/* Origin story — the heart of the project */}
      <Card tone="highest" elevated linen className="mb-md p-md md:p-lg">
        <h2 className="mb-sm flex items-center gap-sm text-headline-md text-primary">
          <Icon name="favorite" /> Kā tas sākās
        </h2>
        <div className="space-y-sm text-body-lg leading-relaxed text-on-surface-variant">
          <p>
            Mēs sākām paši — ar rokām zemē, kaut kur Latvijas laukos. Gribējās modernu, gudru dārzu,
            tāpēc vispirms ķērāmies pie visa jaunā un tehnoloģiskā — pie vertikālās dārzkopības, par ko
            stāstām savā otrā projektā{" "}
            <a
              href="https://www.globalverticalgardening.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              globalverticalgardening.net
            </a>
            .
          </p>
          <p>
            Bet sētai jau bija sava gudrība. Opis noskatījās uz mūsu «jauniešu lietām» un tikai
            pašūpoja galvu. «Kalendārā taču rakstīts — sakņu diena, sēj kartupeļus,» viņš teica. Mums
            tas šķita mazliet smieklīgi: kāds tur Mēnesim sakars ar kartupeļiem?
          </p>
          <p>
            Un tomēr, gadu pēc gada vērojot, nācām pie negaidīta secinājuma:{" "}
            <strong className="text-on-surface">Opim bija taisnība.</strong> Ne Mēness vienatnē — bet
            senču vērošanā, ritmā, pacietībā un zināšanās, kas klusi nodotas no paaudzes paaudzē.
          </p>
          <p>
            Tā radās Mēness Sēja. Ne lai pierādītu zinātni, bet lai{" "}
            <strong className="text-on-surface">
              apkopotu un saglabātu latviešu senču dārza gudrību, receptes un ticējumus, pirms tie
              pazūd
            </strong>
            . Šī ir dzīva krātuve — un tu vari to papildināt.
          </p>
        </div>
      </Card>

      <Link href="/iesutit" className="mb-md block">
        <Card tone="container" accent="secondary" className="flex items-center gap-md p-md transition-colors hover:bg-surface-container-high">
          <Icon name="volunteer_activism" className="text-secondary" size="28px" />
          <div className="flex-1">
            <p className="font-semibold text-on-surface">Iesūti savu ģimenes gudrību</p>
            <p className="text-body-md text-on-surface-variant">
              Recepte, ticējums vai paraža no tavas sētas — palīdzi to digitalizēt nākamajām paaudzēm.
            </p>
          </div>
          <Icon name="arrow_forward" size="20px" className="text-on-surface-variant" />
        </Card>
      </Link>

      <Card tone="high" elevated linen className="mb-md p-md">
        <h2 className="mb-sm flex items-center gap-sm text-headline-md text-primary">
          <Icon name="calculate" /> Kā tiek rēķinātas Mēness dienas
        </h2>
        <ul className="space-y-2 text-body-md text-on-surface-variant">
          <li className="flex gap-2"><Icon name="brightness_3" size="18px" className="mt-0.5 text-primary" /> <span><strong className="text-on-surface">Mēness fāzes</strong> — no astronomiskiem aprēķiniem (sinodiskais cikls), precizitāte ~1 diena.</span></li>
          <li className="flex gap-2"><Icon name="auto_awesome" size="18px" className="mt-0.5 text-primary" /> <span><strong className="text-on-surface">Elementu dienas</strong> — pēc Marijas Tūnas biodinamiskās sistēmas (Mēness zvaigznāja zīme → elements → auga daļa).</span></li>
          <li className="flex gap-2"><Icon name="ac_unit" size="18px" className="mt-0.5 text-primary" /> <span><strong className="text-on-surface">Salnas un augšanas dienas</strong> — pēc LVĢMC klimata normām katram reģionam.</span></li>
          <li className="flex gap-2"><Icon name="potted_plant" size="18px" className="mt-0.5 text-primary" /> <span><strong className="text-on-surface">Sējas logi</strong> — pielāgoti Latvijas klimatam un slīpēti praksē; orientējoši, pārbaudi savam reģionam.</span></li>
          <li className="flex gap-2"><Icon name="cloud" size="18px" className="mt-0.5 text-primary" /> <span><strong className="text-on-surface">Laikapstākļi un augsnes temperatūra</strong> — no Open-Meteo (reāllaika dati).</span></li>
        </ul>
        <p className="mt-sm text-label-sm text-on-surface-variant">Dati pēdējoreiz pārskatīti: {DATA_REVIEWED}.</p>
      </Card>

      <Card tone="highest" elevated accent="secondary" className="mb-md p-md">
        <h2 className="mb-sm flex items-center gap-sm text-headline-md text-secondary">
          <Icon name="balance" /> Godīgi par Mēness sēju
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Mēness sēja un biodinamika ir <strong className="text-on-surface">tradīcija</strong>, ne
          pierādīts zinātnisks fakts — pētījumi ir ierobežoti un pretrunīgi. Mēs to piedāvājam kā
          ritmu, dabas vērošanas veidu un kultūras mantojumu, <strong className="text-on-surface">nevis garantiju</strong>.
          Vissvarīgākie joprojām ir laikapstākļi, augsnes temperatūra un tava paša pieredze.
        </p>
      </Card>

      <Card tone="container" className="mb-md p-md">
        <h2 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
          <Icon name="menu_book" className="text-primary" /> Avoti
        </h2>
        <ul className="space-y-2">
          {SOURCES.map((s) => (
            <li key={s.url} className="flex items-center gap-2 text-body-md">
              <Icon name="link" size="16px" className="text-primary" />
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {s.label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2 text-body-md">
            <Icon name="link" size="16px" className="text-primary" />
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Laikapstākļi: Open-Meteo.com (CC-BY 4.0)
            </a>
          </li>
        </ul>
      </Card>

      <Card tone="container" className="mb-md p-md">
        <h2 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
          <Icon name="lock" className="text-primary" /> Privātums
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Bez konta tavs dārzs, plāni un dienasgrāmata tiek glabāti{" "}
          <strong className="text-on-surface">tikai šajā ierīcē</strong> (localStorage). Ja izveido kontu
          (pēc izvēles, ar e-pasta saiti), tavs dārzs un kopienas ieraksti{" "}
          <strong className="text-on-surface">sinhronizējas mūsu datubāzē</strong> (Supabase, ES serveri),
          lai sekotu tev starp ierīcēm — un tu tos jebkurā brīdī vari dzēst. Atrašanās vieta (ja to atļauj)
          tiek izmantota tikai laikapstākļiem (koordinātes nosūta Open-Meteo). AI diagnostikas foto tiek
          nosūtīts Anthropic (Claude AI, ASV) un netiek glabāts mūsu pusē.
        </p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/macies" className="text-label-md text-primary hover:underline">Kas ir Mēness sēja?</Link>
        <Link href="/augi" className="text-label-md text-on-surface-variant hover:text-primary">Augu enciklopēdija</Link>
      </div>
    </article>
  );
}

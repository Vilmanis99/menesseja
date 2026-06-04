import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { ELEMENT_META, type Element } from "@/lib/biodynamic";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kas ir Mēness sēja?",
  description:
    "Vienkārša pamācība par Mēness fāzēm, elementu dienām (Marijas Tūnas sistēma) un latviešu senču gudrību dārzkopībā.",
  alternates: { canonical: canonical("/macies") },
};

const ELEMENTS: { el: Element; desc: string }[] = [
  { el: "zeme", desc: "Sakņaugi — burkāni, bietes, kartupeļi, sīpoli, redīsi." },
  { el: "udens", desc: "Lapu dārzeņi un garšaugi — salāti, spināti, kāposti, dilles." },
  { el: "gaiss", desc: "Ziedaugi un ziedkāposti — brokoļi, puķes, ogu krūmi." },
  { el: "uguns", desc: "Augļi un sēklas — tomāti, gurķi, pupas, ķirbji, paprika." },
];

const FAQ = [
  {
    q: "Vai tas tiešām darbojas?",
    a: "Mēness sēja ir gadsimtiem sena tradīcija un biodinamiskās lauksaimniecības daļa. Zinātniskie pierādījumi ir ierobežoti un pretrunīgi, taču daudzi dārznieki to izmanto kā ritmu un dabas vērošanas veidu. Mēs to piedāvājam kā tradīciju un plānošanas palīgu, nevis kā garantiju.",
  },
  {
    q: "Kas ir svarīgāk — fāze vai elements?",
    a: "Sāc ar fāzi (augošs/dilstošs) — to ir vieglāk saprast. Kad jūties drošāk, ņem vērā arī elementu dienas. Vissvarīgākais tomēr paliek laikapstākļi un augsnes temperatūra!",
  },
  {
    q: "Ko darīt, ja diena nesakrīt ar manu plānu?",
    a: "Dārzs neies bojā, ja sēsi “nepareizā” dienā. Uztver to kā ieteikumu, ne likumu. Reāli laikapstākļi un salnas ir svarīgāki par Mēnesi.",
  },
];

function ElementRow({ el, desc }: { el: Element; desc: string }) {
  const m = ELEMENT_META[el];
  return (
    <div className="flex items-start gap-md rounded-xl bg-background/40 p-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-variant/50">
        <Icon name={m.icon} className={m.color} size="26px" />
      </div>
      <div>
        <p className="font-semibold text-on-surface">
          {m.label} → {m.partLabel} diena
        </p>
        <p className="text-body-md text-on-surface-variant">{desc}</p>
      </div>
    </div>
  );
}

export default function MaciesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHeader
        eyebrow="Pamati · 5 minūtes"
        title="Kas ir Mēness sēja?"
        display
        subtitle="Īsi un vienkārši: kā mūsu senči sēja saskaņā ar Mēnesi un dabu — un kā šī lietotne tev palīdz."
      />

      {/* 1. Moon phases */}
      <Card tone="high" elevated linen className="mb-md p-md">
        <h2 className="mb-md flex items-center gap-sm text-headline-md text-primary">
          <Icon name="brightness_3" /> 1. Mēness fāzes
        </h2>
        <p className="mb-md max-w-2xl text-body-lg text-on-surface-variant">
          Mēnesim ir aptuveni 29 dienu cikls. Senči ticēja, ka Mēness ietekmē sulu plūsmu augos —
          tāpat kā tas ietekmē jūras paisumus.
        </p>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <div className="flex items-start gap-md rounded-xl bg-background/40 p-md">
            <MoonPhase phase={0.25} size={64} />
            <div>
              <p className="font-bold text-on-surface">Augošs mēness 🌒</p>
              <p className="mt-1 text-body-md text-on-surface-variant">
                No jauna līdz pilnam. Sula ceļas uz augšu — labs laiks sēt un stādīt to, kas aug
                <strong className="text-on-surface"> virs zemes</strong> (lapas, augļi, ziedi).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-md rounded-xl bg-background/40 p-md">
            <MoonPhase phase={0.75} size={64} />
            <div>
              <p className="font-bold text-on-surface">Dilstošs mēness 🌖</p>
              <p className="mt-1 text-body-md text-on-surface-variant">
                No pilna līdz jaunam. Enerģija iet uz leju, saknēm — labs laiks
                <strong className="text-on-surface"> sakņaugiem</strong>, stādīšanai, ravēšanai un
                ražas vākšanai glabāšanai.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Element days */}
      <Card tone="high" elevated linen className="mb-md p-md">
        <h2 className="mb-md flex items-center gap-sm text-headline-md text-primary">
          <Icon name="auto_awesome" /> 2. Elementu dienas
        </h2>
        <p className="mb-md max-w-2xl text-body-lg text-on-surface-variant">
          Bez fāzes Mēness katru dienu atrodas citā zvaigznāja zīmē. Marijas Tūnas biodinamiskā
          sistēma katru zīmi saista ar elementu un auga daļu, kurai šī diena ir labvēlīga:
        </p>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          {ELEMENTS.map((e) => (
            <ElementRow key={e.el} el={e.el} desc={e.desc} />
          ))}
        </div>
        <p className="mt-md text-body-md text-on-surface-variant">
          👉 <strong className="text-on-surface">Kalendārs</strong> katrai dienai parāda elementu un
          ko tajā labāk sēt.
        </p>
      </Card>

      {/* 2b. Ascending/descending + rest days */}
      <Card tone="high" elevated linen className="mb-md p-md">
        <h2 className="mb-md flex items-center gap-sm text-headline-md text-primary">
          <Icon name="trending_up" /> 2½. Mēness ceļš un atpūtas dienas
        </h2>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-3">
          <div className="rounded-xl bg-background/40 p-sm">
            <Icon name="trending_up" className="text-tertiary" size="24px" />
            <p className="mt-1 font-semibold text-on-surface">Mēness kāpj</p>
            <p className="text-body-md text-on-surface-variant">Sula ceļas — sēj un vāc virszemes ražu.</p>
          </div>
          <div className="rounded-xl bg-background/40 p-sm">
            <Icon name="trending_down" className="text-tertiary" size="24px" />
            <p className="mt-1 font-semibold text-on-surface">Mēness krīt</p>
            <p className="text-body-md text-on-surface-variant">Spēks iet saknēm — stādi un strādā ar augsni.</p>
          </div>
          <div className="rounded-xl bg-background/40 p-sm">
            <Icon name="block" className="text-on-surface-variant" size="24px" />
            <p className="mt-1 font-semibold text-on-surface">Atpūtas diena</p>
            <p className="text-body-md text-on-surface-variant">Mēness mezgls — nelabvēlīgi sēt; vēro un kop.</p>
          </div>
        </div>
      </Card>

      {/* 3. Folk wisdom */}
      <Card tone="high" elevated linen className="mb-md p-md">
        <h2 className="mb-md flex items-center gap-sm text-headline-md text-primary">
          <Icon name="auto_stories" /> 3. Senču gudrība
        </h2>
        <p className="max-w-2xl text-body-lg text-on-surface-variant">
          Latviešu zemnieki gadsimtiem vēroja Mēnesi, dabas zīmes un laikapstākļus. Šī gudrība
          glabājas tautasdziesmās un ticējumos — piemēram, “Sēj kāpostus tajā dienā, kad pirmā vārna
          ligzdā iesēžas.” Mēs šo mantojumu apvienojam ar mūsdienu datiem (laikapstākļi, augsnes
          temperatūra), lai tradīcija būtu praktiska arī šodien.
        </p>
      </Card>

      {/* 4. How the app helps */}
      <Card tone="highest" elevated accent="primary" className="mb-md p-md">
        <h2 className="mb-md flex items-center gap-sm text-headline-md text-on-surface">
          <Icon name="touch_app" className="text-primary" /> Kā lietotne tev palīdz
        </h2>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          {[
            { icon: "nature_people", t: "Dārzs", d: "Pievieno savus augus un seko to augšanai + ikdienas atgādinājumi." },
            { icon: "calendar_month", t: "Kalendārs", d: "Katras dienas Mēness fāze, elements un ko sēt." },
            { icon: "local_library", t: "Ceļvedis", d: "Kad sēt, stādīt un novākt katru kultūru Latvijā." },
            { icon: "architecture", t: "Plānotājs", d: "Izkārto dobi un redzi, kuri augi nesader blakus." },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-sm rounded-xl bg-background/40 p-sm">
              <Icon name={f.icon} className="text-primary" size="24px" />
              <div>
                <p className="font-semibold text-on-surface">{f.t}</p>
                <p className="text-body-md text-on-surface-variant">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. FAQ */}
      <h2 className="mb-sm mt-lg text-headline-md text-on-surface">Biežākie jautājumi</h2>
      <div className="space-y-sm">
        {FAQ.map((f) => (
          <Card key={f.q} tone="container" className="p-md">
            <p className="mb-1 flex items-center gap-2 font-semibold text-on-surface">
              <Icon name="help" size="18px" className="text-primary" />
              {f.q}
            </p>
            <p className="text-body-md text-on-surface-variant">{f.a}</p>
          </Card>
        ))}
      </div>

      <Card tone="highest" elevated accent="primary" className="mt-lg flex items-center gap-md p-md">
        <Icon name="article" className="text-primary" size="28px" />
        <div className="flex-1">
          <p className="font-semibold text-on-surface">Gribi vairāk?</p>
          <p className="text-body-md text-on-surface-variant">Lasi rakstus iesācējiem — Mēness fāzes, biodinamika, salnas un augsne soli pa solim.</p>
        </div>
        <Link href="/raksti" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-md py-sm font-bold text-on-primary">
          Raksti <Icon name="arrow_forward" size="18px" />
        </Link>
      </Card>
    </>
  );
}

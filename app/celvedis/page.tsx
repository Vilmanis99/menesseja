import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { JsonLd } from "@/components/json-ld";
import { SowingGuide } from "@/components/sowing-guide";
import { CROPS, CATEGORIES, MONTHS_LV_FULL, type Crop, type Category } from "@/lib/planting-crops";
import { cropHref } from "@/lib/flowers";
import { canonical, SITE_NAME } from "@/lib/seo";

// The interactive filter below is client-side, so without a server-rendered
// table this page reached search engines as a heading and two links.
export const revalidate = 86400;

const SHORT_MONTH = ["jan", "feb", "mar", "apr", "mai", "jūn", "jūl", "aug", "sep", "okt", "nov", "dec"];

function range(r?: [number, number]): string {
  if (!r) return "—";
  return r[0] === r[1] ? SHORT_MONTH[r[0] - 1] : `${SHORT_MONTH[r[0] - 1]}–${SHORT_MONTH[r[1] - 1]}`;
}

export default function CelvedisPage() {
  const byCategory = CATEGORIES.map((category) => ({
    category,
    crops: CROPS.filter((c) => c.category === category.id),
  })).filter((g) => g.crops.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sējas ceļvedis — kad sēt, stādīt un novākt katru augu",
    inLanguage: "lv",
    description: `Sējas, stādīšanas un ražas laiki ${CROPS.length} kultūrām Latvijas klimatam.`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHeader
        eyebrow="Interaktīvais rīks"
        title="Sējas ceļvedis"
        display
        subtitle="Katras kultūras sējas, stādīšanas un ražas logi Latvijas klimatam — kopā ar labākajām Mēness dienām un augsnes siltumu."
      />
      <p className="mb-md max-w-2xl text-body-md text-on-surface-variant">
        Ieraksti dārzeņa vai puķes nosaukumu vai izvēlies kategoriju, lai atrastu, kad to sēt,
        stādīt un novākt Latvijā. Pārlūko visu{" "}
        <Link href="/augi" className="text-primary hover:underline">augu enciklopēdiju</Link> vai atver{" "}
        <Link href="/kalendars" className="text-primary hover:underline">Mēness kalendāru</Link>.
      </p>

      <SowingGuide />

      <section className="mt-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">
          Sējas un ražas laiki — visas {CROPS.length} kultūras
        </h2>
        <p className="mb-md max-w-2xl text-body-md text-on-surface-variant">
          Kopsavilkuma tabula visam gadam. Mēneši ir orientējoši Latvijas vidējiem apstākļiem —
          pavasarī izšķirošā ir augsnes temperatūra, ne datums.
        </p>

        {byCategory.map(({ category, crops }) => (
          <div key={category.id} className="mb-lg">
            <h3 className="mb-sm text-title-md text-on-surface">{category.label}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-body-md">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-left text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <th className="py-2 pr-3 font-semibold">Augs</th>
                    <th className="py-2 pr-3 font-semibold">Sēj telpās</th>
                    <th className="py-2 pr-3 font-semibold">Sēj laukā</th>
                    <th className="py-2 pr-3 font-semibold">Stāda</th>
                    <th className="py-2 font-semibold">Novāc</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop: Crop) => (
                    <tr key={crop.id} className="border-b border-outline-variant/10">
                      <th scope="row" className="py-2 pr-3 text-left font-normal">
                        <Link href={cropHref(crop.id)} className="text-primary hover:underline">
                          {crop.name}
                        </Link>
                      </th>
                      <td className="py-2 pr-3 text-on-surface-variant">{range(crop.sowIndoors)}</td>
                      <td className="py-2 pr-3 text-on-surface-variant">{range(crop.sowOutdoors)}</td>
                      <td className="py-2 pr-3 text-on-surface-variant">{range(crop.transplant)}</td>
                      <td className="py-2 text-on-surface-variant">{range(crop.harvest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p className="text-body-md text-on-surface-variant">
          Ko sēt konkrētā mēnesī, skaties{" "}
          <Link href="/ko-set" className="text-primary hover:underline">sējas sarakstos pa mēnešiem</Link>.
        </p>
      </section>
    </>
  );
}

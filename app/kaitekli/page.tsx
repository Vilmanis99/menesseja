import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { ProblemLibrary, type ProblemLibraryItem } from "@/components/problem-library";
import { CreditedPhoto } from "@/components/credited-photo";
import { getAllProblems, PROBLEM_TYPE_META } from "@/lib/kaitekli";
import { problemImage } from "@/lib/problem-images";
import { contentImage } from "@/lib/content-images";
import { problemSearchText } from "@/lib/problem-search";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dārza kaitēkļi un slimības — atpazīšana un rīcība",
  description: "Atrodi dārza kaitēkli vai slimību pēc nosaukuma, skartā auga un pazīmēm. Atpazīšanas foto, rīcības soļi un profilakses ceļveži Latvijas dārzam.",
  alternates: { canonical: canonical("/kaitekli") },
  openGraph: og({ path: "/kaitekli", title: "Kaitēkļi un slimības — atpazīšana un rīcība", description: "Pārbaudi pazīmes, salīdzini iespējamos cēloņus un atrodi savai situācijai piemērotu rīcību.", type: "website" }),
};

export default function KaitekliPage() {
  const problems = getAllProblems().sort((a, b) => Number(Boolean(problemImage(b.slug))) - Number(Boolean(problemImage(a.slug))) || a.name.localeCompare(b.name, "lv"));
  const items: ProblemLibraryItem[] = problems.map((problem) => {
    const image = problemImage(problem.slug);
    const meta = PROBLEM_TYPE_META[problem.type];
    return {
      slug: problem.slug,
      type: problem.type,
      searchText: problemSearchText(problem),
      card: <article className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container">
        <Link href={`/kaitekli/${problem.slug}`} className="group flex flex-1 flex-col p-md transition-colors hover:bg-surface-container-high">
          <p className="flex items-center gap-2 text-label-sm text-tertiary"><Icon name={meta.icon} size="18px" /> {meta.label}</p>
          <h3 className="mt-2 text-headline-md text-on-surface group-hover:text-primary">{problem.name}</h3>
          <p className="mt-2 text-body-md leading-relaxed text-on-surface-variant">{problem.tagline}</p>
          <p className="mt-sm text-label-sm text-on-surface-variant">Skar: {problem.affects.slice(0, 4).join(", ")}{problem.affects.length > 4 ? "…" : ""}</p>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1 pt-sm text-label-md font-semibold text-primary">Atvērt ceļvedi <Icon name="arrow_forward" size="18px" /></span>
        </Link>
        {image && <CreditedPhoto asset={contentImage(image.id)} caption={image.caption} href={`/kaitekli/${problem.slug}`} linkLabel={`Atvērt ceļvedi: ${problem.name}`} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, calc(100vw - 48px)" className="border-t border-outline-variant/15" />}
      </article>,
    };
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dārza kaitēkļi un slimības",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    hasPart: problems.map((problem) => ({ "@type": "Article", name: problem.name, url: canonical(`/kaitekli/${problem.slug}`) })),
  };

  return <>
    <JsonLd data={jsonLd} />
    <PageHeader title="Kaitēkļi un slimības" subtitle="Atrodi iespējamo cēloni, salīdzini pazīmes un izvēlies rīcību savam augam." />
    <ProblemLibrary items={items} />
  </>;
}

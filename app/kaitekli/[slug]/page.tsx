import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { getProblem, getAllProblems, problemSlugs, PROBLEM_TYPE_META, SEVERITY_META } from "@/lib/kaitekli";
import { getRecipe } from "@/lib/recipes";
import { cropForAffect } from "@/lib/crop-pests";
import { flowerSlugs } from "@/lib/flowers";
import { canonical, SITE_NAME, og } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";

export const dynamicParams = false;

export function generateStaticParams() {
  return problemSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) return {};
  const title = `${p.name} — pazīmes un dabīga apkarošana dārzā`;
  const description = `${p.tagline} Kā atpazīt, dabīgi apkarot un novērst ${p.name.toLowerCase()} Latvijas dārzā — tautas līdzekļi un receptes.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/kaitekli/${p.slug}`) },
    openGraph: og({ path: `/kaitekli/${p.slug}`, title, description }),
  };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) notFound();

  const tm = PROBLEM_TYPE_META[p.type];
  const sev = SEVERITY_META[p.severity];
  const recipes = (p.recipeSlugs ?? [])
    .map((s) => getRecipe(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const siblings = getAllProblems().filter((x) => x.type === p.type && x.slug !== p.slug).slice(0, 5);
  const flowerSet = new Set(flowerSlugs());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${p.name} — pazīmes un dabīga apkarošana`,
    about: p.name,
    inLanguage: "lv",
    dateModified: `${DATA_REVIEWED}-01`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
    author: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kaitēkļi", item: canonical("/kaitekli") },
      { "@type": "ListItem", position: 2, name: p.name, item: canonical(`/kaitekli/${p.slug}`) },
    ],
  };
  const faqJsonLd = p.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: p.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      }
    : null;

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/kaitekli" className="hover:text-primary">Kaitēkļi un slimības</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{p.name}</span>
      </nav>

      <header className="mb-lg flex items-center gap-md">
        <span className="text-6xl leading-none">{p.emoji}</span>
        <div>
          <p className="flex items-center gap-1.5 text-label-sm uppercase tracking-[0.2em] text-tertiary">
            <Icon name={tm.icon} size="16px" /> {tm.label}
            <span className={`ml-1 ${sev.tone}`}>● {sev.label}</span>
          </p>
          <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">{p.name}</h1>
          {p.latin && <p className="text-body-md italic text-on-surface-variant">{p.latin}</p>}
          <p className="mt-1 text-body-lg text-on-surface-variant">{p.tagline}</p>
        </div>
      </header>

      <div className="mb-lg space-y-sm">
        {p.intro.map((t, i) => (
          <p key={i} className="text-body-lg leading-relaxed text-on-surface-variant">{t}</p>
        ))}
      </div>

      {/* Signs */}
      <h2 className="mb-sm text-headline-md text-on-surface">Kā atpazīt</h2>
      <Card tone="high" elevated className="mb-lg p-md">
        <ul className="space-y-1.5">
          {p.signs.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
              <Icon name="search" size="16px" className="mt-1 shrink-0 text-tertiary" /> {s}
            </li>
          ))}
        </ul>
        {p.affects.length > 0 && (
          <p className="mt-md flex flex-wrap items-center gap-x-1.5 gap-y-1 text-label-md">
            <span className="text-on-surface-variant">Visbiežāk skar:</span>
            {p.affects.map((a, i) => {
              const crop = cropForAffect(a);
              const href = crop ? (flowerSet.has(crop.id) ? `/pukes/${crop.id}` : `/augi/${crop.id}`) : null;
              return (
                <span key={i} className="text-on-surface">
                  {href ? <Link href={href} className="text-primary hover:underline">{a}</Link> : a}
                  {i < p.affects.length - 1 ? "," : ""}
                </span>
              );
            })}
          </p>
        )}
      </Card>

      {/* Natural control */}
      <h2 className="mb-sm text-headline-md text-on-surface">Dabīga apkarošana</h2>
      <Card tone="high" elevated accent="primary" className="mb-md p-md">
        <ol className="space-y-sm">
          {p.control.map((s, i) => (
            <li key={i} className="flex items-start gap-md">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-label-md font-bold text-primary-fixed">
                {i + 1}
              </span>
              <p className="pt-0.5 text-body-md leading-relaxed text-on-surface-variant">{s}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Linked recipes from our vault */}
      {recipes.length > 0 && (
        <Card tone="container" accent="secondary" className="mb-lg p-md">
          <p className="mb-sm flex items-center gap-2 text-label-md uppercase tracking-wide text-secondary">
            <Icon name="science" size="16px" /> Gatavas receptes pret šo
          </p>
          <div className="flex flex-wrap gap-2">
            {recipes.map((r) => (
              <Link key={r.slug} href={`/receptes/${r.slug}`} className="inline-flex items-center gap-1 rounded-full bg-secondary-container/25 px-3 py-1.5 text-label-md text-secondary-fixed hover:brightness-110">
                <Icon name="compost" size="16px" /> {r.name}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Prevention */}
      <h2 className="mb-sm text-headline-md text-on-surface">Kā novērst</h2>
      <Card tone="high" className="mb-lg p-md">
        <ul className="space-y-1.5">
          {p.prevention.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
              <Icon name="shield" size="16px" className="mt-1 shrink-0 text-primary" /> {s}
            </li>
          ))}
        </ul>
      </Card>

      {p.moonNote?.trim() && (
        <Card tone="highest" elevated accent="primary" className="mb-lg flex items-start gap-sm p-md">
          <Icon name="brightness_3" className="text-primary" size="20px" />
          <div>
            <p className="text-label-md uppercase tracking-wide text-primary">Mēness piezīme</p>
            <p className="mt-1 text-body-md text-on-surface-variant">{p.moonNote}</p>
          </div>
        </Card>
      )}

      {p.folklore?.trim() && (
        <Card tone="high" linen className="mb-lg flex items-start gap-sm p-md">
          <Icon name="auto_stories" className="text-tertiary" size="20px" />
          <p className="text-body-md italic text-on-surface">«{p.folklore}»</p>
        </Card>
      )}

      {p.faq?.length ? (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h2>
          <div className="mb-lg space-y-2">
            {p.faq.map((q) => (
              <Card key={q.q} tone="container" className="p-md">
                <p className="mb-1 font-semibold text-on-surface">{q.q}</p>
                <p className="text-body-md text-on-surface-variant">{q.a}</p>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {recipes.length === 0 && (
        <Card tone="container" className="mb-lg flex items-center gap-md p-md">
          <Icon name="menu_book" className="text-primary" size="26px" />
          <p className="flex-1 text-body-md text-on-surface">
            Meklē dabīgus līdzekļus? <Link href="/receptes" className="text-primary hover:underline">Apskati mēslojuma un aizsardzības receptes →</Link>
          </p>
        </Card>
      )}

      {siblings.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Citas dārza problēmas</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} href={`/kaitekli/${x.slug}`} className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                {x.emoji} {x.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

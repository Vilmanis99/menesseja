import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { RecipeTodayBadge } from "@/components/recipe-today-badge";
import { getRecipe, getAllRecipes, recipeSlugs, PURPOSE_META, type RecipeElement } from "@/lib/recipes";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return recipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  return {
    title: `${r.name} — kā pagatavot un kad lietot`,
    description: `${r.tagline} Sastāvs, pagatavošana un tradicionāli labākā Mēness fāze ${r.name.toLowerCase()} lietošanai.`,
    alternates: { canonical: canonical(`/receptes/${r.slug}`) },
    openGraph: og({ path: `/receptes/${r.slug}`, title: r.name, description: r.tagline }),
  };
}

const ELEMENT_LABEL: Record<RecipeElement, string> = {
  saknes: "Sakņu",
  lapas: "Lapu",
  ziedi: "Ziedu",
  augli: "Augļu",
  jebkurs: "",
};

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) notFound();
  const pm = PURPOSE_META[r.purpose];
  const related = getAllRecipes().filter((x) => x.slug !== r.slug && x.purpose === r.purpose).slice(0, 3);
  const elementLabel = ELEMENT_LABEL[r.moonElement];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: r.name,
    description: r.tagline,
    inLanguage: "lv",
    step: r.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    supply: r.ingredients.map((i) => ({ "@type": "HowToSupply", name: i })),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Receptes", item: canonical("/receptes") },
      { "@type": "ListItem", position: 2, name: r.name, item: canonical(`/receptes/${r.slug}`) },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/receptes" className="hover:text-primary">Receptes</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{pm.label}</span>
      </nav>

      <header className="mb-md">
        <p className="flex items-center gap-1.5 text-label-sm uppercase tracking-[0.2em] text-tertiary">
          <Icon name={pm.icon} size="16px" /> {pm.label}
        </p>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-lg">{r.name}</h1>
        <p className="mt-xs text-body-lg text-on-surface-variant">{r.tagline}</p>
        <div className="mt-sm flex flex-wrap gap-2 text-label-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
            <Icon name="schedule" size="14px" /> {r.timeText}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 capitalize">
            <Icon name="bar_chart" size="14px" /> {r.difficulty}
          </span>
        </div>
      </header>

      {/* Moon timing — the signature feature */}
      <Card tone="container" accent="primary" className="mb-lg p-md">
        <div className="mb-sm flex items-center gap-2">
          <Icon name="brightness_3" className="text-primary" />
          <h2 className="text-headline-md text-on-surface">Labākais laiks pēc Mēness</h2>
        </div>
        <p className="mb-sm text-body-md text-on-surface">
          {r.moonPhase === "jebkurš" && r.moonElement === "jebkurs" ? (
            "Šai receptei Mēness fāze nav būtiska."
          ) : (
            <>
              <span className="font-semibold capitalize">{r.moonPhase} Mēness</span>
              {elementLabel ? <>, <span className="font-semibold">{elementLabel} diena</span></> : null}
            </>
          )}
          {" — "}
          {r.moonText}
        </p>
        <RecipeTodayBadge phase={r.moonPhase} element={r.moonElement} />
      </Card>

      <div className="mb-lg space-y-sm">
        {r.intro.map((p, i) => (
          <p key={i} className="text-body-lg leading-relaxed text-on-surface-variant">{p}</p>
        ))}
      </div>

      <div className="mb-lg grid grid-cols-1 gap-md sm:grid-cols-2">
        <Card tone="high" elevated className="p-md">
          <h2 className="mb-sm flex items-center gap-2 text-headline-md text-on-surface">
            <Icon name="list_alt" className="text-primary" size="20px" /> Sastāvs
          </h2>
          <ul className="space-y-1.5">
            {r.ingredients.map((it, i) => (
              <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                <Icon name="check" size="16px" className="mt-1 shrink-0 text-primary" /> {it}
              </li>
            ))}
          </ul>
        </Card>
        <Card tone="high" elevated className="p-md">
          <h2 className="mb-sm flex items-center gap-2 text-headline-md text-on-surface">
            <Icon name="water_drop" className="text-primary" size="20px" /> Kā lietot
          </h2>
          <ul className="space-y-1.5">
            {r.application.map((it, i) => (
              <li key={i} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                <Icon name="arrow_right" size="16px" className="mt-0.5 shrink-0 text-primary" /> {it}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <h2 className="mb-sm text-headline-md text-on-surface">Pagatavošana</h2>
      <ol className="mb-lg space-y-sm">
        {r.steps.map((s, i) => (
          <li key={i} className="flex items-start gap-md">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-label-md font-bold text-primary-fixed">
              {i + 1}
            </span>
            <p className="pt-0.5 text-body-md leading-relaxed text-on-surface-variant">{s}</p>
          </li>
        ))}
      </ol>

      <Card tone="container" accent="secondary" className="mb-lg flex items-start gap-sm p-md">
        <Icon name="warning" className="text-secondary" size="20px" />
        <div>
          <p className="text-label-md uppercase tracking-wide text-secondary">Ņem vērā</p>
          <p className="mt-1 text-body-md text-on-surface-variant">{r.caution}</p>
        </div>
      </Card>

      {r.folklore?.trim() && (
        <Card tone="high" linen className="mb-lg flex items-start gap-sm p-md">
          <Icon name="auto_stories" className="text-tertiary" size="20px" />
          <p className="text-body-md italic text-on-surface">«{r.folklore}»</p>
        </Card>
      )}

      <DataNote variant="moon" className="mb-lg" />

      {related.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Citas {pm.label.toLowerCase()} receptes</h2>
          <ul className="space-y-2">
            {related.map((x) => (
              <li key={x.slug}>
                <Link href={`/receptes/${x.slug}`} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="16px" /> {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

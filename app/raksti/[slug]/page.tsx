import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getArticle, getAllArticles, articleSlugs } from "@/lib/articles";
import { canonical, SITE_NAME, og } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";

export const dynamicParams = false;

export function generateStaticParams() {
  return articleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: canonical(`/raksti/${a.slug}`) },
    openGraph: og({ path: `/raksti/${a.slug}`, title: a.title, description: a.excerpt }),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const isMoonTopic = ["Pamati", "Biodinamika"].includes(a.category);
  const related = getAllArticles().filter((x) => x.slug !== a.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
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
      { "@type": "ListItem", position: 1, name: "Raksti", item: canonical("/raksti") },
      { "@type": "ListItem", position: 2, name: a.title, item: canonical(`/raksti/${a.slug}`) },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/raksti" className="hover:text-primary">Raksti</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{a.category}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">
          {a.category} · {a.readMinutes} min
        </p>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-lg">{a.title}</h1>
      </header>

      <div className="space-y-md">
        {a.body.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mb-sm text-headline-md text-on-surface">{section.heading}</h2>
            )}
            {section.paragraphs.map((para, j) => (
              <p key={j} className="mb-sm text-body-lg leading-relaxed text-on-surface-variant">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      {isMoonTopic && <DataNote variant="moon" className="mt-lg" />}

      {related.length > 0 && (
        <div className="mt-lg border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Lasi arī</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/raksti/${r.slug}`} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="16px" /> {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

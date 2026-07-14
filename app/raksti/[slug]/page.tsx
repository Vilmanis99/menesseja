import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getArticle, getRelatedArticles, articleSlugs, articleFaq, headingSlug } from "@/lib/articles";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArticleEngagement } from "@/components/article-engagement";
import { TrackedLink } from "@/components/tracked-link";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return articleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.seoTitle ?? a.title,
    description: a.excerpt,
    alternates: { canonical: canonical(`/raksti/${a.slug}`) },
    openGraph: og({ path: `/raksti/${a.slug}`, title: a.seoTitle ?? a.title, description: a.excerpt, image: `/raksti/${a.slug}/opengraph-image` }),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const isMoonTopic = ["Pamati", "Biodinamika"].includes(a.category);
  const related = getRelatedArticles(a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    inLanguage: "lv",
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
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
  // FAQPage from the article's own "biežākie jautājumi" section → rich results + AI extraction.
  const faq = articleFaq(a);
  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((q) => ({
          "@type": "Question",
          name: q.q,
          acceptedAnswer: { "@type": "Answer", text: q.a },
        })),
      }
    : null;

  // Jump-to table of contents from the article's own H2 headings (shown when ≥3).
  const toc = a.body
    .filter((s) => s.heading)
    .map((s) => ({ label: s.heading as string, id: headingSlug(s.heading as string) }));

  const MONTHS_LOC = ["janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā", "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī"];
  const [reviewedYear, reviewedMonth] = a.updatedAt.split("-").map(Number);
  const reviewedLabel = `${reviewedYear}. g. ${MONTHS_LOC[reviewedMonth - 1]}`;

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <ArticleEngagement slug={a.slug} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="article-reading-surface -mx-2 p-4 sm:mx-0 sm:p-8 md:p-10">

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
        <p className="mt-2 flex items-center gap-1.5 text-label-sm text-on-surface-variant">
          <Icon name="update" size="15px" />
          Pārbaudīts <time dateTime={a.updatedAt}>{reviewedLabel}</time>
        </p>
      </header>

      <aside className="mb-lg rounded-xl border border-primary/30 border-l-4 bg-primary-container/20 p-md shadow-lg shadow-primary/5">
        <p className="flex items-center gap-2 text-label-sm uppercase tracking-wide text-primary"><Icon name="lightbulb" size="18px" /> Īsā atbilde</p>
        <p className="mt-1 text-body-lg leading-relaxed text-on-surface">{a.shortAnswer}</p>
      </aside>

      {toc.length >= 3 && (
        <nav aria-label="Šajā rakstā" className="mb-lg rounded-xl border border-outline-variant/10 bg-surface-container p-md">
          <p className="mb-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Šajā rakstā</p>
          <ul className="space-y-1">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="14px" /> {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-lg">
        {a.body.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 id={headingSlug(section.heading)} className="mb-sm scroll-mt-24 text-headline-md text-on-surface">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((para, j) => (
              <p key={j} className="mb-sm text-body-lg leading-relaxed text-on-surface-variant">
                {para}
              </p>
            ))}
            {section.table && (
              <div className="mb-md">
                <div className="space-y-sm sm:hidden">
                  {section.table.rows.map((row, rowIndex) => (
                    <dl key={rowIndex} className="rounded-xl border border-outline-variant/25 bg-surface-container p-sm shadow-md shadow-black/5">
                      {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="border-b border-outline-variant/10 py-2 first:pt-0 last:border-0 last:pb-0">
                          <dt className="text-label-sm uppercase tracking-wide text-primary">{section.table?.headers[cellIndex]}</dt>
                          <dd className="mt-1 text-body-md leading-relaxed text-on-surface-variant">{cell}</dd>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
                <table className="hidden w-full border-collapse overflow-hidden rounded-xl border border-outline-variant/25 text-left text-body-md sm:table">
                  <thead className="bg-surface-container-high">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} scope="col" className="border-b border-outline-variant/20 px-sm py-2 font-semibold text-on-surface">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-outline-variant/10 last:border-0">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-sm py-2 align-top text-on-surface-variant">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.items && (
              section.listStyle === "numbered" ? (
                <ol className="mb-md list-decimal space-y-2 pl-6 text-body-lg leading-relaxed text-on-surface-variant">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ol>
              ) : (
                <ul className="mb-md space-y-2 text-body-lg leading-relaxed text-on-surface-variant">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon name={section.listStyle === "check" ? "check_circle" : "arrow_right"} size="18px" className="mt-1 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}
      </div>

      {isMoonTopic && <DataNote variant="moon" className="mt-lg" />}

      {a.entities?.crops?.[0] ? (
        <div className="mt-lg rounded-xl border border-primary/35 bg-primary-container/25 p-md shadow-lg shadow-primary/5">
          <h2 className="text-headline-md text-on-surface">Seko šim augam savā dārzā</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">Pievieno to bez konta — redzēsi aktuālos darbus un varēsi pierakstīt kopšanu.</p>
          <TrackedLink href={`/?pievienot=${a.entities.crops[0]}`} source={`raksts:${a.slug}`} placement="after_answer" className="mt-sm inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary transition-all duration-200 hover:brightness-110 active:scale-[0.98]">
            <Icon name="add" size="17px" /> Pievienot augu
          </TrackedLink>
        </div>
      ) : (
        <div className="mt-lg rounded-xl border border-primary/35 bg-primary-container/25 p-md shadow-lg shadow-primary/5">
          <h2 className="text-headline-md text-on-surface">Pārvērt padomu konkrētā darbā</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">Atver nākamo noderīgo rīku un saglabā sev aktuālo darbu.</p>
          <TrackedLink href={a.intent === "seasonal" ? "/kalendars" : "/planotajs"} source={`raksts:${a.slug}`} placement="after_answer" className="mt-sm inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary transition-all duration-200 hover:brightness-110 active:scale-[0.98]">
            <Icon name={a.intent === "seasonal" ? "calendar_month" : "architecture"} size="17px" />
            {a.intent === "seasonal" ? "Atvērt kalendāru" : "Atvērt dārza plānotāju"}
          </TrackedLink>
        </div>
      )}

      <NewsletterSignup source={`raksts:${a.slug}`} />

      {a.links && a.links.length > 0 && (
        <div className="mt-lg border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Noderīgi šai tēmai</h2>
          <ul className="space-y-2">
            {a.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-1 text-body-md text-primary hover:underline">
                  <Icon name="arrow_forward" size="16px" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {a.sources.length > 0 && (
        <div className="mt-lg border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Avoti un pārbaude</h2>
          <ul className="space-y-1 text-body-sm text-on-surface-variant">
            {a.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{source.label}</a></li>)}
          </ul>
        </div>
      )}

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

      {/* Secondary participation path: available without competing with the main CTA. */}
      <details className="group mt-lg border-t border-outline-variant/15 pt-md">
        <summary className="flex min-h-11 list-none items-center justify-between gap-sm rounded-lg px-sm text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2"><Icon name="forum" size="18px" /> Tev ir sava pieredze ar šo?</span>
          <Icon name="expand_more" size="20px" className="transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-sm pb-sm pt-2">
          <p className="mb-sm text-body-md text-on-surface-variant">Padalies ar savu dārza pieredzi — tā var palīdzēt citiem Latvijas dārzniekiem.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/iesutit" className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline"><Icon name="auto_stories" size="16px" /> Iesūti gudrību</Link>
            <Link href="/kopiena" className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline"><Icon name="groups" size="16px" /> Apmeklē kopienu</Link>
          </div>
        </div>
      </details>
      </div>
    </article>
  );
}

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
  const title = `${p.name} — pazīmes un ierobežošana dārzā`;
  const description = `${p.tagline} Kā pārbaudīt pazīmes, rīkoties pareizā secībā un novērst ${p.name.toLowerCase()} Latvijas dārzā.`;
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
    headline: `${p.name} — pazīmes un ierobežošana`,
    about: p.name,
    ...(p.image ? { image: canonical(p.image.src) } : {}),
    inLanguage: "lv",
    dateModified: p.updatedAt ?? `${DATA_REVIEWED}-01`,
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

      <nav className="mb-sm flex items-center gap-1 text-label-sm text-on-surface-variant" aria-label="Atpakaļceļš">
        <Link href="/kaitekli" className="inline-flex min-h-11 items-center hover:text-primary">Kaitēkļi un slimības</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{p.name}</span>
      </nav>

      <Card tone="highest" elevated linen className="pest-hero mb-md p-md sm:p-lg">
        <header className="flex items-start gap-md">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tertiary-container/25 text-5xl leading-none sm:h-20 sm:w-20 sm:text-6xl" aria-hidden="true">
            {p.emoji}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-1.5 text-label-sm uppercase tracking-[0.16em] text-tertiary">
              <Icon name={tm.icon} size="16px" /> {tm.label}
              <span className={`ml-1 ${sev.tone}`}>● {sev.label}</span>
            </p>
            <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">{p.name}</h1>
            {p.latin && <p className="text-body-md italic text-on-surface-variant">{p.latin}</p>}
            <p className="mt-2 max-w-[36rem] text-body-lg text-on-surface-variant">{p.tagline}</p>
          </div>
        </header>
      </Card>

      {p.shortAnswer && (
        <aside className="mb-md rounded-xl border-l-4 border-primary bg-primary-container/15 p-md" aria-labelledby="short-answer-heading">
          <p id="short-answer-heading" className="mb-1 flex items-center gap-1.5 text-label-md font-semibold uppercase tracking-wide text-primary">
            <Icon name="lightbulb" size="18px" /> Īsā atbilde
          </p>
          <p className="text-body-lg leading-relaxed text-on-surface">{p.shortAnswer}</p>
        </aside>
      )}

      {p.image && (
        <figure className="mb-md overflow-hidden rounded-xl border border-outline-variant/10">
          {/* Real, correctly-licensed identification photo — far better than an emoji
              for actually recognising the pest on your own plant. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image.src}
            alt={p.image.alt ?? `${p.name} — reāls foto atpazīšanai`}
            loading="eager"
            className="max-h-[360px] w-full object-cover"
          />
          <figcaption className="bg-surface-container px-3 py-1.5 text-label-sm text-on-surface-variant">
            Foto: {p.image.credit} · {p.image.license} ·{" "}
            <a href={p.image.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Wikimedia Commons
            </a>
          </figcaption>
        </figure>
      )}

      <div className="article-reading-surface mb-lg space-y-sm p-md sm:p-lg">
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
                  {href ? <Link href={href} className="inline-flex min-h-11 items-center text-primary hover:underline">{a}</Link> : a}
                  {i < p.affects.length - 1 ? "," : ""}
                </span>
              );
            })}
          </p>
        )}
      </Card>

      {/* Related types / other host plants */}
      {p.compare?.items?.length ? (
        <>
          <h2 className="mb-sm text-headline-md text-on-surface">{p.compare.heading}</h2>
          <Card tone="high" className="mb-lg p-md">
            {p.compare.intro && (
              <p className="mb-sm text-body-md leading-relaxed text-on-surface-variant">{p.compare.intro}</p>
            )}
            <ul className="grid gap-2 sm:grid-cols-2">
              {p.compare.items.map((it, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl bg-surface-container p-sm text-body-md text-on-surface-variant">
                  <Icon name="eco" size="16px" className="mt-1 shrink-0 text-tertiary" />
                  <span>
                    {it.href ? (
                      <Link href={it.href} className="font-semibold text-primary hover:underline">{it.name}</Link>
                    ) : (
                      <span className="font-semibold text-on-surface">{it.name}</span>
                    )}
                    {" — "}
                    {it.note}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : null}

      <h2 className="mb-sm text-headline-md text-on-surface">Ko darīt tagad</h2>
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
        {p.safetyNote && (
          <div className="mt-md flex items-start gap-2 border-t border-outline-variant/15 pt-md text-label-md leading-relaxed text-on-surface-variant">
            <Icon name="verified_user" size="18px" className="mt-0.5 shrink-0 text-tertiary" />
            <p>{p.safetyNote}</p>
          </div>
        )}
      </Card>

      {/* Linked recipes from our vault */}
      {recipes.length > 0 && (
        <Card tone="container" accent="secondary" className="mb-lg p-md">
          <p className="mb-sm flex items-center gap-2 text-label-md uppercase tracking-wide text-secondary">
            <Icon name="science" size="16px" /> Gatavas receptes pret šo
          </p>
          <div className="flex flex-wrap gap-2">
            {recipes.map((r) => (
              <Link key={r.slug} href={`/receptes/${r.slug}`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-secondary-container/25 px-3 py-1.5 text-label-md text-secondary-fixed hover:brightness-110">
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
          <div className="mb-lg divide-y divide-outline-variant/15 overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container">
            {p.faq.map((q) => (
              <details key={q.q} className="group px-md open:bg-surface-container-high">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-2 py-sm font-semibold text-on-surface marker:content-none">
                  <span className="flex-1">{q.q}</span>
                  <Icon name="expand_more" size="20px" className="shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-md text-body-md leading-relaxed text-on-surface-variant">{q.a}</p>
              </details>
            ))}
          </div>
        </>
      ) : null}

      {p.relatedLinks && p.relatedLinks.length > 0 && (
        <section className="mb-lg" aria-labelledby="problem-related-heading">
          <h2 id="problem-related-heading" className="mb-sm text-headline-md text-on-surface">Saistītie padomi</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {p.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex min-h-14 items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container px-md py-sm text-body-md font-semibold text-on-surface hover:bg-surface-container-high hover:text-primary">
                <Icon name="arrow_outward" size="18px" className="shrink-0 text-primary" /> {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {p.sources && p.sources.length > 0 && (
        <section className="mb-lg border-t border-outline-variant/10 pt-md" aria-labelledby="problem-sources-heading">
          <h2 id="problem-sources-heading" className="text-headline-md text-on-surface">Avoti un pārbaude</h2>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Saturs pārbaudīts {p.updatedAt ? new Intl.DateTimeFormat("lv-LV").format(new Date(`${p.updatedAt}T12:00:00Z`)) : "redakcijas pārbaudē"}.
          </p>
          <ul className="mt-2 space-y-1">
            {p.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
                  {source.label} <Icon name="open_in_new" size="15px" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblings.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-md">
          <h2 className="mb-sm text-headline-md text-on-surface">Citas dārza problēmas</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} href={`/kaitekli/${x.slug}`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                {x.emoji} {x.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

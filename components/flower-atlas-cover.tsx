import Image from "next/image";
import Link from "next/link";
import { contentImage } from "@/lib/content-images";
import { snowdropFloweringLink } from "@/components/snowdrop-flowering";

const coverFlowers = [
  { slug: "sniegpulkstenites", name: "Sniegpulkstenītes", latin: "Galanthus nivalis", month: "Marts", image: "sniegpulkstenites-ziedi" },
  { slug: "maijpukites", name: "Maijpuķītes", latin: "Convallaria majalis", month: "Maijs", image: "maijpukites-ziedi" },
];

export function FlowerAtlasCover({ nameCount }: { nameCount: number }) {
  const flowers = coverFlowers.map((flower) => ({ ...flower, photo: contentImage(flower.image) }));

  return (
    <header className="mb-md border-b border-outline-variant/50 pb-2">
      <div className="grid gap-md lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-lg">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.1] tracking-tight text-on-surface">Puķu atlants</h1>
          <p className="mt-2 font-display text-title-md text-primary md:text-headline-md">Puķu nosaukumi no A līdz Z</p>
          <p className="mt-3 max-w-[36ch] text-body-md text-on-surface-variant">Meklē starp {nameCount} dārza un istabas puķu nosaukumiem vai atpazīsti savu augu pēc attēla.</p>
          <nav aria-label="Pārlūkot puķu atlantu" className="mt-3 flex flex-wrap gap-2">
            <a href="#puku-atteli" className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-label-md text-on-primary hover:bg-primary-fixed">Skatīt attēlus</a>
            <a href="#puku-nosaukumi" className="inline-flex min-h-11 items-center rounded-full border border-outline-variant px-4 text-label-md text-primary hover:bg-surface-container">Nosaukumi A–Z</a>
          </nav>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-md">
          {flowers.map(({ slug, name, latin, month, photo }, index) => (
            <div key={slug} className="min-w-0">
              <Link href={`/pukes/${slug}`} className="group block rounded-md">
                <div className="relative aspect-[5/4] overflow-hidden rounded-md bg-surface-container sm:aspect-[3/2] lg:aspect-[5/4]">
                  <Image src={photo.src} alt={photo.alt} fill priority={index === 0} sizes="(min-width: 1024px) 27vw, 47vw" className="object-cover" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-1 text-label-sm uppercase tracking-wider text-primary">
                  <span>{month}</span>
                  <span aria-hidden="true" className="text-base leading-none">↗</span>
                </div>
                <span className="mt-1 block font-display text-[clamp(0.9rem,3.9vw,1.35rem)] font-semibold leading-tight text-on-surface group-hover:underline">{name}</span>
                <i lang="la" className="mt-1 block text-body-sm text-on-surface-variant">{latin}</i>
              </Link>
              {slug === "sniegpulkstenites" && <Link href={snowdropFloweringLink} className="mt-1 inline-flex min-h-11 items-center text-body-sm text-primary underline underline-offset-2">Kad zied Ukros un Rankā?</Link>}
            </div>
          ))}
        </div>
      </div>
      <details className="mt-1 text-body-sm text-on-surface-variant">
        <summary className="ml-auto w-fit cursor-pointer py-2 text-primary underline underline-offset-2">Foto avoti</summary>
        <ul className="grid gap-sm rounded-md bg-surface-container-low p-sm sm:grid-cols-2">
          {flowers.map(({ name, photo }) => (
            <li key={name}>
              <strong>{name}</strong> · {photo.author} · <a href={photo.sourceUrl} className="text-primary underline">{photo.sourceName}</a> · <a href={photo.licenseUrl} className="text-primary underline">{photo.license}</a>. {photo.changes} Priekšskatījumā redzams attēla izgriezums.
            </li>
          ))}
        </ul>
      </details>
    </header>
  );
}

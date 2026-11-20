import Image from "next/image";
import { contentImage } from "@/lib/content-images";
import { WINTER_HOUSEPLANTS } from "@/lib/flower-names";

export function WinterHouseplantComparison() {
  const plants = WINTER_HOUSEPLANTS.map((plant) => ({ ...plant, photo: contentImage(plant.image.id) }));
  return (
    <section id="ziemas-telpaugi" aria-labelledby="winter-houseplants-title" className="mb-lg scroll-mt-24">
      <h2 id="winter-houseplants-title" className="text-headline-md text-on-surface">Salīdzini četrus ziemā ziedošus telpaugus</h2>
      <p className="my-sm text-body-md text-on-surface-variant">Atrodi savam augam līdzīgo un atver tā kopšanas ceļvedi.</p>
      <ul className="grid grid-cols-2 gap-2 sm:gap-md xl:grid-cols-4">
        {plants.map(({ name, href, image, photo }) => (
          <li key={href} className="min-w-0">
            <a href={href} className="group block h-full rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container">
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
                sizes="(max-width: 639px) 46vw, (max-width: 1279px) 40vw, 20vw"
                className="aspect-[4/3] w-full rounded-t-lg bg-surface-container-lowest object-contain" />
              <div className="p-2 sm:p-sm">
                <h3 className="text-label-md font-semibold text-primary group-hover:underline sm:text-title-md">{name} <span aria-hidden="true">→</span></h3>
                <p className="mt-1 text-body-sm leading-snug text-on-surface-variant">{image.caption}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <details className="mt-2 text-body-sm text-on-surface-variant">
        <summary className="w-fit min-h-11 cursor-pointer py-3 text-primary underline underline-offset-2">Foto autori un licences</summary>
        <ul className="grid gap-sm sm:grid-cols-2">
          {plants.map(({ href, name, photo }) => (
            <li key={href}>
              <strong>{name}</strong> · {photo.author} · <a href={photo.sourceUrl} className="text-primary underline">{photo.sourceName}</a> · <a href={photo.licenseUrl} className="text-primary underline">{photo.license}</a>. {photo.changes}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

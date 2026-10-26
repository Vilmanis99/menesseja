import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { contentImage } from "@/lib/content-images";

export interface FlowerGalleryItem {
  name: string;
  latin?: string;
  href: string;
  imageId: string;
}

export function FlowerGallery({ items }: { items: FlowerGalleryItem[] }) {
  return <section id="puku-atteli" className="mb-lg scroll-mt-24" aria-labelledby="flower-photos-title">
    <h2 id="flower-photos-title" className="text-headline-md text-on-surface">Puķu nosaukumi un attēli</h2>
    <p className="mt-sm max-w-3xl text-body-md text-on-surface-variant">{items.length} puķes attēlos, lai nosaukumu saistītu ar ziedu. Vienas sugas šķirnes var izskatīties atšķirīgi; atver ceļvedi, lai uzzinātu vairāk par audzēšanu.</p>
    <div className="mt-md grid grid-cols-2 gap-sm sm:grid-cols-3 sm:gap-md lg:grid-cols-4">
      {items.map((item) => {
        const asset = contentImage(item.imageId);
        return <figure key={item.href} className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container">
          <TrackedLink href={item.href} source="flower-index" placement="photo" className="block hover:bg-surface-container-high">
            <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" className="aspect-[4/3] w-full object-cover" />
            <span className="block px-sm pt-sm text-title-md text-primary">{item.name} →</span>
            {item.latin && <span className="block px-sm text-body-sm italic text-on-surface-variant">{item.latin}</span>}
          </TrackedLink>
          <figcaption className="px-sm pb-sm pt-1 text-label-sm text-on-surface-variant">
            Foto: {asset.author} · <a href={asset.sourceUrl} className="underline">{asset.sourceName}</a> · <a href={asset.licenseUrl} className="underline">{asset.license}</a>
          </figcaption>
        </figure>;
      })}
    </div>
  </section>;
}

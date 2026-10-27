import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { contentImage } from "@/lib/content-images";

/** Server-rendered card; the full registry stays out of the search bundle. */
export function FlowerPhotoCard({ name, latin, href, imageId, caption }: {
  name: string; latin?: string; href: string; imageId: string; caption?: string;
}) {
  const asset = contentImage(imageId);
  return <figure className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container">
    <TrackedLink href={href} source="flower-index" placement="photo" className="block hover:bg-surface-container-high">
      <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw" className="aspect-[4/3] w-full bg-surface-container-lowest object-contain" />
      <span className="block px-sm pt-sm text-title-md text-primary">{name} →</span>
      {latin && <span className="block px-sm text-body-sm italic text-on-surface-variant">{latin}</span>}
    </TrackedLink>
    <figcaption className="space-y-2 px-sm pb-sm pt-2 text-on-surface-variant">
      {caption && <p className="text-body-sm">{caption}</p>}
      <p className="text-label-sm leading-relaxed">Foto: {asset.author} · <a href={asset.sourceUrl} className="underline underline-offset-2">{asset.sourceName}</a> · <a href={asset.licenseUrl} className="underline underline-offset-2">{asset.license}</a>{asset.changes ? `. ${asset.changes}` : ""}</p>
    </figcaption>
  </figure>;
}

import Image from "next/image";
import Link from "next/link";
import type { ContentImage } from "@/lib/content-images";
import { clsx } from "@/lib/clsx";

/** Resolve this small asset record on the server; never ship the image registry. */
export type CreditedPhotoAsset = Pick<ContentImage,
  "src" | "width" | "height" | "alt" | "author" | "sourceName" | "sourceUrl" | "license" | "licenseUrl" | "changes"
>;

export function CreditedPhoto({ asset, caption, sizes, className, imageClassName = "aspect-[3/2]", priority = false, href, linkLabel }: {
  asset: CreditedPhotoAsset;
  caption?: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Only the photo links to the content; attribution links remain siblings. */
  href?: string;
  linkLabel?: string;
}) {
  const photo = <Image
    src={asset.src}
    alt={asset.alt}
    width={asset.width}
    height={asset.height}
    sizes={sizes}
    priority={priority}
    className={clsx("block w-full bg-surface-container-lowest object-contain", imageClassName)}
  />;

  return (
    <figure className={clsx("overflow-hidden bg-surface-container", className)}>
      {href ? <Link href={href} aria-label={linkLabel} className="block focus-visible:outline-offset-[-4px]">{photo}</Link> : photo}
      <figcaption className="space-y-1 p-sm text-on-surface-variant">
        {caption && <p className="text-body-md leading-relaxed">{caption}</p>}
        <p className="text-label-sm leading-relaxed">
          Foto: {asset.author} · <a href={asset.sourceUrl} className="underline underline-offset-2">{asset.sourceName}</a> ·{" "}
          <a href={asset.licenseUrl} className="underline underline-offset-2">{asset.license}</a>.
          {asset.changes && <> {asset.changes}</>}
        </p>
      </figcaption>
    </figure>
  );
}

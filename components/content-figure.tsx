import Image from "next/image";
import { contentImage, type ContentImageUse } from "@/lib/content-images";

export function ContentFigure({ image, priority = false, compact = false }: { image: ContentImageUse; priority?: boolean; compact?: boolean }) {
  const asset = contentImage(image.id);
  return (
    <figure className="my-md overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container print:break-inside-avoid">
      <a href={asset.src} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Atvērt foto pilnā izmērā: ${asset.alt} (jaunā cilnē)`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={compact ? "(max-width: 639px) calc(100vw - 64px), 220px" : "(max-width: 767px) calc(100vw - 48px), 688px"}
          priority={priority}
          className={compact ? "block aspect-[4/3] h-auto w-full object-contain" : "block h-auto max-h-[28rem] w-full object-contain"}
        />
      </a>
      <figcaption className="space-y-2 p-sm sm:p-md">
        <p className="text-body-md leading-relaxed text-on-surface">{image.caption}</p>
        <p className="text-label-sm leading-relaxed text-on-surface-variant">
          Foto: {asset.author} · <a href={asset.sourceUrl} className="underline underline-offset-2">{asset.sourceName}</a> ·{" "}
          <a href={asset.licenseUrl} className="underline underline-offset-2">{asset.license}</a>.
          {asset.changes && <> {asset.changes}</>}
        </p>
      </figcaption>
    </figure>
  );
}

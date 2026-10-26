import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";

const PHOTOS = [
  { id: "nelkes", name: "Turku neļķes", latin: "Dianthus barbatus", href: "/augi/nelkes", alt: "Koši rozā turku neļķu ziedkopas ar zobainām vainaglapu malām", author: "Cathy Dewitt", source: "dianthus-barbatus", width: 792, height: 640 },
  { id: "hortenzijas", name: "Skarainā hortenzija", latin: "Hydrangea paniculata", href: "/pukes/hortenzijas", alt: "Skarainās hortenzijas baltas, konusveida ziedkopas starp zaļām lapām", author: "Dotty Leatherwood", source: "hydrangea-paniculata", width: 800, height: 532 },
  { id: "tulpes", name: "Tulpes", latin: "Tulipa", href: "/pukes/tulpes", alt: "Rozā tulpju ziedi ar gaišām malām un platām zaļām lapām", author: "Cathy Dewitt", source: "tulipa", width: 480, height: 640 },
  { id: "dalijas", name: "Dālijas", latin: "Dahlia", href: "/pukes/dalijas", alt: "Pildīts dālijas zieds ar persiku krāsas vidu un rozā ārējām vainaglapām", author: "Jim Janke", source: "dahlia", width: 651, height: 640 },
  { id: "peonijas", name: "Peonijas", latin: "Paeonia ‘Eliza Lundy’", href: "/pukes/peonijas", alt: "Peonijas ‘Eliza Lundy’ sarkans, pildīts zieds tuvplānā", author: "Cathy Dewitt", source: "paeonia-herbaceous-types", width: 799, height: 640 },
  { id: "ehinacejas", name: "Ehinācija", latin: "Echinacea purpurea", href: "/pukes/ehinacija", alt: "Ehinācijas ziedi ar rozā mēlziediem un izcilu oranžbrūnu vidu", author: "Cathy Dewitt", source: "echinacea-purpurea", width: 640, height: 640 },
];

export function FlowerGallery() {
  return <section id="puku-atteli" className="mb-lg scroll-mt-24" aria-labelledby="flower-photos-title">
    <h2 id="flower-photos-title" className="text-headline-md text-on-surface">Puķu nosaukumi un attēli</h2>
    <p className="mt-sm max-w-3xl text-body-md text-on-surface-variant">Seši piemēri, lai nosaukumu saistītu ar ziedu. Vienas sugas šķirnes var izskatīties atšķirīgi; atver ceļvedi, lai uzzinātu vairāk par audzēšanu.</p>
    <div className="mt-md grid gap-md sm:grid-cols-2 lg:grid-cols-3">
      {PHOTOS.map((photo) => <figure key={photo.id} className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container">
        <TrackedLink href={photo.href} source="flower-index" placement="photo" className="block hover:bg-surface-container-high">
          <Image src={`/images/flowers/${photo.id}.webp`} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="aspect-[4/3] w-full object-cover" />
          <span className="block px-md pt-sm text-title-md text-primary">{photo.name} →</span>
          <span className="block px-md pb-sm text-body-sm italic text-on-surface-variant">{photo.latin}</span>
        </TrackedLink>
        <figcaption className="px-md pb-md text-label-sm text-on-surface-variant">
          Foto: {photo.author} · <a href={`https://plants.ces.ncsu.edu/plants/${photo.source}/`} className="underline">NC State Extension</a> · <a href="https://creativecommons.org/licenses/by/4.0/" className="underline">CC BY 4.0</a>. Attēls samazināts un pielāgots kartītei.
        </figcaption>
      </figure>)}
    </div>
  </section>;
}

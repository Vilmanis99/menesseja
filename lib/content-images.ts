import registry from "@/content/images.json";

/** Credits belong to the asset; the explanation belongs to its use in a page. */
export interface ContentImageUse {
  id: string;
  caption: string;
}

export interface ContentImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  sourceName: string;
  sourceUrl: string;
  originalUrl: string;
  license: string;
  licenseUrl: string;
  changes: string;
  reviewedAt: string;
}

const images: Record<string, ContentImage> = registry;

export function contentImage(id: string): ContentImage {
  const image = images[id];
  if (!image) throw new Error(`Unknown content image: ${id}`);
  return image;
}

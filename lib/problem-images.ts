import images from "@/content/problem-images.json";
import type { ContentImageUse } from "./content-images";

const identificationImages: Record<string, ContentImageUse> = images;

export function problemImage(slug: string): ContentImageUse | undefined {
  return identificationImages[slug];
}

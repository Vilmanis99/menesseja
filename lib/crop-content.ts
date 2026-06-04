import fs from "node:fs";
import path from "node:path";

export interface CropSection {
  heading: string;
  body: string;
}

export interface CropContent {
  intro: string;
  sections: CropSection[];
  folklore?: string;
}

/** Load the long-form prose for a crop (generated into content/crops/<id>.json).
 *  Returns null if not yet written, so pages fall back to the data template. */
export function getCropContent(id: string): CropContent | null {
  try {
    const file = path.join(process.cwd(), "content", "crops", `${id}.json`);
    return JSON.parse(fs.readFileSync(file, "utf-8")) as CropContent;
  } catch {
    return null;
  }
}

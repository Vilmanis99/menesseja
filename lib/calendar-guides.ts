import data from "@/content/calendar-guides.json";
import type { ContentImageUse } from "./content-images";

export interface CalendarGuide {
  title: string;
  description: string;
  image: ContentImageUse;
  timeline: { period: string; focus: string; sectionIds: string[] }[];
  sections: {
    id: string;
    area: string;
    heading: string;
    when: string;
    paragraphs: string[];
    steps: string[];
    avoid: string;
    sourceIds: string[];
    link: { label: string; href: string };
  }[];
  faq: { q: string; a: string }[];
  sourceIds: string[];
}

export const CALENDAR_GUIDES_UPDATED_AT = data.updatedAt;
const guides = data.months as Record<string, CalendarGuide>;
export const CALENDAR_SOURCES: Record<string, { label: string; url: string }> = data.sources;

export function calendarGuide(month: number): CalendarGuide {
  const guide = Number.isInteger(month) && guides[String(month)];
  if (!guide) throw new RangeError("Invalid calendar guide month");
  return guide;
}

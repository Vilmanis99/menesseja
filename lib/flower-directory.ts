import { MONTH_SLUGS, monthFromSlug } from "./seo";
import { normalizeArticleQuery } from "./article-search";
import { EXTRA_FLOWER_NAMES, FOLK_NAMES, type FlowerNameEntry, type FolkName } from "./flower-names";
import type { Flower } from "./flowers";

export interface FlowerDirectoryEntry extends FlowerNameEntry {
  id: string;
  bloomMonths?: number[];
  aliases: string[];
  hasFolkName: boolean;
}

const baseName = (name: string) => normalizeArticleQuery(name.split("(")[0]);

/** Counts names (including genera and subgroups), not unique species. */
export function flowerDirectoryEntries(
  flowers: Pick<Flower, "slug" | "name" | "latin" | "aliases" | "bloomMonths" | "tagline">[],
  extra: FlowerNameEntry[] = EXTRA_FLOWER_NAMES,
  folk: FolkName[] = FOLK_NAMES,
): FlowerDirectoryEntry[] {
  const entries: (FlowerNameEntry & { id: string; bloomMonths?: number[] })[] = [
    ...flowers.filter((flower) => flower.slug !== "balkona-pukes").map((flower) => ({
      id: flower.slug, name: flower.name, latin: flower.latin, note: flower.tagline,
      aliases: flower.aliases, bloomMonths: flower.bloomMonths, href: `/pukes/${flower.slug}`,
    })),
    ...extra.map((entry) => ({ ...entry, id: normalizeArticleQuery(entry.name).replace(/ /g, "-") })),
  ];
  return entries.map((entry) => {
    const folkNames = folk.filter((alias) => alias.slug
      ? entry.href === `/pukes/${alias.slug}`
      : baseName(alias.standard) === baseName(entry.name)
    ).map((alias) => alias.folk);
    return { ...entry, aliases: [...new Set([...(entry.aliases ?? []), ...folkNames])], hasFolkName: folkNames.length > 0 };
  }).sort((a, b) => a.name.localeCompare(b.name, "lv"));
}

export function matchesFlower(entry: FlowerDirectoryEntry, query: string, month = 0): boolean {
  if (month && !entry.bloomMonths?.includes(month)) return false;
  const text = normalizeArticleQuery([entry.name, entry.latin, entry.note, ...entry.aliases,
    entry.indoorGuide && "istabas puķes telpaugi", "puķu nosaukumi"].filter(Boolean).join(" "));
  return normalizeArticleQuery(query).split(" ").filter(Boolean).every((term) => text.includes(term));
}

export function readFlowerQuery(search: string): string {
  return (new URLSearchParams(search).get("q") ?? "").slice(0, 120);
}

export function readFlowerMonth(search: string): number {
  return monthFromSlug(new URLSearchParams(search).get("menesis") ?? "") ?? 0;
}

export function flowerSearchParams(query: string, search = "", month = readFlowerMonth(search)): string {
  const params = new URLSearchParams(search);
  params.delete("q");
  params.delete("menesis");
  if (MONTH_SLUGS[month - 1]) params.set("menesis", MONTH_SLUGS[month - 1]);
  const value = query.trim().slice(0, 120);
  if (value) params.set("q", value);
  return params.toString();
}

import { normalizeArticleQuery } from "./article-search";
import { EXTRA_FLOWER_NAMES, FOLK_NAMES, type FlowerNameEntry, type FolkName } from "./flower-names";
import type { Flower } from "./flowers";

export interface FlowerDirectoryEntry extends FlowerNameEntry {
  id: string;
  aliases: string[];
}

const baseName = (name: string) => normalizeArticleQuery(name.split("(")[0]);

/** Counts names (including genera and subgroups), not unique species. */
export function flowerDirectoryEntries(
  flowers: Pick<Flower, "slug" | "name" | "latin">[],
  extra: FlowerNameEntry[] = EXTRA_FLOWER_NAMES,
  folk: FolkName[] = FOLK_NAMES,
): FlowerDirectoryEntry[] {
  const entries = [
    ...flowers.filter((flower) => flower.slug !== "balkona-pukes").map((flower) => ({
      id: flower.slug, name: flower.name, latin: flower.latin, href: `/pukes/${flower.slug}`,
    })),
    ...extra.map((entry) => ({ ...entry, id: normalizeArticleQuery(entry.name).replace(/ /g, "-") })),
  ];
  return entries.map((entry) => ({
    ...entry,
    aliases: folk.filter((alias) => alias.slug
      ? entry.href === `/pukes/${alias.slug}`
      : baseName(alias.standard) === baseName(entry.name)
    ).map((alias) => alias.folk),
  })).sort((a, b) => a.name.localeCompare(b.name, "lv"));
}

export function matchesFlower(entry: FlowerDirectoryEntry, query: string): boolean {
  const text = normalizeArticleQuery([entry.name, entry.latin, entry.note, ...entry.aliases].filter(Boolean).join(" "));
  return normalizeArticleQuery(query).split(" ").filter(Boolean).every((term) => text.includes(term));
}

export function readFlowerQuery(search: string): string {
  return (new URLSearchParams(search).get("q") ?? "").slice(0, 120);
}

export function flowerSearchParams(query: string, search = ""): string {
  const params = new URLSearchParams(search);
  params.delete("q");
  const value = query.trim().slice(0, 120);
  if (value) params.set("q", value);
  return params.toString();
}

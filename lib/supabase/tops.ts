import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";
import { CROPS } from "@/lib/planting-crops";
import { cropEmoji } from "@/lib/crop-visual";

export interface NationalTopCrop {
  cropId: string;
  name: string;
  emoji: string;
  category: string;
  plantings: number;
}

/**
 * Live "what Latvia is planting" data from the public `top_crops_30d` view
 * (aggregate counts only — no personal rows, safe past RLS). Server-side,
 * cached 10 min. Returns [] when the backend isn't configured or on any error,
 * so the page degrades to editorial tops gracefully.
 */
export async function fetchNationalTops(limit = 12): Promise<NationalTopCrop[]> {
  if (!isSupabaseConfigured) return [];
  try {
    // Over-fetch, then slice after dropping any crop_ids no longer in CROPS, so
    // a stale row can't shrink the visible list below `limit`.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/top_crops_30d?select=crop_id,plantings&limit=${limit + 8}`,
      {
        headers: { apikey: SUPABASE_ANON_KEY!, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        next: { revalidate: 600 },
      },
    );
    if (!res.ok) return [];
    const rows: { crop_id: string; plantings: number }[] = await res.json();
    return rows
      .flatMap((r) => {
        const crop = CROPS.find((c) => c.id === r.crop_id);
        if (!crop) return [];
        return [
          {
            cropId: r.crop_id,
            name: crop.name,
            emoji: cropEmoji(r.crop_id),
            category: crop.category as string,
            plantings: r.plantings,
          },
        ];
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** Total plantings represented, for honest "based on N gardens" framing. */
export function totalPlantings(tops: NationalTopCrop[]): number {
  return tops.reduce((s, t) => s + t.plantings, 0);
}

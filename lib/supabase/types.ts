/**
 * Hand-written DB types mirroring supabase/migrations/0001_init.sql.
 * Regenerate from the live project any time with:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 */
export type Region = "kurzeme" | "vidzeme" | "zemgale" | "latgale" | "pieriga";

export interface Profile {
  id: string;
  display_name: string | null;
  region: Region | null;
  gardener_type: string | null;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
}

export interface PlantRow {
  id: string;
  user_id: string;
  crop_id: string;
  area: string;
  sown_date: string | null;
  status: string | null;
  seed: boolean;
  created_at: string;
}

export interface PlantLogRow {
  id: string;
  plant_id: string;
  user_id: string;
  date: string;
  type: string;
  note: string | null;
  amount: number | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  region: Region | null;
  body: string;
  created_at: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  active: boolean;
  created_at: string;
}

export interface Badge {
  user_id: string;
  badge_key: string;
  earned_at: string;
}

export interface TopCrop {
  crop_id: string;
  plantings: number;
}

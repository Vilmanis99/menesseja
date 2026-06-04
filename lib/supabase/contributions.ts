import type { SupabaseClient } from "@supabase/supabase-js";

export type ContributionType = "recepte" | "ticejums" | "paraza";

export interface ContributionInput {
  type: ContributionType;
  title: string;
  body: string;
  region?: string | null;
  authorName?: string | null;
}

export interface ApprovedContribution {
  id: string;
  type: ContributionType;
  title: string;
  body: string;
  region: string | null;
  author_name: string | null;
  created_at: string;
}

export const CONTRIBUTION_META: Record<ContributionType, { label: string; icon: string }> = {
  recepte: { label: "Recepte", icon: "science" },
  ticejums: { label: "Ticējums", icon: "auto_stories" },
  paraza: { label: "Paraža", icon: "diversity_3" },
};

export async function submitContribution(sb: SupabaseClient, userId: string, input: ContributionInput) {
  const { error } = await sb.from("contributions").insert({
    user_id: userId,
    type: input.type,
    title: input.title.trim(),
    body: input.body.trim(),
    region: input.region ?? null,
    author_name: input.authorName?.trim() || null,
    status: "pending",
  });
  if (error) throw error;
}

/** Publicly-approved wisdom for display (PII-free view). */
export async function fetchApproved(sb: SupabaseClient, limit = 30): Promise<ApprovedContribution[]> {
  const { data, error } = await sb
    .from("approved_contributions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as ApprovedContribution[]) ?? [];
}

/** The signed-in user's own submissions (incl. pending), so they can see status. */
export async function fetchMine(sb: SupabaseClient, userId: string) {
  const { data } = await sb
    .from("contributions")
    .select("id, type, title, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

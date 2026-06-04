import type { SupabaseClient } from "@supabase/supabase-js";

export interface FeedPost {
  id: string;
  userId: string;
  authorName: string;
  region: string | null;
  body: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  mine: boolean;
}

/** Loads the community feed (optionally filtered by region) with author names,
 *  like counts and whether the current user liked each post. Uses 3 small reads
 *  (no schema-level FK between posts↔profiles, so we join client-side). */
export async function fetchFeed(
  sb: SupabaseClient,
  opts: { region?: string | null; currentUserId?: string | null; limit?: number } = {},
): Promise<FeedPost[]> {
  const { region, currentUserId, limit = 50 } = opts;
  let q = sb.from("community_posts").select("*").order("created_at", { ascending: false }).limit(limit);
  if (region) q = q.eq("region", region);
  const { data: posts, error } = await q;
  if (error || !posts?.length) return [];

  const postIds = posts.map((p) => p.id);
  const authorIds = [...new Set(posts.map((p) => p.user_id))];
  const [{ data: profiles }, { data: likes }] = await Promise.all([
    sb.from("profiles").select("id, display_name").in("id", authorIds),
    sb.from("post_likes").select("post_id, user_id").in("post_id", postIds),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name as string | null]));
  const likeCount = new Map<string, number>();
  const mineLikes = new Set<string>();
  for (const l of likes ?? []) {
    likeCount.set(l.post_id, (likeCount.get(l.post_id) ?? 0) + 1);
    if (currentUserId && l.user_id === currentUserId) mineLikes.add(l.post_id);
  }

  return posts.map((p) => ({
    id: p.id,
    userId: p.user_id,
    authorName: nameById.get(p.user_id) || "Dārznieks",
    region: p.region,
    body: p.body,
    createdAt: p.created_at,
    likeCount: likeCount.get(p.id) ?? 0,
    likedByMe: mineLikes.has(p.id),
    mine: !!currentUserId && p.user_id === currentUserId,
  }));
}

export async function createPost(sb: SupabaseClient, userId: string, region: string | null, body: string) {
  const id = crypto.randomUUID();
  const { error } = await sb.from("community_posts").insert({ id, user_id: userId, region, body });
  if (error) throw error;
  return id;
}

export async function deletePost(sb: SupabaseClient, id: string) {
  const { error } = await sb.from("community_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function setLike(sb: SupabaseClient, postId: string, userId: string, liked: boolean) {
  if (liked) {
    const { error } = await sb.from("post_likes").insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  } else {
    const { error } = await sb.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw error;
  }
}

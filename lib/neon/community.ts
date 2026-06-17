import { getSql } from "./db";
import { REGIONS } from "@/lib/regions";

/**
 * Pseudonymous community backed by Neon. No accounts: identity is a
 * client-generated device id + a chosen display name. All writes are validated
 * and rate-limited here (the only trust boundary, since there is no auth/RLS).
 */

const REGION_IDS = new Set<string>(REGIONS.map((r) => r.id));
const MAX_BODY = 2000;
const MAX_NAME = 40;
const MAX_CLIENT = 64;
const RATE_MAX = 5; // posts per 10-minute window

export interface FeedPost {
  id: string;
  authorName: string;
  region: string | null;
  body: string;
  createdAt: string; // ISO UTC
  likeCount: number;
  likedByMe: boolean;
  mine: boolean;
}

type Row = {
  id: string;
  author_name: string;
  region: string | null;
  body: string;
  created_iso: string;
  client_id: string;
  like_count: number;
  liked_by_me: boolean;
};

const mapRow = (r: Row, clientId: string): FeedPost => ({
  id: r.id,
  authorName: r.author_name,
  region: r.region,
  body: r.body,
  createdAt: r.created_iso,
  likeCount: r.like_count,
  likedByMe: r.liked_by_me,
  mine: r.client_id === clientId,
});

export async function fetchFeed(opts: { region: string | null; clientId: string }): Promise<FeedPost[]> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  const { region, clientId } = opts;
  const rows = (region
    ? await sql`
        select p.id, p.author_name, p.region, p.body, p.client_id,
          to_char(p.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_iso,
          (select count(*) from community_likes l where l.post_id = p.id)::int as like_count,
          exists(select 1 from community_likes l where l.post_id = p.id and l.client_id = ${clientId}) as liked_by_me
        from community_posts p where p.region = ${region}
        order by p.created_at desc limit 100`
    : await sql`
        select p.id, p.author_name, p.region, p.body, p.client_id,
          to_char(p.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_iso,
          (select count(*) from community_likes l where l.post_id = p.id)::int as like_count,
          exists(select 1 from community_likes l where l.post_id = p.id and l.client_id = ${clientId}) as liked_by_me
        from community_posts p
        order by p.created_at desc limit 100`) as Row[];
  return rows.map((r) => mapRow(r, clientId));
}

export async function createPost(input: {
  clientId: string;
  authorName: string;
  region: string | null;
  body: string;
}): Promise<string> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  const clientId = (input.clientId || "").trim();
  if (!clientId || clientId.length > MAX_CLIENT) throw new Error("bad-client");
  const body = (input.body || "").trim();
  if (!body) throw new Error("empty");
  if (body.length > MAX_BODY) throw new Error("too-long");
  const authorName = ((input.authorName || "").trim() || "Dārznieks").slice(0, MAX_NAME);
  const region = input.region && REGION_IDS.has(input.region) ? input.region : null;

  const recent = (await sql`
    select count(*)::int as n from community_posts
    where client_id = ${clientId} and created_at > now() - interval '10 minutes'`) as { n: number }[];
  if (recent[0].n >= RATE_MAX) throw new Error("rate-limited");

  const rows = (await sql`
    insert into community_posts (client_id, author_name, region, body)
    values (${clientId}, ${authorName}, ${region}, ${body}) returning id`) as { id: string }[];
  return rows[0].id;
}

export async function deletePost(id: string, clientId: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  // client_id match → users can only delete their own posts (best-effort, no auth)
  await sql`delete from community_posts where id = ${id} and client_id = ${clientId}`;
}

export async function setLike(postId: string, clientId: string, like: boolean): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  if (like) {
    await sql`insert into community_likes (post_id, client_id) values (${postId}, ${clientId}) on conflict do nothing`;
  } else {
    await sql`delete from community_likes where post_id = ${postId} and client_id = ${clientId}`;
  }
}

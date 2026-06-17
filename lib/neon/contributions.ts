import { getSql } from "./db";
import { REGIONS } from "@/lib/regions";
import type {
  ContributionType,
  ContributionStatus,
  ApprovedContribution,
  MyContribution,
  PendingContribution,
} from "@/lib/contributions";

/**
 * "Senču gudrība" submissions backed by Neon. Pseudonymous, like the community:
 * identity is a client-generated device id + an optional chosen author label.
 * Lightly moderated — rows are created 'pending' and only surface publicly once
 * an admin sets them 'approved'. All validation/rate-limiting lives here (the
 * only trust boundary, since there is no auth). Shared types + display metadata
 * live in the client-safe `lib/contributions.ts`.
 */

const REGION_IDS = new Set<string>(REGIONS.map((r) => r.id));
const TYPES = new Set<string>(["recepte", "ticejums", "paraza"]);
const MAX_TITLE = 200;
const MAX_BODY = 4000;
const MAX_NAME = 120;
const MAX_CLIENT = 64;
const RATE_MAX = 5; // submissions per 10-minute window per device

export async function submitContribution(input: {
  clientId: string;
  type: string;
  title: string;
  body: string;
  region?: string | null;
  authorName?: string | null;
}): Promise<string> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");

  const clientId = (input.clientId || "").trim();
  if (!clientId || clientId.length > MAX_CLIENT) throw new Error("bad-client");
  if (!TYPES.has(input.type)) throw new Error("bad-type");
  const title = (input.title || "").trim();
  if (!title) throw new Error("empty");
  if (title.length > MAX_TITLE) throw new Error("too-long");
  const body = (input.body || "").trim();
  if (!body) throw new Error("empty");
  if (body.length > MAX_BODY) throw new Error("too-long");
  const region = input.region && REGION_IDS.has(input.region) ? input.region : null;
  const authorName = (input.authorName || "").trim().slice(0, MAX_NAME) || null;

  const recent = (await sql`
    select count(*)::int as n from community_contributions
    where client_id = ${clientId} and created_at > now() - interval '10 minutes'`) as { n: number }[];
  if (recent[0].n >= RATE_MAX) throw new Error("rate-limited");

  const rows = (await sql`
    insert into community_contributions (client_id, type, title, body, region, author_name)
    values (${clientId}, ${input.type}, ${title}, ${body}, ${region}, ${authorName})
    returning id`) as { id: string }[];
  return rows[0].id;
}

type ApprovedRow = {
  id: string;
  type: ContributionType;
  title: string;
  body: string;
  region: string | null;
  author_name: string | null;
  created_iso: string;
};

const mapApproved = (r: ApprovedRow): ApprovedContribution => ({
  id: r.id,
  type: r.type,
  title: r.title,
  body: r.body,
  region: r.region,
  authorName: r.author_name,
  createdAt: r.created_iso,
});

/** Publicly-approved wisdom for display. */
export async function fetchApproved(limit = 30): Promise<ApprovedContribution[]> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  const n = Math.min(Math.max(1, limit), 100);
  const rows = (await sql`
    select id, type, title, body, region, author_name,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_iso
    from community_contributions where status = 'approved'
    order by created_at desc limit ${n}`) as ApprovedRow[];
  return rows.map(mapApproved);
}

/** The device's own submissions (any status), so the submitter can see progress. */
export async function fetchMine(clientId: string): Promise<MyContribution[]> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  const cid = (clientId || "").trim();
  if (!cid) return [];
  const rows = (await sql`
    select id, type, title, status from community_contributions
    where client_id = ${cid} order by created_at desc limit 50`) as {
    id: string;
    type: ContributionType;
    title: string;
    status: ContributionStatus;
  }[];
  return rows;
}

/** Admin: submissions awaiting review. */
export async function fetchPending(limit = 50): Promise<PendingContribution[]> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  const n = Math.min(Math.max(1, limit), 100);
  const rows = (await sql`
    select id, type, title, body, region, author_name, status,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_iso
    from community_contributions where status = 'pending'
    order by created_at asc limit ${n}`) as (ApprovedRow & { status: ContributionStatus })[];
  return rows.map((r) => ({ ...mapApproved(r), status: r.status }));
}

/** Admin: approve or reject a submission. */
export async function moderateContribution(id: string, status: "approved" | "rejected"): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("db-not-configured");
  await sql`update community_contributions set status = ${status} where id = ${id}`;
}

// One-off: create the community_contributions table in Neon.
// Run from project root: `node --env-file=.env.local scripts/create-contrib-table.mjs`
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const sql = neon(url);

await sql`
  create table if not exists community_contributions (
    id          uuid primary key default gen_random_uuid(),
    client_id   text not null,
    type        text not null,
    title       text not null,
    body        text not null,
    region      text,
    author_name text,
    status      text not null default 'pending',
    created_at  timestamptz not null default now()
  )`;
await sql`create index if not exists idx_contrib_status on community_contributions (status, created_at desc)`;
await sql`create index if not exists idx_contrib_client on community_contributions (client_id)`;

const cols = await sql`
  select column_name, data_type from information_schema.columns
  where table_name = 'community_contributions' order by ordinal_position`;
console.log("✅ community_contributions ready. Columns:");
for (const c of cols) console.log(`   ${c.column_name} (${c.data_type})`);
const count = await sql`select count(*)::int as n from community_contributions`;
console.log(`   rows: ${count[0].n}`);

import { neon } from "@neondatabase/serverless";

/**
 * Lazy Neon (Postgres) SQL client. SERVER-ONLY — never import from a client
 * component; the connection string is a full-access DB credential.
 * Returns null when DATABASE_URL is unset, so the app builds and runs without a
 * database (the community just shows a "coming soon" notice).
 */
let cached: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!cached) cached = neon(url);
  return cached;
}

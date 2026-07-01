import { NextRequest, NextResponse } from "next/server";
import { countContributions } from "@/lib/neon/contributions";
import { countPosts } from "@/lib/neon/community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin status probe for the /admin panel. Tells the panel three things:
 *  - hasAdminKey: whether ADMIN_KEY is configured on the server at all
 *  - keyValid: whether the supplied key matches (only then are counts returned)
 *  - counts: pending/approved/rejected contributions + community post total
 * This lets the panel show a precise message ("key not set in Vercel" vs
 * "wrong key") instead of a silent empty screen.
 */
export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  const expected = process.env.ADMIN_KEY;
  const hasAdminKey = !!expected;
  const keyValid = hasAdminKey && !!key && key === expected;
  if (!keyValid) return NextResponse.json({ hasAdminKey, keyValid: false });
  try {
    const [contrib, community] = await Promise.all([countContributions(), countPosts()]);
    return NextResponse.json({ hasAdminKey, keyValid: true, counts: { contrib, community } });
  } catch (e) {
    const msg = (e as Error).message === "db-not-configured" ? "not-configured" : "server";
    return NextResponse.json({ hasAdminKey, keyValid: true, error: msg });
  }
}

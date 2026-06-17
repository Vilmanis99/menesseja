import { NextRequest, NextResponse } from "next/server";
import {
  submitContribution,
  fetchApproved,
  fetchMine,
  fetchPending,
} from "@/lib/neon/contributions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A non-empty ADMIN_KEY that matches the query unlocks moderation views/actions. */
function isAdmin(key: string | null): boolean {
  const expected = process.env.ADMIN_KEY;
  return !!expected && !!key && key === expected;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? "";
  const key = searchParams.get("key");
  try {
    const [approved, mine] = await Promise.all([
      fetchApproved(30),
      clientId ? fetchMine(clientId) : Promise.resolve([]),
    ]);
    const pending = isAdmin(key) ? await fetchPending(50) : undefined;
    return NextResponse.json({ approved, mine, ...(pending ? { pending } : {}) });
  } catch (e) {
    if ((e as Error).message === "db-not-configured")
      return NextResponse.json({ error: "not-configured" }, { status: 503 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: {
    clientId?: string;
    type?: string;
    title?: string;
    body?: string;
    region?: string | null;
    authorName?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const id = await submitContribution({
      clientId: body.clientId ?? "",
      type: body.type ?? "",
      title: body.title ?? "",
      body: body.body ?? "",
      region: body.region ?? null,
      authorName: body.authorName ?? null,
    });
    return NextResponse.json({ id });
  } catch (e) {
    const m = (e as Error).message;
    if (m === "db-not-configured") return NextResponse.json({ error: "not-configured" }, { status: 503 });
    if (m === "rate-limited") return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    if (["empty", "too-long", "bad-type", "bad-client"].includes(m))
      return NextResponse.json({ error: m }, { status: 400 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

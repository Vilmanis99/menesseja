import { NextRequest, NextResponse } from "next/server";
import { fetchFeed, createPost } from "@/lib/neon/community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const clientId = searchParams.get("clientId") ?? "";
  try {
    const posts = await fetchFeed({ region: region || null, clientId });
    return NextResponse.json({ posts });
  } catch (e) {
    if ((e as Error).message === "db-not-configured")
      return NextResponse.json({ error: "not-configured" }, { status: 503 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { clientId?: string; authorName?: string; region?: string | null; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  try {
    const id = await createPost({
      clientId: body.clientId ?? "",
      authorName: body.authorName ?? "",
      region: body.region ?? null,
      body: body.body ?? "",
    });
    return NextResponse.json({ id });
  } catch (e) {
    const m = (e as Error).message;
    if (m === "db-not-configured") return NextResponse.json({ error: "not-configured" }, { status: 503 });
    if (m === "rate-limited") return NextResponse.json({ error: "rate-limited" }, { status: 429 });
    if (["empty", "too-long", "name-too-long", "bad-client"].includes(m))
      return NextResponse.json({ error: m }, { status: 400 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { setLike } from "@/lib/neon/community";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { postId?: string; clientId?: string; like?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!body.postId || !body.clientId) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  try {
    await setLike(body.postId, body.clientId, !!body.like);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

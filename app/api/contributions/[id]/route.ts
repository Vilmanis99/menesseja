import { NextRequest, NextResponse } from "next/server";
import { moderateContribution } from "@/lib/neon/contributions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAdmin(key: string | null | undefined): boolean {
  const expected = process.env.ADMIN_KEY;
  return !!expected && !!key && key === expected;
}

/** Admin-only: approve or reject a submission. Guarded by ADMIN_KEY. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { status?: string; key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  if (!process.env.ADMIN_KEY) return NextResponse.json({ error: "moderation-disabled" }, { status: 503 });
  if (!isAdmin(body.key)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (body.status !== "approved" && body.status !== "rejected")
    return NextResponse.json({ error: "bad-status" }, { status: 400 });
  try {
    await moderateContribution(id, body.status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "db-not-configured")
      return NextResponse.json({ error: "not-configured" }, { status: 503 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

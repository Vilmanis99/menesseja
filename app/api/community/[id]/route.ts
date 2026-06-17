import { NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/lib/neon/community";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? "";
  if (!clientId) return NextResponse.json({ error: "bad-request" }, { status: 400 });
  try {
    await deletePost(id, clientId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

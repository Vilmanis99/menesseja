import { NextRequest, NextResponse } from "next/server";
import { deletePost, adminDeletePost } from "@/lib/neon/community";

export const runtime = "nodejs";

/** With a valid ADMIN_KEY, an admin may delete ANY post; otherwise a user may
 *  only delete their own (matched by client id). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? "";
  const key = searchParams.get("key");
  const isAdmin = !!process.env.ADMIN_KEY && !!key && key === process.env.ADMIN_KEY;
  try {
    if (isAdmin) {
      await adminDeletePost(id);
    } else {
      if (!clientId) return NextResponse.json({ error: "bad-request" }, { status: 400 });
      await deletePost(id, clientId);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

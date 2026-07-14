import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/brevo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  // Honeypot: real users never see/fill "website"; bots do. Pretend success.
  if (body.website) return NextResponse.json({ status: "pending-confirmation" }, { status: 202 });

  const result = await subscribeToNewsletter(body.email ?? "", body.source);
  if (result === "pending-confirmation") return NextResponse.json({ status: result }, { status: 202 });
  if (result === "already-subscribed") return NextResponse.json({ status: result });
  if (result === "invalid") return NextResponse.json({ status: result }, { status: 400 });
  if (result === "not-configured") return NextResponse.json({ status: result }, { status: 503 });
  return NextResponse.json({ status: "error" }, { status: 500 });
}

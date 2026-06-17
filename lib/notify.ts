import type { ContributionType } from "@/lib/contributions";
import { REGIONS } from "@/lib/regions";

/**
 * Best-effort email notification when a new "senču gudrība" contribution lands.
 * Uses Resend's HTTP API directly (no SDK dependency). Designed to be invisible
 * when not configured and to NEVER throw — a mail failure must not break the
 * submission, which has already been stored.
 *
 * Enable by setting RESEND_API_KEY (and optionally NOTIFY_EMAIL / NOTIFY_FROM).
 * With an unverified Resend account you may only send FROM `onboarding@resend.dev`
 * and TO the address you registered with — which is exactly the admin-self case.
 */

const LABEL: Record<ContributionType, string> = {
  recepte: "Recepte",
  ticejums: "Ticējums",
  paraza: "Paraža",
};

const regionName = (id: string | null) =>
  (id ? REGIONS.find((r) => r.id === id)?.name : null) ?? null;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyNewContribution(input: {
  id: string;
  type: ContributionType;
  title: string;
  body: string;
  region: string | null;
  authorName: string | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // notifications disabled — submission still succeeded

  const to = process.env.NOTIFY_EMAIL || "karlisvilmanis@gmail.com";
  const from = process.env.NOTIFY_FROM || "Mēness Sēja <onboarding@resend.dev>";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://menesseja.vercel.app";
  const adminKey = process.env.ADMIN_KEY;
  const reviewUrl = adminKey
    ? `${site}/iesutit?key=${encodeURIComponent(adminKey)}`
    : `${site}/iesutit`;

  const label = LABEL[input.type] ?? input.type;
  const region = regionName(input.region);
  const subject = `Jauna senču gudrība: ${label} — ${input.title}`;

  const metaLines = [
    `Tips: ${label}`,
    input.authorName ? `Autors: ${input.authorName}` : null,
    region ? `Reģions: ${region}` : null,
  ].filter(Boolean) as string[];

  const text = [
    `Jauns iesūtījums krātuvei.`,
    ``,
    ...metaLines,
    `Virsraksts: ${input.title}`,
    ``,
    input.body,
    ``,
    `Apstiprināt vai noraidīt:`,
    reviewUrl,
    adminKey ? `` : `(saite atvērsies tikai pēc ADMIN_KEY uzlikšanas Vercel)`,
  ].join("\n");

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1c1b1a">
    <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b;margin:0 0 4px">Jauns iesūtījums · ${esc(label)}</p>
    <h2 style="margin:0 0 8px;font-size:20px">${esc(input.title)}</h2>
    <p style="margin:0 0 12px;font-size:13px;color:#6b6b6b">${metaLines.map(esc).join(" &middot; ")}</p>
    <div style="white-space:pre-wrap;background:#f5f3ef;border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.5">${esc(input.body)}</div>
    <p style="margin:20px 0 0">
      <a href="${reviewUrl}" style="display:inline-block;background:#4a6b3a;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:600;font-size:14px">Skatīt un apstiprināt →</a>
    </p>
    ${adminKey ? "" : `<p style="font-size:12px;color:#9a9a9a;margin-top:10px">Saite strādās, kad būs uzlikts ADMIN_KEY vides mainīgais Vercel.</p>`}
  </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
  } catch {
    // swallow: the contribution is saved; a missed notification is not worth a 500
  }
}

/**
 * Brevo (sendinblue) newsletter subscription. SERVER-ONLY — BREVO_API_KEY is a
 * full-account credential; never import this from a client component.
 * Mirrors the graceful-degradation pattern of lib/neon/db.ts: with no key set
 * the API reports "not-configured" and the form shows a friendly notice.
 */

const API = "https://api.brevo.com/v3";

/** "Mēness Sēja — abonenti" list (created 2026-07; id is not a secret). */
export const NEWSLETTER_LIST_ID = 5;

export type SubscribeResult = "ok" | "invalid" | "not-configured" | "error";

/** Loose-but-practical email shape check; Brevo re-validates on its side. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export async function subscribeToNewsletter(email: string, source?: string): Promise<SubscribeResult> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return "not-configured";
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) return "invalid";

  try {
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        email: clean,
        listIds: [NEWSLETTER_LIST_ID],
        updateEnabled: true, // resubscribes/dedupes quietly instead of erroring
        attributes: { SOURCE: source?.slice(0, 120) ?? "site" },
      }),
    });
    if (res.ok) return "ok"; // 201 created / 204 updated
    if (res.status === 400) return "invalid";
    return "error";
  } catch {
    return "error";
  }
}

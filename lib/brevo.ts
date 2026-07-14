/**
 * Brevo (sendinblue) newsletter subscription. SERVER-ONLY — BREVO_API_KEY is a
 * full-account credential; never import this from a client component.
 * Mirrors the graceful-degradation pattern of lib/neon/db.ts: with no key set
 * the API reports "not-configured" and the form shows a friendly notice.
 */

const API = "https://api.brevo.com/v3";

/** "Mēness Sēja — abonenti" list (created 2026-07; id is not a secret). */
export const NEWSLETTER_LIST_ID = 5;

export type SubscribeResult = "pending-confirmation" | "already-subscribed" | "invalid" | "not-configured" | "error";

/** Loose-but-practical email shape check; Brevo re-validates on its side. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export async function subscribeToNewsletter(email: string, source?: string): Promise<SubscribeResult> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) return "invalid";
  const key = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!key || !Number.isInteger(templateId) || templateId <= 0) return "not-configured";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.menesseja.lv";

  try {
    const res = await fetch(`${API}/contacts/doubleOptinConfirmation`, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        email: clean,
        includeListIds: [NEWSLETTER_LIST_ID],
        templateId,
        redirectionUrl: `${siteUrl}/newsletter/apstiprinats`,
        attributes: { SOURCE: source?.slice(0, 120) ?? "site" },
      }),
    });
    if (res.ok) return "pending-confirmation";
    // Brevo reports an already-confirmed/existing contact as a 400 from the DOI
    // endpoint. The address was validated locally, so this state is safe to show.
    if (res.status === 400) return "already-subscribed";
    return "error";
  } catch {
    return "error";
  }
}

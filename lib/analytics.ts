export const ANALYTICS_CONSENT_KEY = "meness-seja:analytics-consent";
export const CONSENT_CHANGED_EVENT = "meness-seja:consent-changed";
export const CONSENT_OPEN_EVENT = "meness-seja:consent-open";

export type AnalyticsEvent =
  | "article_engaged"
  | "article_complete"
  | "internal_cta_click"
  | "newsletter_view"
  | "newsletter_submit"
  | "newsletter_confirmed"
  | "newsletter_error"
  | "garden_add_started"
  | "garden_add_completed"
  | "calendar_opened"
  | "planner_started"
  | "planner_saved"
  | "social_visit";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (!analyticsAllowed() || typeof window === "undefined") return;
  const analyticsWindow = window as typeof window & {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  };
  if (analyticsWindow.gtag) {
    analyticsWindow.gtag("event", event, params);
    return;
  }

  // React effects can fire just before gtag.js is ready. Keep the consented
  // event in Google's normal dataLayer queue instead of silently losing it.
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push(["event", event, params]);
}

export function openConsentSettings(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

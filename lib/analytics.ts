import { latviaDateParts } from "./day-anchor";
import { seasonForMonth } from "./seasonal";

export const ANALYTICS_CONSENT_KEY = "meness-seja:analytics-consent";
export const CONSENT_CHANGED_EVENT = "meness-seja:consent-changed";
export const CONSENT_OPEN_EVENT = "meness-seja:consent-open";

export type AnalyticsEvent =
  | "article_engaged"
  | "article_complete"
  | "internal_cta_click"
  | "newsletter_view"
  | "newsletter_submit"
  | "newsletter_pending"
  | "newsletter_already_subscribed"
  | "newsletter_confirmation_view"
  | "newsletter_error"
  | "garden_add_started"
  | "garden_add_completed"
  | "garden_add_error"
  | "garden_activated"
  | "garden_return"
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
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  const { year, month } = latviaDateParts();
  const context = { garden_year: year, garden_month: month, garden_season: seasonForMonth(month), page_path: window.location.pathname, ...params };
  // Use Google's arguments-object queue, including when an effect runs before
  // the tag has initialized. Never collect email, account IDs or garden names.
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  if (!analyticsWindow.gtag) {
    analyticsWindow.gtag = function () { analyticsWindow.dataLayer!.push(arguments); };
  }
  analyticsWindow.gtag("event", event, context);
}

export function openConsentSettings(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

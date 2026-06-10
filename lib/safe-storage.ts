/**
 * localStorage that can never crash a render.
 *
 * Browsers throw on storage access in several real situations — Safari/iOS
 * private mode, embedded webviews with storage disabled, full quota. These
 * providers wrap the whole app, so one unguarded `localStorage.getItem` in a
 * context initializer would take EVERY page down to the error boundary.
 */

export function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota / private mode — the app keeps working in-memory */
  }
}

export function storageRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Parse JSON from storage; null on missing, corrupt, or thrown access. */
export function storageGetJson<T>(key: string, validate?: (v: unknown) => v is T): T | null {
  const raw = storageGet(key);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return null;
    return parsed as T;
  } catch {
    return null;
  }
}

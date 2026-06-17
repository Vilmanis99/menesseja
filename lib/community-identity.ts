import { storageGet, storageSet } from "@/lib/safe-storage";

/**
 * Pseudonymous identity for the (auth-less) community: a stable per-device id
 * plus a chosen display name. Both live in localStorage; the id is sent with
 * every write so the server can attribute posts/likes and enforce rate limits.
 */

const ID_KEY = "meness-seja:community-id";
const NAME_KEY = "meness-seja:community-name";

export function getClientId(): string {
  let id = storageGet(ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `c-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
    storageSet(ID_KEY, id);
  }
  return id;
}

export function getStoredName(): string {
  return storageGet(NAME_KEY) ?? "";
}

export function storeName(name: string): void {
  storageSet(NAME_KEY, name.trim().slice(0, 40));
}

"use client";

import { useEffect } from "react";

/** Registers the service worker (production only) for offline + installability.
 *  Also checks for an updated worker on every load and, when a NEW worker takes
 *  control (an update, not the first install), reloads once so the user never
 *  gets stuck on a stale build. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // If a worker already controls this page, a later controllerchange means an
    // UPDATE took over → reload to show fresh content. On a first-ever visit
    // there's no controller yet, so the initial claim must NOT trigger a reload
    // (and the `reloaded` flag prevents any loop).
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded || !hadController) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => reg.update().catch(() => {})) // pull a newer sw.js if deployed
        .catch(() => {});
    };
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);
  return null;
}

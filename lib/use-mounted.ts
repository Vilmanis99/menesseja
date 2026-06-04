"use client";

import { useEffect, useState } from "react";

/**
 * False during SSR and the first client render, true after mount. Use to gate
 * `new Date()`-derived UI so the server and first client render match (avoids
 * hydration mismatches for time-dependent personalised views).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

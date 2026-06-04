"use client";

import { useCallback, useEffect, useState } from "react";
import type { Weather } from "@/lib/weather";

export type WeatherState =
  | { status: "loading"; data: null; error: null; retry: () => void }
  | { status: "ready"; data: Weather; error: null; retry: () => void }
  | { status: "error"; data: null; error: string; retry: () => void };

/**
 * Fetch + cache normalized weather for a coordinate (via our /api/weather proxy).
 * Pass the user's precise location when available, else the region's town.
 * Returns a `retry()` to re-fetch after an error.
 */
export function useWeather(coords: { lat: number; lon: number }): WeatherState {
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const [s, setS] = useState<Omit<WeatherState, "retry">>({ status: "loading", data: null, error: null });

  useEffect(() => {
    let alive = true;
    setS({ status: "loading", data: null, error: null });
    fetch(`/api/weather?lat=${coords.lat.toFixed(3)}&lon=${coords.lon.toFixed(3)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Laikapstākļu kļūda"))))
      .then((data: Weather) => alive && setS({ status: "ready", data, error: null }))
      .catch((e: Error) => alive && setS({ status: "error", data: null, error: e.message }));
    return () => {
      alive = false;
    };
  }, [coords.lat, coords.lon, attempt]);

  return { ...s, retry } as WeatherState;
}

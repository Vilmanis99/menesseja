"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { REGIONS, type RegionId, getRegion, nearestRegion } from "@/lib/regions";
import { storageGet, storageSet, storageGetJson } from "@/lib/safe-storage";

export type GeoStatus = "idle" | "locating" | "granted" | "denied";

interface RegionState {
  regionId: RegionId;
  setRegionId: (id: RegionId) => void;
  /** Precise user coordinates, if they shared their location */
  coords: { lat: number; lon: number } | null;
  geoStatus: GeoStatus;
  /** Ask the browser for the user's location (snaps region to nearest) */
  requestLocation: () => void;
}

const RegionCtx = createContext<RegionState | null>(null);
const REGION_KEY = "meness-seja:region";
const GEO_KEY = "meness-seja:coords";

const isRegionId = (v: string): v is RegionId => REGIONS.some((r) => r.id === v);
const isCoords = (v: unknown): v is { lat: number; lon: number } => {
  const c = v as { lat?: unknown; lon?: unknown } | null;
  return (
    !!c &&
    typeof c === "object" &&
    typeof c.lat === "number" && Number.isFinite(c.lat) && Math.abs(c.lat) <= 90 &&
    typeof c.lon === "number" && Number.isFinite(c.lon) && Math.abs(c.lon) <= 180
  );
};

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<RegionId>("vidzeme");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  // Restore region + any previously granted location across sessions.
  // Storage access and stored values are both untrusted: private-mode browsers
  // throw on access, and a corrupt value must not wedge the whole app.
  useEffect(() => {
    const savedRegion = storageGet(REGION_KEY);
    if (savedRegion && isRegionId(savedRegion)) setRegionId(savedRegion);
    const savedGeo = storageGetJson(GEO_KEY, isCoords);
    if (savedGeo) {
      setCoords(savedGeo);
      setGeoStatus("granted");
    }
  }, []);

  useEffect(() => {
    storageSet(REGION_KEY, regionId);
  }, [regionId]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(next);
        setGeoStatus("granted");
        storageSet(GEO_KEY, JSON.stringify(next));
        setRegionId(nearestRegion(next.lat, next.lon).id);
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    );
  };

  return (
    <RegionCtx.Provider
      value={{ regionId, setRegionId, coords, geoStatus, requestLocation }}
    >
      {children}
    </RegionCtx.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionCtx);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  const region = getRegion(ctx.regionId);
  // Weather follows precise coords when shared, else the region's town
  const weatherCoords = ctx.coords ?? { lat: region.lat, lon: region.lon };
  return { ...ctx, region, weatherCoords };
}

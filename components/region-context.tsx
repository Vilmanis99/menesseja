"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type RegionId, getRegion, nearestRegion } from "@/lib/regions";

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

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<RegionId>("vidzeme");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  // Restore region + any previously granted location across sessions
  useEffect(() => {
    const savedRegion = localStorage.getItem(REGION_KEY) as RegionId | null;
    if (savedRegion) setRegionId(savedRegion);
    const savedGeo = localStorage.getItem(GEO_KEY);
    if (savedGeo) {
      try {
        setCoords(JSON.parse(savedGeo));
        setGeoStatus("granted");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REGION_KEY, regionId);
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
        localStorage.setItem(GEO_KEY, JSON.stringify(next));
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

"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Plant, LogEntry } from "@/lib/garden";
import { useAuth } from "@/components/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import {
  fetchGarden,
  insertPlant,
  deletePlant,
  insertLog,
  deleteLog,
  importGuestPlants,
} from "@/lib/supabase/garden-sync";

interface GardenState {
  plants: Plant[];
  addPlant: (cropId: string, area: string) => void;
  removePlant: (id: string) => void;
  addLog: (plantId: string, entry: Omit<LogEntry, "id">) => void;
  removeLog: (plantId: string, entryId: string) => void;
  /** Drop the demo/example plants */
  clearExamples: () => void;
  /** Id of the most recently added plant (for highlight/scroll), or null */
  lastAddedId: string | null;
  hasExamples: boolean;
  hydrated: boolean;
  /** true while the logged-in garden is being pulled from / pushed to the cloud */
  syncing: boolean;
}

const GardenCtx = createContext<GardenState | null>(null);
const STORAGE_KEY = "meness-seja:garden";

/**
 * Demo plants shown until the gardener adds their own. Dates are RELATIVE to
 * today (computed client-side) so demos always look mid-season and never show a
 * horticulturally-impossible 100% "ready" on first open.
 */
function makeSeed(): Plant[] {
  const iso = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  };
  return [
    { id: "seed-1", cropId: "tomati", area: "Siltumnīca", sownAt: iso(35), seed: true },
    { id: "seed-2", cropId: "gurki", area: "Siltumnīca", sownAt: iso(25), seed: true },
    { id: "seed-3", cropId: "burkani", area: "Lielā dobe", sownAt: iso(40), seed: true },
    { id: "seed-4", cropId: "salati", area: "Lielā dobe", sownAt: iso(18), seed: true },
  ];
}

let counter = 0;
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `p-${Date.now().toString(36)}-${counter++}`;

export function GardenProvider({ children }: { children: React.ReactNode }) {
  const { enabled, loading: authLoading, user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  /** "local" = localStorage/guest, "db" = synced to the signed-in account */
  const modeRef = useRef<"local" | "db">("local");

  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const readLocal = (): Plant[] => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s) as Plant[];
    } catch {
      /* ignore */
    }
    return makeSeed();
  };

  // Choose the data source once auth has resolved.
  useEffect(() => {
    // Backend off → always local (unchanged guest behaviour).
    if (!enabled) {
      modeRef.current = "local";
      setPlants(readLocal());
      setHydrated(true);
      return;
    }
    // Configured but auth still resolving → wait, so logged-in users never see
    // the demo plants flash before their real garden loads.
    if (authLoading) return;

    // Logged out → local guest garden.
    if (!user) {
      modeRef.current = "local";
      setPlants(readLocal());
      setHydrated(true);
      return;
    }

    // Logged in → pull from the cloud (importing guest plants on first login).
    let active = true;
    (async () => {
      if (!supabase) return;
      setSyncing(true);
      try {
        let db = await fetchGarden(supabase, user.id);
        if (db.length === 0) {
          const localReal = readLocal().filter((p) => !p.seed);
          if (localReal.length > 0) {
            const toImport: Plant[] = localReal.map((p) => ({
              ...p,
              id: newId(),
              seed: false,
              log: (p.log ?? []).map((l) => ({ ...l, id: newId() })),
            }));
            await importGuestPlants(supabase, user.id, toImport);
            db = await fetchGarden(supabase, user.id);
          }
        }
        if (active) {
          modeRef.current = "db";
          setPlants(db);
          setHydrated(true);
        }
      } catch {
        // Sync failed → fall back to local so the garden still works offline.
        if (active) {
          modeRef.current = "local";
          setPlants(readLocal());
          setHydrated(true);
        }
      } finally {
        if (active) setSyncing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [enabled, authLoading, user, supabase]);

  // Persist to localStorage only in guest mode (the signed-in garden lives in the DB).
  useEffect(() => {
    if (hydrated && modeRef.current === "local") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
      } catch {
        /* ignore */
      }
    }
  }, [plants, hydrated]);

  const addPlant = (cropId: string, area: string) => {
    const id = newId();
    const plant: Plant = { id, cropId, area, sownAt: new Date().toISOString().slice(0, 10) };
    setPlants((p) => [...p, plant]);
    setLastAddedId(id);
    if (modeRef.current === "db" && supabase && user) {
      insertPlant(supabase, user.id, plant).catch(() => setPlants((p) => p.filter((x) => x.id !== id)));
    }
  };

  const removePlant = (id: string) => {
    setPlants((p) => p.filter((x) => x.id !== id));
    if (modeRef.current === "db" && supabase) deletePlant(supabase, id).catch(() => {});
  };

  const clearExamples = () => setPlants((p) => p.filter((x) => !x.seed));

  const addLog = (plantId: string, entry: Omit<LogEntry, "id">) => {
    const e: LogEntry = { ...entry, id: newId() };
    setPlants((p) => p.map((x) => (x.id === plantId ? { ...x, log: [e, ...(x.log ?? [])] } : x)));
    if (modeRef.current === "db" && supabase && user) insertLog(supabase, user.id, plantId, e).catch(() => {});
  };

  const removeLog = (plantId: string, entryId: string) => {
    setPlants((p) =>
      p.map((x) => (x.id === plantId ? { ...x, log: (x.log ?? []).filter((l) => l.id !== entryId) } : x)),
    );
    if (modeRef.current === "db" && supabase) deleteLog(supabase, entryId).catch(() => {});
  };

  const hasExamples = plants.some((x) => x.seed);

  return (
    <GardenCtx.Provider
      value={{ plants, addPlant, removePlant, addLog, removeLog, clearExamples, lastAddedId, hasExamples, hydrated, syncing }}
    >
      {children}
    </GardenCtx.Provider>
  );
}

export function useGarden() {
  const ctx = useContext(GardenCtx);
  if (!ctx) throw new Error("useGarden must be used within GardenProvider");
  return ctx;
}

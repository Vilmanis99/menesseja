"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Plant, LogEntry, LogType } from "@/lib/garden";
import { useAuth } from "@/components/auth-context";
import { storageGet, storageSet, storageRemove } from "@/lib/safe-storage";
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
  /** Last cloud-write failure, for the UI to surface (writes roll back). */
  syncError: string | null;
  clearSyncError: () => void;
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
  const userId = user?.id ?? null;
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  /** "local" = localStorage/guest, "db" = synced to the signed-in account */
  const modeRef = useRef<"local" | "db">("local");
  /** Guards the guest→DB import so concurrent effect runs can't import twice. */
  const importedRef = useRef(false);
  /** Plants added while the login sync was still in flight — must not be lost
   *  when the fetched DB garden replaces local state. */
  const syncingRef = useRef(false);
  const pendingAddsRef = useRef<Plant[]>([]);

  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const readLocal = (): Plant[] => {
    const raw = storageGet(STORAGE_KEY);
    if (raw) {
      try {
        const arr: unknown = JSON.parse(raw);
        if (Array.isArray(arr)) {
          // Stored data is untrusted: drop entries that would crash a render
          // (LOG_META lookup on an unknown log type, missing ids).
          const LOG_TYPES = new Set<LogType>(["laistits", "meslots", "kaite", "raza", "piezime"]);
          return arr
            .filter((p): p is Plant => !!p && typeof p.id === "string" && typeof p.cropId === "string")
            .map((p) =>
              p.log
                ? { ...p, log: p.log.filter((l) => !!l && typeof l.id === "string" && LOG_TYPES.has(l.type)) }
                : p,
            );
        }
      } catch {
        /* corrupt JSON → fresh start below */
      }
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
    if (!userId) {
      modeRef.current = "local";
      importedRef.current = false; // a future login may import again
      setPlants(readLocal());
      setHydrated(true);
      return;
    }

    // Logged in → pull from the cloud (importing guest plants on first login).
    let active = true;
    (async () => {
      if (!supabase) return;
      setSyncing(true);
      syncingRef.current = true;
      try {
        let db = await fetchGarden(supabase, userId);
        if (db.length === 0 && !importedRef.current) {
          importedRef.current = true; // before the await — blocks a concurrent double-import
          const localReal = readLocal().filter((p) => !p.seed);
          if (localReal.length > 0) {
            const toImport: Plant[] = localReal.map((p) => ({
              ...p,
              id: newId(),
              seed: false,
              log: (p.log ?? []).map((l) => ({ ...l, id: newId() })),
            }));
            await importGuestPlants(supabase, userId, toImport);
            db = await fetchGarden(supabase, userId);
            // The guest copy now lives in the account — drop it so deleting a
            // plant later can't resurrect it from localStorage.
            storageRemove(STORAGE_KEY);
          }
        }
        // Plants the user added while this sync was in flight: push them to the
        // DB and keep them visible instead of overwriting them with the fetch.
        const pending = pendingAddsRef.current.splice(0);
        for (const p of pending) {
          try {
            await insertPlant(supabase, userId, p);
            db = [...db, p];
          } catch {
            if (active) setSyncError("Daļu augu neizdevās saglabāt mākonī.");
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
        syncingRef.current = false;
        if (active) setSyncing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [enabled, authLoading, userId, supabase]);

  // Persist to localStorage only in guest mode (the signed-in garden lives in the DB).
  useEffect(() => {
    if (hydrated && modeRef.current === "local") {
      storageSet(STORAGE_KEY, JSON.stringify(plants));
    }
  }, [plants, hydrated]);

  const addPlant = (cropId: string, area: string) => {
    const id = newId();
    const plant: Plant = { id, cropId, area, sownAt: new Date().toISOString().slice(0, 10) };
    setPlants((p) => [...p, plant]);
    setLastAddedId(id);
    if (modeRef.current === "db" && supabase && userId) {
      insertPlant(supabase, userId, plant).catch(() => {
        setPlants((p) => p.filter((x) => x.id !== id));
        setSyncError("Neizdevās saglabāt augu mākonī. Pamēģini vēlreiz.");
      });
    } else if (syncingRef.current && userId) {
      // Login sync still in flight — queue so the DB fetch doesn't erase it.
      pendingAddsRef.current.push(plant);
    }
  };

  const removePlant = (id: string) => {
    const removed = plants.find((x) => x.id === id);
    setPlants((p) => p.filter((x) => x.id !== id));
    if (modeRef.current === "db" && supabase) {
      deletePlant(supabase, id).catch(() => {
        if (removed) setPlants((p) => [...p, removed]); // roll back, don't lie
        setSyncError("Neizdevās izdzēst augu. Pamēģini vēlreiz.");
      });
    }
  };

  const clearExamples = () => setPlants((p) => p.filter((x) => !x.seed));

  const addLog = (plantId: string, entry: Omit<LogEntry, "id">) => {
    const e: LogEntry = { ...entry, id: newId() };
    setPlants((p) => p.map((x) => (x.id === plantId ? { ...x, log: [e, ...(x.log ?? [])] } : x)));
    if (modeRef.current === "db" && supabase && userId) {
      insertLog(supabase, userId, plantId, e).catch(() => {
        setPlants((p) =>
          p.map((x) => (x.id === plantId ? { ...x, log: (x.log ?? []).filter((l) => l.id !== e.id) } : x)),
        );
        setSyncError("Neizdevās saglabāt ierakstu. Pamēģini vēlreiz.");
      });
    }
  };

  const removeLog = (plantId: string, entryId: string) => {
    const removed = plants.find((x) => x.id === plantId)?.log?.find((l) => l.id === entryId);
    setPlants((p) =>
      p.map((x) => (x.id === plantId ? { ...x, log: (x.log ?? []).filter((l) => l.id !== entryId) } : x)),
    );
    if (modeRef.current === "db" && supabase) {
      deleteLog(supabase, entryId).catch(() => {
        if (removed) {
          setPlants((p) => p.map((x) => (x.id === plantId ? { ...x, log: [removed, ...(x.log ?? [])] } : x)));
        }
        setSyncError("Neizdevās izdzēst ierakstu. Pamēģini vēlreiz.");
      });
    }
  };

  const hasExamples = plants.some((x) => x.seed);
  const clearSyncError = () => setSyncError(null);

  return (
    <GardenCtx.Provider
      value={{ plants, addPlant, removePlant, addLog, removeLog, clearExamples, lastAddedId, hasExamples, hydrated, syncing, syncError, clearSyncError }}
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

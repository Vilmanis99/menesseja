"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CULTIVAR_MAX_LENGTH, CultivarConflictError, LOG_META, datedLogError, harvestAmountError, isGardenDate, normalizeCultivar, plantDateError, type Plant, type LogEntry, type PlantStart } from "@/lib/garden";
import { useAuth } from "@/components/auth-context";
import { storageGet, storageSet, storageRemove } from "@/lib/safe-storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { track, analyticsAllowed, CONSENT_CHANGED_EVENT } from "@/lib/analytics";
import { latviaDateKey } from "@/lib/day-anchor";
import {
  fetchGarden,
  cultivarColumnMissing,
  guestPlantDetailsConflict,
  insertPlant,
  savePlantCultivar,
  savePlantDate,
  deletePlant,
  insertLog,
  deleteLog,
  importGuestPlants,
} from "@/lib/supabase/garden-sync";

interface GardenState {
  plants: Plant[];
  addPlant: (cropId: string, area: string, start: PlantStart, cultivar?: string) => Promise<boolean>;
  updateCultivar: (id: string, value: string, expectedCultivar: Plant["cultivar"]) => Promise<boolean>;
  recordPlantDate: (id: string, action: "sown" | "planted", date: string) => Promise<boolean>;
  removePlant: (id: string) => void;
  addLog: (plantId: string, entry: Omit<LogEntry, "id">) => Promise<boolean>;
  removeLog: (plantId: string, entryId: string) => void;
  /** Drop the demo/example plants */
  clearExamples: () => void;
  /** Id of the most recently added plant (for highlight/scroll), or null */
  lastAddedId: string | null;
  hasExamples: boolean;
  hydrated: boolean;
  /** true while the logged-in garden is being pulled from / pushed to the cloud */
  syncing: boolean;
  /** Most recent problem saving garden data, for the UI to surface. */
  syncError: string | null;
  clearSyncError: () => void;
}

const GardenCtx = createContext<GardenState | null>(null);
const STORAGE_KEY = "meness-seja:garden";
const unreadableGarden = "Saglabātos dārza datus nevar nolasīt. Iepriekšējā kopija paliek šajā pārlūkā.";

async function withGuestStorage<T>(action: () => T): Promise<T> {
  return navigator.locks ? await navigator.locks.request(STORAGE_KEY, action) : action();
}

/**
 * Demo plants shown until the gardener adds their own. Dates are RELATIVE to
 * today (computed client-side) so demos always look mid-season and never show a
 * horticulturally-impossible 100% "ready" on first open.
 */
function makeSeed(): Plant[] {
  const iso = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return latviaDateKey(d);
  };
  return [
    { id: "seed-1", cropId: "tomati", area: "Siltumnīca", plantedOn: iso(35), seed: true },
    { id: "seed-2", cropId: "gurki", area: "Siltumnīca", plantedOn: iso(25), seed: true },
    { id: "seed-3", cropId: "burkani", area: "Lielā dobe", sownOn: iso(40), seed: true },
    { id: "seed-4", cropId: "salati", area: "Lielā dobe", sownOn: iso(18), seed: true },
  ];
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = globalThis.crypto?.getRandomValues(new Uint8Array(16))
    ?? Uint8Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
}

export function GardenProvider({ children }: { children: React.ReactNode }) {
  const { enabled, loading: authLoading, user } = useAuth();
  const userId = user?.id ?? null;
  const activeUser = useRef(userId);
  useEffect(() => { activeUser.current = userId; }, [userId]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  /** "local" = localStorage/guest, "db" = synced to the signed-in account */
  const modeRef = useRef<"local" | "db">("local");
  const editingDatesRef = useRef(new Set<string>());
  const logWrites = useRef(new Map<string, { id: string; draft: string; saving: boolean }>());
  /** Plants added while the login sync was still in flight — must not be lost
   *  when the fetched DB garden replaces local state. */
  const syncingRef = useRef(false);
  const pendingAddsRef = useRef<{ plant: Plant; firstPlant: boolean; userId: string; resolve: (saved: boolean) => void }[]>([]);

  const recordSavedPlant = (plant: Plant, storage: "local" | "cloud", firstPlant: boolean) => {
    track("garden_add_completed", { crop_id: plant.cropId, storage });
    if (firstPlant) track("garden_activated", { crop_id: plant.cropId, storage });
  };

  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const readLocal = (raw = storageGet(STORAGE_KEY), strict = false): Plant[] => {
    if (raw !== null) {
      try {
        const arr: unknown = JSON.parse(raw);
        if (Array.isArray(arr)) {
          // Stored data is untrusted: drop entries that would crash a render
          // (LOG_META lookup on an unknown log type, missing ids).
          const valid = arr.filter((p): p is Plant => !!p && typeof p.id === "string" && typeof p.cropId === "string");
          if (strict && valid.length !== arr.length) throw new Error(unreadableGarden);
          return valid.map((p) => {
            const log = Array.isArray(p.log) ? p.log.filter((l) => !!l && typeof l.id === "string" && Object.hasOwn(LOG_META, l.type)) : [];
            if (strict && p.log != null && (!Array.isArray(p.log) || log.length !== p.log.length)) throw new Error(unreadableGarden);
            return { ...p, cultivar: p.cultivar === null ? null : normalizeCultivar(p.cultivar) ?? undefined, log };
          });
        }
        if (strict) throw new Error(unreadableGarden);
      } catch {
        if (strict) throw new Error(unreadableGarden);
      }
    }
    return makeSeed();
  };

  // Apply a guest edit to the stored garden. An old tab must not resave its
  // entire render snapshot after another tab has edited the same plant.
  const changeLocal = async (change: (current: Plant[]) => Plant[] | null, allowSessionOnly = false): Promise<boolean> => {
    const save = () => {
      if (activeUser.current !== userId || modeRef.current !== "local" || syncingRef.current) return false;
      const raw = storageGet(STORAGE_KEY);
      const updated = change(raw === null ? plants : readLocal(raw, true));
      if (!updated) return false;
      if (storageSet(STORAGE_KEY, JSON.stringify(updated))) {
        setPlants(updated);
        return true;
      }
      if (allowSessionOnly) setPlants((current) => change(current) ?? current);
      setSyncError(allowSessionOnly ? "Izmaiņas ir tikai šajā sesijā. Pārlūkā neizdevās tās saglabāt." : "Pārlūkā neizdevās saglabāt dārza izmaiņas.");
      return false;
    };
    try {
      return await withGuestStorage(save);
    } catch (error) {
      if (error instanceof CultivarConflictError) throw error;
      setSyncError(error instanceof Error && error.message === unreadableGarden ? unreadableGarden : "Pārlūkā neizdevās saglabāt dārza izmaiņas.");
      return false;
    }
  };

  const loadGuest = () => {
    const raw = storageGet(STORAGE_KEY);
    const initial = readLocal(raw);
    if (raw === null) storageSet(STORAGE_KEY, JSON.stringify(initial));
    setPlants(initial);
    setHydrated(true);
  };

  // Choose the data source once auth has resolved.
  useEffect(() => {
    // Backend off → always local (unchanged guest behaviour).
    if (!enabled) {
      modeRef.current = "local";
      loadGuest();
      return;
    }
    // Configured but auth still resolving → wait, so logged-in users never see
    // the demo plants flash before their real garden loads.
    if (authLoading) return;

    // Logged out → local guest garden.
    if (!userId) {
      modeRef.current = "local";
      syncingRef.current = false;
      setSyncing(false);
      loadGuest();
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
        if (!active) return;
        const guestSnapshot = storageGet(STORAGE_KEY);
        const localReal = readLocal(guestSnapshot, true).filter((p) => !p.seed);
        // Matching ids allow a partially completed first-login import to resume.
        if (localReal.length && (!db.length || localReal.some((p) => db.some((row) => row.id === p.id)))) {
          const toImport = localReal.map((p) => ({
            ...p,
            id: uuidPattern.test(p.id) ? p.id : newId(),
            log: (p.log ?? []).map((l) => uuidPattern.test(l.id) ? l : { ...l, id: newId() }),
          }));
          // Keep stable IDs before the first network write, including for legacy
          // guest entries with pre-UUID ids. A retry can then reuse every row.
          const snapshotToImport = JSON.stringify(toImport);
          await withGuestStorage(() => {
            if (storageGet(STORAGE_KEY) !== guestSnapshot) throw new Error("Viesu dārzs ir mainījies.");
            if (!storageSet(STORAGE_KEY, snapshotToImport)) throw new Error("Viesu dārzs nav saglabāts.");
          });
          if (!active) return;
          await importGuestPlants(supabase, userId, toImport, db);
          if (!active) return;
          db = await fetchGarden(supabase, userId);
          if (!active) return;
          let detailsConflict = false;
          for (const p of toImport) {
            const saved = db.find((row) => row.id === p.id);
            if (!saved || !p.log.every((l) => saved.log?.some((entry) => entry.id === l.id))) {
              throw new Error("Daļa viesu dārza vēl nav pārsūtīta.");
            }
            if (guestPlantDetailsConflict(p, saved)) detailsConflict = true;
          }
          if (detailsConflict) {
            setSyncError("Konta un viesu dārzā atšķiras stādījuma datums vai šķirne. Redzams konta dārzs. Viesu kopija saglabāta šajā pārlūkā.");
          } else {
            await withGuestStorage(() => {
              if (!active) return;
              if (storageGet(STORAGE_KEY) === snapshotToImport) storageRemove(STORAGE_KEY);
              else setSyncError("Pārsūtīšanas laikā viesu dārzs ir mainījies. Jaunākā viesu kopija paliek šajā pārlūkā.");
            });
          }
        }
        // New entries can arrive while an earlier pending insert is in flight.
        while (active) {
          const index = pendingAddsRef.current.findIndex((p) => p.userId === userId);
          if (index < 0) break;
          const [{ plant: p, firstPlant, resolve }] = pendingAddsRef.current.splice(index, 1);
          try {
            await insertPlant(supabase, userId, p);
            if (!active) { resolve(false); break; }
            db = [...db, p];
            recordSavedPlant(p, "cloud", firstPlant && db.filter((x) => !x.seed).length === 1);
            setLastAddedId(p.id);
            resolve(true);
          } catch (error) {
            track("garden_add_error", { crop_id: p.cropId, reason: "cloud" });
            if (active) setSyncError(cultivarColumnMissing(error) ? "Kontā pašlaik nevar saglabāt šķirnes nosaukumu." : "Augu neizdevās saglabāt kontā.");
            resolve(false);
          }
        }
        if (active) {
          modeRef.current = "db";
          setPlants(db);
          setHydrated(true);
        }
      } catch (error) {
        // Sync failed → fall back to local so the garden still works offline.
        if (active) {
          modeRef.current = "local";
          const pending = pendingAddsRef.current.filter((p) => p.userId === userId);
          pendingAddsRef.current = pendingAddsRef.current.filter((p) => p.userId !== userId);
          let local = readLocal();
          let corrupt = error instanceof Error && error.message === unreadableGarden;
          let persisted = false;
          if (!corrupt && pending.length) {
            try {
              await withGuestStorage(() => {
                if (!active) return;
                const current = readLocal(storageGet(STORAGE_KEY), true);
                const combined = [...current.filter((p) => !p.seed), ...pending.map((p) => p.plant)];
                persisted = storageSet(STORAGE_KEY, JSON.stringify(combined));
                local = persisted ? combined : current;
              });
            } catch (failure) { corrupt = failure instanceof Error && failure.message === unreadableGarden; }
          }
          pending.forEach((entry) => entry.resolve(active && persisted));
          if (!active) return;
          setPlants(local);
          if (persisted) setLastAddedId(pending[pending.length - 1].plant.id);
          setSyncError(corrupt ? unreadableGarden : cultivarColumnMissing(error)
            ? "Konta dārzā pašlaik nevar saglabāt šķirnes nosaukumu. Viesu dārzs saglabāts šajā pārlūkā."
            : "Neizdevās ielādēt dārzu no konta. Pieejami šajā pārlūkā saglabātie augi.");
          setHydrated(true);
        }
      } finally {
        if (active) {
          syncingRef.current = false;
          setSyncing(false);
        }
      }
    })();
    return () => {
      active = false;
      pendingAddsRef.current.filter((p) => p.userId === userId).forEach((p) => p.resolve(false));
      pendingAddsRef.current = pendingAddsRef.current.filter((p) => p.userId !== userId);
    };
  }, [enabled, authLoading, userId, supabase]);

  // Keep the open guest garden in sync without writing an incoming snapshot back.
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if ((event.key === STORAGE_KEY || event.key === null) && !syncingRef.current && modeRef.current === "local") setPlants(readLocal());
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);

  // One return event per Riga day for a garden containing real plants. Listen
  // for consent granted after hydration; never measure visits to demo gardens.
  const realGarden = hydrated && plants.some((p) => !p.seed);
  useEffect(() => {
    if (!realGarden) return;
    const recordVisit = () => {
      if (!analyticsAllowed()) return;
      const key = "meness-seja:analytics-garden-last-visit";
      const today = latviaDateKey();
      const previous = storageGet(key);
      if (previous === today) return;
      if (previous && /^\d{4}-\d{2}-\d{2}$/.test(previous) && previous < today) {
        track("garden_return", { days_since_visit: Math.round((Date.parse(today) - Date.parse(previous)) / 86400000) });
      }
      storageSet(key, today);
    };
    recordVisit();
    window.addEventListener(CONSENT_CHANGED_EVENT, recordVisit);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, recordVisit);
  }, [realGarden]);

  const addPlant = async (cropId: string, area: string, start: PlantStart, cultivar = ""): Promise<boolean> => {
    const id = newId();
    const name = normalizeCultivar(cultivar);
    if (cultivar.trim() && !name) { setSyncError(`Šķirnes nosaukumā drīkst būt līdz ${CULTIVAR_MAX_LENGTH} rakstzīmēm.`); return false; }
    const plant: Plant = { id, cropId, area, ...(name ? { cultivar: name } : {}) };
    if (start.action !== "unknown") {
      const error = plantDateError(plant, start.action, start.date);
      if (error) { setSyncError(error); return false; }
      if (start.action === "sown") plant.sownOn = start.date;
      else plant.plantedOn = start.date;
    }
    const firstPlant = !plants.some((p) => !p.seed);
    if (syncingRef.current && userId) {
      return new Promise((resolve) => pendingAddsRef.current.push({ plant, firstPlant, userId, resolve }));
    } else if (modeRef.current === "db" && supabase && userId) {
      try {
        await insertPlant(supabase, userId, plant);
        if (activeUser.current !== userId) return false;
        setPlants((p) => [...p.filter((x) => !x.seed), plant]);
        recordSavedPlant(plant, "cloud", firstPlant);
      } catch (error) {
        if (activeUser.current !== userId) return false;
        setSyncError(cultivarColumnMissing(error) ? "Kontā pašlaik nevar saglabāt šķirnes nosaukumu." : "Neizdevās saglabāt augu mākonī. Pamēģini vēlreiz.");
        track("garden_add_error", { crop_id: cropId, reason: "cloud" });
        return false;
      }
    } else {
      if (!await changeLocal((p) => [...p.filter((x) => !x.seed), plant])) {
        track("garden_add_error", { crop_id: cropId, reason: "local_storage" });
        return false;
      }
      recordSavedPlant(plant, "local", firstPlant);
    }
    setLastAddedId(id);
    return true;
  };

  const updateCultivar = async (id: string, value: string, expectedCultivar: Plant["cultivar"]): Promise<boolean> => {
    if (syncingRef.current) { setSyncError("Sagaidi, kamēr tiek pabeigta dārza saglabāšana."); return false; }
    const name = normalizeCultivar(value);
    if (value.trim() && !name) { setSyncError(`Šķirnes nosaukumā drīkst būt līdz ${CULTIVAR_MAX_LENGTH} rakstzīmēm.`); return false; }
    const expected = normalizeCultivar(expectedCultivar);
    try {
      if (modeRef.current === "db" && supabase && userId) {
        await savePlantCultivar(supabase, userId, id, name, expected);
        if (activeUser.current !== userId) return false;
        setPlants((current) => current.map((p) => p.id === id ? { ...p, cultivar: name } : p));
        return true;
      }
      return await changeLocal((current) => {
        const plant = current.find((p) => p.id === id);
        if (!plant || normalizeCultivar(plant.cultivar) !== expected) throw new CultivarConflictError();
        return current.map((p) => p.id === id ? { ...p, cultivar: name } : p);
      });
    } catch (e) {
      if (activeUser.current !== userId) return false;
      setSyncError(e instanceof CultivarConflictError ? e.message : cultivarColumnMissing(e)
        ? "Kontā pašlaik nevar saglabāt šķirnes nosaukumu." : "Šķirni neizdevās saglabāt. Pārlādē dārzu un mēģini vēlreiz.");
      return false;
    }
  };

  const recordPlantDate = async (id: string, action: "sown" | "planted", date: string): Promise<boolean> => {
    const plant = plants.find((p) => p.id === id);
    if (syncingRef.current || editingDatesRef.current.has(id)) {
      setSyncError("Sagaidi, kamēr tiek pabeigta dārza saglabāšana.");
      return false;
    }
    if (!plant) return false;
    const error = plantDateError(plant, action, date);
    if (error) { setSyncError(error); return false; }
    editingDatesRef.current.add(id);
    try {
      let dates: Pick<Plant, "sownOn" | "plantedOn"> = action === "sown" ? { sownOn: date } : { plantedOn: date };
      if (modeRef.current === "db" && supabase && userId) {
        dates = await savePlantDate(supabase, userId, id, action, date);
      } else {
        return await changeLocal((current) => {
          const saved = current.find((p) => p.id === id);
          const issue = saved ? plantDateError(saved, action, date) : "Stādījums vairs nav pieejams.";
          if (issue) { setSyncError(issue); return null; }
          return current.map((p) => p.id === id ? { ...p, ...dates } : p);
        });
      }
      setPlants((current) => current.map((p) => p.id === id ? { ...p, ...dates } : p));
      return true;
    } catch {
      setSyncError("Datumu neizdevās saglabāt. Pārlādē dārzu un mēģini vēlreiz.");
      return false;
    } finally {
      editingDatesRef.current.delete(id);
    }
  };

  const removePlant = (id: string) => {
    if (modeRef.current === "local" && !syncingRef.current) {
      changeLocal((current) => current.filter((p) => p.id !== id), true);
      return;
    }
    const removed = plants.find((x) => x.id === id);
    setPlants((p) => p.filter((x) => x.id !== id));
    if (modeRef.current === "db" && supabase) {
      deletePlant(supabase, id).catch(() => {
        if (removed) setPlants((p) => [...p, removed]); // roll back, don't lie
        setSyncError("Neizdevās izdzēst augu. Pamēģini vēlreiz.");
      });
    }
  };

  const clearExamples = () => {
    if (modeRef.current === "local" && !syncingRef.current) changeLocal((current) => current.filter((p) => !p.seed), true);
    else setPlants((current) => current.filter((p) => !p.seed));
  };

  const addLog = async (plantId: string, entry: Omit<LogEntry, "id">): Promise<boolean> => {
    const key = `${userId ?? "guest"}/${plantId}`;
    const previous = logWrites.current.get(key);
    if (!hydrated || syncingRef.current || previous?.saving) {
      setSyncError("Sagaidi, kamēr tiek pabeigta dārza saglabāšana.");
      return false;
    }
    function validate(plant?: Plant) {
      if (!plant) return "Stādījums vairs nav pieejams.";
      if (!isGardenDate(entry.date)) return "Norādi īstu datumu līdz šodienai.";
      if (entry.type === "raza" || entry.type === "ziedesana") {
        const dateIssue = datedLogError(plant, entry.type, entry.date);
        if (dateIssue) return dateIssue;
      }
      if (entry.type === "raza") return harvestAmountError(String(entry.amount ?? ""), entry.unit ?? "kg");
      return null;
    }
    const issue = validate(plants.find((p) => p.id === plantId));
    if (issue) { setSyncError(issue); return false; }
    const draft = JSON.stringify([entry.type, entry.date, entry.note, entry.amount, entry.unit]);
    const retry = previous?.draft === draft;
    const write = { id: retry ? previous.id : newId(), draft, saving: true };
    logWrites.current.set(key, write);
    const log = { ...entry, id: write.id };
    const append = (current: Plant[]) => current.map((p) => p.id === plantId && !p.log?.some((l) => l.id === log.id)
      ? { ...p, log: [log, ...(p.log ?? [])] } : p);
    try {
      if (modeRef.current === "local") {
        if (!await changeLocal((current) => {
          const issue = validate(current.find((p) => p.id === plantId));
          if (issue) { setSyncError(issue); return null; }
          return append(current);
        })) return false;
      } else {
        if (!supabase || !userId) return false;
        await insertLog(supabase, userId, plantId, log, retry);
        if (activeUser.current !== userId) return false;
        setPlants(append);
      }
      logWrites.current.delete(key);
      return true;
    } catch {
      if (activeUser.current === userId) setSyncError("Neizdevās saglabāt ierakstu. Mēģini vēlreiz.");
      return false;
    } finally { write.saving = false; }
  };

  const removeLog = (plantId: string, entryId: string) => {
    if (modeRef.current === "local" && !syncingRef.current) {
      changeLocal((current) => current.map((p) => p.id === plantId ? { ...p, log: (p.log ?? []).filter((l) => l.id !== entryId) } : p), true);
      return;
    }
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
      value={{ plants, addPlant, updateCultivar, recordPlantDate, removePlant, addLog, removeLog, clearExamples, lastAddedId, hasExamples, hydrated, syncing, syncError, clearSyncError }}
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

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Plant, LogEntry, LogType } from "@/lib/garden";
import { CultivarConflictError, normalizeCultivar } from "../garden";

/** Maps DB rows ↔ the client-side Plant model and reads/writes the garden. */

export function cultivarColumnMissing(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error) || !("message" in error)) return false;
  return (error.code === "PGRST204" || error.code === "42703") && typeof error.message === "string" && error.message.includes("cultivar");
}

export function guestPlantDetailsConflict(guest: Plant, saved: Plant): boolean {
  return Boolean((guest.sownOn && guest.sownOn !== saved.sownOn) || (guest.plantedOn && guest.plantedOn !== saved.plantedOn)
    || (guest.cultivar !== undefined && guest.cultivar !== (saved.cultivar ?? null)));
}

export async function fetchGarden(supabase: SupabaseClient, userId: string): Promise<Plant[]> {
  const [plants, logs] = await Promise.all([
    supabase.from("plants").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("plant_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  if (plants.error) throw plants.error;
  if (logs.error) throw logs.error;
  if (!plants.data || !logs.data) throw new Error("Dārza dati nav pieejami.");

  const logsByPlant = new Map<string, LogEntry[]>();
  for (const r of logs.data) {
    const entry: LogEntry = {
      id: r.id,
      date: r.date,
      type: r.type as LogType,
      note: r.note ?? undefined,
      amount: r.amount ?? undefined,
      unit: (r.unit as "kg" | "gab") ?? undefined,
    };
    const list = logsByPlant.get(r.plant_id) ?? [];
    list.push(entry);
    logsByPlant.set(r.plant_id, list);
  }

  return plants.data.map((r) => ({
    id: r.id,
    cropId: r.crop_id,
    area: r.area,
    cultivar: normalizeCultivar(r.cultivar),
    sownAt: r.sown_date,
    sownOn: r.sown_on ?? null,
    plantedOn: r.planted_on ?? null,
    seed: false,
    log: logsByPlant.get(r.id) ?? [],
  }));
}

export async function insertPlant(supabase: SupabaseClient, userId: string, plant: Plant, importing = false) {
  const row = {
    id: plant.id,
    user_id: userId,
    crop_id: plant.cropId,
    area: plant.area,
    // Omitting an unknown variety also keeps older database schemas usable.
    ...(plant.cultivar ? { cultivar: plant.cultivar } : {}),
    sown_date: plant.sownOn ?? plant.sownAt ?? null,
    sown_on: plant.sownOn ?? null,
    planted_on: plant.plantedOn ?? null,
    seed: false,
  };
  const table = supabase.from("plants");
  const { error } = importing ? await table.upsert(row, { onConflict: "id", ignoreDuplicates: true }) : await table.insert(row);
  if (error) throw error;
}

/** Compare the value shown in the editor so another device's edit survives. */
export async function savePlantCultivar(supabase: SupabaseClient, userId: string, id: string, cultivar: string | null, expected: string | null) {
  const change = supabase.from("plants").update({ cultivar }).eq("user_id", userId).eq("id", id);
  const match = expected === null ? change.is("cultivar", null) : change.eq("cultivar", expected);
  const { data, error } = await match.select("cultivar").single();
  if (error?.code === "PGRST116" || (!error && !data)) {
    throw new CultivarConflictError();
  }
  if (error) throw error;
  if ((data.cultivar ?? null) !== cultivar) throw new Error("Konta dārzs neapstiprināja šķirnes saglabāšanu.");
}

/** Write one event only so an update on another device can preserve the other date. */
export async function savePlantDate(supabase: SupabaseClient, userId: string, id: string, action: "sown" | "planted", date: string) {
  const change = action === "sown" ? { sown_on: date } : { planted_on: date };
  const { data, error } = await supabase.from("plants").update(change)
    .eq("user_id", userId).eq("id", id).select("sown_on,planted_on").single();
  if (error) throw error;
  if (!data) throw new Error("Stādījums nav pieejams.");
  return { sownOn: data.sown_on as string | null, plantedOn: data.planted_on as string | null };
}

export async function deletePlant(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("plants").delete().eq("id", id);
  if (error) throw error;
}

export async function insertLog(supabase: SupabaseClient, userId: string, plantId: string, entry: LogEntry, ignoreDuplicates = false) {
  const row = {
    id: entry.id,
    plant_id: plantId,
    user_id: userId,
    date: entry.date,
    type: entry.type,
    note: entry.note ?? null,
    amount: entry.amount ?? null,
    unit: entry.unit ?? null,
  };
  const table = supabase.from("plant_logs");
  const { error } = ignoreDuplicates ? await table.upsert(row, { onConflict: "id", ignoreDuplicates: true }) : await table.insert(row);
  if (error) throw error;
}

export async function deleteLog(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("plant_logs").delete().eq("id", id);
  if (error) throw error;
}

/** First-login import: push the guest's local plants (and their logs) to the DB. */
export async function importGuestPlants(supabase: SupabaseClient, userId: string, plants: Plant[], existing: Plant[] = []) {
  for (const p of plants) {
    await insertPlant(supabase, userId, p, true);
    // An incomplete import may have inserted the plant before the gardener
    // added a confirmed date offline. Fill missing events without overwriting
    // a correction from another device.
    const saved = existing.find((plant) => plant.id === p.id);
    if (saved) {
      for (const [field, column] of [["sownOn", "sown_on"], ["plantedOn", "planted_on"], ["cultivar", "cultivar"]] as const) {
        if (!p[field] || saved[field]) continue;
        const { error } = await supabase.from("plants").update({ [column]: p[field] })
          .eq("user_id", userId).eq("id", p.id).is(column, null);
        if (error) throw error;
      }
    }
    for (const entry of p.log ?? []) await insertLog(supabase, userId, p.id, entry, true);
  }
}

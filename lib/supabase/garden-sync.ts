import type { SupabaseClient } from "@supabase/supabase-js";
import type { Plant, LogEntry, LogType } from "@/lib/garden";

/** Maps DB rows ↔ the client-side Plant model and reads/writes the garden. */

export async function fetchGarden(supabase: SupabaseClient, userId: string): Promise<Plant[]> {
  const [{ data: plantRows }, { data: logRows }] = await Promise.all([
    supabase.from("plants").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("plant_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  const logsByPlant = new Map<string, LogEntry[]>();
  for (const r of logRows ?? []) {
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

  return (plantRows ?? []).map((r) => ({
    id: r.id,
    cropId: r.crop_id,
    area: r.area,
    sownAt: r.sown_date,
    seed: false,
    log: logsByPlant.get(r.id) ?? [],
  }));
}

export async function insertPlant(supabase: SupabaseClient, userId: string, plant: Plant) {
  const { error } = await supabase.from("plants").insert({
    id: plant.id,
    user_id: userId,
    crop_id: plant.cropId,
    area: plant.area,
    sown_date: plant.sownAt,
    seed: false,
  });
  if (error) throw error;
}

export async function deletePlant(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("plants").delete().eq("id", id);
  if (error) throw error;
}

export async function insertLog(supabase: SupabaseClient, userId: string, plantId: string, entry: LogEntry) {
  const { error } = await supabase.from("plant_logs").insert({
    id: entry.id,
    plant_id: plantId,
    user_id: userId,
    date: entry.date,
    type: entry.type,
    note: entry.note ?? null,
    amount: entry.amount ?? null,
    unit: entry.unit ?? null,
  });
  if (error) throw error;
}

export async function deleteLog(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("plant_logs").delete().eq("id", id);
  if (error) throw error;
}

/** First-login import: push the guest's local plants (and their logs) to the DB. */
export async function importGuestPlants(supabase: SupabaseClient, userId: string, plants: Plant[]) {
  for (const p of plants) {
    await insertPlant(supabase, userId, p);
    for (const entry of p.log ?? []) await insertLog(supabase, userId, p.id, entry);
  }
}

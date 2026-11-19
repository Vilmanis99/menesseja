import { cropById, type Plant } from "./garden";

export function plantDisplayName(plant: Pick<Plant, "cropId" | "cultivar">): string {
  const crop = cropById(plant.cropId)?.name ?? plant.cropId;
  return plant.cultivar ? `${crop} · ${plant.cultivar}` : crop;
}

import type { PlantPart, Element } from "@/lib/biodynamic";

/**
 * Which plant part each crop is grown for → drives its best biodynamic
 * element-day (root=earth, leaf=water, flower=air, fruit=earth... see element map).
 */
export const CROP_PART: Record<string, PlantPart> = {
  // Roots → Saknes (earth days)
  rediisi: "saknes",
  burkani: "saknes",
  bietes: "saknes",
  sipoli: "saknes",
  kiploki: "saknes",
  kartupeli: "saknes",
  // Leaves → Lapas (water days)
  salati: "lapas",
  spinati: "lapas",
  kaposti: "lapas",
  dilles: "lapas",
  petersili: "lapas",
  baziliks: "lapas",
  metra: "lapas",
  timians: "lapas",
  // Flowers → Ziedi (air days)
  brokoli: "ziedi",
  // Fruit & seed → Augļi (fire days)
  zirni: "augli",
  pupas: "augli",
  tomati: "augli",
  gurki: "augli",
  kabaci: "augli",
  kirbji: "augli",
  paprika: "augli",
  zemenes: "augli",
  avenes: "augli",
  upenes: "augli",
  janogas: "augli",
  erkskogas: "augli",
  laukapupas: "augli",
  // Roots
  pastinaks: "saknes",
  kalji: "saknes",
  raceni: "saknes",
  selerijas: "saknes",
  marrutki: "saknes",
  topinamburs: "saknes",
  // Leaves
  rabarberi: "lapas",
  puravi: "lapas",
  koriandrs: "lapas",
  salvija: "lapas",
  melisa: "lapas",
  oregano: "lapas",
  // Flowers
  kalendula: "ziedi",
  samtenes: "ziedi",
  saulespukes: "ziedi",
  nelkes: "ziedi",
  peonijas: "ziedi",
  tulpes: "ziedi",
  narcises: "ziedi",
  begonijas: "ziedi",
  pelargonijas: "ziedi",
  petunijas: "ziedi",
  ehinacija: "ziedi",
  budlejas: "ziedi",
  ranunkuli: "ziedi",
  verbena: "ziedi",
};

/** Element whose days favour a given plant part (inverse of ELEMENT_META). */
export const PART_ELEMENT: Record<PlantPart, Element> = {
  saknes: "zeme",
  lapas: "udens",
  ziedi: "gaiss",
  augli: "uguns",
};

export function cropPart(cropId: string): PlantPart {
  return CROP_PART[cropId] ?? "lapas";
}

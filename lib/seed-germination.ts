import { storageSet } from "./safe-storage";

export const GERMINATION_ANCHOR = "mana-seklu-digtspejas-parbaude";
const keyPrefix = "meness-seja:seed-test:";
const idPattern = /^[a-f0-9]{32}$/;

export interface SeedTestInput {
  name: string;
  tested: string;
  sprouted: string;
}

interface Sample { name: string; tested: number; sprouted: number | null }
export interface SavedSeedTest extends Sample { id: string; startedAt: string }
export interface SeedTestEntry { batch: SavedSeedTest; raw: string }

export function parseSampleCounts(input: Pick<SeedTestInput, "tested" | "sprouted">): Omit<Sample, "name"> | { error: string } {
  const tested = Number(input.tested);
  if (!/^\d+$/.test(input.tested) || !Number.isSafeInteger(tested) || tested < 1) {
    return { error: "Pārbaudīto sēklu skaitam jābūt veselam skaitlim, vismaz 1." };
  }
  if (input.sprouted === "") return { tested, sprouted: null };
  const sprouted = Number(input.sprouted);
  if (!/^\d+$/.test(input.sprouted) || !Number.isSafeInteger(sprouted) || sprouted > tested) {
    return { error: "Ieraksti veselu sadīgušo sēklu skaitu no 0 līdz pārbaudīto sēklu skaitam." };
  }
  return { tested, sprouted };
}

export function parseSample(input: SeedTestInput): Sample | { error: string } {
  const name = input.name.trim();
  if (!name || name.length > 120) return { error: "Ieraksti partijas vai šķirnes nosaukumu (līdz 120 rakstzīmēm)." };
  const counts = parseSampleCounts(input);
  if ("error" in counts) return counts;
  return { name, ...counts };
}

const decimal = new Intl.NumberFormat("lv-LV", { maximumFractionDigits: 2 });
export function samplePercentage(tested: number, sprouted: number) {
  // Keep the exact counts visible and mark percentages rounded to two decimals.
  const rounded = (BigInt(sprouted) * 10000n) % BigInt(tested) !== 0n;
  return (rounded ? "≈ " : "") + decimal.format(sprouted / tested * 100) + " %";
}

export function batchHash(id: string) {
  return "#" + GERMINATION_ANCHOR + "?partija=" + id;
}

export function batchIdFromHash(hash: string) {
  const prefix = "#" + GERMINATION_ANCHOR + "?partija=";
  const id = hash.startsWith(prefix) ? hash.slice(prefix.length) : "";
  return idPattern.test(id) ? id : null;
}

function decodeBatch(id: string, raw: string): SeedTestEntry | null {
  try {
    const value = JSON.parse(raw);
    if (!value || value.id !== id || !idPattern.test(id) || typeof value.name !== "string" ||
        !Number.isSafeInteger(value.tested) || (value.sprouted !== null && !Number.isSafeInteger(value.sprouted)) ||
        typeof value.startedAt !== "string" || !Number.isFinite(Date.parse(value.startedAt))) return null;
    const sample = parseSample({ name: value.name, tested: String(value.tested), sprouted: value.sprouted === null ? "" : String(value.sprouted) });
    if ("error" in sample) return null;
    return { batch: { ...sample, id, startedAt: value.startedAt }, raw };
  } catch {
    return null;
  }
}

export function readSeedTests(): { entries: SeedTestEntry[]; warning: string } {
  const entries: SeedTestEntry[] = [];
  let warning = "";
  try {
    const store = window.localStorage;
    for (let index = 0; index < store.length; index++) {
      const key = store.key(index);
      if (!key?.startsWith(keyPrefix)) continue;
      const raw = store.getItem(key);
      const entry = raw === null ? null : decodeBatch(key.slice(keyPrefix.length), raw);
      if (entry) entries.push(entry);
      else warning = "Vienu vai vairākus agrākos pierakstus neizdevās nolasīt.";
    }
    entries.sort((a, b) => b.batch.startedAt.localeCompare(a.batch.startedAt));
  } catch {
    warning = "Pārlūka krātuve nav pieejama. Procentus vari aprēķināt arī šeit uz vietas.";
  }
  return { entries, warning };
}

export function saveSeedTest(input: SeedTestInput, previous: SeedTestEntry | null): SeedTestEntry | { error: string } {
  const sample = parseSample(input);
  if ("error" in sample) return sample;
  try {
    // Each new sample has its own key, even when two packets carry the same name.
    const id = previous?.batch.id ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const key = keyPrefix + id;
    if (window.localStorage.getItem(key) !== (previous?.raw ?? null)) {
      return { error: "Saglabātais pieraksts ir mainījies. Atver partiju no saraksta vēlreiz, lai redzētu jaunākos datus." };
    }
    const batch = { ...sample, id, startedAt: previous?.batch.startedAt ?? new Date().toISOString() };
    const raw = JSON.stringify(batch);
    if (storageSet(key, raw)) return { batch, raw };
  } catch {
    // Reading or writing can be blocked by the browser.
  }
  return { error: "Partiju neizdevās saglabāt šajā pārlūkā. Ievadītie skaitļi joprojām ir redzami." };
}

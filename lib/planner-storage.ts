import { storageSet } from "./safe-storage";

const PLANS_KEY = "meness-seja:planner-plans";
const LEGACY_KEY = "meness-seja:planner";
export const PLANNER_COLS = 12;
export const PLANNER_ROWS = 8;

export interface Plan {
  id: string;
  name: string;
  placements: Record<number, string>;
}

export interface PlannerState {
  plans: Plan[];
  activeId: string;
}

interface Snapshot {
  key: string;
  raw: string | null;
}

export type PlannerBaseline = Snapshot | null;
export type PlannerIssue = "unavailable" | "invalid" | "conflict" | "write";

export function emptyPlanner(placements: Plan["placements"] = {}): PlannerState {
  return { plans: [{ id: "p1", name: "Mans plāns", placements }], activeId: "p1" };
}

/** A placement fills an empty cell. Only the eraser removes an existing plant. */
export function editPlannerCell(placements: Plan["placements"], cell: number, selected: string | null, erasing: boolean): Plan["placements"] {
  if (erasing && placements[cell]) {
    const next = { ...placements };
    delete next[cell];
    return next;
  }
  if (!erasing && selected && !placements[cell]) return { ...placements, [cell]: selected };
  return placements;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isLayout(value: unknown): value is Plan["placements"] {
  return isRecord(value) && Object.entries(value).every(([cell, crop]) =>
    /^(0|[1-9]\d*)$/.test(cell) && Number(cell) < PLANNER_ROWS * PLANNER_COLS && isText(crop),
  );
}

function isPlan(value: unknown): value is Plan {
  return isRecord(value) && isText(value.id) && isText(value.name) && isLayout(value.placements);
}

function decode(snapshot: Snapshot): PlannerState | null {
  if (snapshot.raw === null) return emptyPlanner();
  try {
    const value: unknown = JSON.parse(snapshot.raw);
    if (snapshot.key === LEGACY_KEY) return isLayout(value) ? emptyPlanner(value) : null;
    if (!isRecord(value) || !Array.isArray(value.plans)) return null;
    const plans = value.plans;
    if (!plans.length || !plans.every(isPlan)) return null;
    const ids = new Set(plans.map((plan) => plan.id));
    if (ids.size !== plans.length) return null;
    const activeId = typeof value.activeId === "string" && ids.has(value.activeId) ? value.activeId : plans[0].id;
    return { plans, activeId };
  } catch {
    return null;
  }
}

export function loadPlanner(): { state: PlannerState; baseline: PlannerBaseline; issue: PlannerIssue | null } {
  let snapshot: Snapshot;
  try {
    const storage = window.localStorage;
    const raw = storage.getItem(PLANS_KEY);
    snapshot = raw === null ? { key: LEGACY_KEY, raw: storage.getItem(LEGACY_KEY) } : { key: PLANS_KEY, raw };
  } catch {
    return { state: emptyPlanner(), baseline: null, issue: "unavailable" };
  }
  const state = decode(snapshot);
  if (!state) return { state: emptyPlanner(), baseline: null, issue: "invalid" };
  return { state, baseline: snapshot, issue: null };
}

type SaveResult = { ok: true; baseline: Snapshot } | { ok: false; issue: PlannerIssue };

export function savePlanner(baseline: PlannerBaseline, state: PlannerState): SaveResult {
  const current = loadPlanner();
  if (!current.baseline) return { ok: false, issue: current.issue ?? "unavailable" };
  const { key, raw } = current.baseline;
  const next = JSON.stringify(state);
  if (key === PLANS_KEY && raw === next) return { ok: true, baseline: current.baseline };

  // A recovered storage area may contain a plan we never loaded. Another tab
  // may also have edited the plan since our last successful read or write.
  const changed = baseline ? key !== baseline.key || raw !== baseline.raw : raw !== null;
  if (changed) return { ok: false, issue: "conflict" };
  if (!storageSet(PLANS_KEY, next)) return { ok: false, issue: "write" };
  return { ok: true, baseline: { key: PLANS_KEY, raw: next } };
}

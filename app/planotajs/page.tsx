"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { CROPS, CATEGORIES, type Category } from "@/lib/planting-crops";
import { cropById } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { companionStatus, companionReason, goodCompanions, badCompanions } from "@/lib/companions";
import {
  editPlannerCell, loadPlanner, savePlanner, PLANNER_COLS as COLS, PLANNER_ROWS as ROWS,
  type PlannerIssue, type PlannerState,
} from "@/lib/planner-storage";
import { moonForDate } from "@/lib/moon";
import { sowingDay, ELEMENT_META, PART_GENITIVE } from "@/lib/biodynamic";
import { track } from "@/lib/analytics";

const STORAGE_MESSAGES: Record<PlannerIssue, string> = {
  unavailable: "Pārlūks liedz piekļuvi saglabātajiem plāniem. Vari turpināt plānot šajā cilnē un lejupielādēt savu izkārtojumu.",
  invalid: "Iepriekšējo plānu neizdevās atvērt. Tā dati paliek pārlūkā. Šajā cilnē veidoto izkārtojumu vari lejupielādēt.",
  conflict: "Pārlūkā ir cita plānu versija. Vispirms lejupielādē šīs cilnes izkārtojumu. Pārlādējot lapu, atvērsies pārlūkā saglabātā versija.",
  write: "Izmaiņas pašlaik ir tikai šajā cilnē. Mēģini saglabāt vēlreiz vai lejupielādē savu izkārtojumu.",
};

let planSeq = 0;
const newPlanId = () => `pl-${Date.now().toString(36)}-${planSeq++}`;

const CAT_CELL: Record<Category, string> = {
  darzeni: "bg-primary-container text-on-primary-container",
  garsaugi: "bg-tertiary-container text-on-tertiary-container",
  ogas: "bg-secondary-container text-on-secondary-container",
  pukes: "bg-pink-400/30 text-pink-100",
};

type PlannerSession = ReturnType<typeof loadPlanner>;

export default function PlanotajsPage() {
  const [initial, setInitial] = useState<PlannerSession | null>(null);

  useEffect(() => {
    setInitial(loadPlanner());
    track("planner_started", { source: "planner_page" });
  }, []);

  return (
    <>
      <PageHeader
        title="Dārza plānotājs"
        display
        subtitle="Atzīmē, kur dobē vēlies audzēt puķes, dārzeņus un garšaugus. Plānu vari sākt jau pirms sējas."
      />
      <noscript>Lai izveidotu un saglabātu dobju plānu, pārlūkā ieslēdz JavaScript.</noscript>
      {initial && <Suspense fallback={null}><PlannerEditor initial={initial} /></Suspense>}
    </>
  );
}

function cellLabel(index: number) {
  return `Rinda ${Math.floor(index / COLS) + 1}, kolonna ${index % COLS + 1}`;
}

function PlannerEditor({ initial }: { initial: PlannerSession }) {
  const [session, setSession] = useState(initial);
  const requestedId = useSearchParams().get("augs");
  const requestedCrop = cropById(requestedId ?? "")?.id ?? null;
  const [choice, setChoice] = useState({ fromLink: requestedCrop, selected: requestedCrop, erasing: false });
  if (choice.fromLink !== requestedCrop) {
    setChoice({ fromLink: requestedCrop, selected: requestedCrop, erasing: false });
  }
  const { selected, erasing } = choice;
  const [confirmed, setConfirmed] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [focusedCell, setFocusedCell] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const { plans, activeId } = session.state;
  const active = plans.find((plan) => plan.id === activeId) ?? plans[0];
  const placements = active.placements;

  function persist(state: PlannerState, manual = false, baseline = session.baseline) {
    const result = savePlanner(baseline, state);
    setSession({
      state,
      baseline: result.ok ? result.baseline : baseline,
      issue: result.ok ? null : result.issue,
    });
    setUnsaved(!result.ok && (unsaved || state !== session.state));
    setConfirmed(manual && result.ok);
    if (manual && result.ok) {
      const activePlan = state.plans.find((plan) => plan.id === state.activeId) ?? state.plans[0];
      track("planner_saved", { plan_count: state.plans.length, placed_count: Object.keys(activePlan.placements).length });
    }
    return result.ok;
  }

  function save() {
    if (session.issue && !unsaved) {
      const latest = loadPlanner();
      if (!latest.issue) {
        persist(latest.state, true, latest.baseline);
        return;
      }
    }
    persist(session.state, true);
  }

  function setPlacements(next: Record<number, string>) {
    return persist({ activeId, plans: plans.map((plan) => plan.id === activeId ? { ...plan, placements: next } : plan) });
  }

  function addPlan() {
    const id = newPlanId();
    persist({ activeId: id, plans: [...plans, { id, name: `Plāns ${plans.length + 1}`, placements: {} }] });
  }

  function deletePlan() {
    if (plans.length <= 1) {
      if (Object.keys(placements).length) setPlacements({});
      return;
    }
    const remaining = plans.filter((plan) => plan.id !== active.id);
    persist({ plans: remaining, activeId: remaining[0].id });
  }

  function renamePlan() {
    const name = prompt("Plāna nosaukums:", active.name)?.trim();
    if (name && name !== active.name) {
      persist({ activeId, plans: plans.map((plan) => plan.id === activeId ? { ...plan, name } : plan) });
    }
  }

  function downloadPlans() {
    const sections = plans.map((plan) => {
      const cells = Object.entries(plan.placements).map(([index, id]) =>
        `${cellLabel(Number(index))} — ${cropById(id)?.name ?? id}`
      );
      return [plan.name, ...(cells.length ? cells : ["Tukšs plāns"])].join("\n");
    });
    const file = new Blob([sections.join("\n\n") + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dobu-plani.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const moon = useMemo(() => {
    const now = new Date();
    return { phase: moonForDate(now), sow: sowingDay(now) };
  }, []);
  const elem = ELEMENT_META[moon.sow.element];

  const placedCount = Object.keys(placements).length;
  const goodNeighbours = selected ? goodCompanions(selected) : [];
  const badNeighbours = selected ? badCompanions(selected) : [];

  // Check each placement against its orthogonal neighbours for bad/good pairings.
  const analysis = useMemo(() => {
    const badCells = new Set<number>();
    const goodCells = new Set<number>();
    const conflicts = new Map<string, { a: string; b: string; reason: string }>();
    let goodPairs = 0;
    const seenGood = new Set<string>();

    const neighbours = (i: number) => {
      const c = i % COLS;
      const out: number[] = [];
      if (c > 0) out.push(i - 1);
      if (c < COLS - 1) out.push(i + 1);
      if (i - COLS >= 0) out.push(i - COLS);
      if (i + COLS < COLS * ROWS) out.push(i + COLS);
      return out;
    };

    for (const [key, cropId] of Object.entries(placements)) {
      const i = Number(key);
      for (const j of neighbours(i)) {
        const other = placements[j];
        if (!other) continue;
        const st = companionStatus(cropId, other);
        const pairKey = [cropId, other].sort().join("|") + ":" + [i, j].sort().join("-");
        if (st === "bad") {
          badCells.add(i);
          badCells.add(j);
          const ck = [cropId, other].sort().join("|");
          if (!conflicts.has(ck)) {
            conflicts.set(ck, {
              a: cropById(cropId)?.name ?? cropId,
              b: cropById(other)?.name ?? other,
              reason: companionReason(cropId, other),
            });
          }
        } else if (st === "good") {
          goodCells.add(i);
          if (!seenGood.has(pairKey)) {
            seenGood.add(pairKey);
            goodPairs++;
          }
        }
      }
    }
    return { badCells, goodCells, conflicts: [...conflicts.values()], goodPairs };
  }, [placements]);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rowStart = index - index % COLS;
    const rowEnd = rowStart + COLS - 1;
    const destinations: Record<string, number> = {
      ArrowLeft: Math.max(rowStart, index - 1),
      ArrowRight: Math.min(rowEnd, index + 1),
      ArrowUp: Math.max(index % COLS, index - COLS),
      ArrowDown: Math.min(COLS * (ROWS - 1) + index % COLS, index + COLS),
      Home: rowStart,
      End: rowEnd,
    };
    const next = destinations[event.key];
    if (next === undefined) return;
    event.preventDefault();
    grid.current?.querySelectorAll("button")[next]?.focus();
  }

  function handleCell(i: number) {
    const next = editPlannerCell(placements, i, selected, erasing);
    if (next === placements) return;
    if (setPlacements(next) && !erasing && selected) {
      track("planner_crop_placed", { crop_id: selected, source: requestedCrop ? "crop_link" : "planner_page" });
    }
  }

  return (
    <>
      {/* Plan selector */}
      <div className="mb-md flex flex-wrap items-center gap-2">
        {plans.map((p) => (
          <Chip key={p.id} tone="neutral" active={p.id === activeId} onClick={() => { if (p.id !== activeId) persist({ plans, activeId: p.id }); }}>
            {p.name}
          </Chip>
        ))}
        <button
          onClick={addPlan}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-primary/40 px-3 py-2 text-label-sm text-primary transition-colors hover:bg-primary/10 active:scale-[0.98]"
        >
          <Icon name="add" size="14px" /> Jauns plāns
        </button>
        <div className="ml-auto flex gap-1">
          <button onClick={renamePlan} aria-label="Pārdēvēt plānu" title="Pārdēvēt" className="flex h-11 w-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary">
            <Icon name="edit" size="18px" />
          </button>
          <button onClick={deletePlan} aria-label="Dzēst plānu" title="Dzēst plānu" className="flex h-11 w-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-error">
            <Icon name="delete" size="18px" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-md lg:col-span-8">
          {/* Grid workspace */}
          <Card tone="low" elevated linen className="p-md">
            <label htmlFor="planner-crop" className="mb-1 block text-label-md font-semibold text-on-surface">Augs dobes plānā</label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="planner-crop"
                value={selected ?? ""}
                onChange={(event) => setChoice({ fromLink: requestedCrop, selected: event.target.value || null, erasing: false })}
                className="min-h-11 min-w-0 max-w-full flex-1 rounded-lg border border-outline-variant/50 bg-surface-container px-2 text-body-md text-on-surface"
              >
                <option value="">Izvēlies augu</option>
                {CATEGORIES.map((category) => (
                  <optgroup key={category.id} label={category.label}>
                    {CROPS.filter((crop) => crop.category === category.id).map((crop) => (
                      <option key={crop.id} value={crop.id}>{crop.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <Button
                variant={erasing ? "primary" : "ghost"}
                icon="ink_eraser"
                aria-pressed={erasing}
                className="px-sm py-xs"
                onClick={() => setChoice({ fromLink: requestedCrop, selected: null, erasing: !erasing })}
              >
                Dzēšgumija
              </Button>
            </div>
            <p aria-live="polite" className="my-sm text-body-md text-on-surface-variant">
              {erasing ? "Izvēlies aizņemtu rūtiņu, lai to atbrīvotu." : selected
                ? `Izvēlētais augs — ${cropById(selected)?.name}. Atzīmē tam tukšu rūtiņu.`
                : requestedId && !requestedCrop
                  ? "Saitē norādīto augu neatradām. Izvēlies citu augu no saraksta."
                  : "Izvēlies augu sarakstā un tad atzīmē tam tukšu rūtiņu."}
            </p>
            {session.issue && (
              <div className="mb-sm">
                <p role="alert" className="text-body-md text-error">{STORAGE_MESSAGES[session.issue]}</p>
                <Button variant="ghost" icon="download" className="mt-sm" onClick={downloadPlans}>
                  Lejupielādēt plānus (.txt)
                </Button>
              </div>
            )}
            <p id="planner-keys" className="sr-only">Rūtiņu vari izvēlēties arī ar bulttaustiņiem. Apstiprini ar Enter vai atstarpes taustiņu.</p>
            <div className="custom-scrollbar overflow-x-auto">
              <div
                ref={grid}
                role="group"
                aria-label="Dobes rūtiņas"
                aria-describedby="planner-keys"
                className="grid gap-1 rounded-xl border border-primary/10 bg-surface-variant/30 p-2"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, minWidth: COLS * 44 + (COLS - 1) * 4 + 18 }}
              >
                {Array.from({ length: COLS * ROWS }, (_, i) => {
                  const cropId = placements[i];
                  const crop = cropId ? cropById(cropId) : undefined;
                  const bad = analysis.badCells.has(i);
                  const good = !bad && analysis.goodCells.has(i);
                  return (
                    <button
                      key={i}
                      tabIndex={i === focusedCell ? 0 : -1}
                      onFocus={() => setFocusedCell(i)}
                      onKeyDown={(event) => moveFocus(event, i)}
                      onClick={() => handleCell(i)}
                      aria-disabled={erasing ? !cropId : !selected || Boolean(cropId)}
                      aria-label={`${cellLabel(i)}: ${crop?.name ?? cropId ?? "Tukša"}`}
                      title={bad ? `${crop?.name} — nesader ar kaimiņu!` : crop?.name}
                      className={`relative flex aspect-square items-center justify-center rounded border transition-all hover:scale-105 ${
                        crop
                          ? `${CAT_CELL[crop.category]} ${
                              bad
                                ? "ring-2 ring-error"
                                : good
                                  ? "ring-1 ring-primary/70"
                                  : "border-transparent"
                            }`
                          : "border-transparent bg-background/50 hover:border-primary/30 hover:bg-primary/10"
                      }`}
                    >
                      {cropId && <span aria-hidden="true" className="text-xl leading-none">{cropEmoji(cropId)}</span>}
                      {bad && (
                        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error text-[9px] font-bold text-on-error">
                          !
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-1 text-label-sm text-on-surface-variant sm:hidden">Pabīdi dobi sāniski, lai redzētu visas kolonnas.</p>
            <div className="mt-md flex flex-wrap gap-2">
              <Button icon={confirmed ? "check" : "save"} onClick={save}>Saglabāt plānu</Button>
              {placedCount > 0 && <Button variant="ghost" icon="delete_sweep" onClick={() => setPlacements({})}>Notīrīt plānu</Button>}
            </div>
            {!session.issue && <p role="status" className="mt-sm text-body-md text-on-surface-variant">
              {confirmed ? "Plāns saglabāts šajā pārlūkā." : "Izmaiņas automātiski saglabājas šajā pārlūkā."}
            </p>}
            {placedCount > 0 && (
              <details className="mt-sm rounded-lg border border-outline-variant/30 px-sm">
                <summary className="min-h-11 cursor-pointer py-3 text-label-md text-primary">Plānā atzīmētās vietas ({placedCount})</summary>
                <ul className="mb-sm space-y-1 text-body-md text-on-surface-variant">
                  {Object.entries(placements).map(([index, id]) => (
                    <li key={index}><strong>{cropById(id)?.name ?? id}</strong> · {cellLabel(Number(index))}</li>
                  ))}
                </ul>
              </details>
            )}

            {/* Live companion feedback */}
            {analysis.conflicts.length > 0 && (
              <div className="mt-sm rounded-xl border border-error/40 bg-error-container/20 p-sm">
                <p className="mb-2 flex items-center gap-2 text-label-md font-bold text-error">
                  <Icon name="warning" size="18px" />
                  Nesaderīgi kaimiņi ({analysis.conflicts.length})
                </p>
                <ul className="space-y-1.5">
                  {analysis.conflicts.map((c) => (
                    <li key={c.a + c.b} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                      <span className="font-semibold text-on-surface">
                        {c.a} ✕ {c.b}
                      </span>
                      <span>— {c.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.conflicts.length === 0 && analysis.goodPairs > 0 && (
              <div className="mt-sm flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-container/15 p-sm text-body-md text-primary-fixed">
                <Icon name="verified" size="18px" className="text-primary" />
                Lielisks izkārtojums — {analysis.goodPairs} labi kaimiņu pāri, nav konfliktu.
              </div>
            )}
          </Card>
        </div>

        {/* Companion planting + moon */}
        <div className="flex flex-col gap-md lg:col-span-4">
          <Card tone="highest" elevated accent="secondary" linen className="rounded-2xl p-md">
            <h4 className="mb-md flex items-center gap-sm text-headline-md text-secondary">
              <Icon name="groups" />
              {selected ? `${cropById(selected)?.name} — kaimiņi` : "Kaimiņaugu ieteikumi"}
            </h4>

            {selected && (goodNeighbours.length > 0 || badNeighbours.length > 0) ? (
              <div className="space-y-md">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-label-md text-primary">
                    <Icon name="thumb_up" size="16px" /> Labi kaimiņi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {goodNeighbours.length ? (
                      goodNeighbours.map((id) => (
                        <span key={id} className="inline-flex items-center gap-1 rounded-full bg-primary-container/30 px-2.5 py-1 text-label-sm text-on-primary-container">
                          {cropEmoji(id)} {cropById(id)?.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-label-sm text-on-surface-variant">Nav īpašu ieteikumu.</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-label-md text-error">
                    <Icon name="thumb_down" size="16px" /> Izvairies no
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {badNeighbours.length ? (
                      badNeighbours.map((id) => (
                        <span key={id} className="inline-flex items-center gap-1 rounded-full bg-error-container/25 px-2.5 py-1 text-label-sm text-error">
                          {cropEmoji(id)} {cropById(id)?.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-label-sm text-on-surface-variant">Šim augam sarakstā nav norādīti nevēlami kaimiņaugi.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                {selected ? "Šim augam vēl nav apkopoti dati par kaimiņaugiem." : "Izvēlies augu, lai apskatītu kaimiņaugu ieteikumus."}
              </p>
            )}
          </Card>

          <Card tone="container" className="flex flex-col gap-sm rounded-2xl p-md">
            <div className="flex items-center gap-sm">
              <Icon name={elem.icon} fill className={elem.color} />
              <span className="text-label-sm uppercase tracking-[0.2em] text-tertiary">
                {moon.phase.waxing ? "Augošs" : "Dilstošs"} mēness · {moon.sow.sign.symbol} {moon.sow.sign.name} · {elem.label}
              </span>
            </div>
            <p className="text-headline-md text-on-surface">{PART_GENITIVE[moon.sow.part]} diena</p>
            <p className="text-body-md italic text-on-surface-variant">{moon.sow.advice}</p>
          </Card>
        </div>
      </div>
    </>
  );
}

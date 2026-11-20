const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { createClient } = require("@supabase/supabase-js");

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const { cultivarColumnMissing, fetchGarden, guestPlantDetailsConflict, importGuestPlants, insertLog, insertPlant, savePlantCultivar, savePlantDate } = require("../lib/supabase/garden-sync.ts");
const { CultivarConflictError, normalizeCultivar } = require("../lib/garden.ts");

function clientFor(handler) {
  return createClient("https://garden.example", "test-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, options) => {
      const url = new URL(input);
      return handler(url.pathname.split("/").pop(), url.searchParams, options);
    } },
  });
}

test("a flowering observation round trips with its date and without harvest quantities", async () => {
  let saved;
  const client = clientFor((table, params, options) => {
    if (options.method === "POST") {
      assert.equal(table, "plant_logs");
      saved = JSON.parse(options.body);
      return new Response(null, { status: 201 });
    }
    assert.equal(params.get("user_id"), "eq.user");
    return Response.json(table === "plants" ? [{ id: "plant", crop_id: "rudzupukes", area: "Lielā dobe" }] : [saved]);
  });
  const event = { id: "bloom", type: "ziedesana", date: "2026-07-08", note: "Atvērās pirmie ziedi." };
  await insertLog(client, "user", "plant", event);
  assert.equal(saved.amount, null);
  assert.equal(saved.unit, null);
  const [plant] = await fetchGarden(client, "user");
  assert.deepEqual(plant.log, [{ ...event, amount: undefined, unit: undefined }]);
});

test("legacy cloud dates remain unconfirmed and an unavailable snapshot rejects", async () => {
  const plants = [
    { id: "old", sown_date: "2025-05-30", area: "Dobe", crop_id: "tomati" },
    { id: "new", sown_date: null, planted_on: "2026-05-31", area: "Dobe", crop_id: "tomati" },
  ];
  const client = clientFor((table) => Response.json(table === "plants" ? plants : []));
  const [legacy, confirmed] = await fetchGarden(client, "user");
  assert.equal(legacy.sownOn, null);
  assert.equal(legacy.plantedOn, null);
  assert.equal(confirmed.plantedOn, "2026-05-31");
  for (const failed of ["plants", "plant_logs"]) {
    const broken = clientFor((table) => table === failed
      ? Response.json({ message: "unavailable" }, { status: 400 })
      : Response.json([]));
    await assert.rejects(fetchGarden(broken, "user"), { message: "unavailable" });
  }
});

test("new plants and repeated guest imports keep dates and original plant/log ids", async () => {
  const requests = [];
  const client = clientFor((table, params, options) => {
    requests.push({ table, row: JSON.parse(options.body), prefer: new Headers(options.headers).get("prefer") ?? "" });
    return new Response(null, { status: 201 });
  });
  const plant = { id: "plant", cropId: "tomati", area: "Dobe", plantedOn: "2026-05-31",
    log: [{ id: "log", date: "2026-06-01", type: "laistits" }] };
  await insertPlant(client, "user", plant);
  await importGuestPlants(client, "user", [plant]);
  await importGuestPlants(client, "user", [plant]);
  const first = requests[0];
  assert.equal(first.table, "plants");
  assert.equal(first.row.sown_date, null);
  assert.equal(first.row.sown_on, null);
  assert.equal(first.row.planted_on, plant.plantedOn);
  assert.deepEqual(requests.slice(1, 3), requests.slice(3));
  assert.match(requests[1].prefer, /resolution=ignore-duplicates/);
  assert.equal(requests[1].row.id, plant.id);
  assert.match(requests[2].prefer, /resolution=ignore-duplicates/);
  assert.equal(requests[2].row.id, "log");
  assert.equal(requests[2].row.plant_id, "plant");
});

test("a date edit changes only the requested event on the owner's plant", async () => {
  const row = { sown_on: null, planted_on: null };
  const client = clientFor((table, params, options) => {
    assert.equal(table, "plants");
    assert.equal(params.get("id"), "eq.plant");
    assert.equal(params.get("user_id"), "eq.user");
    assert.equal(options.method, "PATCH");
    const change = JSON.parse(options.body);
    assert.equal(Object.keys(change).length, 1);
    return Response.json(Object.assign(row, change));
  });
  await savePlantDate(client, "user", "plant", "sown", "2026-03-20");
  const dates = await savePlantDate(client, "user", "plant", "planted", "2026-05-31");
  assert.deepEqual(dates, { sownOn: "2026-03-20", plantedOn: "2026-05-31" });
});

test("a resumed guest import fills missing confirmed dates without replacing cloud changes", async () => {
  const requests = [];
  const client = clientFor((table, params, options) => {
    if (options.method === "PATCH") {
      requests.push({ changes: JSON.parse(options.body), filter: params.get("planted_on") });
    }
    return new Response(null, { status: 201 });
  });
  const local = { id: "plant", cropId: "tomati", area: "Dobe", sownOn: "2026-03-10", plantedOn: "2026-05-31" };
  const cloud = { ...local, sownOn: "2026-03-12", plantedOn: null };
  await importGuestPlants(client, "user", [local], [cloud]);
  assert.deepEqual(requests, [{ changes: { planted_on: local.plantedOn }, filter: "is.null" }]);
});

test("legacy plants need no cultivar column and a named plant is never silently saved without its name", async () => {
  const rows = [];
  const oldDb = clientFor((table, params, options) => {
    if (options.method === "GET") return Response.json(table === "plants" ? [{ id: "old", crop_id: "tomati", area: "Dobe" }] : []);
    const body = JSON.parse(options.body);
    rows.push(body);
    return "cultivar" in body
      ? Response.json({ code: "PGRST204", message: "Column cultivar is missing" }, { status: 400 })
      : new Response(null, { status: 201 });
  });
  const [oldPlant] = await fetchGarden(oldDb, "user");
  assert.equal(oldPlant.cultivar, null);
  await insertPlant(oldDb, "user", oldPlant);
  await assert.rejects(insertPlant(oldDb, "user", { ...oldPlant, cultivar: "Mājas F1" }), cultivarColumnMissing);
  assert.deepEqual(rows.map((row) => row.cultivar), [undefined, "Mājas F1"]);
  assert.equal(normalizeCultivar("  Mājas F1  "), "Mājas F1");
  for (const value of [undefined, null, {}, "   ", "a".repeat(101)]) assert.equal(normalizeCultivar(value), null);
});

test("a cultivar edit, clearing it and a stale-device conflict are scoped to one private plant", async () => {
  let cultivar = null;
  const client = clientFor((table, params, options) => {
    assert.equal(table, "plants");
    assert.equal(options.method, "PATCH");
    assert.equal(params.get("user_id"), "eq.user");
    assert.equal(params.get("id"), "eq.plant");
    assert.equal(params.get("select"), "cultivar");
    const change = JSON.parse(options.body);
    assert.deepEqual(Object.keys(change), ["cultivar"]);
    if (params.get("cultivar") !== (cultivar === null ? "is.null" : "eq." + cultivar)) {
      return Response.json({ code: "PGRST116", message: "No rows matched" }, { status: 406 });
    }
    cultivar = change.cultivar;
    return Response.json({ cultivar });
  });
  await savePlantCultivar(client, "user", "plant", "Mājas F1", null);
  await assert.rejects(savePlantCultivar(client, "user", "plant", "Cita", null), CultivarConflictError);
  assert.equal(cultivar, "Mājas F1");
  await savePlantCultivar(client, "user", "plant", null, "Mājas F1");
  assert.equal(cultivar, null);
});

test("a retry after a lost harvest response preserves the log id and does not duplicate the harvest", async () => {
  const saved = new Map();
  const client = clientFor((table, params, options) => {
    assert.equal(table, "plant_logs");
    const row = JSON.parse(options.body);
    assert.equal(row.user_id, "user");
    assert.equal(row.plant_id, "plant");
    if (saved.has(row.id)) {
      assert.match(new Headers(options.headers).get("prefer"), /resolution=ignore-duplicates/);
      return new Response(null, { status: 201 });
    }
    saved.set(row.id, row);
    return Response.json({ message: "Unable to confirm the request" }, { status: 503 });
  });
  const entry = { id: "same-harvest", date: "2026-07-31", type: "raza", amount: 3, unit: "gab" };
  await assert.rejects(insertLog(client, "user", "plant", entry));
  await insertLog(client, "user", "plant", entry, true);
  assert.equal(saved.size, 1);
});

test("retrying guest import copies a missing cultivar without overwriting an existing cloud name", async () => {
  const changes = [];
  const client = clientFor((table, params, options) => {
    const row = JSON.parse(options.body);
    if (options.method === "POST") {
      assert.equal(row.cultivar, "Mājas F1");
      assert.match(new Headers(options.headers).get("prefer"), /ignore-duplicates/);
    } else {
      assert.equal(params.get("user_id"), "eq.user");
      assert.equal(params.get("id"), "eq.plant");
      assert.equal(params.get("cultivar"), "is.null");
      changes.push(row);
    }
    return new Response(null, { status: 201 });
  });
  const guest = { id: "plant", cropId: "tomati", area: "Dobe", cultivar: "Mājas F1" };
  await importGuestPlants(client, "user", [guest], [{ ...guest, cultivar: null }]);
  await importGuestPlants(client, "user", [guest], [{ ...guest, cultivar: "Cita" }]);
  assert.deepEqual(changes, [{ cultivar: "Mājas F1" }]);
  assert.equal(guestPlantDetailsConflict(guest, { ...guest, cultivar: "Cita" }), true);
  assert.equal(guestPlantDetailsConflict({ ...guest, cultivar: null }, guest), true);
  assert.equal(guestPlantDetailsConflict({ ...guest, cultivar: undefined }, guest), false);
  assert.equal(guestPlantDetailsConflict(guest, guest), false);
});

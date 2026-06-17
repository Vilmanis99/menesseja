"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/regions";
import { getClientId, getStoredName, storeName } from "@/lib/community-identity";
import {
  CONTRIBUTION_META,
  type ContributionType,
  type ApprovedContribution,
  type MyContribution,
  type PendingContribution,
} from "@/lib/contributions";

const TYPES: ContributionType[] = ["recepte", "ticejums", "paraza"];
const regionName = (id: string | null) => (id ? REGIONS.find((r) => r.id === id)?.name ?? null : null);

export default function IesutitPage() {
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState<ContributionType>("ticejums");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [configured, setConfigured] = useState<boolean | null>(null);
  const [approved, setApproved] = useState<ApprovedContribution[]>([]);
  const [mine, setMine] = useState<MyContribution[]>([]);
  const [pending, setPending] = useState<PendingContribution[]>([]);

  // Moderation unlocks when the page is opened with ?key=<ADMIN_KEY>. The key is
  // only ever verified server-side; here it just gets forwarded with requests.
  const adminKey = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("key") ?? "";
  }, []);

  useEffect(() => {
    setClientId(getClientId());
    setAuthorName(getStoredName());
  }, []);

  const load = useCallback(async () => {
    if (!clientId) return;
    try {
      const qs = new URLSearchParams({ clientId });
      if (adminKey) qs.set("key", adminKey);
      const res = await fetch(`/api/contributions?${qs.toString()}`);
      if (res.status === 503) {
        setConfigured(false);
        return;
      }
      setConfigured(true);
      const data = await res.json();
      setApproved(data.approved ?? []);
      setMine(data.mine ?? []);
      setPending(data.pending ?? []);
    } catch {
      setError("Neizdevās ielādēt. Mēģini vēlreiz.");
    }
  }, [clientId, adminKey]);

  useEffect(() => {
    if (clientId) load();
  }, [clientId, load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !title.trim() || !body.trim()) return;
    setBusy(true);
    setError(null);
    if (authorName.trim()) storeName(authorName);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientId, type, title, body, region, authorName }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(
          err.error === "rate-limited"
            ? "Pārāk daudz iesūtījumu īsā laikā — pagaidi dažas minūtes."
            : "Neizdevās iesūtīt. Mēģini vēlreiz.",
        );
      } else {
        setDone(true);
        setTitle("");
        setBody("");
        await load();
      }
    } catch {
      setError("Neizdevās iesūtīt. Mēģini vēlreiz.");
    } finally {
      setBusy(false);
    }
  }

  async function moderate(id: string, status: "approved" | "rejected") {
    setPending((ps) => ps.filter((p) => p.id !== id)); // optimistic
    try {
      await fetch(`/api/contributions/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, key: adminKey }),
      });
      await load();
    } catch {
      setError("Neizdevās. Mēģini vēlreiz.");
      load();
    }
  }

  return (
    <article className="mx-auto max-w-2xl">
      <PageHeader
        title="Iesūti senču gudrību"
        subtitle="Recepte, ticējums vai paraža no tavas sētas — palīdzi to saglabāt nākamajām paaudzēm."
      />

      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="volunteer_activism" className="text-primary" />
        <p className="text-body-md text-on-surface-variant">
          Mēness Sēja ir dzīva krātuve. Katrs ticējums, vecmāmiņas recepte vai sētas paraža, ko iesūti,
          tiek pārskatīts un pievienots krātuvei — lai tas nepazūd. Paldies, ka palīdzi digitalizēt mūsu
          senču gudrību!
        </p>
      </Card>

      {/* Admin review queue (only with a valid ?key=) */}
      {pending.length > 0 && (
        <div className="mb-lg">
          <h2 className="mb-sm flex items-center gap-2 text-headline-md text-on-surface">
            <Icon name="gavel" size="20px" className="text-secondary" /> Gaida apstiprināšanu ({pending.length})
          </h2>
          <div className="space-y-md">
            {pending.map((c) => {
              const meta = CONTRIBUTION_META[c.type];
              return (
                <Card key={c.id} tone="container" accent="secondary" className="p-md">
                  <div className="mb-1 flex items-center gap-2 text-label-sm text-tertiary">
                    <Icon name={meta.icon} size="16px" /> {meta.label}
                    {regionName(c.region) ? <span className="text-on-surface-variant/70">· {regionName(c.region)}</span> : null}
                  </div>
                  <h3 className="text-headline-md text-on-surface">{c.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-body-md text-on-surface-variant">{c.body}</p>
                  {c.authorName && <p className="mt-sm text-label-sm text-on-surface-variant">— {c.authorName}</p>}
                  <div className="mt-md flex gap-2">
                    <Button icon="check" onClick={() => moderate(c.id, "approved")}>Apstiprināt</Button>
                    <Button variant="outline" icon="close" onClick={() => moderate(c.id, "rejected")}>Noraidīt</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Form */}
      {configured === false ? (
        <Card tone="container" className="mb-lg flex items-center gap-md p-md">
          <Icon name="cloud_off" className="text-on-surface-variant/50" />
          <p className="text-body-md text-on-surface-variant">Iesūtīšana drīz būs pieejama.</p>
        </Card>
      ) : done ? (
        <Card tone="container" accent="primary" className="mb-lg flex flex-col items-center gap-sm p-lg text-center">
          <Icon name="check_circle" size="40px" className="text-primary" />
          <h2 className="text-headline-md text-on-surface">Paldies!</h2>
          <p className="max-w-[28rem] text-body-md text-on-surface-variant">
            Tava gudrība ir saņemta. Mēs to izskatīsim un pievienosim krātuvei. Tā parādīsies šeit, kad
            būs apstiprināta.
          </p>
          <Button variant="outline" onClick={() => setDone(false)}>Iesūtīt vēl vienu</Button>
        </Card>
      ) : (
        <Card tone="container" elevated className="mb-lg p-md">
          <form onSubmit={submit} className="flex flex-col gap-md">
            <div>
              <p className="mb-2 text-label-sm uppercase tracking-widest text-on-surface-variant">Kas tas ir?</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <Chip key={t} tone="neutral" active={t === type} onClick={() => setType(t)}>
                    {CONTRIBUTION_META[t].label}
                  </Chip>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Virsraksts</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder={type === "recepte" ? "piem. Vecmāmiņas nātru mēslojums" : "piem. Kad sēt kāpostus"}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary/60"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Apraksts</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={4000}
                rows={5}
                required
                placeholder="Pastāsti pēc iespējas pilnīgāk — sastāvu, soļus, vai ticējuma nozīmi…"
                className="resize-none rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary/60"
              />
            </label>

            <div>
              <p className="mb-2 text-label-sm uppercase tracking-widest text-on-surface-variant">Reģions (nav obligāts)</p>
              <div className="flex flex-wrap gap-2">
                <Chip tone="neutral" active={region === null} onClick={() => setRegion(null)}>Visa Latvija</Chip>
                {REGIONS.map((r) => (
                  <Chip key={r.id} tone="neutral" active={region === r.id} onClick={() => setRegion(r.id)}>
                    {r.name}
                  </Chip>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Kā norādīt autoru? (nav obligāts)</span>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={120}
                placeholder="piem. Vecmāmiņa Anna, Kurzeme"
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary/60"
              />
            </label>

            {error && <p className="text-body-md text-error">{error}</p>}
            <Button icon="send" fullWidth disabled={busy || !title.trim() || !body.trim()}>
              {busy ? "Sūta…" : "Iesūtīt krātuvei"}
            </Button>
          </form>
        </Card>
      )}

      {/* My submissions */}
      {mine.length > 0 && (
        <div className="mb-lg">
          <h2 className="mb-sm text-headline-md text-on-surface">Tavi ieraksti</h2>
          <Card tone="low" className="divide-y divide-outline-variant/10 p-0">
            {mine.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-md py-2">
                <Icon name={CONTRIBUTION_META[m.type]?.icon ?? "circle"} size="18px" className="text-on-surface-variant" />
                <span className="flex-1 truncate text-body-md text-on-surface">{m.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-label-sm ${
                    m.status === "approved"
                      ? "bg-primary-container/30 text-primary-fixed"
                      : m.status === "rejected"
                        ? "bg-surface-variant/40 text-on-surface-variant"
                        : "bg-secondary-container/30 text-secondary-fixed"
                  }`}
                >
                  {m.status === "approved" ? "Apstiprināts" : m.status === "rejected" ? "Noraidīts" : "Gaida pārbaudi"}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Approved wisdom */}
      {approved.length > 0 && (
        <div>
          <h2 className="mb-sm text-headline-md text-on-surface">Krātuvē jau ir</h2>
          <div className="space-y-md">
            {approved.map((c) => {
              const meta = CONTRIBUTION_META[c.type];
              return (
                <Card key={c.id} tone="high" elevated className="p-md">
                  <div className="mb-1 flex items-center gap-2 text-label-sm text-tertiary">
                    <Icon name={meta.icon} size="16px" /> {meta.label}
                    {regionName(c.region) ? (
                      <span className="text-on-surface-variant/70">· {regionName(c.region)}</span>
                    ) : null}
                  </div>
                  <h3 className="text-headline-md text-on-surface">{c.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-body-md text-on-surface-variant">{c.body}</p>
                  {c.authorName && <p className="mt-sm text-label-sm text-on-surface-variant">— {c.authorName}</p>}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

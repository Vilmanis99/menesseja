"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/regions";
import { useMounted } from "@/lib/use-mounted";
import {
  CONTRIBUTION_META,
  type ApprovedContribution,
  type PendingContribution,
} from "@/lib/contributions";
import type { FeedPost } from "@/lib/neon/community";

const KEY_STORE = "menesseja_admin_key";
const regionName = (id: string | null) => (id ? REGIONS.find((r) => r.id === id)?.name ?? null : null);

type Status = {
  hasAdminKey: boolean;
  keyValid: boolean;
  counts?: { contrib: { pending: number; approved: number; rejected: number }; community: number };
  error?: string;
};

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("lv-LV", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const mounted = useMounted();
  const [keyInput, setKeyInput] = useState("");
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [pending, setPending] = useState<PendingContribution[]>([]);
  const [approved, setApproved] = useState<ApprovedContribution[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showApproved, setShowApproved] = useState(false);

  useEffect(() => {
    const k = window.localStorage.getItem(KEY_STORE) ?? "";
    setKey(k);
    setKeyInput(k);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, contribRes, communityRes] = await Promise.all([
        key ? fetch(`/api/admin/status?key=${encodeURIComponent(key)}`) : Promise.resolve(null),
        fetch(`/api/contributions?clientId=admin${key ? `&key=${encodeURIComponent(key)}` : ""}`),
        fetch(`/api/community`),
      ]);
      setStatus(statusRes ? await statusRes.json() : null);
      if (contribRes.status === 503) {
        setConfigured(false);
      } else {
        setConfigured(true);
        const d = await contribRes.json();
        setApproved(d.approved ?? []);
        setPending(d.pending ?? []);
      }
      if (communityRes.ok) {
        const c = await communityRes.json();
        setPosts(c.posts ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (mounted) load();
  }, [mounted, load]);

  function saveKey() {
    const k = keyInput.trim();
    window.localStorage.setItem(KEY_STORE, k);
    setKey(k);
  }
  function clearKey() {
    window.localStorage.removeItem(KEY_STORE);
    setKey("");
    setKeyInput("");
    setStatus(null);
    setPending([]);
  }

  async function moderate(id: string, next: "approved" | "rejected") {
    setPending((ps) => ps.filter((p) => p.id !== id));
    await fetch(`/api/contributions/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next, key }),
    });
    load();
  }
  async function hideApproved(id: string) {
    setApproved((a) => a.filter((c) => c.id !== id));
    await fetch(`/api/contributions/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "rejected", key }),
    });
    load();
  }
  async function removePost(id: string) {
    setPosts((p) => p.filter((x) => x.id !== id));
    await fetch(`/api/community/${id}?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    load();
  }

  if (!mounted) {
    return (
      <article className="mx-auto max-w-2xl">
        <PageHeader title="Admin panelis" subtitle="Iesūtījumi un kopiena." />
      </article>
    );
  }

  const keyOk = status?.keyValid === true;

  return (
    <article className="mx-auto max-w-2xl">
      <PageHeader
        title="Admin panelis"
        subtitle="Šeit redzi visu, ko cilvēki iesūtījuši un rakstījuši kopienā — un vari apstiprināt, noraidīt vai dzēst."
      />

      {/* Key entry + connection status */}
      <Card tone="high" elevated className="mb-lg p-md">
        <label className="mb-1 block text-label-sm text-on-surface-variant">ADMIN_KEY</label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
            placeholder="Ielīmē savu admin atslēgu…"
            className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
          <Button icon="login" onClick={saveKey}>Pieslēgties</Button>
          {key && (
            <Button variant="ghost" icon="logout" onClick={clearKey}>Iziet</Button>
          )}
        </div>

        {/* Status banner */}
        {key && status && !keyOk && !status.hasAdminKey && (
          <div className="mt-sm flex items-start gap-2 rounded-lg border border-tertiary/40 bg-tertiary-container/30 p-sm text-on-tertiary-container">
            <Icon name="warning" size="18px" className="mt-0.5 shrink-0" />
            <p className="text-body-sm">
              <strong>ADMIN_KEY nav uzlikts Vercel.</strong> Moderācija ir atslēgta, un iesūtījumi var
              klusi krāties. Uzliec Vercel projektā vides mainīgo <code>ADMIN_KEY</code> ar drošu vērtību,
              tad ielīmē to šeit.
            </p>
          </div>
        )}
        {key && status && !keyOk && status.hasAdminKey && (
          <p className="mt-sm text-body-sm text-error">Nepareiza atslēga.</p>
        )}
        {keyOk && (
          <p className="mt-sm flex items-center gap-1 text-body-sm text-primary">
            <Icon name="verified" size="16px" /> Pieslēdzies kā admins.
          </p>
        )}
        {!key && (
          <p className="mt-sm text-body-sm text-on-surface-variant">
            Ievadi atslēgu, lai redzētu iesūtījumus, kas gaida apstiprināšanu, un varētu moderēt.
            Kopienas ieraksti redzami arī bez atslēgas.
          </p>
        )}
      </Card>

      {configured === false && (
        <Card tone="container" className="mb-lg flex items-center gap-md p-md">
          <Icon name="cloud_off" className="text-on-surface-variant/50" />
          <p className="text-body-md text-on-surface-variant">
            Datubāze nav pieslēgta (DATABASE_URL). Iesūtīšana un kopiena šobrīd nedarbojas.
          </p>
        </Card>
      )}

      {/* Counts */}
      <div className="mb-lg grid grid-cols-3 gap-sm">
        {[
          { label: "Gaida", value: keyOk ? status?.counts?.contrib.pending ?? pending.length : pending.length, icon: "gavel", tone: "text-secondary" },
          { label: "Apstiprināti", value: keyOk ? status?.counts?.contrib.approved ?? approved.length : approved.length, icon: "verified", tone: "text-primary" },
          { label: "Kopienā", value: keyOk ? status?.counts?.community ?? posts.length : posts.length, icon: "groups", tone: "text-tertiary" },
        ].map((c) => (
          <Card key={c.label} tone="container" className="p-md text-center">
            <Icon name={c.icon} size="22px" className={`${c.tone} mb-1`} />
            <p className="text-headline-md text-on-surface">{c.value}</p>
            <p className="text-label-sm text-on-surface-variant">{c.label}</p>
          </Card>
        ))}
      </div>

      {loading && <p className="mb-md text-body-sm text-on-surface-variant">Ielādē…</p>}

      {/* Pending contributions */}
      {keyOk && (
        <section className="mb-lg">
          <h2 className="mb-sm flex items-center gap-2 text-headline-md text-on-surface">
            <Icon name="gavel" size="20px" className="text-secondary" /> Gaida apstiprināšanu ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <Card tone="container" className="p-md">
              <p className="text-body-md text-on-surface-variant">Nav neviena, kas gaida apstiprināšanu.</p>
            </Card>
          ) : (
            <div className="space-y-md">
              {pending.map((c) => {
                const meta = CONTRIBUTION_META[c.type];
                return (
                  <Card key={c.id} tone="container" accent="secondary" className="p-md">
                    <div className="mb-1 flex items-center gap-2 text-label-sm text-tertiary">
                      <Icon name={meta.icon} size="16px" /> {meta.label}
                      {regionName(c.region) ? <span className="text-on-surface-variant/70">· {regionName(c.region)}</span> : null}
                      {c.createdAt ? <span className="text-on-surface-variant/70">· {fmt(c.createdAt)}</span> : null}
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
          )}
        </section>
      )}

      {/* Community posts */}
      <section className="mb-lg">
        <h2 className="mb-sm flex items-center gap-2 text-headline-md text-on-surface">
          <Icon name="groups" size="20px" className="text-tertiary" /> Kopienas ieraksti ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <Card tone="container" className="p-md">
            <p className="text-body-md text-on-surface-variant">Vēl nav neviena kopienas ieraksta.</p>
          </Card>
        ) : (
          <div className="space-y-sm">
            {posts.map((p) => (
              <Card key={p.id} tone="container" className="p-md">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">{p.authorName}</span>
                  {regionName(p.region) ? <span>· {regionName(p.region)}</span> : null}
                  <span>· {fmt(p.createdAt)}</span>
                  <span className="inline-flex items-center gap-1">· <Icon name="favorite" size="13px" /> {p.likeCount}</span>
                </div>
                <p className="whitespace-pre-wrap text-body-md text-on-surface">{p.body}</p>
                {keyOk && (
                  <div className="mt-sm">
                    <Button variant="ghost" icon="delete" onClick={() => removePost(p.id)}>Dzēst</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        {!keyOk && posts.length > 0 && (
          <p className="mt-1 text-label-sm text-on-surface-variant/70">Dzēšanai pieslēdzies ar ADMIN_KEY.</p>
        )}
      </section>

      {/* Approved contributions (history) */}
      {keyOk && (
        <section className="mb-lg">
          <button
            onClick={() => setShowApproved((v) => !v)}
            className="mb-sm flex items-center gap-2 text-headline-md text-on-surface"
          >
            <Icon name={showApproved ? "expand_less" : "expand_more"} size="20px" className="text-primary" />
            Apstiprinātā gudrība ({approved.length})
          </button>
          {showApproved && (
            approved.length === 0 ? (
              <Card tone="container" className="p-md">
                <p className="text-body-md text-on-surface-variant">Vēl nav apstiprinātu iesūtījumu.</p>
              </Card>
            ) : (
              <div className="space-y-sm">
                {approved.map((c) => {
                  const meta = CONTRIBUTION_META[c.type];
                  return (
                    <Card key={c.id} tone="container" className="p-md">
                      <div className="mb-1 flex items-center gap-2 text-label-sm text-tertiary">
                        <Icon name={meta.icon} size="16px" /> {meta.label}
                        {regionName(c.region) ? <span className="text-on-surface-variant/70">· {regionName(c.region)}</span> : null}
                      </div>
                      <h3 className="text-headline-md text-on-surface">{c.title}</h3>
                      <p className="mt-1 whitespace-pre-wrap text-body-md text-on-surface-variant">{c.body}</p>
                      {c.authorName && <p className="mt-sm text-label-sm text-on-surface-variant">— {c.authorName}</p>}
                      <div className="mt-sm">
                        <Button variant="ghost" icon="visibility_off" onClick={() => hideApproved(c.id)}>Paslēpt (noraidīt)</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )
          )}
        </section>
      )}
    </article>
  );
}

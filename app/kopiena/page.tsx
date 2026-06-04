"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/components/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { fetchFeed, createPost, deletePost, setLike, type FeedPost } from "@/lib/supabase/community";
import { REGIONS, getRegion, type RegionId } from "@/lib/regions";

const WISDOM = [
  { text: "Sēj kāpostus tajā dienā, kad pirmā vārna ligzdā iesēžas.", src: "Vidzemes ticējums" },
  { text: "Ja Mēness spīd cauri ābeļu zariem, būs auglīgs gads.", src: "Latgales viedums" },
  { text: "Ko iesēj jaunā Mēnesī, tas aug gaisā; ko vecā — tas aug zemē.", src: "Sēlijas paruna" },
];

function regionLabel(id: string | null): string {
  const r = id ? REGIONS.find((x) => x.id === id) : null;
  return r ? `${r.name} · ` : "";
}

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "tagad";
  const m = Math.floor(s / 60);
  if (m < 60) return `pirms ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `pirms ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `pirms ${d} d`;
  return new Date(iso).toLocaleDateString("lv-LV");
}

export default function KopienaPage() {
  const { enabled, loading: authLoading, user, profile } = useAuth();
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);

  const [tab, setTab] = useState<"all" | RegionId>("all");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const data = await fetchFeed(supabase, {
      region: tab === "all" ? null : tab,
      currentUserId: user?.id ?? null,
    });
    setPosts(data);
    setLoading(false);
  }, [supabase, tab, user?.id]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  async function send() {
    const body = draft.trim();
    if (!body || !supabase || !user) return;
    setBusy(true);
    const region = tab === "all" ? profile?.region ?? null : tab;
    try {
      await createPost(supabase, user.id, region, body);
      setDraft("");
      await load();
    } catch {
      setErrorMsg("Neizdevās publicēt. Mēģini vēlreiz.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleLike(post: FeedPost) {
    if (!supabase || !user || pending.has(post.id)) return; // guard double-clicks
    setPending((s) => new Set(s).add(post.id));
    const next = !post.likedByMe;
    // optimistic
    setPosts((ps) =>
      ps.map((p) =>
        p.id === post.id ? { ...p, likedByMe: next, likeCount: p.likeCount + (next ? 1 : -1) } : p,
      ),
    );
    try {
      await setLike(supabase, post.id, user.id, next);
    } catch {
      setErrorMsg("Neizdevās. Mēģini vēlreiz.");
      load(); // reconcile on failure
    } finally {
      setPending((s) => {
        const n = new Set(s);
        n.delete(post.id);
        return n;
      });
    }
  }

  async function remove(post: FeedPost) {
    if (!supabase) return;
    setPosts((ps) => ps.filter((p) => p.id !== post.id));
    try {
      await deletePost(supabase, post.id);
    } catch {
      setErrorMsg("Neizdevās izdzēst. Mēģini vēlreiz.");
      load();
    }
  }

  return (
    <>
      <PageHeader title="Kopiena" subtitle="Augsim kopā ar dabu un tautas viedumu." />

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Live feed */}
        <div className="flex flex-col gap-md lg:col-span-8">
          {/* Region tabs */}
          <div className="flex flex-wrap gap-2">
            <Chip active={tab === "all"} tone="neutral" onClick={() => setTab("all")}>Visi</Chip>
            {REGIONS.map((r) => (
              <Chip key={r.id} active={tab === r.id} tone="neutral" onClick={() => setTab(r.id)}>
                {r.name}
              </Chip>
            ))}
          </div>

          {/* Composer */}
          {enabled && user ? (
            <Card tone="container" className="p-md">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={2000}
                rows={2}
                placeholder={`Padalies ar novērojumu vai jautā kaut ko${tab !== "all" ? ` (${getRegion(tab).name})` : ""}…`}
                className="w-full resize-none bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-label-sm text-on-surface-variant/60">{draft.length}/2000</span>
                <button
                  onClick={send}
                  disabled={!draft.trim() || busy}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-label-md font-bold text-on-primary disabled:opacity-40"
                >
                  <Icon name="send" size="16px" /> {busy ? "Sūta…" : "Publicēt"}
                </button>
              </div>
            </Card>
          ) : enabled ? (
            <Link href="/ienakt">
              <Card tone="container" className="flex items-center gap-md p-md transition-colors hover:bg-surface-container-high">
                <Icon name="lock_open" className="text-primary" />
                <p className="flex-1 text-body-md text-on-surface">Ienāc, lai rakstītu un atzīmētu «patīk»</p>
                <Icon name="arrow_forward" size="18px" className="text-on-surface-variant" />
              </Card>
            </Link>
          ) : (
            <Card tone="container" className="flex items-center gap-md p-md">
              <Icon name="cloud_off" className="text-on-surface-variant/50" />
              <p className="text-body-md text-on-surface-variant">
                Kopiena drīz būs pieejama. Pa to laiku skaties senču gudrības →
              </p>
            </Card>
          )}

          {errorMsg && (
            <button
              onClick={() => setErrorMsg(null)}
              className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary-container/20 px-3 py-2 text-left text-body-md text-secondary-fixed"
            >
              <Icon name="error" size="18px" className="text-secondary" />
              <span className="flex-1">{errorMsg}</span>
              <Icon name="close" size="16px" />
            </button>
          )}

          {/* Posts */}
          {loading ? (
            <Card tone="low" className="p-lg text-center text-on-surface-variant">Ielādē…</Card>
          ) : posts.length === 0 ? (
            <Card tone="low" className="flex flex-col items-center gap-sm p-lg text-center">
              <Icon name="forum" className="text-primary/40" size="40px" />
              <p className="text-body-lg text-on-surface">
                {tab === "all" ? "Vēl nav ierakstu." : `Vēl nav ierakstu no ${getRegion(tab).name}.`}
              </p>
              <p className="text-body-md text-on-surface-variant">Esi pirmais, kas padalās!</p>
            </Card>
          ) : (
            posts.map((p) => (
              <Card key={p.id} tone="high" elevated className="p-md">
                <div className="mb-sm flex items-center gap-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-label-md font-bold text-on-primary-container">
                    {p.authorName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-label-md text-on-surface">{p.authorName}</p>
                    <p className="text-label-sm text-on-surface-variant/70">
                      {regionLabel(p.region)}{timeAgo(p.createdAt)}
                    </p>
                  </div>
                  {p.mine && (
                    <button
                      onClick={() => remove(p)}
                      aria-label="Dzēst"
                      className="text-on-surface-variant/50 transition-colors hover:text-error"
                    >
                      <Icon name="delete" size="18px" />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-body-md text-on-surface">{p.body}</p>
                <div className="mt-md flex items-center gap-md border-t border-outline-variant/10 pt-sm">
                  <button
                    onClick={() => toggleLike(p)}
                    disabled={!user || pending.has(p.id)}
                    aria-pressed={p.likedByMe}
                    className={`flex items-center gap-1 text-label-md transition-colors disabled:opacity-50 ${
                      p.likedByMe ? "text-secondary" : "text-on-surface-variant hover:text-secondary"
                    }`}
                  >
                    <Icon name="favorite" size="18px" fill={p.likedByMe} /> {p.likeCount}
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Curated wisdom */}
        <div className="flex flex-col gap-md lg:col-span-4">
          <Card tone="container" accent="secondary" className="p-md">
            <h4 className="mb-sm flex items-center gap-sm text-label-md uppercase tracking-wider text-secondary">
              <Icon name="auto_stories" size="18px" />
              Tradicionālās gudrības
            </h4>
            <div className="space-y-md">
              {WISDOM.map((w) => (
                <div key={w.src}>
                  <p className="text-body-md italic text-on-surface">«{w.text}»</p>
                  <span className="mt-1 block text-label-sm text-on-surface-variant">— {w.src}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card tone="high" accent="primary" className="flex items-start gap-sm p-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="verified" size="22px" />
            </div>
            <div>
              <p className="text-label-md text-primary">Eksperta padoms</p>
              <h4 className="text-headline-md text-on-surface">Kā pasargāt jaunos stādus no salnām</h4>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Senču dūmu aizsegs darbojas, bet mūsdienu dārzā vislabāk strādā dubultais agroūdens segums
                kombinācijā ar mulčējumu. Svarīgi to uzklāt pirms saulrieta.
              </p>
            </div>
          </Card>

          <Link href="/iesutit">
            <Card tone="container" accent="secondary" className="flex items-start gap-sm p-md transition-colors hover:bg-surface-container-high">
              <Icon name="volunteer_activism" className="text-secondary" size="22px" />
              <div>
                <p className="font-semibold text-on-surface">Zini senču gudrību?</p>
                <p className="text-body-md text-on-surface-variant">
                  Iesūti ticējumu vai recepti — mēs to saglabāsim krātuvei.
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}

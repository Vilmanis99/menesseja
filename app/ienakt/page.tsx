"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAuth } from "@/components/auth-context";

export default function IenaktPage() {
  const { enabled, loading, user, profile, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkFailed, setLinkFailed] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("kluda")) setLinkFailed(true);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSent(true);
    } catch {
      setError("Neizdevās nosūtīt saiti. Mēģini vēlreiz.");
    } finally {
      setBusy(false);
    }
  }

  // Backend not connected yet — honest, graceful message.
  if (!enabled) {
    return (
      <Shell>
        <Card tone="container" className="flex flex-col items-center gap-sm p-lg text-center">
          <Icon name="cloud_off" size="40px" className="text-on-surface-variant/50" />
          <h1 className="text-headline-md text-on-surface">Konti vēl nav ieslēgti</h1>
          <p className="max-w-[26rem] text-body-md text-on-surface-variant">
            Tavs dārzs pagaidām tiek saglabāts tikai šajā ierīcē. Drīz varēsi izveidot kontu un
            sinhronizēt to starp telefonu un datoru.
          </p>
        </Card>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <Card tone="container" className="p-lg text-center text-on-surface-variant">Brīdi…</Card>
      </Shell>
    );
  }

  // Already signed in
  if (user) {
    return (
      <Shell>
        <Card tone="container" className="flex flex-col items-center gap-sm p-lg text-center">
          <Icon name="check_circle" size="40px" className="text-primary" />
          <h1 className="text-headline-md text-on-surface">Tu esi ielogojies</h1>
          <p className="text-body-md text-on-surface-variant">
            {profile?.display_name ? `Sveiks, ${profile.display_name}!` : user.email}
          </p>
          <div className="mt-sm flex gap-2">
            <Link href="/"><Button>Uz dārzu</Button></Link>
            <Button variant="outline" onClick={signOut}>Iziet</Button>
          </div>
        </Card>
      </Shell>
    );
  }

  // Magic-link form
  return (
    <Shell>
      <Card tone="container" elevated className="p-lg">
        {sent ? (
          <div className="flex flex-col items-center gap-sm text-center">
            <Icon name="mark_email_read" size="40px" className="text-primary" />
            <h1 className="text-headline-md text-on-surface">Pārbaudi e-pastu</h1>
            <p className="max-w-[26rem] text-body-md text-on-surface-variant">
              Nosūtījām ielogošanās saiti uz <span className="text-on-surface">{email}</span>.
              Atver to telefonā vai datorā, un būsi iekšā.
            </p>
            <button onClick={() => setSent(false)} className="mt-sm text-label-md text-primary hover:underline">
              Cits e-pasts
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-md">
            <div>
              <h1 className="text-headline-md text-on-surface">Ienāc savā dārzā</h1>
              <p className="mt-1 text-body-md text-on-surface-variant">
                Ievadi e-pastu — atsūtīsim saiti, ar ko ielogoties. Bez parolēm.
              </p>
            </div>
            {linkFailed && (
              <p className="rounded-lg border border-secondary/30 bg-secondary-container/20 px-3 py-2 text-body-md text-secondary-fixed">
                Saite nederēja vai bija novecojusi. Pieprasi jaunu un atver to tajā pašā ierīcē.
              </p>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tavs@epasts.lv"
              autoComplete="email"
              className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-body-lg text-on-surface outline-none focus:border-primary/60"
            />
            {error && <p className="text-body-md text-error">{error}</p>}
            <Button icon="send" fullWidth disabled={busy}>
              {busy ? "Sūta…" : "Atsūtīt ielogošanās saiti"}
            </Button>
            <p className="text-label-sm text-on-surface-variant/70">
              Turpinot piekrīti, ka tavu dārza informāciju glabāsim, lai to sinhronizētu starp ierīcēm.
            </p>
          </form>
        )}
      </Card>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[28rem] py-lg">{children}</div>;
}

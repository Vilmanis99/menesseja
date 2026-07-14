"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import Link from "next/link";

/**
 * Contextual e-mail capture (Brevo). Placed at the end of articles — the moment
 * a "kāpēc mans augs...?" reader just got their answer — rather than as a
 * generic site-wide banner. `source` tags where the subscriber came from.
 */
export function NewsletterSignup({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "pending" | "already" | "error" | "invalid" | "not-configured">("idle");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        track("newsletter_view", { source });
        seen.disconnect();
      }
    }, { threshold: 0.4 });
    seen.observe(node);
    return () => seen.disconnect();
  }, [source]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "busy") return;
    setState("busy");
    track("newsletter_submit", { source });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source, website }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setState(data.status === "already-subscribed" ? "already" : "pending");
      } else {
        const err = await res.json().catch(() => ({}));
        setState(err.status === "invalid" ? "invalid" : err.status === "not-configured" ? "not-configured" : "error");
        track("newsletter_error", { source, reason: err.status ?? "server" });
      }
    } catch {
      setState("error");
      track("newsletter_error", { source, reason: "network" });
    }
  }

  if (state === "pending" || state === "already") {
    return (
      <div ref={rootRef}><Card tone="highest" elevated accent="primary" className="mt-lg flex items-start gap-sm p-md">
        <Icon name="mark_email_read" size="22px" className="mt-0.5 text-primary" />
        <div>
          <p className="font-semibold text-on-surface">{state === "pending" ? "Pārbaudi savu e-pastu" : "Šī adrese jau ir sarakstā"}</p>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {state === "pending"
              ? "Atver nosūtīto apstiprinājuma saiti. Tikai pēc tam adrese tiks pievienota un saņemsi sezonas ceļvedi."
              : "Nav nekas jādara — jaunumus sūtīsim tikai saskaņā ar izvēlēto pierakstu."}
          </p>
        </div>
      </Card></div>
    );
  }

  return (
    <div ref={rootRef}><Card tone="container" accent="primary" className="mt-lg p-sm sm:p-md">
      <div className="mb-sm flex items-start gap-sm">
        <Icon name="local_post_office" size="22px" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-on-surface">Sezonas ceļvedis tavam dārzam</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Pēc adreses apstiprināšanas saņemsi vienu īsu ceļvedi: ko tagad darīt Latvijas dārzā,
            kam pievērst uzmanību un kur kalendārā atrast nākamo piemēroto darbu.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-2">
        <label htmlFor={`newsletter-email-${source}`} className="block text-label-sm font-semibold text-on-surface">E-pasta adrese</label>
        <div className="flex flex-col gap-2 sm:flex-row">
        {/* Honeypot — hidden from humans, tempting for bots */}
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <input
          id={`newsletter-email-${source}`}
          type="email"
          required
          autoComplete="email"
          aria-describedby={`newsletter-help-${source}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error" || state === "not-configured") setState("idle");
          }}
          placeholder="tavs@epasts.lv"
          className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
        />
        <Button icon="send" disabled={state === "busy"}>
          {state === "busy" ? "Sūta…" : "Pierakstīties"}
        </Button>
        </div>
      </form>
      {state === "invalid" && (
        <p role="alert" className="mt-2 text-body-sm text-error">Lūdzu, pārbaudi e-pasta adresi.</p>
      )}
      {state === "error" && (
        <p role="alert" className="mt-2 text-body-sm text-error">Neizdevās pierakstīties — pamēģini vēlreiz pēc brīža.</p>
      )}
      {state === "not-configured" && (
        <p role="alert" className="mt-2 text-body-sm text-error">Pierakstīšanās pašlaik nav pieejama. Lūdzu, pamēģini vēlāk.</p>
      )}
      <p id={`newsletter-help-${source}`} className="mt-2 text-label-sm text-on-surface-variant/70">
        Piesakoties piekrīti saņemt Mēness Sējas sezonas ceļvedi. Adrese sarakstam tiks pievienota
        tikai pēc apstiprināšanas; atrakstīties varēsi jebkurā brīdī. <Link href="/privatums" className="text-primary hover:underline">Privātuma apraksts</Link>.
      </p>
    </Card></div>
  );
}

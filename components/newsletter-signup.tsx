"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

/**
 * Contextual e-mail capture (Brevo). Placed at the end of articles — the moment
 * a "kāpēc mans augs...?" reader just got their answer — rather than as a
 * generic site-wide banner. `source` tags where the subscriber came from.
 */
export function NewsletterSignup({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error" | "invalid">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setState("done");
        // GA4: count signups so we can see which articles convert.
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "newsletter_signup", { source });
      } else {
        const err = await res.json().catch(() => ({}));
        setState(err.error === "invalid" ? "invalid" : "error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <Card tone="highest" elevated accent="primary" className="mt-lg flex items-start gap-sm p-md">
        <Icon name="mark_email_read" size="22px" className="mt-0.5 text-primary" />
        <div>
          <p className="font-semibold text-on-surface">Paldies, esi sarakstā!</p>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Reizi nedēļā atsūtīsim, ko sēt, ko darīt dārzā un kuras ir labākās Mēness dienas.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card tone="highest" elevated linen accent="primary" className="mt-lg p-md">
      <div className="mb-sm flex items-start gap-sm">
        <Icon name="local_post_office" size="22px" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <h2 className="text-headline-md text-on-surface">Nedēļas padoms tavam dārzam</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Reizi nedēļā īss e-pasts: ko tieši tagad sēt un darīt Latvijas dārzā, kādas problēmas
            uzmanīt un labākās Mēness dienas. Bez surogāta — tikai sezonai aktuālais.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        {/* Honeypot — hidden from humans, tempting for bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error") setState("idle");
          }}
          placeholder="tavs@epasts.lv"
          className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
        />
        <Button icon="send" disabled={state === "busy"}>
          {state === "busy" ? "Sūta…" : "Pierakstīties"}
        </Button>
      </form>
      {state === "invalid" && (
        <p className="mt-2 text-body-sm text-error">Lūdzu, pārbaudi e-pasta adresi.</p>
      )}
      {state === "error" && (
        <p className="mt-2 text-body-sm text-error">Neizdevās pierakstīties — pamēģini vēlreiz pēc brīža.</p>
      )}
      <p className="mt-2 text-label-sm text-on-surface-variant/70">
        Piesakoties piekrīti saņemt Mēness Sējas e-pastus (apmēram reizi nedēļā). Atrakstīties vari
        jebkurā brīdī ar vienu klikšķi.
      </p>
    </Card>
  );
}

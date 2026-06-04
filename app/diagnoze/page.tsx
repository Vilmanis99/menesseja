"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useRegion } from "@/components/region-context";

interface Result {
  identification: string;
  problem: string;
  advice: string[];
  confidence: string;
}

const CONF_TONE: Record<string, string> = {
  augsta: "text-primary",
  vidēja: "text-tertiary",
  zema: "text-secondary",
};

export default function DiagnozePage() {
  const { region } = useRegion();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ data: string; type: string } | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setImageData({ data: url.split(",")[1], type: file.type });
    };
    reader.readAsDataURL(file);
  }

  async function analyse() {
    if (!imageData) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError("Nav interneta savienojuma — diagnostikai vajadzīgs tīkls. Foto saglabāts; mēģini vēlreiz tiešsaistē.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          image: imageData.data,
          mediaType: imageData.type,
          question,
          region: region.name,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.needsKey ? "AI vēl nav ieslēgts. Skati piezīmi zemāk." : json.error || "Kļūda");
        return;
      }
      setResult(json.result);
    } catch {
      setError("Neizdevās sazināties ar AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI palīgs"
        title="Augu diagnostika"
        display
        subtitle="Nofotografē augu vai kaiti, un AI palīdzēs noteikt, kas tas ir un ko darīt — ņemot vērā tavu reģionu."
      />

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        {/* Upload */}
        <Card tone="high" elevated className="flex flex-col gap-md p-md">
          <label className="relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-outline-variant/40 bg-background/40 transition-colors hover:border-primary/50">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Augs" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                <Icon name="add_a_photo" size="40px" className="text-primary" />
                <span className="text-body-md">Pieskaries, lai uzņemtu vai augšupielādētu foto</span>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
          </label>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Neobligāts jautājums (piem. kas par traipiem uz lapām?)"
            className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
          />

          <Button icon={loading ? "hourglass_top" : "auto_awesome"} fullWidth onClick={analyse} disabled={!imageData || loading}>
            {loading ? "Analizē…" : "Analizēt"}
          </Button>

          <p className="flex items-start gap-1.5 text-label-sm text-on-surface-variant/80">
            <Icon name="info" size="14px" className="mt-0.5 shrink-0 text-tertiary" />
            AI var kļūdīties — pārbaudi svarīgus padomus. Foto tiek nosūtīts apstrādei Anthropic
            (Claude AI, ASV); mēs to neglabājam.
          </p>
        </Card>

        {/* Result */}
        <Card tone="container" className="flex flex-col gap-sm p-md">
          {!result && !error && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-lg text-center text-on-surface-variant">
              <Icon name="psychology" size="40px" className="text-primary/40" />
              <p className="text-body-md">Rezultāts parādīsies šeit.</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-lg text-on-surface-variant">
              <Icon name="eco" size="40px" className="animate-pulse text-primary" />
              <p className="text-body-md">AI apskata tavu augu…</p>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary-container/20 p-sm">
              <Icon name="info" className="text-secondary" />
              <p className="text-body-md text-on-surface-variant">{error}</p>
            </div>
          )}
          {result && (
            <div className="space-y-md">
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Augs</p>
                <p className="text-headline-md text-on-surface">{result.identification || "Nezināms"}</p>
              </div>
              {result.problem && (
                <div>
                  <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Problēma</p>
                  <p className="text-body-md text-on-surface">{result.problem}</p>
                </div>
              )}
              {result.advice?.length > 0 && (
                <div>
                  <p className="mb-1 text-label-sm uppercase tracking-wide text-on-surface-variant">Ko darīt</p>
                  <ul className="space-y-2">
                    {result.advice.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-md text-on-surface">
                        <Icon name="check_circle" size="18px" className="mt-0.5 text-primary" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.confidence && (
                <p className={`text-label-sm ${CONF_TONE[result.confidence] ?? "text-on-surface-variant"}`}>
                  Pārliecība: {result.confidence}
                </p>
              )}
              <p className="border-t border-outline-variant/10 pt-sm text-label-sm text-on-surface-variant/70">
                AI padoms var kļūdīties — šaubu gadījumā konsultējies ar speciālistu.
              </p>
            </div>
          )}
        </Card>
      </div>

      <p className="mt-md text-label-sm text-on-surface-variant/70">
        Privātums: foto tiek nosūtīts Anthropic (Claude AI, ASV) analīzei un netiek glabāts mūsu serverī.
      </p>
    </>
  );
}

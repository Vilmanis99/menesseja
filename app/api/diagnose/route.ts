import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const SYSTEM = `Tu esi pieredzējis latviešu dārznieks un augu speciālists. Lietotājs atsūta dārza auga foto un, iespējams, jautājumu.
Atbildi LATVISKI. Esi konkrēts un praktisks Latvijas klimatam. Ja redzi kaiti vai slimību, paskaidro cēloni un dod dabīgus + ķīmiskus risinājumus.
Atbildi TIKAI ar derīgu JSON šādā formātā (bez koda blokiem):
{
 "identification": "kas tas par augu (vai 'nezināms')",
 "problem": "galvenā problēma vai 'izskatās vesels'",
 "advice": ["konkrēts solis 1", "solis 2", "solis 3"],
 "confidence": "augsta | vidēja | zema"
}`;

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "AI nav konfigurēts. Pievieno ANTHROPIC_API_KEY vides mainīgo.", needsKey: true },
      { status: 503 },
    );
  }

  let body: { image?: string; mediaType?: string; question?: string; region?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nederīgs pieprasījums" }, { status: 400 });
  }
  const { image, mediaType = "image/jpeg", question, region } = body;
  if (!image) return NextResponse.json({ error: "Nav attēla" }, { status: 400 });

  const userText =
    `Reģions: ${region ?? "nezināms"}.` +
    (question ? ` Lietotāja jautājums: ${question}` : " Diagnosticē augu un dod padomu.");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
              { type: "text", text: userText },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: `AI kļūda (${res.status})`, detail }, { status: 502 });
    }
    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "";
    // Try to parse the JSON the model was asked to return.
    try {
      const json = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
      return NextResponse.json({ result: json });
    } catch {
      return NextResponse.json({ result: { identification: "", problem: text, advice: [], confidence: "" } });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Nezināma kļūda" },
      { status: 502 },
    );
  }
}

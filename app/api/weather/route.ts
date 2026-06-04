import { NextRequest, NextResponse } from "next/server";
import { normalizeWeather, type OpenMeteoResponse } from "@/lib/weather";

const BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Proxy + normalize Open-Meteo so the client gets a small, stable shape and the
 * upstream response is cached server-side (1h). No API key required.
 * GET /api/weather?lat=56.95&lon=24.1
 */
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat un lon ir obligāti" }, { status: 400 });
  }

  const url =
    `${BASE}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,soil_temperature_6cm` +
    `&daily=temperature_2m_min,temperature_2m_max,weather_code` +
    `&timezone=Europe%2FRiga&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = (await res.json()) as OpenMeteoResponse;
    return NextResponse.json(normalizeWeather(data), {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Nezināma kļūda" },
      { status: 502 },
    );
  }
}

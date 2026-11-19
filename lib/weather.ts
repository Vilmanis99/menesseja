// ---- Open-Meteo raw shape (only the fields we request) ----
export interface OpenMeteoResponse {
  current: { time: string; temperature_2m: number; weather_code: number };
  hourly: {
    time: string[];
    temperature_2m?: (number | null)[] | null;
    soil_temperature_6cm?: (number | null)[] | null;
  };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
  };
}

export interface DailyForecast {
  date: string;
  min: number;
  max: number;
  code: number;
}

export interface Weather {
  airC: number;
  /** Modeled soil temperature at 6 cm for the current hour, if available. */
  soilC: number | null;
  code: number;
  /** Lowest available hourly air temperature over the next 18 hours. */
  minTonightC: number | null;
  daily: DailyForecast[];
}

/** Index of the current hour, or -1 if the hourly forecast omits it. */
function currentHourIndex(data: OpenMeteoResponse): number {
  const now = data.current.time.slice(0, 13); // YYYY-MM-DDTHH
  return data.hourly.time.findIndex((t) => t.slice(0, 13) === now);
}

function minNext18Hours(data: OpenMeteoResponse, fromIdx: number): number | null {
  if (fromIdx < 0) return null;
  const temps = data.hourly.temperature_2m
    ?.slice(fromIdx, fromIdx + 18)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return temps?.length ? Math.round(Math.min(...temps) * 10) / 10 : null;
}

export function normalizeWeather(data: OpenMeteoResponse): Weather {
  const idx = currentHourIndex(data);
  const soil = data.hourly.soil_temperature_6cm?.[idx];
  return {
    airC: Math.round(data.current.temperature_2m * 10) / 10,
    soilC: typeof soil === "number" && Number.isFinite(soil) ? Math.round(soil * 10) / 10 : null,
    code: data.current.weather_code,
    minTonightC: minNext18Hours(data, idx),
    daily: data.daily.time.map((date, i) => ({
      date,
      min: Math.round(data.daily.temperature_2m_min[i]),
      max: Math.round(data.daily.temperature_2m_max[i]),
      code: data.daily.weather_code[i],
    })),
  };
}

// ---- WMO weather-code → Latvian label + Material Symbol ----
export function weatherMeta(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Skaidrs", icon: "clear_day" };
  if (code <= 2) return { label: "Daļēji mākoņains", icon: "partly_cloudy_day" };
  if (code === 3) return { label: "Apmācies", icon: "cloud" };
  if (code <= 48) return { label: "Migla", icon: "foggy" };
  if (code <= 57) return { label: "Smidzina", icon: "rainy" };
  if (code <= 67) return { label: "Lietus", icon: "rainy" };
  if (code <= 77) return { label: "Sniegs", icon: "weather_snowy" };
  if (code <= 82) return { label: "Lietusgāzes", icon: "rainy" };
  if (code <= 86) return { label: "Sniegputenis", icon: "weather_snowy" };
  return { label: "Pērkona negaiss", icon: "thunderstorm" };
}

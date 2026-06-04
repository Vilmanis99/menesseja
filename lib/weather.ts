// ---- Open-Meteo raw shape (only the fields we request) ----
export interface OpenMeteoResponse {
  current: { time: string; temperature_2m: number; weather_code: number };
  hourly: { time: string[]; temperature_2m: number[]; soil_temperature_6cm: number[] };
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
  /** Soil temp at 6cm for the current hour */
  soilC: number;
  code: number;
  /** Tonight's forecast low (next daily min) */
  minTonightC: number;
  daily: DailyForecast[];
}

/** Index of the hourly reading at the current hour (0 if not found). */
function currentHourIndex(data: OpenMeteoResponse): number {
  const now = data.current.time.slice(0, 13); // YYYY-MM-DDTHH
  const idx = data.hourly.time.findIndex((t) => t.slice(0, 13) === now);
  return idx >= 0 ? idx : 0;
}

/** Lowest air temp over the next ~18 h — the actual coming-night low. */
function minNextNight(data: OpenMeteoResponse, fromIdx: number): number {
  const temps = data.hourly.temperature_2m.slice(fromIdx, fromIdx + 18);
  if (!temps.length) return data.daily.temperature_2m_min[0] ?? 0;
  return Math.round(Math.min(...temps) * 10) / 10;
}

export function normalizeWeather(data: OpenMeteoResponse): Weather {
  const idx = currentHourIndex(data);
  return {
    airC: Math.round(data.current.temperature_2m * 10) / 10,
    soilC: Math.round((data.hourly.soil_temperature_6cm[idx] ?? data.current.temperature_2m) * 10) / 10,
    code: data.current.weather_code,
    minTonightC: minNextNight(data, idx),
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

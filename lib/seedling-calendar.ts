interface SeedlingCalendarPlan {
  earliest: Date;
  latest: Date;
  transplant: string;
  name: string;
  planUrl: string;
}

const encoder = new TextEncoder();
const dateFormat = new Intl.DateTimeFormat("lv-LV", { timeZone: "UTC", dateStyle: "long" });

function escapeText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/\\/g, "\\\\").replace(/\r\n|[\r\n]/g, "\\n").replace(/[,;]/g, "\\$&");
}

// RFC 5545 §3.1 folds at 75 UTF-8 octets, including the continuation space.
function foldLine(line: string): string {
  const parts: string[] = [];
  let part = "";
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      parts.push(part);
      part = " ";
      bytes = 1;
    }
    part += character;
    bytes += size;
  }
  parts.push(part);
  return parts.join("\r\n");
}

function compactDay(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

// A compact, repeatable identifier even for long crop names with Unicode characters.
function nameKey(name: string): string {
  let hash = 0xcbf29ce484222325n;
  for (const byte of encoder.encode(name.normalize("NFC"))) {
    hash = BigInt.asUintN(64, (hash ^ BigInt(byte)) * 0x100000001b3n);
  }
  return hash.toString(16);
}

export function seedlingCalendarFile({ earliest, latest, transplant, name, planUrl }: SeedlingCalendarPlan, now = new Date()): string {
  const url = new URL(planUrl);
  if (!["https://www.menesseja.lv", "https://menesseja.lv"].includes(url.origin) || url.username || url.password) {
    throw new Error("Aprēķina saitei jāved uz menesseja.lv.");
  }
  const nextDay = new Date(latest);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const crop = name.trim();
  const title = crop ? "Plānotā sēja — " + crop : "Plānotā dēstu sēja";
  const transplantLabel = dateFormat.format(new Date(transplant + "T00:00:00Z"));
  const description = "Plānotais izstādīšanas datums — " + transplantLabel + "\nAtvērt sējas aprēķinu\n" + url.href;
  const uid = ["seja", compactDay(earliest), compactDay(latest), transplant, nameKey(crop)].join("-") + "@menesseja.lv";
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Menesseja.lv//Dēstu sēja//LV",
    "BEGIN:VEVENT", "UID:" + uid, "DTSTAMP:" + stamp,
    "DTSTART;VALUE=DATE:" + compactDay(earliest), "DTEND;VALUE=DATE:" + compactDay(nextDay),
    "SUMMARY:" + escapeText(title), "DESCRIPTION:" + escapeText(description),
    "URL:" + url.href, "TRANSP:TRANSPARENT",
    "END:VEVENT", "END:VCALENDAR",
  ].map(foldLine).join("\r\n") + "\r\n";
}

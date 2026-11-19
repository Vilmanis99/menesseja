import { latviaDateKey } from "@/lib/day-anchor";
import { formatHorizonTime, moonHorizonForDay } from "@/lib/moon-horizon";
import { getRegion, type RegionId } from "@/lib/regions";

const CITIES: RegionId[] = ["pieriga", "kurzeme", "zemgale", "vidzeme", "latgale"];
const dayFormat = new Intl.DateTimeFormat("lv-LV", { dateStyle: "long", timeZone: "Europe/Riga" });

function HorizonTimes({ events, empty }: { events: Date[]; empty: string }) {
  if (!events.length) return <span className="text-on-surface-variant">{empty}</span>;
  return events.map((event) => (
    <time key={event.toISOString()} dateTime={event.toISOString()} className="block tabular-nums">
      {formatHorizonTime(event)}
    </time>
  ));
}

export function MoonHorizonTable({ today }: { today: Date }) {
  const dateKey = latviaDateKey(today);
  return (
    <section id="meness-lekts-un-riets" aria-labelledby="lekta-rieta-virsraksts" className="mt-lg scroll-mt-24 rounded-xl border border-outline-variant/30 bg-surface-container p-md">
      <h2 id="lekta-rieta-virsraksts" className="text-headline-md text-on-surface">Mēness lēkts un riets šodien</h2>
      <table className="mt-xs w-full max-w-2xl text-left text-body-md text-on-surface">
        <caption className="pb-sm text-left text-on-surface-variant">
          <time dateTime={dateKey}>{dayFormat.format(today)}</time> · Latvijas laiks
        </caption>
        <thead className="text-label-md text-on-surface-variant">
          <tr><th scope="col" className="py-xs">Pilsēta</th><th scope="col">Mēness lec</th><th scope="col">Mēness riet</th></tr>
        </thead>
        <tbody>
          {CITIES.map((id) => {
            const { city, lat, lon } = getRegion(id);
            const { rises, sets } = moonHorizonForDay(dateKey, lat, lon);
            return (
              <tr key={id} className="border-t border-outline-variant/25">
                <th scope="row" className="py-sm pr-xs font-medium">{city}</th>
                <td className="py-xs pr-xs"><HorizonTimes events={rises} empty="Nelec" /></td>
                <td className="py-xs"><HorizonTimes events={sets} empty="Nenoriet" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-sm max-w-2xl text-label-md text-on-surface-variant">
        Laiki aprēķināti katrai pilsētai pie atklāta horizonta. Ēkas un pauguri var aizsegt Mēnesi.
        {" "}<a href="https://aa.usno.navy.mil/faq/RST_defs" className="text-primary underline underline-offset-2">Kā nosaka lēktu un rietu</a>
      </p>
    </section>
  );
}

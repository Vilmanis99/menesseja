import { Fragment } from "react";
import { latviaDateKey } from "@/lib/day-anchor";
import { formatHorizonTime } from "@/lib/moon-horizon";
import { getRegion, type RegionId } from "@/lib/regions";
import { winterDaylight, winterDaylightDates } from "@/lib/winter-daylight";

const cities: RegionId[] = ["pieriga", "kurzeme", "latgale"];
const shortDate = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "short", timeZone: "Europe/Riga" });

function duration(ms: number) {
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} st. ${minutes % 60} min.` : `${minutes} min.`;
}

export function WinterDaylight({ year, month }: { year: number; month: 1 | 12 }) {
  const dates = winterDaylightDates(year, month);
  return (
    <section aria-labelledby="dienas-garums" className="mb-lg rounded-xl border border-outline-variant/30 bg-surface-container p-sm sm:p-md print:hidden">
      <h2 id="dienas-garums" tabIndex={-1} className="scroll-mt-24 text-headline-md text-on-surface">Cik gara ir diena?</h2>
      <fieldset className="mt-xs min-w-0">
        <legend className="mb-xs text-label-md text-on-surface-variant">Izvēlies pilsētu</legend>
        <div className="flex flex-wrap gap-2">
          {cities.map((id, index) => {
            const { city } = getRegion(id);
            const rows = dates.map((day) => winterDaylight(year, month, day, id));
            const baseline = month === 12 ? rows[1] : rows[0];
            const gain = rows[2].durationMs - baseline.durationMs;
            return (
              <Fragment key={id}>
                <input type="radio" name="saules-pilseta" id={`saule-${id}`} defaultChecked={index === 0} aria-controls={`gaisma-${id}`}
                  className="sr-only [&:checked+label]:border-primary [&:checked+label]:bg-primary-container [&:checked+label]:text-on-primary-container [&:checked+label+div]:block [&:focus-visible+label]:outline-2 [&:focus-visible+label]:outline-primary" />
                <label htmlFor={`saule-${id}`} className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-outline-variant/40 px-3 text-label-md text-on-surface">{city}</label>
                <div id={`gaisma-${id}`} className="order-last hidden w-full">
                  <table className="w-full text-left text-body-md tabular-nums text-on-surface">
                    <caption className="sr-only">{city}, {year}. gada {month === 12 ? "decembris" : "janvāris"}</caption>
                    <thead className="text-label-sm text-on-surface-variant">
                      <tr><th scope="col" className="py-xs">Datums</th><th scope="col">Lēkts–riets</th><th scope="col" className="text-right">Dienas garums</th></tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.day} className="border-t border-outline-variant/30">
                          <th scope="row" className="py-xs pr-1 font-medium">
                            <time dateTime={latviaDateKey(row.rise)}>{shortDate.format(row.rise)}</time>
                            {month === 12 && row.day === dates[1] && <span className="block text-label-sm text-on-surface-variant">Saulgrieži</span>}
                          </th>
                          <td className="whitespace-nowrap"><time dateTime={row.rise.toISOString()}>{formatHorizonTime(row.rise)}</time>–<time dateTime={row.set.toISOString()}>{formatHorizonTime(row.set)}</time></td>
                          <td className="text-right">{duration(row.durationMs)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-xs text-body-md text-on-surface">No {baseline.day}. līdz 31. {month === 12 ? "decembrim" : "janvārim"} diena kļūst garāka par <strong className="whitespace-nowrap">{duration(gain)}</strong></p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </fieldset>
      <p className="mt-sm text-label-md text-on-surface-variant">
        Lēkta un rieta laiki aprēķināti atklātam horizontam un norādīti pēc Latvijas laika. Laikus un dienas garumu noapaļojam atsevišķi līdz minūtei.{" "}
        <a href="https://aa.usno.navy.mil/faq/RST_defs" className="text-primary underline underline-offset-2">Kā nosaka saullēktu un saulrietu</a>
      </p>
    </section>
  );
}

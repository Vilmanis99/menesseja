import Image from "next/image";

// Zenodo record 3982086, BBCH61, both quality flags false. Columns: Ukri, Ranka.
const records = [
  ["2003-03-15", "2003-03-29"],
  ["2004-03-15", "2004-03-17"],
  ["2005-03-25", "2005-03-27"],
  ["2006-03-29", "2006-04-04"],
  ["2007-03-06", "2007-03-12"],
  ["2008-02-06", "2008-02-22"],
  ["2009-03-06", "2009-03-30"],
  ["2010-03-24", "2010-03-27"],
  ["2011-03-13", "2011-03-24"],
  ["2012-03-15", "2012-03-17"],
  ["2013-03-12", "2013-04-12"],
  ["2014-02-09", "2014-03-03"],
  ["2015-02-24", "2015-03-09"],
  ["2016-02-24", "2016-03-25"],
  ["2017-02-14", "2017-03-04"],
  ["2018-03-13", "2018-04-05"],
] as const;

const anchor = "kad-zied-latvija";
export const snowdropFloweringLink = "/pukes/sniegpulkstenites#" + anchor;

const rows = records.map(([ukri, ranka]) => ({
  ukri, ranka, year: ukri.slice(0, 4), days: (Date.parse(ranka) - Date.parse(ukri)) / 86400000,
}));
const intervals = rows.map((row) => row.days).sort((a, b) => a - b);
const middle = Math.floor(intervals.length / 2);
const median = (intervals[Math.floor((intervals.length - 1) / 2)] + intervals[middle]) / 2;
const dateFormat = new Intl.DateTimeFormat("lv-LV", { day: "2-digit", month: "2-digit", timeZone: "UTC" });

export function SnowdropFlowering() {
  return (
    <section id={anchor} aria-labelledby="snowdrop-flowering-title" className="mb-lg scroll-mt-24 rounded-xl border border-primary/35 bg-surface-container-low p-sm sm:p-md">
      <h2 id="snowdrop-flowering-title" className="text-headline-md text-on-surface">Kad zied Latvijā? Sniegpulkstenītes Ukros un Rankā</h2>
      <p className="mt-sm text-body-lg text-on-surface">Visos {rows.length} novērojumu gados no {rows[0].year}. līdz {rows[rows.length - 1].year}. gadam Ukros agrāk nekā Rankā reģistrēts ziedēšanas sākums. Starpība bija no {intervals[0]} līdz {intervals[intervals.length - 1]} dienai. Mediāna bija <strong>{median.toLocaleString("lv-LV")} dienas</strong>.</p>
      <p className="mt-2 text-body-md text-on-surface-variant">2013. gadā pirmo ziedēšanu Ukros novēroja 12. martā, Rankā 12. aprīlī. Šie vēsturiskie datumi raksturo abas novērojumu vietas. Citā pavasarī vai citā dārzā ziedēšana var sākties citā laikā.</p>
      <figure className="mx-auto my-sm w-full max-w-[24rem]">
        <Image src="/images/flowers/sniegpulkstenites-ukri-ranka.webp" width={918} height={1050} unoptimized
          alt="Ziedēšanas sākuma datumi no februāra līdz aprīlim. Katrā rindā Ukru aplis atrodas pa kreisi no Rankas romba. Visu 16 gadu datumi pieejami tabulā zem diagrammas."
          className="block h-auto w-full rounded-lg" />
        <figcaption className="mt-2 text-body-sm text-on-surface-variant">Viena rinda atbilst vienam gadam. Aplis apzīmē Ukrus, rombs apzīmē Ranku.</figcaption>
      </figure>
      <details className="mt-sm border-y border-outline-variant/40">
        <summary className="min-h-11 cursor-pointer py-3 text-label-md text-primary">Aplūkot visu 16 gadu ziedēšanas datumus</summary>
        <table className="mb-sm w-full border-collapse text-left text-body-sm tabular-nums text-on-surface">
          <caption className="mb-2 text-left text-body-sm text-on-surface-variant">Kad katrā vietā pirmoreiz reģistrēts ziedēšanas sākums. Datumi norādīti kā diena un mēnesis.</caption>
          <thead><tr className="border-b border-outline-variant/60">
            <th scope="col" className="py-2 pr-1">Gads</th><th scope="col" className="px-1">Ukri</th><th scope="col" className="px-1">Ranka</th><th scope="col" className="pl-1 text-right">Starpība dienās</th>
          </tr></thead>
          <tbody>{rows.map(({ year, ukri, ranka, days }) => <tr key={year} className="border-b border-outline-variant/25">
            <th scope="row" className="py-1.5 pr-1 font-semibold">{year}</th>
            <td className="px-1"><time dateTime={ukri}>{dateFormat.format(new Date(ukri))}</time></td>
            <td className="px-1"><time dateTime={ranka}>{dateFormat.format(new Date(ranka))}</time></td>
            <td className="pl-1 text-right">{days}</td>
          </tr>)}</tbody>
        </table>
      </details>
      <p className="mt-sm text-body-sm text-on-surface-variant">Guntas Kalvānes, Anda Kalvāna un Andra Ģērmaņa 2020. gada datu kopā Mēness Sēja atlasīja sniegbaltās sniegpulkstenītes (<i lang="la">Galanthus nivalis</i>) ziedēšanas sākuma ierakstus (BBCH61). Ukros un Rankā ir divas garākās šīs sugas novērojumu rindas. Katrā gadā un vietā ir viens ieraksts. Atlasē iekļauti datumi bez atzīmes par neticamu datumu vai sajauktu fāžu secību. Diagrammā datumi sakārtoti pēc mēneša un dienas. Tabulā starpība aprēķināta no attiecīgā gada datumiem.</p>
      <ul className="mt-1 flex flex-wrap gap-x-4 text-body-sm text-primary">
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-2" href="https://doi.org/10.5281/zenodo.3982086">Sākotnējie dati Zenodo</a></li>
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-2" href="https://essd.copernicus.org/articles/13/4621/2021/">Pētnieku metodika</a></li>
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-2" href="https://creativecommons.org/licenses/by/4.0/">Datu licence CC BY 4.0</a></li>
      </ul>
    </section>
  );
}

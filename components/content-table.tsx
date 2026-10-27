/** Compact comparisons become labelled cards on narrow screens. */
export function ContentTable({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="my-md">
      <div className="space-y-sm sm:hidden">
        {table.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="rounded-xl border border-outline-variant/25 bg-surface-container p-sm shadow-md shadow-black/5">
            <p className="text-body-lg font-semibold leading-snug text-on-surface">{row[0]}</p>
            <dl className="mt-sm space-y-2">
              {row.slice(1).map((cell, cellIndex) => (
                <div key={cellIndex}>
                  <dt className="text-label-sm uppercase tracking-wide text-primary">{table.headers[cellIndex + 1]}</dt>
                  <dd className="text-body-md leading-relaxed text-on-surface-variant">{cell}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <table className="hidden w-full border-collapse overflow-hidden rounded-xl border border-outline-variant/25 text-left text-body-md sm:table">
        <thead className="bg-surface-container-high">
          <tr>{table.headers.map((header) => <th key={header} scope="col" className="border-b border-outline-variant/20 px-sm py-2 font-semibold text-on-surface">{header}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-outline-variant/10 last:border-0">
              <th scope="row" className="px-sm py-2 align-top font-semibold text-on-surface">{row[0]}</th>
              {row.slice(1).map((cell, cellIndex) => <td key={cellIndex} className="px-sm py-2 align-top text-on-surface-variant">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

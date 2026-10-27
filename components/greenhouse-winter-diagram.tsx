const checks = [
  ["Jumts", "Atrodi sava modeļa sniega slodzes un tīrīšanas norādes."],
  ["Segums un stiprinājumi", "Salabo bojātās vietas un pārbaudi savienojumus ar pamatni."],
  ["Logi un durvis", "Pārbaudi aizvēršanu; automātiku sagatavo pēc tās instrukcijas."],
  ["Ūdens sistēma", "Atslēdz padevi, iztukšo un pasargā sala jutīgās detaļas."],
  ["Dobes un aprīkojums", "Iznes atliekas, nomazgā traukus un ļauj tiem nožūt."],
  ["Notekas un apkārtne", "Izvāc lapas un priekšmetus, ko vējš var nest pret segumu."],
];

/** Original schematic: numbered locations link the structure to a readable checklist. */
export function GreenhouseWinterDiagram() {
  return (
    <figure className="my-md rounded-xl border border-outline-variant/30 bg-surface-container p-sm sm:p-md">
      <p className="mb-sm text-label-md uppercase tracking-wide text-primary">Sešas vietas rudens apskatei</p>
      <svg viewBox="0 0 640 340" role="img" aria-labelledby="greenhouse-winter-title greenhouse-winter-desc" className="w-full rounded-lg bg-[#edf0e6]">
        <title id="greenhouse-winter-title">Siltumnīcas apskates shēma pirms ziemas</title>
        <desc id="greenhouse-winter-desc">Numuri norāda uz jumtu, karkasu, durvīm, laistīšanu, dobēm un noteku. Katras vietas pārbaude aprakstīta zem shēmas. Shēma nav būvniecības vai jumta balstīšanas instrukcija.</desc>
        <ellipse cx="327" cy="281" rx="262" ry="38" fill="#dce3d2" />
        <g stroke="#4b6550" strokeWidth="4" strokeLinejoin="round">
          <path d="M242 157 L475 104 L475 228 L242 285Z" fill="#d1e1db" />
          <path d="M133 153 L242 157 L242 285 L133 260Z" fill="#e9f1eb" />
          <path d="M133 153 L190 85 L242 157Z" fill="#e9f1eb" />
          <path d="M190 85 L422 37 L475 104 L242 157Z" fill="#dceae5" />
          <path d="M133 153 L365 103 L422 37" fill="none" />
          <path d="M210 111 L443 63 M324 139 L324 265 M402 121 L402 247 M270 69 L324 139 M348 52 L402 121" fill="none" strokeWidth="3" />
          <path d="M154 163 L215 167 L215 279 L154 265Z" fill="#f0f4ec" />
          <path d="M184 164 L184 272 M154 204 L215 210" fill="none" strokeWidth="2" />
          <path d="M238 164 L480 108 L482 246" fill="none" stroke="#778575" strokeWidth="6" />
        </g>
        <g fill="#ac916d" stroke="#81694c" strokeWidth="2">
          <path d="M263 244 L441 203 L457 216 L278 260Z" />
          <path d="M284 225 L428 191 L439 199 L297 234Z" />
        </g>
        <path d="M275 251 L449 209" stroke="#416b43" strokeWidth="3" strokeDasharray="5 5" />
        <path d="M276 251 Q265 293 299 291 Q329 286 309 277" fill="none" stroke="#416b43" strokeWidth="5" strokeLinecap="round" />
        <g stroke="#485341" strokeWidth="2" fill="none">
          <path d="M310 81 L294 36" /><path d="M405 240 L448 282" /><path d="M183 222 L100 213" />
          <path d="M297 283 L337 309" /><path d="M360 224 L362 182" /><path d="M481 192 L527 167" />
        </g>
        <g fontFamily="sans-serif" fontSize="20" fontWeight="700" textAnchor="middle" fill="#fff">
          {[[1, 290, 24], [2, 462, 295], [3, 82, 213], [4, 351, 317], [5, 362, 164], [6, 544, 159]].map(([n, x, y]) => (
            <g key={n}><circle cx={x} cy={y} r="17" fill="#365d3d" /><text x={x} y={y + 7}>{n}</text></g>
          ))}
        </g>
      </svg>
      <figcaption>
        <ol className="mt-md grid gap-sm sm:grid-cols-2">
          {checks.map(([title, description], index) => (
            <li key={title} className="flex items-start gap-2 text-body-md leading-relaxed text-on-surface-variant">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-label-md text-on-primary">{index + 1}</span>
              <span><strong className="text-on-surface">{title}.</strong> {description}</span>
            </li>
          ))}
        </ol>
        <p className="mt-md border-t border-outline-variant/20 pt-sm text-body-md text-on-surface-variant">Orientējoša apskates shēma. Jumta slodzi, balstu nepieciešamību un seguma noņemšanu nosaka konkrētās siltumnīcas instrukcija.</p>
      </figcaption>
    </figure>
  );
}

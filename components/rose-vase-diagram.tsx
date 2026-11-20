/** Original editorial illustration. The care guidance is supported by the rose guide's sources. */
export function RoseVaseDiagram() {
  return (
    <figure id="rozes-vaze-udenslimenis" className="my-md min-w-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-[#edf0e6]">
      <svg viewBox="0 0 300 264" role="img" aria-labelledby="rose-vase-title rose-vase-description"
        className="mx-auto block h-auto w-full max-w-[28rem]">
        <title id="rose-vase-title">Rozes kāts caurspīdīgā vāzē</title>
        <desc id="rose-vase-description">Rozes augšējās lapas paliek virs vāzes malas. Ūdens virsma ir atzīmēta ar zilu līniju. Zem tās ūdenī redzams tikai kāts.</desc>

        <ellipse cx="99" cy="249" rx="55" ry="5" fill="#d6dfd3" />
        <path d="M49 137 Q100 128 151 137 L140 240 Q140 249 100 249 Q60 249 60 240 Z" fill="#ffffff" fillOpacity=".46" />
        <path d="M53 170 Q100 163 147 170 L139 240 Q138 247 100 247 Q62 247 61 240 Z" fill="#b0d9df" />
        <ellipse cx="100" cy="170" rx="47" ry="4" fill="#c6e7e8" stroke="#367681" strokeWidth="1.6" />

        <path d="M93 59 C99 83 104 116 99 147 Q93 193 85 230 L88 232 Q96 198 103 148 C108 116 103 84 97 59 Z" fill="#547549" stroke="#36593d" strokeWidth="1.3" />
        <path d="M103 118 Q86 111 63 91 M101 99 Q120 91 134 72" fill="none" stroke="#436743" strokeWidth="2.3" strokeLinecap="round" />
        <g fill="#608051" stroke="#3a5c39" strokeWidth="1.1" strokeLinejoin="round">
          <path d="M70 98 Q54 98 47 91 L50 91 L44 86 L46 86 L40 77 L49 79 L49 77 L58 82 L58 80 Q69 86 70 98 Z" />
          <path d="M84 109 Q69 114 56 105 L60 104 L55 101 Q69 98 84 109 Z" />
          <path d="M84 108 Q75 93 80 82 Q91 94 84 108 Z" />
          <path d="M128 81 Q126 68 137 61 L137 64 L145 59 L144 63 L153 60 L149 69 L151 68 L144 77 L145 78 Q137 84 128 81 Z" />
          <path d="M118 89 Q111 79 114 68 Q126 78 118 89 Z" />
          <path d="M120 88 Q132 83 145 88 L141 91 L143 92 Q130 97 120 88 Z" />
        </g>
        <path d="M45 81 L69 97 M131 79 L149 63" fill="none" stroke="#b1bb83" strokeWidth="1.2" />

        <path d="M97 64 Q91 65 84 57 L75 53 L80 53 L73 45 L91 53 L108 44 L112 46 L101 59 Z" fill="#557a4e" stroke="#395f42" strokeWidth="1.3" />
        <g stroke="#8d3d50" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M93 58 C82 58 74 52 70 45 Q60 38 63 29 Q64 24 71 26 Q69 18 76 15 Q82 11 88 16 Q93 9 101 14 Q109 11 113 20 Q122 20 123 27 Q129 33 122 42 Q120 50 110 52 Q103 59 93 58 Z" fill="#cc7882" />
          <path d="M66 29 Q78 23 88 29 Q85 16 96 16 Q107 15 112 23 Q103 20 99 25 Q109 24 116 29 Q108 30 103 38 Q86 40 74 34 Z" fill="#e7a0a6" />
          <path d="M79 28 Q86 21 96 23 Q103 26 101 31 Q95 34 92 39 Q84 35 79 28 Z" fill="#bc626f" />
          <path d="M85 27 Q91 24 97 28 Q93 28 90 31 Z" fill="#f1b6b7" />
          <path d="M65 30 Q79 29 91 41 Q98 48 109 49 Q101 59 91 56 Q74 53 70 45 Z" fill="#da858e" />
          <path d="M91 42 Q102 34 110 33 Q118 32 123 27 Q125 38 118 46 Q106 53 96 48 Z" fill="#e89da4" />
        </g>

        <g fill="none" stroke="#5c7475" strokeWidth="1.8">
          <ellipse cx="100" cy="137" rx="51" ry="4.5" />
          <path d="M49 137 L60 240 Q61 249 100 249 Q139 249 140 240 L151 137" />
        </g>
        <path d="M58 179 L65 230" stroke="#fff" strokeOpacity=".8" strokeWidth="2" strokeLinecap="round" />

        <g fill="none" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M145 78 L157 74 H172" stroke="#537451" />
          <path d="M144 170 H172" stroke="#367681" />
          <path d="M92 209 L123 219 H172" stroke="#537451" />
        </g>
        <g fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="600" fill="#243c32">
          <text x="178" y="73">Atstāj lapas<tspan x="178" dy="20">virs ūdens</tspan></text>
          <text x="178" y="175" fill="#245c65">Ūdenslīnija</text>
          <text x="178" y="217">Kāts bez<tspan x="178" dy="20">lapām</tspan></text>
        </g>
      </svg>
    </figure>
  );
}

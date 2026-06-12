import Link from "next/link";

const LINKS = [
  { href: "/macies", label: "Kas ir Mēness sēja?" },
  { href: "/raksti", label: "Raksti" },
  { href: "/augi", label: "Augu enciklopēdija" },
  { href: "/pukes", label: "Puķes" },
  { href: "/kaitekli", label: "Kaitēkļi un slimības" },
  { href: "/topi", label: "Dārza topi" },
  { href: "/receptes", label: "Mēslojuma receptes" },
  { href: "/ko-set", label: "Ko sēt pa mēnešiem" },
  { href: "/regioni", label: "Reģioni" },
  { href: "/iesutit", label: "Iesūti gudrību" },
  { href: "/par", label: "Par mums" },
];

/** Slim trust footer shown under content on every page (good for SEO + honesty). */
export function SiteFooter() {
  return (
    <footer className="mt-xl border-t border-outline-variant/10 pt-md pb-md text-on-surface-variant print:hidden">
      <div className="flex flex-wrap gap-x-md gap-y-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-label-md hover:text-primary">
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-sm max-w-2xl text-label-sm leading-relaxed text-on-surface-variant/70">
        Mēness Sēja apvieno Mēness ritmu, latviešu senču gudrību un reālus datus. Mēness sēja ir
        tradīcija, ne garantija — laikapstākļi un augsnes temperatūra ir svarīgāki. Laikapstākļi:{" "}
        <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          Open-Meteo
        </a>
        .
      </p>
    </footer>
  );
}

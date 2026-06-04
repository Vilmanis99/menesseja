import Link from "next/link";
import { MoonPhase } from "@/components/moon-phase";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  const links = [
    { href: "/", label: "Sākums", icon: "nature_people" },
    { href: "/kalendars", label: "Mēness kalendārs", icon: "calendar_month" },
    { href: "/augi", label: "Augu enciklopēdija", icon: "eco" },
    { href: "/raksti", label: "Raksti", icon: "article" },
  ];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-md py-xl text-center">
      <MoonPhase phase={0.5} size={96} />
      <h1 className="text-headline-lg text-primary">Lapa nav atrasta</h1>
      <p className="text-body-lg text-on-surface-variant">
        Šī lapa ir aizgājusi aiz mākoņa. Atgriezies dārzā vai izpēti kalendāru.
      </p>
      <div className="mt-sm grid grid-cols-2 gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container px-md py-sm text-body-md text-on-surface transition-colors hover:border-primary/40"
          >
            <Icon name={l.icon} size="20px" className="text-primary" />
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

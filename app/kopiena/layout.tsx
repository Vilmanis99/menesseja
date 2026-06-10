import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dārznieku kopiena — novērojumi un tautas gudrības",
  description:
    "Latvijas dārznieku kopiena: dalies ar novērojumiem no sava reģiona, uzdod jautājumus un lasi tradicionālās dārza gudrības.",
  alternates: { canonical: canonical("/kopiena") },
};

export default function KopienaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

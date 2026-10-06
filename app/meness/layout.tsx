import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mēness fāze šodien — augošs vai dilstošs Mēness",
  description:
    "Kāds Mēness ir šodien — augošs vai dilstošs? Šodienas fāze, apgaismojums un tuvākā jaunā Mēness un pilnmēness datumi un laiki Latvijā.",
  alternates: { canonical: canonical("/meness") },
};

export default function MenessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

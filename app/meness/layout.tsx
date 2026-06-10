import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mēness fāze šodien — augošs vai dilstošs Mēness",
  description:
    "Kāda Mēness fāze ir šodien un tuvākajās dienās: jauns Mēness, pilnmēness, augošs un dilstošs — un ko tas nozīmē dārza darbiem.",
  alternates: { canonical: canonical("/meness") },
};

export default function MenessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

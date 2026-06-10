import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dārza plānotājs — izvieto dobes un kaimiņaugus",
  description:
    "Interaktīvs dobju plānotājs: izvieto augus režģī, redzi labos un sliktos kaimiņaugus un saglabā sava dārza plānu.",
  alternates: { canonical: canonical("/planotajs") },
};

export default function PlanotajsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

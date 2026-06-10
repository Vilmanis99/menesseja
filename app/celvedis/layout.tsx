import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sējas ceļvedis — kad sēt, stādīt un novākt katru augu",
  description:
    "Meklē un filtrē visus augus pēc kategorijas, mēneša un grūtības: sējas logi Latvijai, Mēness dienas un augsnes temperatūras katrai kultūrai.",
  alternates: { canonical: canonical("/celvedis") },
};

export default function CelvedisLayout({ children }: { children: React.ReactNode }) {
  return children;
}

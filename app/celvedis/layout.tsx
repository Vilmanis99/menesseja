import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sējas ceļvedis — kad sēt, stādīt un novākt katru augu",
  description:
    "Ko šomēnes sēt un stādīt Latvijā? Filtrē augus pēc mēneša, darbības un kategorijas. Sēja, stādīšana, ražas novākšana un ziedēšana ir nošķirta.",
  alternates: { canonical: canonical("/celvedis") },
};

export default function CelvedisLayout({ children }: { children: React.ReactNode }) {
  return children;
}

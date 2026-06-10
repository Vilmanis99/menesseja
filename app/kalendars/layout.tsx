import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

// The hub page is a client component, so its metadata lives here.
// Child month pages (/kalendars/[year]/[month]) define their own and override this.
export const metadata: Metadata = {
  title: "Mēness sējas kalendārs — labākās dienas sēšanai un stādīšanai",
  description:
    "Interaktīvs Mēness sējas kalendārs Latvijai: Mēness fāzes, elementu dienas (sakņu, lapu, ziedu, augļu) un ieteikumi, ko sēt katrā dienā.",
  alternates: { canonical: canonical("/kalendars") },
};

export default function KalendarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

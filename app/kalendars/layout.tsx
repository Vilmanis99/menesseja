import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

// Child month pages (/kalendars/[year]/[month]) override these hub defaults.
export const metadata: Metadata = {
  title: "Mēness sējas kalendārs — labākās dienas sēšanai un stādīšanai",
  description:
    "Mēness sējas kalendārs Latvijai: jauna un pilna Mēness datumi Latvijas laikā, sakņu, lapu, ziedu un augļu dienas, ko sēt un stādīt katrā mēnesī.",
  alternates: { canonical: canonical("/kalendars") },
};

export default function KalendarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

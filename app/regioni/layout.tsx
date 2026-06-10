import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

// Region detail pages (/regioni/[region]) define their own metadata and override this.
export const metadata: Metadata = {
  title: "Latvijas reģionu dārza klimats — salnas, sezona, mikroklimats",
  description:
    "Kurzeme, Vidzeme, Zemgale, Latgale un Pierīga: pēdējās salnas datumi, augšanas sezona un dārza ieteikumi katram Latvijas reģionam.",
  alternates: { canonical: canonical("/regioni") },
};

export default function RegioniLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { canonical, og } from "@/lib/seo";

const title = "Mēness fāze šodien — augošs vai dilstošs Mēness";
const description = "Kāds Mēness ir šodien — augošs vai dilstošs? Šodienas fāze un apgaismojums, tuvākais pilnmēness un jaunmēness, kā arī Mēness lēkta un rieta laiki piecās Latvijas pilsētās.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: og({ path: "/meness", title, description, type: "website" }),
  alternates: { canonical: canonical("/meness") },
};

export default function MenessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

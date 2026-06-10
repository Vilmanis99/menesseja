import type { Metadata } from "next";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Iesūti senču gudrību — receptes, ticējumi un paražas",
  description:
    "Zini vecmāmiņas dārza recepti vai ticējumu? Iesūti to Mēness Sējas krātuvei — kopā digitalizējam latviešu senču dārza gudrību.",
  alternates: { canonical: canonical("/iesutit") },
};

export default function IesutitLayout({ children }: { children: React.ReactNode }) {
  return children;
}

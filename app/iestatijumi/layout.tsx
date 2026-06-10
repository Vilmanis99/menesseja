import type { Metadata } from "next";

// Settings — not meant for search engines.
export const metadata: Metadata = {
  title: "Iestatījumi",
  robots: { index: false, follow: false },
};

export default function IestatijumiLayout({ children }: { children: React.ReactNode }) {
  return children;
}

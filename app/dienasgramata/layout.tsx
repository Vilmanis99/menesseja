import type { Metadata } from "next";

// Personal journal — not meant for search engines.
export const metadata: Metadata = {
  title: "Dārza dienasgrāmata",
  robots: { index: false, follow: false },
};

export default function DienasgramataLayout({ children }: { children: React.ReactNode }) {
  return children;
}

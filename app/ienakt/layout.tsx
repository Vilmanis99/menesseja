import type { Metadata } from "next";

// Login page — not meant for search engines.
export const metadata: Metadata = {
  title: "Ienākt",
  robots: { index: false, follow: false },
};

export default function IenaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}

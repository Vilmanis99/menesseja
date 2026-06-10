import type { Metadata } from "next";

// Hidden until the AI key is configured — keep out of search indexes.
export const metadata: Metadata = {
  title: "Foto diagnostika",
  robots: { index: false, follow: false },
};

export default function DiagnozeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

// Keep the admin panel out of search engines. It is also absent from the nav and
// the sitemap; the ADMIN_KEY (verified server-side) is what actually gates data.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

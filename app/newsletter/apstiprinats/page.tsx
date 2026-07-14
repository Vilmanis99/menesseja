import type { Metadata } from "next";
import { NewsletterConfirmed } from "@/components/newsletter-confirmed";

export const metadata: Metadata = {
  title: "E-pasts apstiprināts",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return <div className="py-xl"><NewsletterConfirmed /></div>;
}

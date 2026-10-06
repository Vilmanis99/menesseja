import type { Metadata } from "next";
import { NewsletterConfirmed } from "@/components/newsletter-confirmed";
import { latviaDateParts } from "@/lib/day-anchor";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "E-pasts apstiprināts",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return <div className="py-xl"><NewsletterConfirmed month={latviaDateParts().month} /></div>;
}

"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export function TrackedLink({ href, source, placement, children, className }: {
  href: string;
  source: string;
  placement: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <Link href={href} className={className} onClick={() => track("internal_cta_click", { source, destination: href, placement })}>{children}</Link>;
}

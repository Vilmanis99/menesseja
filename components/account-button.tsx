"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/components/auth-context";

/** Account entry point. Hidden entirely until a backend is connected, so the
 *  current guest-only experience is unchanged before Supabase is live. */
export function AccountButton({ variant = "bar" }: { variant?: "bar" | "side" }) {
  const { enabled, loading, user, profile } = useAuth();
  if (!enabled) return null;

  const initial = (profile?.display_name || user?.email || "?").charAt(0).toUpperCase();

  if (variant === "side") {
    return (
      <Link
        href="/ienakt"
        className="flex items-center gap-sm rounded-lg px-sm py-sm text-on-surface-variant transition-all hover:bg-surface-variant/50"
      >
        {user ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-on-primary">
            {initial}
          </span>
        ) : (
          <Icon name="account_circle" />
        )}
        <span className="text-body-md">{user ? profile?.display_name || "Mans konts" : "Ienākt"}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/ienakt"
      aria-label={user ? "Mans konts" : "Ienākt"}
      className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-variant/50"
    >
      {user && !loading ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-on-primary">
          {initial}
        </span>
      ) : (
        <Icon name="account_circle" />
      )}
    </Link>
  );
}

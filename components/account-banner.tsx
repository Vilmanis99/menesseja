"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/components/auth-context";

/** Visible logged-in / sign-in state on the dashboard. Hidden until a backend
 *  is connected, so guest mode looks exactly as before. */
export function AccountBanner() {
  const { enabled, loading, user, profile, signOut } = useAuth();
  if (!enabled || loading) return null;

  if (user) {
    const name = profile?.display_name || user.email?.split("@")[0] || "dārzniek";
    const initial = name.charAt(0).toUpperCase();
    return (
      <Card tone="container" className="mb-md flex items-center gap-sm p-sm">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-body-md font-bold text-on-primary">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-md font-semibold text-on-surface">Sveiks, {name}!</p>
          <p className="truncate text-label-sm text-on-surface-variant">
            Esi ielogojies — dārzs sinhronizēsies starp ierīcēm.
          </p>
        </div>
        <button
          onClick={signOut}
          className="shrink-0 rounded-lg px-2 py-1 text-label-md text-on-surface-variant transition-colors hover:text-error"
        >
          Iziet
        </button>
      </Card>
    );
  }

  return (
    <Link href="/ienakt" className="mb-md block">
      <Card tone="container" className="flex items-center gap-sm p-sm transition-colors hover:bg-surface-container-high">
        <Icon name="cloud_sync" className="text-primary" />
        <p className="flex-1 text-body-md text-on-surface">
          Ienāc, lai saglabātu dārzu un sinhronizētu to starp telefonu un datoru
        </p>
        <Icon name="arrow_forward" size="18px" className="text-on-surface-variant" />
      </Card>
    </Link>
  );
}

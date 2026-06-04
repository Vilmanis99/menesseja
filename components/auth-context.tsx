"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/supabase/types";

interface AuthState {
  /** true when a backend is connected at all */
  enabled: boolean;
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // A stable client for the lifetime of the provider (only when configured).
  // Wrapped in try/catch so a malformed cookie can never crash the app.
  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  async function loadProfile(uid: string) {
    if (!supabase) return;
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
      setProfile((data as Profile) ?? null);
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    // getSession reads the local cookie (no network) — fast and can't fail on
    // connectivity. Auth-sensitive server work still re-validates with getUser().
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        const u = data.session?.user ?? null;
        setUser(u);
        if (u) loadProfile(u.id);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthState = {
    enabled: isSupabaseConfigured,
    loading,
    user,
    profile,
    async signOut() {
      try {
        await supabase?.auth.signOut();
      } catch {
        /* ignore */
      }
      setUser(null);
      setProfile(null);
    },
    async refreshProfile() {
      if (user) await loadProfile(user.id);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

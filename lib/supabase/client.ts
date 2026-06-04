"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

/** Browser Supabase client. Call only after checking `isSupabaseConfigured`. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, areAccountsEnabled, isSupabaseConfigured } from "@/lib/supabase/config";

/** Refreshes the Supabase auth session cookie on each request. No-ops entirely
 *  when Supabase isn't configured, so the site runs unchanged before connection. */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!isSupabaseConfigured || !areAccountsEnabled) return response;

  // Most visitors use the guest garden. Avoid a remote auth request unless this
  // browser actually carries a session cookie for the configured Supabase project.
  const projectRef = new URL(SUPABASE_URL!).hostname.split(".")[0];
  const authCookiePrefix = `sb-${projectRef}-auth-token`;
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith(authCookiePrefix));
  if (!hasAuthCookie) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Touch the user to trigger a token refresh when needed. Public pages must
  // remain available when Supabase is temporarily unreachable.
  try {
    await supabase.auth.getUser();
  } catch {
    return response;
  }
  return response;
}

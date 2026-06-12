"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/icon";
import { NAV_ITEMS, NAV_FOOTER, type NavItem } from "@/components/nav-config";
import { RegionProvider } from "@/components/region-context";
import { GardenProvider } from "@/components/garden-context";
import { AuthProvider } from "@/components/auth-context";
import { AccountButton } from "@/components/account-button";
import { Onboarding } from "@/components/onboarding";
import { GardenToast } from "@/components/garden-toast";
import { SiteFooter } from "@/components/site-footer";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function SideLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={clsx(
        "flex items-center gap-sm rounded-lg px-sm py-sm transition-all duration-200",
        active
          ? "border-r-2 border-primary bg-surface-variant/30 font-bold text-primary"
          : "text-on-surface-variant hover:bg-surface-variant/50",
      )}
    >
      <Icon name={item.icon} fill={active} />
      <span className="text-body-md">{item.label}</span>
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-outline-variant/20 bg-surface-container px-sm py-md shadow-lg shadow-primary/5 md:flex print:hidden">
      <div className="mb-lg px-xs">
        <span className="block text-headline-md text-primary">Mēness Sēja</span>
        <p className="mt-xs text-label-sm uppercase tracking-widest text-on-surface-variant/70">
          Modern Folklore
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SideLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>
      <div className="space-y-1 border-t border-outline-variant/10 pt-md">
        {NAV_FOOTER.map((item) => (
          <SideLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
        <AccountButton variant="side" />
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-surface/80 px-gutter py-sm backdrop-blur-md md:hidden print:hidden">
      <Link href="/" aria-label="Mēness Sēja — sākums">
        <span className="text-headline-md text-primary">Mēness Sēja</span>
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/macies"
          aria-label="Kas ir Mēness sēja?"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-variant/50"
        >
          <Icon name="school" />
        </Link>
        <Link
          href="/iestatijumi"
          aria-label="Iestatījumi un reģions"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-variant/50"
        >
          <Icon name="settings" />
        </Link>
        <AccountButton variant="bar" />
      </div>
    </header>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.primary);
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-high px-4 pb-4 pt-2 shadow-[0_-4px_20px_rgba(27,48,34,0.3)] md:hidden print:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-all active:scale-90",
              active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            <Icon name={item.icon} fill={active} />
            <span className="text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RegionProvider>
        <GardenProvider>
          <Sidebar />
          <TopBar />
          <div className="mx-auto mb-24 max-w-container-max px-gutter py-md md:mb-0 md:ml-64 md:py-lg print:m-0 print:max-w-none print:p-0">
            {children}
            <SiteFooter />
          </div>
          <BottomNav />
          <Onboarding />
          <GardenToast />
        </GardenProvider>
      </RegionProvider>
    </AuthProvider>
  );
}

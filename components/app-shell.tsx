"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/icon";
import { GARDEN_HREF, NAV_ITEMS, NAV_FOOTER, navCurrent, type NavCurrent, type NavItem } from "@/components/nav-config";
import { RegionProvider } from "@/components/region-context";
import { GardenProvider } from "@/components/garden-context";
import { AuthProvider } from "@/components/auth-context";
import { AccountButton } from "@/components/account-button";
import { GardenToast } from "@/components/garden-toast";
import { SiteFooter } from "@/components/site-footer";
import { MobileMenu } from "@/components/mobile-menu";
import { ConsentManager } from "@/components/consent-manager";

function useGardenSection(pathname: string) {
  const [inGarden, setInGarden] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setInGarden(false);
      return;
    }
    const section = document.getElementById("mans-darzs");
    if (!section) return;
    let frame = 0;
    function measure() {
      frame = 0;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const anchorTop = parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      setInGarden(bounds.top <= anchorTop + 1 && bounds.bottom > anchorTop);
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return inGarden;
}

function SideLink({ item, current }: { item: NavItem; current: NavCurrent }) {
  const Tag = item.href === GARDEN_HREF ? "a" : Link;
  return (
    <Tag
      href={item.href}
      aria-current={current}
      className={clsx(
        "flex items-center gap-sm rounded-lg px-sm py-sm transition-all duration-200",
        current
          ? "border-r-2 border-primary bg-surface-variant/30 font-bold text-primary"
          : "text-on-surface-variant hover:bg-surface-variant/50",
      )}
    >
      <Icon name={item.icon} fill={Boolean(current)} />
      <span className="text-body-md">{item.label}</span>
    </Tag>
  );
}

function Sidebar({ current }: { current: (href: string) => NavCurrent }) {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col overflow-y-auto border-r border-outline-variant/20 bg-surface-container px-sm py-md shadow-lg shadow-primary/5 md:flex print:hidden">
      <div className="mb-lg shrink-0 px-xs">
        <a href="/" aria-label="Mēness Sēja — sākums" className="block w-fit text-headline-md text-primary">Mēness Sēja</a>
        <p className="mt-xs text-label-sm uppercase tracking-widest text-on-surface-variant/70">
          Latvijas dārza almanahs
        </p>
      </div>
      <nav aria-label="Galvenā navigācija" className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SideLink key={item.href} item={item} current={current(item.href)} />
        ))}
      </nav>
      <div className="shrink-0 space-y-1 border-t border-outline-variant/10 pt-md">
        {NAV_FOOTER.map((item) => (
          <SideLink key={item.href} item={item} current={current(item.href)} />
        ))}
        <AccountButton variant="side" />
      </div>
    </aside>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="mobile-top-bar sticky top-0 z-40 flex items-center justify-between bg-surface/80 px-gutter pb-sm backdrop-blur-md md:hidden print:hidden">
      <div className="flex items-center gap-1">
        <button
          onClick={onMenu}
          aria-label="Atvērt izvēlni"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-variant/50"
        >
          <Icon name="menu" />
        </button>
        <a href="/" aria-label="Mēness Sēja — sākums">
          <span className="text-headline-md text-primary">Mēness Sēja</span>
        </a>
      </div>
      <AccountButton variant="bar" />
    </header>
  );
}

function BottomNav({ onMenu, current }: { onMenu: () => void; current: (href: string) => NavCurrent }) {
  const items = NAV_ITEMS.filter((i) => i.primary);
  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-high px-2 pt-2 shadow-[0_-4px_20px_rgba(27,48,34,0.3)] md:hidden print:hidden">
      {items.map((item) => {
        const active = current(item.href);
        const Tag = item.href === GARDEN_HREF ? "a" : Link;
        return (
          <Tag
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active}
            className={clsx(
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-all duration-200 active:scale-[0.97]",
              active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            <Icon name={item.icon} fill={Boolean(active)} />
            <span className="whitespace-nowrap text-center text-label-sm">{item.label}</span>
          </Tag>
        );
      })}
      <button
        onClick={onMenu}
        aria-label="Izvēlne — visas sadaļas"
        className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-on-surface-variant transition-all duration-200 hover:text-primary active:scale-[0.97]"
      >
        <Icon name="menu" />
        <span className="text-label-sm">Izvēlne</span>
      </button>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const inGarden = useGardenSection(pathname);
  const current = (href: string) => navCurrent(pathname, href, inGarden);
  return (
    <AuthProvider>
      <RegionProvider>
        <GardenProvider>
          <a href="#main-content" className="fixed left-3 top-3 z-[400] -translate-y-24 rounded-lg bg-primary px-4 py-3 text-label-md font-semibold text-on-primary transition-transform focus:translate-y-0 print:hidden">Pāriet uz galveno saturu</a>
          <Sidebar current={current} />
          <TopBar onMenu={() => setMenuOpen(true)} />
          <div className="app-mobile-content mx-auto max-w-container-max px-gutter py-md md:ml-64 md:py-lg print:m-0 print:max-w-none print:p-0">
            <main id="main-content" tabIndex={-1}>{children}</main>
            <SiteFooter />
          </div>
          <BottomNav current={current} onMenu={() => setMenuOpen(true)} />
          <MobileMenu current={current} open={menuOpen} onClose={() => setMenuOpen(false)} />
          <GardenToast />
          <ConsentManager />
        </GardenProvider>
      </RegionProvider>
    </AuthProvider>
  );
}

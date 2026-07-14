"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { Icon } from "@/components/ui/icon";
import { NAV_ITEMS, NAV_FOOTER, type NavItem } from "@/components/nav-config";
import { AccountButton } from "@/components/account-button";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Mobile navigation drawer. Slides in from the LEFT (where users instinctively
 * look for a menu) and lists EVERY section — the old mobile UI only exposed the
 * 4 bottom-bar items + a footer, so Kaitēkļi / Raksti / Receptes were nearly
 * undiscoverable. Opened from the top-bar hamburger and the bottom-bar "Izvēlne".
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const Row = (item: NavItem) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={clsx(
          "flex items-center gap-sm rounded-lg px-sm py-sm transition-colors",
          active
            ? "bg-surface-variant/40 font-bold text-primary"
            : "text-on-surface-variant hover:bg-surface-variant/40",
        )}
      >
        <Icon name={item.icon} fill={active} />
        <span className="text-body-md">{item.label}</span>
      </Link>
    );
  };

  return (
    <div
      className={clsx("fixed inset-0 z-[60] md:hidden print:hidden", !open && "pointer-events-none")}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={clsx(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Izvēlne"
        className={clsx(
          "absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-surface-container shadow-2xl transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-md py-md">
          <span className="text-headline-md text-primary">Mēness Sēja</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Aizvērt izvēlni"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-sm pb-md">
          {NAV_ITEMS.map(Row)}
          <div className="my-sm border-t border-outline-variant/10" />
          {NAV_FOOTER.map(Row)}
          <div className="pt-sm">
            <AccountButton variant="side" />
          </div>
        </nav>
      </div>
    </div>
  );
}

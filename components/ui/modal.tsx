"use client";

import { useEffect, useRef } from "react";
import { clsx } from "@/lib/clsx";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  /** Panel classes (width, layout) */
  panelClassName?: string;
  /** Stacking class, e.g. "z-[120]" */
  zClass?: string;
  /** Backdrop classes */
  backdropClass?: string;
  /** id of the element labelling the dialog */
  labelledBy?: string;
  /** Close when the backdrop is clicked (default true) */
  dismissOnBackdrop?: boolean;
}

/**
 * Accessible modal shell: role=dialog + aria-modal, Escape-to-close, body
 * scroll-lock, initial focus, and a Tab focus-trap. Bottom-sheet on mobile,
 * centered on desktop. Backdrop click closes.
 */
export function Modal({
  onClose,
  children,
  panelClassName = "",
  zClass = "z-[120]",
  backdropClass = "bg-background/70 backdrop-blur-sm",
  labelledBy,
  dismissOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    // Focus the panel (or first focusable) on open
    requestAnimationFrame(() => {
      const focusables = getFocusable();
      (focusables[0] ?? panelRef.current)?.focus();
    });

    function getFocusable(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={clsx("fixed inset-0 flex items-end justify-center sm:items-center", zClass, backdropClass)}
      onClick={dismissOnBackdrop ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={clsx("outline-none", panelClassName)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

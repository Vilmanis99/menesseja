"use client";

import { useState } from "react";
import { clsx } from "@/lib/clsx";
import { Icon } from "./icon";

interface InfoTipProps {
  /** Short explanation shown on tap/hover */
  text: string;
  className?: string;
}

/**
 * A small "?" affordance that reveals a one-line explanation of a term.
 * Tap-to-toggle (mobile friendly) with a hover hint on desktop.
 */
export function InfoTip({ text, className }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className={clsx("relative inline-flex", className)}>
      <button
        type="button"
        aria-label="Paskaidrojums"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-variant/70 text-on-surface-variant transition-colors hover:bg-primary/30 hover:text-primary"
      >
        <Icon name="question_mark" size="12px" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-outline-variant/30 bg-surface-container-highest p-3 text-left text-label-sm font-normal normal-case leading-relaxed tracking-normal text-on-surface shadow-xl"
        >
          {text}
        </span>
      )}
    </span>
  );
}

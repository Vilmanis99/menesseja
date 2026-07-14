"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ArticleEngagement({ slug }: { slug: string }) {
  useEffect(() => {
    let elapsed = false;
    let half = false;
    let engaged = false;
    let complete = false;
    const timer = window.setTimeout(() => {
      elapsed = true;
      if (half && !engaged) {
        engaged = true;
        track("article_engaged", { slug });
      }
    }, 45_000);
    const scroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = window.scrollY / max;
      if (depth >= 0.5) half = true;
      if (elapsed && half && !engaged) {
        engaged = true;
        track("article_engaged", { slug });
      }
      if (depth >= 0.9 && !complete) {
        complete = true;
        track("article_complete", { slug });
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", scroll);
    };
  }, [slug]);
  return null;
}

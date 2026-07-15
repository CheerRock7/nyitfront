"use client";

import { useEffect } from "react";

/**
 * A single "magnet" boundary between the hero and the section below it.
 *   - At the top, one wheel down snaps past the hero to the next section.
 *   - Coming back up to that section, one wheel up snaps back to the hero.
 *   - Anywhere below that boundary, scrolling is completely normal.
 * The boundary is the second [data-snap] element (the PC Builder / glass band).
 * Desktop pointer only (mobile keeps native touch); disabled for reduced-motion.
 */
export function SnapScroll() {
  useEffect(() => {
    const canSnap = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const NAV = 72; // sticky navbar height on desktop
    const LOCK_MS = 850;
    let animating = false;
    let lockTimer = 0;

    // The scroll position where the hero ends and the next section begins.
    const boundary = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-snap]");
      if (els.length < 2) return null;
      return Math.max(0, els[1].getBoundingClientRect().top + window.scrollY - NAV);
    };

    const goTo = (top: number) => {
      animating = true;
      window.scrollTo({ top, behavior: reduce.matches ? "auto" : "smooth" });
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => {
        animating = false;
      }, LOCK_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (!canSnap.matches || reduce.matches || e.ctrlKey) return; // let ctrl+wheel zoom through
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir) return;

      const s = boundary();
      if (s === null) return;
      const y = window.scrollY;

      if (dir > 0) {
        // above the boundary (on the hero) -> snap down past it; below -> normal
        if (y >= s - 2) return;
        e.preventDefault();
        if (animating) return;
        goTo(s);
      } else {
        // at/just below the boundary -> snap back up to the hero; deeper -> normal
        if (y <= 2 || y > s + 2) return;
        e.preventDefault();
        if (animating) return;
        goTo(0);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
}

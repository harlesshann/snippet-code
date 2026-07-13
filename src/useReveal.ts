import { useLayoutEffect, type RefObject } from "react";

/**
 * Reveal-on-scroll for elements marked with [data-reveal] inside `scopeRef`.
 * Plays once when each element enters the viewport, with a per-element
 * `--reveal-delay` for stagger. On load/refresh (and when the landing remounts
 * from the router) in-view elements reveal immediately, giving the entry
 * animation. Reduced-motion users get no hidden state (see styles.css), so
 * content is always visible. Falls back to "show all" if IO is unavailable.
 */
export function useReveal(scopeRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return;
    root.classList.add("anim-ready");

    const els = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scopeRef]);
}

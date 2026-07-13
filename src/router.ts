import { useEffect, useState } from "react";

/**
 * Minimal hash router. Hash routing keeps deep links working on static hosts
 * (GitHub Pages / Netlify) with no server rewrite config, and avoids adding a
 * router dependency to the bundle.
 */
function current(): string {
  const h = window.location.hash.replace(/^#/, "");
  return h === "/app" ? "/app" : "/";
}

export function useRoute(): string {
  const [route, setRoute] = useState(current());
  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, "", "#/");
    const on = () => setRoute(current());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export function navigate(path: string): void {
  window.location.hash = path;
  window.scrollTo(0, 0);
}

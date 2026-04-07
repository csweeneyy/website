"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard registration for SSR — "use client" still allows server evaluation
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useGSAP — wrapper that provides a GSAP context scoped to a ref,
 * with automatic cleanup on unmount.
 */
export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Ensure registered client-side
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      callback(ctx!);
    }, scope?.current || undefined);
    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}

/**
 * useMediaQuery — reactive media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Refresh all ScrollTriggers — call after layout changes
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };

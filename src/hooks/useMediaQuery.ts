import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. Used only where a component has to be swapped
 * for its mobile equivalent (Dialog → Drawer, per responsiveness.md §3) —
 * never for layout, which stays in CSS.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener("change", onChange);

    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** ACKO tablet breakpoint and up (responsiveness.md). */
export const TABLET_UP = "(min-width: 600px)";

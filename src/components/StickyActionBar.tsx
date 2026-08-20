import { useEffect, useRef, useState, type ReactNode } from "react";
import { Surface } from "@acko/surface";

interface StickyActionBarProps {
  children: ReactNode;
}

/**
 * Bottom-pinned action bar for the page-level secondary action.
 *
 * The fill is a real `Surface`; only the fixed positioning, the device safe
 * area (ui-polish.md → Safe areas) and the scroll-aware elevation are
 * app-owned. Logged in missing-components-all-plans-platinum.md.
 *
 * Mobile only — from tablet up the action moves into PageTopBar, so this is
 * hidden by the `tablet:hidden` wrapper at the call site.
 */
export function StickyActionBar({ children }: StickyActionBarProps) {
  const [raised, setRaised] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;

      frame.current = window.requestAnimationFrame(() => {
        const scrolledToBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 1;

        setRaised(!scrolledToBottom);
        frame.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      className={
        raised
          ? "sticky-action-bar-anchor sticky-action-bar-anchor--raised"
          : "sticky-action-bar-anchor"
      }
    >
      <Surface variant="primary" padding="none" className="w-full rounded-none">
        <div className="section-container sticky-action-bar-inner pt-16">
          {children}
        </div>
      </Surface>
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { ArrowLeft } from "@acko/icons";

interface PageTopBarProps {
  title: string;
  onBack: () => void;
  /** Trailing action, shown from tablet up. Hidden on mobile where the
   *  sticky bottom bar owns the page-level action. */
  action?: ReactNode;
}

/**
 * Sticky page top bar: back affordance + screen title, with a hairline that
 * only appears once content has scrolled underneath.
 *
 * Custom component — logged in missing-components-all-plans-platinum.md.
 */
export function PageTopBar({ title, onBack, action }: PageTopBarProps) {
  const [raised, setRaised] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;

      frame.current = window.requestAnimationFrame(() => {
        setRaised(window.scrollY > 0);
        frame.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <header className={raised ? "page-top-bar page-top-bar--raised" : "page-top-bar"}>
      <div className="section-container flex items-center gap-8 py-8 tablet:py-12">
        <Button
          variant="ghost"
          size="md"
          iconOnly
          iconLeft={<ArrowLeft aria-hidden="true" />}
          onClick={onBack}
        >
          Go back
        </Button>

        <Typography variant="heading-sm" weight="semibold" as="h1" className="min-w-0 flex-1">
          {title}
        </Typography>

        {action ? <div className="hidden tablet:block">{action}</div> : null}
      </div>
    </header>
  );
}

import { Button } from "@acko/button";
import { CounterBadge } from "@acko/badge";
import { CustomerService } from "@acko/icons";

interface ChatOrCallFabProps {
  /** Shows the unread indicator until the user has opened it once. */
  unread: boolean;
  onOpen: () => void;
  /** Extra bottom offset in px so the pill clears the sticky action bar. */
  bottomOffset: number;
}

/**
 * Floating "Chat or call" support pill, bottom-right of the screen. Persists
 * across the buy journey so help is always one tap away.
 *
 * The pill itself is a real `Button` and the indicator a real `CounterBadge`,
 * so all interaction states come from the library. Only the fixed positioning
 * and safe-area offset are app-owned — logged in
 * missing-components-all-plans-platinum.md.
 */
export function ChatOrCallFab({ unread, onOpen, bottomOffset }: ChatOrCallFabProps) {
  return (
    <div
      className="chat-fab-anchor"
      style={{ "--chatFabOffset": `${bottomOffset}px` } as React.CSSProperties}
    >
      <Button
        variant="secondary"
        size="lg"
        iconRight={<CustomerService aria-hidden="true" />}
        onClick={onOpen}
        aria-label={unread ? "Chat or call, 1 new message" : "Chat or call"}
      >
        Chat or call
      </Button>

      {unread ? (
        <span className="chat-fab-counter" aria-hidden="true">
          <CounterBadge count={1} color="red" size="sm" />
        </span>
      ) : null}
    </div>
  );
}

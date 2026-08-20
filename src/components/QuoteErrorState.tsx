import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { Typography } from "@acko/typography";
import { Refresh, TriangleWarning } from "@acko/icons";

interface QuoteErrorStateProps {
  onRetry: () => void;
}

/**
 * Shown when the quote request fails. Says what happened, what it means for
 * the user, and gives one way out — never a dead end (layout.md → Empty
 * states, forms-controls.md → Server errors).
 */
export function QuoteErrorState({ onRetry }: QuoteErrorStateProps) {
  return (
    <Card variant="primary">
      <div className="flex flex-col items-center gap-16 p-24 text-center" role="alert">
        <span className="error-glyph" aria-hidden="true">
          <TriangleWarning aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-8">
          <Typography variant="heading-sm" weight="semibold" as="h2">
            We couldn&apos;t load your plans
          </Typography>
          <Typography variant="body-md" color="secondary">
            Your prices are still safe with us. This is usually a slow
            connection — try again in a moment.
          </Typography>
        </div>

        <Button
          variant="primary"
          size="md"
          iconLeft={<Refresh aria-hidden="true" />}
          onClick={onRetry}
        >
          Try again
        </Button>
      </div>
    </Card>
  );
}

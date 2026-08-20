import { Card } from "@acko/card";
import { Skeleton } from "@acko/skeleton";

/**
 * Placeholder for a plan card while premiums are being priced. Blocks mirror
 * the real card's dimensions and radii so there is no layout shift when the
 * quote lands (layout.md → Loading states).
 */
export function PlanCardSkeleton() {
  return (
    <Card variant="primary" className="h-full">
      <div className="flex h-full flex-col gap-16 p-20 tablet:p-24" aria-hidden="true">
        {/* Plan name */}
        <Skeleton variant="text" height={28} width="60%" className="mx-auto" />

        {/* Notice block — matches Alert's --radiusLg, not Skeleton's 16px "rounded" */}
        <Skeleton variant="rounded" height={96} className="rounded-lg" />

        {/* Three benefit rows */}
        <div className="flex flex-col gap-12">
          <Skeleton variant="text" height={24} width="55%" />
          <Skeleton variant="text" height={24} width="70%" />
          <Skeleton variant="text" height={24} width="65%" />
        </div>

        {/* Price line */}
        <Skeleton variant="text" height={24} width="80%" />

        {/* Primary CTA — Button is a pill (--radiusFull); Skeleton has no pill variant */}
        <div className="mt-auto">
          <Skeleton variant="rounded" height={56} className="rounded-full" />
        </div>
      </div>
    </Card>
  );
}

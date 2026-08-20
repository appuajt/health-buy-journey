import { useCallback, useState } from "react";
import { Alert } from "@acko/alert";
import { Button } from "@acko/button";
import { ChatOrCallFab } from "../components/ChatOrCallFab";
import { ComparePlansSheet } from "../components/ComparePlansSheet";
import { ContactSheet } from "../components/ContactSheet";
import { PageTopBar } from "../components/PageTopBar";
import { PlanCard } from "../components/PlanCard";
import { PlanCardSkeleton } from "../components/PlanCardSkeleton";
import { PlanDetailsSheet } from "../components/PlanDetailsSheet";
import { QuoteErrorState } from "../components/QuoteErrorState";
import { StickyActionBar } from "../components/StickyActionBar";
import { HEALTH_PLANS, type HealthPlan } from "../data/plans";
import { useQuotes } from "../hooks/useQuotes";
import { TABLET_UP, useMediaQuery } from "../hooks/useMediaQuery";

/**
 * FAB clearance from the bottom of the viewport: 16px on its own, or clear of
 * the sticky action bar (16 top + 56 CTA + 24 bottom = 96) plus a gap.
 */
const FAB_OFFSET_BARE = 16;
const FAB_OFFSET_ABOVE_BAR = 104;

/**
 * Screen 14-all-plans-platinum.jpg — "All health plans", variant B
 * (ACKO Platinum → ACKO Platinum Super Top-up).
 */
export function AllHealthPlansPage() {
  const { status, plans, retry } = useQuotes();
  const isTabletUp = useMediaQuery(TABLET_UP);

  const [detailsPlan, setDetailsPlan] = useState<HealthPlan | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [supportUnread, setSupportUnread] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);

  const openContact = useCallback(() => {
    setSupportUnread(false);
    setContactOpen(true);
  }, []);

  const handleSelectPlan = useCallback((plan: HealthPlan) => {
    setSelectedPlan(plan);
    setDetailsPlan(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const compareButton = (
    <Button
      variant="secondary"
      size="lg"
      fullWidth
      disabled={status !== "ready"}
      onClick={() => setCompareOpen(true)}
    >
      Compare plans
    </Button>
  );

  return (
    <div className="min-h-screen">
      <PageTopBar title="All health plans" onBack={() => window.history.back()} />

      {/* Bottom padding clears both fixed layers on mobile: the action bar
          (96px) and the FAB stacked above it. Tablet up has neither pinned. */}
      <main className="section-container pt-16 pb-176 tablet:pb-96">
        {/* Plans are a scrolling list, not a card grid — one per row at every
            width. The column is capped so cards stay readable rather than
            stretching the full width of a desktop screen. */}
        <div className="mx-auto flex w-full max-w-560 flex-col gap-16 tablet:gap-24">
        {/* Status changes announced without stealing focus */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {status === "loading" ? "Loading your health plans" : null}
          {status === "error" ? "We couldn't load your plans" : null}
          {status === "ready" ? `${plans.length} health plans available` : null}
        </div>

        {selectedPlan ? (
          <Alert
            variant="success"
            title="Plan saved to your quote"
            dismissible
            onDismiss={() => setSelectedPlan(null)}
          >
            {`${selectedPlan.name} is locked in. Next up: member details and medicals.`}
          </Alert>
        ) : null}

        {status === "error" ? (
          <QuoteErrorState onRetry={retry} />
        ) : (
          <div className="flex flex-col gap-16 tablet:gap-24">
            {status === "loading"
              ? HEALTH_PLANS.map((plan) => <PlanCardSkeleton key={plan.id} />)
              : plans.map((plan, index) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    onViewDetails={setDetailsPlan}
                  />
                ))}
          </div>
        )}

        {/* Compare sits below both cards. Tablet up it lives here in the flow;
            on mobile the same action is pinned to the bottom of the viewport so
            it is reachable without scrolling to the end of the list. */}
        {status !== "error" ? (
          <div className="hidden tablet:block">{compareButton}</div>
        ) : null}
        </div>
      </main>

      {/* Mobile keeps the page action pinned to the bottom; from tablet up it
          lives in the top bar instead. */}
      <div className="tablet:hidden">
        <StickyActionBar>{compareButton}</StickyActionBar>
      </div>

      <ChatOrCallFab
        unread={supportUnread}
        onOpen={openContact}
        bottomOffset={isTabletUp ? FAB_OFFSET_BARE : FAB_OFFSET_ABOVE_BAR}
      />

      <PlanDetailsSheet
        plan={detailsPlan}
        onClose={() => setDetailsPlan(null)}
        onSelect={handleSelectPlan}
      />

      <ComparePlansSheet
        open={compareOpen}
        plans={plans.length > 0 ? plans : HEALTH_PLANS}
        onClose={() => setCompareOpen(false)}
      />

      <ContactSheet open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

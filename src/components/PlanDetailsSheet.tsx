import { useEffect, useState } from "react";
import { Alert } from "@acko/alert";
import { Button } from "@acko/button";
import { Separator } from "@acko/separator";
import { Typography } from "@acko/typography";
import { Info, Tick } from "@acko/icons";
import { formatRupees, type HealthPlan } from "../data/plans";
import { ResponsiveSheet } from "./ResponsiveSheet";

interface PlanDetailsSheetProps {
  plan: HealthPlan | null;
  onClose: () => void;
  onSelect: (plan: HealthPlan) => void;
}

/** Time the "continue" step spends confirming the plan against the quote. */
const SELECT_LATENCY_MS = 900;

/**
 * Full detail for a single plan — what the card's "View plan details" opens.
 * Bottom sheet on mobile, dialog from tablet up.
 */
export function PlanDetailsSheet({ plan, onClose, onSelect }: PlanDetailsSheetProps) {
  const [submitting, setSubmitting] = useState(false);

  // Never leave the CTA spinning if the sheet is dismissed mid-request.
  useEffect(() => {
    if (!plan) setSubmitting(false);
  }, [plan]);

  useEffect(() => {
    if (!submitting || !plan) return;

    const timer = window.setTimeout(() => {
      setSubmitting(false);
      onSelect(plan);
    }, SELECT_LATENCY_MS);

    return () => window.clearTimeout(timer);
  }, [submitting, plan, onSelect]);

  return (
    <ResponsiveSheet
      open={plan !== null}
      onClose={onClose}
      title={plan?.name ?? "Plan details"}
      description={
        plan ? `${plan.coverage} coverage at ${formatRupees(plan.premium)}/year` : undefined
      }
      footer={
        plan ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            onClick={() => setSubmitting(true)}
          >
            {submitting ? "Confirming your plan..." : "Continue with this plan"}
          </Button>
        ) : undefined
      }
    >
      {plan ? (
        <div className="flex flex-col gap-24">
          <Alert variant="warning" icon={<Info aria-hidden="true" />}>
            {plan.notice}
          </Alert>

          <div className="flex flex-col gap-12">
            <Typography variant="heading-sm" weight="semibold" as="h3">
              What&apos;s covered
            </Typography>

            <ul className="flex flex-col gap-12">
              {plan.inclusions.map((inclusion) => (
                <li key={inclusion} className="flex items-start gap-8">
                  <span className="benefit-tick" aria-hidden="true">
                    <Tick aria-hidden="true" />
                  </span>
                  <Typography variant="body-md">{inclusion}</Typography>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-12">
            <Typography variant="heading-sm" weight="semibold" as="h3">
              Plan details
            </Typography>

            <dl className="flex flex-col gap-12">
              {plan.details.map((row, rowIndex) => (
                <div key={row.label} className="flex flex-col gap-12">
                  {rowIndex > 0 ? <Separator separatorStyle="subtle" decorative /> : null}
                  <div className="flex items-baseline justify-between gap-16">
                    <Typography variant="body-sm" color="secondary" as="dt">
                      {row.label}
                    </Typography>
                    <Typography
                      variant="body-sm"
                      weight="medium"
                      align="right"
                      as="dd"
                      className="tabular-nums"
                    >
                      {row.value}
                    </Typography>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <Typography variant="caption" color="secondary">
            Premium shown includes GST. Final premium is confirmed after medicals.
            IRDAI Licence No. 157.
          </Typography>
        </div>
      ) : null}
    </ResponsiveSheet>
  );
}

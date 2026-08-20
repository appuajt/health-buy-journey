import { Alert } from "@acko/alert";
import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { Separator } from "@acko/separator";
import { Typography } from "@acko/typography";
import { Info, Tick } from "@acko/icons";
import { formatRupees, type HealthPlan } from "../data/plans";

interface PlanCardProps {
  plan: HealthPlan;
  /** Reveal order for the staggered entrance (motion.page.element-stagger). */
  index: number;
  onViewDetails: (plan: HealthPlan) => void;
}

/**
 * One health plan in the "All health plans" list: name, eligibility notice,
 * headline benefits, coverage + premium, and the primary action.
 *
 * Pure composition of Card / Alert / Separator / Button / Typography — no
 * custom shell, so it is not a library gap.
 */
export function PlanCard({ plan, index, onViewDetails }: PlanCardProps) {
  return (
    <Card
      variant="primary"
      className="plan-reveal h-full"
      style={{ "--planIndex": index } as React.CSSProperties}
    >
      <div className="flex h-full flex-col gap-16 p-20 tablet:p-24">
        {/* heading-sm is 20px in the shipped token scale — heading-md is 24px,
            which wraps the longer plan name onto two lines. */}
        <Typography variant="heading-sm" weight="bold" align="center" as="h2">
          {plan.name}
        </Typography>

        {/* Shown in full, never truncated: the notice carries the plan's
            material condition (mandatory medicals, the deductible). Hiding it
            behind a "read more" would be exactly the hidden condition the
            design principles rule out. Alert renders children inside a single
            <p>, so this is a bare string. */}
        <Alert variant="warning" icon={<Info aria-hidden="true" />}>
          {plan.notice}
        </Alert>

        <ul className="flex flex-col gap-12">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-8">
              <span className="benefit-tick" aria-hidden="true">
                <Tick aria-hidden="true" />
              </span>
              <Typography variant="body-md">{benefit}</Typography>
            </li>
          ))}
        </ul>

        <Separator separatorStyle="dashed" decorative />

        <Typography variant="body-md" color="secondary" className="tabular-nums">
          Get{" "}
          <Typography as="span" variant="body-md" weight="bold" color="primary">
            {plan.coverage}
          </Typography>{" "}
          coverage at{" "}
          <Typography as="span" variant="body-md" weight="bold" color="primary">
            {formatRupees(plan.premium)}
          </Typography>
          /year
        </Typography>

        <Separator separatorStyle="dashed" decorative />

        <div className="mt-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onViewDetails(plan)}
          >
            View plan details
          </Button>
        </div>
      </div>
    </Card>
  );
}

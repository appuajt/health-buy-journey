import { Typography } from "@acko/typography";
import { formatRupees, type HealthPlan } from "../data/plans";
import { ResponsiveSheet } from "./ResponsiveSheet";

interface ComparePlansSheetProps {
  open: boolean;
  plans: HealthPlan[];
  onClose: () => void;
}

/** Criteria down column 1, one column per plan after that. */
const COMPARE_ROWS: { label: string; value: (plan: HealthPlan) => string }[] = [
  { label: "Coverage", value: (plan) => plan.coverage },
  { label: "Premium", value: (plan) => `${formatRupees(plan.premium)}/year` },
  { label: "Deductible", value: (plan) => detail(plan, "Deductible") },
  { label: "Waiting period", value: (plan) => detail(plan, "Waiting period") },
  { label: "Room rent", value: (plan) => detail(plan, "Room rent limit") },
  { label: "Medicals", value: (plan) => detail(plan, "Pre-policy medicals") },
];

function detail(plan: HealthPlan, label: string): string {
  return plan.details.find((row) => row.label === label)?.value ?? "—";
}

/**
 * Plan comparison — what the page's "Compare plans" action opens, so the
 * button is not a dead end.
 *
 * A real comparison matrix: criteria in column 1, one column per plan. Built
 * on a native <table> carrying @acko/css's own `.acko-table*` classes, because
 * `@acko/table`'s React package is not published to the registry — see the
 * missing-components log. Semantic <th scope> means screen readers announce
 * both the criterion and the plan for every cell.
 */
export function ComparePlansSheet({ open, plans, onClose }: ComparePlansSheetProps) {
  return (
    <ResponsiveSheet
      open={open}
      onClose={onClose}
      title="Compare plans"
      description="How the Platinum plans line up"
    >
      <div className="acko-table-wrapper">
        <table className="acko-table compare-table">
          <thead>
            <tr className="acko-table-row">
              <th className="acko-table-head" scope="col">
                <span className="sr-only">Criteria</span>
              </th>

              {plans.map((plan) => (
                <th key={plan.id} className="acko-table-head" scope="col">
                  {plan.shortName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="acko-table-body">
            {COMPARE_ROWS.map((row) => (
              <tr key={row.label} className="acko-table-row">
                <th className="acko-table-cell compare-table-criterion" scope="row">
                  <Typography variant="body-sm" color="secondary" as="span">
                    {row.label}
                  </Typography>
                </th>

                {plans.map((plan) => (
                  <td key={plan.id} className="acko-table-cell">
                    <Typography
                      variant="body-sm"
                      weight="medium"
                      as="span"
                      className="tabular-nums"
                    >
                      {row.value(plan)}
                    </Typography>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ResponsiveSheet>
  );
}

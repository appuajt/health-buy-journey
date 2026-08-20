/**
 * Screen: 14-all-plans-platinum.jpg — Health buy journey, "All health plans"
 * (variant B: ACKO Platinum → ACKO Platinum Super Top-up).
 *
 * Premiums and coverage mirror the assignment screenshot. In production this
 * shape is what the quote API returns per member set + pincode.
 */

export interface PlanDetailRow {
  label: string;
  value: string;
}

export interface HealthPlan {
  id: string;
  name: string;
  /** Short label for tight contexts like comparison column headers. */
  shortName: string;
  /** Eligibility / structure caveat shown in the card's inline notice. */
  notice: string;
  /** Headline benefits — the three ticks on the card. */
  benefits: string[];
  /** Formatted sum insured, e.g. "₹1 crore". */
  coverage: string;
  /** Annual premium in rupees, formatted at render with formatRupees. */
  premium: number;
  /** Extra rows shown in the plan details sheet. */
  details: PlanDetailRow[];
  /** Full inclusion list shown in the plan details sheet. */
  inclusions: string[];
}

export const HEALTH_PLANS: HealthPlan[] = [
  {
    id: "platinum",
    name: "ACKO Platinum",
    shortName: "Platinum",
    notice:
      "This plan is more expensive, and all members will need to go for detailed health check-ups to be eligible for this plan.",
    benefits: [
      "Zero waiting period",
      "Full hospital bill payment",
      "No limit on hospital room rent",
    ],
    coverage: "₹1 crore",
    premium: 98289,
    details: [
      { label: "Sum insured", value: "₹1 crore" },
      { label: "Deductible", value: "None" },
      { label: "Waiting period", value: "Zero, from day one" },
      { label: "Room rent limit", value: "No limit" },
      { label: "Pre-policy medicals", value: "Required for all members" },
      { label: "Network hospitals", value: "14,300+ cashless" },
    ],
    inclusions: [
      "Zero waiting period",
      "Full hospital bill payment",
      "No limit on hospital room rent",
      "Pre and post hospitalisation cover",
      "Day care procedures",
      "Annual health check-up for every member",
    ],
  },
  {
    id: "platinum-super-top-up",
    name: "ACKO Platinum Super Top-up",
    shortName: "Super Top-up",
    notice:
      "This plan includes a deductible—the amount you pay for hospital bills before the Super Top-up kicks in. Without an existing health policy, you'll need to cover expenses up to the deductible yourself.",
    benefits: [
      "Zero waiting period",
      "Full hospital bill payment",
      "No limit on hospital room rent",
    ],
    coverage: "₹50 lakh",
    premium: 51029,
    details: [
      { label: "Sum insured", value: "₹50 lakh" },
      { label: "Deductible", value: "₹10 lakh per year" },
      { label: "Waiting period", value: "Zero, from day one" },
      { label: "Room rent limit", value: "No limit" },
      { label: "Pre-policy medicals", value: "Required for all members" },
      { label: "Network hospitals", value: "14,300+ cashless" },
    ],
    inclusions: [
      "Zero waiting period",
      "Full hospital bill payment",
      "No limit on hospital room rent",
      "Pre and post hospitalisation cover",
      "Day care procedures",
      "Works alongside an existing health policy",
    ],
  },
];

/** Indian-format currency with the rupee symbol, e.g. 98289 → "₹98,289". */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

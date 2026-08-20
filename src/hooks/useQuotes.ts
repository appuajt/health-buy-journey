import { useCallback, useEffect, useState } from "react";
import { HEALTH_PLANS, type HealthPlan } from "../data/plans";

export type QuoteStatus = "loading" | "error" | "ready";

const QUOTE_LATENCY_MS = 1100;

/**
 * Stands in for the health quote API. Premiums are priced server-side, so the
 * plan list is always async — the page is built around that rather than
 * rendering hardcoded data instantly.
 *
 * Append `?quoteError=1` to the URL to see the failure path on first load;
 * Retry always succeeds so the recovery path is reachable too.
 */
export function useQuotes() {
  const [status, setStatus] = useState<QuoteStatus>("loading");
  const [plans, setPlans] = useState<HealthPlan[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const shouldFail =
      attempt === 0 &&
      new URLSearchParams(window.location.search).get("quoteError") === "1";

    setStatus("loading");

    const timer = window.setTimeout(() => {
      if (shouldFail) {
        setStatus("error");
        return;
      }

      setPlans(HEALTH_PLANS);
      setStatus("ready");
    }, QUOTE_LATENCY_MS);

    return () => window.clearTimeout(timer);
  }, [attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { status, plans, retry };
}

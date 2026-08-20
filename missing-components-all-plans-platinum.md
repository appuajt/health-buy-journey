# Missing components — all-plans-platinum

Screen: `14-all-plans-platinum.jpg` — Health buy journey, "All health plans"
(variant B: ACKO Platinum → ACKO Platinum Super Top-up).

Logged live while building, per the component sourcing rules in `CLAUDE.md`.

> **Read this first — it is not a component gap, it is bigger than one.**
> `@acko/css@3.0.4` references **~170 tokens that `@acko/tokens@2.0.6` does not
> define.** The two packages are out of sync. Because an undefined `var()` invalidates
> the whole declaration, the affected components render with no fill, no border or no
> radius — silently, with no build or lint error.
>
> Verified on this screen: **every `Card` renders square** (`--radius5xl`), **every
> `Surface` and `Dialog` renders transparent with no scrim**, **every `Skeleton` is
> invisible**, **`Table` has no borders or header fill**, **red `Badge` is unstyled**.
> Most are the `--color*` names removed in the tokens v2 rename; the rest were never
> shipped. Families still broken and not shimmed here: wizard, toast, tabs, toggle,
> chip-selector, navbar, slider, progress, calendar, and the inverted/danger button
> variants.
>
> `src/index.css` carries a scoped compatibility shim for the components this screen
> uses, mapped via the documented legacy → v2 migration table. **The real fix belongs in
> the packages** — every team in this workshop is hitting this whether they have noticed
> or not.

---

## PageTopBar

- **Type:** MISSING
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The sticky bar at the top of the screen holding the back arrow and the "All health plans" title, with a hairline divider that fades in once the list scrolls underneath it.
- **Closest @acko component:** none installed — `@acko/css` ships a `navbar.css` (`.acko-navbar*`) but no `@acko/navbar` React package is published to the registry, so there is nothing to import.
- **Why it didn't fit:** No app-bar / page-header component exists in the installed set. `Breadcrumb` is the only navigation component available and it is a different pattern (desktop trail, not a mobile back affordance). Every screen in the buy journey needs this bar, so each team will re-implement it.
- **Props sketch:** `{ title: string; onBack: () => void; action?: ReactNode }`
- **Reuse potential:** HIGH — every screen in the health, life, car and bike buy journeys has this exact bar.

---

## Skeleton (plan card placeholder)

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The loading placeholders standing in for each plan card while premiums are priced by the quote API.
- **Closest @acko component:** `Skeleton` (`@acko/skeleton`)
- **Why it didn't fit:** Two problems, both needing app-level overrides.
  1. **Broken token chain — renders invisible.** `@acko/css@3.0.4` `skeleton.css` still sets `background: var(--colorDisabledBg)` and builds the wave gradient from `--colorSurface`. Both were removed in `@acko/tokens@2.x` (the package already ships the correct `--skeletonBase` / `--skeletonShimmer`), so the declarations are invalid and every skeleton paints nothing at all. Repointed in `src/index.css`.
  2. **Radius variants don't cover real components.** `variant="rounded"` is fixed at `--radius3xl` (16px). `ui-polish.md` requires a skeleton's radius to match the component it stands in for, but there is no variant for `--radiusLg` (8px, Alert) or `--radiusFull` (Button pill) — so both had to be forced with `className`.
- **Props sketch:** unchanged API; wants `variant="pill"` plus a `radius` prop accepting the radius token scale, e.g. `<Skeleton variant="rounded" radius="lg" />`.
- **Reuse potential:** HIGH — every async surface in the product needs skeletons, and every one of them currently renders blank.

---

## ChatOrCallFab

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The floating "Chat or call" support pill at the bottom-right of the screen, carrying an unread indicator and opening the contact options on tap.
- **Closest @acko component:** `Button` (`@acko/button`) for the pill + `CounterBadge` (`@acko/badge`) for the indicator — both used as-is. Only the fixed-position anchor around them is app-owned.
- **Why it didn't fit:** `Button` has no floating / elevated mode. Two things had to be added around it:
  1. **No elevation variant.** A pill that floats over scrolling content needs a shadow to separate from it; `Button` variants carry fill and border only, so `--shadowM` is applied to `.acko-button` from the anchor's CSS.
  2. **No anchoring for an indicator.** `CounterBadge` cannot be attached to another component — there is no `badge` / `indicator` slot on `Button` — so it is absolutely positioned over the button corner by the app, and its offsets are hand-tuned to the `size="lg"` pill.
  The fixed positioning, `--zSticky`, and `env(safe-area-inset-bottom)` offset are also app-owned, and shared with StickyActionBar below.
- **Props sketch:** `{ unread: boolean; onOpen: () => void; bottomOffset: number }` — as a library component, wants `Button` to gain `elevation?: 'none' | 'raised'` and an `indicator?: ReactNode` slot, which together would remove this file.
- **Reuse potential:** HIGH — the same support pill appears across the whole buy journey and in claims, and indicator-on-control is a general pattern (notification bell, cart, unread counts).

---

## StickyActionBar

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The bar pinned to the bottom of the viewport holding the "Compare plans" button, which gains elevation while list content scrolls beneath it.
- **Closest @acko component:** `Surface` (`@acko/surface`) — used as-is for the fill, full-bleed per the surface contract (`w-full rounded-none`).
- **Why it didn't fit:** `Surface` covers the fill and nothing else about being pinned. Still app-owned: `position: fixed`, `--zSticky`, `env(safe-area-inset-bottom)` padding, the scroll-position listener that toggles elevation, and the matching bottom padding on page content so the last card is not hidden behind the bar. Almost every mobile flow screen in the product ends in a bar like this, and each of those five details is easy to get subtly wrong per team — the safe-area inset especially.
- **Props sketch:** `{ children: ReactNode }` — wants a library `<StickyBar>` (or `Surface` gaining `position="sticky-bottom"`) handling `{ children, elevateOnScroll?: boolean, safeArea?: boolean }`.
- **Reuse potential:** HIGH — every mobile purchase, claim and KYC step has a pinned bottom CTA.

---

## Plan comparison (attribute-by-attribute)

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The attribute-by-attribute comparison (coverage, premium, deductible, waiting period, room rent, medicals) inside the sheet that the page's "Compare plans" action opens.
- **Closest @acko component:** `Table` — documented in the design system, but `@acko/table` is **not published to the registry**, so it cannot be installed or imported. `@acko/css` ships `table.css` with no matching React package. Shipped as a native `<table>` carrying the design system's own `.acko-table*` classes, so the styling is still the library's.
- **Why it didn't fit:** Three things.
  1. **No React component to import.** The markup, the `scope` attributes and the wrapper all have to be hand-written; only the CSS is reusable.
  2. **`table.css` is broken out of the box.** It references `--colorTableBorder`, `--colorTableHeaderBg`, `--colorTableHeaderText`, `--colorTableStripe`, `--colorTableRowHover`, `--colorTextDefault`, `--colorTextSecondary` and `--easeOutQuad` — none of which exist in `@acko/tokens@2.0.6`. Straight out of the box the table has no borders, no header fill and no text colour. Shimmed in `index.css`.
  3. **Column sizing is entirely the app's problem.** `.acko-table` sets no `table-layout`, so three columns at 360px need app CSS (`table-fixed`, a criterion-column width, `overflow-wrap`) before the comparison is readable on a phone. `.acko-table-head` also forces `uppercase`, which contradicts the system's own sentence-case rule for all UI text.
  Worth recording: a first attempt laid this out as two value columns with the criterion label spanning both. It broke — which value belonged to which plan was *purely positional*, and "ACKO Platinum Super Top-up" wrapped and pulled the rows out of alignment. The fix was a true 3-column matrix (criteria, then one column per plan) plus short plan labels for the headers.
- **Props sketch:** `{ open: boolean; plans: HealthPlan[]; onClose: () => void }` with an internal row spec `{ label: string; value: (plan) => string }[]`.
- **Reuse potential:** HIGH — plan comparison is core to every buy journey (health, life, car, bike), and add-on and coverage comparisons use the same shape. Worth shipping as a typed `ComparisonList` rather than leaving each team to rebuild a table that does not survive mobile.

---

## Button (link / dial action)

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The "Call 1800 266 2256" action in the contact sheet behind the chat pill.
- **Closest @acko component:** `Button` (`@acko/button`)
- **Why it didn't fit:** `Button` always renders a `<button>` element — there is no `as` / `href` polymorphism. A dial action is a navigation (`tel:`), and a `<button>` that assigns `window.location` loses the native affordances of an anchor: long-press to copy, open-in-new-context, and the correct screen-reader role ("link", not "button"). The `variant="link"` styling exists but the underlying element does not change, so the styling and the semantics disagree.
- **Props sketch:** wants `as?: ElementType` / `href?: string` on `ButtonProps`, rendering an `<a>` while keeping variant, size and icon slots.
- **Reuse potential:** HIGH — every `tel:`, `mailto:`, policy-PDF download and external-help link in the product hits this.

---

## Typography — the `variant` / `weight` API has no CSS at all

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** Every piece of text on the screen — plan names, benefit rows, the coverage and premium line, the page title.
- **Closest @acko component:** `Typography` (`@acko/typography`)
- **Why it didn't fit:** `typography.css@3.0.4` ships rules **only** for the newer `scale` + `emphasis` API (`.acko-text-sm`, `.acko-text-emphasis-bold`, …). It ships **no rules whatsoever** for the `variant` + `weight` API — `.acko-typography-heading-md`, `.acko-typography-body-sm`, `.acko-typography-weight-bold` and the rest are emitted by the component onto the DOM and styled by nothing.
  The effect is severe and completely silent: **every `<Typography variant="…">` renders at the inherited 16px/400.** Headings, body, labels and captions are visually identical, and `weight="bold"` does nothing. Measured on this screen before the fix: the page title, the plan name, the benefit rows and the premium were all 16px/400. The only text with correct styling was inside `Alert`, because `Alert` internally uses the `scale`/`emphasis` API.
  This is the most consequential gap found on this screen. The design system's own typography guidance mandates `<Typography variant="…">` for all text and forbids raw tags — so following the documented rule produces a page with no type hierarchy, and nothing warns you. All 16 variant classes and 4 weight classes are wired to their (existing, correct) font tokens in `src/index.css`.
- **Also worth flagging:** the shipped token scale is one step larger than the documented one — `heading-md` is 24px in `@acko/tokens@2.0.6` but 20px in the typography reference. Plan titles use `heading-sm` (20px) to match the design.
- **Props sketch:** no API change wanted — ship the missing `.acko-typography-*` rules, or drop the `variant`/`weight` props if `scale`/`emphasis` is the intended replacement. Right now both are in the type signature and only one works.
- **Reuse potential:** HIGH — this affects literally every screen built on the design system.

---

## CounterBadge / Badge — `color="red"` renders unstyled

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The unread indicator on the "Chat or call" pill — a red dot in the screenshot.
- **Closest @acko component:** `CounterBadge` (`@acko/badge`) — shipped with `color="red"` once the tokens were shimmed.
- **Why it didn't fit:** `BadgeColor` and `CounterBadgeColor` both list `"red"` in their TypeScript unions, and `badge.css` duly references `--badgeRedFill` / `--badgeRedText` / `--badgeRedGradientFrom` / `--badgeRedGradientTo` / `--badgeRedCounterFill` — but `@acko/tokens@2.0.6` defines **none** of them. `color="red"` therefore type-checks, passes lint, and renders with no fill at all: it fails completely silently, which is the worst kind of gap because nothing warns you. Red is the obvious hue for an unread or error indicator, so this gets reached for constantly. Same root cause as the package desync below; fixed by the shim rather than by avoiding the colour.
- **Props sketch:** no API change wanted — ship the missing `--badgeRed*` ramp (and `--badgeBlackGradient*`, `--badgeCountTextLight`, which are missing too).
- **Reuse potential:** HIGH — affects every notification count, error badge and alert chip in the product.

---

## Alert (plan eligibility notice)

- **Type:** VARIANT-GAP
- **Screen:** all-plans-platinum (14-all-plans-platinum.jpg)
- **What it is:** The bordered callout inside each plan card explaining the plan's material condition — mandatory medicals on Platinum, the deductible on Super Top-up.
- **Closest @acko component:** `Alert` (`@acko/alert`) — used as-is in the shipped screen; no override was needed once the content was reduced to a plain string.
- **Why it didn't fit:** `Alert` force-wraps `children` in a single `<Typography as="p" scale="sm" color="secondary">`. Two consequences worth fixing:
  1. **Children must be inline text only.** Passing a `Typography` — the house rule for all text, per typography.md's "never use raw HTML text tags" — produces `<p>` inside `<p>`: invalid DOM, and React logs a `validateDOMNesting` error. A list, a second paragraph, or an inline action inside an Alert is impossible for the same reason. The rule that all text goes through `Typography` and this component's API are in direct conflict.
  2. **Body colour and scale are locked.** Text is fixed at `--alertBodyText` → `--textSecondary` and `scale="sm"`, with no prop to change either, so the notice reads lighter than the near-primary text in the screenshot.
- **Props sketch:** unchanged API; wants `children: ReactNode` rendered without the wrapping `<p>` (or a `body` slot alongside it), plus an `action?: ReactNode` slot for a disclosure link.
- **Reuse potential:** HIGH — inline notices appear throughout the buy journey, claims and renewals, and any that need more than one line of plain text hit this wall.
- **Note:** an earlier draft clamped this notice to two lines behind a "Read more". Dropped — the notice is the plan's material condition, and hiding it is the "hidden condition" the design principles rule out. The clamp override is gone from `index.css`.

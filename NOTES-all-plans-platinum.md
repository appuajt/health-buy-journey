# All health plans — build notes

Screen `14-all-plans-platinum.jpg` (Health buy journey, variant B: ACKO Platinum →
ACKO Platinum Super Top-up). Assignee: Appu.

Run: `npm run dev` · Lint: `npm run lint` (zero errors) · Typecheck: `npx tsc -b` (clean)

- Force the quote failure path: `http://localhost:5173/?quoteError=1`
- Library gaps found while building: [`missing-components-all-plans-platinum.md`](missing-components-all-plans-platinum.md)

---

## What's in the screenshot, and what it's built from

| Region | Built with |
|---|---|
| Back arrow + title bar | `Button` (ghost, iconOnly) + `Typography` in a custom sticky bar |
| Plan card shell | `Card variant="primary"` |
| Eligibility notice | `Alert variant="warning"` |
| Benefit ticks | `@acko/icons` `Tick` + `Typography` |
| Dividers | `Separator separatorStyle="dashed"` |
| Coverage + premium line | `Typography` with `tabular-nums` |
| "View plan details" | `Button variant="primary" size="lg" fullWidth` |
| "Chat or call" pill | `Button` + `CounterBadge` in a fixed anchor |
| "Compare plans" bar | `Surface` in a fixed anchor |

---

## What I added that isn't in the screenshot

The screenshot is one frame of a page that has to load, fail, recover, and respond.
Everything below exists because the page isn't shippable without it.

**1. Loading skeletons.** Premiums come from the quote API, so the list is always async.
Three placeholder blocks per card match the real card's dimensions and radii exactly, so
nothing shifts when the quote lands.

**2. Quote failure + retry.** A pricing page with no error path is not shippable. States
what happened, reassures that prices aren't lost, and gives one way out. Retry re-fetches.

**3. Confirming state on the primary CTA.** "View plan details" opens a detail sheet whose
own CTA runs a real async step, using `Button`'s built-in `loading` — disabled and
`aria-busy` while in flight, so a double-tap can't fire it twice.

**4. Plan details sheet.** The card CTA needs a destination. Bottom sheet on mobile,
centred dialog from tablet up — the component downshift responsiveness.md mandates, using
the real `Drawer` and `Dialog` packages rather than a resized modal.

**5. Compare plans actually compares.** The button in the screenshot needs a destination
too. Opens a 3-column matrix — criteria down column 1, one column per plan — covering
coverage, premium, deductible, waiting period, room rent and medicals. Built on a native
`<table>` wearing the design system's own `.acko-table*` classes, since `@acko/table`'s
React package isn't published. Column headers use short plan labels ("Platinum",
"Super Top-up") so three columns stay readable at 360px without horizontal scroll.

**6. Contact sheet behind the chat pill.** Chat and call options; the unread indicator
clears on first open and doesn't come back.

**7. Motion.** Cards reveal at 300ms ease-out with a 56ms stagger; the top bar and bottom
bar pick up their hairline and elevation only once content scrolls under them. Values from
the ACKO motion system (`motion.medium.enter`, `motion.page.element-stagger`). All of it
collapses to a 150ms opacity fade under `prefers-reduced-motion`.

**8. Accessibility.** Labelled icon-only back button, benefit lists as real `<ul>`s, a
polite live region announcing load/error/ready, `role="alert"` on the error, focus rings
on the custom FAB anchor, 44px minimum tap targets, `touch-action: manipulation`.

---

## Decisions worth flagging

**Plans stack at every width; they are never side by side.** An earlier pass put them in a
2-up grid on tablet and desktop, following the "grids collapse" table in
responsiveness.md. Wrong call — this is a scrolling list of plans, not a card grid, and
side-by-side forces the eye to compare two dense cards at once when a dedicated compare
view already exists for that. One plan per row throughout, with the column capped at 560px
and centred so cards stay readable instead of stretching across a desktop screen.

**The chat pill no longer covers the CTA.** In the screenshot it sits directly on top of
"View plan details" — two tap targets in the same place. It's offset above the sticky bar,
and page content carries enough bottom padding that the last card's CTA clears both.

**The notices are never truncated.** I built a two-line clamp with a "Read more" first,
then removed it. The notice carries the plan's material condition — mandatory medicals,
the deductible — and hiding that is exactly the "hidden condition" the design principles
rule out. Both notices show in full.

**The primary CTA is brand purple, not black.** The screenshot's "View plan details" is
black. The design system defines the primary button as `--fillBrand` (purple), and the
project rules say semantic tokens only, so this follows the system. **If the black CTA is
intentional product direction, this is a one-line change** — say the word and I'll switch
it, but it needs a token, not a hardcoded colour.

**Back uses an arrow, not a chevron.** The screenshot shows `‹`. iconography.md is explicit:
arrows for navigation that leaves the context, chevrons for reveal-in-place. Back is
navigation, so `ArrowLeft`.

**Dashes, not dots, on the dividers.** `Separator` ships `solid | subtle | strong | dashed`.
Dashed is the closest available; rather than hand-roll a dotted rule I used the real
variant.

**Only these two plans render.** The header says "All health plans", but the assignment
scope is variant B — Platinum and Platinum Super Top-up. The list is data-driven, so more
plans need only a data change.

---

## The big one: `@acko/css` and `@acko/tokens` are out of sync

**`@acko/css@3.0.4` references roughly 170 tokens that `@acko/tokens@2.0.6` does not
define.** Mostly the `--color*` names removed in the tokens v2 rename; the rest were never
shipped at all.

This matters more than it sounds. An undefined `var()` invalidates the entire CSS
declaration, so the affected components render with **no fill, no border, or no radius** —
and nothing fails. No build error, no lint error, no console warning. You only catch it by
looking.

Verified on this screen alone:

| Component | Broken reference | Symptom |
|---|---|---|
| `Card` | `--radius5xl` | **Every card renders square** |
| `Surface` | `--surfaceBasePrimary` / `--surfaceBaseSecondary` | **Every surface renders transparent** |
| `Dialog` | 9 tokens incl. `--colorSurfaceRaised`, `--colorSurfaceOverlay` | **Panel and scrim both invisible** |
| `Skeleton` | `--colorDisabledBg` / `--colorSurface` | **Every skeleton invisible** |
| `Table` | 8 `--colorTable*` / `--colorText*` names | **No borders, no header fill** |
| `Badge` | `--badgeRed*` ramp | **`color="red"` renders unstyled** |
| `Button` | `--buttonFillSecondaryText`, `--buttonFillGhostText` | Secondary CTA loses its brand text colour |
| `Typography` | **no CSS at all** for the `variant`/`weight` API | **All text renders 16px/400 — the entire type hierarchy collapses** |

The `Typography` one deserves singling out. `typography.css@3.0.4` styles only the newer
`scale` + `emphasis` classes; it ships nothing for `variant` + `weight`, which the
component still emits and which the design system's own typography guidance tells you to
use for all text. Before the fix, the page title, plan names, benefit rows and premium
were *all* 16px/400 — measured, not guessed. All 16 variant classes and 4 weight classes
are now wired to their existing font tokens in `index.css`.

Related: the shipped token scale is one step larger than the documented one —
`heading-md` is 24px in `@acko/tokens@2.0.6` versus 20px in the typography reference — so
plan titles use `heading-sm` to match the design.

`src/index.css` carries a scoped compatibility shim for the components this screen uses,
mapped through the documented legacy → v2 migration table. It re-points names at real
tokens — no hardcoded values — and should be deleted once the packages are back in sync.

**Still broken and not shimmed:** wizard, toast, tabs, toggle, chip-selector, navbar,
slider, progress, calendar, and the inverted/danger button variants. Anyone whose screen
uses those will hit the same wall.

Separately, one genuine token-definition bug rather than a missing name:
`--alertWarningSurface` is aliased to `--statusWarningBorder`, the *same token as its own
border* — so a warning `Alert` fills solid with its border colour and the border
disappears. Re-pointed at `--statusWarningSubtle`.

**This is worth raising at the all-hands.** Every team is building on these packages, and
the failure mode is silent.

### A different kind of bug: `Drawer` has no open/close transition at all

Not a token gap — a logic bug in the packaged React component. `Drawer.js` collapses DOM
presence and the `-open` CSS class into the same `open` prop, so the panel's first paint
already has its final `transform: translate(0)` — there is no closed frame for the CSS
transition to animate from. Verified with a `requestAnimationFrame` trace: the panel's
position was frozen across ~40 frames (700ms) on open. Close has the same problem in
reverse — the DOM node is removed the instant `open` goes false, so the 350ms slide-out
never gets to run. `Dialog` does not have this bug, because it drives its animation with a
CSS `@keyframes` (which runs on insertion regardless of prior state) rather than a
class-toggled `transition`.

Fixed via `patch-package` — `patches/@acko+drawer+3.0.4.patch`, applied automatically on
`npm install` via a `postinstall` script — splitting the single `open` prop into `rendered`
(DOM presence) and `visible` (the `-open` class), with `visible` deferred two animation
frames after mount and `rendered` deferred 360ms after close so both transitions get a
real closed frame to run from. No change to the component's public API.

---

## Project setup notes

- **`eslint.config.js` did not exist** in the boilerplate, so `npm run lint` failed outright.
  Added the standard flat config (typescript-eslint + react-hooks + react-refresh).
- **Euclid Circular B was never loaded** — `index.css` set the family but no `@font-face`.
  Added all five weights from the ACKO CDN with `font-display: swap`.
- **Breakpoints:** added named `tablet` (600px) and `desktop` (1024px) screens so utilities
  match responsiveness.md rather than Tailwind's 768/1024 defaults. `--spacing` is untouched
  and still owned by `@acko/tokens`.
- **Installed packages differ from the documented component list.** Present but undocumented:
  `icons`, `chip`, `dialog`, `drawer`, `slider`, `surface`, `form`, `otp-input`. Documented
  but **not published to the registry**: `field`, `navigation-wizard`, `pagination`, `table`,
  `tabs`, `tooltip`. `@acko/css` ships stylesheets for all of them regardless, so the CSS
  imports resolve — only the React components are missing.

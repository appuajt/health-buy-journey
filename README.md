# D2C workshop — All health plans

Health buy journey, screen `14-all-plans-platinum.jpg` (variant B: ACKO Platinum →
ACKO Platinum Super Top-up). Built with the `@acko/*` design system.

## Run it

```bash
npm install
npm run dev
```

`.npmrc` points `@acko:*` at the internal Nexus registry, so you need to be on the
network for `npm install` to resolve the design system packages.

| Command | |
|---|---|
| `npm run dev` | Dev server on :5173 |
| `npm run lint` | ESLint — zero errors |
| `npm run build` | Typecheck + production build |

## Preview harness

Opened on a screen wider than 1100px, the app presents a reviewer shell: a **Mobile /
Web** toggle that renders the screen inside a device-sized frame. Below that width the
real screen takes the whole viewport.

The frame is an `<iframe>`, not a scaled-down `div`, so the screen's media queries and
its `position: fixed` chrome resolve against the frame's own viewport — the mobile
preview is genuinely 360px wide rather than a desktop render squeezed into a box.

Append `?embed=1` to load the bare screen with no harness.

## Things to try

- `/?quoteError=1` — forces the quote failure path, with retry
- **View plan details** — bottom sheet on mobile, dialog from tablet up, with a
  confirming state on its CTA
- **Compare plans** — 3-column comparison matrix
- **Chat or call** — contact options; the unread indicator clears on first open
- Resize across 390 / 768 / 1366px — one component tree, no viewport checks in code

## Read these

| File | |
|---|---|
| [`NOTES-all-plans-platinum.md`](NOTES-all-plans-platinum.md) | What was added beyond the screenshot and why, decisions worth challenging, and the package bugs found |
| [`missing-components-all-plans-platinum.md`](missing-components-all-plans-platinum.md) | The library-gap log required by the workshop protocol |
| [`CLAUDE.md`](CLAUDE.md) | The component sourcing rules this was built under |

## Heads-up for everyone else in the workshop

`@acko/css@3.0.4` references roughly 170 tokens that `@acko/tokens@2.0.6` does not
define, and `typography.css` ships no CSS at all for the `variant`/`weight` API that the
`Typography` component emits. Both fail **silently** — no build error, no lint error.
Symptoms include square cards, invisible skeletons, transparent surfaces and dialogs, and
a completely flat type hierarchy. `src/index.css` carries a scoped compatibility shim.

Separately, `@acko/drawer@3.0.4`'s `Drawer` component opens and closes with **no
transition at all** — a logic bug, not a token gap. Fixed via `patch-package`
(`patches/@acko+drawer+3.0.4.patch`, applied automatically on `npm install`). Details in
the notes file.

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
Details in the notes file.

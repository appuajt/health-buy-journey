# Component sourcing rules (D2C workshop — Health/Life buy journey)

These rules apply to EVERY UI element built in this project. They are not advisory.

## 1. Always try the library first

Before writing any custom UI, check whether an `@acko/*` component covers it. Available:
Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card (+ CardHeader /
CardContent / CardFooter), Checkbox, Dropdown, Field, InputGroup, Label,
NavigationWizard, Pagination, Progress, RadioGroup, ScrollArea, Separator, Skeleton,
Switch, Table (+ TableHeader / TableBody / TableRow / TableHead / TableCell), Tabs,
TextInput, Textarea, Toggle, Tooltip, Typography.

Import from the specific package — `import { Button } from "@acko/button"`.
Never `@acko/ui`; it does not exist.

## 2. When no library component fits, build it — then log it

If the screen needs something the library doesn't have (price slider, plan card, stepper
carousel, sticky price footer, chat bubble), build it as a local custom component.
**Immediately** after creating it, append an entry to a log file at the project root:

```
missing-components-<pagename>.md
```

`<pagename>` is the screen's slug from the assignment sheet, minus the number prefix —
e.g. `20-customise-sum-insured.jpg` → `missing-components-customise-sum-insured.md`.
One file per page. Create it on the first custom component, append after that.

Never skip the log entry. Never batch it for later. Log at the moment you build.

## 3. Log entry format

```markdown
## <ComponentName>
- **Type:** MISSING | VARIANT-GAP
- **Screen:** <pagename> (<screenshot file>)
- **What it is:** one sentence describing the element and where it appears on screen.
- **Closest @acko component:** <name, or "none">
- **Why it didn't fit:** what the existing component lacks (or "no comparable component exists").
- **Props sketch:** the prop interface you gave the custom component.
- **Reuse potential:** LOW | MEDIUM | HIGH — would other ACKO screens likely need this?
```

## 4. MISSING vs VARIANT-GAP

- **MISSING** — no library component comes close; built from scratch.
- **VARIANT-GAP** — a library component exists, but you had to wrap it, override its
  styles, or recreate it because it lacks a needed variant, size, or state (Button exists
  but has no loading state; Card exists but no gradient-header recipe). These matter just
  as much as fully missing components — log them.

## 5. What NOT to log

- Plain layout containers (flex/grid wrappers) with no visual identity of their own.
- One-off spacing/typography tweaks done through tokens.
- Compositions that are purely existing `@acko` components arranged together.

## 6. Everything else still applies

- Semantic colour tokens only — no raw hex, no primitive tokens.
- Zero ESLint errors.
- Matches the screenshot at 360–430px viewport, and scales to desktop.

# Tactical Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the main `tg-frontend` browsing flow into the approved B2 Balanced tactical, map-first CS2 lineup dashboard.

**Architecture:** Keep the existing Feature-Sliced-ish frontend boundaries: shared primitives in `shared`, domain rendering in `entities`, cross-entity composition in `widgets`, and route-level assembly in `pages`. The first pass uses existing backend data only: map-scoped search/filter/sort runs client-side over `MapPageModel.mapLineups`, home hub data is deterministic from existing maps/map details, and request actions preserve current status and permission behavior.

**Tech Stack:** React 18, Vite, TypeScript, TanStack Query, React Router, SCSS modules, Tailwind utility classes already present in the repo, Radix/shadcn primitives, lucide-react, Vitest/Storybook/Playwright-capable browser checks.

---

## Approved Inputs

- Spec: `docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md`
- Beads parent issue: `cs-smokes-2ed`
- Approved design: `B2 Balanced tactical`
- Approved mobile toolbar rule: search input, filter icon, and sort icon in one row; `Add lineup` full-width on the next row.
- No backend API changes.
- No new moderation statuses, permissions, or actions.
- Runtime must not depend on external UI-kit or mockup sites.

## File Structure

Create these files:

- `tg-frontend/src/shared/ui/tactical-page/tactical-page.tsx`: reusable page shell section primitives for tactical surfaces.
- `tg-frontend/src/shared/ui/tactical-page/tactical-page.module.scss`: tactical layout surfaces, headings, toolbar row primitives.
- `tg-frontend/src/shared/ui/tactical-page/index.ts`: barrel export.
- `tg-frontend/src/entities/grenade/lib/lineup-filters.ts`: pure client-side map lineup search/filter/sort functions over `GrenadeModel[]`.
- `tg-frontend/src/entities/grenade/lib/lineup-filters.test.ts`: focused unit tests for search, grenade type, status/property filters, sorting, and no-result behavior.
- `tg-frontend/src/entities/grenade/lib/request-status.ts`: request status label/color/action helpers preserving current behavior.
- `tg-frontend/src/entities/grenade/lib/request-status.test.ts`: helper tests for every request status.
- `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.tsx`: map list search/filter/sort/add toolbar.
- `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.module.scss`: mobile two-row toolbar layout with stable icon buttons.
- `tg-frontend/src/widgets/map-overview/model/use-map-lineup-controls.ts`: state/query-param adapter for client-side controls.
- `tg-frontend/src/pages/home-page/lib/select-home-hub-data.ts`: deterministic featured-map/recent-lineup selection helpers.
- `tg-frontend/src/pages/home-page/lib/select-home-hub-data.test.ts`: unit tests for featured map fallback and recent lineup sorting.
- `tg-frontend/scripts/sign-telegram-init-data.mjs`: local QA helper that signs Telegram WebApp init data with the configured backend `TOKEN`.
- `tg-frontend/scripts/find-tactical-qa-paths.mjs`: local QA helper that logs in, finds a map with lineups, and prints browser QA route paths.
- `tg-frontend/scripts/verify-tactical-layout.mjs`: standalone Playwright browser QA script for responsive screenshots and mobile toolbar geometry.

Modify these files:

- `tg-frontend/src/app/layout/layout.tsx`: use refreshed app shell classes and keep outlet/footer behavior.
- `tg-frontend/src/app/layout/layout.module.scss`: Balanced tactical base layout constraints.
- `tg-frontend/src/app/layout/footer/footer.tsx`: expose hub/home, maps, favorites, profile navigation with accessible labels.
- `tg-frontend/src/app/layout/footer/footer.module.scss`: compact 8px tactical navigation styling.
- `tg-frontend/src/app/index.scss`: add or tune CSS variables for dark neutral, elevated surfaces, teal primary, yellow accent, and 8px default radius.
- `tg-frontend/src/app/tailwind.css`: retune shadcn/Tailwind theme variables so Sheet, Select, Button, popover, and focus-ring surfaces use the Balanced tactical palette.
- `tg-frontend/src/shared/ui/button/button.tsx`: align shared Button variants with retuned tactical foreground/background pairs.
- `tg-frontend/src/shared/ui/button/button.module.scss`: remove old hover/foreground overrides that would break Button contrast.
- `tg-frontend/src/shared/ui/card/card.module.scss`: align shared card radius and surfaces with 8px default without breaking component API.
- `tg-frontend/src/shared/ui/badge/badge.tsx`: add request-aware color variants only if existing color set is insufficient.
- `tg-frontend/src/shared/ui/badge/badge.module.scss`: style request/status variants with text and non-color-readable treatment.
- `tg-frontend/src/entities/grenade/ui/grenade/grenade.tsx`: render compact tactical lineup card metadata and request/favorite/status slots.
- `tg-frontend/src/entities/grenade/ui/grenade/grenade.module.scss`: card layout, stable dimensions, mobile overflow priority.
- `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.tsx`: keep presentational list behavior and add empty/no-result copy support.
- `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.module.scss`: responsive grid/list density.
- `tg-frontend/src/widgets/map-overview/ui/map-overview.tsx`: wire client-side map scoped controls over `data.mapLineups`.
- `tg-frontend/src/widgets/map-overview/ui/map-overview.module.scss`: tactical map hero/list layout.
- `tg-frontend/src/widgets/map-overview/ui/map-overview.stories.tsx`: update story play checks for toolbar and loaded state.
- `tg-frontend/src/pages/home-page/home-page.tsx`: replace landing page with map-first home hub.
- `tg-frontend/src/pages/home-page/home-page.module.scss`: home hub tactical layout.
- `tg-frontend/src/pages/grenade-page/ui/grenade-page.tsx`: fetch map name when possible, preserve fallback, keep favorite/video actions.
- `tg-frontend/src/pages/grenade-page/ui/grenade-page.module.scss`: media-first detail layout and actions.
- `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.tsx`: media-first overview accepting optional map label and request action display.
- `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.module.scss`: detail typography, media, metadata rows.
- `tg-frontend/src/entities/grenade/ui/grenade-overview/__tests__.ts`: update coverage for loading/error/empty/detail metadata.

Do not modify:

- Backend files.
- DTO schemas except for frontend-only helper functions that consume already existing fields.
- Request status union values.
- Permission logic.

## Task 0: Create Beads Child Issues

**Files:**
- No source files.
- Beads CLI state only.

- [ ] **Step 1: Create implementation issue for tokens and app shell**

Run:

```bash
bd create --title="Redesign tactical app shell and visual tokens" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Implement the B2 Balanced tactical app shell, navigation, and visual tokens. Acceptance: hub/home, maps, favorites, profile, and Add lineup are visible; 8px default radius and dark neutral/teal/yellow tokens are applied; navigation is usable without hover-only interaction; primary, muted, accent, and status text meets the contrast criteria in the plan. Verification: tg-frontend type-check, lint, build, contrast evidence, and browser inspection at 390/768/1440px." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 2: Create implementation issue for home hub**

Run:

```bash
bd create --title="Redesign home hub as map-first dashboard" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Replace the generic homepage with a map-first tactical dashboard using deterministic existing map and lineup data. Acceptance: / shows featured map fallback, an in-page map selector/list that updates selected-map lineups without leaving the hub, search entry, fast filters for grenade class, approval, favorite, request status, and property name/value metadata via the shared lineup filtering helper, favorite/request state, and empty/loading/error states without fake runtime data. Depends on tactical app shell and shared helper issues. Verification: focused browser checks for map selection, search, filters, loaded, empty, loading, and error states." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 3: Create implementation issue for map lineup list controls**

Run:

```bash
bd create --title="Redesign map lineup list controls and client-side filtering" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Add selected-map search, grenade-type selection, filter sheet, sort controls, no-result state, and approved mobile toolbar layout over MapPageModel.mapLineups. Acceptance: client-side filters cover title, description, creator username, grenade class, properties, isApproved, isFavorite, every request.status, and property chips; sort covers date/title/views; Add lineup is full-width below search/filter/sort on mobile. Verification: focused checks at 390/768/1440px for search, filters, sort, no-result, loading, error, and detail navigation." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 4: Create implementation issue for shared filtering and request helpers**

Run:

```bash
bd create --title="Add shared lineup filter and request-status helpers" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Add pure client-side lineup search/filter/sort helpers and request-status display/link helpers used by map lists, cards, and details. Acceptance: helpers cover title, description, creator username, grenade class, properties, isApproved, isFavorite, every request.status, property chips, date/title/views sorting, and request detail hrefs without adding statuses or permissions. Verification: cd tg-frontend && npx vitest run src/entities/grenade/lib/lineup-filters.test.ts src/entities/grenade/lib/request-status.test.ts." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 5: Create implementation issue for lineup cards**

Run:

```bash
bd create --title="Redesign lineup cards with tactical metadata" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Redesign lineup cards to show preview, title, grenade class, key properties, approved state, favorite state, request state, request links, and the existing bottomSlot favorite action with mobile overflow priority. Acceptance: cards remain compact, preserve ToggleFavorites via bottomSlot, expose WAITING FOR CREATION/OPEN/APPROVED/REJECTED/MERGED/CLOSED states, link to request details when request_id exists, and do not hide critical metadata on mobile. Verification: component/story or browser checks for request statuses, request links, favorite action slot, and mobile overflow." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 6: Create implementation issue for lineup detail**

Run:

```bash
bd create --title="Redesign lineup detail as media-first tactical view" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Redesign /grenades/:grenadeId so media appears first, then title, map name or Map #<mapId> fallback, grenade class, approval/request state, description, properties, creator, favorite, and request links/actions following the spec matrix. Acceptance: no new statuses, permissions, or request actions; detail links to request details when request_id exists; detail renders even when map name fetch fails. Verification: browser checks for media-first layout, map fallback, every request status, request links, and creator/non-creator action visibility where existing contexts support it." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 7: Create implementation issue for focused tests and gates**

Run:

```bash
bd create --title="Add focused redesign tests and run frontend gates" --description="Parent: cs-smokes-2ed. Spec: docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md. Add or update focused tests for the tactical redesign and run frontend quality gates. Acceptance: executable tests or Storybook play checks cover map lineup search/filter/sort, mobile toolbar rule, card metadata, favorite slot, detail layout, map fallback, empty/loading/error states, request action matrix, contrast acceptance, and no backend behavior changes. Verification: cd tg-frontend && npm run type-check && npm run lint && npm run build, plus changed focused tests, Playwright layout QA, and contrast evidence." --type=task --priority=2 --parent cs-smokes-2ed --spec-id docs/superpowers/specs/2026-07-02-tactical-dashboard-redesign-design.md
```

Expected: prints a new issue id.

- [ ] **Step 8: Add dependencies between child issues**

After recording issue ids from Steps 1-7, run dependency commands in this pattern:

```bash
bd dep add <home-hub-issue> <tokens-shell-issue>
bd dep add <home-hub-issue> <helper-issue>
bd dep add <map-list-issue> <tokens-shell-issue>
bd dep add <helper-issue> <tokens-shell-issue>
bd dep add <map-list-issue> <helper-issue>
bd dep add <lineup-card-issue> <tokens-shell-issue>
bd dep add <lineup-card-issue> <helper-issue>
bd dep add <lineup-detail-issue> <lineup-card-issue>
bd dep add <lineup-detail-issue> <helper-issue>
bd dep add <tests-gates-issue> <tokens-shell-issue>
bd dep add <tests-gates-issue> <helper-issue>
bd dep add <tests-gates-issue> <home-hub-issue>
bd dep add <tests-gates-issue> <map-list-issue>
bd dep add <tests-gates-issue> <lineup-card-issue>
bd dep add <tests-gates-issue> <lineup-detail-issue>
```

Expected: dependencies are added; `bd show <tests-gates-issue>` lists all implementation blockers.

- [ ] **Step 9: Claim child issues before implementation**

Before starting each implementation task, claim its Beads issue:

```bash
bd update <tokens-shell-issue> --claim
bd update <helper-issue> --claim
bd update <home-hub-issue> --claim
bd update <map-list-issue> --claim
bd update <lineup-card-issue> --claim
bd update <lineup-detail-issue> --claim
bd update <tests-gates-issue> --claim
```

Expected: child issues are marked in progress/assigned before work begins; Task 7 closes only issues whose verification evidence passed.

## Task 1: Tactical Tokens And App Shell

**Files:**
- Create: `tg-frontend/src/shared/ui/tactical-page/tactical-page.tsx`
- Create: `tg-frontend/src/shared/ui/tactical-page/tactical-page.module.scss`
- Create: `tg-frontend/src/shared/ui/tactical-page/index.ts`
- Modify: `tg-frontend/src/app/index.scss`
- Modify: `tg-frontend/src/app/tailwind.css`
- Modify: `tg-frontend/src/app/layout/layout.tsx`
- Modify: `tg-frontend/src/app/layout/layout.module.scss`
- Modify: `tg-frontend/src/app/layout/footer/footer.tsx`
- Modify: `tg-frontend/src/app/layout/footer/footer.module.scss`
- Modify: `tg-frontend/src/shared/ui/button/button.tsx`
- Modify: `tg-frontend/src/shared/ui/button/button.module.scss`
- Modify: `tg-frontend/src/shared/ui/card/card.module.scss`
- Modify: `tg-frontend/src/shared/ui/badge/badge.tsx`
- Modify: `tg-frontend/src/shared/ui/badge/badge.module.scss`

- [ ] **Step 1: Inspect current app shell and footer**

Run:

```bash
sed -n '1,220p' tg-frontend/src/app/layout/layout.tsx
sed -n '1,260p' tg-frontend/src/app/layout/layout.module.scss
sed -n '1,260p' tg-frontend/src/app/layout/footer/footer.tsx
sed -n '1,260p' tg-frontend/src/app/layout/footer/footer.module.scss
```

Expected: confirms current `Layout` wraps `<Outlet />` and `<Footer />`, and footer owns bottom navigation.

- [ ] **Step 2: Add tactical page shared primitives**

Create `tg-frontend/src/shared/ui/tactical-page/tactical-page.tsx`:

```tsx
import { ComponentProps, ReactNode } from "react"
import clsx from "clsx"
import classes from "./tactical-page.module.scss"

type TacticalPageProps = ComponentProps<"section"> & {
    eyebrow?: string
    title?: string
    subtitle?: string
    action?: ReactNode
}

export function TacticalPage({
    eyebrow,
    title,
    subtitle,
    action,
    children,
    className,
    ...rest
}: TacticalPageProps) {
    return (
        <section className={clsx(classes.page, className)} {...rest}>
            {(eyebrow || title || subtitle || action) && (
                <div className={classes.header}>
                    <div className={classes.headerText}>
                        {eyebrow && (
                            <p className={classes.eyebrow}>{eyebrow}</p>
                        )}
                        {title && <h1 className={classes.title}>{title}</h1>}
                        {subtitle && (
                            <p className={classes.subtitle}>{subtitle}</p>
                        )}
                    </div>
                    {action && <div className={classes.action}>{action}</div>}
                </div>
            )}
            {children}
        </section>
    )
}

export function TacticalSurface({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={clsx(classes.surface, className)} {...props} />
}

export function TacticalToolbar({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={clsx(classes.toolbar, className)} {...props} />
}
```

- [ ] **Step 3: Add tactical page styles**

Create `tg-frontend/src/shared/ui/tactical-page/tactical-page.module.scss`:

```scss
.page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}

.headerText {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
}

.eyebrow {
    margin: 0;
    font-size: var(--ui-small);
    font-weight: 700;
    color: var(--tactical-primary);
}

.title {
    margin: 0;
    font-size: 28px;
    line-height: 1.05;
}

.subtitle {
    margin: 0;
    color: var(--muted-foreground);
}

.action {
    flex: 0 0 auto;
}

.surface {
    width: 100%;
    padding: 12px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
}

.toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
}

@media (max-width: 540px) {
    .header {
        flex-direction: column;
    }

    .title {
        font-size: 24px;
    }
}
```

- [ ] **Step 4: Export tactical page primitives**

Create `tg-frontend/src/shared/ui/tactical-page/index.ts`:

```ts
export { TacticalPage, TacticalSurface, TacticalToolbar } from "./tactical-page"
```

- [ ] **Step 5: Add Balanced tactical CSS variables**

Modify `tg-frontend/src/app/index.scss` after current imports by adding:

```scss
:root {
    --tactical-radius: 8px;
    --tactical-surface: #1f2937;
    --tactical-surface-soft: #243041;
    --tactical-primary: #2dd4bf;
    --tactical-primary-foreground: #042f2e;
    --tactical-warning: #facc15;
    --tactical-success: #22c55e;
    --tactical-danger: #ef4444;

    /* Redesign-visible shared tokens are retuned so existing Button/Badge APIs do not keep the old purple accent. */
    --color-accent: var(--tactical-primary);
    --color-success: var(--tactical-success);
    --color-danger: var(--tactical-danger);
}
```

When the file already has equivalent color variables, keep them only if the rendered redesign still matches the Balanced tactical palette and passes contrast checks. Do not leave redesigned surfaces on the old purple `--color-accent`; either retune shared `--color-accent`/status variables as above or use `--tactical-primary`, `--tactical-warning`, and contrast-checked status variables directly in the new component styles.

- [ ] **Step 6: Retune shadcn/Tailwind theme variables**

Modify `tg-frontend/src/app/tailwind.css` so both `:root` and `.dark` theme variables used by shadcn primitives match the Balanced tactical palette. At minimum, retune:

```css
:root,
.dark {
    --background: oklch(0.21 0.03 260);
    --foreground: oklch(0.96 0.01 250);
    --card: oklch(0.24 0.035 260);
    --card-foreground: var(--foreground);
    --popover: oklch(0.24 0.035 260);
    --popover-foreground: var(--foreground);
    --primary: oklch(0.78 0.13 185);
    --primary-foreground: oklch(0.18 0.04 185);
    --secondary: oklch(0.29 0.035 260);
    --secondary-foreground: var(--foreground);
    --muted: oklch(0.29 0.035 260);
    --muted-foreground: oklch(0.78 0.025 250);
    --accent: oklch(0.78 0.13 185);
    --accent-foreground: oklch(0.18 0.04 185);
    --destructive: oklch(0.64 0.21 25);
    --destructive-foreground: var(--foreground);
    --border: oklch(0.36 0.035 260);
    --input: oklch(0.32 0.035 260);
    --ring: oklch(0.78 0.13 185);
}
```

Expected: `SheetContent` (`bg-background`), `SelectContent` (`bg-popover`), shadcn buttons, focus rings, and popovers render as dark tactical surfaces with teal primary/accent tokens, not default light shadcn surfaces.

- [ ] **Step 7: Align shared Button contrast with tactical tokens**

Inspect `tg-frontend/src/shared/ui/button/button.tsx` and `tg-frontend/src/shared/ui/button/button.module.scss`.

The current default Button variant may combine `bg-[var(--color-background-alt)]` with `text-primary-foreground`, which is low contrast after the tactical theme retune. Update the Button variants so the default variant uses a verified foreground/background pair. Prefer:

```ts
default:
    "bg-[var(--tactical-primary)] text-[var(--tactical-primary-foreground)] shadow-xs hover:bg-primary/90",
```

If the implementation keeps a dark/elevated default button instead, it must use a high-contrast foreground such as `text-[var(--color-text-main)]` and reserve `text-primary-foreground` only for teal primary backgrounds. Remove or narrow any `button.module.scss` hover rule that globally changes every Button to teal text on `--color-background-alt` when that reduces contrast or overrides variant intent.

Expected: `default`, `secondary`, `outline`, `ghost`, `link`, and icon-sized Buttons remain visually distinct, keep visible focus states, and pass the Task 7 contrast checks on dark tactical surfaces.

- [ ] **Step 8: Refresh layout classes without changing routing**

Modify `tg-frontend/src/app/layout/layout.module.scss` so `.page` and `.content` keep existing structure but use tactical spacing:

```scss
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: calc(var(--max-content-size) - 2 * var(--site-padding-x));
    min-height: 100%;
    padding-block: var(--site-padding-y);
    padding-inline: var(--site-padding-x);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
    padding-bottom: toRem(100);
}
```

Preserve `.appContainer` and any existing background behavior unless the file already contains equivalent styling.

- [ ] **Step 9: Refresh footer navigation**

Modify `tg-frontend/src/app/layout/footer/footer.tsx` to use lucide icons and accessible labels. Keep existing route destinations if they differ after inspection.

```tsx
import { Link, useLocation } from "react-router-dom"
import { Heart, Home, Map, Plus, User } from "lucide-react"
import clsx from "clsx"
import classes from "./footer.module.scss"

const links = [
    { to: "/", label: "Hub", icon: Home },
    { to: "/maps", label: "Maps", icon: Map },
    { to: "/grenades/create", label: "Add lineup", icon: Plus },
    { to: "/favorites", label: "Favorites", icon: Heart },
    { to: "/profile", label: "Profile", icon: User },
]

export function Footer() {
    const location = useLocation()

    return (
        <nav className={classes.footer} aria-label='Primary navigation'>
            {links.map(({ to, label, icon: Icon }) => {
                const isActive =
                    to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(to)

                return (
                    <Link
                        key={to}
                        to={to}
                        aria-label={label}
                        className={clsx(classes.link, {
                            [classes.active]: isActive,
                        })}
                    >
                        <Icon aria-hidden='true' size={18} />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
```

- [ ] **Step 10: Style footer navigation**

Modify `tg-frontend/src/app/layout/footer/footer.module.scss`:

```scss
.footer {
    position: sticky;
    bottom: var(--site-padding-y);
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
    width: 100%;
    padding: 8px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: color-mix(in srgb, var(--color-background-alt) 92%, transparent);
    backdrop-filter: blur(16px);
}

.link {
    display: flex;
    min-width: 0;
    min-height: 44px;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    border-radius: var(--tactical-radius);
    color: var(--muted-foreground);
    font-size: 11px;
    text-decoration: none;
}

.active {
    background: color-mix(in srgb, var(--tactical-primary) 18%, transparent);
    color: var(--tactical-primary);
}
```

- [ ] **Step 11: Align shared card radius**

Modify `tg-frontend/src/shared/ui/card/card.module.scss` so `.card` uses 8px unless an existing token forces otherwise:

```scss
.card {
    display: flex;
    flex-direction: column;
    gap: toRem(10);
    padding: toRem(10);
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background-color: var(--color-background-alt);
}
```

Keep existing nested `.cardComponent` rules unless they conflict with 8px radius.

- [ ] **Step 12: Align shared Badge colors with tactical tokens**

Inspect `tg-frontend/src/shared/ui/badge/badge.tsx` and `tg-frontend/src/shared/ui/badge/badge.module.scss`.

Keep the existing `Badge color='accent' | 'success' | 'danger'` API only if those variants render through the retuned `--color-accent`, `--color-success`, and `--color-danger` variables from Step 5. If the badge module hardcodes or imports old palette values, replace those styles with the tactical variables or add explicit request/status variants that use `--tactical-primary`, `--tactical-success`, and `--tactical-danger`.

Expected: every redesigned `Badge color='accent'` renders teal, not the old purple accent; success/danger badges remain text-labeled and pass the contrast criteria in Task 7.

- [ ] **Step 13: Run fast frontend checks**

Run:

```bash
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
```

Expected: both commands exit 0. If existing unrelated lint failures appear, record exact files and continue only after confirming they are unrelated to this task.

- [ ] **Step 14: Commit task 1**

Run:

```bash
git add tg-frontend/src/app/index.scss tg-frontend/src/app/tailwind.css tg-frontend/src/app/layout tg-frontend/src/shared/ui/tactical-page tg-frontend/src/shared/ui/button tg-frontend/src/shared/ui/card/card.module.scss tg-frontend/src/shared/ui/badge
git commit -m "feat(frontend): add tactical app shell tokens"
```

Expected: commit succeeds.

## Task 2: Client-Side Lineup Filtering And Request Helpers

**Files:**
- Create: `tg-frontend/src/entities/grenade/lib/lineup-filters.ts`
- Create: `tg-frontend/src/entities/grenade/lib/lineup-filters.test.ts`
- Create: `tg-frontend/src/entities/grenade/lib/request-status.ts`
- Create: `tg-frontend/src/entities/grenade/lib/request-status.test.ts`
- Modify: `tg-frontend/src/entities/grenade/index.ts`

- [ ] **Step 1: Write failing tests for lineup filtering**

Create `tg-frontend/src/entities/grenade/lib/lineup-filters.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { GrenadeModel } from "../model/domain"
import { filterAndSortLineups } from "./lineup-filters"

const base: GrenadeModel = {
    grenadeId: 1,
    mapId: 1,
    grenadeClass: {
        grenadeClassId: 10,
        name: "Smoke",
        description: "Smoke grenade",
        price: 300,
    },
    propertyList: [{ propertyId: 1, name: "tickrate", value: "64" }],
    linkToVideo: "https://example.com/video",
    creator: {
        userId: 1,
        username: "daniil",
        avatarUrl: null,
        firstName: null,
        lastName: null,
    },
    createdAt: "2026-01-01T00:00:00Z",
    title: "Window smoke",
    description: "T spawn lineup",
    isApproved: true,
    isFavorite: false,
    views: 10,
    previewImageLink: null,
    request: { request_id: null, status: "WAITING FOR CREATION" },
}

const flash: GrenadeModel = {
    ...base,
    grenadeId: 2,
    title: "Connector pop flash",
    description: "Fast mid support",
    grenadeClass: {
        grenadeClassId: 11,
        name: "Flashbang",
        description: "Flash grenade",
        price: 200,
    },
    propertyList: [{ propertyId: 2, name: "jumpthrow", value: "yes" }],
    creator: { ...base.creator, username: "alex" },
    createdAt: "2026-02-01T00:00:00Z",
    isApproved: false,
    isFavorite: true,
    views: 40,
    request: { request_id: 7, status: "OPEN" },
}

describe("filterAndSortLineups", () => {
    it("searches title, description, creator, grenade class, and properties", () => {
        expect(filterAndSortLineups([base, flash], { search: "window" })).toEqual([base])
        expect(filterAndSortLineups([base, flash], { search: "support" })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { search: "alex" })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { search: "flashbang" })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { search: "jumpthrow" })).toEqual([flash])
    })

    it("filters by grenade type, approved, favorite, request status, and property", () => {
        expect(filterAndSortLineups([base, flash], { grenadeClassName: "Smoke" })).toEqual([base])
        expect(filterAndSortLineups([base, flash], { isApproved: false })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { isFavorite: true })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { requestStatus: "OPEN" })).toEqual([flash])
        expect(filterAndSortLineups([base, flash], { property: "tickrate:64" })).toEqual([base])
    })

    it("sorts by date, title, and views", () => {
        expect(filterAndSortLineups([base, flash], { sort: "createdAt-desc" })).toEqual([flash, base])
        expect(filterAndSortLineups([base, flash], { sort: "createdAt-asc" })).toEqual([base, flash])
        expect(filterAndSortLineups([base, flash], { sort: "title-asc" })).toEqual([flash, base])
        expect(filterAndSortLineups([base, flash], { sort: "title-desc" })).toEqual([base, flash])
        expect(filterAndSortLineups([base, flash], { sort: "views-desc" })).toEqual([flash, base])
        expect(filterAndSortLineups([base, flash], { sort: "views-asc" })).toEqual([base, flash])
    })
})
```

- [ ] **Step 2: Run filtering tests and verify they fail**

Run:

```bash
cd tg-frontend && npx vitest run src/entities/grenade/lib/lineup-filters.test.ts
```

Expected: FAIL because `lineup-filters.ts` does not exist.

- [ ] **Step 3: Implement lineup filtering helpers**

Create `tg-frontend/src/entities/grenade/lib/lineup-filters.ts`:

```ts
import { GrenadeModel } from "../model/domain"

type RequestStatus = GrenadeModel["request"]["status"]

export type LineupSort =
    | "createdAt-desc"
    | "createdAt-asc"
    | "title-asc"
    | "title-desc"
    | "views-desc"
    | "views-asc"

export type LineupFilterState = {
    search?: string
    grenadeClassId?: number
    grenadeClassName?: string
    isApproved?: boolean
    isFavorite?: boolean
    requestStatus?: RequestStatus
    property?: string
    sort?: LineupSort
}

function normalize(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? ""
}

function searchableText(lineup: GrenadeModel) {
    return [
        lineup.title,
        lineup.description,
        lineup.creator.username,
        lineup.grenadeClass.name,
        ...lineup.propertyList.flatMap((property) => [
            property.name,
            property.value,
            `${property.name}:${property.value}`,
        ]),
    ]
        .map(normalize)
        .join(" ")
}

function hasProperty(lineup: GrenadeModel, propertyFilter: string) {
    const expected = normalize(propertyFilter)

    return lineup.propertyList.some((property) => {
        const name = normalize(property.name)
        const value = normalize(property.value)

        return (
            name === expected ||
            value === expected ||
            `${name}:${value}` === expected
        )
    })
}

export function filterAndSortLineups(
    lineups: GrenadeModel[],
    filters: LineupFilterState
) {
    const search = normalize(filters.search)
    const grenadeClassName = normalize(filters.grenadeClassName)

    const filtered = lineups.filter((lineup) => {
        if (search && !searchableText(lineup).includes(search)) return false
        if (
            filters.grenadeClassId &&
            lineup.grenadeClass.grenadeClassId !== filters.grenadeClassId
        ) {
            return false
        }
        if (
            grenadeClassName &&
            normalize(lineup.grenadeClass.name) !== grenadeClassName
        ) {
            return false
        }
        if (
            filters.isApproved !== undefined &&
            lineup.isApproved !== filters.isApproved
        ) {
            return false
        }
        if (
            filters.isFavorite !== undefined &&
            lineup.isFavorite !== filters.isFavorite
        ) {
            return false
        }
        if (
            filters.requestStatus &&
            lineup.request.status !== filters.requestStatus
        ) {
            return false
        }
        if (filters.property && !hasProperty(lineup, filters.property)) {
            return false
        }

        return true
    })

    return [...filtered].sort((a, b) => {
        switch (filters.sort) {
            case "createdAt-asc":
                return Date.parse(a.createdAt) - Date.parse(b.createdAt)
            case "createdAt-desc":
            case undefined:
                return Date.parse(b.createdAt) - Date.parse(a.createdAt)
            case "title-asc":
                return a.title.localeCompare(b.title)
            case "title-desc":
                return b.title.localeCompare(a.title)
            case "views-asc":
                return a.views - b.views
            case "views-desc":
                return b.views - a.views
            default:
                return 0
        }
    })
}
```

- [ ] **Step 4: Write failing tests for request status helpers**

Create `tg-frontend/src/entities/grenade/lib/request-status.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { getLineupRequestDisplay } from "./request-status"

describe("getLineupRequestDisplay", () => {
    it("maps every request status to display text without changing actions", () => {
        expect(getLineupRequestDisplay({ request_id: null, status: "WAITING FOR CREATION" })).toMatchObject({
            label: "No request yet",
            canLinkToRequest: false,
        })
        expect(getLineupRequestDisplay({ request_id: 1, status: "OPEN" })).toMatchObject({
            label: "Open request",
            canLinkToRequest: true,
            href: "/requests/1",
        })
        expect(getLineupRequestDisplay({ request_id: 2, status: "APPROVED" }).label).toBe("Request approved")
        expect(getLineupRequestDisplay({ request_id: 3, status: "REJECTED" }).label).toBe("Request rejected")
        expect(getLineupRequestDisplay({ request_id: 4, status: "MERGED" }).label).toBe("Request merged")
        expect(getLineupRequestDisplay({ request_id: 5, status: "CLOSED" }).label).toBe("Request closed")
    })
})
```

- [ ] **Step 5: Run request status tests and verify they fail**

Run:

```bash
cd tg-frontend && npx vitest run src/entities/grenade/lib/request-status.test.ts
```

Expected: FAIL because `request-status.ts` does not exist.

- [ ] **Step 6: Implement request status helpers**

Create `tg-frontend/src/entities/grenade/lib/request-status.ts`:

```ts
import { GrenadeModel } from "../model/domain"

type RequestState = GrenadeModel["request"]

export type RequestDisplay = {
    label: string
    tone: "neutral" | "success" | "danger" | "warning"
    canLinkToRequest: boolean
    href: string | null
}

export function getLineupRequestDisplay(request: RequestState): RequestDisplay {
    const canLinkToRequest = request.request_id !== null
    const href = request.request_id ? `/requests/${request.request_id}` : null

    switch (request.status) {
        case "WAITING FOR CREATION":
            return { label: "No request yet", tone: "neutral", canLinkToRequest: false, href: null }
        case "OPEN":
            return { label: "Open request", tone: "warning", canLinkToRequest, href }
        case "APPROVED":
            return { label: "Request approved", tone: "success", canLinkToRequest, href }
        case "REJECTED":
            return { label: "Request rejected", tone: "danger", canLinkToRequest, href }
        case "MERGED":
            return { label: "Request merged", tone: "success", canLinkToRequest, href }
        case "CLOSED":
            return { label: "Request closed", tone: "danger", canLinkToRequest, href }
    }
}
```

- [ ] **Step 7: Export helpers**

Modify `tg-frontend/src/entities/grenade/index.ts`:

```ts
export type { LineupFilterState, LineupSort } from "./lib/lineup-filters"
export { filterAndSortLineups } from "./lib/lineup-filters"
export { getLineupRequestDisplay } from "./lib/request-status"
```

Keep all existing exports in the file.

- [ ] **Step 8: Run helper tests**

Run:

```bash
cd tg-frontend && npx vitest run src/entities/grenade/lib/lineup-filters.test.ts src/entities/grenade/lib/request-status.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit task 2**

Run:

```bash
git add tg-frontend/src/entities/grenade/lib tg-frontend/src/entities/grenade/index.ts
git commit -m "feat(frontend): add lineup filtering helpers"
```

Expected: commit succeeds.

## Task 3: Tactical Lineup Cards

**Files:**
- Modify: `tg-frontend/src/entities/grenade/ui/grenade/grenade.tsx`
- Modify: `tg-frontend/src/entities/grenade/ui/grenade/grenade.module.scss`
- Modify: `tg-frontend/src/entities/grenade/ui/grenade/grenade.stories.tsx`
- Modify: `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.tsx`
- Modify: `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.module.scss`

- [ ] **Step 1: Inspect existing card story and mock data**

Run:

```bash
sed -n '1,260p' tg-frontend/src/entities/grenade/ui/grenade/grenade.stories.tsx
sed -n '1,240p' tg-frontend/src/entities/grenade/model/__mocks__.ts
```

Expected: identify available mock lineups and current story shape.

- [ ] **Step 2: Rewrite lineup card component**

Modify `tg-frontend/src/entities/grenade/ui/grenade/grenade.tsx`:

```tsx
import { Link } from "react-router-dom"
import React, { ReactNode } from "react"
import { Eye, Heart, ShieldCheck } from "lucide-react"
import { GrenadeModel } from "../../model/domain"
import classes from "./grenade.module.scss"
import { Badge } from "@shared/ui/badge"
import { ImageComponent } from "@shared/ui/image"
import { getLineupRequestDisplay } from "../../lib/request-status"

type GrenadeProps = React.ComponentProps<"article"> & {
    grenade: GrenadeModel
    bottomSlot?: ReactNode
    className?: string
    isLoading?: boolean
    isError?: boolean
}

export function Grenade({
    grenade,
    bottomSlot,
    className,
    isLoading: _isLoading,
    isError: _isError,
    ...rest
}: GrenadeProps) {
    const requestDisplay = getLineupRequestDisplay(grenade.request)
    const propertyPreview = grenade.propertyList.slice(0, 3)

    return (
        <article
            className={[classes.card, className].filter(Boolean).join(" ")}
            {...rest}
        >
            <Link
                className={classes.mainLink}
                to={`/grenades/${grenade.grenadeId}`}
                aria-label={`Open lineup ${grenade.title}`}
            >
                <ImageComponent
                    className={classes.preview}
                    url={grenade.previewImageLink}
                    alt={`"${grenade.title}" preview`}
                    skeletonClasses={classes.previewSkeleton}
                />
                <div className={classes.body}>
                    <div className={classes.headingRow}>
                        <h3 className={classes.title}>{grenade.title}</h3>
                        {grenade.isFavorite && (
                            <Heart
                                className={classes.favorite}
                                aria-label='Favorite'
                                size={16}
                                fill='currentColor'
                            />
                        )}
                    </div>
                    <div className={classes.metaRow}>
                        <Badge color='accent'>{grenade.grenadeClass.name}</Badge>
                        {grenade.isApproved ? (
                            <Badge color='success'>
                                <ShieldCheck size={12} aria-hidden='true' />
                                Approved
                            </Badge>
                        ) : (
                            <Badge color='danger'>Not approved</Badge>
                        )}
                    </div>
                    <div className={classes.propertyRow}>
                        {propertyPreview.map((property) => (
                            <span
                                key={property.propertyId}
                                className={classes.property}
                            >
                                {property.name}: {property.value}
                            </span>
                        ))}
                    </div>
                    <div className={classes.footerRow}>
                        <span className={classes.request}>
                            {requestDisplay.label}
                        </span>
                        <span className={classes.views}>
                            <Eye size={13} aria-hidden='true' />
                            {grenade.views}
                        </span>
                    </div>
                </div>
            </Link>
            <div className={classes.actionRow}>
                {requestDisplay.href && (
                    <Link className={classes.requestLink} to={requestDisplay.href}>
                        View request
                    </Link>
                )}
                {bottomSlot && <div className={classes.actionSlot}>{bottomSlot}</div>}
            </div>
        </article>
    )
}
```

- [ ] **Step 3: Style tactical card**

Modify `tg-frontend/src/entities/grenade/ui/grenade/grenade.module.scss`:

```scss
.card {
    width: 100%;
    min-height: 116px;
    padding: 10px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
    cursor: pointer;
}

.mainLink {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 10px;
    color: inherit;
    text-decoration: none;

    &:focus-visible {
        outline: 2px solid var(--tactical-primary);
        outline-offset: 2px;
    }
}

.preview,
.previewSkeleton {
    width: 96px;
    height: 96px;
    border-radius: var(--tactical-radius);
    object-fit: cover;
}

.body {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 7px;
}

.headingRow,
.metaRow,
.propertyRow,
.footerRow {
    display: flex;
    min-width: 0;
    gap: 6px;
    align-items: center;
}

.headingRow,
.footerRow {
    justify-content: space-between;
}

.title {
    overflow: hidden;
    margin: 0;
    font-size: 15px;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.favorite {
    flex: 0 0 auto;
    color: var(--tactical-warning);
}

.propertyRow {
    flex-wrap: wrap;
}

.property,
.request,
.views {
    color: var(--muted-foreground);
    font-size: var(--ui-small);
}

.request,
.requestLink {
    text-decoration: none;
}

.property {
    max-width: 100%;
    overflow: hidden;
    padding: 3px 6px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--tactical-primary) 12%, transparent);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.views {
    display: inline-flex;
    gap: 3px;
    align-items: center;
}

.actionRow {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
}

.actionSlot {
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 430px) {
    .mainLink {
        grid-template-columns: 82px minmax(0, 1fr);
    }

    .preview,
    .previewSkeleton {
        width: 82px;
        height: 82px;
    }
}
```

- [ ] **Step 4: Add no-result support to list component**

Modify `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.tsx`:

```tsx
type GrenadesListProps = {
    grenades?: GrenadeModel[]
    mapFunction: GrenadesListMaper
    isError?: boolean
    isLoading?: boolean
    emptyText?: string
}
```

Add before the `ItemsList` return:

```tsx
if (!rest.isLoading && grenades && grenades.length === 0) {
    return (
        <PlaceholderBlock>
            {emptyText ?? "No lineups found for these filters."}
        </PlaceholderBlock>
    )
}
```

When adding this code, destructure `emptyText` from props:

```tsx
export function GrenadesListComponent({
    grenades,
    isError,
    mapFunction,
    emptyText,
    ...rest
}: GrenadesListProps) {
```

- [ ] **Step 5: Make list layout single-column on narrow screens**

Modify `tg-frontend/src/entities/grenade/ui/grenades-list/grenades-list.module.scss`:

```scss
.grenadesList {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 10px;
    width: 100%;
}
```

- [ ] **Step 6: Update card story**

Modify `tg-frontend/src/entities/grenade/ui/grenade/grenade.stories.tsx` to render at least one favorite and one non-approved/request-open state from mocks. Keep existing Storybook metadata and wrap stories in `MemoryRouter` so request links can render.

Add a committed story for every request status using the same mock factory shape. Use `RequestOpen` like this:

```tsx
export const RequestOpen: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            isFavorite: true,
            request: { request_id: 7, status: "OPEN" },
        },
        bottomSlot: <button type='button'>Toggle favorite</button>,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText(grenadeModelMock.title)).toBeVisible()
        await expect(canvas.getByText(/open request/i)).toBeVisible()
        await expect(
            canvas.getByRole("link", { name: /view request/i })
        ).toHaveAttribute("href", "/requests/7")
        await expect(
            canvas.getByRole("button", { name: /toggle favorite/i })
        ).toBeVisible()
    },
}
```

Also add committed stories or a table-driven Storybook play check for:

- `WAITING FOR CREATION`: shows the waiting/no-request display, has no `View request` link when `request_id` is `null`, and keeps `bottomSlot` visible.
- `APPROVED`: shows approved request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `REJECTED`: shows rejected request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `MERGED`: shows merged request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `CLOSED`: shows closed/canceled request display, links to `/requests/<request_id>` when id exists, and exposes no new action.

Expected: request matrix coverage is durable in committed stories/tests, not temporary Storybook/MSW data.

- [ ] **Step 7: Run card checks**

Run:

```bash
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
```

Expected: both commands exit 0.

- [ ] **Step 8: Commit task 3**

Run:

```bash
git add tg-frontend/src/entities/grenade/ui/grenade tg-frontend/src/entities/grenade/ui/grenades-list
git commit -m "feat(frontend): redesign lineup cards"
```

Expected: commit succeeds.

## Task 4: Map Lineup Toolbar And Client-Side Controls

**Files:**
- Create: `tg-frontend/src/widgets/map-overview/model/use-map-lineup-controls.ts`
- Create: `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.tsx`
- Create: `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.module.scss`
- Modify: `tg-frontend/src/widgets/map-overview/ui/map-overview.tsx`
- Modify: `tg-frontend/src/widgets/map-overview/ui/map-overview.module.scss`
- Modify: `tg-frontend/src/widgets/map-overview/ui/map-overview.stories.tsx`

- [ ] **Step 1: Create control state hook**

Create `tg-frontend/src/widgets/map-overview/model/use-map-lineup-controls.ts`:

```ts
import { useMemo, useState } from "react"
import { GrenadeModel, LineupFilterState, LineupSort } from "@entities/grenade"

export function useMapLineupControls(lineups: GrenadeModel[] = []) {
    const [search, setSearch] = useState("")
    const [grenadeClassName, setGrenadeClassName] = useState<string>()
    const [isApproved, setIsApproved] = useState<boolean>()
    const [isFavorite, setIsFavorite] = useState<boolean>()
    const [requestStatus, setRequestStatus] =
        useState<GrenadeModel["request"]["status"]>()
    const [property, setProperty] = useState<string>()
    const [sort, setSort] = useState<LineupSort>("createdAt-desc")

    const grenadeClasses = useMemo(() => {
        return Array.from(
            new Set(lineups.map((lineup) => lineup.grenadeClass.name))
        ).sort((a, b) => a.localeCompare(b))
    }, [lineups])

    const properties = useMemo(() => {
        return Array.from(
            new Set(
                lineups.flatMap((lineup) =>
                    lineup.propertyList.map(
                        (item) => `${item.name}:${item.value}`
                    )
                )
            )
        ).sort((a, b) => a.localeCompare(b))
    }, [lineups])

    const filters: LineupFilterState = {
        search,
        grenadeClassName,
        isApproved,
        isFavorite,
        requestStatus,
        property,
        sort,
    }

    function reset() {
        setSearch("")
        setGrenadeClassName(undefined)
        setIsApproved(undefined)
        setIsFavorite(undefined)
        setRequestStatus(undefined)
        setProperty(undefined)
        setSort("createdAt-desc")
    }

    return {
        filters,
        grenadeClasses,
        properties,
        setters: {
            setSearch,
            setGrenadeClassName,
            setIsApproved,
            setIsFavorite,
            setRequestStatus,
            setProperty,
            setSort,
            reset,
        },
    }
}
```

- [ ] **Step 2: Create toolbar component**

Create `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.tsx`:

```tsx
import { Filter, Plus, RotateCcw, SlidersHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
import classes from "./lineup-toolbar.module.scss"
import { LineupSort } from "@entities/grenade"
import { Button } from "@shared/ui/button"
import { Input } from "@shared/ui/input"
import { Label } from "@shared/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@shared/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/shadcn-select"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@shared/ui/tooltip"

type Props = {
    search: string
    grenadeClasses: string[]
    properties: string[]
    selectedGrenadeClass?: string
    selectedProperty?: string
    selectedRequestStatus?:
        | "OPEN"
        | "APPROVED"
        | "REJECTED"
        | "MERGED"
        | "CLOSED"
        | "WAITING FOR CREATION"
    selectedSort: LineupSort
    onSearchChange: (value: string) => void
    onGrenadeClassChange: (value: string | undefined) => void
    onApprovedChange: (value: boolean | undefined) => void
    onFavoriteChange: (value: boolean | undefined) => void
    onRequestStatusChange: (
        value:
            | "OPEN"
            | "APPROVED"
            | "REJECTED"
            | "MERGED"
            | "CLOSED"
            | "WAITING FOR CREATION"
            | undefined
    ) => void
    onPropertyChange: (value: string | undefined) => void
    onSortChange: (value: LineupSort) => void
    onReset: () => void
}

export function LineupToolbar(props: Props) {
    return (
        <div className={classes.wrapper}>
            <div className={classes.firstRow}>
                <Input
                    aria-label='Search lineups'
                    placeholder='Search smoke, map, position'
                    value={props.search}
                    onChange={(event) =>
                        props.onSearchChange(event.target.value)
                    }
                />
                <Sheet>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <button
                                    type='button'
                                    className={classes.iconButton}
                                    aria-label='Open lineup filters'
                                >
                                    <Filter aria-hidden='true' size={18} />
                                </button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Open lineup filters</TooltipContent>
                    </Tooltip>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Lineup filters</SheetTitle>
                            <SheetDescription>
                                Filter selected map lineups without reloading
                                data.
                            </SheetDescription>
                        </SheetHeader>
                        <div className={classes.sheetFields}>
                            <Label>Grenade type</Label>
                            <Select
                                value={props.selectedGrenadeClass ?? "__all"}
                                onValueChange={(value) =>
                                    props.onGrenadeClassChange(
                                        value === "__all" ? undefined : value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Any grenade' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='__all'>
                                        Any grenade
                                    </SelectItem>
                                    {props.grenadeClasses.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className={classes.buttonGrid}>
                                <Button
                                    type='button'
                                    onClick={() => props.onApprovedChange(true)}
                                >
                                    Approved
                                </Button>
                                <Button
                                    type='button'
                                    onClick={() => props.onApprovedChange(false)}
                                >
                                    Not approved
                                </Button>
                                <Button
                                    type='button'
                                    onClick={() => props.onFavoriteChange(true)}
                                >
                                    Favorites
                                </Button>
                                <Button
                                    type='button'
                                    onClick={() => props.onFavoriteChange(false)}
                                >
                                    Not favorites
                                </Button>
                                <Button
                                    type='button'
                                    onClick={() =>
                                        props.onFavoriteChange(undefined)
                                    }
                                >
                                    Any favorite
                                </Button>
                            </div>
                            <Label>Request status</Label>
                            <Select
                                value={props.selectedRequestStatus ?? "__all"}
                                onValueChange={(value) =>
                                    props.onRequestStatusChange(
                                        value === "__all"
                                            ? undefined
                                            : (value as Parameters<
                                                  Props["onRequestStatusChange"]
                                              >[0])
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Any request status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='__all'>
                                        Any request status
                                    </SelectItem>
                                    <SelectItem value='WAITING FOR CREATION'>
                                        Waiting for creation
                                    </SelectItem>
                                    <SelectItem value='OPEN'>
                                        Open
                                    </SelectItem>
                                    <SelectItem value='APPROVED'>
                                        Approved
                                    </SelectItem>
                                    <SelectItem value='REJECTED'>
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value='MERGED'>
                                        Merged
                                    </SelectItem>
                                    <SelectItem value='CLOSED'>
                                        Closed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={props.selectedProperty ?? "__all"}
                                onValueChange={(value) =>
                                    props.onPropertyChange(
                                        value === "__all" ? undefined : value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Property' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='__all'>
                                        Any property
                                    </SelectItem>
                                    {props.properties.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type='button' onClick={props.onReset}>
                                <RotateCcw aria-hidden='true' size={16} />
                                Reset filters
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                <Sheet>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <button
                                    type='button'
                                    className={classes.iconButton}
                                    aria-label='Open lineup sorting'
                                >
                                    <SlidersHorizontal
                                        aria-hidden='true'
                                        size={18}
                                    />
                                </button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Open lineup sorting</TooltipContent>
                    </Tooltip>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Lineup sorting</SheetTitle>
                            <SheetDescription>
                                Sort selected map lineups.
                            </SheetDescription>
                        </SheetHeader>
                        <Select
                            value={props.selectedSort}
                            onValueChange={(value) =>
                                props.onSortChange(value as LineupSort)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Sort by' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='createdAt-desc'>
                                    Newest first
                                </SelectItem>
                                <SelectItem value='createdAt-asc'>
                                    Oldest first
                                </SelectItem>
                                <SelectItem value='title-asc'>
                                    Title A-Z
                                </SelectItem>
                                <SelectItem value='title-desc'>
                                    Title Z-A
                                </SelectItem>
                                <SelectItem value='views-desc'>
                                    Most viewed
                                </SelectItem>
                                <SelectItem value='views-asc'>
                                    Least viewed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </SheetContent>
                </Sheet>
            </div>
            <Button className={classes.addButton} asChild>
                <Link to='/grenades/create'>
                    <Plus aria-hidden='true' size={16} />
                    Add lineup
                </Link>
            </Button>
        </div>
    )
}
```

- [ ] **Step 3: Style toolbar with approved mobile layout**

Create `tg-frontend/src/widgets/map-overview/ui/lineup-toolbar.module.scss`:

```scss
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.firstRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px 44px;
    gap: 8px;
    width: 100%;
}

.iconButton {
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
    color: var(--color-text-main);

    &:focus-visible {
        outline: 2px solid var(--tactical-primary);
        outline-offset: 2px;
    }
}

.addButton {
    width: 100%;
    min-height: 44px;
}

.sheetFields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-block: 16px;
}

.buttonGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}
```

- [ ] **Step 4: Wire controls into map overview**

Modify `tg-frontend/src/widgets/map-overview/ui/map-overview.tsx` by keeping the existing query/loading/error branches in `MapOverview` and moving the loaded content into a child component so hook order stays valid:

```tsx
import { useMemo } from "react"
import { LineupToolbar } from "./lineup-toolbar"
import { useMapLineupControls } from "../model/use-map-lineup-controls"
import { filterAndSortLineups } from "@entities/grenade"
```

Add this child component below `MapOverview`:

```tsx
function MapOverviewContent({ data }: { data: MapPageModel }) {
    const controls = useMapLineupControls(data.mapLineups)
    const visibleLineups = useMemo(
        () => filterAndSortLineups(data.mapLineups, controls.filters),
        [data.mapLineups, controls.filters]
    )

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to='/maps'>Maps</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link to={`/maps/${data.mapId}`}>{data.name}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link to={`/maps/${data.mapId}/grenades`}>lineups</Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={classes.hero}>
                <div className={classes.heading}>
                    <h1>{data.name} lineups</h1>
                    <Button asChild variant='link' className={classes.link}>
                        <Link to={`/maps/${data.mapId}`}>view map information</Link>
                    </Button>
                </div>
            </div>
            <LineupToolbar
                search={controls.filters.search ?? ""}
                grenadeClasses={controls.grenadeClasses}
                properties={controls.properties}
                selectedGrenadeClass={controls.filters.grenadeClassName}
                selectedProperty={controls.filters.property}
                selectedRequestStatus={controls.filters.requestStatus}
                selectedSort={controls.filters.sort ?? "createdAt-desc"}
                onSearchChange={controls.setters.setSearch}
                onGrenadeClassChange={controls.setters.setGrenadeClassName}
                onApprovedChange={controls.setters.setIsApproved}
                onFavoriteChange={controls.setters.setIsFavorite}
                onRequestStatusChange={(value) =>
                    controls.setters.setRequestStatus(
                        value as typeof controls.filters.requestStatus
                    )
                }
                onPropertyChange={controls.setters.setProperty}
                onSortChange={controls.setters.setSort}
                onReset={controls.setters.reset}
            />
            <GrenadesListComponent
                grenades={visibleLineups}
                mapFunction={favoritesMaper}
                emptyText='No lineups match these filters.'
            />
        </>
    )
}
```

Then replace the loaded return in `MapOverview` with:

```tsx
return <MapOverviewContent data={data} />
```

The old loaded JSX is fully represented in `MapOverviewContent`; do not keep a second `GrenadesListComponent` below it.

`MapOverviewContent` owns all filtering hooks; `MapOverview` owns only the data query and early loading/error/empty branches.

- [ ] **Step 5: Add map overview hero styling**

Modify `tg-frontend/src/widgets/map-overview/ui/map-overview.module.scss`:

```scss
.hero {
    width: 100%;
    padding: 14px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
}

.heading {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.link {
    border: none;
    font-size: 12px;
    color: var(--tactical-primary);
}
```

The `MapOverviewContent` snippet already wraps the map title row in `.hero`; do not add a second hero wrapper around the same heading.

- [ ] **Step 6: Update Storybook play checks**

Modify `tg-frontend/src/widgets/map-overview/ui/map-overview.stories.tsx` play function to assert:

```tsx
import { screen } from "@storybook/test"

await expect(await canvas.findByLabelText("Search lineups")).toBeVisible()
await expect(await canvas.findByLabelText("Open lineup filters")).toBeVisible()
await expect(await canvas.findByLabelText("Open lineup sorting")).toBeVisible()
await canvas.getByLabelText("Open lineup filters").click()
await expect(await screen.findByText("Any request status")).toBeVisible()
await expect(await screen.findByText("Any property")).toBeVisible()
await screen.getByRole("button", { name: /reset filters/i }).click()
await expect(canvas.getByLabelText("Search lineups")).toHaveValue("")
```

Use `screen` or `within(document.body)` for sheet/dialog content because Radix portals render outside the Storybook canvas. Keep existing loading assertions.

Add a committed Storybook/MSW interaction story with a fixed selected-map response containing at least three lineups. Its `play` check must exercise the full selected-map workflow:

- Type a search that matches only one lineup title/description/creator/property and assert only that lineup remains.
- Open filters, select a grenade class, request status, property chip/value, approval, favorites, and not-favorites filters, then assert the expected lineup remains for both favorite boolean states.
- Open sorting, change through newest, oldest, title ascending, title descending, views descending, and views ascending; assert the rendered card order changes to the expected order for each mode.
- Apply a no-result search, assert the no-result state, then reset filters and assert all seeded lineups return.
- Run at the Storybook interaction level with committed mock data; do not satisfy this requirement with ad hoc manual browser inspection.

- [ ] **Step 7: Run map overview tests/checks**

Run:

```bash
cd tg-frontend && npx vitest run src/entities/grenade/lib/lineup-filters.test.ts
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
```

Expected: all commands exit 0.

- [ ] **Step 8: Commit task 4**

Run:

```bash
git add tg-frontend/src/widgets/map-overview tg-frontend/src/entities/grenade/ui/grenades-list
git commit -m "feat(frontend): add tactical map lineup controls"
```

Expected: commit succeeds.

## Task 5: Home Hub

**Files:**
- Create: `tg-frontend/src/pages/home-page/lib/select-home-hub-data.ts`
- Create: `tg-frontend/src/pages/home-page/lib/select-home-hub-data.test.ts`
- Modify: `tg-frontend/src/pages/home-page/home-page.tsx`
- Modify: `tg-frontend/src/pages/home-page/home-page.module.scss`

- [ ] **Step 1: Write failing home hub selector tests**

Create `tg-frontend/src/pages/home-page/lib/select-home-hub-data.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { MapModel, MapPageModel } from "@entities/map"
import { GrenadeModel } from "@entities/grenade"
import {
    filterHomeHubLineups,
    filterHomeHubMaps,
    selectFeaturedMap,
    selectRecentLineups,
} from "./select-home-hub-data"

const maps: MapModel[] = [
    { mapId: 2, name: "Nuke", link: null, imageLink: null },
    { mapId: 1, name: "Mirage", link: null, imageLink: null },
]

const baseLineup: GrenadeModel = {
    grenadeId: 1,
    mapId: 1,
    grenadeClass: {
        grenadeClassId: 10,
        name: "Smoke",
        description: "Smoke grenade",
        price: 300,
    },
    propertyList: [{ propertyId: 1, name: "tickrate", value: "64" }],
    linkToVideo: "https://example.com/video",
    creator: {
        userId: 1,
        username: "daniil",
        avatarUrl: null,
        firstName: null,
        lastName: null,
    },
    createdAt: "2026-01-01T00:00:00Z",
    title: "Window smoke",
    description: "T spawn lineup",
    isApproved: true,
    isFavorite: false,
    views: 10,
    previewImageLink: null,
    request: { request_id: null, status: "WAITING FOR CREATION" },
}

const mapPage = {
    ...maps[1],
    mapLineups: [
        baseLineup,
        {
            ...baseLineup,
            grenadeId: 2,
            createdAt: "2026-03-01T00:00:00Z",
            title: "Connector flash",
            grenadeClass: {
                grenadeClassId: 11,
                name: "Flashbang",
                description: "Flash grenade",
                price: 200,
            },
        },
    ],
} as MapPageModel

describe("home hub data selectors", () => {
    it("falls back to the first map sorted by name", () => {
        expect(selectFeaturedMap(maps)?.name).toBe("Mirage")
    })

    it("sorts recent lineups newest first", () => {
        expect(selectRecentLineups(mapPage).map((item) => item.grenadeId)).toEqual([2, 1])
    })

    it("filters home hub lineups by search and common metadata", () => {
        expect(
            filterHomeHubLineups(mapPage.mapLineups, {
                search: "window",
                grenadeClassName: "Smoke",
                isApproved: true,
                isFavorite: false,
                requestStatus: "WAITING FOR CREATION",
                property: "tickrate:64",
            }).map((item) => item.grenadeId)
        ).toEqual([1])
    })

    it("filters home hub maps by map name", () => {
        expect(filterHomeHubMaps(maps, "mir").map((map) => map.name)).toEqual([
            "Mirage",
        ])
    })
})
```

- [ ] **Step 2: Run selector tests and verify they fail**

Run:

```bash
cd tg-frontend && npx vitest run src/pages/home-page/lib/select-home-hub-data.test.ts
```

Expected: FAIL because selector file does not exist.

- [ ] **Step 3: Implement home hub selectors**

Create `tg-frontend/src/pages/home-page/lib/select-home-hub-data.ts`:

```ts
import { MapModel, MapPageModel } from "@entities/map"
import { filterAndSortLineups, GrenadeModel } from "@entities/grenade"

export function selectFeaturedMap(maps: MapModel[] | undefined) {
    if (!maps?.length) return undefined

    return [...maps].sort((a, b) => a.name.localeCompare(b.name))[0]
}

export function selectRecentLineups(mapPage: MapPageModel | undefined) {
    return [...(mapPage?.mapLineups ?? [])].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    )
}

export function filterHomeHubMaps(maps: MapModel[] | undefined, search: string) {
    const normalizedSearch = normalize(search)
    const sortedMaps = [...(maps ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name)
    )

    if (!normalizedSearch) return sortedMaps

    return sortedMaps.filter((map) =>
        normalize(map.name).includes(normalizedSearch)
    )
}

type HomeHubFilters = {
    search?: string
    grenadeClassName?: string
    isApproved?: boolean
    isFavorite?: boolean
    requestStatus?: GrenadeModel["request"]["status"]
    property?: string
}

function normalize(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? ""
}

export function filterHomeHubLineups(
    lineups: GrenadeModel[],
    filters: HomeHubFilters
) {
    return filterAndSortLineups(lineups, {
        ...filters,
        sort: "createdAt-desc",
    })
}
```

`filterHomeHubLineups` is intentionally a thin wrapper over the shared `filterAndSortLineups`; keep map-name filtering in `filterHomeHubMaps`, but do not duplicate lineup search/metadata filtering logic in the home page.

- [ ] **Step 4: Replace homepage landing with data-backed hub**

Modify `tg-frontend/src/pages/home-page/home-page.tsx`:

```tsx
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import classes from "./home-page.module.scss"
import {
    filterHomeHubLineups,
    filterHomeHubMaps,
    selectFeaturedMap,
    selectRecentLineups,
} from "./lib/select-home-hub-data"
import { mapApi } from "@entities/map"
import { GrenadeModel, GrenadesListComponent } from "@entities/grenade"
import { favoritesMaper } from "@features/favorites/get"
import { Button } from "@shared/ui/button"
import { Input } from "@shared/ui/input"
import { PlaceholderBlock } from "@shared/ui/placeholder-block"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/shadcn-select"
import { TacticalPage, TacticalSurface } from "@shared/ui/tactical-page"

export function Homepage() {
    const mapsQuery = useQuery(mapApi.getMapsOptions({ ordering: "by_alphabet" }))
    const [search, setSearch] = useState("")
    const [grenadeClassName, setGrenadeClassName] = useState<string>()
    const [isApproved, setIsApproved] = useState<boolean>()
    const [isFavorite, setIsFavorite] = useState<boolean>()
    const [requestStatus, setRequestStatus] =
        useState<GrenadeModel["request"]["status"]>()
    const [property, setProperty] = useState<string>()
    const [selectedMapId, setSelectedMapId] = useState<number>()
    const featuredMap = selectFeaturedMap(mapsQuery.data)
    const selectedMap =
        mapsQuery.data?.find((map) => map.mapId === selectedMapId) ??
        featuredMap
    const mapPageQuery = useQuery({
        ...mapApi.getMapByIdOptions(selectedMap?.mapId ?? 1),
        enabled: Boolean(selectedMap?.mapId),
    })
    const recentLineups = selectRecentLineups(mapPageQuery.data)
    const grenadeClasses = useMemo(
        () =>
            Array.from(
                new Set(recentLineups.map((lineup) => lineup.grenadeClass.name))
            ).sort((a, b) => a.localeCompare(b)),
        [recentLineups]
    )
    const requestStatuses = useMemo(
        () =>
            Array.from(
                new Set(recentLineups.map((lineup) => lineup.request.status))
            ).sort((a, b) => a.localeCompare(b)),
        [recentLineups]
    )
    const properties = useMemo(
        () =>
            Array.from(
                new Set(
                    recentLineups.flatMap((lineup) =>
                        lineup.propertyList.map(
                            (item) => `${item.name}:${item.value}`
                        )
                    )
                )
            ).sort((a, b) => a.localeCompare(b)),
        [recentLineups]
    )
    const visibleLineups = filterHomeHubLineups(recentLineups, {
        search,
        grenadeClassName,
        isApproved,
        isFavorite,
        requestStatus,
        property,
    })
    const visibleMaps = filterHomeHubMaps(mapsQuery.data, search)

    if (mapsQuery.isLoading) {
        return (
            <TacticalPage title='CS Smokes' subtitle='Loading tactical hub...' />
        )
    }

    if (mapsQuery.isError) {
        return (
            <PlaceholderBlock>
                Could not load maps for the tactical hub.
            </PlaceholderBlock>
        )
    }

    if (!featuredMap || !selectedMap) {
        return <PlaceholderBlock>No maps available yet.</PlaceholderBlock>
    }

    return (
        <TacticalPage
            eyebrow='Tactical hub'
            title='Find utility without friction'
            subtitle='Choose a map, scan recent lineups, and keep request state visible.'
            action={
                <Button asChild>
                    <Link to='/grenades/create'>
                        <Plus aria-hidden='true' size={16} />
                        Add lineup
                    </Link>
                </Button>
            }
        >
            <TacticalSurface className={classes.featuredMap}>
                <div>
                    <p className={classes.eyebrow}>Featured map</p>
                    <h2>{selectedMap.name}</h2>
                    <p className={classes.muted}>
                        Recent lineups are loaded from existing map data.
                    </p>
                </div>
                <Button asChild variant='secondary'>
                    <Link to={`/maps/${selectedMap.mapId}/grenades`}>
                        Open map lineups
                    </Link>
                </Button>
            </TacticalSurface>
            <div className={classes.mapStrip}>
                {visibleMaps.map((map) => (
                    <button
                        key={map.mapId}
                        type='button'
                        className={classes.mapChip}
                        aria-pressed={selectedMap.mapId === map.mapId}
                        onClick={() => {
                            setSelectedMapId(map.mapId)
                            setGrenadeClassName(undefined)
                            setIsApproved(undefined)
                            setIsFavorite(undefined)
                            setRequestStatus(undefined)
                            setProperty(undefined)
                        }}
                    >
                        {map.name}
                    </button>
                ))}
            </div>
            <div className={classes.controls}>
                <Input
                    aria-label='Search home lineups'
                    placeholder='Search map, lineup, creator, grenade, property'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <div className={classes.filterRow}>
                    <Button
                        type='button'
                        variant={
                            !grenadeClassName &&
                            isApproved === undefined &&
                            isFavorite === undefined &&
                            !requestStatus &&
                            !property
                                ? "secondary"
                                : "default"
                        }
                        onClick={() => {
                            setGrenadeClassName(undefined)
                            setIsApproved(undefined)
                            setIsFavorite(undefined)
                            setRequestStatus(undefined)
                            setProperty(undefined)
                        }}
                    >
                        All
                    </Button>
                    {grenadeClasses.map((name) => (
                        <Button
                            key={name}
                            type='button'
                            variant={
                                grenadeClassName === name
                                    ? "secondary"
                                    : "default"
                            }
                            onClick={() => setGrenadeClassName(name)}
                        >
                            {name}
                        </Button>
                    ))}
                    <Button
                        type='button'
                        variant={isApproved ? "secondary" : "default"}
                        onClick={() =>
                            setIsApproved((value) =>
                                value === true ? undefined : true
                            )
                        }
                    >
                        Approved
                    </Button>
                    <Button
                        type='button'
                        variant={isFavorite ? "secondary" : "default"}
                        onClick={() =>
                            setIsFavorite((value) =>
                                value === true ? undefined : true
                            )
                        }
                    >
                        Favorites
                    </Button>
                    <Select
                        value={requestStatus ?? "__all"}
                        onValueChange={(value) =>
                            setRequestStatus(
                                value === "__all"
                                    ? undefined
                                    : (value as typeof requestStatus)
                            )
                        }
                    >
                        <SelectTrigger className={classes.select}>
                            <SelectValue placeholder='Any request status' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='__all'>
                                Any request status
                            </SelectItem>
                            {requestStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={property ?? "__all"}
                        onValueChange={(value) =>
                            setProperty(value === "__all" ? undefined : value)
                        }
                    >
                        <SelectTrigger className={classes.select}>
                            <SelectValue placeholder='Any property' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='__all'>Any property</SelectItem>
                            {properties.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <GrenadesListComponent
                grenades={visibleLineups}
                isLoading={mapPageQuery.isLoading}
                isError={mapPageQuery.isError}
                mapFunction={favoritesMaper}
                emptyText='No selected map lineups match these filters.'
            />
        </TacticalPage>
    )
}
```

The map strip is an in-page quick selector. Clicking a map chip updates `selectedMapId`, reloads that map's lineups through `mapApi.getMapByIdOptions`, clears the lineup-only fast filters, and keeps the user on `/`. The `Open map lineups` button is the explicit navigation path to `/maps/:mapId/grenades`.

- [ ] **Step 5: Style home hub**

Modify `tg-frontend/src/pages/home-page/home-page.module.scss`:

```scss
.featuredMap {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    justify-content: space-between;
    min-height: 150px;
    background: var(--color-background-alt);
}

.eyebrow {
    margin: 0 0 4px;
    color: var(--tactical-primary);
    font-size: var(--ui-small);
    font-weight: 700;
}

.muted {
    margin: 4px 0 0;
    color: var(--muted-foreground);
}

.mapStrip {
    display: flex;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.filterRow {
    display: flex;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
}

.select {
    flex: 0 0 190px;
}

.mapChip {
    flex: 0 0 auto;
    padding: 8px 10px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
    color: var(--color-text-main);
    cursor: pointer;
    font: inherit;
    text-decoration: none;

    &[aria-pressed="true"] {
        border-color: var(--tactical-primary);
        background: color-mix(in srgb, var(--tactical-primary) 16%, transparent);
        color: var(--tactical-primary);
    }

    &:focus-visible {
        outline: 2px solid var(--tactical-primary);
        outline-offset: 2px;
    }
}

@media (max-width: 540px) {
    .featuredMap {
        align-items: stretch;
        flex-direction: column;
    }
}
```

- [ ] **Step 6: Run home hub checks**

Run:

```bash
cd tg-frontend && npx vitest run src/pages/home-page/lib/select-home-hub-data.test.ts
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit task 5**

Run:

```bash
git add tg-frontend/src/pages/home-page
git commit -m "feat(frontend): redesign home as tactical hub"
```

Expected: commit succeeds.

## Task 6: Media-First Lineup Detail

**Files:**
- Modify: `tg-frontend/src/pages/grenade-page/ui/grenade-page.tsx`
- Modify: `tg-frontend/src/pages/grenade-page/ui/grenade-page.module.scss`
- Modify: `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.tsx`
- Modify: `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.module.scss`
- Modify: `tg-frontend/src/entities/grenade/ui/grenade-overview/__tests__.ts`
- Create: `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.stories.tsx`

- [ ] **Step 1: Update overview props for map label**

Modify `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.tsx` prop type:

```tsx
type GrenadeOverviewProps = {
    grenade?: GrenadeModel
    isLoading?: boolean
    isError?: boolean
    actions?: ReactNode
    mapLabel?: string
}
```

Add `mapLabel` to the function params.

- [ ] **Step 2: Rewrite overview layout as media-first**

In `GrenadeOverview`, add these imports:

```tsx
import { Link } from "react-router-dom"
import { getLineupRequestDisplay } from "../../lib/request-status"
import { Button } from "@shared/ui/button"
```

Keep the existing `isError`, `isLoading`, and empty branches. Before the loaded return, add:

```tsx
const requestDisplay = getLineupRequestDisplay(grenade.request)
```

Then replace the loaded JSX with:

```tsx
return (
    <article className={classes.overview}>
        <div className={classes.media} data-testid='lineup-detail-media'>
            <ImageComponent
                className={classes.mediaAsset}
                url={grenade.previewImageLink}
                alt={`${grenade.title} preview image`}
                skeletonClasses={classes.mediaSkeleton}
                placeholderElement={
                    <>
                        <span>Without image</span>
                        <Frown />
                    </>
                }
            />
        </div>
        <div className={classes.header}>
            <div>
                <h1>{grenade.title}</h1>
                <p className={classes.muted} data-testid='lineup-detail-map-label'>
                    {mapLabel ?? `Map #${grenade.mapId}`} ·{" "}
                    {grenade.grenadeClass.name}
                </p>
            </div>
            {grenade.isApproved ? (
                <Badge color='success'>Approved</Badge>
            ) : (
                <Badge color='danger'>Not approved yet</Badge>
            )}
        </div>
        <div className={classes.statusRow}>
            {requestDisplay.href ? (
                <Button asChild variant='link'>
                    <Link to={requestDisplay.href}>
                        {requestDisplay.label}
                    </Link>
                </Button>
            ) : (
                <Badge color='accent'>{requestDisplay.label}</Badge>
            )}
            <span className={classes.muted}>Views: {grenade.views}</span>
        </div>
        {actions && (
            <div className={classes.primaryActions} data-testid='lineup-detail-actions'>
                {actions}
            </div>
        )}
        <section className={classes.section}>
            <h2>Description</h2>
            <p>{grenade.description ?? "No description provided."}</p>
        </section>
        <section className={classes.section}>
            <h2>Properties</h2>
            <div className={classes.properties}>
                {grenade.propertyList.length > 0 ? (
                    grenade.propertyList.map((property) => (
                        <span
                            key={property.propertyId}
                            className={classes.property}
                        >
                            {property.name}: {property.value}
                        </span>
                    ))
                ) : (
                    <span className={classes.muted}>No properties</span>
                )}
            </div>
        </section>
        <section className={classes.section}>
            <h2>Creator</h2>
            <Link
                className={classes.creator}
                to={`/guest/profile/${grenade.creator.userId}`}
            >
                <ImageComponent
                    className={classes.avatar}
                    skeletonClasses={classes.avatar}
                    url={grenade.creator.avatarUrl}
                    alt={`${grenade.creator.username} avatar`}
                    width={36}
                    height={36}
                />
                <span>{grenade.creator.username}</span>
            </Link>
        </section>
    </article>
)
```

The `data-testid='lineup-detail-media'` wrapper is required even when `previewImageLink` is null, because the browser QA checks the media or no-image placeholder region before the title/header.
The `data-testid='lineup-detail-actions'` wrapper is required so favorite/video actions stay near the media/header/status region and can be verified on mobile without scrolling past description, properties, or creator sections.

- [ ] **Step 3: Style media-first overview**

Modify `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.module.scss`:

```scss
.overview {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
}

.media {
    width: 100%;
    min-height: 220px;
    max-height: 420px;
    overflow: hidden;
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
}

.mediaAsset,
.mediaSkeleton {
    width: 100%;
    height: 100%;
    min-height: 220px;
    max-height: 420px;
    object-fit: cover;
}

.header,
.statusRow {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}

.primaryActions {
    width: 100%;
}

.muted {
    color: var(--muted-foreground);
}

.section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 12px;
    border: var(--border-classic);
    border-radius: var(--tactical-radius);
    background: var(--color-background-alt);
}

.properties {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.property {
    padding: 4px 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--tactical-primary) 12%, transparent);
    color: var(--tactical-primary);
    font-size: var(--ui-small);
}

.creator {
    display: flex;
    gap: 8px;
    align-items: center;
    color: inherit;
    text-decoration: none;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
```

- [ ] **Step 4: Fetch map label with fallback in page**

Modify `tg-frontend/src/pages/grenade-page/ui/grenade-page.tsx`:

```tsx
import { mapApi } from "@entities/map"
```

After grenade query:

```tsx
const mapQuery = useQuery({
    ...mapApi.getMapByIdOptions(grenade?.mapId ?? 1),
    enabled: Boolean(grenade?.mapId),
})

const mapLabel = mapQuery.data?.name ?? (grenade ? `Map #${grenade.mapId}` : undefined)
```

Pass `mapLabel`:

```tsx
<GrenadeOverview
    grenade={grenade}
    isError={isError}
    isLoading={isLoading}
    mapLabel={mapLabel}
    actions={...}
/>
```

Do not block detail rendering on `mapQuery.isError`.

- [ ] **Step 5: Update detail actions layout**

Modify `tg-frontend/src/pages/grenade-page/ui/grenade-page.module.scss`:

```scss
.goBack {
    align-self: flex-start;
}

.viewLineup {
    width: 100%;
    min-height: 44px;
    border-radius: var(--tactical-radius);
    background-color: var(--color-background-alt);
}

.actionsWrapper {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    gap: 8px;
    width: 100%;
}
```

- [ ] **Step 6: Update overview Storybook checks**

Modify `tg-frontend/src/entities/grenade/ui/grenade-overview/__tests__.ts` to assert loaded detail includes:

```ts
await expect(canvas.getByText(/Map #/i)).toBeInTheDocument()
await expect(canvas.getByText(/Description/i)).toBeInTheDocument()
await expect(canvas.getByText(/Properties/i)).toBeInTheDocument()
await expect(canvas.getByRole("link", { name: /open request/i })).toHaveAttribute(
    "href",
    "/requests/7"
)
```

Keep existing loading/error/empty assertions.

- [ ] **Step 7: Add overview story for executable checks**

Create `tg-frontend/src/entities/grenade/ui/grenade-overview/grenade-overview.stories.tsx`:

```tsx
import { Meta, StoryObj } from "@storybook/react"
import { expect } from "@storybook/test"
import { MemoryRouter } from "react-router-dom"
import { GrenadeOverview } from "./grenade-overview"
import { grenadeModelMock } from "../../model/__mocks__"

const meta: Meta<typeof GrenadeOverview> = {
    component: GrenadeOverview,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof GrenadeOverview>

export const RequestOpenWithMapFallback: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            mapId: 12,
            request: { request_id: 7, status: "OPEN" },
        },
        mapLabel: "Map #12",
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText(/Map #12/i)).toBeVisible()
        await expect(canvas.getByText(/Description/i)).toBeVisible()
        await expect(canvas.getByText(/Properties/i)).toBeVisible()
        await expect(
            canvas.getByRole("link", { name: /open request/i })
        ).toHaveAttribute("href", "/requests/7")
    },
}
```

Add a page-level committed Storybook/MSW or Playwright component-route check for failed map lookup:

- Mock `/api/lineups/:grenadeId` or the equivalent grenade detail query as success with `mapId: 12`.
- Mock `/api/maps/12` as failed/unavailable.
- Render `/grenades/:grenadeId` through the page-level route, not only `GrenadeOverview`.
- Assert media or no-image placeholder, the H1 title, `lineup-detail-actions`, and `Map #12` remain visible.

Expected: the detail page proves the map fallback survives a failed map query while preserving media-first layout and reachable actions.

Add committed stories or a table-driven Storybook play check for the remaining detail request states:

- `WAITING FOR CREATION`: renders the waiting/no-request display, no request detail link when `request_id` is `null`, and no new request action outside existing creator-owned contexts.
- `APPROVED`: renders approved request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `REJECTED`: renders rejected request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `MERGED`: renders merged request display, links to `/requests/<request_id>` when id exists, and exposes no new action.
- `CLOSED`: renders closed/canceled request display, links to `/requests/<request_id>` when id exists, and exposes no new action.

Expected: detail request matrix coverage is committed and runs through `test-storybook`; Task 7 must not rely on temporary Storybook/MSW data for these states.

- [ ] **Step 8: Run detail checks**

Run:

```bash
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
```

Then run Storybook in a separate terminal/session:

```bash
cd tg-frontend && npm run storybook -- --host 127.0.0.1
```

After Storybook prints `http://127.0.0.1:6006`, run in the original terminal:

```bash
cd tg-frontend && npm run test-storybook -- --url http://127.0.0.1:6006
```

Expected: type-check and lint exit 0; Storybook starts on port 6006; test-storybook exits 0. Stop Storybook with `Ctrl+C` after test-storybook completes.

- [ ] **Step 9: Commit task 6**

Run:

```bash
git add tg-frontend/src/pages/grenade-page tg-frontend/src/entities/grenade/ui/grenade-overview
git commit -m "feat(frontend): redesign lineup detail"
```

Expected: commit succeeds.

## Task 7: Full Verification And Browser QA

**Files:**
- Modify tests/stories touched by Tasks 1-6 to cover missing acceptance checks found during verification.
- Create: `tg-frontend/scripts/sign-telegram-init-data.mjs`
- Create: `tg-frontend/scripts/find-tactical-qa-paths.mjs`
- Create: `tg-frontend/scripts/verify-tactical-layout.mjs`
- No production source changes unless verification exposes a defect.

- [ ] **Step 1: Add local Telegram init data signing helper**

Create `tg-frontend/scripts/sign-telegram-init-data.mjs`:

```js
import crypto from "node:crypto"

const token = process.env.TOKEN

if (!token) {
    console.error("TOKEN environment variable is required")
    process.exit(1)
}

const user = process.env.TG_QA_USER_JSON ?? JSON.stringify({
    id: 900001,
    username: "qa_player",
    first_name: "QA",
})

const values = new URLSearchParams({
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: "qa-tactical-redesign",
    user,
})

const dataCheckString = [...values.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(token)
    .digest()

const hash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex")

values.set("hash", hash)

process.stdout.write(values.toString())
```

Expected: running the helper with the same `TOKEN` used by the backend prints signed Telegram WebApp init data accepted by `/api/login/tg/`.

- [ ] **Step 2: Add browser QA path discovery helper**

Create `tg-frontend/scripts/find-tactical-qa-paths.mjs`:

```js
const apiBaseUrl = process.env.VITE_BACKEND_URL ?? "http://localhost:3000/api"
const initData = process.env.TG_QA_INIT_DATA

if (!initData) {
    console.error("TG_QA_INIT_DATA environment variable is required")
    process.exit(1)
}

function apiUrl(path) {
    return new URL(path.replace(/^\/+/, ""), `${apiBaseUrl.replace(/\/?$/, "/")}`).toString()
}

async function requestJson(path, options = {}) {
    const response = await fetch(apiUrl(path), options)

    if (!response.ok) {
        throw new Error(`${path} failed with ${response.status}: ${await response.text()}`)
    }

    return response.json()
}

function readId(value, snakeName, camelName) {
    return value?.[snakeName] ?? value?.[camelName]
}

function readLineups(mapDetail) {
    return mapDetail?.map_lineups ?? mapDetail?.mapLineups ?? []
}

const login = await requestJson("/login/tg/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ init_data: initData }),
})

const token = login.access_token ?? login.accessToken

if (!token) {
    throw new Error("Login response did not include an access token")
}

const maps = await requestJson("/maps/", {
    headers: { Authorization: `Bearer ${token}` },
})
const mapItems = Array.isArray(maps) ? maps : maps.results ?? maps.items ?? []

for (const map of mapItems) {
    const mapId = readId(map, "map_id", "mapId")
    if (!mapId) continue

    const mapDetail = await requestJson(`/maps/${mapId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const lineup = readLineups(mapDetail)[0]
    const grenadeId = readId(lineup, "grenade_id", "grenadeId")

    if (grenadeId) {
        console.log(`export TG_QA_MAP_LINEUPS_PATH=/maps/${mapId}/grenades`)
        console.log(`export TG_QA_GRENADE_DETAIL_PATH=/grenades/${grenadeId}`)
        process.exit(0)
    }
}

throw new Error("No map detail response contained map_lineups/mapLineups with a grenade id")
```

Expected: helper logs in with signed init data, finds a map detail response with non-empty lineups, and prints shell exports for the map lineup and grenade detail browser routes.

- [ ] **Step 3: Add standalone Playwright layout QA script**

Create `tg-frontend/scripts/verify-tactical-layout.mjs`:

```js
import { mkdir } from "node:fs/promises"
import { chromium } from "playwright"

const baseUrl = process.argv[2]
const mapLineupsPath = process.argv[3] ?? "/maps/1/grenades"
const grenadeDetailPath = process.argv[4] ?? "/grenades/1"

if (!baseUrl) {
    console.error(
        "Usage: node scripts/verify-tactical-layout.mjs <base-url> [map-lineups-path] [grenade-detail-path]"
    )
    process.exit(1)
}

const screenshotDir = "test-results/tactical-redesign"
const viewports = [
    { name: "narrow-mobile", width: 360, height: 780 },
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 1100 },
]

function expect(condition, message) {
    if (!condition) {
        throw new Error(message)
    }
}

async function assertAuthenticatedApp(page) {
    const loginLoading = page.getByText("loading, please wait...")
    const loginVisible = await loginLoading.isVisible().catch(() => false)

    expect(
        !loginVisible,
        "Authenticated app content did not render; check signed VITE_TG_INIT_DATA and backend TOKEN"
    )
}

await mkdir(screenshotDir, { recursive: true })

const browser = await chromium.launch()

try {
    for (const viewport of viewports) {
        const page = await browser.newPage({ viewport })

        await page.goto(baseUrl, { waitUntil: "networkidle" })
        await assertAuthenticatedApp(page)
        await page.getByLabel("Search home lineups").waitFor({ state: "visible" })
        await page.screenshot({
            path: `${screenshotDir}/home-${viewport.name}.png`,
            fullPage: true,
        })

        await page.goto(new URL(mapLineupsPath, baseUrl).toString(), {
            waitUntil: "networkidle",
        })
        await assertAuthenticatedApp(page)
        await page.getByLabel("Search lineups").waitFor({ state: "visible" })
        await page.screenshot({
            path: `${screenshotDir}/map-lineups-${viewport.name}.png`,
            fullPage: true,
        })

        await page.goto(new URL(grenadeDetailPath, baseUrl).toString(), {
            waitUntil: "networkidle",
        })
        await assertAuthenticatedApp(page)
        const media = page.locator("[data-testid='lineup-detail-media']").first()
        const heading = page.getByRole("heading", { level: 1 }).first()
        const mapLabel = page.locator("[data-testid='lineup-detail-map-label']").first()
        await media.waitFor({ state: "visible" })
        await heading.waitFor({ state: "visible" })
        await mapLabel.waitFor({ state: "visible" })
        const hasMedia = await media.locator("img, video").first().isVisible().catch(() => false)
        const hasPlaceholder = await media.getByText("Without image").isVisible().catch(() => false)
        expect(
            hasMedia || hasPlaceholder,
            "Detail page media region must render an image/video or the no-image placeholder"
        )
        const actions = page.locator("[data-testid='lineup-detail-actions']").first()
        await actions.waitFor({ state: "visible" })
        const mediaBox = await media.boundingBox()
        const headingBox = await heading.boundingBox()
        const actionsBox = await actions.boundingBox()
        expect(
            Boolean(mediaBox && headingBox && mediaBox.y <= headingBox.y),
            "Detail page must render media before the title/header"
        )
        expect(
            Boolean(actionsBox && headingBox && actionsBox.y >= headingBox.y),
            "Detail actions must be reachable near the header/status region"
        )
        await page.screenshot({
            path: `${screenshotDir}/detail-${viewport.name}.png`,
            fullPage: true,
        })

        if (viewport.width > 390) {
            await page.close()
            continue
        }

        await page.goto(new URL(mapLineupsPath, baseUrl).toString(), {
            waitUntil: "networkidle",
        })
        await assertAuthenticatedApp(page)

        const search = page.getByLabel("Search lineups")
        const filter = page.getByLabel("Open lineup filters")
        const sort = page.getByLabel("Open lineup sorting")
        const addLineup = page.getByRole("link", { name: /add lineup/i })

        await search.waitFor({ state: "visible" })
        await filter.waitFor({ state: "visible" })
        await sort.waitFor({ state: "visible" })
        await addLineup.waitFor({ state: "visible" })

        const boxes = await Promise.all([
            search.boundingBox(),
            filter.boundingBox(),
            sort.boundingBox(),
            addLineup.boundingBox(),
        ])

        expect(boxes.every(Boolean), "Toolbar geometry was unavailable")

        const [searchBox, filterBox, sortBox, addBox] = boxes
        const rowTolerance = 4
        expect(
            Math.abs(searchBox.y - filterBox.y) <= rowTolerance &&
                Math.abs(searchBox.y - sortBox.y) <= rowTolerance,
            "Mobile toolbar search, filter, and sort must share one row"
        )
        expect(
            addBox.y > searchBox.y + searchBox.height,
            "Mobile Add lineup must render below the search/filter/sort row"
        )

        await filter.click()
        await page.getByText("Any request status").waitFor({ state: "visible" })
        await page.keyboard.press("Escape")
        await page.close()
    }
} finally {
    await browser.close()
}
```

Expected: script exists, writes screenshots under `tg-frontend/test-results/tactical-redesign/`, and fails with a clear error when auth is not established or the mobile toolbar violates the approved layout.

- [ ] **Step 4: Run focused unit tests**

Run:

```bash
cd tg-frontend && npx vitest run \
  src/entities/grenade/lib/lineup-filters.test.ts \
  src/entities/grenade/lib/request-status.test.ts \
  src/pages/home-page/lib/select-home-hub-data.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Run Storybook interaction checks**

Run Storybook in one terminal:

```bash
cd tg-frontend && npm run storybook -- --host 127.0.0.1
```

Run the test runner in another terminal after Storybook prints the local URL:

```bash
cd tg-frontend && npm run test-storybook -- --url http://127.0.0.1:6006
```

Expected: Storybook starts on port 6006 and test-storybook exits 0. This proves story `play` checks for map toolbar controls, request links, card metadata, favorite slot, and detail map fallback.

- [ ] **Step 6: Run full frontend quality gates**

Run:

```bash
cd tg-frontend && npm run type-check
cd tg-frontend && npm run lint
cd tg-frontend && npm run build
```

Expected: all commands exit 0.

- [ ] **Step 7: Ensure browser QA backend data and signed auth are available**

Use the repository standard local stack from `README.md`:

```bash
docker compose up -d --build
```

Generate signed init data using the same `TOKEN` value that Docker Compose passes to the backend:

```bash
export TG_QA_INIT_DATA="$(TOKEN="$(grep -E '^TOKEN=' .env | cut -d= -f2-)" node tg-frontend/scripts/sign-telegram-init-data.mjs)"
curl -f -X POST http://localhost:3000/api/login/tg/ \
  -H 'Content-Type: application/json' \
  --data "{\"init_data\":\"$TG_QA_INIT_DATA\"}"
```

Expected: login returns `access_token`, proving the browser QA init data is signed for the configured backend `TOKEN`.

Then extract usable app routes from authenticated backend data:

```bash
eval "$(VITE_BACKEND_URL=http://localhost:3000/api TG_QA_INIT_DATA="$TG_QA_INIT_DATA" node tg-frontend/scripts/find-tactical-qa-paths.mjs)"
printf '%s\n%s\n' "$TG_QA_MAP_LINEUPS_PATH" "$TG_QA_GRENADE_DETAIL_PATH"
```

Expected: command prints a `/maps/<map-id>/grenades` path and a `/grenades/<grenade-id>` path from a map detail response with non-empty `map_lineups`/`mapLineups`.

If local backend data or signed auth is unavailable, do not claim app-route browser QA passed. Use the committed Storybook/MSW checks from Step 5 for component coverage, record the backend/data/auth blocker in Beads, and rerun Step 9 when seeded local data and signed auth are available.

- [ ] **Step 8: Start frontend dev server for browser QA**

Run:

```bash
cd tg-frontend && VITE_BACKEND_URL=http://localhost:3000/api VITE_TG_INIT_DATA="$TG_QA_INIT_DATA" VITE_IN_TG_ENVIRONMENT=false npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`. Keep this process running until browser QA is complete.

- [ ] **Step 9: Run automated Playwright layout QA**

In another terminal, use the Vite URL from Step 8:

```bash
cd tg-frontend && node scripts/verify-tactical-layout.mjs http://127.0.0.1:5173 "$TG_QA_MAP_LINEUPS_PATH" "$TG_QA_GRENADE_DETAIL_PATH"
```

Expected: command exits 0 and writes narrow-mobile/mobile/tablet/desktop screenshots for `/`, `$TG_QA_MAP_LINEUPS_PATH`, and `$TG_QA_GRENADE_DETAIL_PATH`. The script asserts authenticated real-app content renders, the selected-map toolbar is present against seeded backend data, mobile and narrower Telegram-like search/filter/sort controls share one row, `Add lineup` sits below them, and the filter sheet exposes `Any request status`. Full selected-map search/filter/sort/reset/no-result behavior is proven by the committed Storybook/MSW interaction story from Task 4 Step 6, where fixed data makes result count and ordering assertions deterministic.

- [ ] **Step 10: Inspect mobile viewport**

Use Playwright or the in-app browser at widths `360px` and `390px`.

Manual checks:

- `/` is map-first and not a generic landing page.
- `/maps/:mapId/grenades` toolbar first row contains search, filter icon, sort icon.
- `Add lineup` is full-width below that first row.
- Lineup cards show title, grenade type, approval, favorite/request state, and no text overlap.
- No-result state appears after applying a filter/search with no matches.
- A screenshot of the toolbar confirms search, filter, and sort share one row and `Add lineup` is below.
- A DOM geometry check confirms the search input and both icon buttons have the same `getBoundingClientRect().y` value.

- [ ] **Step 11: Inspect tablet viewport**

Use Playwright or the in-app browser at width `768px`.

Manual checks:

- Home hub, map list, and detail page retain stable dimensions.
- Search/filter/sort controls remain usable without hover.
- Empty/loading/error states do not shift the main layout incoherently.

- [ ] **Step 12: Inspect desktop viewport**

Use Playwright or the in-app browser at width `1440px`.

Manual checks:

- App shell and footer/navigation stay constrained by `max-content-size`.
- Map list/card grid uses available width without oversized marketing cards.
- Detail page remains media-first and favorite/video actions are visible near the media/header/status region before description, properties, and creator sections.

- [ ] **Step 13: Verify contrast and non-color indicators**

Use browser accessibility tooling, DevTools contrast checks, or an equivalent automated contrast checker against the running app or Storybook surfaces.

Acceptance:

- Primary body text on dark neutral surfaces is at least WCAG AA `4.5:1`.
- Muted metadata text on elevated surfaces is at least `4.5:1` when it is normal-size text.
- shadcn/Tailwind `SheetContent`, `SelectContent`, button, popover, input, and focus-ring surfaces use the retuned dark tactical tokens from `app/tailwind.css` and meet the same text/icon contrast criteria.
- Teal primary buttons, yellow favorite/accent states, request badges, and approval badges meet at least `3:1` for icon/large emphasis and do not rely on color alone; visible labels or icons remain present.
- Screens checked: `/`, `/maps/:mapId/grenades`, `/grenades/:grenadeId`, and the Storybook request-status/card stories if backend data cannot expose every state.

- [ ] **Step 14: Verify request status matrix with committed stories/MSW mocks**

Use the committed card/detail stories or committed MSW-backed stories to inspect all statuses:

- `WAITING FOR CREATION`: shows no request/waiting display and no new action outside existing creator-owned contexts.
- `OPEN`: links to `/requests/<request_id>` when id exists; request page still owns creator-only cancel.
- `APPROVED`: approved request display; no new action.
- `REJECTED`: rejected request display; no new action.
- `MERGED`: merged request display; no new action.
- `CLOSED`: closed/canceled request display; no new action.

- [ ] **Step 15: Stop dev server**

Stop the Vite process with `Ctrl+C`.

Expected: terminal returns to prompt.

- [ ] **Step 16: Update Beads issues with verification evidence**

For each child issue completed, run:

```bash
bd close <issue-id> --reason="Completed. Verification: <commands and browser checks that passed>."
```

Expected: completed child issues are closed only after their checks pass.

- [ ] **Step 17: Commit final verification updates**

If Task 7 required test/story changes, run:

```bash
git add tg-frontend
git commit -m "test(frontend): cover tactical redesign flows"
```

When Task 7 produces no file changes, do not create an empty commit; record the verification commands in Beads instead.

- [ ] **Step 18: Run mandatory repository handoff push/status**

Run the repository completion workflow required by `AGENTS.md`:

```bash
git pull --rebase
git push
git status
```

Expected: `git pull --rebase` succeeds without losing local work, `git push` succeeds, and `git status` reports the branch is up to date with origin. If the rebase reports conflicts, resolve them without reverting unrelated user changes, rerun the relevant frontend quality gates for any conflicted files, then retry the pull/push/status sequence.

## Plan Self-Review

Spec coverage:

- Shared app shell and navigation: Task 1.
- Home hub map-first dashboard: Task 5.
- Map lineup list search/filter/sort and mobile toolbar: Task 2 and Task 4.
- Tactical lineup cards: Task 3.
- Media-first lineup detail with map fallback and request matrix: Task 6.
- Visual tokens, 8px radius, no marketing/decorative blobs: Task 1 and per-component styles.
- Existing data only and no backend changes: Task 2, Task 4, Task 5, Task 6.
- Empty/loading/error/accessibility/viewport verification: Task 7.
- Beads-ready child issues and dependencies: Task 0.

Placeholder scan:

- No unresolved placeholder requirements are intentionally present.
- Any command using `<issue-id>` is part of Task 0 dependency wiring and Task 7 closure after Beads returns actual ids.

Type consistency:

- Filtering helpers consume `GrenadeModel[]`, `GrenadeModel["request"]["status"]`, and `MapPageModel.mapLineups`.
- Request helper labels do not add new statuses or actions.
- Detail map fallback uses `Map #<mapId>` exactly as specified.

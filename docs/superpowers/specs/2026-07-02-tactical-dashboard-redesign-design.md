# Tactical Dashboard Redesign Design

Date: 2026-07-02
Status: Draft for user review
Beads issue: `cs-smokes-2ed`

## Goal

Redesign the main `tg-frontend` browsing experience around a map-first tactical dashboard for CS2 lineups.

The first implementation pass must make the product feel like a practical CS2 utility tool rather than a generic landing page: users must be able to quickly choose a map, search or filter lineups, see key lineup metadata, and open lineup details with video, throw instructions, favorite state, and moderation request state visible.

## Approved Direction

The approved design direction is **B2: Balanced tactical**.

Key decisions:

- Use the existing React 18 + Vite + TypeScript frontend and current shadcn/Radix/Tailwind-compatible setup.
- Keep `@shared/ui` as the component ownership surface.
- Use shadcn/Radix components and local SCSS/Tailwind tokens as the implementation foundation.
- Use Origin UI-style copy-and-paste app patterns only as design inspiration for dense dashboards, controls, and cards.
- Use Telegram UI only as a reference for Mini App ergonomics, touch density, safe mobile spacing, and bottom navigation behavior. Do not replace the existing component stack with Telegram UI in the first pass.
- Use lucide icons for common toolbar and action buttons when an icon exists.

## UI Kit Research Notes

These sources informed the UI-kit decision. Runtime must not depend on external UI-kit sites.

- [`shadcn/ui`](https://ui.shadcn.com/) is a customizable, copy-and-own component foundation that fits the existing `components.json` setup.
- [`shadcn/ui` Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) confirm Tailwind v4 compatibility guidance and the copy-owned component model.
- [`shadcn/originui`](https://github.com/shadcn/originui) provides React/Tailwind copy-and-paste app UI patterns suitable as inspiration for dense app screens.
- [`Telegram UI`](https://github.com/telegram-mini-apps-dev/TelegramUI) provides Telegram Mini App-oriented component patterns; use it as ergonomic reference, not as the primary dependency.
- [`React Aria Components`](https://react-aria.adobe.com/getting-started) and its Tailwind styling docs were considered for accessibility-oriented clean UI, but adopting React Aria as the primary component foundation is out of scope because the repo already uses Radix/shadcn primitives.

## Current Context

- `tg-frontend` already has a shadcn-compatible `components.json` with aliases pointing to `@shared/ui`, Tailwind CSS variables enabled, `neutral` base color, and `lucide` as the icon library.
- Shared UI already includes button, card, badge, input, select, sheet, dialog, tabs, switch, tooltip, skeleton, image, and list components.
- The current homepage is mostly a text/image landing section and sends users to `/grenades`.
- Core existing routes include `/`, `/grenades`, `/grenades/:grenadeId`, `/grenades/create`, `/maps`, `/maps/:mapId`, `/maps/:mapId/grenades`, `/favorites`, `/profile`, and `/requests/:requestId`.
- Existing domain models already expose lineup favorite state and request state. The redesign must surface those states; it must not invent new backend status values.

## Product Scope

### In Scope For First Pass

1. Shared app shell and navigation refresh.
2. Home hub that acts as a map-first entry screen instead of a marketing landing page.
3. Map lineup list with search, grenade-type controls, filters, and sorting.
4. Lineup cards redesigned for compact tactical browsing.
5. Lineup detail layout with video first, then throw instructions, properties, creator, favorite, and request state.
6. Responsive mobile layout tuned for Telegram Mini App usage.
7. Visual token refresh for the redesigned surfaces.

### Out Of Scope For First Pass

- Backend API changes.
- New moderation workflow or new request statuses.
- Full profile/edit-profile redesign.
- Full pull request page redesign.
- Heavy animation system.
- Replacing Radix/shadcn with another component library.
- Introducing external hosted assets as runtime dependencies.

## Visual System

Use a restrained tactical palette:

- App base: dark neutral (`#111827`-like).
- Elevated surfaces: slightly lighter dark neutral (`#1f2937`-like).
- Primary action: teal (`#2dd4bf`-like).
- Tactical accent: yellow (`#facc15`-like), used sparingly for map markers, warnings, or tactical emphasis.
- Text: high-contrast near-white for primary text, muted gray-blue for secondary text.

Shape and density:

- Cards and controls use compact radii of 8px by default. Use a larger existing component radius only when an already-shared component token requires it.
- Avoid large marketing cards, decorative gradient blobs, and one-note palettes.
- Use full-width working sections instead of nested card-in-card layouts.
- Fixed-format toolbar controls, icon buttons, tabs, cards, and list rows must have stable dimensions so labels and hover states do not shift layout.
- Text must not scale with viewport width and must not use negative letter spacing.

## Information Architecture

### App Shell

The app shell must communicate that the app is a utility tool:

- Main navigation: hub/home, maps, favorites, profile.
- Creation entry point: `Add lineup`, linking to `/grenades/create`.
- Desktop can show horizontal nav and persistent action.
- Mobile can use bottom navigation or compact top/bottom controls depending on existing layout constraints.

### Home Hub

The home hub replaces the generic landing experience with a map-first working view:

- Prominent featured map area.
- Map list or quick map selector.
- Search entry for map name, lineup title, lineup description, creator username, grenade class name, and lineup property name/value text.
- Fast filters for grenade class and common metadata.
- Compact list/grid of recent lineups for the featured map.
- Visible favorite and request state on lineup cards.

First-pass data rules:

- The featured map is selected deterministically from existing map data: prefer the first map with `isEsportsPool`/active-pool data when that field is available in the frontend model; otherwise use the first map returned by the existing map list sorted by map name.
- Recent lineups are derived from the featured map's existing `mapLineups`, sorted by `createdAt` descending.
- The first pass does not implement algorithmic recommendations. If no featured-map lineups are available, show the empty state instead of fake runtime content.
- "Position-like text" means existing lineup title, description, creator username, grenade class name, and property name/value text. Spatial position search is out of scope until the interactive map/spatial feature provides position fields.

### Map Lineup List

The map lineup list is the highest-priority workflow:

- Users can search within the selected map.
- Users can select grenade type via segmented tabs or compact controls.
- Users can open filter and sort controls from icon buttons.
- Users can see lineup cards without opening every detail page.
- Empty, loading, and error states must use the refreshed visual system.

First-pass map-scoped filtering is client-side over the selected map's existing `mapLineups` from `MapPageModel`; it must not require backend changes or new map-scoped API query parameters.

Supported first-pass map list controls:

- Search matches lineup `title`, `description`, `creator.username`, `grenadeClass.name`, and each `propertyList` `name`/`value`.
- Grenade type selection filters by `grenadeClass.grenadeClassId` or `grenadeClass.name` from the in-memory `mapLineups`.
- Filter sheet supports only data already present on `GrenadeModel`: `isApproved`, `isFavorite`, `request.status`, and property name/value chips.
- Sort supports `createdAt` newest/oldest, title A-Z/Z-A, and `views` high/low.
- URL search params may be used to preserve UI state, but the displayed map list remains derived from the selected map's `mapLineups` collection.

### Mobile Toolbar Rule

On mobile map/list screens:

1. The first toolbar row contains:
   - Search input taking remaining width.
   - Filter icon button.
   - Sort icon button.
2. `Add lineup` is a full-width action on the next row.
3. The filter and sort buttons must stay as square icon buttons, not full-width text rows.
4. The row must remain stable on narrow Telegram Web App widths and must not wrap into separate vertical rows.

This rule was explicitly approved after browser mockup review.

### Lineup Card

Each lineup card must include:

- Preview image.
- Title.
- Grenade class.
- Key properties such as tickrate, jumpthrow, one-way, or approved status when available.
- Favorite state.
- Request state, including `WAITING FOR CREATION` where that state is already produced by the frontend model.
- Enough metadata to decide whether to open the detail page.

Card content must remain compact on mobile. If metadata overflows, prioritize title, grenade class, approved/request state, and favorite affordance.

### Lineup Detail

Lineup detail must be media-first but not marketing-like:

- Video or media preview is the first major object.
- Title, human-readable map name, grenade class, and approval/request state appear near the top.
- Throw description and properties follow.
- Creator profile link remains discoverable.
- Favorite toggle remains easy to reach.
- Related actions such as creating or viewing moderation request must preserve current permissions and business rules.

Map display rule:

- If the detail page already has or can fetch existing map data by `mapId` through the current map API/cache, show the map `name`.
- If the map query is unavailable, loading, or failed, show a stable fallback label `Map #<mapId>` and do not block rendering the lineup detail.

Request action matrix:

| Lineup request status | Card/detail display | Action visibility in first pass |
| --- | --- | --- |
| `WAITING FOR CREATION` | Show a "No request yet" / waiting badge. | Show `Create request` only in existing creator-owned contexts where that action already exists; otherwise no request action. |
| `OPEN` with `request_id` | Show open request badge and request link. | Link to `/requests/<request_id>`. On the request page, preserve current creator-only `Cancel request` behavior. |
| `APPROVED` | Show approved request badge. | Link to request detail when `request_id` exists; no new action. |
| `REJECTED` | Show rejected request badge. | Link to request detail when `request_id` exists; no new action. |
| `MERGED` | Show merged request badge. | Link to request detail when `request_id` exists; no new action. |
| `CLOSED` | Show closed/canceled request badge. | Link to request detail when `request_id` exists; no new action. |

The redesign must not add new request actions, new statuses, or new permission rules. It only restyles and repositions behavior already available through existing models and pages.

## Component Strategy

Add or revise shared UI components only where repeated usage justifies it:

- `AppShell` / layout-level navigation surfaces.
- `Toolbar` pattern for search/filter/sort/create controls.
- `LineupCard` or `TacticalLineupCard` within the existing entity/widget boundaries.
- Map hero/summary panel for home hub and map pages.
- Status badge variants for approved, not approved, favorite, and request state.
- Filter/sort sheet or dialog using existing Radix/shadcn primitives.

Keep Feature-Sliced Design boundaries:

- Shared primitives stay under `src/shared/ui`.
- Domain rendering for lineups and maps stays under `entities`.
- Cross-entity page composition stays under `widgets` or `pages`.
- Do not move data fetching into shared UI components.

## Data And API Behavior

No backend API changes are required for the first pass.

The redesign must use existing frontend models and API fields:

- `GrenadeModel` fields for title, preview, grenade class, creator, properties, favorite state, and request state.
- Existing map models and map detail data.
- Existing list query parameters where supported, including search and ordering.
- `MapPageModel.mapLineups` for map-scoped list filtering and sorting in the first pass.

If a desired visual state cannot be backed by existing data, the implementation must either omit it or mark it as a later follow-up issue. It must not hard-code fake runtime data into production pages.

## States And Error Handling

Each redesigned list or detail surface must provide:

- Loading state using skeletons or stable placeholders.
- Empty state for no maps, no lineups, or no filtered results.
- Error state with a concise retry or navigation option where the current data-fetching pattern supports it.
- Auth/loading behavior compatible with the existing `LoginProvider` and router loader.

Telegram constraints:

- Avoid controls that require hover-only interaction.
- Keep touch targets large enough for mobile use.
- Avoid layout that relies on desktop-only sidebars for core actions.

## Accessibility

- Icon-only buttons require accessible labels and hover/focus tooltips where appropriate.
- Interactive cards must have keyboard-visible focus states.
- Color alone must not be the only indicator for approval, request, or favorite state.
- Contrast must be checked for the dark neutral/teal/yellow palette.
- Motion, if added, must be minimal and not required to understand state.

## Verification

Implementation must be verified with:

- `cd tg-frontend && npm run type-check`
- `cd tg-frontend && npm run lint`
- `cd tg-frontend && npm run build`
- Existing relevant tests or updated focused tests when shared components or entity rendering changes.
- Browser inspection with Playwright at:
  - Mobile Telegram-like width around 390px.
  - Medium width around 768px.
  - Desktop width around 1440px.

Focused behavioral verification must exercise the highest-priority map lineup workflow at the same viewport widths:

- Search filters selected-map `mapLineups` by title/description/creator/grenade class/property text.
- Grenade type selection filters selected-map `mapLineups`.
- Filter sheet applies `isApproved`, `isFavorite`, `request.status`, and property filters without backend query changes.
- Sort changes order for `createdAt`, title, and `views`.
- No-result state appears when filters remove all lineups and clears when filters are reset.
- Error state for map detail data remains visible and does not render fake cards.
- Loading state uses stable skeletons/placeholders without layout jumps.
- Selecting a lineup navigates to `/grenades/:grenadeId`.
- Lineup detail renders media first and shows map name or `Map #<mapId>` fallback.
- Request status badges/actions follow the request action matrix for `WAITING FOR CREATION`, `OPEN`, `APPROVED`, `REJECTED`, `MERGED`, and `CLOSED`.
- Mobile toolbar keeps search, filter icon, and sort icon on one row, with `Add lineup` full-width below, at 390px and narrower Telegram-like widths.
- Icon-only controls have accessible names and keyboard-visible focus states.

Manual acceptance checks:

- Home hub is map-first and no longer reads as a generic landing page.
- Mobile toolbar keeps search, filter icon, and sort icon on one row, with `Add lineup` full-width below.
- Lineup cards expose title, grenade type, key status, favorite, and request state.
- Lineup detail puts media first and preserves current actions.
- Map lineup search/filter/sort work on selected-map data and do not call unsupported backend filters.
- Empty, loading, error, and no-result states are visible and visually stable.
- No user-visible backend behavior or moderation rules changed.

## Browser Mockup Record

Browser companion URL during design review: `http://localhost:55899`

Persisted local mockups:

- `.superpowers/brainstorm/5956-1782971349/content/ui-kit-directions.html`
- `.superpowers/brainstorm/5956-1782971349/content/tactical-dashboard-core-screens.html`
- `.superpowers/brainstorm/5956-1782971349/content/tactical-visual-intensity.html`
- `.superpowers/brainstorm/5956-1782971349/content/final-redesign-proposal.html`
- `.superpowers/brainstorm/5956-1782971349/content/final-redesign-proposal-v2.html`

The approved final mockup is `final-redesign-proposal-v2.html`.

## Beads Decomposition

Before implementation starts, create child Beads issues from these closure-ready work units. Each child issue must link back to `cs-smokes-2ed` or this spec.

1. Define redesign tokens and app shell.
   - Likely files/modules: `tg-frontend/src/app/layout`, `tg-frontend/src/app/index.scss`, `tg-frontend/src/app/tailwind.css`, shared navigation components under `src/shared/ui` or `src/widgets`.
   - Acceptance: app shell exposes hub/home, maps, favorites, profile, and `Add lineup`; visual tokens match Balanced tactical; no page depends on hover-only navigation.
   - Verification: type-check, lint, build, and Playwright inspection at 390/768/1440px.
   - Dependencies: none.
2. Redesign home hub as a map-first tactical dashboard.
   - Likely files/modules: `src/pages/home-page`, `src/entities/map`, `src/entities/grenade`, map/lineup widgets.
   - Acceptance: `/` shows featured map from deterministic existing data, map selector/list, search entry, recent featured-map lineups, and favorite/request state; empty state appears when no lineups exist.
   - Verification: focused browser check for loaded, empty, loading, and error states.
   - Dependencies: token/app shell issue.
3. Redesign map lineup list toolbar, filters, sorting, and mobile layout.
   - Likely files/modules: `src/pages/map/map-page`, `src/widgets/map-overview`, `src/entities/grenade/ui/grenades-list`, filter/sort widgets.
   - Acceptance: selected-map `mapLineups` are filtered client-side by search, grenade type, approved/favorite/request/property filters and sorted by date/title/views; mobile toolbar follows the approved one-row search/filter/sort plus second-row `Add lineup` rule.
   - Verification: focused behavioral checks at 390/768/1440px for search, filters, sort, no-result, loading, error, and detail navigation.
   - Dependencies: token/app shell issue; can run in parallel with lineup card issue after shared tokens exist.
4. Redesign lineup cards with favorite/request/status metadata.
   - Likely files/modules: `src/entities/grenade/ui/grenade`, `src/entities/grenade/ui/grenades-list`, favorite feature mappers, shared badge/card primitives.
   - Acceptance: cards show preview, title, grenade class, key properties, approved state, favorite state, and request state; metadata priority prevents mobile overflow.
   - Verification: component/story or browser checks for all request statuses and mobile overflow.
   - Dependencies: token/app shell issue.
5. Redesign lineup detail media-first layout.
   - Likely files/modules: `src/pages/grenade-page`, `src/entities/grenade/ui/grenade-overview`, request/favorite actions.
   - Acceptance: media is first; title, map name or `Map #<mapId>`, grenade class, approval/request state, description, properties, creator, favorite, and request actions follow the spec matrix.
   - Verification: browser checks for media-first layout, map fallback, each request status, creator/non-creator action visibility where existing contexts support it.
   - Dependencies: lineup card issue for shared status/badge treatment.
6. Add or update focused tests and run frontend quality gates.
   - Likely files/modules: relevant Vitest/Storybook/Playwright or browser-test files for changed components and widgets.
   - Acceptance: checks cover the high-priority map lineup workflow, mobile toolbar rule, card metadata, detail layout, empty/loading/error states, and request action matrix.
   - Verification: `cd tg-frontend && npm run type-check`, `npm run lint`, `npm run build`, plus changed/added focused tests.
   - Dependencies: implementation issues 1-5.

Dependencies:

- Token/app shell work must precede page-specific redesign.
- Lineup card work must precede or happen with map list and favorites surfaces.
- Detail page work can follow card/list work.
- Final quality-gate issue depends on all implementation issues.

## Open Questions

None for the first-pass spec. Any additional screens, such as profile, edit profile, pull request moderation, or interactive map behavior, must be handled as follow-up specs or implementation issues.

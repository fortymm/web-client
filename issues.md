# Dashboard follow-ups

Leftover review findings from PR #4 (after addressing nav a11y and inline-token refactor). Ordered by severity.

## Medium

### 1. `Mono` still allocates a fresh style object on every render
`src/components/dashboard/primitives.tsx` — `Mono` is used ~50× across the tree and each render builds an inline `style` object for `fontSize` / `fontWeight` (color is now opt-in after the simplify pass). It reinvents Tailwind's text utilities with a runtime API. Options:
- Delete `Mono` entirely and inline `font-mono tabular-nums tracking-[-0.01em] text-[Npx] font-bold text-chalk-300` at call sites.
- Convert to cva variants mirroring `Button`: `<Mono size="xs" tone="muted">`.
- Narrow the API to only the sizes actually used and map each to a class.

### 2. Fake keyboard shortcuts in `LiveMatchScoreboard`
`src/components/dashboard/live-match.tsx` — the `+1 for me` / `+1 for opponent` buttons render `SPACE` and `N` kbd hints but no global listener exists. Either:
- Wire up a `useEffect` that binds `keydown` to the same onClick handlers (ideally via a `useHotkey` primitive).
- Or drop the kbd labels until scoring is wired to real state.

### 3. `Avatar` tone="ball" contrast at small sizes
`src/components/dashboard/primitives.tsx` → `AVATAR_TONES.ball` uses `fg: '#111'` on an orange gradient. At 32px (topbar avatar) and 34px (club feed announce row) this is ~3.0–3.5:1 — fails WCAG AA for small text. Run through a contrast checker, consider bumping to `#0B0D12` (`--color-ink-950`) or widening the outer stop to a deeper orange.

### 4. Hardcoded greeting for `in_tournament_playing`
`src/components/dashboard/greeting.tsx` — the copy `` `Game 4, ${firstName}. Lead at 2–1.` `` doesn't read from `LIVE_MATCH.games`. If mock data changes the greeting silently lies. Derive the game number (`games.length`) and games-won tally from `LIVE_MATCH`.

## Low

### 5. Dead mock-data fields in `data.ts`
Never read anywhere in the tree — drop or display:
- `ME.handle`, `ME.rank.region`
- `TOURNAMENT.standings`, `TOURNAMENT.bracket.remaining`
- `TD_EVENT.role` (panel hardcodes "DIRECTOR CONTROL")
- `TD_EVENT.schedule.onTime`, `.behind`, `.ahead`
- `TD_EVENT.solver.horizon`

### 6. Redundant `cursor-pointer` on `<button>` elements
Buttons already get pointer cursors in every modern browser. Drop from:
- `primitives.tsx` → `TextLink`
- `topbar.tsx` → state-cycle button, Search/Bell icon buttons, Dashboard Link
- `td-panel.tsx` → Call-to-court button

### 7. `PlayerBlock` splits names by space with `key={i}`
`live-match.tsx` — `name.split(' ').map((w, i) => <div key={i}>{w}</div>)` produces "Van / Der / Berg" on three separate lines for compound surnames. Cosmetic, but worth a `TODO` or a `whitespace-nowrap` variant that keeps hyphenated/compound names together.

### 8. No test runner
The project has no `vitest`/`jest` configured. The six-state matrix + the state machine + `LiveMatchScoreboard` game-derivation logic is the first place in the repo where tests would pay off:
- Smoke: each state renders without throwing.
- Interaction: cycling through all six from the topbar doesn't warn.
- Derivation: `myGamesWon`/`theirGamesWon` match curated fixtures.

### 9. `shadow-[0_0_32px_rgba(...)]` arbitrary shadows still carry raw rgba
`primitives.tsx` (Card live), `tournament-panel.tsx` (PATH_COLORS.live), `td-panel.tsx` (TDCourtTile.live). Tailwind v4 doesn't have a clean `shadow-{color}/opacity` with custom blur. Options:
- Define named shadow tokens in `index.css` `@theme` (`--shadow-live-ball-glow`, etc.) and use `shadow-live-ball-glow`.
- Use `color-mix(in oklab, var(--color-X) NN%, transparent)` inside the arbitrary — verbose but token-honest.

## Notes for future routes

- **Don't copy `primitives.tsx` wholesale.** `Mono`/`Pill`/`Avatar` should move toward cva variants matching `Button` before they're reused.
- **Consolidate the dashboard `Ball` with marketing `Logo`.** The SVG is nearly identical; `Logo` adds a cue-ball highlight ellipse the dashboard design omits. A `<Ball highlight={false} />` prop on one shared component would end the duplication.

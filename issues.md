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

# TanStack Query / MSW follow-ups

Review findings from PR #6. Capture before they compound; none block merge.

## Medium

### 10. UI `Player` type is the de facto API contract
`src/lib/api/me.ts` and `src/mocks/handlers.ts` both import `Player` from `@/components/dashboard/data`. A dashboard refactor would ripple into the network + mock layers. Before the second endpoint lands, move API shapes to `src/lib/api/types.ts`; dashboard components consume from there, not vice versa.

### 11. Playwright has no MSW
Current e2e runs against `vite preview` (prod build), where MSW is gated off. Current specs don't hit `/api/*`, so this is latent. Before the first data-driven Playwright test, pick one:
- Wire MSW into preview under a flag.
- Switch e2e to `vite dev`.
- Add per-test mocks via `page.route()`.

## Low

### 12. Dev `onUnhandledRequest` is `'bypass'`
`src/main.tsx` — a typo'd endpoint silently hits the real network (or 404s) in dev. Consider `'warn'` so misrouted calls surface in DevTools without blocking.

### 13. React Query defaults are loose
`new QueryClient()` in `src/main.tsx` uses `staleTime: 0` (refetch on every mount) and `retry: 3` with exponential backoff. Decide on app-wide defaults (e.g. `staleTime: 30_000`, `retry: 1`) before many hooks land and start hammering the network.

### 14. Test wrapper + query-key boilerplate
`src/lib/api/me.test.tsx` inline-creates a `QueryClient({ retry: false })` + `QueryClientProvider` wrapper. On the second hook test, extract `src/test/query-wrapper.tsx` with a `renderHookWithQuery(hook)` helper. Also introduce a query-key factory (e.g. `meKeys.all = ['me'] as const`) before bare strings like `['me']` proliferate across hooks.

### 15. `useMe` error discards response body
`src/lib/api/me.ts` throws with `${res.status}` only. Once real endpoints ship, parse the JSON body (when present) into the error to keep debugging info. Not urgent.

# Session persistence follow-ups

Review findings from `feat/create-session` (PR #7). None block merge.

## Medium

### 19. No error boundary around the session Suspense
`src/routes/_app.tsx` — the Suspense boundary has no `<ErrorBoundary>` paired with it. If `POST /v1/session` 5xxs or the network drops, the suspended throw surfaces past the layout with nothing to catch it (white screen). Wrap `<SessionGate />` in an error boundary with a "retry" affordance before the next feature adds a second authed route.

### 20. JWT in localStorage is XSS-exposed
`src/lib/auth/tokenStore.ts` persists the bearer token to localStorage, which any injected script can read. Mature option is an httpOnly cookie + `credentials: 'include'` (drags CORS into "allow credentials" territory). Defer until matches/ratings tie real value to identity, but keep this near the top of the post-merge backlog.

### 21. Production CORS and build-time `VITE_API_URL`
The Vite proxy at `vite.config.ts` (`server.proxy['/v1']`) hides cross-origin in dev and preview only. In production the static bundle calls `VITE_API_URL` directly, and the FastAPI app currently has no `CORSMiddleware`. First deploy will fail unless either (a) CORS is added on the API for the web origin, or (b) both are fronted by the same reverse proxy with relative URLs. `VITE_API_URL` is also baked at build time — consider a runtime `/config.json` fetch on boot if one image needs to span environments.

## Low

### 16. Multi-tab token sync
`src/lib/auth/tokenStore.ts` — zustand `persist` writes localStorage, but the in-memory store is per-tab. If tab A rotates its token, tab B keeps stale state until its next page load. Subscribe to `storage` events (or use zustand's rehydrate hook) if cross-tab consistency starts to matter.

### 17. Token rotation behavior is undocumented
`src/lib/api/session.ts` — the queryFn overwrites the stored token on every successful POST. This is intentional (supports server-side rotation) but should be commented near the call so a future reader doesn't "fix" it back to a write-once pattern.

### 18. Private/incognito creates anonymous users on every refresh
When localStorage throws (Safari private browsing, sandboxed iframes), the store stays `null` and each load creates a fresh user. Acceptable today; revisit once matches/ratings make ephemeral identity user-visible (e.g. a "your stats won't persist" banner).

### 22. Suspense fallback is `null` (white flash)
`src/routes/_app.tsx` renders `<Suspense fallback={null}>` while the session POST is in flight. On a real network this is a blank page for the round-trip. Even a placeholder div with the dashboard's background colour would prevent the flash.

### 23. `/v1/session` failure path is untested
`src/lib/api/session.ts` throws inside the queryFn on `error`, but no test covers it. Add an MSW handler returning `{ status: 500 }` and assert the throw surfaces. Will need an error boundary in the test wrapper once #19 lands.

### 24. Vite proxy target is hardcoded
`vite.config.ts` — the dev/preview proxy `apiProxy` points at `http://127.0.0.1:4001`, assuming every dev runs the `fortymm-api` Docker container with that exact port mapping. Either source from `VITE_API_PROXY_TARGET` with that as the default, or add a comment explaining the assumption.

### 25. `--legacy-peer-deps` needed for fresh installs
`openapi-typescript@7` declares `peerDependencies.typescript: "^5.x"` but the repo is on `typescript@6`. `npm ci` follows the lockfile so CI is unaffected; anyone running `npm install` from scratch hits ERESOLVE. Add `legacy-peer-deps=true` to a project-level `.npmrc`, or upgrade `openapi-typescript` once it supports TS 6.

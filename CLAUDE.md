# CLAUDE.md - Project Guide for Claude Code

## Quick Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # TypeScript check + production build
npm run test:run     # Run tests once
npm run test         # Watch mode for tests
npm run lint         # ESLint check
npx tsc -b           # Type check only
```

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Testing**: Vitest + @testing-library/react + happy-dom + MSW
- **Routing**: React Router DOM 7
- **Data Fetching**: React Query + Axios
- **Forms**: React Hook Form + Zod

## Project Structure

```
src/
├── NewMatch/           # Feature folder (components + hooks + tests + page objects)
├── lib/                # Shared utilities (api client, etc.)
├── test/
│   ├── setup.ts        # Test configuration + MSW setup
│   ├── utils.ts        # Test utilities (QueryClientProvider wrapper)
│   └── mocks/          # MSW handlers and server
├── App.tsx             # Main router wrapper
├── Layout.tsx          # Root layout with navbar
├── routes.tsx          # Route definitions
└── main.tsx            # Entry point
```

## Page Object Testing Pattern

Every component follows this three-file pattern:

1. **Component** (`Component.tsx`) - Pure React component
2. **Page Object** (`Component.page.tsx`) - Test helpers and selectors
3. **Test** (`Component.test.tsx`) - Tests using the page object

### Example

```typescript
// QuickMatchButton.tsx
function QuickMatchButton() {
  return <button className="btn btn-primary">Quick Match</button>
}

// QuickMatchButton.page.tsx
export const quickMatchButtonPage = {
  render() { render(<QuickMatchButton />) },
  get button() { return screen.getByRole('button', { name: 'Quick Match' }) },
  async click() { await userEvent.click(this.button) },
}

// QuickMatchButton.test.tsx
describe('QuickMatchButton', () => {
  it('displays button', () => {
    quickMatchButtonPage.render()
    expect(quickMatchButtonPage.button).toBeInTheDocument()
  })
})
```

## Hook Page Objects

Hooks that make API calls follow a similar pattern with a page object for testing:

1. **Hook** (`useFeature.ts`) - The custom hook with Zod schema
2. **Page Object** (`useFeature.page.ts`) - Test helpers including `requestHandler`
3. **Tests** use the page object's `requestHandler` for MSW mocking

### Example

```typescript
// useCreateMatch.ts
export const createMatchPayloadSchema = z.object({
  opponentId: z.string().nullable(),
  matchLength: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)]),
})

export type CreateMatchPayload = z.infer<typeof createMatchPayloadSchema>

export function useCreateMatch() {
  return useMutation({
    mutationFn: async (payload: CreateMatchPayload) => {
      const validatedPayload = createMatchPayloadSchema.parse(payload)
      const response = await api.post('/matches', validatedPayload)
      return response.data
    },
  })
}

export { ENDPOINT as CREATE_MATCH_ENDPOINT }

// useCreateMatch.page.ts
export const useCreateMatchPage = {
  render(options = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.post(FULL_ENDPOINT, handler)
  },
}

// In tests - use the page object's requestHandler
server.use(
  useCreateMatchPage.requestHandler(async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'match-123', ...body })
  })
)
```

## Hook Colocation

**Keep hooks with the components that use them.** Only place hooks in a shared `src/hooks/` directory if they are used across multiple feature folders.

```
src/
├── NewMatch/
│   ├── QuickMatchButton.tsx
│   ├── QuickMatchButton.page.tsx
│   ├── QuickMatchButton.test.tsx
│   ├── useCreateMatch.ts          # Hook lives with component
│   └── useCreateMatch.page.ts     # Hook page object
```

## Zod Schema Conventions

- Define schemas for all API payloads using Zod
- Export the schema and inferred type together
- Use `.parse()` to validate before sending to API
- Use `@hookform/resolvers/zod` for form validation

```typescript
export const createMatchPayloadSchema = z.object({
  opponentId: z.string().nullable(),
  matchLength: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)]),
})

export type CreateMatchPayload = z.infer<typeof createMatchPayloadSchema>
```

## Code Conventions

- **Queries**: Prefer `getByRole()` > `getByText()` > `getByLabelText()`
- **Styling**: Tailwind utilities + DaisyUI classes directly in JSX
- **Props**: Use TypeScript interfaces; discriminated unions for restricted strings
- **Tests**: Always use page objects; never query DOM directly in tests
- **API Mocking**: Use hook page objects' `requestHandler` method - never hardcode URLs in tests

## No Barrel Files

**Never use `index.ts` barrel files.** Import components directly by their full path.

```typescript
// ✅ Good - direct import
import AppearanceSettings from './AppearanceSettings/AppearanceSettings'
import UserMenu from './UserMenu/UserMenu'

// ❌ Bad - barrel file import
import AppearanceSettings from './AppearanceSettings'
```

## Feature Folder Structure

Components live at the root of `src/`. If a component has dependencies (child components, hooks), create a folder:

```
src/
├── Navbar.tsx                    # Simple component, no folder needed
├── Navbar.page.tsx
├── Navbar.test.tsx
├── AppearanceSettings/           # Component with dependencies
│   ├── AppearanceSettings.tsx    # Main component
│   ├── AppearanceSettings.page.tsx
│   ├── AppearanceSettings.test.tsx
│   ├── AppearanceCard.tsx        # Child component
│   └── useAppearance.ts          # Hook used by this component
```

## Page Object Composition

**Page objects MUST delegate to child page objects.** Never duplicate selectors.

```typescript
// ✅ Good - Navbar.page.tsx delegates to UserMenu.page.tsx
import { userMenuPage } from './UserMenu/UserMenu.page'

export const navbarPage = {
  render() { /* ... */ },
  get brandLink() { return screen.getByRole('link', { name: 'FortyMM' }) },

  // Delegate to child page object
  userMenu: userMenuPage,
}

// In tests:
navbarPage.userMenu.appearanceLink

// ❌ Bad - duplicating selectors from child
export const navbarPage = {
  get userMenuButton() { return screen.getByRole('button', { name: 'User menu' }) },
  get appearanceLink() { return screen.getByRole('link', { name: /appearance/i }) },
}
```

## CI Pipeline

All PRs must pass: lint → type check → tests → build

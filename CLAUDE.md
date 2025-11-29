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
- **Testing**: Vitest + @testing-library/react + happy-dom
- **Routing**: React Router DOM 7

## Project Structure

```
src/
├── NewMatch/           # Feature folder (components + tests + page objects)
├── test/setup.ts       # Test configuration
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

## Code Conventions

- **Queries**: Prefer `getByRole()` > `getByText()` > `getByLabelText()`
- **Styling**: Tailwind utilities + DaisyUI classes directly in JSX
- **Props**: Use TypeScript interfaces; discriminated unions for restricted strings
- **Tests**: Always use page objects; never query DOM directly in tests
- **Composition**: Page objects delegate to child page objects

## CI Pipeline

All PRs must pass: lint → type check → tests → build

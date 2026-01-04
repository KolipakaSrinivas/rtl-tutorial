# Testing

As developers, our primary goal is to build software that works. To ensure that, we test the application and verify it behaves as expected.

## Table of contents

1. Manual testing  
2. Automated testing  
3. Jest vs React Testing Library (RTL)  
4. Types of tests  
5. Testing pyramid  
6. RTL philosophy  
7. The `test` API (Jest)  
8. Example component and tests  
9. Test-Driven Development (TDD)  
10. Jest watch mode  
11. `only` and `skip`  
12. `describe`  
13. Filename conventions and aliases  
14. Coverage reporting in React with Jest + RTL  
15. Assertions  
16. What to test / What not to test  
17. RTL queries overview  
18. getByRole  
19. Final notes

---

## 1. Manual testing

Manual testing is when a person opens the app and interacts with it to verify behavior.

Drawbacks:
- Time-consuming
- Error-prone for repetitive flows
- Hard to scale for every feature

---

## 2. Automated testing

Automated tests are programs that exercise your application and assert expected outcomes.

Advantages:
- Fast once written
- Consistent and reliable
- Easier to catch regressions
- Increases confidence when shipping

Course examples:
- Jest + React Testing Library
- Component testing (user interactions)
- Components wrapped with providers
- Mocking strategies
- Static analysis / linting tests

---

## 3. Jest vs React Testing Library (RTL)

- React Testing Library (RTL)
  - Utilities to render components into a virtual DOM.
  - Encourages testing behavior from a user perspective.
  - Promotes queries like `getByRole`, `getByText`, `getByLabelText`.

- Jest
  - Test runner + assertion library.
  - Runs tests, provides mocks, timers, snapshots, reporters.

How they fit together:
- Run tests with Jest, render and interact with components using RTL.

---

## 4. Types of tests

- Unit tests: test small units (functions/components) in isolation.
- Integration tests: test interactions between parts (component + provider).
- End-to-end (E2E) tests: test full user flows in a browser (Playwright, Cypress).

Unit tests are fast and numerous; integration tests are moderate and more realistic; E2E are few and validate critical flows.

---

## 5. Testing pyramid

Recommended distribution:
- E2E (few, high cost)
- Integration (moderate)
- Unit (many, low cost)

---

## 6. RTL philosophy

"The more your tests resemble the way your software is used, the more confidence they can give you."

Goals:
- Test user-visible behavior, not internal implementation.
- Make tests resilient to refactors that don't change behavior.

---

## 7. The `test` API (Jest)

Signature:
```js
test(name, fn, timeout)
```
- `name` — string describing the test
- `fn` — test function with expectations
- `timeout` — optional timeout (default 5000 ms in Jest)

Example:
```js
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

## 8. Example component and tests

Greet component (JS):
```jsx
// Greet.jsx
export default function Greet({ name }) {
  return (
    <div>
      <h1>Hello {name ? name : "World"}</h1>
    </div>
  );
}
```

Greet tests (JS):
```js
// Greet.test.jsx
import { render, screen } from "@testing-library/react";
import Greet from "./Greet";

test("renders default greet message", () => {
  render(<Greet />);
  expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

test("renders name passed via props", () => {
  render(<Greet name="Srinivas" />);
  expect(screen.getByText(/hello srinivas/i)).toBeInTheDocument();
});
```

TypeScript variant:
```tsx
// Greet.tsx
type GreetProps = { name?: string };

export default function Greet({ name }: GreetProps) {
  return (
    <div>
      <h1>Hello {name ?? "World"}</h1>
    </div>
  );
}
```
Tests for TS are the same as JS examples, assuming test runner supports TS.

Notes:
- Prefer queries that reflect user interactions (`getByRole`, `getByLabelText`) when applicable.
- Make tests readable and behavior-focused.

---

## 9. Test-Driven Development (TDD)

Cycle:
1. Red — write a failing test describing desired behavior.
2. Green — implement minimal code to pass the test.
3. Refactor — improve code while keeping tests passing.

TDD helps design and incremental development.

---

## 10. Jest watch mode

Watch reruns only tests related to changed files.

Commands:
- Start watch: `npm test -- --watch` or `yarn test --watch`
- One-shot with coverage: `npm test -- --coverage --watchAll=false`

---

## 11. `only` and `skip`

- `test.only(name, fn)` — run only this test
- `test.skip(name, fn)` — skip this test

Aliases: `it.only`, `it.skip`.

Be careful to remove `.only` before merging.

---

## 12. `describe`

Group related tests:
```js
describe("Greet component", () => {
  test("renders default greeting", () => { /* ... */ });
  test("renders with name prop", () => { /* ... */ });

  describe("edge cases", () => {
    test("renders empty name as World", () => { /* ... */ });
  });
});
```

Nested `describe` blocks help structure suites.

---

## 13. Filename conventions and aliases

Common file names:
- `Component.test.tsx`
- `Component.spec.tsx`

Locations:
- Next to implementation (co-located), or
- Under `__tests__/` folder.

Aliases:
- `test` == `it`
- `test.only` ↔ `fit`, `test.skip` ↔ `xit` (older aliases)

---

## 14. Coverage reporting in React with Jest + RTL

Quick summary:
- Code coverage measures what parts of your code are executed by tests; Jest uses Istanbul for this.
- Coverage is diagnostic — high coverage ≠ high-quality tests.

Common metrics:
- Statement coverage
- Line coverage
- Branch coverage
- Function coverage

Commands:
- CRA:
  - package.json: `"test:coverage": "react-scripts test --coverage"`
  - Run: `npm run test:coverage` or `yarn test:coverage`
  - CI one-shot: `CI=true npm test -- --coverage --watchAll=false`
- Jest directly:
  - `"test:coverage": "jest --coverage"`
  - `npx jest --coverage --watchAll=false`

What Jest produces:
- Terminal summary
- HTML report: `coverage/lcov-report/index.html`
- `lcov.info` for Codecov/Coveralls
- `coverage-final.json`

Example `package.json` Jest snippet:
```json
"jest": {
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/index.{js,ts}",
    "!src/**/*.stories.{js,jsx,ts,tsx}"
  ]
}
```

Example `jest.config.js`:
```js
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/index.{js,ts}",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85
    }
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"]
};
```

Ignoring files:
- Use `collectCoverageFrom` (globs) or `coveragePathIgnorePatterns` (regex).
- Common exclusions: tests, stories, `*.d.ts`, index re-exports, generated code. `node_modules` is automatic.

Interpreting reports:
- Look for low branch coverage or files with 0% (may be excluded or never imported).
- Use HTML report to see uncovered lines.
- Upload `lcov.info` to Codecov/Coveralls in CI for PR comments and badges.

RTL-specific guidance:
- Write tests that mimic user interactions to exercise branches (different props, loading, error states).
- Avoid tests that only poke at internals just to raise coverage.
- Mocking child modules can hide uncovered code — mock carefully.

CI integration (high-level):
1. Run tests with coverage in CI.
2. Upload `coverage/lcov.info` to Codecov/Coveralls (or save `coverage` as an artifact).
3. Optionally fail CI via `coverageThreshold`.

---

## 15. Assertions

Assertions decide whether a test passes or fails.

`expect`:
```js
expect(value).matcher(expected)
```
- Example matchers:
  - `.toBe(value)` — strict equality
  - `.toEqual(value)` — deep equality
  - `.toBeTruthy()`, `.toBeNull()`, `.toBeDefined()`
  - From jest-dom: `.toBeInTheDocument()`, `.toHaveTextContent()`, `.toHaveAttribute()`

Example:
```js
expect(screen.getByText(/hello world/i)).toBeInTheDocument();
```

---

## 16. What to test / What not to test

What to test:
- Component renders
- Component renders with props
- Component renders in different states (loading, error, empty)
- Component reacts to user events
- Critical business logic and edge cases

What not to test:
- Implementation details (internal state, private methods)
- Third-party library behavior
- Trivial code that does not affect user-visible behavior

---

## 17. RTL queries overview

Typical test flow:
1. Render the component with `render`.
2. Find element(s) using queries.
3. Assert expected outcome with `expect`.

Query families:

Single-element queries:
- `getBy...` — returns element, throws if none or multiple
- `queryBy...` — returns element or null, does not throw
- `findBy...` — async, returns Promise, waits for element

Multiple-element queries:
- `getAllBy...`, `queryAllBy...`, `findAllBy...`

Suffixes:
- `Role`, `LabelText`, `PlaceholderText`, `Text`, `DisplayValue`, `AltText`, `Title`, `TestId`

Prefer queries in this order (where possible):
1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` (last resort)

---

## 18. getByRole

`getByRole` queries elements by ARIA role (semantic meaning). Many native elements have implicit roles:
- `<button>` → role `button`
- `<a>` → role `link`
- `<h1>` → role `heading`
- `<input type="checkbox">` → role `checkbox`

You can also set an explicit `role` attribute on elements that don't have a semantic role.

Benefits:
- Encourages accessible markup.
- Finds elements the way assistive tech would.

Example:
```js
// find a button with accessible name 'submit'
const btn = screen.getByRole('button', { name: /submit/i });
expect(btn).toBeEnabled();
```

---

## 19. Final notes

- Aim for readable, behavior-focused tests that mimic user interactions.
- Test through public component behavior and UI rather than internals.
- Keep tests deterministic, maintainable, and fast where possible.
- Use a balanced mix of unit, integration, and E2E tests based on the testing pyramid.

If you’d like, I can:
- Convert this document into a repository README or CONTRIBUTING.md,
- Provide a ready-to-drop `jest.config.js` tailored to your project,
- Create example tests for a specific component in your codebase,
- Or generate a GitHub Actions workflow that runs tests and uploads coverage.

Which would you like next?
# Testing

Changelog:

- Fixed grammar, spelling, and punctuation.
- Removed duplicated sections and reordered content for consistency.
- Consolidated Testing Library query reference into one section.
- Made code examples consistent (JSX/TSX) and fixed minor mistakes.
- Added brief "What's next" suggestions at the end.

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
19. Testing Library query methods (reference)
20. Example application component and tests
21. Final notes

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

Core examples:

- Jest + React Testing Library
- Component testing (user interactions)
- Components wrapped with providers
- Mocking strategies
- Static analysis / linting tests

---

## 3. Jest vs React Testing Library (RTL)

React Testing Library (RTL)

- Utilities to render components into a virtual DOM.
- Encourages testing behavior from a user perspective.
- Promotes queries like `getByRole`, `getByText`, `getByLabelText`.

Jest

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
test(name, fn, timeout);
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

Greet component (JSX):

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

Greet tests (JSX):

```jsx
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

Tests for TypeScript are the same as JS examples, assuming the test runner supports TypeScript.

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
  test("renders default greeting", () => {
    /* ... */
  });
  test("renders with name prop", () => {
    /* ... */
  });

  describe("edge cases", () => {
    test("renders empty name as World", () => {
      /* ... */
    });
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
    "!src/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
```

Ignoring files:

- Use `collectCoverageFrom` (globs) or `coveragePathIgnorePatterns` (regex).
- Common exclusions: tests, stories, `*.d.ts`, index re-exports, generated code. `node_modules` is automatic.

Interpreting reports:

- Look for low branch coverage or files with 0% (may be excluded or never imported).
- Use the HTML report to see uncovered lines.
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
expect(value).matcher(expected);
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

Preferred query priority (where possible):

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` (last resort)

Use regex, case-insensitive flags, and options (e.g., `{ name: /.../i }`, `{ exact: false }`) to make matches flexible and robust.

---

## 18. getByRole

`getByRole` queries elements by ARIA role (semantic meaning). Many native elements have implicit roles:

- `<button>` → role `button`
- `<a>` → role `link`
- `<h1>` → role `heading`
- `<input type="checkbox">` → role `checkbox`

You can also set an explicit `role` attribute on non-semantic elements.

Benefits:

- Encourages accessible markup.
- Finds elements the way assistive tech would.
- Can scope by accessible name and options (e.g., `{ name: /submit/i }`, `{ hidden: true }`).

Example:

```js
// find a button with accessible name 'submit'
const btn = screen.getByRole("button", { name: /submit/i });
expect(btn).toBeEnabled();
```

---

## 19. Testing Library query methods (reference)

Below are common DOM/query helpers used with Testing Library, with description, benefits, caveats, and a short example for each.

- getByLabelText

  - Queries form controls by accessible name derived from `<label>`, `aria-label`, or `aria-labelledby`.
  - Benefits: mirrors how screen readers find controls.
  - Example:
    ```js
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("type", "email");
    ```

- getByPlaceholderText

  - Finds inputs/textareas by their `placeholder` attribute.
  - Prefer labels for accessibility; use placeholders when appropriate.
  - Example:
    ```js
    const search = screen.getByPlaceholderText(/search/i);
    expect(search).toHaveValue("");
    ```

- getByText

  - Finds elements by visible text content.
  - Example:
    ```js
    const loadMore = screen.getByText(/load more/i);
    expect(loadMore).toBeInTheDocument();
    ```

- getByDisplayValue

  - Queries form controls by their displayed value.
  - Useful for pre-filled or controlled inputs.
  - Example:
    ```js
    const nameInput = screen.getByDisplayValue("Alice");
    expect(nameInput).toHaveAttribute("name", "username");
    ```

- getByAltText

  - Queries images/elements with role `img` by their `alt` attribute.
  - Ensures images are accessible via alt text.
  - Example:
    ```js
    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar).toBeInTheDocument();
    ```

- getByTitle

  - Finds elements by their `title` attribute.
  - Used for tooltip-like descriptions or titles.
  - Example:
    ```js
    const close = screen.getByTitle(/close/i);
    expect(close).toBeVisible();
    ```

- getByTestId
  - Queries elements by `data-testid`.
  - Use as a last resort when no suitable accessible query exists.
  - Example:
    ```js
    const empty = screen.getByTestId("user-list-empty");
    expect(empty).toHaveTextContent(/no users/i);
    ```

---

## 20. Example application component and tests

Application component:

```jsx
// Application.jsx
export const Application = () => {
  return (
    <>
      <h1>Job application form</h1>
      <h2>Section 1</h2>
      <p>All fields are mandatory</p>
      <span title="close">X</span>
      <img src="https://via.placeholder.com/150" alt="a person with a laptop" />
      <div data-testid="custom-element">Custom HTML element</div>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Fullname"
            value="Srinivas"
            onChange={() => {}}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" />
        </div>
        <div>
          <label htmlFor="job-location">Job location</label>
          <select id="job-location">
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="IN">India</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" id="terms" /> I agree to the terms and
            conditions
          </label>
        </div>
        <button disabled>Submit</button>
      </form>
    </>
  );
};
```

Tests that exercise many RTL queries:

```js
// Application.test.jsx
import { render, screen } from "@testing-library/react";
import { Application } from "./Application";

describe("Application", () => {
  test("renders application form correctly using RTL queries", () => {
    render(<Application />);

    // getByRole
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toBeInTheDocument();

    const bioInput = screen.getByRole("textbox", { name: /bio/i });
    expect(bioInput).toBeInTheDocument();

    const jobLocationSelect = screen.getByRole("combobox", {
      name: /job location/i,
    });
    expect(jobLocationSelect).toBeInTheDocument();

    const termsCheckbox = screen.getByRole("checkbox", {
      name: /i agree to the terms and conditions/i,
    });
    expect(termsCheckbox).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();

    const headingH1 = screen.getByRole("heading", {
      level: 1,
      name: /job application form/i,
    });
    expect(headingH1).toBeInTheDocument();

    const headingH2 = screen.getByRole("heading", {
      level: 2,
      name: /section 1/i,
    });
    expect(headingH2).toBeInTheDocument();

    // getByLabelText
    const nameByLabel = screen.getByLabelText(/name/i);
    expect(nameByLabel).toBeInTheDocument();

    const bioByLabel = screen.getByLabelText(/bio/i);
    expect(bioByLabel).toBeInTheDocument();

    const termsByLabel = screen.getByLabelText(
      /i agree to the terms and conditions/i
    );
    expect(termsByLabel).toBeInTheDocument();

    // getByPlaceholderText
    const namePlaceholder = screen.getByPlaceholderText(/fullname/i);
    expect(namePlaceholder).toBeInTheDocument();

    // getByText
    const mandatoryText = screen.getByText(/all fields are mandatory/i);
    expect(mandatoryText).toBeInTheDocument();

    // getByDisplayValue
    const displayValue = screen.getByDisplayValue("Srinivas");
    expect(displayValue).toBeInTheDocument();

    // getByAltText
    const image = screen.getByAltText(/a person with a laptop/i);
    expect(image).toBeInTheDocument();

    // getByTitle
    const closeIcon = screen.getByTitle(/close/i);
    expect(closeIcon).toBeInTheDocument();

    // getByTestId
    const customElement = screen.getByTestId("custom-element");
    expect(customElement).toBeInTheDocument();
  });
});
```

---

## 21. getAllBy''(role)

1. `getALLByRole`
2. `getAllByLabelText`
3. `getALlByPlaceholderText`
4. `getALlByText`
5. `getALlByDisplayValue`
6. `getAllByAltText`
7. `getAllByTitle`
8. `getALlByTestId` (last resort)

Synchronous.
Returns an array of matching elements.
Throws if there are zero matches.
Use when you expect one-or-more elements (e.g., multiple list items) and want to assert the count or inspect each item.

````js
import { useState, useEffect } from 'react'
import { SkillsProps } from './Skills.types'

export const Skills = (props: SkillsProps) => {
  const { skills } = props
  return (
    <>
      <ul>
        {skills.map((skill) => {
          return <li key={skill}>{skill}</li>
        })}
      </ul>
    </>
  )
}

import { render, screen } from "@testing-library/react";
import { Skills } from "./Skills";

describe("Skills", () => {
  const skills = ["javascript", "reactjs", "Nextjs"];

  test("renders skills correctly", () => {
    render(<Skills skills={skills} />);
    const listElement = screen.getByRole("list");
    expect(listElement).toBeInTheDocument();
  });

  test("skills item renders correctly", () => {
    render(<Skills skills={skills} />);
    const listElements = screen.getAllByRole("listitem");
    expect(listElements).toHaveLength(3);
  });

});

``

## 23. queryBy()

  getByRole(...) — synchronous, returns the element if exactly one match is found, and throws an error if zero or multiple matches. Good when you expect an element to be present immediately.
  queryByRole(...) — synchronous, returns the element if exactly one match is found, returns null if none, and throws if multiple matches. Good for asserting absence (or optional elements).

``` js
import { useState, useEffect } from 'react'
export const Skills = (props: SkillsProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1001)
  }, [])

  return (
    <>
      {isLoggedIn ? (
        <button>Start learning</button>
      ) : (
        <button onClick={() => setIsLoggedIn(true)}>Login</button>
      )}
    </>
  )
}

import { render, screen } from "@testing-library/react";
import { Skills } from "./Skills";

describe("Skills", () => {
  const skills = ["javascript", "reactjs", "Nextjs"];
  test("Login button", () => {
    render(<Skills skills={skills} />);
    const LoginButton = screen.getByRole("button",{
        name:"Login"
    });
    expect(LoginButton).toBeInTheDocument();
  });

  test("not renders Start learning",() =>{
    render(<Skills skills={skills}/>);
    const StartlearningButton = screen.queryByRole("button",{
        name:"Start learning"
    })

    expect(StartlearningButton).not.toBeInTheDocument()
  })
});


````

## 23. findByRole(...)

async, returns a Promise that resolves to the element (or rejects) after waiting — use for elements that appear after async behavior.

```js
import { useState, useEffect } from "react";
import { SkillsProps } from "./Skills.types";

export const Skills = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoggedIn(true);
    }, 1000);
  }, []);
  return (
    <>
      {isLoggedIn ? (
        <button>Start learning</button>
      ) : (
        <button onClick={() => setIsLoggedIn(true)}>Login</button>
      )}
    </>
  );
};

import { render, screen } from "@testing-library/react";
import { Skills } from "./Skills";

describe("Skills", () => {
  test("Start learning button slowly displaying", async () => {
    render(<Skills />);
    const startLearingButton = await screen.findByRole(
      "button",
      {
        name: "Start learning",
      },
      { timeout: 2000 }
    );
    expect(startLearingButton).toBeInTheDocument();
  });
});
```

## 22. getByText

getByText will search for all elements that have a text node with textContent matching the text
Typically, you'd use this to find paragraph, div or span elements

TextMatch - string

<div>Hello World</div>
screen.getByText('Hello World') // full string match
screen.getByText('llo Worl', {exact: false}) // substring match
screen.getByText('hello world', {exact: false}) // ignore case

TextMatch - custom function
(content?: string, element?: Element | null) => boolean

<div>Hello World</div>
screen.getByText((content) => content.startsWith('Hello'))

## 22. Final notes

- Aim for readable, behavior-focused tests that mimic user interactions.
- Test through public component behavior and UI rather than internals.
- Keep tests deterministic, maintainable, and fast where possible.
- Use a balanced mix of unit, integration, and E2E tests based on the testing pyramid.

If you’d like, I can:

- Convert this document into a repository `README.md` or `CONTRIBUTING.md`,
- Provide a ready-to-drop `jest.config.js` tailored to your project,
- Create example tests for a specific component in your codebase,
- Or generate a GitHub Actions workflow that runs tests and uploads coverage.

Which would you like next?

```

```

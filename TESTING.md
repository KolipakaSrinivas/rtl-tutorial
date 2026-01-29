# Testing

Changelog
- Fixed grammar, spelling, and punctuation.
- Removed duplicated and out-of-order sections.
- Consolidated Testing Library query information into one section.
- Made code examples consistent (JSX/TSX) and fixed minor mistakes.
- Added more examples for async behavior, user events, mocking, and forms.
- Added detailed keyboard/clipboard/pointer APIs and provider examples.
- Added brief "What's next" suggestions.

As developers, our primary goal is to build software that works. Tests help confirm that behavior and prevent regressions. This guide focuses on testing React components with Jest + React Testing Library (RTL) and practical examples showing common patterns.

## Table of contents

1. Overview: manual vs automated testing  
2. Jest vs React Testing Library (RTL)  
3. Types of tests & the testing pyramid  
4. RTL philosophy & testing goals  
5. Jest basics: test API, describe, only/skip, watch mode  
6. Common test patterns  
7. Example components and tests (JSX + TSX)  
8. User interactions: user-event vs fireEvent  
9. Async tests: findBy, waitFor  
10. Mocking (jest.fn, module mocks, fetch)  
11. Queries: preferred order and examples  
12. getAllBy*, queryBy*, findBy* usage  
13. Coverage basics and jest config  
14. Assertions: common matchers  
15. What to test / what not to test  
16. Debugging tests: screen.debug, logRoles  
17. Testing playground & tools  
18. Keyboard & advanced user interactions (type, keyboard, paste, select, tab, etc.)  
19. Providers & custom render helpers (new)  
20. Final notes and next steps

---

## 19. Providers & custom render helpers

In real apps, components are often wrapped with context providers (Redux, Router, Theme, React Query, Intl, etc.). Tests should render components with the same providers they rely on. To avoid repetitive provider setup, create a reusable test renderer (a "renderWithProviders" helper) that wraps components in the necessary providers.

Below are examples and patterns (JSX + TSX) for common providers and a combined helper. Use whichever providers your app needs — mix-and-match as required.

### Why a custom render?
- Keeps tests concise and focused on behavior.
- Ensures provider configuration is consistent across tests.
- Allows injecting initial state, routes, or query clients per test.

### 1) Minimal helper using RTL's `render` wrapper option

JSX example (basic)
```jsx
// test-utils.jsx
import { render } from "@testing-library/react";

export function renderWithProviders(ui, { wrapper } = {}) {
  return render(ui, { wrapper });
}
```

You can pass a wrapper component (which itself composes providers) from each test. But a more ergonomic approach is to provide a ready-made wrapper that includes all commonly-used providers.

### 2) Combined providers: Router + Theme + Redux + React Query

Example uses:
- react-redux (@reduxjs/toolkit)
- react-router (MemoryRouter)
- styled-components ThemeProvider (or any theme lib)
- @tanstack/react-query (QueryClientProvider)

JSX example
```jsx
// test-utils.jsx
import React from "react";
import { render } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components"; // or your theming lib
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import rootReducer from "../src/store/rootReducer"; // replace with your root reducer
import defaultTheme from "../src/theme"; // your theme

function createTestStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = "/",
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    theme = defaultTheme,
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    );
  }
  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

Usage in tests:
```jsx
// SomeComponent.test.jsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SomeComponent from "./SomeComponent";
import { renderWithProviders } from "../test-utils";

test("shows value from redux and navigates", async () => {
  const user = userEvent.setup();
  const preloadedState = { auth: { user: { name: "Alice" } } };
  const { store } = renderWithProviders(<SomeComponent />, { preloadedState, route: "/start" });

  expect(screen.getByText(/alice/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /next/i }));
  // assert on navigation or store updates
  expect(store.getState().someSlice.someFlag).toBe(true);
});
```

### 3) TypeScript variant

```tsx
// test-utils.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import rootReducer from "../src/store/rootReducer";
import defaultTheme from "../src/theme";

type ExtendedRenderOptions = Omit<RenderOptions, "queries"> & {
  preloadedState?: Record<string, any>;
  store?: EnhancedStore;
  route?: string;
  queryClient?: QueryClient;
  theme?: any;
};

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = "/",
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    theme = defaultTheme,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    );
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

### 4) Smaller examples (single providers)

Redux-only:
```jsx
// redux-test-utils.jsx
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../src/store/rootReducer";

export function renderWithRedux(ui, { preloadedState = {}, store = configureStore({ reducer: rootReducer, preloadedState }) } = {}) {
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
```

Router-only (useful for components reading route params / location):
```jsx
// router-test-utils.jsx
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function renderWithRouter(ui, { route = "/" } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
```

React Query only:
```jsx
// query-test-utils.jsx
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function renderWithQueryClient(ui, { queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }) } = {}) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
```

Styled-components / ThemeProvider only:
```jsx
// theme-test-utils.jsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import defaultTheme from "../src/theme";

export function renderWithTheme(ui, { theme = defaultTheme } = {}) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}
```

### 5) Example: testing a component that uses multiple providers

Component (simplified):
```jsx
// Profile.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const { data } = useQuery(["profile", user?.id], () => fetch(`/api/profile/${user.id}`).then(r => r.json()));

  if (!user) return <div>Not signed in</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <section>
      <h1>{data.name}</h1>
      <Link to="/settings">Settings</Link>
    </section>
  );
}
```

Test using `renderWithProviders`:
```jsx
// Profile.test.jsx
import { screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Profile from "./Profile";
import { renderWithProviders } from "../test-utils";

const server = setupServer(
  rest.get("/api/profile/1", (req, res, ctx) => res(ctx.json({ name: "Alice" }))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("shows profile name and link", async () => {
  const preloadedState = { auth: { user: { id: 1 } } };
  renderWithProviders(<Profile />, { preloadedState });
  expect(await screen.findByRole("heading", { name: /alice/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /settings/i })).toHaveAttribute("href", "/settings");
});
```

Notes:
- msw is recommended for network mocking in integration-like tests.
- `renderWithProviders` returns `store` and `queryClient` if you need to inspect or manipulate them in tests.

### 6) Utilities & best practices

- Export a single `renderWithProviders` from your test utilities and re-export everything from RTL so test authors import from one place:
  ```js
  // setupTests.js (or test-utils.js)
  import { render } from "@testing-library/react";
  import { renderWithProviders as customRender } from "./test-utils";

  export * from "@testing-library/react";
  export { customRender as render };
  ```
  Then in tests:
  ```js
  import { render, screen } from "../test-utils"; // now render is customRender
  ```

- Keep provider defaults simple and allow overriding per test (initial route, preloaded state, theme, query client).
- Reset or recreate query clients between tests to avoid cached query results bleeding across tests.
- When testing routing, use `MemoryRouter` and `initialEntries` to control the location and route params.

---

## Final notes

- Aim for readable, behavior-focused tests that reflect how users use your app.
- Keep tests fast and deterministic; choose the appropriate test type (unit/integration/E2E).
- Use coverage as a guide, not a goal: write meaningful tests rather than trying to hit a percentage.
- Make your tests accessibility-focused: using `getByRole` helps both testing and product accessibility.

What's next? I can:
- Convert this into a polished `CONTRIBUTING.md` or repository `README.md` (this file),
- Create a ready-to-drop `jest.config.js` tailored to your stack,
- Generate example tests for a specific component from your codebase,
- Create a GitHub Actions workflow that runs tests and uploads coverage.

Which would you like me to do next?
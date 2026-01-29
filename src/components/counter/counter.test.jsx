import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";

import Counter from "./Counter";

test("render counter component correctly", () => {});

describe("Counter Component", () => {
  test("counter heading correctly", () => {
    render(<Counter />);
    const CounterElement = screen.getByRole("heading");
    expect(CounterElement).toBeInTheDocument();
  });

  test("increment button correctly", () => {
    render(<Counter />);
    const counterButton = screen.getByRole("button", {
      name: /Increment/,
    });
    expect(counterButton).toBeInTheDocument();
  });

  test("render counter 1 after clicking the increment button", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const incrementBuuton = screen.getByRole("button", {
      name: "Increment",
    });
    await user.click(incrementBuuton);
    const counterElement = screen.getByRole("heading");
    expect(counterElement).toHaveTextContent("1");
  });

  test("render a counter 10 after clicking set button", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const setInput = screen.getByRole("spinbutton");
    await user.type(setInput, "10");
    expect(setInput).toHaveValue(10);

    const counterHeading = screen.getByRole("heading");
    const countButton = screen.getByRole("button", {
      name: "set",
    });
    await user.click(countButton);
    expect(counterHeading).toHaveTextContent("10");
  });

  test("element focused in order", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const incrementButton = screen.getByRole("button", {
      name: "Increment",
    });
    const input = screen.getByRole("spinbutton");
    const setButton = screen.getByRole("button", { name: "set" });
    await user.tab();
    expect(incrementButton).toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab();
    expect(setButton).toHaveFocus();
  });
});

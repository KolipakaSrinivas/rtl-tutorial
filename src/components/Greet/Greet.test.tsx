import { render, screen } from "@testing-library/react";
import Greet from "./Greet";

describe("Greet component", () => {
  test("renders greet correctly", () => {
    render(<Greet />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  test("renders name correctly", () => {
    render(<Greet name="srinivas" />);
    expect(screen.getByText(/hello srinivas/i)).toBeInTheDocument();
  });
});

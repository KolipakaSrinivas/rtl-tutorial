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

  test("Login button", () => {
    render(<Skills skills={skills} />);
    const LoginButton = screen.getByRole("button", {
      name: "Login",
    });
    expect(LoginButton).toBeInTheDocument();
  });

  test("not renders Start learning", () => {
    render(<Skills skills={skills} />);
    const StartlearningButton = screen.queryByRole("button", {
      name: "Start learning",
    });

    expect(StartlearningButton).not.toBeInTheDocument();
  });

  test("Start learning button slowly displaying", async () => {
    render(<Skills skills={skills} />);
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

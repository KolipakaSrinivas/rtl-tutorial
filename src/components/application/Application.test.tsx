import { render, screen } from "@testing-library/react";
import { Application } from "./Application";

describe("Application", () => {
  test("renders application form correctly using all RTL queries", () => {
    render(<Application />);

    /* -------------------- getByRole -------------------- */
    // Best query → checks accessibility role + accessible name

    // Text input (Name)
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toBeInTheDocument();

    // Textarea (Bio)
    const bioInput = screen.getByRole("textbox", { name: /bio/i });
    expect(bioInput).toBeInTheDocument();

    // Select dropdown → role = combobox
    const jobLocationSelect = screen.getByRole("combobox", {
      name: /job location/i,
    });
    expect(jobLocationSelect).toBeInTheDocument();

    // Checkbox
    const termsCheckbox = screen.getByRole("checkbox", {
      name: /i agree to the terms and conditions/i,
    });
    expect(termsCheckbox).toBeInTheDocument();

    // Button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeDisabled();

    // Heading level 1
    const headingH1 = screen.getByRole("heading", {
      level: 1,
      name: /job application form/i,
    });
    expect(headingH1).toBeInTheDocument();

    // Heading level 2
    const headingH2 = screen.getByRole("heading", {
      level: 2,
      name: /section 1/i,
    });
    expect(headingH2).toBeInTheDocument();

    /* -------------------- getByLabelText -------------------- */
    // Used for form fields linked with <label>

    const nameByLabel = screen.getByLabelText(/name/i);
    expect(nameByLabel).toBeInTheDocument();

    const bioByLabel = screen.getByLabelText(/bio/i);
    expect(bioByLabel).toBeInTheDocument();

    const termsByLabel = screen.getByLabelText(
      /i agree to the terms and conditions/i
    );
    expect(termsByLabel).toBeInTheDocument();

    /* -------------------- getByPlaceholderText -------------------- */
    // Useful for inputs with placeholder

    const namePlaceholder = screen.getByPlaceholderText(/fullname/i);
    expect(namePlaceholder).toBeInTheDocument();

    /* -------------------- getByText -------------------- */
    // Finds visible text (paragraphs, headings, spans)

    const mandatoryText = screen.getByText(/all fields are mandatory/i);
    expect(mandatoryText).toBeInTheDocument();

    /* -------------------- getByDisplayValue -------------------- */
    // Used when input already has a value

    const displayValue = screen.getByDisplayValue("Srinivas");
    expect(displayValue).toBeInTheDocument();

    /* -------------------- getByAltText -------------------- */
    // For images

    const image = screen.getByAltText(/a person with a laptop/i);
    expect(image).toBeInTheDocument();

    /* -------------------- getByTitle -------------------- */
    // For elements using title attribute

    const closeIcon = screen.getByTitle(/close/i);
    expect(closeIcon).toBeInTheDocument();

    /* -------------------- getByTestId -------------------- */
    // LAST option → when nothing else works

    const customElement = screen.getByTestId("custom-element");
    expect(customElement).toBeInTheDocument();
  });
});

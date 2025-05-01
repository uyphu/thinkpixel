import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "../Contact";

// ✅ Mock Layout to isolate Contact logic
vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

describe("Contact Page", () => {
  it("renders the heading, contact text, email, and back link", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    // Heading
    expect(
      screen.getByRole("heading", { name: /contact us/i })
    ).toBeInTheDocument();

    // Description text
    expect(
      screen.getByText(/we'd love to hear from you!/i)
    ).toBeInTheDocument();

    // Email
    expect(screen.getByText(/support@thinkpixel.dev/i)).toBeInTheDocument();

    // Back to Home link
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");

    // Layout wrapper present
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Terms from "../Terms";

// ✅ Mock Layout component
vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

describe("Terms Page", () => {
  it("renders heading, terms content, and back link", () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>
    );

    // Heading
    expect(
      screen.getByRole("heading", { name: /terms of service/i })
    ).toBeInTheDocument();

    // Terms paragraph
    expect(
      screen.getByText(/this platform is for educational purposes only/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/full legal terms will be published soon/i)
    ).toBeInTheDocument();

    // Back link
    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");

    // Layout
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });
});

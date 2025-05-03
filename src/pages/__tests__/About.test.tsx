import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import About from "../About";

// ✅ Mock Layout component exactly as imported in About.tsx
vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

describe("About Page", () => {
  it("renders heading, description, and back link", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    // Heading
    expect(screen.getByRole("heading", { name: /about thinkpixel/i })).toBeInTheDocument();

    // Description paragraphs
    expect(
      screen.getByText(/thinkpixel is a modern, interactive platform/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/future expansions will include visualizing/i)
    ).toBeInTheDocument();

    // Back link
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");

    // Layout presence
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
  });
});

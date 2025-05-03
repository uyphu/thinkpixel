import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../Home";

// ✅ Mock child components to isolate Home
vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

vi.mock("../../components/HeroSection", () => ({
  default: () => <div data-testid="mock-hero">Mock HeroSection</div>,
}));

vi.mock("../../components/AlgorithmGrid", () => ({
  default: () => <div data-testid="mock-algorithm-grid">Mock AlgorithmGrid</div>,
}));

describe("Home Page", () => {
  it("renders Layout, HeroSection, and AlgorithmGrid", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
    expect(screen.getByTestId("mock-hero")).toBeInTheDocument();
    expect(screen.getByTestId("mock-algorithm-grid")).toBeInTheDocument();
  });
});

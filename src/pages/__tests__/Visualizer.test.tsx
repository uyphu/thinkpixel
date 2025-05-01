import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Visualizer from "../Visualizer";

// Mocks
vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  ),
}));

vi.mock("../../algorithms/BubbleSortVisualizer", () => ({
  default: () => <div data-testid="bubble-visualizer">Bubble Sort</div>,
}));

describe("Visualizer Page", () => {
  it("renders correct visualizer based on route param", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/bubble-sort"]}>
        <Routes>
          <Route path="/visualizer/:algorithmName" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /bubble sort visualization/i })).toBeInTheDocument();
    expect(screen.getByTestId("bubble-visualizer")).toBeInTheDocument();
  });

  it("renders fallback message for unknown algorithm", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/unknown-algo"]}>
        <Routes>
          <Route path="/visualizer/:algorithmName" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Algorithm not found")).toBeInTheDocument();
  });

  it("renders all control buttons", () => {
    render(
      <MemoryRouter initialEntries={["/visualizer/bubble-sort"]}>
        <Routes>
          <Route path="/visualizer/:algorithmName" element={<Visualizer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /start sorting/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pause sorting/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enter step-by-step sorting mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /step through sorting/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset array/i })).toBeInTheDocument();
  });
});

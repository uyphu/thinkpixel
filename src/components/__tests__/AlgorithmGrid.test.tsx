import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AlgorithmGrid from "../AlgorithmGrid";

describe("AlgorithmGrid", () => {
  const algorithms = [
    { name: "Bubble Sort", path: "/visualizer/bubble-sort" },
    { name: "Selection Sort", path: "/visualizer/selection-sort" },
    { name: "Insertion Sort", path: "/visualizer/insertion-sort" },
    { name: "Merge Sort", path: "/visualizer/merge-sort" },
    { name: "Quick Sort", path: "/visualizer/quick-sort" },
    { name: "Binary Search", path: "/visualizer/binary-search" },
  ];

  it("renders section heading", () => {
    render(
      <MemoryRouter>
        <AlgorithmGrid />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/explore algorithms/i)
    ).toBeInTheDocument();
  });

  it("renders all algorithms with correct links", () => {
    render(
      <MemoryRouter>
        <AlgorithmGrid />
      </MemoryRouter>
    );

    algorithms.forEach((algo) => {
      const heading = screen.getByText(algo.name);
      expect(heading).toBeInTheDocument();

      const link = heading.closest("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", algo.path);
    });
  });
});

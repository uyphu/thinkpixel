import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MergeSortVisualizer from "../MergeSortVisualizer";

describe("MergeSortVisualizer", () => {
  const mockArray = [8, 3, 6, 1];
  const mockSetArray = vi.fn();

  const renderVisualizer = (props = {}) =>
    render(
      <MergeSortVisualizer
        array={mockArray}
        setArray={mockSetArray}
        isSorting={false}
        isPaused={false}
        stepMode={false}
        stepSignal={0}
        {...props}
      />
    );

  it("renders speed input and stat cards", () => {
    renderVisualizer();

    expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
    expect(screen.getByText("Comparisons")).toBeInTheDocument();
    expect(screen.getByText("Overwrites")).toBeInTheDocument();
  });

  it("renders merge sort code in the CodeBlock", () => {
    const { container } = renderVisualizer();
    expect(container.textContent).toContain("function mergeSort");
    expect(container.textContent).toContain("function merge");
  });

  it("renders bar values from input array", () => {
    renderVisualizer();
    const values = screen
      .getAllByTestId("bar-value")
      .map((el) => parseInt(el.textContent ?? "", 10))
      .sort((a, b) => a - b); // The bars are initialized and visually sorted

    expect(values).toEqual([1, 3, 6, 8]);
  });

  it("updates speed when range input is changed", () => {
    renderVisualizer();
    const slider = screen.getByLabelText(/speed/i);
    fireEvent.change(slider, { target: { value: "600" } });

    expect(slider).toHaveValue("600");
  });
});

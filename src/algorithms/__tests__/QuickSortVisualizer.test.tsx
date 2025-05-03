import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import QuickSortVisualizer from "../QuickSortVisualizer";

describe("QuickSortVisualizer", () => {
  const mockArray = [6, 1, 8, 3];
  const mockSetArray = vi.fn();

  const renderVisualizer = (props = {}) =>
    render(
      <QuickSortVisualizer
        array={mockArray}
        setArray={mockSetArray}
        isSorting={false}
        isPaused={false}
        stepMode={false}
        stepSignal={0}
        {...props}
      />
    );

  it("renders speed input and stats cards", () => {
    renderVisualizer();

    expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
    expect(screen.getByText("Comparisons")).toBeInTheDocument();
    expect(screen.getByText("Swaps")).toBeInTheDocument();
  });

  it("renders bar values from the array", () => {
    renderVisualizer();

    const values = screen
      .getAllByTestId("bar-value")
      .map((el) => parseInt(el.textContent ?? "", 10))
      .sort((a, b) => a - b);

    expect(values).toEqual([1, 3, 6, 8]);
  });

  it("renders Quick Sort code in the code block", () => {
    const { container } = renderVisualizer();
    expect(container.textContent).toContain("function quickSort");
    expect(container.textContent).toContain("const pivot = arr[arr.length - 1]");
  });

  it("updates speed value on slider change", () => {
    renderVisualizer();
    const slider = screen.getByLabelText(/speed/i);
    fireEvent.change(slider, { target: { value: "800" } });

    expect(slider).toHaveValue("800");
  });
});

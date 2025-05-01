import { render, screen, fireEvent } from "@testing-library/react";
import SelectionSortVisualizer from "../SelectionSortVisualizer";

describe("SelectionSortVisualizer", () => {
  const mockArray = [4, 1, 7, 2];
  const mockSetArray = vi.fn();

  const renderVisualizer = (props = {}) =>
    render(
      <SelectionSortVisualizer
        array={mockArray}
        setArray={mockSetArray}
        isSorting={false}
        isPaused={false}
        stepMode={false}
        stepSignal={0}
        {...props}
      />
    );

  it("renders stat cards and speed slider", () => {
    renderVisualizer();

    expect(screen.getByText("Comparisons")).toBeInTheDocument();
    expect(screen.getByText("Swaps")).toBeInTheDocument();
    expect(screen.getByText("Passes")).toBeInTheDocument();
    expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
  });

  it("renders the selection sort code", () => {
    const { container } = renderVisualizer();
    expect(container.textContent).toContain("function selectionSort");
    expect(container.textContent).toContain("minIndex");
  });

  it("renders initial bar values from the array", () => {
    renderVisualizer();

    const barValues = screen.getAllByTestId("bar-value").map((el) => parseInt(el.textContent ?? "", 10));
    expect(barValues.sort((a, b) => a - b)).toEqual([1, 2, 4, 7]);
  });

  it("updates speed when slider is changed", () => {
    renderVisualizer();

    const slider = screen.getByLabelText(/speed/i);
    fireEvent.change(slider, { target: { value: "800" } });

    expect(slider).toHaveValue("800");
  });
});

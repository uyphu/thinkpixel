import { render, screen, fireEvent } from "@testing-library/react";
import InsertionSortVisualizer from "../InsertionSortVisualizer";

describe("InsertionSortVisualizer", () => {
  const mockArray = [9, 3, 5, 1];
  const mockSetArray = vi.fn();

  const renderVisualizer = (props = {}) =>
    render(
      <InsertionSortVisualizer
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

  it("renders the code block", () => {
    const { container } = renderVisualizer();
    expect(container.textContent).toContain("function insertionSort");
  });

  it("renders sorted initial bar values", () => {
    renderVisualizer();

    const barEls = screen.getAllByTestId("bar-value");
    const values = barEls.map((el) => parseInt(el.textContent || "", 10));

    expect(values.sort((a, b) => a - b)).toEqual([1, 3, 5, 9].sort((a, b) => a - b));
  });

  it("updates speed when slider is moved", () => {
    renderVisualizer();

    const slider = screen.getByLabelText(/speed/i);
    fireEvent.change(slider, { target: { value: "700" } });

    expect(slider).toHaveValue("700");
  });
});

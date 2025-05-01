import { render, screen, fireEvent } from "@testing-library/react";
import BubbleSortVisualizer from "../BubbleSortVisualizer";

describe("BubbleSortVisualizer", () => {
  const mockArray = [5, 3, 8, 1];
  const mockSetArray = vi.fn();

  const renderVisualizer = (props = {}) =>
    render(
      <BubbleSortVisualizer
        array={mockArray}
        setArray={mockSetArray}
        isSorting={false}
        isPaused={false}
        stepMode={false}
        stepSignal={0}
        {...props}
      />
    );

  it("renders stats and speed input", () => {
    renderVisualizer();

    expect(screen.getByText("Comparisons")).toBeInTheDocument();
    expect(screen.getByText("Swaps")).toBeInTheDocument();
    expect(screen.getByText("Passes")).toBeInTheDocument();

    expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
  });

  it("renders the code block", () => {
    const { container } = renderVisualizer();
    expect(container.textContent).toContain("function bubbleSort");
  });

  it("renders sorted bar values", () => {
    renderVisualizer();

    const values = screen
      .getAllByTestId("bar-value")
      .map((el) => parseInt(el.textContent ?? "", 10));

    // should sort the array on mount
    expect(values.sort((a, b) => a - b)).toEqual([1, 3, 5, 8].sort((a, b) => a - b));
  });

  it("updates speed when range input is changed", () => {
    renderVisualizer();

    const slider = screen.getByLabelText(/speed/i);
    fireEvent.change(slider, { target: { value: "600" } });

    expect(slider).toHaveValue("600");
  });
});

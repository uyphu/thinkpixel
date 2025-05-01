import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import BinarySearchVisualizer from "../BinarySearchVisualizer";

describe("BinarySearchVisualizer", () => {
  const mockArray = [30, 10, 50, 20, 40];

  const renderVisualizer = () =>
    render(
      <BinarySearchVisualizer
        array={mockArray}
        setArray={vi.fn()}
        isSorting={false}
        isPaused={false}
        stepMode={false}
        stepSignal={0}
      />
    );

  it("renders input, button, and code block", () => {
    const { container } = renderVisualizer();

    expect(screen.getByPlaceholderText(/enter target/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start search/i })).toBeInTheDocument();
    expect(container.textContent).toContain("function binarySearch");
  });

  it("accepts valid input and shows search message", () => {
    renderVisualizer();

    fireEvent.change(screen.getByPlaceholderText(/enter target/i), {
      target: { value: "40" },
    });
    fireEvent.click(screen.getByRole("button", { name: /start search/i }));

    expect(screen.getByText(/ready to search for 40/i)).toBeInTheDocument();
  });

  it("shows error on invalid input", () => {
    renderVisualizer();

    fireEvent.change(screen.getByPlaceholderText(/enter target/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /start search/i }));

    expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
  });

  it("renders bars in sorted order", () => {
    renderVisualizer();

    const barElements = screen.getAllByTestId("bar-value");
    const values = barElements.map((el) => parseInt(el.textContent ?? "", 10));

    expect(values).toEqual([10, 20, 30, 40, 50]); // sorted input
  });
});

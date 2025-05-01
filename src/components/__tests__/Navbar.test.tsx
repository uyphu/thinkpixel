import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";

describe("Navbar", () => {
  it("renders brand title and all navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Brand title
    expect(screen.getByText("ThinkPixel")).toBeInTheDocument();

    // Navigation links
    const links = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Interview Prep", path: "/interview-prep" }
    ];

    links.forEach(({ name, path }) => {
      const link = screen.getByRole("link", { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", path);
    });
  });
});

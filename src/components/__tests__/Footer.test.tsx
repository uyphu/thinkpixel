import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText(/© 2025 ThinkPixel/i)).toBeInTheDocument();
  });

  it("renders all navigation links with correct hrefs", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const links = [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Terms", path: "/terms" },
    ];

    links.forEach(({ name, path }) => {
      const link = screen.getByRole("link", { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", path);
    });
  });
});

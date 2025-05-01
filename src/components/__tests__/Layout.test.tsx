import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Layout from "../Layout";

// Mock the Navbar and Footer components
vi.mock("../Navbar", () => ({
  default: () => <nav data-testid="navbar">Mocked Navbar</nav>,
}));

vi.mock("../Footer", () => ({
  default: () => <footer data-testid="footer">Mocked Footer</footer>,
}));

describe("Layout", () => {
  it("renders Navbar, Footer, and children", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

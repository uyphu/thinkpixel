import { render, screen } from "@testing-library/react";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders the main heading", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", { name: /welcome to thinkpixel/i })
    ).toBeInTheDocument();
  });

  it("renders the subheading description", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/visualize algorithms like bubble sort/i)
    ).toBeInTheDocument();
  });

  it("renders the brain emoji icon", () => {
    render(<HeroSection />);
    expect(screen.getByText("🧠")).toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import CodeBlock from "../CodeBlock";

describe("CodeBlock", () => {
  const mockCode = [
    "function sum(a, b) {",
    "  return a + b;",
    "}"
  ];

  it("renders the expected number of lines", () => {
    const { container } = render(<CodeBlock codeLines={mockCode} language="javascript" />);
    const lineElements = container.querySelectorAll("pre code > span");
    expect(lineElements.length).toBe(mockCode.length);
  });

  it("highlights the specified line", () => {
    const { container } = render(
      <CodeBlock codeLines={mockCode} highlightLine={2} language="javascript" />
    );

    const lineElements = container.querySelectorAll("pre code > span");
    const highlighted = Array.from(lineElements).find((line) => {
      return line.getAttribute("style")?.includes("rgba(255, 255, 0");
    });

    expect(highlighted).toBeDefined();
    expect(highlighted?.textContent?.trim()).toContain("return a + b");
  });
});

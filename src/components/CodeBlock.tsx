import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  codeLines: string[];
  language?: string;
  highlightLine?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  codeLines,
  language = "javascript",
  highlightLine,
}) => {
  const formattedCode = codeLines.join("\n");

  return (
    <div className="w-full h-full overflow-auto bg-gray-900 rounded-lg shadow p-4">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber: number) => ({
          style: {
            display: "block",
            backgroundColor:
              highlightLine === lineNumber ? "rgba(255, 255, 0, 0.2)" : undefined,
          },
        })}
      >
        {formattedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

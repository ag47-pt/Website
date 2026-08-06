import { Fragment } from "react";

/**
 * Renders the `*highlighted*` authoring syntax used across content strings.
 * Marked spans get the protocol gradient plus a soft glow.
 */
export function HighlightText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span
              key={index}
              className="agi-gradient-text"
              style={{ filter: "drop-shadow(0 0 28px rgba(139, 92, 246, 0.35))" }}
            >
              {part.slice(1, -1)}
            </span>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

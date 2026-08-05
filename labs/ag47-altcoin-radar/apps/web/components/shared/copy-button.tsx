"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [isCopied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  return (
    <button
      aria-label={`${label}: ${value}`}
      className="grid size-7 place-items-center rounded-md text-radar-subtle hover:bg-white/5 hover:text-radar-ink"
      onClick={copy}
      title={isCopied ? "Copiado" : label}
      type="button"
    >
      {isCopied ? (
        <Check className="size-3.5 text-radar-positive" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

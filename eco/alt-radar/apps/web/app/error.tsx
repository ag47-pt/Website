"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Radar render error", { name: error.name, message: error.message });
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-radar-canvas px-6">
      <div className="panel max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto size-9 text-radar-critical" />
        <h1 className="mt-4 text-xl font-extrabold">A interface encontrou um erro</h1>
        <p className="mt-2 text-sm leading-6 text-radar-muted">
          O detalhe técnico foi mantido fora da interface. Pode tentar renderizar a área novamente.
        </p>
        <button
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-radar-positive px-4 py-2.5 text-xs font-extrabold text-[#07140d]"
          onClick={reset}
          type="button"
        >
          <RefreshCw className="size-4" /> Tentar novamente
        </button>
      </div>
    </main>
  );
}

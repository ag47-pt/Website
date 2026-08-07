import { cn } from "@/lib/utils";

/**
 * Marca do protocolo: um traço de atividade contido em um quadro.
 * Lê como observabilidade e instrumentação — deliberadamente não figurativa.
 */
export function ProtocolMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-6", className)}
    >
      <rect
        x="1.25"
        y="1.25"
        width="21.5"
        height="21.5"
        rx="5.5"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.2"
      />
      <path
        d="M5.5 14.75h3.1l2.6-6.4 2.35 9.1 1.75-4.3h3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

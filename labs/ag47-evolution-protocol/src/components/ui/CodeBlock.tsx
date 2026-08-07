import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  /** Rótulo exibido no cabeçalho — normalmente o caminho do arquivo. */
  filename?: string;
  language?: string;
  className?: string;
}

/**
 * Bloco de código estático.
 *
 * Sem realce de sintaxe por biblioteca: destacar YAML e JSON exigiria um
 * parser no bundle para ganho estético pequeno. A legibilidade vem da
 * monoespaçada, do contraste e do enquadramento.
 */
export function CodeBlock({ code, filename, language, className }: CodeBlockProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-hairline bg-canvas/80",
        className,
      )}
    >
      {filename ? (
        <figcaption className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
          <span className="truncate font-mono text-[11px] text-fg-muted">{filename}</span>
          {language ? (
            <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
              {language}
            </span>
          ) : null}
        </figcaption>
      ) : null}

      <div className="overflow-x-auto">
        <pre className="p-4 font-mono text-xs leading-relaxed text-fg-muted">
          <code>{code}</code>
        </pre>
      </div>
    </figure>
  );
}

"use client";

import { useState } from "react";

import { allDirectoryIds, TreeView } from "@/components/ui/TreeView";
import { evolutionTree, protocolTree } from "@/data/repository-tree";
import { useRovingTabs } from "@/lib/use-roving-tabs";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types/content";

const VIEWS = [
  {
    id: "protocolo",
    label: "Repositório do protocolo",
    nodes: protocolTree,
    hint: "O que a AG47 publica.",
  },
  {
    id: "evolution",
    label: "Diretório .evolution/",
    nodes: evolutionTree,
    hint: "O que o protocolo cria dentro do seu projeto.",
  },
] as const;

/** Abre o painel já preenchido com a raiz da árvore selecionada. */
function rootOf(nodes: TreeNode[]): TreeNode {
  return nodes[0];
}

export function RepositoryExplorer() {
  const { active, handleKeyDown, tabProps, panelProps } = useRovingTabs(VIEWS.length);
  const [selectedByView, setSelectedByView] = useState<Record<number, TreeNode>>({
    0: rootOf(protocolTree),
    1: rootOf(evolutionTree),
  });

  const view = VIEWS[active];
  const selected = selectedByView[active] ?? rootOf(view.nodes);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Estruturas de diretório"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2"
      >
        {VIEWS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            {...tabProps(index, "repo")}
            className={cn(
              "rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors duration-200",
              index === active
                ? "border-accent-dim bg-surface-2 text-fg"
                : "border-hairline bg-surface/40 text-fg-muted hover:border-hairline-strong hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        {...panelProps("repo")}
        className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-6"
      >
        <div className="rounded-xl border border-hairline bg-canvas/60 p-2">
          <p className="px-3 py-2 font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
            {view.hint}
          </p>
          <TreeView
            key={view.id}
            nodes={view.nodes}
            label={view.label}
            defaultExpanded={allDirectoryIds(view.nodes).slice(0, 2)}
            selectedId={selected.id}
            onSelect={(node) => setSelectedByView((current) => ({ ...current, [active]: node }))}
          />
        </div>

        <div className="rounded-xl border border-hairline bg-surface/50 p-6 lg:sticky lg:top-28 lg:self-start">
          <div aria-live="polite">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                {selected.kind === "dir" ? "Diretório" : "Arquivo"}
              </span>
              <span aria-hidden className="h-px flex-1 bg-hairline" />
            </div>
            <p className="mt-4 font-mono text-base break-all text-fg">{selected.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {selected.description ?? "Sem descrição registrada."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import { allDirectoryIds, TreeView } from "@/components/ui/TreeView";
import { skillTree } from "@/data/skills";
import type { TreeNode } from "@/types/content";

/** Encontra o primeiro nó com descrição, para abrir o painel já preenchido. */
function firstDescribed(nodes: TreeNode[]): TreeNode | null {
  for (const node of nodes) {
    if (node.description) return node;
    const found = firstDescribed(node.children ?? []);
    if (found) return found;
  }
  return null;
}

/**
 * Anatomia de uma skill em disco.
 * A árvore inteira já vem expandida — são poucos nós e o objetivo é mostrar a
 * estrutura completa de uma vez, não esconder.
 */
export function SkillExplorer() {
  const [selected, setSelected] = useState<TreeNode | null>(() => firstDescribed(skillTree));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-6">
      <div className="rounded-xl border border-hairline bg-canvas/60 p-2">
        <p className="px-3 py-2 font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase">
          Estrutura de uma skill
        </p>
        <TreeView
          nodes={skillTree}
          label="Estrutura de arquivos de uma skill"
          defaultExpanded={allDirectoryIds(skillTree)}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </div>

      <div className="rounded-xl border border-hairline bg-surface/50 p-6">
        {selected ? (
          <div aria-live="polite">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                {selected.kind === "dir" ? "Diretório" : "Arquivo"}
              </span>
              <span aria-hidden className="h-px flex-1 bg-hairline" />
            </div>
            <p className="mt-4 font-mono text-base text-fg">{selected.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {selected.description ?? "Sem descrição registrada."}
            </p>
          </div>
        ) : null}

        <p className="mt-6 border-t border-hairline pt-4 font-mono text-[11px] leading-relaxed text-fg-faint">
          Uma skill é versionada, testada e revisada como qualquer outro código do
          repositório. Sem teste próprio, ela não entra no registro.
        </p>
      </div>
    </div>
  );
}

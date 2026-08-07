"use client";

import {
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types/content";

/**
 * Árvore de arquivos navegável, no padrão ARIA `tree`.
 *
 * Usa a representação plana da árvore: os itens ficam lado a lado no DOM e a
 * profundidade é comunicada por `aria-level`, `aria-setsize` e `aria-posinset`.
 * É válido pela especificação e simplifica a navegação por teclado.
 *
 * Teclas: setas cima/baixo percorrem os itens visíveis; direita expande ou
 * entra no primeiro filho; esquerda recolhe ou sobe para o pai; Home e End vão
 * aos extremos; Enter e Espaço selecionam.
 */

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  setSize: number;
  posInSet: number;
}

function flatten(
  nodes: TreeNode[],
  expanded: Set<string>,
  level = 0,
  parentId: string | null = null,
): FlatNode[] {
  return nodes.flatMap((node, index) => {
    const entry: FlatNode = {
      node,
      level,
      parentId,
      setSize: nodes.length,
      posInSet: index + 1,
    };

    const hasChildren = node.children !== undefined && node.children.length > 0;
    if (!hasChildren || !expanded.has(node.id)) return [entry];

    return [entry, ...flatten(node.children ?? [], expanded, level + 1, node.id)];
  });
}

function iconFor(node: TreeNode, isExpanded: boolean) {
  if (node.kind === "dir") return isExpanded ? FolderOpen : Folder;
  if (node.name.endsWith(".json")) return FileJson;
  if (node.name.endsWith(".md")) return FileText;
  if (/\.(py|ts|tsx|js|mjs|yaml|yml)$/.test(node.name)) return FileCode;
  return File;
}

/** Ids de todos os diretórios da árvore — usado para expandir tudo por padrão. */
export function allDirectoryIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.kind === "dir" ? [node.id, ...allDirectoryIds(node.children ?? [])] : [],
  );
}

interface TreeViewProps {
  nodes: TreeNode[];
  label: string;
  defaultExpanded?: string[];
  selectedId: string | null;
  onSelect: (node: TreeNode) => void;
  className?: string;
}

export function TreeView({
  nodes,
  label,
  defaultExpanded = [],
  selectedId,
  onSelect,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const visible = useMemo(() => flatten(nodes, expanded), [nodes, expanded]);

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, visible.length - 1));
    setActiveIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  const toggle = (id: string, open: boolean) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = visible[activeIndex];
    if (!current) return;

    const hasChildren =
      current.node.children !== undefined && current.node.children.length > 0;
    const isExpanded = expanded.has(current.node.id);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusIndex(activeIndex + 1);
        break;

      case "ArrowUp":
        event.preventDefault();
        focusIndex(activeIndex - 1);
        break;

      case "ArrowRight":
        event.preventDefault();
        if (hasChildren && !isExpanded) toggle(current.node.id, true);
        else if (hasChildren && isExpanded) focusIndex(activeIndex + 1);
        break;

      case "ArrowLeft": {
        event.preventDefault();
        if (hasChildren && isExpanded) {
          toggle(current.node.id, false);
          break;
        }
        const parentIndex = visible.findIndex((item) => item.node.id === current.parentId);
        if (parentIndex >= 0) focusIndex(parentIndex);
        break;
      }

      case "Home":
        event.preventDefault();
        focusIndex(0);
        break;

      case "End":
        event.preventDefault();
        focusIndex(visible.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        if (hasChildren) toggle(current.node.id, !isExpanded);
        onSelect(current.node);
        break;

      default:
        break;
    }
  };

  return (
    <div
      role="tree"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("py-1", className)}
    >
      {visible.map((item, index) => {
        const hasChildren =
          item.node.children !== undefined && item.node.children.length > 0;
        const isExpanded = expanded.has(item.node.id);
        const isSelected = selectedId === item.node.id;
        const NodeIcon = iconFor(item.node, isExpanded);

        return (
          <div
            key={item.node.id}
            role="treeitem"
            aria-level={item.level + 1}
            aria-setsize={item.setSize}
            aria-posinset={item.posInSet}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            tabIndex={index === activeIndex ? 0 : -1}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            /* Mantém `activeIndex` alinhado ao foco real. Sem isto, um foco que
               chegue por fora das setas faria Enter agir sobre o nó anterior. */
            onFocus={() => setActiveIndex(index)}
            onClick={() => {
              setActiveIndex(index);
              if (hasChildren) toggle(item.node.id, !isExpanded);
              onSelect(item.node);
            }}
            style={{ paddingLeft: `${item.level * 16 + 8}px` }}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 transition-colors duration-150",
              isSelected ? "bg-surface-3 text-fg" : "text-fg-muted hover:bg-surface-2/70",
            )}
          >
            <ChevronRight
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "size-3.5 shrink-0 transition-transform duration-200",
                hasChildren ? "text-fg-faint" : "invisible",
                isExpanded && "rotate-90",
              )}
            />
            <NodeIcon
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "size-4 shrink-0",
                item.node.kind === "dir" ? "text-accent" : "text-fg-faint",
              )}
            />
            <span className="truncate font-mono text-xs">{item.node.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Tipos compartilhados pelos módulos de `src/data`.
 *
 * Os dados são importados por Server Components e repassados como props para
 * ilhas cliente, portanto precisam ser serializáveis: ícones viajam como
 * string (`IconName`) e são resolvidos para componentes Lucide no cliente,
 * em `components/ui/Icon.tsx`.
 */

export type IconName =
  // Pilha do protocolo
  | "target"
  | "constitution"
  | "policy"
  | "workflow"
  | "roles"
  | "skills"
  | "tools"
  | "project"
  // Pilares
  | "bootstrap"
  | "memory"
  | "planning"
  | "execution"
  | "validation"
  | "governance"
  | "collaboration"
  | "evolution"
  // Características do protocolo
  | "ide"
  | "llm"
  | "language"
  | "evidence"
  | "auditable"
  | "extensible"
  | "governed"
  | "reusable"
  // Etapas do ciclo
  | "observer"
  | "planning-gate"
  | "tests"
  | "curator"
  | "integration"
  // Papéis e workflows
  | "guardian"
  | "release"
  | "recovery"
  | "adoption"
  // Categorias de skill
  | "backend"
  | "frontend"
  | "architecture"
  | "security"
  | "product"
  | "documentation"
  | "git"
  // Interface
  | "arrow-right"
  | "chevron-right"
  | "menu"
  | "close"
  | "terminal"
  | "activity"
  | "check"
  | "warning";

export interface NavItem {
  label: string;
  href: string;
  /** Links externos abrem em nova aba e recebem rel de segurança. */
  external?: boolean;
}

/** Nó de árvore de arquivos, consumido pelo primitivo `TreeView`. */
export interface TreeNode {
  id: string;
  name: string;
  kind: "dir" | "file";
  /** Explicação exibida quando o nó é selecionado. */
  description?: string;
  children?: TreeNode[];
}

/** Camada da pilha conceitual do protocolo (Missão → Projeto). */
export interface StackLayer {
  id: string;
  label: string;
  icon: IconName;
  /** Uma linha, exibida junto ao rótulo. */
  summary: string;
  /** Detalhe exibido no painel lateral quando a camada está ativa. */
  detail: string;
}

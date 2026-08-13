import {
  Activity,
  ArrowRight,
  Blocks,
  BookMarked,
  Boxes,
  Braces,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Compass,
  Database,
  Download,
  FileSearch,
  FileText,
  FlaskConical,
  FolderGit2,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  Hammer,
  Handshake,
  Landmark,
  Languages,
  LifeBuoy,
  ListChecks,
  Lock,
  type LucideIcon,
  Layers,
  Menu,
  Microscope,
  Milestone,
  Network,
  PackageSearch,
  Plug,
  Puzzle,
  Radar,
  Repeat2,
  Scale,
  ShieldAlert,
  SquareTerminal,
  ScrollText,
  ShieldCheck,
  Target,
  Terminal,
  TriangleAlert,
  Users,
  Workflow,
  Wrench,
  X,
} from "lucide-react";

import type { IconName } from "@/types/content";

/**
 * Resolve o nome serializável de um ícone para o componente Lucide.
 *
 * Existe porque os módulos de `src/data` atravessam a fronteira
 * servidor → cliente: passar a referência do componente quebraria a
 * serialização, então os dados carregam apenas a chave.
 */
const ICONS: Record<IconName, LucideIcon> = {
  target: Target,
  constitution: ScrollText,
  policy: ShieldCheck,
  workflow: Workflow,
  roles: Users,
  skills: Puzzle,
  tools: Wrench,
  project: FolderGit2,

  bootstrap: PackageSearch,
  memory: Database,
  planning: ListChecks,
  execution: Hammer,
  validation: Microscope,
  governance: Scale,
  collaboration: Handshake,
  evolution: Repeat2,

  ide: Boxes,
  llm: Plug,
  language: Languages,
  evidence: FileSearch,
  auditable: ClipboardCheck,
  extensible: Blocks,
  governed: Lock,
  reusable: Layers,

  observer: Radar,
  "planning-gate": Milestone,
  tests: FlaskConical,
  curator: BookMarked,
  integration: GitCommitHorizontal,

  guardian: Landmark,
  release: GitMerge,
  recovery: LifeBuoy,
  adoption: Download,

  backend: SquareTerminal,
  frontend: Braces,
  architecture: Network,
  security: ShieldAlert,
  product: Compass,
  documentation: FileText,
  git: GitBranch,

  "arrow-right": ArrowRight,
  "chevron-right": ChevronRight,
  menu: Menu,
  close: X,
  terminal: Terminal,
  activity: Activity,
  check: CircleCheck,
  warning: TriangleAlert,
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, strokeWidth = 1.5 }: IconProps) {
  const Component = ICONS[name];
  return <Component aria-hidden className={className} strokeWidth={strokeWidth} />;
}

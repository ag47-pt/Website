import type { IconName } from "@/types/content";

export interface Workflow {
  id: string;
  name: string;
  icon: IconName;
  purpose: string;
  when: string;
  steps: string[];
  filename: string;
  yaml: string;
}

export const workflows: Workflow[] = [
  {
    id: "bootstrap",
    name: "Bootstrap",
    icon: "bootstrap",
    purpose: "Compreende um projeto desconhecido.",
    when: "Primeira vez que o protocolo encontra o repositório.",
    steps: [
      "Detecta estrutura e stack",
      "Reconstrói a arquitetura atual a partir do código",
      "Calcula confiança e aciona gates humanos onde ela é baixa",
      "Grava baseline e estado inicial",
    ],
    filename: "workflows/bootstrap.yaml",
    yaml: `workflow: bootstrap
version: 1
description: Compreende um projeto desconhecido sem alterar código de produção.

policy:
  write_access: [".evolution/**"]
  production_code: read-only

steps:
  - id: detect-structure
    role: observer
    skills: [detect-stack, map-modules]
    outputs: [structure-report]

  - id: rebuild-architecture
    role: observer
    skills: [analyze-architecture]
    inputs: [structure-report]
    outputs: [current-architecture]

  - id: confidence-gate
    role: validator
    rule: confidence < 0.7 -> require_human
    outputs: [human-actions]

  - id: baseline
    role: knowledge-curator
    outputs: [baseline.json, project-state.json]`,
  },
  {
    id: "evolution",
    name: "Evolução",
    icon: "evolution",
    purpose: "Planeja e executa o próximo incremento.",
    when: "Ciclo padrão, repetido enquanto houver roadmap.",
    steps: [
      "Observador propõe o menor incremento de maior valor",
      "Gate de planejamento congela o escopo",
      "Executor implementa apenas o aprovado",
      "Validador tenta reprovar antes de consolidar",
    ],
    filename: "workflows/evolution.yaml",
    yaml: `workflow: evolution
version: 1
description: Planeja e executa o menor próximo incremento de maior valor.

budget:
  max_files_changed: 25
  max_scope: single-feature

steps:
  - id: propose
    role: observer
    outputs: [sprint-plan]

  - id: approve
    role: gate
    rule: scope_declared and acceptance_criteria_defined
    on_fail: reject

  - id: implement
    role: executor
    inputs: [sprint-plan]
    outputs: [execution-report]

  - id: verify
    role: validator
    gates: [build, lint, typecheck, tests]
    on_fail: mark REGRESSION

  - id: consolidate
    role: knowledge-curator
    requires: validation.status == approved`,
  },
  {
    id: "validation",
    name: "Validação",
    icon: "validation",
    purpose: "Confirma se a entrega realmente funciona.",
    when: "Ao fim de qualquer execução, antes de consolidar.",
    steps: [
      "Executa os gates determinísticos e captura o código de saída",
      "Compara plano e implementação, procurando mudança não declarada",
      "Compara com a baseline para detectar regressão",
      "Emite veredito: aprovado, parcial ou reprovado",
    ],
    filename: "workflows/validation.yaml",
    yaml: `workflow: validation
version: 1
description: Tenta provar que a entrega está errada.

steps:
  - id: run-gates
    role: tooling
    gates: [build, lint, typecheck, unit, integration, e2e]
    capture: exit_code

  - id: compare-plan
    role: validator
    inputs: [sprint-plan, execution-report]
    checks:
      - scope_matches_plan
      - acceptance_criteria_covered
      - no_undeclared_changes

  - id: regression
    role: validator
    inputs: [baseline]
    on_detect: mark REGRESSION

  - id: verdict
    role: validator
    outputs: [validation-report]
    allowed: [approved, partial, rejected]`,
  },
  {
    id: "recovery",
    name: "Recuperação",
    icon: "recovery",
    purpose: "Interrompe a evolução e reconstrói o estado confiável.",
    when: "Regressão detectada ou estado inconsistente após integração.",
    steps: [
      "Congela a evolução imediatamente",
      "Localiza o último estado comprovadamente bom",
      "Reverte sob aprovação humana",
      "Registra o incidente na memória permanente",
    ],
    filename: "workflows/recovery.yaml",
    yaml: `workflow: recovery
version: 1
description: Interrompe a evolução e reconstrói um estado confiável.

trigger:
  - regression_detected
  - gate_failure_after_merge
  - state_inconsistent

steps:
  - id: freeze
    role: release-manager
    action: halt_evolution

  - id: locate-baseline
    role: release-manager
    inputs: [history]
    outputs: [last_known_good]

  - id: rollback
    role: release-manager
    requires: human_approval
    outputs: [rollback-report]

  - id: record
    role: knowledge-curator
    outputs: [history/incident.md]`,
  },
  {
    id: "adoption",
    name: "Adoção de projeto existente",
    icon: "adoption",
    purpose: "Integra o protocolo sem destruir a documentação atual.",
    when: "Repositório com história, documentação e convenções próprias.",
    steps: [
      "Inventaria a documentação que já existe",
      "Confronta verdade documental e verdade de implementação",
      "Leva as divergências para revisão humana",
      "Só então inicializa o diretório .evolution/",
    ],
    filename: "workflows/adoption.yaml",
    yaml: `workflow: adoption
version: 1
description: Integra o protocolo a um repositório que já tem história.

principles:
  preserve_existing_docs: true
  overwrite: never

steps:
  - id: inventory
    role: observer
    outputs: [existing-docs-map]

  - id: reconcile
    role: observer
    rule: documented_truth != implemented_truth -> flag
    outputs: [divergence-report]

  - id: human-review
    role: gate
    requires: human_approval
    subject: divergence-report

  - id: initialize
    role: knowledge-curator
    creates: [".evolution/"]
    outputs: [project-state.json]`,
  },
];

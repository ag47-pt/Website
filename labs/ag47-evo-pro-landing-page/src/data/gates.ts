export interface Gate {
  id: string;
  label: string;
  description: string;
  /** Gates bloqueantes impedem o avanço de estado; os demais apenas registram. */
  blocking: boolean;
  group: "Construção" | "Testes" | "Análise" | "Consistência" | "Operação";
}

export const gates: Gate[] = [
  {
    id: "build",
    label: "Build",
    description: "O projeto compila a partir de um clone limpo.",
    blocking: true,
    group: "Construção",
  },
  {
    id: "lint",
    label: "Lint",
    description: "Convenções de código respeitadas, sem exceções silenciosas.",
    blocking: true,
    group: "Construção",
  },
  {
    id: "typecheck",
    label: "Typecheck",
    description: "Tipos consistentes em todo o grafo de módulos.",
    blocking: true,
    group: "Construção",
  },
  {
    id: "unit",
    label: "Testes unitários",
    description: "Comportamento de unidades isoladas, incluindo casos de borda.",
    blocking: true,
    group: "Testes",
  },
  {
    id: "integration",
    label: "Testes de integração",
    description: "Contratos entre módulos e com dependências externas reais.",
    blocking: true,
    group: "Testes",
  },
  {
    id: "e2e",
    label: "Testes end-to-end",
    description: "Percursos completos do ponto de vista de quem usa.",
    blocking: true,
    group: "Testes",
  },
  {
    id: "static",
    label: "Análise estática",
    description: "Complexidade, código morto e padrões de risco conhecidos.",
    blocking: false,
    group: "Análise",
  },
  {
    id: "deps",
    label: "Auditoria de dependências",
    description: "Vulnerabilidades conhecidas e pacotes sem manutenção.",
    blocking: true,
    group: "Análise",
  },
  {
    id: "security",
    label: "Análise de segurança",
    description: "Segredos expostos, superfície de ataque e permissões amplas demais.",
    blocking: true,
    group: "Análise",
  },
  {
    id: "architecture",
    label: "Validação arquitetural",
    description: "A mudança respeita as fronteiras declaradas na arquitetura alvo.",
    blocking: true,
    group: "Consistência",
  },
  {
    id: "docs",
    label: "Validação documental",
    description: "A documentação continua descrevendo o sistema que existe.",
    blocking: false,
    group: "Consistência",
  },
  {
    id: "smoke",
    label: "Smoke test",
    description: "O sistema sobe e responde ao mínimo esperado.",
    blocking: true,
    group: "Operação",
  },
  {
    id: "rollback",
    label: "Rollback test",
    description: "A reversão foi exercitada, não apenas documentada.",
    blocking: true,
    group: "Operação",
  },
];

export type GateStatus = "passed" | "failed" | "skipped";

export interface GateRun {
  id: string;
  label: string;
  status: GateStatus;
  detail: string;
  duration: string;
}

/**
 * Execução ilustrativa — não são resultados deste site.
 *
 * O exemplo mostra deliberadamente uma falha: é o caso que importa. Um painel
 * todo verde não demonstra nada sobre o comportamento do protocolo diante de
 * evidência contrária.
 */
export const gateRunExample: GateRun[] = [
  { id: "build", label: "Build", status: "passed", detail: "compilado sem avisos", duration: "12,7s" },
  { id: "lint", label: "Lint", status: "passed", detail: "0 problemas", duration: "8,5s" },
  { id: "typecheck", label: "Typecheck", status: "passed", detail: "0 erros", duration: "4,0s" },
  { id: "unit", label: "Testes unitários", status: "passed", detail: "184 de 184", duration: "22,4s" },
  {
    id: "integration",
    label: "Testes de integração",
    status: "passed",
    detail: "31 de 31",
    duration: "1m 04s",
  },
  {
    id: "deps",
    label: "Auditoria de dependências",
    status: "failed",
    detail: "1 vulnerabilidade alta em transitiva",
    duration: "6,1s",
  },
  {
    id: "e2e",
    label: "Testes end-to-end",
    status: "skipped",
    detail: "gate bloqueante anterior falhou",
    duration: "—",
  },
  {
    id: "smoke",
    label: "Smoke test",
    status: "skipped",
    detail: "gate bloqueante anterior falhou",
    duration: "—",
  },
];

export const gateRunVerdict = {
  state: "REGRESSION",
  message:
    "Um gate bloqueante falhou. A execução para, o estado não avança e nenhum relatório pode declarar a entrega concluída.",
};

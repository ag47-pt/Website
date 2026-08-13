export interface ProblemItem {
  id: string;
  title: string;
  detail: string;
}

/**
 * Falhas estruturais do desenvolvimento agêntico em ciclos longos.
 * Não são críticas a modelos específicos — são consequências da ausência de
 * protocolo, e reaparecem com qualquer LLM.
 */
export const problems: ProblemItem[] = [
  {
    id: "contexto",
    title: "Perda de contexto",
    detail:
      "O que foi decidido no ciclo anterior não sobrevive ao próximo. Cada sessão recomeça sem saber por que o código está do jeito que está.",
  },
  {
    id: "deriva",
    title: "Deriva arquitetural",
    detail:
      "Sem um guardião explícito, cada incremento resolve o problema local e afasta o sistema da arquitetura pretendida.",
  },
  {
    id: "documentacao",
    title: "Documentação divergente",
    detail:
      "O código avança e o documento fica parado. A documentação passa a descrever um sistema que não existe mais.",
  },
  {
    id: "divida",
    title: "Dívida técnica sem registro",
    detail:
      "Velocidade sem gate de qualidade transfere custo para o futuro — e ninguém anota quanto foi transferido, nem onde.",
  },
  {
    id: "auto-validacao",
    title: "Agentes que se validam sozinhos",
    detail:
      "Quem executa não pode ser quem aprova. Sem separação de autoridade, o relatório de sucesso é escrito por quem tem interesse no sucesso.",
  },
  {
    id: "sem-evidencia",
    title: "Concluído sem evidência",
    detail:
      "Funcionalidade dada como pronta porque um agente afirmou que estava, não porque um teste determinístico provou que está.",
  },
  {
    id: "mudanca-grande",
    title: "Mudanças grandes demais",
    detail:
      "Alterações que tocam dezenas de arquivos de uma vez são inviáveis de revisar e caras de reverter quando falham.",
  },
  {
    id: "rollback",
    title: "Ausência de rollback",
    detail:
      "Quando algo quebra, não existe um estado confiável e documentado para onde voltar — só o histórico bruto do Git.",
  },
  {
    id: "memoria",
    title: "Ausência de memória",
    detail:
      "Nenhum registro estruturado do que já foi tentado, do que falhou e por quê. O mesmo erro volta meses depois.",
  },
  {
    id: "parada",
    title: "Ausência de função de parada",
    detail:
      "O agente não reconhece o momento de parar e pedir decisão humana. Em vez de bloquear, ele inventa uma saída plausível.",
  },
  {
    id: "separacao",
    title: "Decisão, execução e validação misturadas",
    detail:
      "Um único papel decide o que fazer, faz, e declara que deu certo. Não sobra nada auditável.",
  },
];

export interface FlowStep {
  label: string;
  /** Marca a etapa como consequência negativa, não como progresso. */
  degraded?: boolean;
}

/** O laço aberto do desenvolvimento agêntico comum: termina em erosão. */
export const legacyFlow: FlowStep[] = [
  { label: "Prompt" },
  { label: "Código" },
  { label: "Novo prompt" },
  { label: "Mais código" },
  { label: "Perda de contexto", degraded: true },
  { label: "Dívida técnica", degraded: true },
];

/** O ciclo fechado do protocolo: termina realimentando a próxima iteração. */
export const protocolFlow: FlowStep[] = [
  { label: "Observar" },
  { label: "Compreender" },
  { label: "Planejar" },
  { label: "Executar" },
  { label: "Validar" },
  { label: "Consolidar conhecimento" },
  { label: "Evoluir novamente" },
];

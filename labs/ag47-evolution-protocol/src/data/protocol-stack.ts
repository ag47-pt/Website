import type { StackLayer } from "@/types/content";

/**
 * A pilha conceitual do protocolo, da intenção ao repositório.
 * Cada camada restringe a camada seguinte: a missão limita a constituição,
 * a constituição limita as políticas, e assim por diante.
 */
export const protocolStack: StackLayer[] = [
  {
    id: "missao",
    label: "Missão",
    icon: "target",
    summary: "Por que o projeto existe",
    detail:
      "Declara o propósito do produto e os resultados que ele precisa entregar. É a única camada que nenhum agente altera por conta própria — mudança de missão exige decisão humana explícita.",
  },
  {
    id: "constituicao",
    label: "Constituição",
    icon: "constitution",
    summary: "Princípios inegociáveis",
    detail:
      "Regras permanentes que valem para qualquer sprint: o que nunca pode ser removido, quais garantias o sistema precisa preservar e quais decisões exigem aprovação prévia.",
  },
  {
    id: "politicas",
    label: "Políticas",
    icon: "policy",
    summary: "Limites operacionais verificáveis",
    detail:
      "Traduzem a constituição em restrições que uma máquina consegue checar: orçamento de mudança por ciclo, áreas do repositório com acesso restrito, ações proibidas e gates de aprovação.",
  },
  {
    id: "workflows",
    label: "Workflows",
    icon: "workflow",
    summary: "Sequências determinísticas",
    detail:
      "Descrevem a ordem das etapas, qual papel atua em cada uma e quais artefatos precisam existir para avançar. Bootstrap, evolução, validação, recuperação e adoção.",
  },
  {
    id: "papeis",
    label: "Papéis",
    icon: "roles",
    summary: "Separação de autoridade",
    detail:
      "Observador, Executor, Validador, Guardião da Arquitetura, Curador de Conhecimento e Gerente de Release. Nenhum papel valida o próprio trabalho.",
  },
  {
    id: "skills",
    label: "Skills",
    icon: "skills",
    summary: "Capacidades reutilizáveis",
    detail:
      "Procedimentos versionados com entrada, saída, pré-condições e testes próprios. Uma skill não é um agente: é uma competência que qualquer papel autorizado pode invocar.",
  },
  {
    id: "ferramentas",
    label: "Ferramentas",
    icon: "tools",
    summary: "Execução real",
    detail:
      "Compiladores, linters, runners de teste, análise estática e Git. É a camada que produz evidência determinística — a única prova aceita para declarar algo concluído.",
  },
  {
    id: "projeto",
    label: "Projeto",
    icon: "project",
    summary: "O repositório sob evolução",
    detail:
      "O código real e o diretório .evolution/, onde estado, baseline, arquitetura, evidências, histórico e ações humanas ficam persistidos entre um ciclo e o próximo.",
  },
];

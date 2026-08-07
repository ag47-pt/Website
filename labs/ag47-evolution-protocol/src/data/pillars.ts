import type { IconName } from "@/types/content";

export interface Pillar {
  id: string;
  title: string;
  icon: IconName;
  description: string;
  /** Exemplo concreto — o que o pilar produz na prática. */
  example: string;
}

export const pillars: Pillar[] = [
  {
    id: "bootstrap",
    title: "Bootstrap",
    icon: "bootstrap",
    description:
      "Compreende projetos novos ou legados antes de tocar em qualquer linha. Lê, mapeia, infere, pergunta e documenta — sem alterar código de produção.",
    example:
      "Em um monorepo sem README, reconstrói a arquitetura atual a partir do código e marca com baixa confiança tudo que não conseguiu provar.",
  },
  {
    id: "memoria",
    title: "Memória",
    icon: "memory",
    description:
      "Persiste conhecimento e histórico entre ciclos em arquivos versionados, não no contexto de uma conversa.",
    example:
      "A decisão de trocar de fila de mensagens fica registrada com data, motivo e alternativas descartadas — e é lida no ciclo seguinte.",
  },
  {
    id: "planejamento",
    title: "Planejamento",
    icon: "planning",
    description:
      "Seleciona o menor próximo incremento de maior valor, com escopo declarado e critérios de aceite antes da execução começar.",
    example:
      "Em vez de refatorar a camada de autenticação inteira, propõe extrair só a validação de token e define como provar que funciona.",
  },
  {
    id: "execucao",
    title: "Execução",
    icon: "execution",
    description:
      "Implementa exclusivamente o escopo aprovado. Não redefine arquitetura, não amplia o plano e não silencia o que encontrou pelo caminho.",
    example:
      "Ao descobrir um bug fora do escopo, registra o achado como item de backlog em vez de corrigi-lo junto e inflar o diff.",
  },
  {
    id: "validacao",
    title: "Validação",
    icon: "validation",
    description:
      "Tenta provar que a entrega está errada. Executa testes, compara plano com implementação e procura regressão — sem corrigir em silêncio.",
    example:
      "Detecta que o critério de aceite pedia idempotência, que nenhum teste cobre isso, e reprova a entrega em vez de escrever o teste faltante.",
  },
  {
    id: "governanca",
    title: "Governança",
    icon: "governance",
    description:
      "Impõe políticas, limites e gates de forma verificável: orçamento de mudança, áreas restritas, ações proibidas e aprovações obrigatórias.",
    example:
      "Uma alteração que toca migrações de banco exige aprovação humana antes do merge, independente de os testes terem passado.",
  },
  {
    id: "colaboracao",
    title: "Colaboração humano-IA",
    icon: "collaboration",
    description:
      "Registra tudo que depende de intervenção humana e nunca simula a conclusão dessas tarefas.",
    example:
      "Sem a chave de API do provedor de e-mail, a entrega fica em bloqueio explícito, com responsável e forma de validação definidos.",
  },
  {
    id: "evolucao",
    title: "Evolução contínua",
    icon: "evolution",
    description:
      "Repete o ciclo de forma segura, com estado consistente e caminho de rollback conhecido a cada iteração.",
    example:
      "Depois do merge, o sistema observa o comportamento em produção antes de encerrar o item e liberar o próximo incremento.",
  },
];

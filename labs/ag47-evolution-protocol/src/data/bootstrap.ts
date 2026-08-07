export interface BootstrapStep {
  label: string;
  detail: string;
}

/** O que o bootstrap faz ao encontrar um repositório pela primeira vez. */
export const bootstrapSteps: BootstrapStep[] = [
  {
    label: "Detecta a estrutura",
    detail: "Diretórios, pontos de entrada, limites entre aplicações e pacotes.",
  },
  {
    label: "Procura documentação",
    detail: "README, ADRs, comentários de arquitetura e qualquer intenção já escrita.",
  },
  {
    label: "Identifica a stack",
    detail: "Linguagens, frameworks, gerenciadores e ferramentas de build.",
  },
  {
    label: "Mapeia módulos",
    detail: "Quais unidades existem, o que cada uma expõe e como se comunicam.",
  },
  {
    label: "Analisa dependências",
    detail: "Diretas, transitivas e as que já estão sem manutenção.",
  },
  {
    label: "Inspeciona os testes",
    detail: "O que é coberto de fato — e, principalmente, o que não é.",
  },
  {
    label: "Reconstrói a arquitetura atual",
    detail: "Descreve o sistema como ele é hoje, não como deveria ser.",
  },
  {
    label: "Calcula confiança",
    detail:
      "Cada afirmação recebe um grau de certeza conforme a evidência que a sustenta.",
  },
  {
    label: "Identifica lacunas",
    detail: "O que não foi possível inferir com segurança fica marcado como lacuna.",
  },
  {
    label: "Aciona gates humanos",
    detail: "Onde a confiança é baixa, o protocolo pergunta em vez de assumir.",
  },
  {
    label: "Cria a arquitetura alvo",
    detail: "Só depois da validação humana da intenção do produto.",
  },
  {
    label: "Gera a baseline",
    detail: "Fotografia de qualidade que servirá de referência para regressão.",
  },
  {
    label: "Inicia a máquina de estados",
    detail: "A partir daqui, todo item de trabalho passa a ter estado explícito.",
  },
];

/** O bootstrap é deliberadamente inofensivo: só lê e escreve memória. */
export const bootstrapDoes = ["Lê", "Mapeia", "Infere", "Pergunta", "Documenta", "Cria estado"];
export const bootstrapDoesNot = [
  "Não altera código de produção",
  "Não corrige o que encontra",
  "Não inventa a intenção do produto",
];

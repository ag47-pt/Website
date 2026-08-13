export interface UseCase {
  id: string;
  title: string;
  /** A dor concreta do cenário — sem ela o caso vira lista de público-alvo. */
  context: string;
  help: string;
}

export const useCases: UseCase[] = [
  {
    id: "solo",
    title: "Desenvolvedor solo",
    context: "Uma pessoa, muitos projetos, contexto que se perde entre um e outro.",
    help: "A memória do projeto substitui a memória da pessoa: ao voltar depois de dois meses, o estado, as decisões e o próximo passo já estão escritos.",
  },
  {
    id: "startup",
    title: "Startup",
    context: "A prioridade muda toda semana; o código acompanha, a documentação não.",
    help: "O gap arquitetural explicita o custo de cada desvio antes de ele ser aceito, e o roadmap passa a refletir o que foi entregue de fato.",
  },
  {
    id: "saas",
    title: "SaaS",
    context: "Base única servindo muitos clientes, onde regressão custa contrato.",
    help: "Baseline e rollback test transformam “não pode quebrar” em gate verificável, não em recomendação.",
  },
  {
    id: "legado",
    title: "Projeto legado",
    context: "Ninguém que escreveu o sistema continua no time.",
    help: "O bootstrap reconstrói a arquitetura a partir do código e marca com baixa confiança tudo que não conseguiu provar — em vez de fingir que entendeu.",
  },
  {
    id: "monorepo",
    title: "Monorepo",
    context: "Muitos módulos e fronteiras que erodem a cada atalho.",
    help: "A validação arquitetural recusa mudanças que cruzam fronteiras declaradas, mesmo quando todos os testes passam.",
  },
  {
    id: "open-source",
    title: "Projeto open source",
    context: "Contribuições de quem não acompanhou as decisões anteriores.",
    help: "Políticas e ADRs deixam explícito o que é inegociável, e o histórico responde “por que assim” sem depender da presença de um mantenedor.",
  },
  {
    id: "distribuida",
    title: "Equipe distribuída",
    context: "Fusos diferentes, revisão assíncrona, contexto espalhado em mensagens.",
    help: "O estado do item é a fonte comum: quem entra no turno seguinte lê onde parou, por quê, e o que falta provar.",
  },
  {
    id: "consultoria",
    title: "Consultoria",
    context: "Entrar em um repositório alheio e produzir valor sem quebrar nada.",
    help: "O workflow de adoção integra o protocolo sem sobrescrever a documentação existente, e o inventário de divergências vira a primeira entrega.",
  },
  {
    id: "multiplos",
    title: "Múltiplos produtos",
    context: "Mesmo time, padrões que divergem entre repositórios.",
    help: "Papéis, skills e workflows são compartilhados entre projetos; apenas memória e políticas permanecem locais.",
  },
  {
    id: "criticos",
    title: "Sistemas críticos",
    context: "Uma mudança errada tem custo regulatório ou humano.",
    help: "Nenhuma transição sem evidência, aprovação humana onde a política exige e rollback exercitado — não presumido.",
  },
  {
    id: "internos",
    title: "Produtos internos",
    context: "Sem usuário externo cobrando, a qualidade escorre em silêncio.",
    help: "Os gates não distinguem produto interno de externo. A dívida aparece medida, em vez de apenas sentida.",
  },
  {
    id: "labs",
    title: "Laboratórios de IA",
    context: "Muitos experimentos, poucos sobrevivem, e o aprendizado se perde junto.",
    help: "O histórico registra o que foi tentado e por que falhou — o experimento descartado continua rendendo conhecimento.",
  },
];

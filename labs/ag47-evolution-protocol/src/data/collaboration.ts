import type { IconName } from "@/types/content";

export interface CollaborationCategory {
  id: string;
  title: string;
  icon: IconName;
  who: string;
  description: string;
  examples: string[];
  /** Tom do cartão — reflete quanto o protocolo consegue garantir sozinho. */
  tone: "accent" | "info" | "warn";
}

/**
 * As três categorias de atividade.
 *
 * A distinção que importa não é "fácil x difícil", e sim quem executa e quem
 * consegue verificar. É ela que define onde o protocolo pode seguir sozinho e
 * onde precisa parar.
 */
export const collaborationCategories: CollaborationCategory[] = [
  {
    id: "executaveis",
    title: "Executáveis",
    icon: "execution",
    who: "IA executa · IA valida",
    description:
      "Tudo que o protocolo consegue fazer e provar dentro do repositório, com gate determinístico como testemunha.",
    examples: [
      "Escrever e alterar código",
      "Criar e executar testes",
      "Atualizar documentação técnica",
      "Rodar análise estática",
    ],
    tone: "accent",
  },
  {
    id: "validaveis",
    title: "Validáveis",
    icon: "auditable",
    who: "Humano executa · IA verifica",
    description:
      "O protocolo não tem acesso para executar, mas tem como confirmar que foi feito — e por isso define antes qual verificação servirá de prova.",
    examples: [
      "Inserir uma chave de API",
      "Configurar DNS",
      "Ativar um webhook",
      "Criar variável de ambiente",
      "Configurar serviço externo",
    ],
    tone: "info",
  },
  {
    id: "humanas",
    title: "Humanas",
    icon: "collaboration",
    who: "Humano decide · IA registra",
    description:
      "Dependem de decisão, orçamento ou autoridade externa. O protocolo pode preparar o contexto, mas não pode decidir nem simular a conclusão.",
    examples: [
      "Contratação de fornecedor",
      "Aprovação jurídica",
      "Compra de domínio",
      "Definição de orçamento",
      "Decisão de produto",
      "Autorização de produção",
    ],
    tone: "warn",
  },
];

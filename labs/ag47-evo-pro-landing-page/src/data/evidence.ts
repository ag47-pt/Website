export const evidenceExample = `{
  "claim": "O sistema utiliza FastAPI como backend principal",
  "confidence": 0.99,
  "evidence": [
    "apps/api/main.py",
    "pyproject.toml",
    "tests/api/test_health.py"
  ]
}`;

export interface TruthKind {
  id: string;
  title: string;
  question: string;
  source: string;
  failure: string;
}

/**
 * Três verdades que costumam ser confundidas — e cuja divergência é onde a
 * maior parte dos incidentes nasce.
 */
export const truthKinds: TruthKind[] = [
  {
    id: "documental",
    title: "Verdade documental",
    question: "O que a documentação afirma?",
    source: "README, ADRs, especificações, comentários",
    failure:
      "Envelhece em silêncio. Continua descrevendo um sistema que deixou de existir há meses.",
  },
  {
    id: "implementacao",
    title: "Verdade de implementação",
    question: "O que o código realmente faz?",
    source: "Código-fonte, testes, análise estática",
    failure:
      "Prova que algo existe, não que funciona em condição real de carga, rede ou dado sujo.",
  },
  {
    id: "operacional",
    title: "Verdade operacional",
    question: "O que acontece em produção?",
    source: "Logs, métricas, comportamento observado após o deploy",
    failure:
      "Só aparece depois da integração — por isso o ciclo não fecha no merge, e sim na observação.",
  },
];

export const confidenceLevels = [
  { range: "0,90 – 1,00", label: "Verificado", detail: "Sustentado por evidência determinística." },
  { range: "0,70 – 0,89", label: "Provável", detail: "Evidência forte, mas indireta ou parcial." },
  { range: "0,40 – 0,69", label: "Incerto", detail: "Inferência — exige confirmação humana." },
  { range: "0,00 – 0,39", label: "Lacuna", detail: "Não foi possível estabelecer. Vira pergunta." },
];

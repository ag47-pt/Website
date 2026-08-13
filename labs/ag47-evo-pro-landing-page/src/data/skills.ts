import type { IconName, TreeNode } from "@/types/content";

export interface SkillExample {
  label: string;
  category: string;
  icon: IconName;
}

/** Exemplos de capacidades — não são agentes, são competências invocáveis. */
export const skillExamples: SkillExample[] = [
  { label: "Analisar backend Python", category: "backend", icon: "backend" },
  { label: "Analisar frontend React", category: "frontend", icon: "frontend" },
  { label: "Revisar arquitetura", category: "architecture", icon: "architecture" },
  { label: "Executar Pytest", category: "testing", icon: "tests" },
  { label: "Executar Playwright", category: "testing", icon: "tests" },
  { label: "Analisar segurança", category: "security", icon: "security" },
  {
    label: "Detectar documentação divergente",
    category: "documentation",
    icon: "documentation",
  },
  { label: "Revisar contratos de API", category: "backend", icon: "architecture" },
  { label: "Analisar banco de dados", category: "backend", icon: "backend" },
  { label: "Gerar plano de sprint", category: "product", icon: "product" },
  { label: "Validar alinhamento com o produto", category: "product", icon: "product" },
];

/** O que distingue uma skill robusta de um trecho de prompt reaproveitado. */
export const skillAnatomy = [
  { label: "Objetivo", detail: "O que a skill decide ou produz, em uma frase." },
  { label: "Entradas", detail: "Dados exigidos, com formato declarado." },
  { label: "Pré-condições", detail: "O que precisa ser verdade antes de executar." },
  { label: "Ferramentas permitidas", detail: "O que ela pode invocar — e nada além." },
  { label: "Procedimento", detail: "Passos determinísticos, não sugestões." },
  { label: "Saída estruturada", detail: "Schema fixo, validável por máquina." },
  { label: "Casos de falha", detail: "O que fazer quando a pré-condição não vale." },
  { label: "Testes próprios", detail: "A skill é verificada como qualquer código." },
  { label: "Limites", detail: "O que ela explicitamente não faz." },
];

/** Estrutura de uma skill em disco. */
export const skillTree: TreeNode[] = [
  {
    id: "skills",
    name: "skills/",
    kind: "dir",
    description:
      "Raiz do registro de skills. Cada capacidade vive em sua própria pasta, versionada junto do protocolo.",
    children: [
      {
        id: "skills-backend",
        name: "backend/",
        kind: "dir",
        description:
          "Categoria da skill. Agrupa capacidades que compartilham domínio, não implementação.",
        children: [
          {
            id: "skills-analyze-fastapi",
            name: "analyze-fastapi/",
            kind: "dir",
            description:
              "Uma skill completa. O nome descreve a capacidade, não a ferramenta que a executa.",
            children: [
              {
                id: "skill-md",
                name: "SKILL.md",
                kind: "file",
                description:
                  "Contrato legível por humanos: objetivo, procedimento, casos de falha e limites. É o documento que um revisor lê para decidir se confia na skill.",
              },
              {
                id: "skill-yaml",
                name: "skill.yaml",
                kind: "file",
                description:
                  "Metadados executáveis: versão, categoria, ferramentas permitidas e pré-condições. É o que o registro de skills carrega.",
              },
              {
                id: "skill-input",
                name: "input.schema.json",
                kind: "file",
                description:
                  "Schema da entrada. Uma invocação que não valida contra ele é rejeitada antes de executar.",
              },
              {
                id: "skill-output",
                name: "output.schema.json",
                kind: "file",
                description:
                  "Schema da saída. Garante que o resultado seja consumível por outro papel sem interpretação livre.",
              },
              {
                id: "skill-checks",
                name: "checks.py",
                kind: "file",
                description:
                  "As verificações determinísticas em si. É aqui que a skill produz evidência, não opinião.",
              },
              {
                id: "skill-tests",
                name: "tests/",
                kind: "dir",
                description:
                  "Testes da própria skill. Uma capacidade sem teste não entra no registro.",
              },
            ],
          },
        ],
      },
    ],
  },
];

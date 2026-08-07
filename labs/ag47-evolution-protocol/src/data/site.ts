/**
 * Ponto único de verdade para identidade e URLs externas.
 *
 * `url` e `repoUrl` foram INFERIDOS (pendência P1 do sprint 0): o domínio veio
 * de ag47.pt e o repositório do git user `ag47-pt`. Se qualquer um estiver
 * errado, este arquivo é o único lugar a corrigir — metadata, sitemap, robots,
 * Open Graph e todos os CTAs derivam daqui.
 */
export const site = {
  name: "AG47 Evolution Protocol",
  shortName: "AG47 EP",
  locale: "pt-BR",
  url: "https://ag47.pt/evolution",
  repoUrl: "https://github.com/ag47-pt/ag47-evolution-protocol",
  tagline: "Um protocolo para evolução contínua de software com Inteligência Artificial.",
  description:
    "Protocolo aberto que organiza agentes, papéis, skills, workflows, memória persistente e validação por evidência para transformar qualquer repositório em um sistema observável, auditável e evolutivo.",
} as const;

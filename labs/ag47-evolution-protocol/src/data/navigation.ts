import { site } from "@/data/site";
import type { NavItem } from "@/types/content";

/**
 * Arquitetura de informação da página.
 *
 * Os âncoras cobrem as 24 seções do documento mestre e são implementados de
 * forma incremental pelos sprints 1 a 5 — um item pode existir aqui antes da
 * sua seção estar construída.
 */
export const headerNav: NavItem[] = [
  { label: "Visão", href: "#o-que-e" },
  { label: "Problema", href: "#problema" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Arquitetura", href: "#arquitetura" },
  { label: "Papéis", href: "#papeis" },
  { label: "Human Actions", href: "#human-actions" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Roadmap", href: "#roadmap" },
];

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const footerNav: NavGroup[] = [
  {
    title: "Protocolo",
    items: [
      { label: "O que é", href: "#o-que-e" },
      { label: "Pilares", href: "#pilares" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Máquina de estados", href: "#maquina-de-estados" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { label: "Papéis", href: "#papeis" },
      { label: "Skills", href: "#skills" },
      { label: "Workflows", href: "#workflows" },
      { label: "Gates determinísticos", href: "#gates" },
    ],
  },
  {
    title: "Governança",
    items: [
      { label: "Colaboração humano-IA", href: "#colaboracao" },
      { label: "Human Action Registry", href: "#human-actions" },
      { label: "Evidência e confiança", href: "#evidencia" },
      { label: "Bootstrap", href: "#bootstrap" },
    ],
  },
  {
    title: "Projeto",
    items: [
      { label: "Estrutura do repositório", href: "#estrutura" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Open source e AG47", href: "#open-source" },
      { label: "Repositório", href: site.repoUrl, external: true },
    ],
  },
];

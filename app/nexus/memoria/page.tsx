import type { Metadata } from 'next';
import { MemoriaClient } from './MemoriaClient';

export const metadata: Metadata = {
  title: 'Memória & Funções | NexusAI',
  description: 'Gerencie as bases de conhecimento, funções customizadas e o mapa de dependências do ecossistema.',
};

export default function MemoriaPage() {
  return <MemoriaClient />;
}

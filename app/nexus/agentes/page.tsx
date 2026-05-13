import type { Metadata } from 'next';
import { AgentesClient } from './AgentesClient';

export const metadata: Metadata = {
  title: 'Agentes | NexusAI',
  description: 'Gerencie e monitore a frota de agentes de inteligência artificial do seu ecossistema.',
};

export default function AgentesPage() {
  return <AgentesClient />;
}

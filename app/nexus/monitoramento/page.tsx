import type { Metadata } from 'next';
import { MonitoramentoClient } from './MonitoramentoClient';

export const metadata: Metadata = {
  title: 'Monitoramento & Logs | NexusAI',
  description: 'Acompanhe o desempenho em tempo real, rastreie execuções e monitore a saúde do sistema de agentes.',
};

export default function MonitoramentoPage() {
  return <MonitoramentoClient />;
}

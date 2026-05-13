import type { Metadata } from 'next';
import { LabsClient } from './LabsClient';

export const metadata: Metadata = {
  title: 'Laboratório de Inovação | Agência 47 Labs',
  description: 'Explore o centro de inovação da Agência 47. MVPs, ferramentas de IA e experimentos digitais de última geração.',
};

export default function LabsPage() {
  return <LabsClient />;
}

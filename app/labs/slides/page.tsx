import type { Metadata } from 'next';
import { SlidesPortalClient } from './SlidesPortalClient';

export const metadata: Metadata = {
  title: 'Portal de Apresentações | Agência 47 Labs',
  description: 'Acesse propostas comerciais, pitches de vendas e demonstrações de conceitos exclusivas da Agência 47.',
};

export default function SlidesPortalPage() {
  return <SlidesPortalClient />;
}

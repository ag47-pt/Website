import type { Metadata } from 'next';
import { DevShowcaseClient } from './DevShowcaseClient';

export const metadata: Metadata = {
  title: 'Dev Showcase | Agência 47 Labs',
  description: 'Acompanhe o desenvolvimento em tempo real dos nossos projetos ativos, MVPs e sistemas em fase alfa.',
};

export default function DevShowcasePage() {
  return <DevShowcaseClient />;
}

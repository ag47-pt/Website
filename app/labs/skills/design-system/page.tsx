import type { Metadata } from 'next';
import { DesignSystemLabClient } from '../DesignSystemLabClient';

export const metadata: Metadata = {
  title: 'Design System Lab — Bancada de Teste Visual | Agência 47 Labs',
  description:
    'Bancada de validação determinística de Design System para desenvolvimento e auditoria de contratos visuais.',
  alternates: { canonical: '/labs/skills/design-system' },
};

export default function DesignSystemSubroutePage() {
  return <DesignSystemLabClient />;
}

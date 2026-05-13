import { Metadata } from 'next';
import AuditClient from './AuditClient';

export const metadata: Metadata = {
  title: 'Request Audit | Restag · Agência 47 Labs',
  description:
    'Solicita uma auditoria técnica de Gastro-Engenharia ao teu negócio de hospitalidade. Análise profunda, resultados mensuráveis, implementação ágil.',
  openGraph: {
    title: 'Request Audit | Restag · Agência 47 Labs',
    description:
      'Solicita uma auditoria técnica de Gastro-Engenharia ao teu negócio de hospitalidade.',
    images: ['/restag/audit-hero-bg.png'],
  },
};

export default function AuditPage() {
  return <AuditClient />;
}

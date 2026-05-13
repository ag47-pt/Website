import type { Metadata } from 'next';
import { AdminSettingsClient } from './AdminSettingsClient';

export const metadata: Metadata = {
  title: 'Configurações Globais | Admin Ag47',
  description: 'Gerencie a identidade visual, canais sociais e parâmetros de engine do ecossistema Agência 47.',
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}

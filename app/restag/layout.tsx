import { Metadata } from 'next';
import RestagMasterLayout from './components/RestagMasterLayout';

export const metadata: Metadata = {
  title: 'Restag Labs | High-End Hospitality Ecosystem',
  description: 'Precision hospitality management and discovery platform by Agência 47 Labs. Gastro-Engineering at its finest.',
};

export default function RestagRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RestagMasterLayout bgImage="/labs/bipolar-brunch-veleiro.png">
      {children}
    </RestagMasterLayout>
  );
}

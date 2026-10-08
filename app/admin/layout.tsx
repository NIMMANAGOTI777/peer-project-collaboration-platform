import type { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Governance Console | PeerCollab Platform',
  description: 'Administrative governance, moderation, taxonomy management, and system auditing.',
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

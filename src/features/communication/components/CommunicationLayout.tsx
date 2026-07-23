import React from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { CommunicationTabBar } from './CommunicationTabBar';

interface CommunicationLayoutProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  children: React.ReactNode;
}

export const CommunicationLayout: React.FC<CommunicationLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  children,
}) => {
  return (
    <div className="space-y-0 text-foreground">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <CommunicationTabBar />
      <div>{children}</div>
    </div>
  );
};

export default CommunicationLayout;

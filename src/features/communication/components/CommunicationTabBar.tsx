import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Bell, MessageSquare, MessageCircle, Inbox } from 'lucide-react';
import { clsx } from 'clsx';

const tabs = [
  { label: 'Notifications', path: '/manager/communication/notifications', icon: Bell },
  { label: 'Maintenance Messages', path: '/manager/communication/messages', icon: MessageSquare },
  { label: 'Conversations Log', path: '/manager/communication/conversations', icon: MessageCircle },
  { label: 'Unified Inbox', path: '/manager/communication/inbox', icon: Inbox },
];

export const CommunicationTabBar: React.FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="border-b border-border bg-card mb-6">
      <nav className="-mb-px flex space-x-1 overflow-x-auto px-1" aria-label="Communication Tabs">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path as any })}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CommunicationTabBar;

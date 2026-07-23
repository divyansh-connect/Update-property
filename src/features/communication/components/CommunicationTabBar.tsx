import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Bell, MessageSquare, MessageCircle, Inbox } from 'lucide-react';
import { clsx } from 'clsx';

const tabs = [
  { label: 'Notifications', path: '/manager/communication/notifications', icon: Bell },
  { label: 'Messages', path: '/manager/communication/messages', icon: MessageSquare },
  { label: 'Conversations', path: '/manager/communication/conversations', icon: MessageCircle },
  { label: 'Inbox', path: '/manager/communication/inbox', icon: Inbox },
];

export const CommunicationTabBar: React.FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="border-b border-border bg-card mb-6 rounded-xl overflow-hidden shadow-sm">
      <nav className="-mb-px flex space-x-1 overflow-x-auto px-3 pt-2" aria-label="Communication Tabs">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path || (currentPath.startsWith(tab.path) && tab.path !== '/manager/communication');
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path as any })}
              className={clsx(
                'flex items-center gap-2 px-5 py-3 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all rounded-t-lg',
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
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

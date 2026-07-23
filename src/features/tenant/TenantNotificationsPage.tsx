import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { useNotificationStore } from '../../store/useStore';
import { Check, Trash2, Bell, ExternalLink, ArrowRight } from 'lucide-react';

export const TenantNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  const handleTenantNotifClick = (n: any) => {
    markAsRead(n.id);
    let rawTarget = n.targetPath || n.link || '';

    // If target is a manager route or missing, map intelligently to tenant portal routes
    let target = '/tenant/notifications';
    const typeLower = (n.type || '').toLowerCase();
    const titleLower = (n.title || '').toLowerCase();
    const msgLower = (n.message || '').toLowerCase();

    if (rawTarget.includes('/maintenance') || typeLower.includes('maintenance') || titleLower.includes('maintenance') || msgLower.includes('ac') || msgLower.includes('leak') || msgLower.includes('repair')) {
      target = '/tenant/maintenance';
    } else if (rawTarget.includes('/payment') || rawTarget.includes('/rent') || typeLower.includes('payment') || titleLower.includes('payment') || titleLower.includes('rent') || msgLower.includes('paid')) {
      target = '/tenant/payments';
    } else if (rawTarget.includes('/lease') || rawTarget.includes('/tenant') || typeLower.includes('lease') || titleLower.includes('lease')) {
      target = '/tenant/lease';
    } else if (rawTarget.includes('/document') || typeLower.includes('document')) {
      target = '/tenant/documents';
    } else {
      target = '/tenant/messages';
    }

    navigate({ to: target as any });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Notifications Center"
        description="Click any notification to navigate directly to its detail page in 1-click."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Notifications' }
        ]}
        action={{
          label: 'Mark All as Read',
          onClick: markAllAsRead,
          icon: <Check className="w-4 h-4" />
        }}
      />

      <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase border-b pb-2">
        <span>Recent Activity ({notifications.length})</span>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-rose-500 hover:underline flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-card border rounded-2xl p-12 text-center space-y-3">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto opacity-60" />
          <h4 className="font-bold text-xs">No alerts found</h4>
          <p className="text-[10px] text-muted-foreground">You are all caught up on your residency updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleTenantNotifClick(n)}
              className={`p-4 rounded-xl border bg-card flex justify-between items-start transition cursor-pointer hover:border-primary/50 group ${
                !n.read ? 'border-l-4 border-l-primary' : 'opacity-85'
              }`}
            >
              <div className="space-y-1 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {n.title}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60">{n.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={n.type || 'info'} />

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTenantNotifClick(n);
                  }}
                  className="text-[10px] font-extrabold px-2 py-1 gap-1 text-primary border-primary/30"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantNotificationsPage;


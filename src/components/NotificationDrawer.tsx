import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  CreditCard, 
  Wrench, 
  FileText, 
  ShieldAlert, 
  Info, 
  ExternalLink,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNotificationStore, NotificationItem } from '../store/useStore';
import { Button } from './ui/Button';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (path: string) => void;
  viewAllPath?: string;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  navigate,
  viewAllPath = '/communication/notifications',
}) => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  if (!isOpen) return null;

  const unreadList = notifications.filter((n) => !n.read);
  const readList = notifications.filter((n) => n.read);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'lease':
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'system':
        return <ShieldAlert className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-primary shrink-0" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    onClose();

    if (navigate) {
      let target = item.targetPath;
      if (!target) {
        if (item.type === 'maintenance') target = '/maintenance/requests';
        else if (item.type === 'payment') target = '/rent';
        else if (item.type === 'lease') target = '/tenants';
        else target = viewAllPath;
      }
      navigate(target);
    }
  };

  const handleViewAll = () => {
    onClose();
    if (navigate) {
      navigate(viewAllPath);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-xs z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250 text-foreground">
        
        {/* PANEL HEADER */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-foreground">Notifications</h3>
              <p className="text-[11px] text-muted-foreground font-medium">
                {unreadList.length > 0 ? `${unreadList.length} unread updates` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {unreadList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="h-8 text-xs font-bold text-primary hover:bg-primary/10 gap-1 px-2"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read All</span>
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                title="Clear all notifications"
                className="h-8 text-xs font-bold text-rose-500 hover:bg-rose-500/10 px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* NOTIFICATIONS CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="p-4 bg-secondary/50 rounded-full text-muted-foreground">
                <Bell className="w-8 h-8" />
              </div>
              <p className="font-extrabold text-sm text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground max-w-[220px]">
                You're all set! Check back later for maintenance, lease, or payment updates.
              </p>
            </div>
          ) : (
            <>
              {/* UNREAD SECTION (AT THE TOP) */}
              {unreadList.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      Unread Notifications ({unreadList.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {unreadList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className="group relative p-3.5 rounded-2xl border border-primary/25 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all shadow-xs"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-background rounded-xl border border-border/80 shadow-2xs group-hover:scale-105 transition-transform">
                            {getNotificationIcon(item.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between space-x-2">
                              <h4 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                {item.title}
                              </h4>
                              <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.time}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium line-clamp-2">
                              {item.message}
                            </p>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                              <span className="text-[10px] font-extrabold text-primary flex items-center gap-1 group-hover:underline">
                                Open detail page <ArrowRight className="w-3 h-3" />
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(item.id);
                                }}
                                title="Mark as read"
                                className="text-[10px] font-bold text-muted-foreground hover:text-emerald-500 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background border border-border"
                              >
                                <Check className="w-3 h-3" /> Mark read
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* READ NOTIFICATIONS (BELOW) */}
              {readList.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">
                      Earlier / Read ({readList.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {readList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className="group p-3.5 rounded-2xl border border-border/50 bg-secondary/30 hover:bg-secondary/70 cursor-pointer transition-all opacity-85 hover:opacity-100"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-background rounded-xl border border-border/60 shrink-0">
                            {getNotificationIcon(item.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between space-x-2">
                              <h4 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {item.time}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium line-clamp-2">
                              {item.message}
                            </p>

                            <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity block mt-1.5">
                              Click to view item →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* PANEL FOOTER */}
        <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md sticky bottom-0 z-10">
          <Button
            onClick={handleViewAll}
            className="w-full font-extrabold bg-primary hover:bg-primary/90 text-white gap-2 shadow-md h-10"
          >
            <span>View All Notifications</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </>
  );
};

export default NotificationDrawer;

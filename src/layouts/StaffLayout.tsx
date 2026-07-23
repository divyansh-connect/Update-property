import React, { useState } from 'react';
import { useAuthStore, useThemeStore, useNotificationStore } from '../store/useStore';
import { 
  Menu, Bell, Sun, Moon, LogOut, ChevronDown, User,
  LayoutDashboard, Wrench, X, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { clsx } from 'clsx';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationDrawer } from '../components/NotificationDrawer';


interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface StaffLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({
  children,
  currentPath,
  navigate,
}) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();


  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems: MenuItem[] = [
    { title: 'My Tasks', icon: <Wrench className="w-5 h-5" />, path: '/staff/maintenance' },
  ];

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
    setIsMobileOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col border-r bg-card text-card-foreground shrink-0 w-64">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-black text-lg text-primary truncate">
            Staff Portal
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.title}
                onClick={() => handleMenuClick(item)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Logout Button */}
        <div className="p-4 border-t border-border/40">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER (SHEET) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative flex flex-col w-full max-w-xs bg-card text-card-foreground p-5 border-r animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-5 border-b mb-5">
              <span className="font-black text-lg text-primary">Staff Portal</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.title}
                    onClick={() => handleMenuClick(item)}
                    className={clsx(
                      'w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wider',
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-border/40 mt-5">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-sm font-extrabold tracking-wide uppercase text-muted-foreground hidden md:block">
              Welcome back, {user?.name || 'Technician'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* NOTIFICATIONS WIDGET LAUNCHER */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>


            {/* Language Selector */}
            <LanguageSelector />


            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-secondary transition"
              >
                <img
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                />
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-card p-2 shadow-lg ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b">
                      <p className="text-xs font-bold truncate">{user?.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                      <span className="inline-block bg-primary/10 text-primary text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-1">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg mt-1 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/20">
          {children}
        </main>
      </div>

      {/* NOTIFICATION DRAWER / PANEL */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        navigate={navigate}
        viewAllPath="/staff/maintenance"
      />
    </div>
  );
};

export default StaffLayout;

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore, useThemeStore, useNotificationStore } from '../store/useStore';
import {
  Menu, Bell, Sun, Moon, LogOut, ChevronDown, ChevronRight, User,
  LayoutDashboard, Building2, Home, Key, Users, UserCheck, CreditCard,
  BookOpen, Wrench, ShieldAlert, FileText, BarChart3, MessageSquare, Bot, Settings, X, Loader2,
  Briefcase, CalendarCheck, LifeBuoy, Shield
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { clsx } from 'clsx';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationDrawer } from '../components/NotificationDrawer';


interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { title: string; path: string }[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  navigate,
}) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  // --- SUPER ADMIN MENU ITEMS ---
  const superAdminMenuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/super-admin' },
    {
      title: 'Companies',
      icon: <Building2 className="w-5 h-5" />,
      path: '/super-admin/companies',
      submenu: [
        { title: 'All Companies', path: '/super-admin/companies' },
        { title: 'Create Company', path: '/super-admin/companies/new' },
        { title: 'Company Users', path: '/super-admin/companies/users' },
      ],
    },
    {
      title: 'Subscriptions',
      icon: <CalendarCheck className="w-5 h-5" />,
      path: '/super-admin/subscriptions',
      submenu: [
        { title: 'Plans', path: '/super-admin/subscriptions/plans' },
        { title: 'Active Subscriptions', path: '/super-admin/subscriptions/active' },
        { title: 'Invoices', path: '/super-admin/subscriptions/invoices' },
      ],
    },
    {
      title: 'Platform Users',
      icon: <Users className="w-5 h-5" />,
      path: '/super-admin/platform-users',
    },
    {
      title: 'Platform Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/super-admin/platform-settings',
      submenu: [
        { title: 'General', path: '/super-admin/platform-settings/general' },
        { title: 'Security & Logs', path: '/super-admin/platform-security/audit' },
      ],
    },
  ];

  // --- PROPERTY MANAGER MENU ITEMS ---
  const managerMenuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/manager' },
    {
      title: 'Properties',
      icon: <Building2 className="w-5 h-5" />,
      path: '/manager/properties',
      submenu: [
        { title: 'Properties', path: '/manager/properties' },
        { title: 'Buildings', path: '/manager/buildings' },
        { title: 'Units', path: '/manager/units' },
      ],
    },
    {
      title: 'Leasing',
      icon: <Key className="w-5 h-5" />,
      path: '/manager/leasing',
      submenu: [
        { title: 'Leads', path: '/manager/leasing/leads' },
        { title: 'Applications', path: '/manager/leasing/applications' },
        { title: 'Leases', path: '/manager/leasing/leases' },
        { title: 'Renewals', path: '/manager/leasing/renewals' },
        { title: 'Move In', path: '/manager/leasing/move-in' },
        { title: 'Move Out', path: '/manager/leasing/move-out' },
      ],
    },
    {
      title: 'Tenants',
      icon: <Users className="w-5 h-5" />,
      path: '/manager/tenants',
      submenu: [
        { title: 'Tenant Directory', path: '/manager/tenants' },
        { title: 'Tenant Documents', path: '/manager/tenants/documents' },
      ],
    },
    {
      title: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      path: '/manager/documents/all',
      submenu: [
        { title: 'All Documents', path: '/manager/documents/all' },
        { title: 'e-Signatures', path: '/manager/documents/signatures' },
      ],
    },
    {
      title: 'Owners',
      icon: <UserCheck className="w-5 h-5" />,
      path: '/manager/owners',
    },
    {
      title: 'Rent & Payments',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/manager/rent',
      submenu: [
        { title: 'Dashboard', path: '/manager/rent' },
        { title: 'Payments', path: '/manager/payments' },
        { title: 'Invoices', path: '/manager/invoices' },
        { title: 'Rent Ledger', path: '/manager/rent-ledger' },
      ],
    },
    {
      title: 'Accounting',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/manager/accounting',
      submenu: [
        { title: 'Dashboard', path: '/manager/accounting' },
        { title: 'Chart of Accounts', path: '/manager/accounting/chart-of-accounts' },
        { title: 'Income', path: '/manager/accounting/income' },
        { title: 'Expenses', path: '/manager/accounting/expenses' },
      ],
    },
    {
      title: 'Maintenance',
      icon: <Wrench className="w-5 h-5" />,
      path: '/manager/maintenance',
      submenu: [
        { title: 'Dashboard', path: '/manager/maintenance' },
        { title: 'Service Requests', path: '/manager/maintenance/requests' },
        { title: 'Work Orders', path: '/manager/maintenance/work-orders' },
        { title: 'City Violations', path: '/manager/maintenance/violations' },
        { title: 'Inspections', path: '/manager/inspections' },
        { title: 'Vendors', path: '/manager/vendors' },
      ],
    },
    {
      title: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/manager/reports',
    },
    {
      title: 'Communication',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/manager/communication',
      submenu: [
        { title: 'Notifications', path: '/manager/communication/notifications' },
        { title: 'Maintenance Messages', path: '/manager/communication/messages' },
        { title: 'Conversations Log', path: '/manager/communication/conversations' },
        { title: 'Unified Inbox', path: '/manager/communication/inbox' },
      ],
    },
    {
      title: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      path: '/ai/assistant',
    },
    {
      title: 'Company Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/manager/admin',
      submenu: [
        { title: 'Company Profile', path: '/manager/admin/company-settings' },
        { title: 'Users & Roles', path: '/manager/admin/users' },
        { title: 'Roles & Permissions', path: '/manager/admin/roles' },
        { title: 'Integrations Marketplace', path: '/manager/admin/integrations' },
        { title: 'Connected Apps (QuickBooks)', path: '/super-admin/platform-integrations/connected' },
      ],
    },
  ];

  const { data: roles = [] } = useQuery({
    queryKey: ['rbac-roles-list'],
    queryFn: () => api.roles.getAll(),
  });

  const hasModuleAccess = (moduleName: string) => {
    if (user?.role === 'Super Admin' || user?.role === 'Property Manager') return true;
    const matchingRole = roles.find(r => r.name.toLowerCase() === user?.role?.toLowerCase());
    if (!matchingRole) return true; // fallback
    const permRule = matchingRole.permissions.find((p: any) => p.module === moduleName);
    return permRule ? permRule.view : false;
  };

  const getFilteredMenuItems = () => {
    if (user?.role === 'Super Admin') return superAdminMenuItems;

    const filtered: MenuItem[] = [];

    managerMenuItems.forEach(item => {
      let moduleName = '';
      if (item.path.startsWith('/properties') || item.path.startsWith('/buildings') || item.path.startsWith('/units')) {
        moduleName = 'Properties';
      } else if (item.path.startsWith('/leasing')) {
        moduleName = 'Leasing';
      } else if (item.path.startsWith('/tenants')) {
        moduleName = 'Tenants';
      } else if (item.path.startsWith('/owners')) {
        moduleName = 'Owners';
      } else if (item.path.startsWith('/rent') || item.path.startsWith('/payments') || item.path.startsWith('/invoices') || item.path.startsWith('/rent-ledger')) {
        moduleName = 'Rent & Payments';
      } else if (item.path.startsWith('/accounting')) {
        moduleName = 'Accounting';
      } else if (item.path.startsWith('/maintenance') || item.path.startsWith('/inspections') || item.path.startsWith('/vendors')) {
        moduleName = 'Maintenance';
      } else if (item.path.startsWith('/reports')) {
        moduleName = 'Reports';
      } else if (item.path.startsWith('/communication')) {
        moduleName = 'Communication';
      } else if (item.path.startsWith('/admin') || item.path.startsWith('/platform-integrations')) {
        moduleName = 'Company Settings';
      } else if (item.path.startsWith('/ai')) {
        moduleName = 'Dashboard';
      }

      if (!moduleName || hasModuleAccess(moduleName)) {
        filtered.push(item);
      }
    });

    return filtered;
  };

  const visibleMenuItems = getFilteredMenuItems();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const activeItem = visibleMenuItems.find(item =>
      item.submenu?.some(sub => currentPath === sub.path)
    );
    if (activeItem) {
      setActiveDropdown(activeItem.title);
    }
  }, [currentPath, roles]);

  const navRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, [currentPath]);

  const handleMenuClick = (item: MenuItem) => {
    if (navRef.current) {
      sessionStorage.setItem('sidebar-scroll', navRef.current.scrollTop.toString());
    }
    if (item.submenu) {
      setActiveDropdown(activeDropdown === item.title ? null : item.title);
    } else {
      navigate(item.path);
      setIsMobileOpen(false);
    }
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  // Build Breadcrumbs from Path
  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    let currentLink = '';
    parts.forEach((part) => {
      currentLink += `/${part}`;
      crumbs.push({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' '),
        href: currentLink,
      });
    });
    return crumbs;
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={clsx(
          'hidden md:flex flex-col border-r border-border/80 bg-card/45 backdrop-blur-xl sticky top-0 h-screen transition-all duration-300 z-40',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/60">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 min-w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-extrabold text-lg">D</span>
            </div>
            {isSidebarOpen && (
              <span className="font-extrabold text-lg tracking-tight whitespace-nowrap text-foreground">
                DoorLoop <span className="text-primary text-xs font-semibold px-1 py-0.5 rounded bg-primary/10 ml-1">APEX</span>
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Menu Scroll */}
        <nav ref={navRef} className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleMenuItems.map((item) => {
            const hasSub = !!item.submenu;
            const isOpen = activeDropdown === item.title;
            const active = isLinkActive(item.path);

            return (
              <div key={item.title} className="space-y-1">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/10'
                      : 'hover:bg-accent/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className={clsx('transition-transform duration-200 group-hover:scale-105', active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary')}>
                      {item.icon}
                    </span>
                    {isSidebarOpen && <span>{item.title}</span>}
                  </div>
                  {isSidebarOpen && hasSub && (
                    <span>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                  )}
                </button>

                {/* Submenu rendering */}
                {isSidebarOpen && hasSub && isOpen && (
                  <div className="pl-8 space-y-1 py-1 animate-fade-in border-l border-border/80 ml-5">
                    {item.submenu!.map((sub) => {
                      const subActive = currentPath === sub.path;
                      return (
                        <button
                          key={sub.title}
                          onClick={() => {
                            if (navRef.current) {
                              sessionStorage.setItem('sidebar-scroll', navRef.current.scrollTop.toString());
                            }
                            navigate(sub.path);
                            setIsMobileOpen(false);
                          }}
                          className={clsx(
                            'w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all duration-150',
                            subActive
                              ? 'text-primary bg-primary/5 dark:bg-primary/15'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                          )}
                        >
                          {sub.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer - Logout */}
        <div className="p-4 border-t border-border/60">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-wider"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER (SHEET) --- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Drawer content */}
          <div className="relative flex flex-col w-72 max-w-xs bg-card border-r border-border p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                  D
                </div>
                <span className="font-extrabold text-base">DoorLoop Apex</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {/* Scrollable menu */}
            <nav className="flex-1 overflow-y-auto space-y-1">
              {visibleMenuItems.map((item) => {
                const hasSub = !!item.submenu;
                const isOpen = activeDropdown === item.title;
                const active = isLinkActive(item.path);

                return (
                  <div key={item.title}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all',
                        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent/40'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {hasSub && (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                    </button>
                    {hasSub && isOpen && (
                      <div className="pl-6 space-y-1 py-1 border-l ml-5 mt-1 border-border">
                        {item.submenu!.map((sub) => (
                          <button
                            key={sub.title}
                            onClick={() => {
                              navigate(sub.path);
                              setIsMobileOpen(false);
                            }}
                            className={clsx(
                              'w-full text-left px-3 py-2 rounded text-xs font-semibold',
                              currentPath === sub.path ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                            )}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-border mt-4">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors uppercase tracking-wider"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* --- HEADER --- */}
        <header className="glass-header h-16 flex items-center justify-between px-6 z-30">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Breadcrumb renderer */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-muted-foreground font-semibold">
              {getBreadcrumbs().map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-55" />}
                  <span
                    onClick={() => navigate(crumb.href || '/')}
                    className={clsx(
                      'hover:text-primary cursor-pointer transition-colors',
                      idx === getBreadcrumbs().length - 1 && 'text-foreground font-bold pointer-events-none'
                    )}
                  >
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Notifications Launcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>


            </div>


            {/* Language Selector */}
            <LanguageSelector />

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-2 hover:bg-accent rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-tight">{user?.name || 'Manager'}</p>
                  <p className="text-[10px] text-muted-foreground leading-none">{user?.role || 'Apex Admin'}</p>
                </div>
              </Button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-card p-3 shadow-2xl animate-fade-in text-foreground">
                  <div className="pb-2 border-b border-border/80 text-xs">
                    <p className="font-bold">{user?.name || 'Sarah Davis'}</p>
                    <p className="text-muted-foreground truncate">{user?.email || 'manager@apexpm.com'}</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-xs font-semibold flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- MAIN PAGE VIEW CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>

      {/* NOTIFICATION DRAWER / PANEL */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        navigate={navigate}
        viewAllPath="/communication/notifications"
      />
    </div>
  );
};

export default DashboardLayout;

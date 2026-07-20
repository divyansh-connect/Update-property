import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    {
      title: 'Companies',
      icon: <Building2 className="w-5 h-5" />,
      path: '/companies',
      submenu: [
        { title: 'All Companies', path: '/companies' },
        { title: 'Create Company', path: '/companies/new' },
        { title: 'Company Details', path: '/companies/details' },
        { title: 'Company Users', path: '/companies/users' },
        { title: 'Subscription', path: '/companies/subscription' },
        { title: 'Usage', path: '/companies/usage' },
      ],
    },
    {
      title: 'Subscriptions',
      icon: <CalendarCheck className="w-5 h-5" />,
      path: '/subscriptions',
      submenu: [
        { title: 'Plans', path: '/subscriptions/plans' },
        { title: 'Active Subscriptions', path: '/subscriptions/active' },
        { title: 'Invoices', path: '/subscriptions/invoices' },
        { title: 'Payments', path: '/subscriptions/payments' },
        { title: 'Coupons', path: '/subscriptions/coupons' },
      ],
    },
    {
      title: 'Platform Users',
      icon: <Users className="w-5 h-5" />,
      path: '/platform-users',
    },
    {
      title: 'Support',
      icon: <LifeBuoy className="w-5 h-5" />,
      path: '/support',
      submenu: [
        { title: 'Tickets', path: '/support/tickets' },
        { title: 'Feedback', path: '/support/feedback' },
        { title: 'Contact Requests', path: '/support/contact-requests' },
      ],
    },
    {
      title: 'Platform Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/platform-settings',
      submenu: [
        { title: 'General', path: '/platform-settings/general' },
        { title: 'Email', path: '/platform-settings/email' },
        { title: 'Storage', path: '/platform-settings/storage' },
        { title: 'Branding', path: '/platform-settings/branding' },
      ],
    },
    {
      title: 'Integrations',
      icon: <Bot className="w-5 h-5" />,
      path: '/platform-integrations',
      submenu: [
        { title: 'Connected Apps', path: '/platform-integrations/connected' },
        { title: 'API Keys', path: '/platform-integrations/keys' },
        { title: 'Webhooks', path: '/platform-integrations/webhooks' },
      ],
    },
    {
      title: 'Security',
      icon: <Shield className="w-5 h-5" />,
      path: '/platform-security',
      submenu: [
        { title: 'Audit Logs', path: '/platform-security/audit' },
        { title: 'Login History', path: '/platform-security/login-history' },
        { title: 'Security Policies', path: '/platform-security/policies' },
      ],
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/platform-analytics',
    },
  ];

  // --- PROPERTY MANAGER MENU ITEMS ---
  const managerMenuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    {
      title: 'Properties',
      icon: <Building2 className="w-5 h-5" />,
      path: '/properties',
      submenu: [
        { title: 'Properties', path: '/properties' },
        { title: 'Buildings', path: '/buildings' },
        { title: 'Units', path: '/units' },
        { title: 'Amenities', path: '/properties/amenities' },
        { title: 'Floor Plans', path: '/properties/floor-plans' },
      ],
    },
    {
      title: 'Leasing',
      icon: <Key className="w-5 h-5" />,
      path: '/leasing',
      submenu: [
        { title: 'Leads', path: '/leasing/leads' },
        { title: 'Applications', path: '/leasing/applications' },
        { title: 'Screening', path: '/leasing/screening' },
        { title: 'Leases', path: '/leasing/leases' },
        { title: 'Renewals', path: '/leasing/renewals' },
        { title: 'Move In', path: '/leasing/move-in' },
        { title: 'Move Out', path: '/leasing/move-out' },
      ],
    },
    {
      title: 'Tenants',
      icon: <Users className="w-5 h-5" />,
      path: '/tenants',
      submenu: [
        { title: 'Tenant Directory', path: '/tenants' },
        { title: 'Active Tenants', path: '/tenants/active' },
        { title: 'Former Tenants', path: '/tenants/former' },
        { title: 'Tenant Documents', path: '/tenants/documents' },
      ],
    },
    {
      title: 'Owners',
      icon: <UserCheck className="w-5 h-5" />,
      path: '/owners',
      submenu: [
        { title: 'Owners', path: '/owners' },
        { title: 'Owner Statements', path: '/owners/statements' },
      ],
    },
    {
      title: 'Rent Collection',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/rent',
      submenu: [
        { title: 'Dashboard', path: '/rent' },
        { title: 'Payments', path: '/payments' },
        { title: 'Rent Ledger', path: '/rent-ledger' },
        { title: 'Invoices', path: '/invoices' },
        { title: 'Charges', path: '/charges' },
        { title: 'Deposits', path: '/deposits' },
        { title: 'Payment Plans', path: '/payment-plans' },
        { title: 'Refunds', path: '/refunds' },
        { title: 'Payment Methods', path: '/payment-methods' },
        { title: 'Late Fees', path: '/rent/late-fees' },
      ],
    },
    {
      title: 'Accounting',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/accounting',
      submenu: [
        { title: 'Dashboard', path: '/accounting' },
        { title: 'Chart of Accounts', path: '/accounting/chart-of-accounts' },
        { title: 'Journal Entries', path: '/accounting/journal-entries' },
        { title: 'General Ledger', path: '/accounting/general-ledger' },
        { title: 'Income', path: '/accounting/income' },
        { title: 'Expenses', path: '/accounting/expenses' },
        { title: 'Vendor Bills', path: '/accounting/vendor-bills' },
        { title: 'Recurring', path: '/accounting/recurring' },
        { title: 'Bank Accounts', path: '/accounting/bank-accounts' },
        { title: 'Bank Reconciliation', path: '/accounting/reconciliation' },
        { title: 'Budgets', path: '/accounting/budgets' },
        { title: 'Owner Statements', path: '/accounting/owner-statements' },
        { title: 'Taxes', path: '/accounting/taxes' },
        { title: 'Financial Reports', path: '/accounting/reports' },
        { title: 'Year-End Closing', path: '/accounting/year-end' },
        { title: 'Trust Accounts', path: '/accounting/trust-accounts' },
      ],
    },
    {
      title: 'Maintenance',
      icon: <Wrench className="w-5 h-5" />,
      path: '/maintenance',
      submenu: [
        { title: 'Dashboard', path: '/maintenance' },
        { title: 'Service Requests', path: '/maintenance/requests' },
        { title: 'Work Orders', path: '/maintenance/work-orders' },
        { title: 'Preventive', path: '/maintenance/preventive' },
        { title: 'Assets', path: '/maintenance/assets' },
        { title: 'Inventory', path: '/maintenance/inventory' },
        { title: 'Vendors', path: '/vendors' },
        { title: 'Vendor Invoices', path: '/vendors/invoices' },
        { title: 'Inspections', path: '/inspections' },
        { title: 'Calendar', path: '/maintenance/calendar' },
        { title: 'Reports', path: '/maintenance/reports' },
      ],
    },
    {
      title: 'Documents',
      icon: <FileText className="w-5 h-5" />,
      path: '/documents',
      submenu: [
        { title: 'Dashboard', path: '/documents' },
        { title: 'All Documents', path: '/documents/all' },
        { title: 'Folders', path: '/documents/folders' },
        { title: 'Templates', path: '/documents/templates' },
        { title: 'Signature Requests', path: '/documents/signatures' },
        { title: 'Shared With Me', path: '/documents/shared' },
        { title: 'Version History', path: '/documents/versions' },
        { title: 'Document Requests', path: '/documents/requests' },
        { title: 'Permissions', path: '/documents/permissions' },
        { title: 'Audit Log', path: '/documents/audit' },
        { title: 'Archive', path: '/documents/archive' },
        { title: 'Settings', path: '/documents/settings' },
      ],
    },
    {
      title: 'Reports & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/reports',
      submenu: [
        { title: 'Dashboard', path: '/reports' },
        { title: 'Executive Dashboard', path: '/reports/executive' },
        { title: 'Property Reports', path: '/reports/properties' },
        { title: 'Financial Reports', path: '/reports/financial' },
        { title: 'Tenant Reports', path: '/reports/tenants' },
        { title: 'Leasing Reports', path: '/reports/leasing' },
        { title: 'Maintenance Reports', path: '/reports/maintenance' },
        { title: 'Owner Reports', path: '/reports/owners' },
        { title: 'Custom Reports', path: '/reports/custom' },
        { title: 'Scheduled Reports', path: '/reports/scheduled' },
        { title: 'Saved Reports', path: '/reports/saved' },
        { title: 'Data Explorer', path: '/reports/explorer' },
        { title: 'Analytics Settings', path: '/reports/settings' },
        { title: 'Rent Roll', path: '/reports/rent-roll' },
        { title: 'Occupancy', path: '/reports/occupancy' },
        { title: 'Delinquency', path: '/reports/delinquency' },
      ],
    },
    {
      title: 'Communication',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/communication',
      submenu: [
        { title: 'Dashboard', path: '/communication' },
        { title: 'Inbox', path: '/communication/inbox' },
        { title: 'Conversations', path: '/communication/conversations' },
        { title: 'Email Center', path: '/communication/email' },
        { title: 'SMS Center', path: '/communication/sms' },
        { title: 'Announcements', path: '/communication/announcements' },
        { title: 'Templates', path: '/communication/templates' },
        { title: 'Contacts', path: '/communication/contacts' },
        { title: 'Notifications', path: '/communication/notifications' },
        { title: 'Scheduled Messages', path: '/communication/scheduled' },
        { title: 'Activity Log', path: '/communication/activity' },
        { title: 'Settings', path: '/communication/settings' },
      ]
    },
    {
      title: 'AI Center',
      icon: <Bot className="w-5 h-5" />,
      path: '/ai',
      submenu: [
        { title: 'AI Assistant', path: '/ai/assistant' },
        { title: 'AI Settings', path: '/ai/settings' },
      ],
    },
    {
      title: 'Company Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin',
      submenu: [
        { title: 'Company Profile', path: '/admin/company-settings' },
        { title: 'Users', path: '/admin/users' },
        { title: 'Teams', path: '/admin/teams' },
        { title: 'Roles & Permissions', path: '/admin/roles' },
        { title: 'Notification Settings', path: '/admin/notifications' },
        { title: 'Integrations', path: '/admin/integrations' },
        { title: 'Security', path: '/admin/security' },
        { title: 'Billing', path: '/admin/billing' },
      ],
    },
  ];

  const visibleMenuItems = user?.role === 'Super Admin' ? superAdminMenuItems : managerMenuItems;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(() => {
    const activeItem = visibleMenuItems.find(item => 
      item.submenu?.some(sub => currentPath === sub.path)
    );
    return activeItem ? activeItem.title : null;
  });
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
  }, [currentPath]);

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

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-border/60">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/40 text-muted-foreground hover:text-foreground transition-all"
          >
            {isSidebarOpen ? 'Collapse Menu' : '→'}
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

            {/* Notifications Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-2xl p-4 animate-fade-in text-foreground">
                  <div className="flex items-center justify-between pb-2 border-b border-border/80">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    <div className="flex space-x-2 text-xs font-semibold text-primary">
                      <button onClick={markAllAsRead} className="hover:underline">
                        Read All
                      </button>
                      <span>•</span>
                      <button onClick={clearAll} className="hover:underline text-muted-foreground">
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-6">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifications(false);
                          }}
                          className={clsx(
                            'p-2.5 rounded-lg border border-border/40 hover:bg-muted/50 cursor-pointer transition-all',
                            !n.read && 'bg-primary/5 border-primary/20'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-xs">{n.title}</span>
                            <span className="text-[10px] text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
    </div>
  );
};
export default DashboardLayout;

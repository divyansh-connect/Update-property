const fs = require('fs');
let file = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Root route redirect logic
const rootRouteReplacement = `// Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    React.useEffect(() => {
      if (user?.role === 'Super Admin') {
        navigate({ to: '/super-admin' });
      } else if (user?.role === 'Owner') {
        navigate({ to: '/owner' });
      } else if (user?.role === 'Tenant') {
        navigate({ to: '/tenant' });
      } else if (user?.role === 'Maintenance Staff') {
        navigate({ to: '/staff' });
      } else {
        navigate({ to: '/manager' });
      }
    }, [user, navigate]);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  },
});`;
file = file.replace(/\/\/ Index Route\s+const indexRoute = createRoute\(\{[\s\S]*?\}\);/, rootRouteReplacement);

// We need to prefix routes.
const superAdminRoutes = [
  'companies',
  'subscriptions',
  'platform-users',
  'platform-settings',
  'platform-integrations',
  'platform-security'
];

const managerRoutes = [
  'properties',
  'buildings',
  'units',
  'leasing',
  'tenants',
  'documents',
  'owners',
  'rent',
  'payments',
  'rent-ledger',
  'invoices',
  'charges',
  'deposits',
  'payment-plans',
  'refunds',
  'payment-methods',
  'accounting',
  'coa',
  'journal-entries',
  'general-ledger',
  'income',
  'expenses',
  'vendor-bills',
  'recurring-transactions',
  'bank-accounts',
  'bank-reconciliation',
  'budgets',
  'owner-statements',
  'taxes',
  'financial-reports',
  'year-end',
  'maintenance',
  'requests',
  'work-orders',
  'preventive',
  'assets',
  'inventory',
  'vendors',
  'vendor-invoices',
  'inspections',
  'maintenance-calendar',
  'maintenance-reports',
  'reports',
  'communication',
  'ai-assistant',
  'admin' // company settings
];

// Add specific base routes
const addBaseRoutes = `
const superAdminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/super-admin',
  component: () => (
    <ProtectedWrapper>
      <SuperAdminDashboardPage />
    </ProtectedWrapper>
  ),
});

const managerIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager',
  component: () => (
    <ProtectedWrapper>
      <DashboardPage />
    </ProtectedWrapper>
  ),
});
`;

// Only add if not already there
if (!file.includes('path: \'/super-admin\'')) {
  file = file + addBaseRoutes;
  file = file.replace('indexRoute,', 'indexRoute,\n  superAdminIndexRoute,\n  managerIndexRoute,');
}

superAdminRoutes.forEach(route => {
  file = file.replace(new RegExp(`path: '/${route}`, 'g'), `path: '/super-admin/${route}`);
});

managerRoutes.forEach(route => {
  file = file.replace(new RegExp(`path: '/${route}`, 'g'), `path: '/manager/${route}`);
});

// Fix some specific paths that were reverted or exist
file = file.replace("path: '/manager/admin/integrations", "path: '/manager/admin/integrations"); // Just testing if regex worked

// Re-write the file
fs.writeFileSync('src/routes/index.tsx', file);
console.log('Routes updated!');

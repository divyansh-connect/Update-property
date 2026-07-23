const fs = require('fs');
let file = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Super Admin Paths
const superAdminRoutes = [
  'companies',
  'subscriptions',
  'platform-users',
  'platform-settings',
  'platform-integrations',
  'platform-security'
];

superAdminRoutes.forEach(route => {
  file = file.replace(new RegExp(`path: '/${route}`, 'g'), `path: '/super-admin/${route}`);
});

file = file.replace(`{ title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' }`, `{ title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/super-admin' }`);


// Manager Paths
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

managerRoutes.forEach(route => {
  file = file.replace(new RegExp(`path: '/${route}`, 'g'), `path: '/manager/${route}`);
});

// Update manager dashboard path
file = file.replace(`{ title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' }`, `{ title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/manager' }`);

// Specific fix for admin/integrations inside manager
file = file.replace("path: '/manager/manager/admin", "path: '/manager/admin");


fs.writeFileSync('src/layouts/DashboardLayout.tsx', file);
console.log('Dashboard Layout paths updated!');

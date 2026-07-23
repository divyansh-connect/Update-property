const fs = require('fs');
let file = fs.readFileSync('src/routes/index.tsx', 'utf8');

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

superAdminRoutes.forEach(route => {
  file = file.replace(new RegExp(`navigate\\(\\{ to: '/${route}`, 'g'), `navigate({ to: '/super-admin/${route}`);
  file = file.replace(new RegExp(`href: '/${route}`, 'g'), `href: '/super-admin/${route}`);
  // Also inline Link to
  file = file.replace(new RegExp(`to="/${route}`, 'g'), `to="/super-admin/${route}`);
});

managerRoutes.forEach(route => {
  file = file.replace(new RegExp(`navigate\\(\\{ to: '/${route}`, 'g'), `navigate({ to: '/manager/${route}`);
  file = file.replace(new RegExp(`href: '/${route}`, 'g'), `href: '/manager/${route}`);
  file = file.replace(new RegExp(`to="/${route}`, 'g'), `to="/manager/${route}`);
});

fs.writeFileSync('src/routes/index.tsx', file);
console.log('Fixed inline links in index.tsx!');

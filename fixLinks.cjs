const fs = require('fs');
const path = require('path');

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

function processFile(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');
  let originalFile = file;

  superAdminRoutes.forEach(route => {
    // Replace to="/route..."
    file = file.replace(new RegExp(`to="/${route}`, 'g'), `to="/super-admin/${route}`);
    // Replace to: '/route...'
    file = file.replace(new RegExp(`to: '/${route}`, 'g'), `to: '/super-admin/${route}`);
    // Replace navigate('/route...')
    file = file.replace(new RegExp(`navigate\\('/${route}`, 'g'), `navigate('/super-admin/${route}`);
  });

  managerRoutes.forEach(route => {
    // Replace to="/route..."
    file = file.replace(new RegExp(`to="/${route}`, 'g'), `to="/manager/${route}`);
    // Replace to: '/route...'
    file = file.replace(new RegExp(`to: '/${route}`, 'g'), `to: '/manager/${route}`);
    // Replace navigate('/route...')
    file = file.replace(new RegExp(`navigate\\('/${route}`, 'g'), `navigate('/manager/${route}`);
  });
  
  // Specific fix for admin vs manager/admin
  file = file.replace(/to="\/manager\/manager\/admin/g, `to="/manager/admin`);
  file = file.replace(/to: '\/manager\/manager\/admin/g, `to: '/manager/admin`);
  file = file.replace(/navigate\('\/manager\/manager\/admin/g, `navigate('/manager/admin`);

  if (file !== originalFile) {
    fs.writeFileSync(filePath, file);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('src/features');
walkDir('src/components');
console.log('All links updated!');

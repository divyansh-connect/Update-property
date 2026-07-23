const fs = require('fs');
let file = fs.readFileSync('src/routes/index.tsx', 'utf8');

const targetStr = `  const isOwnerPath = location.pathname === '/owner' || location.pathname.startsWith('/owner/');
  const isTenantPath = location.pathname === '/tenant' || location.pathname.startsWith('/tenant/');
  const isStaffPath = location.pathname === '/staff' || location.pathname.startsWith('/staff/');
  const isIntegrationsPath =
    location.pathname.startsWith('/admin/integrations') ||
    location.pathname.startsWith('/platform-integrations');

  // Role Access Guard
  let hasAccess = true;
  if (!isIntegrationsPath) {
    if (user?.role === 'Owner' && !isOwnerPath) {
      hasAccess = false;
    } else if (user?.role === 'Tenant' && !isTenantPath) {
      hasAccess = false;
    } else if (user?.role === 'Maintenance Staff' && !isStaffPath) {
      hasAccess = false;
    } else if (user?.role && user.role !== 'Super Admin' && user.role !== 'Property Manager') {
      // Map pathname to module permissions
      const getRequiredModule = (path: string): string => {
        if (path.startsWith('/properties') || path.startsWith('/buildings') || path.startsWith('/units')) return 'Properties';
        if (path.startsWith('/leasing')) return 'Leasing';
        if (path.startsWith('/tenants')) return 'Tenants';
        if (path.startsWith('/owners')) return 'Owners';
        if (path.startsWith('/rent') || path.startsWith('/payments') || path.startsWith('/invoices') || path.startsWith('/rent-ledger')) return 'Rent & Payments';
        if (path.startsWith('/accounting')) return 'Accounting';
        if (path.startsWith('/maintenance') || path.startsWith('/inspections') || path.startsWith('/vendors')) return 'Maintenance';
        if (path.startsWith('/reports')) return 'Reports';
        if (path.startsWith('/communication')) return 'Communication';
        if (path.startsWith('/admin') || path.startsWith('/platform-integrations')) return 'Company Settings';
        return '';
      };

      const reqModule = getRequiredModule(location.pathname);
      if (reqModule) {
        const matchingRole = roles.find((r: any) => r.name.toLowerCase() === user.role.toLowerCase());
        if (matchingRole) {
          const permRule = matchingRole.permissions.find((p: any) => p.module === reqModule);
          if (permRule && !permRule.view) {
            hasAccess = false;
          }
        }
      }
    }
  }`;

const replacementStr = `  const isSuperAdminPath = location.pathname === '/super-admin' || location.pathname.startsWith('/super-admin/');
  const isManagerPath = location.pathname === '/manager' || location.pathname.startsWith('/manager/');
  const isOwnerPath = location.pathname === '/owner' || location.pathname.startsWith('/owner/');
  const isTenantPath = location.pathname === '/tenant' || location.pathname.startsWith('/tenant/');
  const isStaffPath = location.pathname === '/staff' || location.pathname.startsWith('/staff/');
  const isIntegrationsPath =
    location.pathname.startsWith('/admin/integrations') ||
    location.pathname.startsWith('/platform-integrations');

  // Role Access Guard
  let hasAccess = true;
  if (!isIntegrationsPath) {
    if (user?.role === 'Owner' && !isOwnerPath) {
      hasAccess = false;
    } else if (user?.role === 'Tenant' && !isTenantPath) {
      hasAccess = false;
    } else if (user?.role === 'Maintenance Staff' && !isStaffPath) {
      hasAccess = false;
    } else if (isSuperAdminPath && user?.role !== 'Super Admin') {
      hasAccess = false;
    } else if (isManagerPath && user?.role !== 'Property Manager' && user?.role !== 'Super Admin') {
      hasAccess = false;
    } else if (user?.role && user.role !== 'Super Admin' && user.role !== 'Property Manager') {
      // Map pathname to module permissions
      const getRequiredModule = (path: string): string => {
        const cleanPath = path.replace(/^\\/manager|^\\/super-admin/, '');
        if (cleanPath.startsWith('/properties') || cleanPath.startsWith('/buildings') || cleanPath.startsWith('/units')) return 'Properties';
        if (cleanPath.startsWith('/leasing')) return 'Leasing';
        if (cleanPath.startsWith('/tenants')) return 'Tenants';
        if (cleanPath.startsWith('/owners')) return 'Owners';
        if (cleanPath.startsWith('/rent') || cleanPath.startsWith('/payments') || cleanPath.startsWith('/invoices') || cleanPath.startsWith('/rent-ledger')) return 'Rent & Payments';
        if (cleanPath.startsWith('/accounting')) return 'Accounting';
        if (cleanPath.startsWith('/maintenance') || cleanPath.startsWith('/inspections') || cleanPath.startsWith('/vendors')) return 'Maintenance';
        if (cleanPath.startsWith('/reports')) return 'Reports';
        if (cleanPath.startsWith('/communication')) return 'Communication';
        if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/platform-integrations')) return 'Company Settings';
        return '';
      };

      const reqModule = getRequiredModule(location.pathname);
      if (reqModule) {
        const matchingRole = roles.find((r: any) => r.name.toLowerCase() === user.role.toLowerCase());
        if (matchingRole) {
          const permRule = matchingRole.permissions.find((p: any) => p.module === reqModule);
          if (permRule && !permRule.view) {
            hasAccess = false;
          }
        }
      }
    }
  }`;

// Clean up windows line endings and spaces
file = file.replace(targetStr, replacementStr);

fs.writeFileSync('src/routes/index.tsx', file);
console.log('ProtectedWrapper updated!');

const fs = require('fs');
let file = fs.readFileSync('src/routes/index.tsx', 'utf8');
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
// Remove from the bottom if it was appended there
file = file.replace(addBaseRoutes, '');
// And insert it right after indexRoute
file = file.replace(/(const indexRoute = createRoute\(\{[\s\S]*?\}\);)/, '$1' + addBaseRoutes);

// Also fix some leftover navigate /to links that had issues
file = file.replace(/to="\/tenants"/g, 'to="/manager/tenants"');
file = file.replace(/to: '\/tenants'/g, 'to: \'/manager/tenants\'');
file = file.replace(/navigate\('\/tenants'/g, 'navigate(\'/manager/tenants\'');

// Let's replace any single paths that were complaining
// "/manager/admin/integrations" might be missing
file = file.replace(/navigate\({ to: '\/manager\/admin\/integrations'/g, 'navigate({ to: \'/admin/integrations\'');

fs.writeFileSync('src/routes/index.tsx', file);
console.log('Fixed order!');

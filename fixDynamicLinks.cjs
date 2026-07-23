const fs = require('fs');

function replaceDynamic(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');
  let orig = file;

  file = file.replace(/\/maintenance\/requests\/\$id/g, '/manager/maintenance/requests/$id');
  file = file.replace(/\/maintenance\/work-orders\/\$id/g, '/manager/maintenance/work-orders/$id');
  file = file.replace(/\/properties\/\$id/g, '/manager/properties/$id');
  file = file.replace(/\/payments\/\$id/g, '/manager/payments/$id'); // Check if it's manager/payments or manager/rent/payments. 
  // Wait, in index.tsx I mapped /payments to /manager/payments or /manager/rent/payments? I mapped it to /manager/payments.
  file = file.replace(/\/tenants\/\$id\/edit/g, '/manager/tenants/$id/edit');
  file = file.replace(/\/tenants\/\$id/g, '/manager/tenants/$id');
  file = file.replace(/\/properties\/units\/\$id/g, '/manager/properties/units/$id');
  file = file.replace(/to: '\/staff'/g, "to: '/staff'"); // src/routes/index.tsx
  file = file.replace(/\/companies\/details/g, '/super-admin/companies/details');

  if (file !== orig) {
    fs.writeFileSync(filePath, file);
  }
}

const files = [
  'src/features/maintenance/RequestDetailsPage.tsx',
  'src/features/maintenance/WorkOrderDetailsPage.tsx',
  'src/features/properties/PropertyDetailsPage.tsx',
  'src/features/rent/PaymentDetailsPage.tsx',
  'src/features/tenants/EditTenantPage.tsx',
  'src/features/tenants/TenantDetailsPage.tsx',
  'src/features/units/UnitDetailsPage.tsx',
  'src/routes/index.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    replaceDynamic(f);
  }
});

console.log('Dynamic links fixed!');

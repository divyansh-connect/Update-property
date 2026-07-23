const fs = require('fs');

function fixDuplicates(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');
  let orig = file;

  // Replace /manager/manager/manager... with /manager
  file = file.replace(/\/manager\/manager\/manager/g, '/manager');
  file = file.replace(/\/manager\/manager/g, '/manager');
  
  // Replace /super-admin/super-admin... with /super-admin
  file = file.replace(/\/super-admin\/super-admin/g, '/super-admin');

  if (file !== orig) {
    fs.writeFileSync(filePath, file);
    console.log(`Fixed duplicates in ${filePath}`);
  }
}

// Read all files in src recursively
const path = require('path');
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixDuplicates(fullPath);
    }
  }
}

walkDir('src');
console.log('Duplicate prefixes fixed!');

const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

// Replace FormData with URLSearchParams for settings
code = code.replace(/const sheetData = new FormData\(\);/g, "const sheetData = new URLSearchParams();");

fs.writeFileSync('src/store.tsx', code);

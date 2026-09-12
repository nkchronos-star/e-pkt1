const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetStr1 = `const sheetData = new FormData();`;
const replaceStr1 = `const sheetData = new URLSearchParams();`;

if (code.includes(targetStr1)) {
   code = code.replace(targetStr1, replaceStr1);
   fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
   console.log("Replaced FormData with URLSearchParams");
}

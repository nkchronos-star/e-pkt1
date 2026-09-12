const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// Fix useEffect import
if (!code.includes('useEffect')) {
   code = code.replace(`import { useState } from 'react';`, `import { useState, useEffect } from 'react';`);
}

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx useEffect");

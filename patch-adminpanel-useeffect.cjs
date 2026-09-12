const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');
code = code.replace(`import { useState } from 'react';`, `import { useState, useEffect } from 'react';`);
fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

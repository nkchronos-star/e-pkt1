const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const targetImport = `import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2 } from 'lucide-react';`;
const replaceImport = `import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon } from 'lucide-react';`;

code = code.replace(targetImport, replaceImport);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx imports");

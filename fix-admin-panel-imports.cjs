const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

if (!code.includes("import { BorangCetakPDF }")) {
  code = code.replace(
    "import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon } from 'lucide-react';", 
    "import { LogOut, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon, FileText } from 'lucide-react';\nimport { BorangCetakPDF } from './BorangCetakPDF';"
  );
}

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

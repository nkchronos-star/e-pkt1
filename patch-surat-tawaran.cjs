const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratTawaran.tsx', 'utf8');

// Replace standard import
code = code.replace(
  "import { Candidate } from '../../types';",
  "import { Candidate } from '../../types';\nimport { useAppContext } from '../../store';"
);

// Add appContext inside the component
code = code.replace(
  "export default function SuratTawaran({ candidate }: { candidate: Candidate }) {",
  "export default function SuratTawaran({ candidate }: { candidate: Candidate }) {\n  const { settings } = useAppContext();"
);

// Replace hardcoded date with settings
code = code.replace(
  "<td className=\"py-1 font-bold\">: 03 JANUARI 2027 (AHAD)</td>",
  "<td className=\"py-1 font-bold\">: {settings.tarikhLaporDiri || '03 JANUARI 2027 (AHAD)'}</td>"
);

fs.writeFileSync('src/components/dashboard/SuratTawaran.tsx', code);

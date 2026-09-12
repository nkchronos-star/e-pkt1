const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratPanggilan.tsx', 'utf8');

// Replace standard import
code = code.replace(
  "import { Candidate } from '../../types';",
  "import { Candidate } from '../../types';\nimport { useAppContext } from '../../store';"
);

// Add appContext inside the component
code = code.replace(
  "export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {",
  "export default function SuratPanggilan({ candidate }: { candidate: Candidate }) {\n  const { settings } = useAppContext();"
);

// Replace hardcoded date with settings
code = code.replace(
  "<td className=\"py-1 font-bold\">: 8 November 2025</td>",
  "<td className=\"py-1 font-bold\">: {settings.tarikhTemuduga || '8 November 2025'}</td>"
);

fs.writeFileSync('src/components/dashboard/SuratPanggilan.tsx', code);

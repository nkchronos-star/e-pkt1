const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const target = `  const { settings, saveCandidate, firebaseUser } = useAppContext();`;
const replacement = `  const { settings, saveCandidate, firebaseUser, candidates } = useAppContext();`;

code = code.replace(target, replacement);

const target2 = `    const existingCandidate = (JSON.parse(localStorage.getItem('candidates') || '[]')).find((c: any) => c.ic === formData.ic);`;
const replacement2 = `    const existingCandidate = candidates.find((c: any) => c.ic === formData.ic);`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

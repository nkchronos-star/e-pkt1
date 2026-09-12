const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const interfaceMatch = `updateCandidate: (ic: string, data: Partial<Candidate>) => void;`;
const interfaceReplace = `updateCandidate: (ic: string, data: Partial<Candidate>) => void;\n  deleteCandidate: (ic: string) => void;`;
code = code.replace(interfaceMatch, interfaceReplace);

const implMatch = `  const updateCandidate = (ic: string, data: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => c.ic === ic ? { ...c, ...data } : c));
  };`;
const implReplace = `  const updateCandidate = (ic: string, data: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => c.ic === ic ? { ...c, ...data } : c));
  };

  const deleteCandidate = (ic: string) => {
    setCandidates(prev => prev.filter(c => c.ic !== ic));
  };`;
code = code.replace(implMatch, implReplace);

fs.writeFileSync('src/store.tsx', code);
console.log("Patched store.tsx");

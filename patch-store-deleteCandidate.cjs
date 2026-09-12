const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetProvider = `      updateCandidate,
      login,`;
const replaceProvider = `      updateCandidate,
      deleteCandidate,
      login,`;

const targetFunc = `  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {`;
const replaceFunc = `  const deleteCandidate = (ic: string) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.ic !== ic)
    }));
  };

  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {`;

if(!code.includes('const deleteCandidate = ')) {
   code = code.replace(targetFunc, replaceFunc);
}
code = code.replace(targetProvider, replaceProvider);

fs.writeFileSync('src/store.tsx', code);
console.log("Patched store.tsx for deleteCandidate");

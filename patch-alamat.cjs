const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const oldAlamat = "sheetData.append('Alamat', `${newCandidate.alamat1 || ''} ${newCandidate.alamat2 || ''}, ${newCandidate.poskod || ''} ${newCandidate.daerah || ''}, ${newCandidate.negeri || ''}`);";
const newAlamat = `sheetData.append('Alamat1', newCandidate.alamat1 || '');
      sheetData.append('Alamat2', newCandidate.alamat2 || '');
      sheetData.append('Poskod', newCandidate.poskod || '');
      sheetData.append('Daerah', newCandidate.daerah || '');
      sheetData.append('Negeri', newCandidate.negeri || '');`;

code = code.replace(oldAlamat, newAlamat);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

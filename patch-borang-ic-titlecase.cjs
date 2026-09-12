const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// The Title Case formatter we will use for sheet export
const titleCaseCode = `
  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
`;

const insertPoint = `  const [isSavingDraft, setIsSavingDraft] = useState(false);`;
code = code.replace(insertPoint, insertPoint + titleCaseCode);

// Format names before appending to sheetData
// Replace: sheetData.append('Nama', newCandidate.name || '');
// With: sheetData.append('Nama', toTitleCase(newCandidate.name || ''));
code = code.replace("sheetData.append('Nama', newCandidate.name || '');", "sheetData.append('Nama', toTitleCase(newCandidate.name || ''));");
code = code.replace("sheetData.append('Alamat1', newCandidate.alamat1 || '');", "sheetData.append('Alamat1', toTitleCase(newCandidate.alamat1 || ''));");
code = code.replace("sheetData.append('Alamat2', newCandidate.alamat2 || '');", "sheetData.append('Alamat2', toTitleCase(newCandidate.alamat2 || ''));");
code = code.replace("sheetData.append('Daerah', newCandidate.daerah || '');", "sheetData.append('Daerah', toTitleCase(newCandidate.daerah || ''));");
code = code.replace("sheetData.append('TempatLahir', newCandidate.tempatLahir || '');", "sheetData.append('TempatLahir', toTitleCase(newCandidate.tempatLahir || ''));");
code = code.replace("sheetData.append('NamaSekolahRendah', newCandidate.namaSekolahRendah || '');", "sheetData.append('NamaSekolahRendah', toTitleCase(newCandidate.namaSekolahRendah || ''));");

code = code.replace("sheetData.append('NamaBapa', newCandidate.namaBapa || '');", "sheetData.append('NamaBapa', toTitleCase(newCandidate.namaBapa || ''));");
code = code.replace("sheetData.append('PekerjaanBapa', newCandidate.pekerjaanBapa || '');", "sheetData.append('PekerjaanBapa', toTitleCase(newCandidate.pekerjaanBapa || ''));");

code = code.replace("sheetData.append('NamaIbu', newCandidate.namaIbu || '');", "sheetData.append('NamaIbu', toTitleCase(newCandidate.namaIbu || ''));");
code = code.replace("sheetData.append('PekerjaanIbu', newCandidate.pekerjaanIbu || '');", "sheetData.append('PekerjaanIbu', toTitleCase(newCandidate.pekerjaanIbu || ''));");

// Append file URLs to sheetData (just after UPKK_Ibadah)
const fileAppends = `      sheetData.append('UPKK_Ibadah', newCandidate.upkk?.ibadah || '');
      sheetData.append('URL_Gambar_Calon', newCandidate.gambarUrl || '');
      sheetData.append('URL_Slip_PBD', newCandidate.pbd?.slipUrl || '');
      sheetData.append('URL_Slip_PBD_D6', newCandidate.pbdD6?.slipUrl || '');
      sheetData.append('URL_Slip_UPKK', newCandidate.upkk?.slipUrl || '');`;
code = code.replace("      sheetData.append('UPKK_Ibadah', newCandidate.upkk?.ibadah || '');", fileAppends);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx with Title Case and File URLs");

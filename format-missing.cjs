const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const missingFuncStr = `    let missing = [];
    for (const field of requiredFields) {
      if (!formData[field as keyof Candidate]) missing.push(field);
    }`;

const missingFuncReplace = `    let missing: string[] = [];
    const fieldNames: Record<string, string> = {
      name: 'Nama Penuh', ic: 'No. KP', noSijilLahir: 'No. Sijil Lahir', tarikhLahir: 'Tarikh Lahir', tempatLahir: 'Tempat Lahir', jantina: 'Jantina',
      alamat1: 'Alamat Rumah 1', poskod: 'Poskod', daerah: 'Daerah', negeri: 'Negeri', namaSekolahRendah: 'Sekolah Rendah',
      namaBapa: 'Nama Bapa', icBapa: 'No. KP Bapa', warganegaraBapa: 'Warganegara Bapa', alamatBapa1: 'Alamat Bapa 1', poskodBapa: 'Poskod Bapa', daerahBapa: 'Daerah Bapa', negeriBapa: 'Negeri Bapa', pekerjaanBapa: 'Pekerjaan Bapa', telefonBapa: 'No. Telefon Bapa',
      namaIbu: 'Nama Ibu', icIbu: 'No. KP Ibu', warganegaraIbu: 'Warganegara Ibu', alamatIbu1: 'Alamat Ibu 1', poskodIbu: 'Poskod Ibu', daerahIbu: 'Daerah Ibu', negeriIbu: 'Negeri Ibu', pekerjaanIbu: 'Pekerjaan Ibu', telefonIbu: 'No. Telefon Ibu'
    };
    for (const field of requiredFields) {
      if (!formData[field as keyof Candidate]) missing.push(fieldNames[field] || field);
    }`;

code = code.replace(missingFuncStr, missingFuncReplace);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Formatted missing labels");

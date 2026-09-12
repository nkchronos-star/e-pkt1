const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetSync = `            const sheetData = new FormData();
            sheetData.append('Action', 'UPDATE');
            sheetData.append('IC_Calon', c.ic);
            sheetData.append('Nama_Calon', c.name);
            sheetData.append('Jantina', c.jantina || '');
            sheetData.append('Markah_Hafazan', c.markahTahfiz?.hafazan?.toString() || '');
            sheetData.append('Markah_Tilawah', c.markahTahfiz?.tilawah?.toString() || '');
            sheetData.append('Markah_Sahsiah', c.markahTahfiz?.sahsiah?.toString() || '');
            sheetData.append('Jumlah_Markah_Tahfiz', c.markahTahfiz?.jumlah?.toString() || '');
            sheetData.append('Markah_BM', c.markahAkademik?.bm?.toString() || '');
            sheetData.append('Markah_BI', c.markahAkademik?.bi?.toString() || '');
            sheetData.append('Markah_Sains', c.markahAkademik?.sains?.toString() || '');
            sheetData.append('Markah_Math', c.markahAkademik?.matematik?.toString() || '');
            sheetData.append('Jumlah_Markah_Akademik', c.markahAkademik?.jumlah?.toString() || '');
            sheetData.append('Status_Layak_Temuduga', c.statusTemuduga || '');
            sheetData.append('Status_Akhir_Tawaran', c.statusTawaran || '');
            sheetData.append('Maklum_Balas_Terima', c.maklumBalasTawaran || '');`;

const replacementSync = `            const sheetData = new FormData();
            sheetData.append('Action', 'UPDATE');
            sheetData.append('IC_Calon', c.ic);
            sheetData.append('Nama_Calon', c.name);
            sheetData.append('Jantina', c.jantina || '');
            sheetData.append('Jumlah_Markah_Tahfiz', c.markahTahfiz?.jumlah?.toString() || '');
            sheetData.append('Catatan_Tahfiz', c.markahTahfiz?.catatan || '');
            sheetData.append('Penilai_Tahfiz', c.markahTahfiz?.dinilaiOleh || '');
            sheetData.append('Jumlah_Markah_Akademik', c.markahAkademik?.jumlah?.toString() || '');
            sheetData.append('Catatan_Akademik', c.markahAkademik?.catatan || '');
            sheetData.append('Penilai_Akademik', c.markahAkademik?.dinilaiOleh || '');
            sheetData.append('Status_Layak_Temuduga', c.statusTemuduga || '');
            sheetData.append('Status_Akhir_Tawaran', c.statusTawaran || '');
            sheetData.append('Maklum_Balas_Terima', c.maklumBalasTawaran || '');`;

code = code.replace(targetSync, replacementSync);
fs.writeFileSync('src/store.tsx', code);
console.log('Patched store.tsx auto-sync to match new schema');

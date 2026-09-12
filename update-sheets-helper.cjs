const fs = require('fs');

let storeCode = fs.readFileSync('src/store.tsx', 'utf8');

const newUpdateCandidate = `
  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    setState(prev => {
      const newCandidates = prev.candidates.map(c => c.ic === ic ? { ...c, ...data } : c);
      
      // Auto-sync logic for Google Sheets Tab 2 (Keputusan_Temuduga)
      // Only triggered if there is an update that affects Tab 2 (like marks or status)
      if (data.markahTahfiz || data.markahAkademik || data.statusTemuduga || data.statusTawaran || data.maklumBalasTawaran) {
         const c = newCandidates.find(can => can.ic === ic);
         if (c) {
            const sheetData = new FormData();
            sheetData.append('Action', 'UPDATE');
            sheetData.append('IC_Calon', c.ic);
            sheetData.append('Nama_Calon', c.name);
            sheetData.append('Jantina', c.jantina || '');
            sheetData.append('Markah_Hafazan', c.markahTahfiz?.hafazan?.toString() || '');
            sheetData.append('Markah_Tilawah', c.markahTahfiz?.tilawah?.toString() || '');
            sheetData.append('Markah_Sahsiah', c.markahTahfiz?.sahsiah?.toString() || '');
            sheetData.append('Jumlah_Markah_Tahfiz', c.markahTahfiz?.jumlah?.toString() || '');
            sheetData.append('Status_Layak_Temuduga', c.statusTemuduga || '');
            sheetData.append('Status_Akhir_Tawaran', c.statusTawaran || '');
            sheetData.append('Maklum_Balas_Terima', c.maklumBalasTawaran || '');

            fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
               method: 'POST',
               body: sheetData
            }).catch(e => console.error("Auto-sync error", e));
         }
      }

      return {
        ...prev,
        candidates: newCandidates
      };
    });
  };
`;

storeCode = storeCode.replace(/  const updateCandidate = \(ic: string, data: Partial<Candidate>\) => {[\s\S]*?  };/, newUpdateCandidate);

fs.writeFileSync('src/store.tsx', storeCode);

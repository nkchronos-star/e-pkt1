const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetState = `  const [formData, setFormData] = useState<Partial<Candidate>>(() => {
    const saved = localStorage.getItem('borang_draft');
    if (saved) return JSON.parse(saved);
    return {
      jantina: '',
      pbd: { bm: '', bi: '', matematik: '', sains: '' },
      pbdD6: { bm: '', bi: '', matematik: '', sains: '' },
      upkk: { alquran: '', akidah: '', sirah: '', adab: '', jawikhat: '', bahasaarab: '', ibadah: '', penghayatancarahidupislam: '', amalisolat: '' }
    };
  });`;

const replacementState = `  const [formData, setFormData] = useState<Partial<Candidate>>(() => {
    const saved = localStorage.getItem('borang_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Gagal memuatkan draf borang, mungkin data rosak', e);
      }
    }
    return {
      jantina: '',
      pbd: { bm: '', bi: '', matematik: '', sains: '' },
      pbdD6: { bm: '', bi: '', matematik: '', sains: '' },
      upkk: { alquran: '', akidah: '', sirah: '', adab: '', jawikhat: '', bahasaarab: '', ibadah: '', penghayatancarahidupislam: '', amalisolat: '' }
    };
  });`;

if (code.includes(`if (saved) return JSON.parse(saved);`)) {
  code = code.replace(targetState, replacementState);
  fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
  console.log("Patched Borang.tsx JSON.parse.");
} else {
  console.log("Could not find the target code block.");
}

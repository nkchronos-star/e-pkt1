const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetStorage = `  // Auto save draft
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem('borang_draft', JSON.stringify(formData));
    }
  }, [formData, submitted]);`;

const replacementStorage = `  // Auto save draft
  useEffect(() => {
    if (!submitted) {
      try {
        // Create a copy of formData without large images for local draft to avoid QuotaExceededError
        const draftData = { ...formData };
        if (draftData.gambarUrl && draftData.gambarUrl.length > 500000) draftData.gambarUrl = ''; // strip large image
        if (draftData.pbd && draftData.pbd.slipUrl && draftData.pbd.slipUrl.length > 500000) draftData.pbd.slipUrl = '';
        if (draftData.pbdD6 && draftData.pbdD6.slipUrl && draftData.pbdD6.slipUrl.length > 500000) draftData.pbdD6.slipUrl = '';
        if (draftData.upkk && draftData.upkk.slipUrl && draftData.upkk.slipUrl.length > 500000) draftData.upkk.slipUrl = '';
        
        localStorage.setItem('borang_draft', JSON.stringify(draftData));
      } catch (e) {
        console.warn('Gagal menyimpan draf ke localStorage (saiz fail mungkin terlalu besar)', e);
      }
    }
  }, [formData, submitted]);`;

if (code.includes('localStorage.setItem(\'borang_draft\'')) {
  code = code.replace(targetStorage, replacementStorage);
  fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
  console.log("Patched Borang.tsx for localStorage quota limits.");
} else {
  console.log("Could not find the target code block.");
}

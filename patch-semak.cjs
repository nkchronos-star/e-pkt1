const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const target = `  const handleMaklumBalas = (status: 'TERIMA' | 'TOLAK') => {
    if (result) {
      updateCandidate(result.ic, { maklumBalasTawaran: status });
      setResult({ ...result, maklumBalasTawaran: status });
      setShowPopup(false);
    }
  };`;

const replace = `  const handleMaklumBalas = (status: 'TERIMA' | 'TOLAK') => {
    if (result) {
      const updated = { ...result, maklumBalasTawaran: status };
      updateCandidate(result.ic, { maklumBalasTawaran: status });
      setResult(updated);
      setShowPopup(false);
      
      if (status === 'TOLAK') {
        alert('Anda telah memilih untuk MENOLAK tawaran ini.');
      } else {
        alert('Tahniah! Anda telah MENERIMA tawaran ini.');
      }
    }
  };`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);

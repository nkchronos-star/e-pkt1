const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

code = code.replace(/settings\.borangPendaftaranUrl/g, 'settings.borangTingkatan1Link');

fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
console.log("Patched SemakTawaran.tsx");

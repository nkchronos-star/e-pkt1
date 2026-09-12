const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(
  "console.warn('Sync warning:', e.message); alert('Ralat penyelarasan: Tidak dapat berhubung dengan pangkalan data. Sila periksa sambungan internet atau AdBlocker anda.')",
  "{ console.warn('Sync warning:', e.message); alert('Ralat penyelarasan: Tidak dapat berhubung dengan pangkalan data. Sila periksa sambungan internet atau AdBlocker anda.'); }"
);

fs.writeFileSync('src/store.tsx', code);

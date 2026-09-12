const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// replace bg-slate-100 with bg-[#f4f7ed] or similar light greenish yellow
code = code.replace('bg-slate-100 text-slate-800', 'bg-[#f4f7ee] text-slate-800');

fs.writeFileSync('src/App.tsx', code);

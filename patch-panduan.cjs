const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Panduan.tsx', 'utf8');

const target = `<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>Slip PBD (Akhir Tahun Thn 5)</li>`;
const replace = `<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>Slip PBD (Akhir Tahun Thn 5) & Pertengahan Tahun Thn 6</li>`;

if (code.includes(target)) {
   code = code.replace(target, replace);
   fs.writeFileSync('src/components/dashboard/Panduan.tsx', code);
   console.log("Patched Panduan");
}

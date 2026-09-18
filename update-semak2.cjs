const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const t1 = `<div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-8 animate-in zoom-in duration-300 shadow-inner">`;
const r1 = `<div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-8 animate-in zoom-in duration-300 shadow-inner no-print">`;

if (code.includes(t1)) code = code.replace(t1, r1);

fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
console.log("Success");

const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const t1 = `<div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-8 md:p-12 text-center relative overflow-hidden">`;
const r1 = `<div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-8 md:p-12 text-center relative overflow-hidden print:p-0 print:shadow-none print:border-none print:overflow-visible print:bg-transparent">`;

const t2 = `<div className="mt-12">`;
const r2 = `<div className="mt-12 print:mt-0">`;

if (code.includes(t1)) code = code.replace(t1, r1);
if (code.includes(t2)) code = code.replace(t2, r2);

fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
console.log("Success");

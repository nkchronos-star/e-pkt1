const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const target = `<button onClick={() => window.print()} className="flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                             <Printer className="w-10 h-10" />
                             <span className="font-bold text-sm tracking-wide text-center">1. CETAK<br/>SURAT TAWARAN</span>
                           </button>`;

const replacement = `<div className="flex flex-col items-center w-full">
                             <button onClick={() => window.print()} className="w-full h-full flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                               <Printer className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">1. CETAK<br/>SURAT TAWARAN</span>
                             </button>
                             <p className="text-[10.5px] leading-tight text-slate-500 mt-2 text-center font-medium opacity-80 no-print">
                               * Jika butang tidak berfungsi di ruang ini, tekan kekunci <kbd className="bg-slate-200 px-1 py-0.5 rounded text-black font-sans">Ctrl+P</kbd> atau buka sistem ini di tab/tetingkap baharu.
                             </p>
                           </div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
    console.log("Success");
} else {
    console.log("Target not found");
}

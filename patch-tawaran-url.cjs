const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const oldButton = `<button onClick={() => alert('Borang Maklumat Murid & Borang Asrama (PDF) akan dimuat turun. Anda boleh memautkan fail PDF sebenar kelak.')} className="flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                             <Download className="w-10 h-10" />
                             <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                           </button>`;

const newButton = `{settings.borangPendaftaranUrl ? (
                             <a href={settings.borangPendaftaranUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                               <Download className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                             </a>
                           ) : (
                             <button onClick={() => alert('Maaf, pautan borang belum dikemaskini oleh pihak sekolah.')} className="flex flex-col items-center justify-center gap-3 no-print text-slate-400 p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 cursor-not-allowed">
                               <Download className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                             </button>
                           )}`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);

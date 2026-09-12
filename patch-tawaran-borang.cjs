const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

// Ensure Download icon is imported
if (!code.includes('Download')) {
  code = code.replace(/import { Search, Info, CheckCircle, XCircle, Clock, Printer } from 'lucide-react';/, "import { Search, Info, CheckCircle, XCircle, Clock, Printer, Download, FileText } from 'lucide-react';");
}

const oldTerimaUI = `<div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-8 animate-in zoom-in duration-300 shadow-inner">
                         <h3 className="font-extrabold text-xl text-slate-900 mb-3">Anda Telah Menerima Tawaran Ini</h3>
                         <p className="text-emerald-700 font-medium mb-8">
                           Sila bawa Semua Dokumen Semasa Pendaftaran Masuk Tingkatan 1 Tahun 2027 pada <strong className="bg-emerald-100 px-2 py-0.5 rounded">3 Januari 2027</strong>
                         </p>
                         <button onClick={() => window.print()} className="mx-auto flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                           <Printer className="w-10 h-10" />
                           <span className="font-bold text-sm tracking-wide">CETAK / SIMPAN SURAT TAWARAN</span>
                         </button>
                      </div>`;

const newTerimaUI = `<div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-8 animate-in zoom-in duration-300 shadow-inner">
                         <h3 className="font-extrabold text-xl text-slate-900 mb-3">Anda Telah Menerima Tawaran Ini</h3>
                         <p className="text-emerald-700 font-medium mb-8 leading-relaxed max-w-xl mx-auto">
                           Sila cetak <strong>Surat Tawaran</strong> dan lengkapkan <strong>Borang Maklumat Murid & Borang Asrama</strong> di bawah. <br/>Bawa dokumen-dokumen ini semasa hari pendaftaran pada <strong className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">3 Januari 2027</strong>.
                         </p>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                           <button onClick={() => window.print()} className="flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                             <Printer className="w-10 h-10" />
                             <span className="font-bold text-sm tracking-wide text-center">1. CETAK<br/>SURAT TAWARAN</span>
                           </button>
                           
                           <button onClick={() => alert('Borang Maklumat Murid & Borang Asrama (PDF) akan dimuat turun. Anda boleh memautkan fail PDF sebenar kelak.')} className="flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                             <Download className="w-10 h-10" />
                             <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                           </button>
                         </div>
                      </div>`;

if (code.includes('CETAK / SIMPAN SURAT TAWARAN')) {
    code = code.replace(oldTerimaUI, newTerimaUI);
    fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find text to replace");
}

const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

const targetInfo = `Info SMAG3
            <a href="https://tinyurl.com/y5h7jxxx" target="_blank" rel="noopener noreferrer" className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 flex items-center gap-1 font-bold transition border border-emerald-200">
              <ExternalLink className="w-4 h-4" />
              Pautan Info
            </a>
          </h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px] shadow-inner border border-slate-200">
            <img src="/infografik.png" alt="Infografik SMAG3" className="absolute inset-0 w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer" onClick={() => window.open('https://tinyurl.com/y5h7jxxx', '_blank')} />
            
            {/* Fallback jika gambar tiada */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none opacity-50">
               <span className="text-sm font-medium">Sila layari pautan Info SMAG3</span>
            </div>`;

const newInfo = `Info SMAG3
            <a href="https://www.facebook.com/SMAKG03/" target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1 font-bold transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              Facebook
            </a>
          </h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px] shadow-inner border border-slate-200">
            <img src="https://drive.google.com/uc?export=view&id=16H5IrMcnjppOwvxH4NSPjE9NhiIm07ku" alt="Infografik SMAG3" className="absolute inset-0 w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer" onClick={() => window.open('https://tinyurl.com/y5h7jxxx', '_blank')} referrerPolicy="no-referrer" />
            
            {/* Fallback jika gambar tiada */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none -z-10">
               <span className="text-sm font-medium">Memuatkan infografik...</span>
            </div>`;

if (code.includes('https://tinyurl.com/y5h7jxxx" target="_blank"')) {
    code = code.replace(targetInfo, newInfo);
    fs.writeFileSync('src/components/dashboard/Utama.tsx', code);
    console.log('Patched Utama.tsx to restore Facebook and load Drive image');
} else {
    console.log('Target not found');
}

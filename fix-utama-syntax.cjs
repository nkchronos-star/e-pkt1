const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

const regex = /<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Card 3: Infografik \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

code = code.replace(regex, `      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card: Video Korporat */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-red-600 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Video Korporat</h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative min-h-[300px] shadow-inner">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/HrysVVSgNYs?si=HrysVVSgNYs" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>

        {/* Card: Infografik */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-amber-500 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Info SMAG3</h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px] shadow-inner border border-slate-200">
            <img src="/infografik.png" alt="Infografik SMAG3" className="absolute inset-0 w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer" onClick={() => window.open('/infografik.png', '_blank')} />
            
            {/* Fallback jika gambar tiada */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none opacity-50">
               <span className="text-sm">Gambar infografik.png</span>
               <span className="text-xs mt-1">Sila upload ke folder 'public'</span>
            </div>
          </div>
        </div>
      </div>`);

fs.writeFileSync('src/components/dashboard/Utama.tsx', code);

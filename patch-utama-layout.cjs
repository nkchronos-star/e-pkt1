const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

const updatedGrid = `      {/* Top Section: Pengenalan */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-emerald-700 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Pengenalan</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm">
          <p>
            Matlamat utama pelaksanaan Kurikulum Bersepadu Tahfiz (KBT) di SMAG3 adalah untuk melahirkan golongan profesional, teknokrat dan usahawan hafiz yang mengamalkan ajaran Islam (mutadayyin) dan memiliki pelbagai kemahiran ilmu selaras dengan Falsafah Pendidikan Negara.
          </p>
          <p className="font-bold text-slate-800 pt-2">Pelaksanaan KBT diharap dapat melahirkan:</p>
          <ol className="list-decimal list-outside ml-5 space-y-2">
            <li>Menghafaz 30 juzuk Al-Quran.</li>
            <li>Profesional dengan asas keagamaan mantap berlandaskan Al-Quran dan Al-Sunnah.</li>
            <li>Memaksimumkan keupayaan berfikir aras tinggi, kreatif dan inovatif.</li>
            <li>Hubungan baik dengan Allah, manusia dan alam sekitar.</li>
          </ol>
        </div>
      </div>

      {/* Middle Grid: Video & Infografik bersebelahan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
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
      </div>`;

// Replace the old 3-column grid block
code = code.replace(/<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/, updatedGrid);

fs.writeFileSync('src/components/dashboard/Utama.tsx', code);

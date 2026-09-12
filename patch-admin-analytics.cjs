const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const analyticsCode = `
       {/* Analisa Penerimaan Tawaran */}
       <section>
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6 mt-16">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analisa Penerimaan Tawaran</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">Jumlah Ditawarkan</div>
              <div className="text-4xl font-extrabold text-blue-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA').length}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center">
              <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Diterima</div>
              <div className="text-4xl font-extrabold text-emerald-600">{candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center">
              <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
              <div className="text-4xl font-extrabold text-red-600">{candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center">
              <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-xs">Belum Maklum Balas</div>
              <div className="text-4xl font-extrabold text-amber-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran).length}</div>
            </div>
         </div>
       </section>

       {/* Pengurusan Infografik */}
`;

code = code.replace("{/* Pengurusan Infografik */}", analyticsCode.trim());

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

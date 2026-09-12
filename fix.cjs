const fs = require('fs');
let lines = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8').split('\n');

// Replace lines 296 to 307 (0-indexed 295 to 306)
lines.splice(295, 12, `           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 gap-4 mt-2">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">Maklumat Bapa</h3>
              <div className="flex gap-3 text-xs flex-wrap">
                 <button type="button" onClick={copyAddressToBapa} className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition">Salin Alamat Pemohon</button>
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input type="checkbox" checked={tiadaBapa} onChange={(e) => handleTiadaBapa(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" /> Tiada Maklumat
                 </label>
              </div>
           </div>
           <div className={tiadaBapa ? 'hidden' : 'block'}>`);

fs.writeFileSync('src/components/dashboard/Borang.tsx', lines.join('\n'));

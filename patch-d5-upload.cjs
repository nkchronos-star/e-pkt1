const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetStr = `              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                 {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}</label>
                       <select name={\`pbd.\${sub}\`} value={(formData.pbd as any)?.[sub] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">Pilih TP</option>
                          {[1,2,3,4,5,6].map(tp => <option key={tp} value={\`TP\${tp}\`}>TP {tp}</option>)}
                       </select>
                    </div>
                 ))}
              </div>`;

const replaceStr = `              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}</label>
                       <select name={\`pbd.\${sub}\`} value={(formData.pbd as any)?.[sub] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">Pilih TP</option>
                          {[1,2,3,4,5,6].map(tp => <option key={tp} value={\`TP\${tp}\`}>TP {tp}</option>)}
                       </select>
                    </div>
                 ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center mb-10">
                 {formData.pbd?.slipUrl && (
                   <img src={formData.pbd?.slipUrl} alt="Slip PBD 5" className="max-h-40 object-contain rounded-xl mb-4" />
                 )}
                 <label className="text-sm font-bold text-slate-700 mb-2">Muat Naik Slip Peperiksaan PBD / Slip Darjah 5</label>
                 <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'slipUrl', 'pbd')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
                 <p className="mt-2 text-xs text-slate-400">Gambar atau fail PDF (Maks 2MB)</p>
              </div>`;

if(code.includes(targetStr)) {
   code = code.replace(targetStr, replaceStr);
   fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
   console.log("Added slip upload for Darjah 5");
} else {
   console.log("Could not find Darjah 5 section");
}

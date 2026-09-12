const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const oldState = `pbd: { bm: '', bi: '', matematik: '', sains: '' },`;
const newState = `pbd: { bm: '', bi: '', matematik: '', sains: '' },
      pbdD6: { bm: '', bi: '', matematik: '', sains: '' },`;
code = code.replace(oldState, newState);

const oldValidate = `if (!formData.pbd?.bm || !formData.pbd?.bi || !formData.pbd?.matematik || !formData.pbd?.sains) return false;`;
const newValidate = `if (!formData.pbd?.bm || !formData.pbd?.bi || !formData.pbd?.matematik || !formData.pbd?.sains) return false;
    if (!formData.pbdD6?.bm || !formData.pbdD6?.bi || !formData.pbdD6?.matematik || !formData.pbdD6?.sains) return false;`;
code = code.replace(oldValidate, newValidate);

const oldSheets = `sheetData.append('PBD_Sains', newCandidate.pbd?.sains || '');`;
const newSheets = `sheetData.append('PBD_Sains', newCandidate.pbd?.sains || '');
      sheetData.append('PBD_D6_BM', newCandidate.pbdD6?.bm || '');
      sheetData.append('PBD_D6_BI', newCandidate.pbdD6?.bi || '');
      sheetData.append('PBD_D6_Math', newCandidate.pbdD6?.matematik || '');
      sheetData.append('PBD_D6_Sains', newCandidate.pbdD6?.sains || '');`;
code = code.replace(oldSheets, newSheets);

const oldHTML = `<h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">a. Keputusan PBD (Akhir Tahun Darjah 5)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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

const newHTML = `<h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">a. Keputusan PBD (Akhir Tahun Darjah 5)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
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

              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">b. Keputusan PBD (Pertengahan Tahun Darjah 6)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                 {['bm', 'bi', 'matematik', 'sains'].map((sub) => (
                    <div key={sub} className="flex items-center justify-between border-b border-slate-100 pb-3">
                       <label className="text-sm font-bold text-slate-700 uppercase">{sub === 'bm' ? 'Bahasa Melayu' : sub === 'bi' ? 'Bahasa Inggeris' : sub}</label>
                       <select name={\`pbdD6.\${sub}\`} value={(formData.pbdD6 as any)?.[sub] || ''} onChange={handleChange} className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white w-32 appearance-none" required>
                          <option value="">Pilih TP</option>
                          {[1,2,3,4,5,6].map(tp => <option key={tp} value={\`TP\${tp}\`}>TP {tp}</option>)}
                       </select>
                    </div>
                 ))}
              </div>`;

code = code.replace(oldHTML, newHTML);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

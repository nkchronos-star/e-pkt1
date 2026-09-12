const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const maklumatBapaSearch = '<h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">Maklumat Bapa</h3>';
const maklumatBapaReplace = `
           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 gap-4 mt-2">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">Maklumat Bapa</h3>
              <div className="flex gap-3 text-xs flex-wrap">
                 <button type="button" onClick={copyAddressToBapa} className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition">Salin Alamat Pemohon</button>
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input type="checkbox" checked={tiadaBapa} onChange={(e) => handleTiadaBapa(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" /> Tiada Maklumat
                 </label>
              </div>
           </div>
           <div className={tiadaBapa ? 'hidden' : 'block'}>
`;

const maklumatIbuSearch = '<h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">Maklumat Ibu</h3>';
const maklumatIbuReplace = `
           </div>
           
           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 gap-4 mt-8">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-sm">Maklumat Ibu</h3>
              <div className="flex gap-3 text-xs flex-wrap">
                 <button type="button" onClick={copyAddressToIbu} className="bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-emerald-700 hover:bg-emerald-50 transition">Salin Alamat Pemohon</button>
                 <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition">
                    <input type="checkbox" checked={tiadaIbu} onChange={(e) => handleTiadaIbu(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" /> Tiada Maklumat
                 </label>
              </div>
           </div>
           <div className={tiadaIbu ? 'hidden' : 'block'}>
`;

const bahagianCSearch = '{/* Bahagian C */}';
const bahagianCReplace = `
           </div>
        </div>

        {/* Bahagian C */}
`;

// Clean up the trailing </div> from Bahagian B that is now handled
const finalDivSearch = '</div>\n        {/* Bahagian C */}';

if (code.includes(maklumatBapaSearch)) {
    code = code.replace(maklumatBapaSearch, maklumatBapaReplace);
    code = code.replace(maklumatIbuSearch, maklumatIbuReplace);
    code = code.replace(finalDivSearch, '</div>' + bahagianCReplace.replace('{/* Bahagian C */}', '{/* Bahagian C */}')); // just insert </div> manually
    
    // Better way to close Ibu div:
    code = code.replace('              </div>\n           </div>\n        </div>\n        {/* Bahagian C */}', '              </div>\n           </div>\n           </div>\n        </div>\n        {/* Bahagian C */}');

    fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
    console.log("Successfully replaced");
} else {
    console.log("Search string not found!");
}

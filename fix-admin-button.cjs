const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// I will just pull out the block from the component, fix it, and replace.
// Let's use string operations.
let top = code.substring(0, code.indexOf('                           {settings.tandatanganPengetua && <img src={settings.tandatanganPengetua} alt="Tandatangan" className="mt-2 h-10 object-contain border border-slate-200 p-1 bg-white rounded" />}'));
let bottom = code.substring(code.indexOf('       {activeTab === \'KRITERIA\' && ('));

// Find what's in between
const originalMid = code.substring(top.length, code.length - bottom.length);

const correctMid = `                           {settings.tandatanganPengetua && <img src={settings.tandatanganPengetua} alt="Tandatangan" className="mt-2 h-10 object-contain border border-slate-200 p-1 bg-white rounded" />}
                        </div>
                     </div>
                  </div>
           </div>
           
           <div className="flex justify-end pt-4 mt-6">
              <button onClick={syncSettingsToServer} className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">Simpan Semua Tetapan Sistem</button>
           </div>
         </div>
       )}
`;

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', top + correctMid + bottom);

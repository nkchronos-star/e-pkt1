const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const oldSettingsField = `<div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tarikh Lapor Diri Asrama / Pendaftaran (Tawaran)</label>
                            <input type="text" name="tarikhLaporDiri" value={settings.tarikhLaporDiri || ''} onChange={handleSettingsChange} className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 bg-white" placeholder="Cth: 3 Januari 2027" />
                          </div>`;

const newSettingsField = `<div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tarikh Lapor Diri Asrama / Pendaftaran (Tawaran)</label>
                            <input type="text" name="tarikhLaporDiri" value={settings.tarikhLaporDiri || ''} onChange={handleSettingsChange} className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 bg-white" placeholder="Cth: 3 Januari 2027" />
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Pautan (URL) Borang Maklumat Murid & Asrama</label>
                            <input type="url" name="borangPendaftaranUrl" value={settings.borangPendaftaranUrl || ''} onChange={handleSettingsChange} className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 bg-white" placeholder="Cth: https://drive.google.com/file/d/..." />
                            <p className="text-xs text-slate-500 mt-2">Letakkan URL fail PDF di Google Drive atau mana-mana link yang membolehkan ibu bapa memuat turun borang tersebut apabila mereka menerima tawaran.</p>
                          </div>`;

code = code.replace(oldSettingsField, newSettingsField);
fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

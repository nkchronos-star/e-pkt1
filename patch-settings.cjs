const fs = require('fs');

let storeCode = fs.readFileSync('src/store.tsx', 'utf8');
storeCode = storeCode.replace(
  "maklumatSekolah: {",
  "namaPengetua?: string;\n  tandatanganPengetua?: string;\n  maklumatSekolah: {"
);
storeCode = storeCode.replace(
  "temudugaBuka: true,",
  "temudugaBuka: true,\n    namaPengetua: 'EN. ABDUL RAHIM BIN KASIM',\n    tandatanganPengetua: '',"
);
fs.writeFileSync('src/store.tsx', storeCode);

let adminCode = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const additionalInputs = `
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                     <h4 className="font-semibold text-slate-800 mb-4">Maklumat Pengetua (Untuk Surat)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pengetua</label>
                          <input type="text" name="namaPengetua" value={settings.namaPengetua || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Tandatangan Pengetua (Muat Naik Imej)</label>
                          <input type="file" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                      const base64String = reader.result as string;
                                      setSettings(prev => ({ ...prev, tandatanganPengetua: base64String }));
                                  };
                                  reader.readAsDataURL(file);
                              }
                          }} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-emerald-50 file:text-emerald-700" />
                          {settings.tandatanganPengetua && <img src={settings.tandatanganPengetua} alt="Tandatangan" className="mt-2 h-10 object-contain border border-slate-200 p-1 bg-white rounded" />}
                        </div>
                     </div>
                  </div>
`;

adminCode = adminCode.replace(
  '</div>\n                  <div className="mt-6">',
  '</div>' + additionalInputs + '\n                  <div className="mt-6">'
);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', adminCode);

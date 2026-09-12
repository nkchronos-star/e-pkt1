const fs = require('fs');

// 1. Fix types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
if (!typesCode.includes('namaPengetua?: string;')) {
  typesCode = typesCode.replace('borangPendaftaranUrl?: string;', 'borangPendaftaranUrl?: string;\n  namaPengetua?: string;\n  tandatanganPengetua?: string;\n  sesiKemasukan?: string;');
  fs.writeFileSync('src/types.ts', typesCode);
}

// 2. Fix store.tsx
let storeCode = fs.readFileSync('src/store.tsx', 'utf8');
if (!storeCode.includes("sesiKemasukan: '2026/2027'")) {
  storeCode = storeCode.replace('borangBuka: true,', "borangBuka: true,\n  sesiKemasukan: '2026/2027',\n  namaPengetua: '',\n  tandatanganPengetua: '',");
  fs.writeFileSync('src/store.tsx', storeCode);
}

// 3. Fix AdminPanel.tsx (setSettings -> updateSettings)
let adminCode = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');
adminCode = adminCode.replace(/setSettings\(/g, 'updateSettings(');

// Add input for sesiKemasukan
if (!adminCode.includes('Sesi Kemasukan')) {
  const insertSesi = `
             <div className="md:col-span-2 mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Sesi Kemasukan (Cth: 2026/2027)</label>
                <input type="text" name="sesiKemasukan" value={settings.sesiKemasukan || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
             </div>
  `;
  adminCode = adminCode.replace('<h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Settings className="w-6 h-6 text-slate-500" /> Tetapan Paparan Tarikh & Sistem</h3>', '<h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Settings className="w-6 h-6 text-slate-500" /> Tetapan Paparan Tarikh & Sistem</h3>\n' + insertSesi);
  fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', adminCode);
}

// 4. Fix App.tsx (Make Sesi Kemasukan dynamic)
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('Sesi Kemasukan 2026/2027', '{settings?.sesiKemasukan || \'Sesi Kemasukan 2026/2027\'}');
fs.writeFileSync('src/App.tsx', appCode);

// 5. Fix Borang.tsx
let borangCode = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');
borangCode = borangCode.replace("statusTawaran: 'MENUNGGU'", "statusTawaran: 'DALAM_PERTIMBANGAN'");
// Fix handleTiadaBapa call
borangCode = borangCode.replace(/onChange=\{handleTiadaBapa\}/g, "onChange={(e) => handleTiadaBapa(e as any)}");
borangCode = borangCode.replace(/onChange=\{handleTiadaIbu\}/g, "onChange={(e) => handleTiadaIbu(e as any)}");
// Check boolean problem
borangCode = borangCode.replace(/onChange=\{e => handleTiadaBapa\(e\.target\.checked\)\}/g, "onChange={(e) => handleTiadaBapa(e as any)}");
borangCode = borangCode.replace(/onChange=\{e => handleTiadaIbu\(e\.target\.checked\)\}/g, "onChange={(e) => handleTiadaIbu(e as any)}");

fs.writeFileSync('src/components/dashboard/Borang.tsx', borangCode);

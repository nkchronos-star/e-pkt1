const fs = require('fs');

let adminCode = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');
adminCode = adminCode.replace("updateSettings(prev => ({ ...prev, tandatanganPengetua: base64String }));", "updateSettings({ tandatanganPengetua: base64String });");
fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', adminCode);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace("{settings?.sesiKemasukan || 'Sesi Kemasukan 2026/2027'}", "Sesi Kemasukan 2026/2027");
appCode = appCode.replace("const { settings, userRole, firebaseUser } = useAppContext();", "const { settings, userRole, firebaseUser } = useAppContext();\n  const sesiKemasukan = settings?.sesiKemasukan || 'Sesi Kemasukan 2026/2027';");
appCode = appCode.replace("Sesi Kemasukan 2026/2027", "{sesiKemasukan}");
fs.writeFileSync('src/App.tsx', appCode);

let borangCode = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');
borangCode = borangCode.replace(/handleTiadaBapa\\(e\\.target\\.checked as any\\)/g, "handleTiadaBapa(e as any)");
borangCode = borangCode.replace(/handleTiadaIbu\\(e\\.target\\.checked as any\\)/g, "handleTiadaIbu(e as any)");
borangCode = borangCode.replace(/e => handleTiadaBapa\\(e\\.target\\.checked\\)/g, "(e) => handleTiadaBapa(e as any)");
borangCode = borangCode.replace(/e => handleTiadaIbu\\(e\\.target\\.checked\\)/g, "(e) => handleTiadaIbu(e as any)");
borangCode = borangCode.replace(/handleTiadaBapa\(e\.target\.checked\)/g, "handleTiadaBapa(e as any)");
borangCode = borangCode.replace(/handleTiadaIbu\(e\.target\.checked\)/g, "handleTiadaIbu(e as any)");
fs.writeFileSync('src/components/dashboard/Borang.tsx', borangCode);

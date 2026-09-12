const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const oldContext = `  const { settings, updateSettings, candidates, updateCandidate, users, addUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();`;
const newContext = `  const { settings, updateSettings, syncSettingsToServer, candidates, updateCandidate, users, addUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();`;

code = code.replace(oldContext, newContext);

const oldTitle = `<h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kawalan Sistem</h3>`;
const newTitle = `<h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kawalan Sistem</h3>
           <button onClick={syncSettingsToServer} className="ml-auto bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 shadow-md">Simpan & Selaraskan ke Server</button>`;
code = code.replace(oldTitle, newTitle);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

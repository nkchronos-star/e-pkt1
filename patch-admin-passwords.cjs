const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const changePasswordComponent = `
function ChangePasswordModal({ user, onClose }: { user: any, onClose: () => void }) {
  const { updateUser } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPassword.trim()) {
      updateUser(user.id, { password: newPassword });
      alert('Kata laluan berjaya ditukar!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Tukar Kata Laluan</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
         </div>
         <form onSubmit={handleSave} className="p-6">
            <div className="mb-4">
               <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Kata Laluan Baru untuk {user.username}</label>
               <input 
                 type="text" 
                 value={newPassword}
                 onChange={e => setNewPassword(e.target.value)}
                 className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500" 
                 required 
                 placeholder="Masukkan kata laluan baru..."
               />
            </div>
            <div className="flex justify-end gap-3 mt-6">
               <button type="button" onClick={onClose} className="px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold">Batal</button>
               <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30">Simpan</button>
            </div>
         </form>
      </div>
    </div>
  );
}
`;

// Insert the component before export default function AdminPanel
code = code.replace("export default function AdminPanel() {", changePasswordComponent + "\nexport default function AdminPanel() {");

// Now update AdminPanel to include the "Tukar Kata Laluan Sendiri" button next to "Log Keluar"
const logKeluarBlock = `<button 
           onClick={logout}
           className="text-slate-600 hover:text-red-700 font-bold flex items-center gap-2 transition-all duration-300 bg-slate-50 hover:bg-red-50 border-2 border-slate-200 hover:border-red-200 px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-100/50 w-full md:w-auto justify-center"
         >
           <LogOut className="w-5 h-5" /> Log Keluar
         </button>`;

const enhancedButtons = `<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
         <button 
           onClick={() => setPasswordModalUser(currentUser)}
           className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-2 transition-all duration-300 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-200 px-6 py-3 rounded-xl w-full sm:w-auto justify-center shadow-sm"
         >
           <Lock className="w-5 h-5" /> Tukar Kata Laluan
         </button>
         <button 
           onClick={logout}
           className="text-slate-600 hover:text-red-700 font-bold flex items-center gap-2 transition-all duration-300 bg-slate-50 hover:bg-red-50 border-2 border-slate-200 hover:border-red-200 px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-100/50 w-full sm:w-auto justify-center"
         >
           <LogOut className="w-5 h-5" /> Log Keluar
         </button>
         </div>`;

if(code.includes(logKeluarBlock)) {
    code = code.replace(logKeluarBlock, enhancedButtons);
}

// Add state for passwordModalUser to AdminPanel
const adminPanelState = `const { currentUser, login, logout } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordModalUser, setPasswordModalUser] = useState<any>(null);`;
  
code = code.replace(
  /const { currentUser, login, logout } = useAppContext\(\);\s+const \[username, setUsername\] = useState\(''\);\s+const \[password, setPassword\] = useState\(''\);\s+const \[error, setError\] = useState\(''\);/,
  adminPanelState
);

// Add modal render to AdminPanel return
const modalRender = `{passwordModalUser && <ChangePasswordModal user={passwordModalUser} onClose={() => setPasswordModalUser(null)} />}`;
code = code.replace(
  /<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">/,
  `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">\n      ${modalRender}`
);

// Now update SuperAdminView to pass the setPasswordModalUser... wait, SuperAdminView is a separate component. It doesn't have access to setPasswordModalUser of AdminPanel!
// I can just add a separate state inside SuperAdminView for its own modal, or move SuperAdminView's state into it.
const superAdminModalState = `  const [adminPasswordModalUser, setAdminPasswordModalUser] = useState<any>(null);`;
code = code.replace(
  "const handleSettingsChange", 
  superAdminModalState + "\n\n  const handleSettingsChange"
);

// Add the modal render at the end of SuperAdminView return
code = code.replace(
  "       {/* Pengurusan Infografik */}",
  `       {adminPasswordModalUser && <ChangePasswordModal user={adminPasswordModalUser} onClose={() => setAdminPasswordModalUser(null)} />}\n\n       {/* Pengurusan Infografik */}`
);

// Now update the User table inside SuperAdminView
const userTableActionHeader = `<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>`;
const newActionHeader = `<th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>`;
code = code.replace(userTableActionHeader, newActionHeader);

const userTableActions = `<td className="px-6 py-5">
                         <button disabled={u.id === currentUser?.id} onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"><Trash2 className="w-5 h-5" /></button>
                      </td>`;
const newUserTableActions = `<td className="px-6 py-5 text-right">
                         <button onClick={() => setAdminPasswordModalUser(u)} className="text-emerald-600 hover:text-emerald-800 p-2 mr-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200">
                            Tukar Kata Laluan
                         </button>
                         <button disabled={u.id === currentUser?.id} onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 border border-red-100">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </td>`;
code = code.replace(userTableActions, newUserTableActions);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

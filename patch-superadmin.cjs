const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const targetStart = code.indexOf('function SuperAdminView() {');

const newSuperAdmin = `function SuperAdminView() {
  const { settings, updateSettings, syncSettingsToServer, candidates, updateCandidate, deleteCandidate, users, addUser, updateUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');

  // Kawalan Handlers
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateSettings({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTextSettings = (name: string, value: string) => {
    updateSettings({ [name]: value });
  };

  // Permohonan Handlers
  const setKelayakan = (ic: string, layak: boolean) => {
    updateCandidate(ic, { statusTemuduga: layak ? 'LAYAK' : 'TIDAK_LAYAK' });
  };

  // Markah Handlers
  const markahList = candidates.filter(c => c.markahTahfiz || c.markahAkademik).map(c => ({
    ...c,
    totalScore: (c.markahTahfiz?.jumlah || 0) + (c.markahAkademik?.jumlah || 0)
  })).sort((a,b) => b.totalScore - a.totalScore);

  // Pengguna State
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'TAHFIZ' });
  const handleAddUser = (e: React.FormEvent) => {
     e.preventDefault();
     addUser({
        id: Math.random().toString(36).substring(7),
        ...newUser
     } as any);
     setNewUser({ username: '', password: '', name: '', role: 'TAHFIZ' });
  };
  const handleUpdateOwnPassword = () => {
     const newPass = prompt('Masukkan kata laluan baru anda:');
     if (newPass && currentUser) {
        updateUser(currentUser.id, { password: newPass });
        alert('Kata laluan berjaya ditukar!');
     }
  };

  return (
    <div className="space-y-8">
       <div className="flex gap-4 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
         <button onClick={() => setActiveTab('KAWALAN')} className={\`px-6 py-3 font-bold rounded-xl whitespace-nowrap \${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Kawalan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={\`px-6 py-3 font-bold rounded-xl whitespace-nowrap \${activeTab === 'PENGGUNA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Pengguna (Admin)</button>
         <button onClick={() => setActiveTab('PERMOHONAN')} className={\`px-6 py-3 font-bold rounded-xl whitespace-nowrap \${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Senarai Permohonan</button>
         <button onClick={() => setActiveTab('MARKAH')} className={\`px-6 py-3 font-bold rounded-xl whitespace-nowrap \${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Dashboard Markah</button>
       </div>

       {activeTab === 'KAWALAN' && (
         <div className="space-y-12 animate-in fade-in">
           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Settings className="w-6 h-6 text-slate-500" /> Tetapan Paparan Tarikh & Sistem</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Borang Permohonan</span>
                    <input type="checkbox" name="borangBuka" checked={settings.borangBuka} onChange={handleSettingsChange} className="w-5 h-5 accent-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Dibuka/Ditutup</label>
                    <input type="date" name="tarikhBukaBorang" value={settings.tarikhBukaBorang} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Semakan Temuduga</span>
                    <input type="checkbox" name="temudugaBuka" checked={settings.temudugaBuka} onChange={handleSettingsChange} className="w-5 h-5 accent-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Paparan</label>
                    <input type="date" name="tarikhBukaTemuduga" value={settings.tarikhBukaTemuduga} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Semakan Tawaran</span>
                    <input type="checkbox" name="tawaranBuka" checked={settings.tawaranBuka} onChange={handleSettingsChange} className="w-5 h-5 accent-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Paparan</label>
                    <input type="date" name="tarikhBukaTawaran" value={settings.tarikhBukaTawaran} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><LinkIcon className="w-6 h-6 text-slate-500" /> Pengurusan Pautan (Links)</h3>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Link Borang Pendaftaran Tingkatan 1 (Bagi yang berjaya)</label>
                   <input type="url" value={settings.borangTingkatan1Link || ''} onChange={e=>handleTextSettings('borangTingkatan1Link', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3" placeholder="Contoh: https://forms.gle/..." />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Link Edit Maklumat Utama / Panduan</label>
                   <input type="url" value={settings.utamaPanduanLink || ''} onChange={e=>handleTextSettings('utamaPanduanLink', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3" placeholder="Contoh: https://docs.google.com/..." />
                   <p className="text-xs text-slate-500 mt-2">Pautan luaran untuk rujukan/kemaskini maklumat asas oleh admin.</p>
                </div>
             </div>
           </div>

           <div className="flex justify-end border-t border-slate-200 pt-6">
              <button onClick={syncSettingsToServer} className="bg-slate-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-900 shadow-md">Simpan Semua Tetapan Sistem</button>
           </div>
         </div>
       )}

       {activeTab === 'PENGGUNA' && (
          <div className="space-y-12 animate-in fade-in">
             <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex justify-between items-center">
                <div>
                   <h4 className="font-bold text-blue-900 text-lg mb-1">Akaun Anda (Super Admin)</h4>
                   <p className="text-blue-700 text-sm">Urus kata laluan anda sendiri untuk keselamatan.</p>
                </div>
                <button onClick={handleUpdateOwnPassword} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Tukar Kata Laluan</button>
             </div>

             <div>
                <h3 className="text-xl font-bold mb-6">Senarai Pengguna Sistem</h3>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-4 font-bold text-sm text-slate-600">Nama Penuh</th>
                            <th className="px-6 py-4 font-bold text-sm text-slate-600">Username (ID)</th>
                            <th className="px-6 py-4 font-bold text-sm text-slate-600">Peranan</th>
                            <th className="px-6 py-4 font-bold text-sm text-slate-600 text-right">Tindakan</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50">
                               <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                               <td className="px-6 py-4 text-slate-600">{u.username}</td>
                               <td className="px-6 py-4">
                                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold">{u.role}</span>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  {u.id !== currentUser?.id && (
                                     <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-2xl">
                   <h4 className="font-bold text-slate-800 mb-4">Tambah Pengguna Baru</h4>
                   <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nama Penuh</label>
                            <input type="text" required value={newUser.name} onChange={e=>setNewUser({...newUser, name:e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Username (ID Login)</label>
                            <input type="text" required value={newUser.username} onChange={e=>setNewUser({...newUser, username:e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Kata Laluan</label>
                            <input type="text" required value={newUser.password} onChange={e=>setNewUser({...newUser, password:e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Peranan</label>
                            <select value={newUser.role} onChange={e=>setNewUser({...newUser, role:e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                               <option value="TAHFIZ">Guru Tahfiz</option>
                               <option value="AKADEMIK">Guru Akademik</option>
                               <option value="PENTADBIR">Pentadbir</option>
                               <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                         </div>
                      </div>
                      <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 mt-2">Tambah Pengguna</button>
                   </form>
                </div>
             </div>
          </div>
       )}

       {activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-500" />
                <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-max">
                      <thead className="bg-slate-100/50">
                         <tr>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Nama & IC</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Daerah / Negeri</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">UPKK</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status Temuduga</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Tindakan</th>
                         </tr>
                      </thead>
                      <tbody>
                         {candidates.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>
                         ) : (
                            candidates.map(c => (
                               <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                  <td className="px-4 py-4">
                                     <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                                     <div className="text-xs text-slate-500">{c.ic}</div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                     {c.daerah}, {c.negeri}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     {c.upkk ? (
                                        <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">Ada</div>
                                     ) : <span className="text-xs text-slate-400">Tiada</span>}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     {c.statusTemuduga === 'LAYAK' ? (
                                        <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">LAYAK</span>
                                     ) : c.statusTemuduga === 'TIDAK_LAYAK' ? (
                                        <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">TIDAK LAYAK</span>
                                     ) : (
                                        <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full text-xs">MENUNGGU</span>
                                     )}
                                     <div className="flex justify-center gap-1 mt-2">
                                        <button onClick={()=>setKelayakan(c.ic, true)} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-200 px-2 py-1 rounded font-bold border border-emerald-200">Set Layak</button>
                                        <button onClick={()=>setKelayakan(c.ic, false)} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-200 px-2 py-1 rounded font-bold border border-red-200">Set Gagal</button>
                                     </div>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     <button onClick={()=>{if(confirm('Padam calon ini?')) deleteCandidate(c.ic);}} className="text-red-500 hover:bg-red-50 p-2 rounded-lg tooltip" title="Padam Permohonan">
                                        <Trash2 className="w-5 h-5" />
                                     </button>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
       )}

       {activeTab === 'MARKAH' && (
          <div className="space-y-6 animate-in fade-in">
             <PentadbirView />
          </div>
       )}
    </div>
  );
}
`;

code = code.substring(0, targetStart) + newSuperAdmin;
fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Patched SuperAdminView");

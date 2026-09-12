const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const tahfizStart = code.indexOf('function TahfizView() {');
const nextFunction = code.indexOf('function AkademikView() {');

if (tahfizStart !== -1 && nextFunction !== -1) {
  const newTahfiz = `function TahfizView() {
  const { candidates, updateCandidate, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'isi'|'lihat'>('isi');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [editId, setEditId] = useState('');
  const [markah, setMarkah] = useState({ hafazan: 0, tilawah: 0, sahsiah: 0 });

  const pendingCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK' && !c.markahTahfiz);
  const currentC = candidates.find(c => c.ic === selectedCandidate);
  
  const markedByMe = candidates.filter(c => c.markahTahfiz?.dinilaiOleh === currentUser?.name);
  const currentEditC = candidates.find(c => c.ic === editId);

  const handleSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
    e.preventDefault();
    const targetIc = isEdit ? editId : selectedCandidate;
    if (!targetIc) return;
    
    const today = new Date().toISOString().split('T')[0];

    updateCandidate(targetIc, {
      markahTahfiz: {
        ...markah,
        jumlah: Number(markah.hafazan) + Number(markah.tilawah) + Number(markah.sahsiah),
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: today
      }
    });
    alert('Markah berjaya disimpan!');
    if(isEdit) {
       setEditId('');
    } else {
       setSelectedCandidate('');
    }
    setMarkah({ hafazan: 0, tilawah: 0, sahsiah: 0 });
  };

  const startEdit = (c: any) => {
     const today = new Date().toISOString().split('T')[0];
     if (c.markahTahfiz?.tarikhDinilai !== today) {
        alert('Anda hanya boleh mengemaskini markah pada hari yang sama ia dinilai. Sila hubungi Admin.');
        return;
     }
     setEditId(c.ic);
     setMarkah({
        hafazan: c.markahTahfiz.hafazan || 0,
        tilawah: c.markahTahfiz.tilawah || 0,
        sahsiah: c.markahTahfiz.sahsiah || 0
     });
  };

  return (
    <div>
       <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="p-3 bg-emerald-100 rounded-xl">
           <FileSignature className="w-7 h-7 text-emerald-600" />
         </div>
         <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Temuduga (Tahfiz)</h3>
         <span className="ml-auto font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">{new Date().toLocaleDateString('ms-MY')}</span>
       </div>

       <div className="flex gap-4 mb-8">
          <button onClick={() => {setActiveTab('isi'); setEditId('');}} className={\`px-6 py-3 rounded-lg font-bold transition \${activeTab === 'isi' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Isi Markah</button>
          <button onClick={() => setActiveTab('lihat')} className={\`px-6 py-3 rounded-lg font-bold transition \${activeTab === 'lihat' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>Lihat Markah</button>
       </div>

       {activeTab === 'isi' && (
         <div className="max-w-3xl">
           <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Pilih Calon Penilaian (Layak Temuduga)</label>
             <select 
               className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 font-medium text-slate-800 bg-white shadow-sm appearance-none"
               value={selectedCandidate}
               onChange={(e) => {setSelectedCandidate(e.target.value); setMarkah({hafazan:0, tilawah:0, sahsiah:0});}}
             >
               <option value="">-- Pilih Calon --</option>
               {pendingCandidates.map(c => (
                 <option key={c.id} value={c.ic}>{c.name} ({c.ic})</option>
               ))}
             </select>
             {pendingCandidates.length === 0 && (
               <p className="text-sm font-bold text-amber-700 mt-3 bg-amber-50 px-4 py-2 rounded-lg inline-block border border-amber-200">Tiada calon yang perlu dinilai buat masa ini.</p>
             )}
           </div>

           {currentC && (
             <div className="bg-slate-50/50 rounded-[2rem] p-8 border-2 border-emerald-100 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-emerald-100/30">
               <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-1">Maklumat Calon:</span>
                  <span className="font-extrabold text-2xl text-slate-900 block mb-1">{currentC.name}</span>
                  <span className="font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-md inline-block">{currentC.ic}</span>
               </div>
               
               <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Hafazan (70%)</label>
                      <input type="number" max="70" min="0" required value={markah.hafazan} onChange={e=>setMarkah({...markah, hafazan: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tilawah (25%)</label>
                      <input type="number" max="25" min="0" required value={markah.tilawah} onChange={e=>setMarkah({...markah, tilawah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sahsiah (5%)</label>
                      <input type="number" max="5" min="0" required value={markah.sahsiah} onChange={e=>setMarkah({...markah, sahsiah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Jumlah Keseluruhan</label>
                      <input type="text" readOnly value={Number(markah.hafazan) + Number(markah.tilawah) + Number(markah.sahsiah)} className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-100 font-extrabold text-xl text-slate-900" />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg w-full sm:w-auto">Simpan Markah</button>
                  </div>
               </form>
             </div>
           )}
         </div>
       )}

       {activeTab === 'lihat' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
             {editId ? (
                <div className="p-8 bg-slate-50/50 animate-in fade-in">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-xl">Kemaskini Markah: {currentEditC?.name}</h4>
                      <button onClick={() => setEditId('')} className="text-slate-500 hover:text-slate-800 font-bold">Batal</button>
                   </div>
                   <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6 max-w-3xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Hafazan (70%)</label>
                          <input type="number" max="70" min="0" required value={markah.hafazan} onChange={e=>setMarkah({...markah, hafazan: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tilawah (25%)</label>
                          <input type="number" max="25" min="0" required value={markah.tilawah} onChange={e=>setMarkah({...markah, tilawah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sahsiah (5%)</label>
                          <input type="number" max="5" min="0" required value={markah.sahsiah} onChange={e=>setMarkah({...markah, sahsiah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                      </div>
                      <button type="submit" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 w-full sm:w-auto mt-6">Kemaskini Markah</button>
                   </form>
                </div>
             ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max">
                   <thead className="bg-slate-100/50">
                      <tr>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Nama Calon & IC</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Hafazan</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tilawah</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Sahsiah</th>
                         <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-200 bg-emerald-50/50 text-center">Jumlah</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tindakan</th>
                      </tr>
                   </thead>
                   <tbody>
                      {markedByMe.length === 0 ? (
                         <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada markah direkodkan oleh anda setakat ini.</td></tr>
                      ) : (
                         markedByMe.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition border-b border-slate-100">
                               <td className="px-4 py-4">
                                  <div className="font-bold text-slate-800">{c.name}</div>
                                  <div className="text-xs text-slate-500 mt-1">{c.ic}</div>
                               </td>
                               <td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.hafazan}</td>
                               <td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.tilawah}</td>
                               <td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.sahsiah}</td>
                               <td className="px-4 py-4 text-center font-bold text-emerald-700 bg-emerald-50/30">{c.markahTahfiz?.jumlah}</td>
                               <td className="px-4 py-4 text-center">
                                  <button onClick={() => startEdit(c)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold">Edit</button>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
             )}
          </div>
       )}
    </div>
  );
}
`;
  code = code.substring(0, tahfizStart) + newTahfiz + "\n" + code.substring(nextFunction);
  fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
  console.log("Patched TahfizView");
}

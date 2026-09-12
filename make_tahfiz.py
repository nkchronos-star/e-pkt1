import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace PenilaianModulView and TahfizView so it's clean and standalone for Tahfiz.

tahfiz_start = content.find('// ================= TAHFIZ VIEW =================')
akademik_start = content.find('// ================= AKADEMIK VIEW =================')
reusable_start = content.find('// ================= PENILAIAN REUSABLE =================')
pentadbir_start = content.find('// ================= PENTADBIR VIEW =================')


# Currently:
# // ================= TAHFIZ VIEW =================
# function TahfizView() { return <PenilaianModulView mode="TAHFIZ" />; }
# // ================= AKADEMIK VIEW ================= ...
# // ================= PENILAIAN REUSABLE =================
# function PenilaianModulView...

# We want to delete PenilaianModulView from reusable_start to pentadbir_start
# And inline its body into TahfizView.

# Wait, PenilaianModulView is already there, I just need to remove it and rewrite TahfizView.

new_tahfiz_view = """// ================= TAHFIZ VIEW =================
function TahfizView() {
  const { candidates, updateCandidate, currentUser, settings } = useAppContext();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [activeTab, setActiveTab] = useState<'NILAI' | 'SENARAI'>('NILAI');
  const [markah, setMarkah] = useState<Record<string, number>>({});
  const [catatan, setCatatan] = useState('');

  const items = settings.tahfizItems || [];
  
  const isSameDay = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr).toDateString() === new Date().toDateString();
  };

  const pendingCandidates = candidates.filter(c => 
    c.statusTemuduga === 'LAYAK' && 
    (!c.markahTahfiz || (c.markahTahfiz?.dinilaiOleh === currentUser?.name && isSameDay(c.markahTahfiz?.tarikhDinilai)))
  );

  const evaluatedCandidates = candidates.filter(c => c.markahTahfiz?.dinilaiOleh === currentUser?.name);
  const currentC = candidates.find(c => c.ic === selectedCandidate);

  useEffect(() => {
    if (currentC && currentC.markahTahfiz) {
      setMarkah(currentC.markahTahfiz);
      setCatatan(currentC.markahTahfiz?.catatan || '');
    } else {
      setMarkah({});
      setCatatan('');
    }
  }, [currentC]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentC) return;
    
    const jumlah = items.reduce((acc, item) => acc + (markah[item.id] || 0), 0);
    
    updateCandidate(currentC.ic, {
      markahTahfiz: {
        ...markah,
        jumlah,
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: currentC.markahTahfiz?.tarikhDinilai || new Date().toISOString(),
        catatan
      }
    });
    alert('Penilaian Tahfiz berjaya disimpan!');
    setSelectedCandidate('');
    setMarkah({});
    setCatatan('');
  };

  const handleEdit = (ic: string) => {
    setActiveTab('NILAI');
    setSelectedCandidate(ic);
  };

  return (
    <div className="animate-in fade-in">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 rounded-xl">
             <FileSignature className="w-7 h-7 text-emerald-700" />
           </div>
           <div>
             <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Temuduga (Tahfiz)</h3>
             <p className="text-sm font-medium text-slate-500">Pilih calon dan masukkan markah serta ulasan</p>
           </div>
         </div>
         <span className="font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">{new Date().toLocaleDateString('ms-MY')}</span>
       </div>

       <div className="flex gap-4 mb-8 border-b border-slate-200 pb-2 overflow-x-auto">
         <button onClick={() => setActiveTab('NILAI')} className={`px-6 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === 'NILAI' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>1. Menilai Calon</button>
         <button onClick={() => setActiveTab('SENARAI')} className={`px-6 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap ${activeTab === 'SENARAI' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>2. Senarai Calon Dinilai</button>
       </div>

       {activeTab === 'NILAI' && (
         <div className="max-w-4xl animate-in fade-in">
           <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Pilih Calon Penilaian</label>
             <select 
               className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-4 transition-all duration-300 font-medium text-slate-800 bg-white shadow-sm appearance-none focus:ring-emerald-500/20 focus:border-emerald-500"
               value={selectedCandidate}
               onChange={(e) => setSelectedCandidate(e.target.value)}
             >
               <option value="">-- Pilih Calon --</option>
               {pendingCandidates.map(c => (
                 <option key={c.id} value={c.ic}>{c.name} ({c.ic}) {c.markahTahfiz ? '- (Draf)' : ''}</option>
               ))}
             </select>
             {pendingCandidates.length === 0 && (
               <p className="text-sm font-bold text-amber-700 mt-3 bg-amber-50 px-4 py-2 rounded-lg inline-block border border-amber-200">Tiada calon baru atau draf hari ini untuk dinilai.</p>
             )}
           </div>

           {currentC && (
             <div className="bg-emerald-50/50 rounded-[2rem] p-8 border-2 border-emerald-100 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-emerald-100/30">
               <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                 {currentC.gambarUrl ? (
                   <img src={currentC.gambarUrl} alt={currentC.name} className="w-24 h-32 object-cover rounded-xl border-2 border-slate-200 shadow-sm" />
                 ) : (
                   <div className="w-24 h-32 bg-slate-100 rounded-xl border-2 border-slate-200 flex flex-col items-center justify-center text-slate-400">
                     <Users className="w-8 h-8 mb-1" />
                     <span className="text-[10px] font-bold uppercase">Tiada Gambar</span>
                   </div>
                 )}
                 <div className="flex-1">
                   <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-1">Maklumat Calon:</span>
                   <span className="font-extrabold text-2xl text-slate-900 block mb-2">{currentC.name}</span>
                   <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                     <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-2">IC: {currentC.ic}</span>
                     <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-2">Jantina: {currentC.jantina || '-'}</span>
                   </div>
                 </div>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div key={item.id}>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{item.name} ({item.weight} markah)</label>
                          <input type="number" max={item.weight} min="0" required value={markah[item.id] !== undefined ? markah[item.id] : ''} onChange={e=>setMarkah({...markah, [item.id]: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 bg-white font-bold text-lg text-slate-800 transition-all border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20" />
                        </div>
                    ))}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Jumlah Keseluruhan</label>
                      <input type="text" readOnly value={items.reduce((acc, item) => acc + (markah[item.id] || 0), 0)} className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-100/80 font-extrabold text-xl text-slate-900" />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Ulasan / Catatan Penilai</label>
                    <textarea 
                      rows={3} 
                      value={catatan} 
                      onChange={e => setCatatan(e.target.value)} 
                      placeholder="Masukkan ulasan untuk calon ini (pilihan)"
                      className="w-full p-4 rounded-xl border-2 bg-white font-medium text-slate-700 transition-all border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20" 
                    />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button type="submit" className="text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30">Simpan Maklumat Penilaian</button>
                  </div>
               </form>
             </div>
           )}
         </div>
       )}

       {activeTab === 'SENARAI' && (
         <div className="animate-in fade-in">
           <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
             <div className="p-1 bg-amber-100 rounded-lg shrink-0 mt-0.5"><CheckSquare className="w-5 h-5 text-amber-700" /></div>
             <span className="font-medium text-sm leading-relaxed">
               Peringatan: Anda hanya boleh mengemaskini (edit) markah dan ulasan bagi calon yang dinilai pada <strong>hari ini sahaja</strong>. Markah pada hari sebelumnya telah dikunci dan hanya boleh diubah oleh Pentadbir atas faktor keselamatan.
             </span>
           </div>

           <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200">
                 <thead className="bg-slate-50">
                   <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Gambar</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Maklumat Calon</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Ulasan</th>
                     <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50">Jumlah</th>
                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-slate-100">
                   {evaluatedCandidates.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod penilaian setakat ini.</td>
                     </tr>
                   ) : (
                     evaluatedCandidates.map(c => {
                       const canEdit = isSameDay(c.markahTahfiz?.tarikhDinilai);
                       return (
                         <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 whitespace-nowrap">
                             {c.gambarUrl ? (
                               <img src={c.gambarUrl} alt={c.name} className="w-12 h-16 rounded-lg object-cover border border-slate-200" />
                             ) : (
                               <div className="w-12 h-16 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                 <Users className="w-5 h-5 mb-1" />
                               </div>
                             )}
                           </td>
                           <td className="px-6 py-4">
                             <div className="font-bold text-slate-900">{c.name}</div>
                             <div className="text-sm font-medium text-slate-500 mt-1">{c.ic}</div>
                             <div className="text-xs text-slate-400 mt-1">{new Date(c.markahTahfiz?.tarikhDinilai || '').toLocaleDateString('ms-MY')}</div>
                           </td>
                           <td className="px-6 py-4">
                             <p className="text-sm text-slate-600 line-clamp-3" title={c.markahTahfiz?.catatan}>{c.markahTahfiz?.catatan || '-'}</p>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap font-extrabold text-2xl text-center text-emerald-600 bg-emerald-50/30">{c.markahTahfiz?.jumlah}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-center">
                             {canEdit ? (
                               <button 
                                 onClick={() => handleEdit(c.ic)} 
                                 className="px-4 py-2 font-bold text-sm rounded-lg transition-colors border shadow-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                               >
                                 Kemaskini
                               </button>
                             ) : (
                               <div className="flex flex-col items-center gap-1">
                                 <Lock className="w-4 h-4 text-slate-400" />
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Terkunci</span>
                               </div>
                             )}
                           </td>
                         </tr>
                       );
                     })
                   )}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
"""

new_content = content[:tahfiz_start] + new_tahfiz_view + '\n\n' + content[akademik_start:reusable_start] + '\n' + content[pentadbir_start:]

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(new_content)


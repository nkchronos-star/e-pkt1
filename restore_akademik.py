import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

akademik_start = content.find('// ================= AKADEMIK VIEW =================')
reusable_start = content.find('// ================= PENILAIAN REUSABLE =================')

akademik_new = """// ================= AKADEMIK VIEW =================
function AkademikRow({ candidate, updateCandidate, currentUser, akademikItems }: any) {
  const [markah, setMarkah] = useState<Record<string, number>>(() => {
     const init: Record<string, number> = {};
     akademikItems.forEach((i: any) => {
        init[i.id] = candidate.markahAkademik?.[i.id] || 0;
     });
     return init;
  });
  const [isSaved, setIsSaved] = useState(!!candidate.markahAkademik);

  const handleSave = () => {
    const jumlah = akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0);
    updateCandidate(candidate.ic, {
      markahAkademik: {
        ...markah,
        jumlah,
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: new Date().toISOString()
      }
    });
    setIsSaved(true);
  };

  const handleChange = (e: any, field: string) => {
    setMarkah(prev => ({ ...prev, [field]: Number(e.target.value) }));
    setIsSaved(false);
  };

  return (
    <tr className="hover:bg-blue-50/30 transition-colors">
      <td className="px-4 py-3 border-b border-slate-100">
        <div className="font-bold text-slate-900">{candidate.name}</div>
        <div className="text-xs font-medium text-slate-500 mt-1">{candidate.ic}</div>
      </td>
      {akademikItems.map((item: any) => (
         <td key={item.id} className="px-4 py-3 border-b border-slate-100 text-center">
           <input 
             type="number" 
             min="0" 
             max={item.weight} 
             value={markah[item.id] !== undefined ? markah[item.id] : ''} 
             onChange={e => handleChange(e, item.id)} 
             className={`w-16 border-2 border-slate-200 rounded-md p-2 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold ${isSaved ? 'bg-slate-50' : 'bg-white'}`} 
           />
         </td>
      ))}
      <td className="px-4 py-3 border-b border-slate-100 font-extrabold text-blue-700 bg-blue-50/50 text-center text-lg">
        {akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0)}
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-center">
        <button 
           onClick={handleSave} 
           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isSaved ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
        >
          {isSaved ? 'Telah Disimpan' : 'Simpan'}
        </button>
      </td>
    </tr>
  );
}

function AkademikView() {
  const { candidates, updateCandidate, currentUser, settings } = useAppContext();
  const akademikItems = settings.akademikItems || [];
  
  // Show candidates who have finished Tahfiz interview (have markahTahfiz) and are LAYAK
  const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK' && c.markahTahfiz);

  return (
    <div className="animate-in fade-in">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Ujian Akademik</h3>
              <p className="text-sm font-medium text-slate-500">Secara pukal (Calon yang telah selesai ujian Tahfiz)</p>
           </div>
         </div>
         <span className="font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">{new Date().toLocaleDateString('ms-MY')}</span>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                   <tr>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Nama Calon & IC</th>
                      {akademikItems.map((item: any) => (
                         <th key={item.id} className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">{item.name} ({item.weight})</th>
                      ))}
                      <th className="px-4 py-4 text-xs font-bold text-blue-700 uppercase tracking-widest border-b border-slate-200 bg-blue-50/50 text-center">Jumlah</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tindakan</th>
                   </tr>
                </thead>
                <tbody>
                   {eligibleCandidates.length === 0 ? (
                      <tr>
                         <td colSpan={akademikItems.length + 3} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                            Tiada calon yang telah selesai temuduga Tahfiz buat masa ini.<br/>
                            <span className="text-sm mt-2 inline-block text-slate-400">Sistem hanya memaparkan calon yang LAYAK dan telah mendapat markah Tahfiz.</span>
                         </td>
                      </tr>
                   ) : (
                      eligibleCandidates.map(c => (
                         <AkademikRow key={c.id} candidate={c} updateCandidate={updateCandidate} currentUser={currentUser} akademikItems={akademikItems} />
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

"""

new_content = content[:akademik_start] + akademik_new + content[reusable_start:]

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(new_content)


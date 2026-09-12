const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const newAkademik = `// ================= AKADEMIK VIEW =================

function AkademikRow({ candidate, updateCandidate, currentUser }: any) {
  const [markah, setMarkah] = useState({ 
    bm: candidate.markahAkademik?.bm || 0, 
    bi: candidate.markahAkademik?.bi || 0, 
    sains: candidate.markahAkademik?.sains || 0, 
    matematik: candidate.markahAkademik?.matematik || 0 
  });
  const [isSaved, setIsSaved] = useState(!!candidate.markahAkademik);

  const handleSave = () => {
    updateCandidate(candidate.ic, {
      markahAkademik: {
        ...markah,
        jumlah: Number(markah.bm) + Number(markah.bi) + Number(markah.sains) + Number(markah.matematik),
        dinilaiOleh: currentUser?.name
      }
    });
    setIsSaved(true);
  };

  const handleChange = (e: any, field: string) => {
    setMarkah(prev => ({ ...prev, [field]: Number(e.target.value) }));
    setIsSaved(false);
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 border-b border-slate-100">
        <div className="font-bold text-slate-900">{candidate.name}</div>
        <div className="text-xs text-slate-500">{candidate.ic}</div>
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <input type="number" min="0" max="25" value={markah.bm || ''} onChange={e => handleChange(e, 'bm')} className="w-16 border-2 border-slate-200 rounded-md p-1 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold" />
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <input type="number" min="0" max="25" value={markah.bi || ''} onChange={e => handleChange(e, 'bi')} className="w-16 border-2 border-slate-200 rounded-md p-1 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold" />
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <input type="number" min="0" max="25" value={markah.sains || ''} onChange={e => handleChange(e, 'sains')} className="w-16 border-2 border-slate-200 rounded-md p-1 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold" />
      </td>
      <td className="px-4 py-3 border-b border-slate-100">
        <input type="number" min="0" max="25" value={markah.matematik || ''} onChange={e => handleChange(e, 'matematik')} className="w-16 border-2 border-slate-200 rounded-md p-1 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold" />
      </td>
      <td className="px-4 py-3 border-b border-slate-100 font-extrabold text-emerald-600 bg-emerald-50/30 text-center text-lg">
        {Number(markah.bm) + Number(markah.bi) + Number(markah.sains) + Number(markah.matematik)}
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-center">
        <button 
          onClick={handleSave} 
          className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm \${isSaved ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}\`}
        >
          {isSaved ? 'Telah Disimpan' : 'Simpan'}
        </button>
      </td>
    </tr>
  );
}

function AkademikView() {
  const { candidates, updateCandidate, currentUser } = useAppContext();
  
  // Show candidates who have finished Tahfiz interview (have markahTahfiz) and are LAYAK
  const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK' && c.markahTahfiz);

  return (
    <div>
       <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="p-3 bg-emerald-100 rounded-xl">
           <CheckSquare className="w-7 h-7 text-emerald-700" />
         </div>
         <div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Ujian Akademik</h3>
            <p className="text-slate-500 font-medium">Secara Pukal (Calon yang telah selesai ujian Tahfiz)</p>
         </div>
         <span className="ml-auto font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">{new Date().toLocaleDateString('ms-MY')}</span>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-slate-100/50">
                   <tr>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Nama Calon & IC</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">BM (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">BI (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Sains (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Math (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-200 bg-emerald-50/50 text-center">Jumlah</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tindakan</th>
                   </tr>
                </thead>
                <tbody>
                   {eligibleCandidates.length === 0 ? (
                      <tr>
                         <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                            Tiada calon yang telah selesai temuduga Tahfiz buat masa ini.<br/>
                            <span className="text-sm mt-2 inline-block">Sistem hanya memaparkan calon yang LAYAK dan telah mendapat markah Tahfiz.</span>
                         </td>
                      </tr>
                   ) : (
                      eligibleCandidates.map(c => (
                         <AkademikRow key={c.id} candidate={c} updateCandidate={updateCandidate} currentUser={currentUser} />
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}`;

const regex = /\/\/ ================= AKADEMIK VIEW =================[\s\S]*?function PentadbirView\(\) \{/m;

if(regex.test(code)) {
    code = code.replace(regex, newAkademik + '\n\n// ================= PENTADBIR VIEW =================\nfunction PentadbirView() {');
    fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Regex match failed");
}

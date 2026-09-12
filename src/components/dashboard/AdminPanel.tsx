import { useState, useEffect } from 'react';
import { useAppContext } from '../../store';
import { LogOut, Printer, Users, FileSignature, CheckSquare, Settings, Lock, XCircle, Trash2, BarChart2, Link as LinkIcon, FileText, Download } from 'lucide-react';
import { BorangCetakPDF } from './BorangCetakPDF';
import { BorangPukalCetakPDF } from './BorangPukalCetakPDF';

import PenilaianView from './PenilaianView';
import { Candidate, Role } from '../../types';

export default function AdminPanel() {
  const { currentUser, login, logout } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError('');
    } else {
      setError('ID Pengguna atau Kata Laluan tidak sah (Gunakan password lalai: 123)');
    }
  };

    if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200/60 p-8 sm:p-12 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-200/60">
             <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3 tracking-tight">Log Masuk Admin</h2>
          <p className="text-center text-slate-500 mb-10 text-lg font-medium">Sila masukkan ID Pengguna untuk mengakses sistem.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">ID Pengguna</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800"
                placeholder="cth: tahfiz1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Kata Laluan</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800"
                placeholder="Kata Laluan"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] text-lg mt-2"
            >
              Log Masuk
            </button>
          </form>
                  
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden mb-10 flex flex-col md:flex-row justify-between items-center p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
         <div className="flex items-center gap-5 mb-6 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-extrabold text-2xl shadow-inner">
               {currentUser.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentUser.name}</h2>
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1 border border-emerald-200/60 uppercase tracking-wider">
                  Peranan: {currentUser.role.replace('_', ' ')}
               </span>
            </div>
         </div>
         <button 
           onClick={logout}
           className="text-slate-600 hover:text-red-700 font-bold flex items-center gap-2 transition-all duration-300 bg-slate-50 hover:bg-red-50 border-2 border-slate-200 hover:border-red-200 px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-100/50 w-full md:w-auto justify-center"
         >
           <LogOut className="w-5 h-5" /> Log Keluar
         </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 sm:p-12 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
        {currentUser.role === 'TAHFIZ' && <TahfizView />}
        {currentUser.role === 'AKADEMIK' && <AkademikView />}
        {currentUser.role === 'PENTADBIR' && <PentadbirView />}
        {currentUser.role === 'SUPER_ADMIN' && <SuperAdminView />}
      </div>
    </div>
  );
}

// ================= TAHFIZ VIEW =================
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
    !c.markahTahfiz
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


  const handleMarkahChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string, maxWeight: number, itemName: string) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      const newMarkah = {...markah};
      delete newMarkah[itemId];
      setMarkah(newMarkah);
      return;
    }
    if (val > maxWeight) {
      alert(`Amaran: Markah ${itemName} tidak boleh melebihi peruntukan markah maksimum (${maxWeight} markah).`);
      val = maxWeight;
    } else if (val < 0) {
      val = 0;
    }
    setMarkah({...markah, [itemId]: val});
  };

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
                 <option key={c.id} value={c.ic}>{c.name} ({c.ic}) </option>
               ))}
             </select>
             {pendingCandidates.length === 0 && (
               <p className="text-sm font-bold text-amber-700 mt-3 bg-amber-50 px-4 py-2 rounded-lg inline-block border border-amber-200">Tiada calon baru untuk dinilai.</p>
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
                          <input type="number" max={item.weight} min="0" required value={markah[item.id] !== undefined ? markah[item.id] : ''} onChange={e => handleMarkahChange(e, item.id, item.weight, item.name)} className="w-full p-4 rounded-xl border-2 bg-white font-bold text-lg text-slate-800 transition-all border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20" />
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
                     {items.map((item: any) => (
                       <th key={item.id} className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">{item.name}</th>
                     ))}
                     <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50">Jumlah</th>
                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-slate-100">
                   {evaluatedCandidates.length === 0 ? (
                     <tr>
                       <td colSpan={5 + items.length} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod penilaian setakat ini.</td>
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
                           {items.map((item: any) => (
                             <td key={item.id} className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-700">
                               {c.markahTahfiz?.[item.id] || 0}
                             </td>
                           ))}
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


// ================= AKADEMIK VIEW =================
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

  const handleChange = (e: any, field: string, maxWeight: number, itemName: string) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      const newMarkah = {...markah};
      delete newMarkah[field];
      setMarkah(newMarkah);
      setIsSaved(false);
      return;
    }
    if (val > maxWeight) {
      alert(`Amaran: Markah ${itemName} tidak boleh melebihi peruntukan markah maksimum (${maxWeight} markah).`);
      val = maxWeight;
    } else if (val < 0) {
      val = 0;
    }
    setMarkah(prev => ({ ...prev, [field]: val }));
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
             onChange={e => handleChange(e, item.id, item.weight, item.name)} 
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
  const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');

  return (
    <div className="animate-in fade-in">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Ujian Akademik</h3>
              <p className="text-sm font-medium text-slate-500">Secara pukal (Semua calon yang layak ke peringkat temuduga)</p>
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
                            Tiada calon yang layak temuduga buat masa ini.<br/>
                            <span className="text-sm mt-2 inline-block text-slate-400">Sistem hanya memaparkan calon yang LAYAK untuk dinilai.</span>
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


// ================= PENTADBIR VIEW =================

function AnalisisKemasukan({ candidates }: { candidates: any[] }) {
  const permohonan = candidates;
  const permohonanL = permohonan.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const permohonanP = permohonan.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const temuduga = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  const temudugaL = temuduga.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const temudugaP = temuduga.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const ditawarkan = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  const ditawarkanL = ditawarkan.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const ditawarkanP = ditawarkan.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const terima = ditawarkan.filter(c => c.maklumBalasTawaran === 'TERIMA');
  const terimaL = terima.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const terimaP = terima.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const tolak = ditawarkan.filter(c => c.maklumBalasTawaran === 'TOLAK');
  const tolakL = tolak.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const tolakP = tolak.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const belum = ditawarkan.filter(c => !c.maklumBalasTawaran);
  const belumL = belum.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const belumP = belum.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  return (
    <div className="mb-12 mt-4">
      <h4 className="font-bold text-lg text-slate-800 mb-4">Analisis Kemasukan Tahun Semasa</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-sm">Jumlah Permohonan</div>
            <div className="text-5xl font-extrabold text-slate-800 mb-2">{permohonan.length}</div>
            <div className="text-slate-500 font-bold">(L: {permohonanL} / P: {permohonanP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-purple-600 font-bold mb-2 uppercase tracking-wide text-sm">Layak Temuduga</div>
            <div className="text-5xl font-extrabold text-purple-600 mb-2">{temuduga.length}</div>
            <div className="text-purple-600/80 font-bold">(L: {temudugaL} / P: {temudugaP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-sm">Jumlah Ditawarkan</div>
            <div className="text-5xl font-extrabold text-blue-600 mb-2">{ditawarkan.length}</div>
            <div className="text-blue-600/80 font-bold">(L: {ditawarkanL} / P: {ditawarkanP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-sm">Tawaran Diterima</div>
            <div className="text-5xl font-extrabold text-emerald-600 mb-2">{terima.length}</div>
            <div className="text-emerald-600/80 font-bold">(L: {terimaL} / P: {terimaP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-sm">Tawaran Ditolak</div>
            <div className="text-5xl font-extrabold text-red-600 mb-2">{tolak.length}</div>
            <div className="text-red-600/80 font-bold">(L: {tolakL} / P: {tolakP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-sm">Belum Maklum Balas</div>
            <div className="text-5xl font-extrabold text-amber-600 mb-2">{belum.length}</div>
            <div className="text-amber-600/80 font-bold">(L: {belumL} / P: {belumP})</div>
         </div>
      </div>
    </div>
  );
}

export function downloadCSV(data: any[], filename: string) {
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + data.map(row => row.map((cell: any) => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function PentadbirView() {
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);

  const { candidates, settings } = useAppContext();
  const [filter, setFilter] = useState('ALL');

  const tahfizTotal = settings.tahfizItems?.reduce((a, b) => a + b.weight, 0) || 100;
  const akademikTotal = settings.akademikItems?.reduce((a, b) => a + b.weight, 0) || 100;

  let filtered = candidates;
  if (filter === 'BERJAYA') filtered = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  if (filter === 'GAGAL') filtered = candidates.filter(c => c.statusTawaran === 'GAGAL');
  if (filter === 'TERIMA') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  if (filter === 'TOLAK') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  if (filter === 'LAYAK_TEMUDUGA') filtered = candidates.filter(c => c.statusTemuduga === 'LAYAK');

  const handleDownloadExcel = () => {
    const headers = [
      "No", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
      "Status Temuduga", "Markah Tahfiz", "Markah Akademik", "Status Tawaran", "Maklum Balas"
    ];
    
    const rows = filtered.map((c, i) => [
      i + 1,
      c.ic || '',
      c.name || '',
      c.jantina || '',
      c.tarikhLahir || '',
      c.tempatLahir || '',
      c.namaSekolahRendah || '',
      c.icBapa || '',
      c.namaBapa || '',
      c.noTelBapa || '',
      c.icIbu || '',
      c.namaIbu || '',
      c.noTelIbu || '',
      c.statusTemuduga || '',
      c.markahTahfiz?.jumlah || '0',
      c.markahAkademik?.jumlah || '0',
      c.statusTawaran || '',
      c.maklumBalasTawaran || ''
    ]);

    downloadCSV([headers, ...rows], `Senarai_Calon_${filter}.csv`);
  };

  return (
    <div>
       <AnalisisKemasukan candidates={candidates} />

       {/* Analisa Penerimaan Tawaran (Pentadbir) */}
       <div className="mb-12">
         <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analisa Penerimaan Tawaran</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-xs">Jumlah Ditawarkan</div>
              <div className="text-4xl font-extrabold text-blue-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA').length}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center">
              <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Diterima</div>
              <div className="text-4xl font-extrabold text-emerald-600">{candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center">
              <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
              <div className="text-4xl font-extrabold text-red-600">{candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Lelaki').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina === 'Perempuan').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center">
              <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-xs">Belum Maklum Balas</div>
              <div className="text-4xl font-extrabold text-amber-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran).length}</div>
            </div>
         </div>
       </div>

       <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="p-3 bg-purple-100 rounded-xl">
           <Users className="w-7 h-7 text-purple-700" />
         </div>
         <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Penuh Calon (Pentadbir)</h3>
       </div>


       <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
         <select 
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-white text-slate-800 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 min-w-[200px]"
         >
           <option value="ALL">Semua Calon</option>
           <option value="LAYAK_TEMUDUGA">Layak Temuduga</option>
           <option value="BERJAYA">Tawaran Berjaya</option>
           <option value="GAGAL">Tawaran Gagal</option>
           <option value="TERIMA">Terima Tawaran</option>
           <option value="TOLAK">Tolak Tawaran</option>
         </select>

         <button 
           onClick={handleDownloadExcel}
           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
         >
           <Download className="w-5 h-5" />
           Muat Turun CSV (Senarai Dipapar)
         </button>
       </div>

       <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Sekolah Asal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Temuduga (Tahfiz)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Akademik</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status Tawaran</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Maklum Balas</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                       <span className="font-bold text-slate-900 block mb-1">{c.name}</span>
                       <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">{c.ic}</span>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-600 truncate max-w-[150px]">{c.namaSekolahRendah}</td>
                    <td className="px-6 py-5">
                       {c.markahTahfiz ? <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">{c.markahTahfiz.jumlah}/{tahfizTotal}</span> : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahTahfiz?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-1 uppercase">Oleh: {c.markahTahfiz.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       {c.markahAkademik ? <span className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{c.markahAkademik.jumlah}/{akademikTotal}</span> : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahAkademik?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-1 uppercase">Oleh: {c.markahAkademik.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                         c.statusTawaran === 'BERJAYA' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                         c.statusTawaran === 'GAGAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                       }`}>
                         {c.statusTawaran.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-700">
                       {c.maklumBalasTawaran ? (
                         <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                           c.maklumBalasTawaran === 'TERIMA' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
                         }`}>
                           {c.maklumBalasTawaran}
                         </span>
                       ) : <span className="text-slate-400">-</span>}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod ditemui untuk tapisan ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
}

// ================= SUPER ADMIN VIEW =================
function SuperAdminView() {
  const { settings, updateSettings, syncSettingsToServer, candidates, updateCandidate, deleteCandidate, users, addUser, updateUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);


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
         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Kawalan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Daftar Pengguna</button>
         <button onClick={() => setActiveTab('PENILAIAN' as any)} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENILAIAN' as any ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Penilaian</button>
         <button onClick={() => setActiveTab('PERMOHONAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Senarai Pemohon</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>
       </div>

       {activeTab === 'KAWALAN' && (
         <div className="space-y-12 animate-in fade-in">
           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Settings className="w-6 h-6 text-slate-500" /> Tetapan Paparan Tarikh & Sistem</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Tahun Sesi Kemasukan</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Cth: 2026 / 2027</label>
                    <input type="text" name="sesiKemasukan" value={settings.sesiKemasukan || '2026 / 2027'} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>

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
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-slate-500" /> Tetapan Surat Panggilan Temuduga</h3>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Keluar Surat (Atas Kanan)</label>
                    <input type="text" name="tarikhSuratPanggilan" value={settings.tarikhSuratPanggilan || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 8 September 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Temuduga</label>
                    <input type="text" name="tarikhTemuduga" value={settings.tarikhTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 8 November 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Hari Temuduga</label>
                    <input type="text" name="hariTemuduga" value={settings.hariTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: Sabtu" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Masa Temuduga</label>
                    <input type="text" name="masaTemuduga" value={settings.masaTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 8.00 pagi" />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tempat Temuduga</label>
                    <input type="text" name="tempatTemuduga" value={settings.tempatTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: Laman Selera, SMA Kota Gelanggi 3" />
                  </div>
                </div>
             </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><LinkIcon className="w-6 h-6 text-slate-500" /> Pengurusan Maklumat Paparan & Infografik</h3>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Maklumat Dashboard Utama (Teks)</label>
                   <textarea rows={6} value={settings.utamaContent || ''} onChange={e=>handleTextSettings('utamaContent', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3" placeholder="Masukkan teks pengenalan di laman Utama..."></textarea>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Maklumat Panduan Permohonan (Teks)</label>
                   <textarea rows={6} value={settings.panduanContent || ''} onChange={e=>handleTextSettings('panduanContent', e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3" placeholder="Masukkan teks panduan tambahan..."></textarea>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                 <h4 className="font-bold text-slate-800 mb-4">Muat Naik Gambar / Infografik Panduan</h4>
                 <form onSubmit={(e) => {
                     e.preventDefault();
                     const fd = new FormData(e.currentTarget);
                     const title = fd.get('title') as string;
                     const file = (fd.get('image') as File);
                     if (title && file && file.size > 0) {
                         const reader = new FileReader();
                         reader.onloadend = () => {
                             addInfographic({ id: Math.random().toString(36).substring(7), title, url: reader.result as string });
                         };
                         reader.readAsDataURL(file);
                     }
                     e.currentTarget.reset();
                 }} className="flex gap-4 items-end">
                     <div className="flex-1">
                         <label className="block text-xs font-bold text-slate-500 mb-1">Tajuk Gambar</label>
                         <input type="text" name="title" required className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                     </div>
                     <div className="flex-1">
                         <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Fail Imej</label>
                         <input type="file" name="image" accept="image/*" required className="w-full border border-slate-300 rounded-lg px-3 py-1.5 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-emerald-50 file:text-emerald-700" />
                     </div>
                     <button type="submit" className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-emerald-700">Muat Naik</button>
                 </form>

                 <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                   {infographics?.map(info => (
                     <div key={info.id} className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                       <img src={info.url} alt={info.title} className="w-full h-32 object-cover bg-slate-50" />
                       <div className="p-2 bg-white text-center">
                         <h4 className="text-xs font-bold text-slate-800 truncate">{info.title}</h4>
                       </div>
                       <button onClick={() => deleteInfographic(info.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-4 h-4" /></button>
                     </div>
                   ))}
                 </div>
             </div>
           </div>

           <div className="flex justify-end border-t border-slate-200 pt-6">
              
                  </div>
             
             
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileSignature className="w-6 h-6 text-slate-500" /> Maklumat Pengetua (Untuk Surat)</h3>
                <div className="mt-4">
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
                                      // Call a direct setSettings function since handleSettingsChange only takes events
                                      updateSettings({ tandatanganPengetua: base64String });
                                  };
                                  reader.readAsDataURL(file);
                              }
                          }} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-emerald-50 file:text-emerald-700" />
                          {settings.tandatanganPengetua && <img src={settings.tandatanganPengetua} alt="Tandatangan" className="mt-2 h-10 object-contain border border-slate-200 p-1 bg-white rounded" />}
                        </div>
                     </div>
                  </div>

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

       {activeTab === 'PENILAIAN' as any && (
          <PenilaianView />
       )}

       {activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />
             <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-500" />
                  <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
                </div>
                <button 
                  onClick={() => setPrintPukalBorang(true)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Borang Pukal
                </button>
                <button 
                  onClick={() => {
                    const headers = [
                      "No", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
                      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
                      "Status Temuduga", "Markah Tahfiz", "Markah Akademik", "Status Tawaran", "Maklum Balas"
                    ];
                    const rows = candidates.map((c, i) => [
                      i + 1, c.ic || '', c.name || '', c.jantina || '', c.tarikhLahir || '', c.tempatLahir || '', 
                      c.namaSekolahRendah || '', c.icBapa || '', c.namaBapa || '', c.noTelBapa || '', 
                      c.icIbu || '', c.namaIbu || '', c.noTelIbu || '', c.statusTemuduga || '', 
                      c.markahTahfiz?.jumlah || '0', c.markahAkademik?.jumlah || '0', 
                      c.statusTawaran || '', c.maklumBalasTawaran || ''
                    ]);
                    downloadCSV([headers, ...rows], `Senarai_Keseluruhan_Calon.csv`);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm"
                >
                  <Download className="w-4 h-4" />
                  Muat Turun Semua
                </button>
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
  <div className="flex items-center justify-center gap-2">

    <button
      onClick={() => setPrintCandidate(c)}
      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
      title="Cetak Maklumat Pemohon"
    >
      <FileText className="w-5 h-5" />
    </button>

    <button
      onClick={() => {
        if (confirm('Padam calon ini?')) deleteCandidate(c.ic);
      }}
      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
      title="Padam Permohonan"
    >
      <Trash2 className="w-5 h-5" />
    </button>

  </div>
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

       {printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}
       {printPukalBorang && <BorangPukalCetakPDF candidates={candidates} onClose={() => setPrintPukalBorang(false)} />}

       {activeTab === 'MARKAH' && (
          <div className="space-y-6 animate-in fade-in">
             <PentadbirView />
          </div>
       )}
    </div>
  );
}

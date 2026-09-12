import React, { useState } from 'react';
import { useAppContext } from '../../store';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AssessmentItem } from '../../types';

export default function PenilaianView() {
  const { settings, updateSettings } = useAppContext();
  
  const [tahfizItems, setTahfizItems] = useState<AssessmentItem[]>(settings.tahfizItems || []);
  const [akademikItems, setAkademikItems] = useState<AssessmentItem[]>(settings.akademikItems || []);

  const [newTahfiz, setNewTahfiz] = useState({ name: '', weight: 10 });
  const [newAkademik, setNewAkademik] = useState({ name: '', weight: 10 });

  const saveSettings = (newT: AssessmentItem[], newA: AssessmentItem[]) => {
    updateSettings({ tahfizItems: newT, akademikItems: newA });
  };

  const addTahfiz = () => {
    if (!newTahfiz.name) return;
    const item: AssessmentItem = { id: 't_' + Date.now(), name: newTahfiz.name, weight: newTahfiz.weight };
    const updated = [...tahfizItems, item];
    setTahfizItems(updated);
    saveSettings(updated, akademikItems);
    setNewTahfiz({ name: '', weight: 10 });
  };

  const addAkademik = () => {
    if (!newAkademik.name) return;
    const item: AssessmentItem = { id: 'a_' + Date.now(), name: newAkademik.name, weight: newAkademik.weight };
    const updated = [...akademikItems, item];
    setAkademikItems(updated);
    saveSettings(tahfizItems, updated);
    setNewAkademik({ name: '', weight: 10 });
  };

  const deleteTahfiz = (id: string) => {
    const updated = tahfizItems.filter(i => i.id !== id);
    setTahfizItems(updated);
    saveSettings(updated, akademikItems);
  };

  const deleteAkademik = (id: string) => {
    const updated = akademikItems.filter(i => i.id !== id);
    setAkademikItems(updated);
    saveSettings(tahfizItems, updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tahfiz */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-6">Penilaian Tahfiz</h3>
           
           <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Nama Penilaian (e.g., Hafazan)" value={newTahfiz.name} onChange={e=>setNewTahfiz({...newTahfiz, name: e.target.value})} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Markah" value={newTahfiz.weight || ''} onChange={e=>setNewTahfiz({...newTahfiz, weight: parseInt(e.target.value) || 0})} className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm" min="1" />
              <button onClick={addTahfiz} className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"><PlusCircle className="w-5 h-5" /></button>
           </div>

           <div className="space-y-3">
              {tahfizItems.map(item => (
                 <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{item.weight} Markah</span>
                       <button onClick={()=>deleteTahfiz(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              ))}
              {tahfizItems.length === 0 && <p className="text-center text-sm text-slate-500 py-4">Tiada penilaian ditetapkan.</p>}
           </div>
           
           <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-700">Jumlah Keseluruhan Markah:</span>
              <span className="font-black text-xl text-emerald-600">{tahfizItems.reduce((acc, curr) => acc + curr.weight, 0)}</span>
           </div>
        </div>

        {/* Akademik */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-6">Penilaian Akademik</h3>
           
           <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Subjek (e.g., BM)" value={newAkademik.name} onChange={e=>setNewAkademik({...newAkademik, name: e.target.value})} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Markah" value={newAkademik.weight || ''} onChange={e=>setNewAkademik({...newAkademik, weight: parseInt(e.target.value) || 0})} className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm" min="1" />
              <button onClick={addAkademik} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"><PlusCircle className="w-5 h-5" /></button>
           </div>

           <div className="space-y-3">
              {akademikItems.map(item => (
                 <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.weight} Markah</span>
                       <button onClick={()=>deleteAkademik(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              ))}
              {akademikItems.length === 0 && <p className="text-center text-sm text-slate-500 py-4">Tiada penilaian ditetapkan.</p>}
           </div>

           <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-700">Jumlah Keseluruhan Markah:</span>
              <span className="font-black text-xl text-blue-600">{akademikItems.reduce((acc, curr) => acc + curr.weight, 0)}</span>
           </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../store';
import { PlusCircle, Trash2, Edit2, Check, X } from 'lucide-react';
import { AssessmentItem } from '../../types';

export function PenilaianTahfizCard() {
  const { settings, updateSettings } = useAppContext();
  const [tahfizItems, setTahfizItems] = useState<AssessmentItem[]>(() => settings.tahfizItems || []);
  const [newTahfiz, setNewTahfiz] = useState({ name: '', weight: 10 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editWeight, setEditWeight] = useState<number>(0);

  useEffect(() => {
    if (settings.tahfizItems) {
      setTahfizItems(settings.tahfizItems);
    }
  }, [settings.tahfizItems]);

  const startEdit = (item: AssessmentItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditWeight(item.weight);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditWeight(0);
  };

  const saveEditTahfiz = (id: string) => {
    if (!editName.trim()) return;
    const updated = tahfizItems.map(item =>
      item.id === id ? { ...item, name: editName.trim(), weight: Number(editWeight) || 0 } : item
    );
    setTahfizItems(updated);
    updateSettings({ tahfizItems: updated });
    cancelEdit();
  };

  const addTahfiz = () => {
    if (!newTahfiz.name.trim()) return;
    const item: AssessmentItem = {
      id: 't_' + Date.now(),
      name: newTahfiz.name.trim(),
      weight: Number(newTahfiz.weight) || 10,
    };
    const updated = [...tahfizItems, item];
    setTahfizItems(updated);
    updateSettings({ tahfizItems: updated });
    setNewTahfiz({ name: '', weight: 10 });
  };

  const deleteTahfiz = (id: string) => {
    const updated = tahfizItems.filter(i => i.id !== id);
    setTahfizItems(updated);
    updateSettings({ tahfizItems: updated });
  };

  const totalTahfiz = tahfizItems.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Penilaian Tahfiz</h3>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Penuh: {totalTahfiz}m
        </span>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nama Penilaian (e.g., Hafazan)"
          value={newTahfiz.name}
          onChange={e => setNewTahfiz({ ...newTahfiz, name: e.target.value })}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Markah"
          value={newTahfiz.weight || ''}
          onChange={e => setNewTahfiz({ ...newTahfiz, weight: parseInt(e.target.value) || 0 })}
          className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          min="1"
        />
        <button
          type="button"
          onClick={addTahfiz}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition cursor-pointer"
          title="Tambah Komponen Tahfiz"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {tahfizItems.map(item => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3 transition-colors">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 border border-emerald-400 bg-white rounded-md px-2.5 py-1.5 text-sm font-semibold"
                  />
                  <input
                    type="number"
                    value={editWeight}
                    onChange={e => setEditWeight(parseInt(e.target.value) || 0)}
                    className="w-20 border border-emerald-400 bg-white rounded-md px-2.5 py-1.5 text-sm font-bold text-center"
                    min="0"
                  />
                </div>
              ) : (
                <span className="font-bold text-slate-700">{item.name}</span>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEditTahfiz(item.id)}
                      className="text-emerald-700 bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded-lg transition cursor-pointer"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-slate-600 bg-slate-200 hover:bg-slate-300 p-1.5 rounded-lg transition cursor-pointer"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">
                      {item.weight} Markah
                    </span>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition cursor-pointer"
                      title="Edit Markah"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTahfiz(item.id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      title="Padam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {tahfizItems.length === 0 && <p className="text-center text-sm text-slate-500 py-4">Tiada penilaian ditetapkan.</p>}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
        <span className="font-bold text-slate-700">Jumlah Keseluruhan Markah:</span>
        <span className="font-black text-xl text-emerald-600">{totalTahfiz}</span>
      </div>
    </div>
  );
}

export function PenilaianAkademikCard() {
  const { settings, updateSettings } = useAppContext();
  const [akademikItems, setAkademikItems] = useState<AssessmentItem[]>(() => {
    const list = settings.akademikItems || [];
    const filtered = list.filter(i => i.id !== 'bm' && i.id !== 'bi' && !i.name?.toLowerCase().includes('bahasa'));
    const source = filtered.length > 0 ? filtered : [
      { id: 'matematik', name: 'Matematik', weight: 20 },
      { id: 'sains', name: 'Sains', weight: 20 },
      { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
    ];
    return source.map(item => {
      if ((item.id === 'matematik' || item.name?.toLowerCase() === 'matematik') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
        return { ...item, weight: 20 };
      }
      if ((item.id === 'sains' || item.name?.toLowerCase() === 'sains') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
        return { ...item, weight: 20 };
      }
      return item;
    });
  });

  const [newAkademik, setNewAkademik] = useState({ name: '', weight: 20 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editWeight, setEditWeight] = useState<number>(0);

  useEffect(() => {
    if (settings.akademikItems) {
      let needsUpdate = false;
      const updated = settings.akademikItems
        .filter(i => i.id !== 'bm' && i.id !== 'bi' && !i.name?.toLowerCase().includes('bahasa'))
        .map(item => {
          if ((item.id === 'matematik' || item.name?.toLowerCase() === 'matematik') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
            needsUpdate = true;
            return { ...item, weight: 20 };
          }
          if ((item.id === 'sains' || item.name?.toLowerCase() === 'sains') && (item.weight === 40 || item.weight === 50 || !item.weight)) {
            needsUpdate = true;
            return { ...item, weight: 20 };
          }
          return item;
        });

      if (updated.length === 0) {
        needsUpdate = true;
        updated.push(
          { id: 'matematik', name: 'Matematik', weight: 20 },
          { id: 'sains', name: 'Sains', weight: 20 },
          { id: 'psikometrik', name: 'Psikometrik', weight: 20 }
        );
      }

      if (needsUpdate) {
        updateSettings({ akademikItems: updated });
        setAkademikItems(updated);
      } else {
        setAkademikItems(updated);
      }
    }
  }, [settings.akademikItems]);

  const startEdit = (item: AssessmentItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditWeight(item.weight);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditWeight(0);
  };

  const saveEditAkademik = (id: string) => {
    if (!editName.trim()) return;
    const updated = akademikItems.map(item =>
      item.id === id ? { ...item, name: editName.trim(), weight: Number(editWeight) || 0 } : item
    );
    setAkademikItems(updated);
    updateSettings({ akademikItems: updated });
    cancelEdit();
  };

  const addAkademik = () => {
    if (!newAkademik.name.trim()) return;
    const item: AssessmentItem = {
      id: 'a_' + Date.now(),
      name: newAkademik.name.trim(),
      weight: Number(newAkademik.weight) || 20,
    };
    const updated = [...akademikItems, item];
    setAkademikItems(updated);
    updateSettings({ akademikItems: updated });
    setNewAkademik({ name: '', weight: 20 });
  };

  const deleteAkademik = (id: string) => {
    const updated = akademikItems.filter(i => i.id !== id);
    setAkademikItems(updated);
    updateSettings({ akademikItems: updated });
  };

  const totalAkademik = akademikItems.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Penilaian Akademik</h3>
          <p className="text-xs text-slate-500 mt-0.5">Sains (20) &amp; Matematik (20) &bull; Jumlah: 40m</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
          Penuh: {totalAkademik}m
        </span>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Subjek (e.g., Sains)"
          value={newAkademik.name}
          onChange={e => setNewAkademik({ ...newAkademik, name: e.target.value })}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Markah"
          value={newAkademik.weight || ''}
          onChange={e => setNewAkademik({ ...newAkademik, weight: parseInt(e.target.value) || 0 })}
          className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          min="1"
        />
        <button
          type="button"
          onClick={addAkademik}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          title="Tambah Komponen Akademik"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {akademikItems.map(item => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3 transition-colors">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 border border-blue-400 bg-white rounded-md px-2.5 py-1.5 text-sm font-semibold"
                  />
                  <input
                    type="number"
                    value={editWeight}
                    onChange={e => setEditWeight(parseInt(e.target.value) || 0)}
                    className="w-20 border border-blue-400 bg-white rounded-md px-2.5 py-1.5 text-sm font-bold text-center"
                    min="0"
                  />
                </div>
              ) : (
                <div>
                  <span className="font-bold text-slate-700">{item.name}</span>
                  {(item.id === 'sains' || item.id === 'matematik' || item.name?.toLowerCase() === 'sains' || item.name?.toLowerCase() === 'matematik') && (
                    <span className="ml-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Subjek Utama
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEditAkademik(item.id)}
                      className="text-blue-700 bg-blue-100 hover:bg-blue-200 p-1.5 rounded-lg transition cursor-pointer"
                      title="Simpan"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-slate-600 bg-slate-200 hover:bg-slate-300 p-1.5 rounded-lg transition cursor-pointer"
                      title="Batal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                      {item.weight} Markah
                    </span>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition cursor-pointer"
                      title="Edit Markah"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAkademik(item.id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                      title="Padam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {akademikItems.length === 0 && <p className="text-center text-sm text-slate-500 py-4">Tiada penilaian ditetapkan.</p>}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
        <span className="font-bold text-slate-700">Jumlah Keseluruhan Markah:</span>
        <span className="font-black text-xl text-blue-600">{totalAkademik}</span>
      </div>
    </div>
  );
}

export default function PenilaianView() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PenilaianTahfizCard />
        <PenilaianAkademikCard />
      </div>
    </div>
  );
}

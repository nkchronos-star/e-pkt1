
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function EditCandidateModal({ candidate, onClose, onUpdated }: { candidate: Candidate, onClose: () => void, onUpdated: () => void }) {
  const { updateCandidate } = useAppContext();
  const [formData, setFormData] = useState({
    name: candidate.name || '',
    ic: candidate.ic || '',
    alamat1: candidate.alamat1 || '',
    alamat2: candidate.alamat2 || '',
    poskod: candidate.poskod || '',
    daerah: candidate.daerah || '',
    negeri: candidate.negeri || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (candidate.ic) {
         // Use the central store update function which handles API calls properly
         await updateCandidate(candidate.ic, {
           name: formData.name,
           ic: formData.ic,
           alamat1: formData.alamat1,
           alamat2: formData.alamat2,
           poskod: formData.poskod,
           daerah: formData.daerah,
           negeri: formData.negeri
         });
      } else {
         alert("IC calon tidak dijumpai.");
      }
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Ralat mengemaskini:", error);
      alert('Ralat mengemaskini maklumat.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Kemaskini Maklumat Calon</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Penuh</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
             </div>
             
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">No. Kad Pengenalan</label>
                <input type="text" name="ic" value={formData.ic} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
             </div>
             <div className="hidden md:block"></div>
             
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Baris 1</label>
                <input type="text" name="alamat1" value={formData.alamat1} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
             </div>
             
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Baris 2</label>
                <input type="text" name="alamat2" value={formData.alamat2} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
             </div>
             
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Poskod</label>
                <input type="text" name="poskod" value={formData.poskod} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
             </div>
             
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Daerah</label>
                <input type="text" name="daerah" value={formData.daerah} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
             </div>
             
             <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Negeri</label>
                <select name="negeri" value={formData.negeri} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required>
                  <option value="">Pilih Negeri</option>
                  <option value="JOHOR">JOHOR</option>
                  <option value="KEDAH">KEDAH</option>
                  <option value="KELANTAN">KELANTAN</option>
                  <option value="MELAKA">MELAKA</option>
                  <option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
                  <option value="PAHANG">PAHANG</option>
                  <option value="PERAK">PERAK</option>
                  <option value="PERLIS">PERLIS</option>
                  <option value="PULAU PINANG">PULAU PINANG</option>
                  <option value="SABAH">SABAH</option>
                  <option value="SARAWAK">SARAWAK</option>
                  <option value="SELANGOR">SELANGOR</option>
                  <option value="TERENGGANU">TERENGGANU</option>
                  <option value="W.P. KUALA LUMPUR">W.P. KUALA LUMPUR</option>
                  <option value="W.P. LABUAN">W.P. LABUAN</option>
                  <option value="W.P. PUTRAJAYA">W.P. PUTRAJAYA</option>
                </select>
             </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
             <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
               Batal
             </button>
             <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2">
               {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

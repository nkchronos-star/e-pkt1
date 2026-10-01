import React, { useState } from 'react';
import { X, Upload, Camera, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';
import { compressImageFile } from '../../lib/imageUtils';

export default function EditCandidateModal({ 
  candidate, 
  onClose, 
  onUpdated 
}: { 
  candidate: Candidate; 
  onClose: () => void; 
  onUpdated: () => void; 
}) {
  const { updateCandidate } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: candidate.name || '',
    ic: candidate.ic || '',
    noSijilLahir: candidate.noSijilLahir || '',
    jantina: candidate.jantina || '',
    tarikhLahir: candidate.tarikhLahir || '',
    tempatLahir: candidate.tempatLahir || '',
    namaSekolahRendah: candidate.namaSekolahRendah || '',
    alamat1: candidate.alamat1 || '',
    alamat2: candidate.alamat2 || '',
    poskod: candidate.poskod || '',
    daerah: candidate.daerah || '',
    negeri: candidate.negeri || 'PAHANG',
    namaBapa: candidate.namaBapa || '',
    telefonBapa: candidate.telefonBapa || '',
    namaIbu: candidate.namaIbu || '',
    telefonIbu: candidate.telefonIbu || '',
    gambarUrl: candidate.gambarUrl || ''
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'ic') {
      const digitsOnly = value.replace(/\D/g, '').substring(0, 12);
      setFormData(prev => ({ ...prev, ic: digitsOnly }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jantina' ? value : (typeof value === 'string' && name !== 'gambarUrl' ? value.toUpperCase() : value)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageFile(file, 400, 500, 0.75);
        if (compressed) {
          setFormData(prev => ({ ...prev, gambarUrl: compressed }));
          setPhotoChanged(true);
        }
      } catch (err: any) {
        alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak disokong'));
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    if (confirm('Padam gambar calon ini? Anda boleh memuat naik gambar baru selepas ini.')) {
      setFormData(prev => ({ ...prev, gambarUrl: '' }));
      setPhotoChanged(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ic.trim()) {
      alert('Sila lengkapkan Nama dan No. Kad Pengenalan calon.');
      return;
    }

    const cleanIc = formData.ic.replace(/\D/g, '');
    if (cleanIc.length !== 12 || !/^\d{12}$/.test(cleanIc)) {
      alert('Ralat: No. Kad Pengenalan calon mestilah mengandungi tepat 12 digit nombor sahaja (tanpa sengkang atau perkataan, cth: 140101061234).');
      return;
    }

    setLoading(true);
    setStatusMsg('');
    try {
      const targetIc = candidate.ic || formData.ic;
      await updateCandidate(targetIc, {
        name: formData.name.trim(),
        ic: cleanIc,
        noSijilLahir: formData.noSijilLahir.trim(),
        jantina: formData.jantina as any,
        tarikhLahir: formData.tarikhLahir,
        tempatLahir: formData.tempatLahir.trim(),
        namaSekolahRendah: formData.namaSekolahRendah.trim(),
        alamat1: formData.alamat1.trim(),
        alamat2: formData.alamat2.trim(),
        poskod: formData.poskod.trim(),
        daerah: formData.daerah.trim(),
        negeri: formData.negeri.trim(),
        namaBapa: formData.namaBapa.trim(),
        telefonBapa: formData.telefonBapa.trim(),
        namaIbu: formData.namaIbu.trim(),
        telefonIbu: formData.telefonIbu.trim(),
        gambarUrl: formData.gambarUrl
      });
      
      setStatusMsg('Maklumat dan gambar calon berjaya dikemaskini!');
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 500);
    } catch (error: any) {
      console.error("Ralat mengemaskini calon:", error);
      alert('Ralat mengemaskini maklumat: ' + (error?.message || 'Sila cuba lagi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Kemaskini Maklumat & Gambar Calon</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calon: <span className="font-bold text-slate-700">{candidate.name}</span> ({candidate.ic})
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Seksyen Gambar Pasport Calon */}
          <div className="bg-gradient-to-r from-emerald-50/60 to-blue-50/60 border border-emerald-200/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              Gambar Pasport Calon
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Box */}
              <div className="relative group">
                <div className="w-28 h-36 bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                  {formData.gambarUrl ? (
                    <img 
                      src={formData.gambarUrl} 
                      alt={formData.name || 'Gambar Calon'} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <Camera className="w-8 h-8 mb-1 stroke-1" />
                      <span className="text-[11px] font-semibold">Tiada Gambar</span>
                    </div>
                  )}
                </div>
                {photoChanged && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Baru
                  </span>
                )}
              </div>

              {/* Photo Actions & Description */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika calon memuat naik gambar yang salah atau kabur, admin boleh memilih fail gambar pasport baru di sini tanpa perlu calon mengisi semula borang dari kosong.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm ${isCompressing ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Memproses Gambar...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        {formData.gambarUrl ? 'Tukar Gambar Baru' : 'Muat Naik Gambar'}
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={isCompressing}
                      onChange={handleImageUpload} 
                    />
                  </label>

                  {formData.gambarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Padam Gambar
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">Format: JPG, PNG, WEBP (Automatik dimampat & diselaraskan)</span>
              </div>
            </div>
          </div>

          {/* Maklumat Asas Calon */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Maklumat Peribadi Calon</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh Calon</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Kad Pengenalan (12 Digit Nombor Sahaja)</label>
                <input 
                  type="text" 
                  name="ic" 
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="Cth: 140101061234"
                  value={formData.ic} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jantina</label>
                <select 
                  name="jantina" 
                  value={formData.jantina} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="">Pilih Jantina</option>
                  <option value="Lelaki">Lelaki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Sijil Lahir</label>
                <input 
                  type="text" 
                  name="noSijilLahir" 
                  value={formData.noSijilLahir} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah Rendah</label>
                <input 
                  type="text" 
                  name="namaSekolahRendah" 
                  value={formData.namaSekolahRendah} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Alamat Kediaman */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Alamat Kediaman</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Baris 1</label>
                <input 
                  type="text" 
                  name="alamat1" 
                  value={formData.alamat1} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Baris 2</label>
                <input 
                  type="text" 
                  name="alamat2" 
                  value={formData.alamat2} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poskod</label>
                <input 
                  type="text" 
                  name="poskod" 
                  value={formData.poskod} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daerah</label>
                <input 
                  type="text" 
                  name="daerah" 
                  value={formData.daerah} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Negeri</label>
                <select 
                  name="negeri" 
                  value={formData.negeri} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="PAHANG">PAHANG</option>
                  <option value="JOHOR">JOHOR</option>
                  <option value="KEDAH">KEDAH</option>
                  <option value="KELANTAN">KELANTAN</option>
                  <option value="MELAKA">MELAKA</option>
                  <option value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>
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
          </div>

          {/* Maklumat Ibu Bapa / Penjaga */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Maklumat Ibu Bapa / Penjaga</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bapa / Penjaga 1</label>
                <input 
                  type="text" 
                  name="namaBapa" 
                  value={formData.namaBapa} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Telefon Bapa</label>
                <input 
                  type="text" 
                  name="telefonBapa" 
                  value={formData.telefonBapa} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu / Penjaga 2</label>
                <input 
                  type="text" 
                  name="namaIbu" 
                  value={formData.namaIbu} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Telefon Ibu</label>
                <input 
                  type="text" 
                  name="telefonIbu" 
                  value={formData.telefonIbu} 
                  onChange={handleChange} 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {statusMsg}
            </div>
          )}
          
          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
             <button 
               type="button" 
               onClick={onClose} 
               className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
             >
               Batal
             </button>
             <button 
               type="submit" 
               disabled={loading || isCompressing} 
               className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl transition-all shadow-md flex items-center gap-2"
             >
               {loading ? (
                 <>
                   <Loader2 className="w-3.5 h-3.5 animate-spin" />
                   Menyimpan...
                 </>
               ) : (
                 'Simpan Perubahan'
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

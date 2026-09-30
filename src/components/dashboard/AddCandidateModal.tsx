import React, { useState } from 'react';
import { X, UserPlus, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';
import { compressImageFile } from '../../lib/imageUtils';

export default function AddCandidateModal({ onClose, onAdded }: { onClose: () => void; onAdded?: () => void }) {
  const { saveCandidate, candidates } = useAppContext();
  const [formData, setFormData] = useState<Partial<Candidate>>({
    name: '',
    ic: '',
    noSijilLahir: '',
    jantina: 'Lelaki',
    tarikhLahir: '',
    tempatLahir: '',
    namaSekolahRendah: '',
    alamat1: '',
    alamat2: '',
    poskod: '',
    daerah: '',
    negeri: 'PAHANG',
    namaBapa: '',
    icBapa: '',
    telefonBapa: '',
    pekerjaanBapa: '',
    namaIbu: '',
    icIbu: '',
    telefonIbu: '',
    pekerjaanIbu: '',
    statusTemuduga: 'MENUNGGU',
    statusTawaran: 'DALAM_PERTIMBANGAN',
    gambarUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jantina' ? value : (typeof value === 'string' && name !== 'gambarUrl' ? value.toUpperCase() : value)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressing(true);
      try {
        const compressed = await compressImageFile(file, 400, 500, 0.75);
        setFormData(prev => ({ ...prev, gambarUrl: compressed }));
      } catch (err: any) {
        alert('Gagal memproses gambar: ' + (err?.message || 'Format tidak sah'));
      } finally {
        setCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIC = formData.ic?.replace(/[^0-9]/g, '');
    if (!cleanIC || cleanIC.length < 6) {
      setErrorMsg('Sila masukkan No. Kad Pengenalan calon yang sah.');
      return;
    }

    if (!formData.name?.trim()) {
      setErrorMsg('Sila masukkan nama penuh calon.');
      return;
    }

    // Check duplicate
    const exists = candidates.some(c => c.ic?.replace(/[^0-9]/g, '') === cleanIC);
    if (exists) {
      setErrorMsg(`No. Kad Pengenalan ${cleanIC} ini telah pun wujud dalam senarai pemohon.`);
      return;
    }

    setLoading(true);
    try {
      const permohonanId = Math.random().toString(36).substr(2, 9);
      const newCandidate: Candidate = {
        ...(formData as Candidate),
        id: permohonanId,
        ic: cleanIC,
        name: formData.name?.trim().toUpperCase(),
        statusTemuduga: formData.statusTemuduga || 'MENUNGGU',
        statusTawaran: formData.statusTawaran || 'DALAM_PERTIMBANGAN'
      };

      await saveCandidate(newCandidate);
      alert(`Calon ${newCandidate.name} (No. KP: ${newCandidate.ic}) berjaya didaftarkan ke dalam sistem!`);
      if (onAdded) onAdded();
      onClose();
    } catch (err: any) {
      console.error('Ralat mendaftar calon:', err);
      setErrorMsg('Ralat menyimpan calon: ' + (err?.message || 'Sila cuba lagi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Daftar Calon Tercicir / Manual</h2>
              <p className="text-xs text-slate-500 font-medium">Masukkan maklumat calon yang telah memegang borang fizikal / bercetak.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Maklumat Calon */}
          <div>
            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-4 border-b pb-2">
              1. Butiran Peribadi Calon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Penuh Calon *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="Cth: MUHAMMAD ALI BIN AHMAD" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">No. Kad Pengenalan (12 Digit) *</label>
                <input type="text" name="ic" value={formData.ic} onChange={handleChange} required maxLength={14} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Cth: 140506060727" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">No. Sijil Lahir</label>
                <input type="text" name="noSijilLahir" value={formData.noSijilLahir} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium uppercase" placeholder="Cth: CP12345" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Jantina *</label>
                <select name="jantina" value={formData.jantina} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium">
                  <option value="Lelaki">LELAKI</option>
                  <option value="Perempuan">PEREMPUAN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Lahir</label>
                <input type="date" name="tarikhLahir" value={formData.tarikhLahir} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tempat Lahir</label>
                <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="Cth: HOSPITAL JERANTUT" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Sekolah Rendah Asal</label>
                <input type="text" name="namaSekolahRendah" value={formData.namaSekolahRendah} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="Cth: SK KOTA GELANGGI 3" />
              </div>
            </div>
          </div>

          {/* Section 2: Alamat */}
          <div>
            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-4 border-b pb-2">
              2. Alamat Kediaman
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Alamat Baris 1</label>
                <input type="text" name="alamat1" value={formData.alamat1} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="No. Rumah, Jalan, Kampung" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Alamat Baris 2</label>
                <input type="text" name="alamat2" value={formData.alamat2} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="Taman / Kawasan" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Poskod</label>
                <input type="text" name="poskod" value={formData.poskod} onChange={handleChange} maxLength={5} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Cth: 27000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Daerah</label>
                <input type="text" name="daerah" value={formData.daerah} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" placeholder="Cth: JERANTUT" />
              </div>
            </div>
          </div>

          {/* Section 3: Ibu Bapa / Penjaga */}
          <div>
            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-4 border-b pb-2">
              3. Maklumat Ibu Bapa / Penjaga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Bapa / Penjaga 1</label>
                <input type="text" name="namaBapa" value={formData.namaBapa} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">No. Tel Bapa</label>
                <input type="text" name="telefonBapa" value={formData.telefonBapa} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Cth: 012-3456789" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Ibu / Penjaga 2</label>
                <input type="text" name="namaIbu" value={formData.namaIbu} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 uppercase font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">No. Tel Ibu</label>
                <input type="text" name="telefonIbu" value={formData.telefonIbu} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium" placeholder="Cth: 013-9876543" />
              </div>
            </div>
          </div>

          {/* Section 4: Status Saringan & Gambar */}
          <div>
            <h3 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider mb-4 border-b pb-2">
              4. Status Saringan Permohonan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Status Temuduga *</label>
                <select name="statusTemuduga" value={formData.statusTemuduga} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800">
                  <option value="MENUNGGU">MENUNGGU (Belum Disaring)</option>
                  <option value="LAYAK">LAYAK TEMUDUGA</option>
                  <option value="TIDAK_LAYAK">TIDAK LAYAK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Gambar Pasport (Pilihan)</label>
                <input type="file" accept="image/*" disabled={compressing} onChange={handleImageUpload} className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700" />
                {compressing && <span className="text-xs text-emerald-600 font-bold mt-1 inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Mengoptimumkan gambar...</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading || compressing} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 transition-all">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mendaftar...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Daftar Calon Ke Pangkalan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useAppContext, isDateActive, getTodayMalaysia } from '../../store';
import { LogOut, Printer, Users, FileSignature, CheckSquare, Settings, Lock, Unlock, CheckCircle, XCircle, Trash2, Edit, BarChart2, Link as LinkIcon, FileText, Download, Search, UserPlus, Upload, PenTool, Check, RotateCcw, Camera, AlertCircle } from 'lucide-react';
import BorangCetakPDF from './BorangCetakPDF';
import BorangPukalCetakPDF from './BorangPukalCetakPDF';
import EditCandidateModal from './EditCandidateModal';
import AddCandidateModal from './AddCandidateModal';
import SearchableCandidateSelect from './SearchableCandidateSelect';

import PenilaianView from './PenilaianView';
import { Candidate, Role, User, ApplicationSettings } from '../../types';
import { compressImageFile, compressSignatureFile, DEFAULT_TANDATANGAN_PENGETUA, DEFAULT_TANDATANGAN_PENGARAH } from '../../lib/imageUtils';

function SignaturePadModal({ title = 'Tandatangan Digital', onSave, onClose }: { title?: string; onSave: (dataUrl: string) => void; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">Sila tandatangan di dalam kotak putih menggunakan jari, tetikus, atau pen sentuh.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative mb-4">
          <canvas
            ref={canvasRef}
            width={480}
            height={200}
            className="w-full h-48 touch-none bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-sm">
              Tandatangan di sini...
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Padam & Mula Semula
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasDrawn}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg shadow-sm"
            >
              Gunakan Tandatangan Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { updateUser } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setErrorMsg('Sila masukkan kata laluan baru.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Kata laluan pengesahan tidak sepadan.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await updateUser(user.id, { password: newPassword.trim() });
      alert(`Kata laluan untuk ${user.username} berjaya dikemaskini!`);
      onClose();
    } catch (err: any) {
      setErrorMsg('Ralat menukar kata laluan: ' + (err?.message || 'Sila cuba lagi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tukar Kata Laluan</h3>
              <p className="text-xs text-slate-500 font-medium">Akaun: <span className="font-bold text-slate-700">{user.name} ({user.username})</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Kata Laluan Baru</label>
            <input 
              type="text" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Masukkan kata laluan baru..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800 bg-slate-50 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Sahkan Kata Laluan Baru</label>
            <input 
              type="text" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ulang kata laluan baru..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kata Laluan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { currentUser, login, logout } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      const success = await login(username, password);
      if (!success) {
        setError('ID Pengguna atau Kata Laluan tidak sah');
      }
    } catch (err: any) {
      setError('Ralat semasa log masuk: ' + (err?.message || 'Sila cuba lagi'));
    } finally {
      setIsLoggingIn(false);
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
                disabled={isLoggingIn}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800 disabled:opacity-60"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Kata Laluan</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800 disabled:opacity-60"
                placeholder="Kata Laluan"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm font-bold text-center bg-red-50 py-2.5 px-3 rounded-lg border border-red-200">{error}</p>}
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] text-lg mt-2 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengesahkan...
                </>
              ) : (
                'Log Masuk'
              )}
            </button>
          </form>
                  
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      {passwordModalUser && (
        <ChangePasswordModal user={passwordModalUser} onClose={() => setPasswordModalUser(null)} />
      )}
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
         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
              type="button"
              onClick={() => setPasswordModalUser(currentUser)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-2 transition-all duration-300 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 px-5 py-3 rounded-xl shadow-sm w-full sm:w-auto justify-center"
            >
              <Lock className="w-5 h-5" /> Tukar Kata Laluan
            </button>
            <button 
              onClick={logout}
              className="text-slate-600 hover:text-red-700 font-bold flex items-center gap-2 transition-all duration-300 bg-slate-50 hover:bg-red-50 border-2 border-slate-200 hover:border-red-200 px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-100/50 w-full sm:w-auto justify-center"
            >
              <LogOut className="w-5 h-5" /> Log Keluar
            </button>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 p-8 sm:p-12 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
        {currentUser.role === 'TAHFIZ' && <TahfizView />}
        {currentUser.role === 'AKADEMIK' && <AkademikView />}
        {currentUser.role === 'PENTADBIR' && <PentadbirView />}
        {currentUser.role === 'SUPER_ADMIN' && <SuperAdminView onOpenChangePassword={setPasswordModalUser} />}
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

  // Helper untuk menentukan sama ada calon telah mempunyai markah penilaian tahfiz
  const isCandidateEvaluated = (c?: Candidate | null) => Boolean(
    c?.markahTahfiz && (typeof c.markahTahfiz.jumlah === 'number' || c.markahTahfiz.dinilaiOleh)
  );

  // Calon yang layak temuduga dan BELUM dinilai sahaja (yang dah dinilai dikeluarkan terus dari senarai dropdown)
  const pendingCandidates = candidates.filter(c => 
    c.statusTemuduga === 'LAYAK' && 
    !isCandidateEvaluated(c)
  );

  const evaluatedCandidates = candidates.filter(c => c.markahTahfiz?.dinilaiOleh === currentUser?.name);
  const currentC = candidates.find(c => c.ic === selectedCandidate);

  // Status semakan keselamatan calon semasa
  const isAlreadyEvaluated = isCandidateEvaluated(currentC);
  const isEditingSameDay = Boolean(
    isAlreadyEvaluated && 
    currentC?.markahTahfiz?.dinilaiOleh === currentUser?.name && 
    isSameDay(currentC?.markahTahfiz?.tarikhDinilai)
  );
  // Disekat jika telah dinilai (kecuali penilai yang sama mengedit pada hari yang sama)
  const isBlockedAlreadyEvaluated = isAlreadyEvaluated && !isEditingSameDay;

  // Semak jika calon sedang dinilai oleh guru/penilai lain dalam masa 20 minit terkini
  const isBeingEvaluatedByOther = Boolean(
    currentC?.sedangDinilaiTahfiz && 
    currentC.sedangDinilaiTahfiz.dinilaiOleh && 
    currentC.sedangDinilaiTahfiz.dinilaiOleh !== currentUser?.name &&
    currentC.sedangDinilaiTahfiz.dimulaPada &&
    (Date.now() - new Date(currentC.sedangDinilaiTahfiz.dimulaPada).getTime() < 20 * 60 * 1000)
  );

  const isFormDisabled = isBlockedAlreadyEvaluated || isBeingEvaluatedByOther;

  // Bebaskan status "sedang dinilai" jika penilai menukar calon atau menutup tab
  const handleSelectCandidate = (ic: string) => {
    if (selectedCandidate && selectedCandidate !== ic) {
      const prev = candidates.find(c => c.ic === selectedCandidate);
      if (prev && !isCandidateEvaluated(prev) && prev.sedangDinilaiTahfiz?.dinilaiOleh === currentUser?.name) {
        updateCandidate(prev.ic, { sedangDinilaiTahfiz: null });
      }
    }

    setSelectedCandidate(ic);

    // Kunci calon untuk penilai semasa agar orang lain tidak nilai serentak
    if (ic) {
      const nextC = candidates.find(c => c.ic === ic);
      if (nextC && !isCandidateEvaluated(nextC)) {
        updateCandidate(ic, {
          sedangDinilaiTahfiz: {
            dinilaiOleh: currentUser?.name || 'Penilai',
            dimulaPada: new Date().toISOString()
          }
        });
      }
    }
  };

  // Bersihkan kunci apabila komponen dinyahpasang
  useEffect(() => {
    return () => {
      if (selectedCandidate) {
        const c = candidates.find(item => item.ic === selectedCandidate);
        if (c && !isCandidateEvaluated(c) && c.sedangDinilaiTahfiz?.dinilaiOleh === currentUser?.name) {
          updateCandidate(c.ic, { sedangDinilaiTahfiz: null });
        }
      }
    };
  }, [selectedCandidate]);

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
    if (isFormDisabled) return;
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

    if (isBlockedAlreadyEvaluated) {
      alert('Amaran: Calon ini telah pun selesai dinilai dan markah tidak boleh diisi buat kali kedua.');
      return;
    }

    if (isBeingEvaluatedByOther) {
      alert(`Amaran: Calon ini sedang dinilai oleh ${currentC.sedangDinilaiTahfiz?.dinilaiOleh}. Anda tidak boleh mengisi markah untuk calon yang sama secara serentak.`);
      return;
    }
    
    const jumlah = items.reduce((acc, item) => acc + (markah[item.id] || 0), 0);
    
    updateCandidate(currentC.ic, {
      markahTahfiz: {
        ...markah,
        jumlah,
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: currentC.markahTahfiz?.tarikhDinilai || new Date().toISOString(),
        catatan
      },
      sedangDinilaiTahfiz: null // Lepaskan kunci setelah selesai disimpan
    });
    alert(`Penilaian Tahfiz bagi calon ${currentC.name} berjaya disimpan!`);
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
           {/* Searchable Dropdown Pemilihan Calon */}
           <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-xs">
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide flex flex-col sm:flex-row sm:items-center justify-between gap-1">
               <span>Pilih Calon Penilaian</span>
               <span className="text-xs font-semibold text-slate-400 normal-case">
                 Taip nama atau No. KP untuk carian pantas
               </span>
             </label>

             <SearchableCandidateSelect 
               candidates={pendingCandidates}
               selectedCandidate={selectedCandidate}
               onSelect={handleSelectCandidate}
               currentUserName={currentUser?.name}
               placeholder="-- Cari / Pilih Calon Layak (Taip Nama atau No. KP) --"
             />

             {pendingCandidates.length === 0 && (
               <div className="mt-3 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                 <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                 <span>Semua calon yang layak telah selesai dinilai!</span>
               </div>
             )}
           </div>

           {currentC && (
             <div className="bg-emerald-50/50 rounded-[2rem] p-8 border-2 border-emerald-100 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-emerald-100/30">
               
               {/* Amaran Jika Calon Sudah Dinilai (Tak Boleh Isi Kali Kedua) */}
               {isBlockedAlreadyEvaluated && (
                 <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 flex items-start gap-3 shadow-xs">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="font-extrabold text-amber-900 text-base">Calon Ini Telah Selesai Dinilai</h4>
                     <p className="text-sm font-medium text-amber-800 mt-1 leading-relaxed">
                       Penilaian telah direkodkan oleh <strong>{currentC.markahTahfiz?.dinilaiOleh || 'Penilai'}</strong> pada {new Date(currentC.markahTahfiz?.tarikhDinilai || '').toLocaleDateString('ms-MY')} dengan jumlah markah <strong>{currentC.markahTahfiz?.jumlah}</strong>.
                       <br/>
                       Calon tidak dibenarkan dinilai kali kedua bagi mengelakkan pertindihan data.
                     </p>
                   </div>
                 </div>
               )}

               {/* Amaran Jika Calon Sedang Dinilai oleh Guru Lain Secara Serentak */}
               {isBeingEvaluatedByOther && (
                 <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 mb-6 flex items-start gap-3 shadow-xs">
                   <Lock className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="font-extrabold text-red-900 text-base">Sedang Dinilai oleh Penilai Lain</h4>
                     <p className="text-sm font-medium text-red-800 mt-1 leading-relaxed">
                       Calon ini sedang dinilai oleh <strong>{currentC.sedangDinilaiTahfiz?.dinilaiOleh}</strong>. Anda tidak dibenarkan mengisi markah untuk calon yang sama secara serentak bagi mengelakkan konflik markah.
                     </p>
                   </div>
                 </div>
               )}

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
                     {isAlreadyEvaluated && (
                       <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 inline-flex items-center gap-1.5">
                         <Check className="w-4 h-4 text-emerald-700" />
                         Markah Semasa: {currentC.markahTahfiz?.jumlah}
                       </span>
                     )}
                   </div>
                 </div>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div key={item.id}>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{item.name} ({item.weight} markah)</label>
                          <input 
                            type="number" 
                            max={item.weight} 
                            min="0" 
                            required 
                            disabled={isFormDisabled}
                            value={markah[item.id] !== undefined ? markah[item.id] : ''} 
                            onChange={e => handleMarkahChange(e, item.id, item.weight, item.name)} 
                            className={`w-full p-4 rounded-xl border-2 font-bold text-lg text-slate-800 transition-all ${
                              isFormDisabled 
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                            }`} 
                          />
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
                      disabled={isFormDisabled}
                      value={catatan} 
                      onChange={e => setCatatan(e.target.value)} 
                      placeholder="Masukkan ulasan untuk calon ini (pilihan)"
                      className={`w-full p-4 rounded-xl border-2 font-medium text-slate-700 transition-all ${
                        isFormDisabled 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                      }`}
                    />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isFormDisabled}
                      className={`text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 text-lg w-full sm:w-auto ${
                        isFormDisabled
                          ? 'bg-slate-400 cursor-not-allowed shadow-none'
                          : 'hover:scale-[1.02] active:scale-[0.98] bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                      }`}
                    >
                      {isBlockedAlreadyEvaluated 
                        ? 'Telah Selesai Dinilai - Tidak Boleh Diisi Semula' 
                        : isBeingEvaluatedByOther 
                        ? 'Sedang Dinilai oleh Penilai Lain' 
                        : isEditingSameDay 
                        ? 'Kemaskini Maklumat Penilaian' 
                        : 'Simpan Maklumat Penilaian'}
                    </button>
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
function AkademikRow({ candidate, updateCandidate, currentUser, akademikItems, index }: any) {
  // Calon dianggap telah dinilai jika sudah ada markah disimpan atau nama penilai
  const isAlreadyEvaluated = Boolean(
    candidate.markahAkademik && 
    (candidate.markahAkademik.jumlah !== undefined || candidate.markahAkademik.dinilaiOleh) &&
    (candidate.markahAkademik.jumlah > 0 || candidate.markahAkademik.dinilaiOleh)
  );

  const [markah, setMarkah] = useState<Record<string, number>>(() => {
     const init: Record<string, number> = {};
     akademikItems.forEach((i: any) => {
        init[i.id] = candidate.markahAkademik?.[i.id] ?? 0;
     });
     return init;
  });

  const [isLocked, setIsLocked] = useState<boolean>(isAlreadyEvaluated);
  const [isSaved, setIsSaved] = useState<boolean>(isAlreadyEvaluated);

  const handleSave = () => {
    const jumlah = akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0);
    updateCandidate(candidate.ic, {
      markahAkademik: {
        ...markah,
        jumlah,
        dinilaiOleh: currentUser?.name || 'Penyelaras Akademik',
        tarikhDinilai: new Date().toISOString()
      }
    });
    setIsSaved(true);
    setIsLocked(true);
  };

  const handleChange = (e: any, field: string, maxWeight: number, itemName: string) => {
    if (isLocked) return;
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
    <tr className={`transition-colors ${isLocked ? 'bg-slate-50/40 hover:bg-slate-50' : 'hover:bg-blue-50/30'}`}>
      <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-slate-500 text-sm w-12">
        {index + 1}
      </td>
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
             disabled={isLocked}
             value={markah[item.id] !== undefined ? markah[item.id] : ''} 
             onChange={e => handleChange(e, item.id, item.weight, item.name)} 
             className={`w-16 border-2 rounded-md p-2 text-center font-bold transition-all ${
               isLocked 
                 ? 'bg-slate-100/80 border-slate-200 text-slate-600 cursor-not-allowed shadow-inner' 
                 : 'bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 shadow-xs'
             }`} 
           />
         </td>
      ))}
      <td className="px-4 py-3 border-b border-slate-100 font-extrabold text-blue-700 bg-blue-50/50 text-center text-lg">
        {akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0)}
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-center">
        {isLocked ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Selesai Dinilai
            </span>
            {candidate.markahAkademik?.dinilaiOleh && (
              <span className="text-[10px] text-slate-500 font-medium max-w-[130px] truncate" title={`Dinilai oleh: ${candidate.markahAkademik.dinilaiOleh}`}>
                Oleh: {candidate.markahAkademik.dinilaiOleh}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Adakah anda pasti mahu membuka kunci untuk mengemas kini markah ${candidate.name}?`)) {
                  setIsLocked(false);
                  setIsSaved(false);
                }
              }}
              className="mt-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition"
            >
              <Unlock className="w-3 h-3 text-slate-400" /> Buka Kunci
            </button>
          </div>
        ) : (
          <button 
             onClick={handleSave} 
             className="px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95"
          >
            Simpan & Kunci
          </button>
        )}
      </td>
    </tr>
  );
}

function AkademikView() {
  const { candidates, updateCandidate, currentUser, settings } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const akademikItems = settings.akademikItems || [];
  
  // Show candidates who are LAYAK temuduga
  const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');

  const filteredCandidates = eligibleCandidates.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const icRaw = c.ic?.toLowerCase() || '';
    const icClean = c.ic?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const qClean = q.replace(/[^a-zA-Z0-9]/g, '');
    const icMatch = icRaw.includes(q) || (qClean.length > 0 && icClean.includes(qClean));
    return nameMatch || icMatch;
  });

  return (
    <div className="animate-in fade-in">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
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

       {/* Bar Carian Nama / IC & Bilangan Calon */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
         <div className="relative flex-1 sm:max-w-md">
           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             placeholder="Cari nama calon atau No. KP..."
             className="w-full pl-10 pr-9 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xs"
           />
           {searchQuery && (
             <button 
               type="button" 
               onClick={() => setSearchQuery('')} 
               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
               title="Kosongkan carian"
             >
               <XCircle className="w-4 h-4" />
             </button>
           )}
         </div>
         <div className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl self-start sm:self-auto flex items-center gap-2">
           <span>Jumlah Calon:</span>
           <span className="text-blue-700 font-extrabold text-sm">{filteredCandidates.length}</span>
           {searchQuery && <span className="text-slate-400 font-normal">/ {eligibleCandidates.length}</span>}
         </div>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                   <tr>
                      <th className="w-12 px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Bil</th>
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
                         <td colSpan={akademikItems.length + 4} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                            Tiada calon yang layak temuduga buat masa ini.<br/>
                            <span className="text-sm mt-2 inline-block text-slate-400">Sistem hanya memaparkan calon yang LAYAK untuk dinilai.</span>
                         </td>
                      </tr>
                   ) : filteredCandidates.length === 0 ? (
                      <tr>
                         <td colSpan={akademikItems.length + 4} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                            <div className="text-slate-700 font-bold mb-1">Tiada calon sepadan dengan carian "{searchQuery}"</div>
                            <button 
                              type="button" 
                              onClick={() => setSearchQuery('')}
                              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                              Set Semula Carian
                            </button>
                         </td>
                      </tr>
                   ) : (
                      filteredCandidates.map((c, idx) => (
                         <AkademikRow key={c.id || c.ic} candidate={c} updateCandidate={updateCandidate} currentUser={currentUser} akademikItems={akademikItems} index={idx} />
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

  const demografiData = permohonan.reduce((acc, c) => {
    const n = c.negeri ? c.negeri.toUpperCase() : 'TIADA MAKLUMAT';
    const d = c.daerah ? c.daerah.toUpperCase() : 'TIADA MAKLUMAT';
    if (!acc[n]) acc[n] = {};
    if (!acc[n][d]) acc[n][d] = { jumlah: 0, layak: 0, tawaran: 0 };
    acc[n][d].jumlah++;
    if (c.statusTemuduga === 'LAYAK') acc[n][d].layak++;
    if (c.statusTawaran === 'BERJAYA') acc[n][d].tawaran++;
    return acc;
  }, {} as Record<string, Record<string, {jumlah: number, layak: number, tawaran: number}>>);

  const sortedNegeri = Object.keys(demografiData).sort();

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
      
      <div className="mt-10">
        <h4 className="font-bold text-lg text-slate-800 mb-4">Analisis Mengikut Negeri & Daerah</h4>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                 <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Negeri</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Daerah</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Permohonan</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Layak Temuduga</th>
                       <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Ditawarkan</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 bg-white">
                    {sortedNegeri.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">Tiada data demografi.</td>
                       </tr>
                    ) : (
                       sortedNegeri.map((negeri) => {
                          const daerahs = Object.keys(demografiData[negeri]).sort();
                          return daerahs.map((daerah, idx) => (
                             <tr key={`${negeri}-${daerah}`} className="hover:bg-slate-50 transition-colors">
                                {idx === 0 ? (
                                   <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-700 align-top" rowSpan={daerahs.length}>
                                      {negeri}
                                   </td>
                                ) : null}
                                <td className="px-4 py-3 font-medium text-slate-600 border-r border-slate-50">{daerah}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 bg-slate-50/50">{demografiData[negeri][daerah].jumlah}</td>
                                <td className="px-4 py-3 text-center font-bold text-purple-600 bg-purple-50/30">{demografiData[negeri][daerah].layak}</td>
                                <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/30">{demografiData[negeri][daerah].tawaran}</td>
                             </tr>
                          ));
                       })
                    )}
                 </tbody>
              </table>
           </div>
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
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { candidates, settings, updateCandidate } = useAppContext();
  const [filter, setFilter] = useState('LAYAK_TEMUDUGA');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tahfizTotal = settings.tahfizItems?.reduce((a, b) => a + b.weight, 0) || 100;
  const akademikTotal = settings.akademikItems?.reduce((a, b) => a + b.weight, 0) || 100;

  // Filter calon
  let baseCandidates = candidates;
  if (filter === 'SEMUA_PERMOHONAN') {
    baseCandidates = candidates;
  } else if (filter === 'MENUNGGU') {
    baseCandidates = candidates.filter(c => c.statusTemuduga === 'MENUNGGU' || !c.statusTemuduga);
  } else if (filter === 'BERJAYA') {
    baseCandidates = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  } else if (filter === 'GAGAL') {
    baseCandidates = candidates.filter(c => c.statusTawaran === 'GAGAL');
  } else if (filter === 'TERIMA') {
    baseCandidates = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  } else if (filter === 'TOLAK') {
    baseCandidates = candidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  } else {
    // Default 'LAYAK_TEMUDUGA'
    baseCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  }
  let filtered = baseCandidates;
  
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.name?.toLowerCase().includes(q) || c.ic?.includes(q) || c.name?.toLowerCase().includes(q) || c.ic?.includes(q));
  }

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
      c.telefonBapa || '',
      c.icIbu || '',
      c.namaIbu || '',
      c.telefonIbu || '',
      c.statusTemuduga || '',
      c.markahTahfiz?.jumlah || '0',
      c.markahAkademik?.jumlah || '0',
      c.statusTawaran || '',
      c.maklumBalasTawaran || ''
    ]);

    downloadCSV([headers, ...rows], `Senarai_Calon_${filter}.csv`);
  };


  if (printCandidate) return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={filtered} onClose={() => setPrintPukalBorang(false)} />;

  return (
    <div>
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-emerald-700" />
           </div>
           <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Keputusan Temuduga & Tawaran</h3>
         </div>
       </div>


       <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
         <select 
           value={filter}
           onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
           className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-white text-slate-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 min-w-[260px]"
         >
           <option value="SEMUA_PERMOHONAN">Semua Permohonan Berdaftar ({candidates.length})</option>
           <option value="MENUNGGU">Menunggu Saringan ({candidates.filter(c => c.statusTemuduga === 'MENUNGGU' || !c.statusTemuduga).length})</option>
           <option value="LAYAK_TEMUDUGA">Layak Temuduga ({candidates.filter(c => c.statusTemuduga === 'LAYAK').length})</option>
           <option value="BERJAYA">Ditawarkan ({candidates.filter(c => c.statusTawaran === 'BERJAYA').length})</option>
           <option value="GAGAL">Tidak Berjaya ({candidates.filter(c => c.statusTawaran === 'GAGAL').length})</option>
           <option value="TERIMA">Tawaran Diterima ({candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length})</option>
           <option value="TOLAK">Tolak Tawaran ({candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length})</option>
         </select>

         <div className="flex flex-wrap items-center gap-3">
           <button 
             type="button"
             onClick={() => setShowAddModal(true)}
             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-sm text-sm"
           >
             <UserPlus className="w-4 h-4" />
             + Tambah Calon Tercicir
           </button>
           <button 
             onClick={handleDownloadExcel}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-sm text-sm"
           >
             <Download className="w-4 h-4" />
             Muat Turun CSV
           </button>
         </div>
       </div>

       {showAddModal && <AddCandidateModal onClose={() => setShowAddModal(false)} />}

       <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest w-12">Bil</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama & Gambar Calon</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tahfiz/Penilai</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Akademik/Penilai</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Maklum Balas</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Tindakan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filtered.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-13 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                           {c.gambarUrl ? (
                             <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover" />
                           ) : (
                             <Camera className="w-4 h-4 text-slate-400 stroke-1" />
                           )}
                         </div>
                         <div>
                           <span className="font-bold text-slate-900 block mb-0.5">{c.name}</span>
                           <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">{c.ic}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       {c.markahTahfiz ? <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">{c.markahTahfiz.jumlah}/{tahfizTotal}</span> : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahTahfiz?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-1 uppercase">Oleh: {c.markahTahfiz.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       {c.markahAkademik ? <span className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{c.markahAkademik.jumlah}/{akademikTotal}</span> : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahAkademik?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-1 uppercase">Oleh: {c.markahAkademik.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       <select
                         value={c.statusTawaran || 'DALAM_PERTIMBANGAN'}
                         onChange={(e) => updateCandidate(c.ic, { statusTawaran: e.target.value as any })}
                         className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer outline-none transition-colors appearance-none text-center ${
                           c.statusTawaran === 'BERJAYA' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' :
                           c.statusTawaran === 'GAGAL' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                         }`}
                       >
                         <option value="DALAM_PERTIMBANGAN">DALAM PERTIMBANGAN</option>
                         <option value="BERJAYA">DITAWARKAN</option>
                         <option value="GAGAL">TIDAK DITAWARKAN</option>
                       </select>
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
                    <td className="px-6 py-5 text-center">
                       <button
                         type="button"
                         onClick={() => setEditCandidate(c)}
                         className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition shadow-sm"
                         title="Kemaskini Maklumat & Gambar Calon"
                       >
                         <Edit className="w-3.5 h-3.5" />
                         Kemaskini
                       </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod ditemui untuk tapisan ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>

       {editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => setEditCandidate(null)}
         />
       )}
    </div>
  );
}

// ================= SUPER ADMIN VIEW =================
function SuperAdminView({ onOpenChangePassword }: { onOpenChangePassword?: (u: User) => void }) {
  const { settings, updateSettings, syncSettingsToServer, candidates, updateCandidate, deleteCandidate, users, addUser, updateUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'ANALISIS' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [signaturePadTarget, setSignaturePadTarget] = useState<'PENGETUA' | 'PENGARAH' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'SEMUA' | 'LAYAK' | 'TIDAK_LAYAK'>('SEMUA');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const layakCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  const tidakLayakCandidates = candidates.filter(c => c.statusTemuduga === 'TIDAK_LAYAK');

  const filteredPermohonan = candidates.filter(c => {
     if (statusFilter === 'LAYAK' && c.statusTemuduga !== 'LAYAK') return false;
     if (statusFilter === 'TIDAK_LAYAK' && c.statusTemuduga !== 'TIDAK_LAYAK') return false;

     if (!searchQuery.trim()) return true;
     const searchLower = searchQuery.toLowerCase().trim();
     return c.name?.toLowerCase().includes(searchLower) || c.ic?.includes(searchQuery);
  });

  const handleDownloadLayak = () => {
    const headers = [
      "Bil", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
      "Status Temuduga", "Markah Tahfiz", "Markah Akademik", "Status Tawaran", "Maklum Balas"
    ];
    const rows = layakCandidates.map((c, i) => [
      i + 1, c.ic || '', c.name || '', c.jantina || '', c.tarikhLahir || '', c.tempatLahir || '', 
      c.namaSekolahRendah || '', c.icBapa || '', c.namaBapa || '', c.telefonBapa || '', 
      c.icIbu || '', c.namaIbu || '', c.telefonIbu || '', c.statusTemuduga || '', 
      c.markahTahfiz?.jumlah || '0', c.markahAkademik?.jumlah || '0', 
      c.statusTawaran || '', c.maklumBalasTawaran || ''
    ]);
    downloadCSV([headers, ...rows], `Senarai_Calon_Layak_Temuduga_${layakCandidates.length}.csv`);
  };

  const handleDownloadSemua = () => {
    const headers = [
      "Bil", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
      "Status Temuduga", "Markah Tahfiz", "Markah Akademik", "Status Tawaran", "Maklum Balas"
    ];
    const rows = candidates.map((c, i) => [
      i + 1, c.ic || '', c.name || '', c.jantina || '', c.tarikhLahir || '', c.tempatLahir || '', 
      c.namaSekolahRendah || '', c.icBapa || '', c.namaBapa || '', c.telefonBapa || '', 
      c.icIbu || '', c.namaIbu || '', c.telefonIbu || '', c.statusTemuduga || '', 
      c.markahTahfiz?.jumlah || '0', c.markahAkademik?.jumlah || '0', 
      c.statusTawaran || '', c.maklumBalasTawaran || ''
    ]);
    downloadCSV([headers, ...rows], `Senarai_Keseluruhan_Calon_${candidates.length}.csv`);
  };



  const [saveStatusMsg, setSaveStatusMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const compressImage = (file: File, maxWidth = 500, maxHeight = 250): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(readerEvent.target?.result as string);
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Kawalan Handlers
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      updateSettings({ [name]: checked });
      return;
    }

    const updated: Partial<ApplicationSettings> = { [name]: value };
    // Auto-tick when dates change
    if (name === 'tarikhBukaBorang' || name === 'tarikhTutupBorang') {
      const start = name === 'tarikhBukaBorang' ? value : settings.tarikhBukaBorang;
      const end = name === 'tarikhTutupBorang' ? value : settings.tarikhTutupBorang;
      updated.borangBuka = isDateActive(start, end);
    } else if (name === 'tarikhBukaTemuduga' || name === 'tarikhTutupTemuduga') {
      const start = name === 'tarikhBukaTemuduga' ? value : settings.tarikhBukaTemuduga;
      const end = name === 'tarikhTutupTemuduga' ? value : settings.tarikhTutupTemuduga;
      updated.temudugaBuka = isDateActive(start, end);
    } else if (name === 'tarikhBukaTawaran' || name === 'tarikhTutupTawaran') {
      const start = name === 'tarikhBukaTawaran' ? value : settings.tarikhBukaTawaran;
      const end = name === 'tarikhTutupTawaran' ? value : settings.tarikhTutupTawaran;
      updated.tawaranBuka = isDateActive(start, end);
    }

    updateSettings(updated);
  };

  const handleAutoTickAll = () => {
    const autoBorang = isDateActive(settings.tarikhBukaBorang, settings.tarikhTutupBorang);
    const autoTemuduga = isDateActive(settings.tarikhBukaTemuduga, settings.tarikhTutupTemuduga);
    const autoTawaran = isDateActive(settings.tarikhBukaTawaran, settings.tarikhTutupTawaran);
    updateSettings({
      borangBuka: autoBorang,
      temudugaBuka: autoTemuduga,
      tawaranBuka: autoTawaran
    });
    setSaveStatusMsg(`Status berjaya di-auto-tick mengikut tarikh hari ini (${getTodayMalaysia()})!`);
    setTimeout(() => setSaveStatusMsg(''), 4000);
  };

  const handleTextSettings = (name: string, value: string) => {
    updateSettings({ [name]: value });
  };

  const handleSaveTemudugaSettings = async () => {
    setIsSavingSettings(true);
    try {
      const partial: Partial<ApplicationSettings> = {
        tarikhSuratPanggilan: settings.tarikhSuratPanggilan || '',
        tarikhTemuduga: settings.tarikhTemuduga || '',
        hariTemuduga: settings.hariTemuduga || '',
        masaTemuduga: settings.masaTemuduga || '',
        tempatTemuduga: settings.tempatTemuduga || '',
        pakaianTemuduga: settings.pakaianTemuduga || '',
        namaPengetua: settings.namaPengetua || 'HAJAH JUITA BINTI HAMZAH',
        tandatanganPengetua: settings.tandatanganPengetua || DEFAULT_TANDATANGAN_PENGETUA
      };
      await updateSettings(partial);
      await syncSettingsToServer(partial);
      setSaveStatusMsg('Tetapan Surat Temuduga & Pengetua berjaya disimpan!');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    } catch (e: any) {
      alert('Ralat menyimpan tetapan temuduga: ' + (e?.message || 'Sila cuba lagi'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveTawaranSettings = async () => {
    setIsSavingSettings(true);
    try {
      const partial: Partial<ApplicationSettings> = {
        borangTingkatan1Link: settings.borangTingkatan1Link || '',
        rujukanSuratTawaran: settings.rujukanSuratTawaran || '',
        tarikhSuratTawaran: settings.tarikhSuratTawaran || '',
        tarikhLaporDiri: settings.tarikhLaporDiri || '',
        masaLaporDiri: settings.masaLaporDiri || '',
        tarikhAkhirTerimaTawaran: settings.tarikhAkhirTerimaTawaran || '',
        namaPengarahTawaran: settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN',
        jawatanPengarahTawaran1: settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan',
        jawatanPengarahTawaran2: settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam',
        jawatanPengarahTawaran3: settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang',
        tandatanganPengarahTawaran: settings.tandatanganPengarahTawaran || DEFAULT_TANDATANGAN_PENGARAH
      };
      await updateSettings(partial);
      await syncSettingsToServer(partial);
      setSaveStatusMsg('Tetapan Surat Tawaran & Penandatangan berjaya disimpan!');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    } catch (e: any) {
      alert('Ralat menyimpan tetapan tawaran: ' + (e?.message || 'Sila cuba lagi'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveAllSettings = async () => {
    setIsSavingSettings(true);
    try {
      await syncSettingsToServer();
      setSaveStatusMsg('Semua tetapan berjaya disimpan ke pangkalan data.');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    } catch (e: any) {
      alert('Ralat menyimpan tetapan: ' + (e?.message || 'Sila cuba lagi'));
    } finally {
      setIsSavingSettings(false);
    }
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
     if (currentUser && onOpenChangePassword) {
        onOpenChangePassword(currentUser);
     }
  };


  if (printCandidate) return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={filteredPermohonan} onClose={() => setPrintPukalBorang(false)} />;

  return (
    <div className="space-y-8">
       {signaturePadTarget && (
         <SignaturePadModal 
           title={signaturePadTarget === 'PENGETUA' ? 'Tandatangan Pengetua (Hajah Juita)' : 'Tandatangan Penandatangan Tawaran (Haji Hasdan)'}
           onSave={(dataUrl) => {
             if (signaturePadTarget === 'PENGETUA') {
               updateSettings({ tandatanganPengetua: dataUrl });
             } else {
               updateSettings({ tandatanganPengarahTawaran: dataUrl });
             }
             setSignaturePadTarget(null);
           }} 
           onClose={() => setSignaturePadTarget(null)} 
         />
       )}
       <div className="flex gap-4 border-b border-slate-200 pb-4 overflow-x-auto custom-scrollbar">
         <button onClick={() => setActiveTab('KAWALAN')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'KAWALAN' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Kawalan Sistem</button>
         <button onClick={() => setActiveTab('PENGGUNA')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENGGUNA' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Daftar Pengguna</button>
         <button onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Permohonan ({candidates.length})</button>
         <button onClick={() => setActiveTab('PENILAIAN' as any)} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'PENILAIAN' as any ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Penilaian</button>
         <button onClick={() => setActiveTab('MARKAH')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'MARKAH' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Keputusan</button>
         <button onClick={() => setActiveTab('ANALISIS')} className={`px-6 py-3 font-bold rounded-xl whitespace-nowrap ${activeTab === 'ANALISIS' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Analisis</button>
       </div>

       {activeTab === 'KAWALAN' && (
         <div className="space-y-8 animate-in fade-in">
           {/* Top Control Bar & Save Notification */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-emerald-600" /> Kawalan Sistem & Tarikh Operasi
                 </h3>
                 <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${settings.borangBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                       <span className={`w-2 h-2 rounded-full ${settings.borangBuka ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`}></span>
                       Permohonan: {settings.borangBuka ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${settings.temudugaBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                       Temuduga: {settings.temudugaBuka ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${settings.tawaranBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                       Tawaran: {settings.tawaranBuka ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                 </div>
                 {saveStatusMsg && (
                   <p className="text-xs text-emerald-600 font-bold mt-2 animate-in fade-in">✓ {saveStatusMsg}</p>
                 )}
              </div>
              <button 
                 type="button" 
                 onClick={handleSaveAllSettings}
                 disabled={isSavingSettings}
                 className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
              >
                 {isSavingSettings ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     Menyimpan...
                   </>
                 ) : (
                   'Simpan Semua Tetapan ke Database'
                 )}
              </button>
           </div>

           <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-emerald-600" /> Tetapan Utama Status & Tarikh
                  </h3>
                  <p className="text-xs text-slate-500">Tarikh hari ini (Malaysia): <span className="font-bold text-slate-700">{getTodayMalaysia()}</span>. Sistem akan auto-tick mengikut tarikh yang anda tetapkan.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoTickAll}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
                >
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  Auto-Tick Ikut Tarikh Hari Ini
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                   <div>
                     <span className="font-bold text-slate-800 block mb-1">Tahun Sesi Kemasukan</span>
                     <p className="text-xs text-slate-500 mb-3">Tahun sesi tingkatan 1</p>
                     <input type="text" name="sesiKemasukan" value={settings.sesiKemasukan || '2026 / 2027'} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700" placeholder="cth: 2026 / 2027" />
                   </div>
                 </div>

                 {/* Borang Permohonan */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-800">Borang Permohonan</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" name="borangBuka" checked={settings.borangBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>
                     <div className="flex flex-wrap items-center gap-1.5 mb-3">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.borangBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                         {settings.borangBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                       </span>
                       {settings.tarikhBukaBorang && (
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                           {isDateActive(settings.tarikhBukaBorang, settings.tarikhTutupBorang) ? '✓ Auto-aktif' : '⏳ Auto-tutup'}
                         </span>
                       )}
                     </div>
                     <div className="space-y-2">
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Mula Dibuka</label>
                         <input type="date" name="tarikhBukaBorang" value={settings.tarikhBukaBorang || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Akhir / Ditutup (Pilihan)</label>
                         <input type="date" name="tarikhTutupBorang" value={settings.tarikhTutupBorang || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Semakan Temuduga */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-800">Semakan Temuduga</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" name="temudugaBuka" checked={settings.temudugaBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>
                     <div className="flex flex-wrap items-center gap-1.5 mb-3">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.temudugaBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                         {settings.temudugaBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                       </span>
                       {settings.tarikhBukaTemuduga && (
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                           {isDateActive(settings.tarikhBukaTemuduga, settings.tarikhTutupTemuduga) ? '✓ Auto-aktif' : '⏳ Auto-tutup'}
                         </span>
                       )}
                     </div>
                     <div className="space-y-2">
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Mula Paparan</label>
                         <input type="date" name="tarikhBukaTemuduga" value={settings.tarikhBukaTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Akhir Paparan (Pilihan)</label>
                         <input type="date" name="tarikhTutupTemuduga" value={settings.tarikhTutupTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Semakan Tawaran */}
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-800">Semakan Tawaran</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" name="tawaranBuka" checked={settings.tawaranBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>
                     <div className="flex flex-wrap items-center gap-1.5 mb-3">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.tawaranBuka ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                         {settings.tawaranBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                       </span>
                       {settings.tarikhBukaTawaran && (
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                           {isDateActive(settings.tarikhBukaTawaran, settings.tarikhTutupTawaran) ? '✓ Auto-aktif' : '⏳ Auto-tutup'}
                         </span>
                       )}
                     </div>
                     <div className="space-y-2">
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Mula Paparan</label>
                         <input type="date" name="tarikhBukaTawaran" value={settings.tarikhBukaTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                       <div>
                         <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Tarikh Akhir Paparan (Pilihan)</label>
                         <input type="date" name="tarikhTutupTawaran" value={settings.tarikhTutupTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium" />
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
           </div>

           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-slate-500" /> Tetapan Surat Panggilan Temuduga</h3>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
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
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Etika Pakaian Temuduga</label>
                    <input type="text" name="pakaianTemuduga" value={settings.pakaianTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: Uniform sekolah lengkap" />
                  </div>
                </div>

                {/* Maklumat Pengetua & Tandatangan (Untuk Surat Panggilan Temuduga) */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-emerald-600" />
                    Maklumat Pengetua & Tandatangan (Untuk Surat Panggilan Temuduga)
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
                    <div className="lg:col-span-5 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        Nama Pengetua
                      </label>
                      <input 
                        type="text" 
                        name="namaPengetua" 
                        value={settings.namaPengetua || ''} 
                        onChange={handleSettingsChange} 
                        placeholder="HAJAH JUITA BINTI HAMZAH" 
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-sm uppercase" 
                      />
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Nama pengetua akan tertera pada bahagian bawah Surat Panggilan Temuduga bersama jawatan Pengetua SMA Kota Gelanggi 3.
                      </p>
                    </div>

                    <div className="lg:col-span-7 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        Imej 1: Tandatangan Pengetua
                      </label>

                      {settings.tandatanganPengetua ? (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
                              <img 
                                src={settings.tandatanganPengetua} 
                                alt="Imej 1: Tandatangan Pengetua" 
                                className="h-full w-full object-contain" 
                              />
                            </div>
                            <div>
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" /> Imej 1 Aktif
                              </span>
                              <span className="text-[11px] text-slate-600 block mt-1 font-semibold truncate max-w-[200px]">
                                {settings.namaPengetua || 'HAJAH JUITA BINTI HAMZAH'}
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => updateSettings({ tandatanganPengetua: '' })} 
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition"
                          >
                            Padam Imej
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                          <span>Tiada imej tandatangan pengetua. (Surat akan memaparkan garis titik).</span>
                          <button
                            type="button"
                            onClick={() => updateSettings({ tandatanganPengetua: DEFAULT_TANDATANGAN_PENGETUA })}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap"
                          >
                            Guna Tandatangan Rasmi
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          Muat Naik Imej 1 (Fail Gambar)
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressSignatureFile(file, 380, 160);
                                  if (compressed) {
                                    updateSettings({ tandatanganPengetua: compressed });
                                  }
                                } catch (err) {
                                  console.error('Ralat tandatangan pengetua:', err);
                                  alert('Gagal memproses fail imej tandatangan.');
                                }
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setSignaturePadTarget('PENGETUA')}
                          className="bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <PenTool className="w-3.5 h-3.5 text-blue-600" />
                          Tandatangan Atas Skrin
                        </button>

                        {settings.tandatanganPengetua !== DEFAULT_TANDATANGAN_PENGETUA && (
                          <button
                            type="button"
                            onClick={() => updateSettings({ tandatanganPengetua: DEFAULT_TANDATANGAN_PENGETUA })}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-semibold underline px-2 py-1 flex items-center gap-1"
                            title="Guna tandatangan rasmi HAJAH JUITA BINTI HAMZAH"
                          >
                            <RotateCcw className="w-3 h-3" /> Set Semula Rasmi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick save button for interview settings */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveTemudugaSettings}
                    disabled={isSavingSettings}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-xs"
                  >
                    {isSavingSettings ? 'Menyimpan...' : 'Simpan Tetapan Surat Temuduga'}
                  </button>
                </div>
             </div>
           </div>
           <div>
             <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-slate-500" /> Tetapan Surat Tawaran</h3>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Pautan Borang Pendaftaran</label>
                    <input type="text" name="borangTingkatan1Link" value={settings.borangTingkatan1Link || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Rujukan Surat (Sistem akan tambah (xx) automatik)</label>
                    <input type="text" name="rujukanSuratTawaran" value={settings.rujukanSuratTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: JPNP.SPI.800-1/1/4 Jld.2" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Surat (Atas Kanan)</label>
                    <input type="text" name="tarikhSuratTawaran" value={settings.tarikhSuratTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 17 November 2025" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Lapor Diri</label>
                    <input type="text" name="tarikhLaporDiri" value={settings.tarikhLaporDiri || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 11 JANUARI 2026 (AHAD)" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Masa Lapor Diri</label>
                    <input type="text" name="masaLaporDiri" value={settings.masaLaporDiri || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 8.30 PAGI" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tarikh Akhir Terima Tawaran</label>
                    <input type="text" name="tarikhAkhirTerimaTawaran" value={settings.tarikhAkhirTerimaTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="cth: 28 November 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nama Ketua Penolong Pengarah Kanan (Penandatangan Surat Tawaran)</label>
                    <input type="text" name="namaPengarahTawaran" value={settings.namaPengarahTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold uppercase text-slate-800" placeholder="HAJI HASDAN BIN HASAN" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Jawatan Baris 1</label>
                    <input type="text" name="jawatanPengarahTawaran1" value={settings.jawatanPengarahTawaran1 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Ketua Penolong Pengarah Kanan" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Jawatan Baris 2</label>
                    <input type="text" name="jawatanPengarahTawaran2" value={settings.jawatanPengarahTawaran2 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Sektor Pendidikan Islam" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Jawatan Baris 3</label>
                    <input type="text" name="jawatanPengarahTawaran3" value={settings.jawatanPengarahTawaran3 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="b.p Pengarah Pendidikan Pahang" />
                  </div>
                </div>

                {/* Maklumat Penandatangan & Tandatangan (Surat Tawaran) */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-emerald-600" />
                    Tandatangan Ketua Penolong Pengarah Kanan (Surat Tawaran)
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
                    <div className="lg:col-span-5 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        Ketua Penolong Pengarah Kanan (Penandatangan Tawaran)
                      </label>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-xs font-bold text-slate-900 block uppercase">
                          {settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN'}
                        </span>
                        <span className="text-[11px] text-slate-500 block leading-tight">
                          {settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan'}<br />
                          {settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam'}<br />
                          {settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Maklumat ini akan tertera pada bahagian pengesahan rasmi Surat Tawaran ke Tingkatan 1.
                      </p>
                    </div>

                    <div className="lg:col-span-7 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        Imej 1: Tandatangan Ketua Penolong Pengarah Kanan (HAJI HASDAN BIN HASAN)
                      </label>

                      {settings.tandatanganPengarahTawaran ? (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
                              <img 
                                src={settings.tandatanganPengarahTawaran} 
                                alt="Imej 1: Tandatangan Tawaran" 
                                className="h-full w-full object-contain" 
                              />
                            </div>
                            <div>
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" /> Imej 1 Aktif
                              </span>
                              <span className="text-[11px] text-slate-600 block mt-1 font-semibold truncate max-w-[200px]">
                                {settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN'}
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => updateSettings({ tandatanganPengarahTawaran: '' })} 
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition"
                          >
                            Padam Imej
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                          <span>Tiada imej tandatangan penandatangan tawaran.</span>
                          <button
                            type="button"
                            onClick={() => updateSettings({ tandatanganPengarahTawaran: DEFAULT_TANDATANGAN_PENGARAH })}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap"
                          >
                            Guna Tandatangan Rasmi Haji Hasdan
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          Muat Naik Imej 1 (Fail Gambar)
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressSignatureFile(file, 380, 160);
                                  if (compressed) {
                                    updateSettings({ tandatanganPengarahTawaran: compressed });
                                  }
                                } catch (err) {
                                  console.error('Ralat tandatangan tawaran:', err);
                                  alert('Gagal memproses fail imej tandatangan.');
                                }
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setSignaturePadTarget('PENGARAH')}
                          className="bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <PenTool className="w-3.5 h-3.5 text-blue-600" />
                          Tandatangan Atas Skrin
                        </button>

                        {settings.tandatanganPengarahTawaran !== DEFAULT_TANDATANGAN_PENGARAH && (
                          <button
                            type="button"
                            onClick={() => updateSettings({ tandatanganPengarahTawaran: DEFAULT_TANDATANGAN_PENGARAH })}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-semibold underline px-2 py-1 flex items-center gap-1"
                            title="Guna tandatangan rasmi HAJI HASDAN BIN HASAN"
                          >
                            <RotateCcw className="w-3 h-3" /> Set Semula Rasmi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick save button for offer letter settings */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveTawaranSettings}
                    disabled={isSavingSettings}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-xs"
                  >
                    {isSavingSettings ? 'Menyimpan...' : 'Simpan Tetapan Surat Tawaran'}
                  </button>
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
                         compressImageFile(file, 1000, 1400, 0.8).then(url => {
                             addInfographic({ id: Math.random().toString(36).substring(7), title, url });
                         }).catch(err => {
                             console.error('Ralat infografik:', err);
                             alert('Gagal memproses fail imej infografik.');
                         });
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
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
              <button 
                type="button" 
                onClick={handleSaveAllSettings}
                disabled={isSavingSettings}
                className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold px-8 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
              >
                {isSavingSettings ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan Tetapan...
                  </>
                ) : (
                  'Simpan Semua Tetapan Sistem'
                )}
              </button>
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
                                  <button 
                                     type="button" 
                                     onClick={() => onOpenChangePassword && onOpenChangePassword(u)} 
                                     className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold mr-2 transition-colors"
                                  >
                                     Tukar Kata Laluan
                                  </button>
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

       {activeTab === 'ANALISIS' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />
                    {/* Analisa Penerimaan Tawaran (Pentadbir) */}
       <div className="mt-8 mb-12">
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
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina?.toUpperCase() === 'LELAKI').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TERIMA' && c.jantina?.toUpperCase() === 'PEREMPUAN').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center">
              <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
              <div className="text-4xl font-extrabold text-red-600">{candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length}</div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                (L: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina?.toUpperCase() === 'LELAKI').length} / P: {candidates.filter(c => c.maklumBalasTawaran === 'TOLAK' && c.jantina?.toUpperCase() === 'PEREMPUAN').length})
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center">
              <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-xs">Belum Maklum Balas</div>
              <div className="text-4xl font-extrabold text-amber-600">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran).length}</div>
            </div>
         </div>
       </div>
          </div>
       )}
       {activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl hidden sm:block flex-shrink-0">
                    <Users className="w-7 h-7 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Senarai Keseluruhan Permohonan</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Urus maklumat calon, tapisan status temuduga, dan muat turun senarai calon.</p>
                  </div>
                </div>

                {/* Tapisan Status Calon */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-stretch sm:self-auto overflow-x-auto">
                   <button
                     type="button"
                     onClick={() => { setStatusFilter('SEMUA'); setCurrentPage(1); }}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                       statusFilter === 'SEMUA' 
                         ? 'bg-white text-slate-900 shadow-xs' 
                         : 'text-slate-600 hover:text-slate-900'
                     }`}
                   >
                     Semua ({candidates.length})
                   </button>
                   <button
                     type="button"
                     onClick={() => { setStatusFilter('LAYAK'); setCurrentPage(1); }}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                       statusFilter === 'LAYAK' 
                         ? 'bg-purple-600 text-white shadow-xs' 
                         : 'text-purple-700 hover:text-purple-900'
                     }`}
                   >
                     <span className={`w-2 h-2 rounded-full ${statusFilter === 'LAYAK' ? 'bg-white' : 'bg-purple-600'}`}></span>
                     Layak Temuduga ({layakCandidates.length})
                   </button>
                   <button
                     type="button"
                     onClick={() => { setStatusFilter('TIDAK_LAYAK'); setCurrentPage(1); }}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                       statusFilter === 'TIDAK_LAYAK' 
                         ? 'bg-rose-600 text-white shadow-xs' 
                         : 'text-rose-700 hover:text-rose-900'
                     }`}
                   >
                     <span className={`w-2 h-2 rounded-full ${statusFilter === 'TIDAK_LAYAK' ? 'bg-white' : 'bg-rose-600'}`}></span>
                     Tidak Layak ({tidakLayakCandidates.length})
                   </button>
                </div>
             </div>
             
             <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 mb-2">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                   <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" placeholder="Cari nama atau No. KP..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-medium" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
                    >
                      <UserPlus className="w-4 h-4" />
                      + Tambah Calon
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setPrintPukalBorang(true)}
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
                      title={statusFilter === 'LAYAK' ? 'Cetak borang calon layak sahaja' : 'Cetak borang'}
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Pukal {statusFilter === 'LAYAK' ? '(Layak)' : ''}
                    </button>
                    
                    {/* Butang Muat Turun Calon Layak Temuduga Khusus */}
                    <button 
                      type="button"
                      onClick={handleDownloadLayak}
                      className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap ring-2 ring-purple-300"
                      title="Muat turun senarai calon berstatus Layak Temuduga sahaja"
                    >
                      <Download className="w-4 h-4" />
                      Muat Turun Calon Layak ({layakCandidates.length})
                    </button>

                    {/* Butang Muat Turun Semua */}
                    <button 
                      type="button"
                      onClick={handleDownloadSemua}
                      className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
                      title="Muat turun keseluruhan senarai calon"
                    >
                      <Download className="w-4 h-4" />
                      Semua ({candidates.length})
                    </button>
                </div>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-full">
                      <thead className="bg-slate-100/50">
                         <tr>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">Bil</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Nama & IC</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Daerah / Negeri</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">UPKK</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Tindakan</th>
                         </tr>
                      </thead>
                      <tbody>
                         {filteredPermohonan.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>
                         ) : (
                            filteredPermohonan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c, index) => (
                               <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                  <td className="px-4 py-4 text-center text-sm font-medium text-slate-500">
                                     {(currentPage - 1) * itemsPerPage + index + 1}
                                  </td>
                                  <td className="px-4 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-10 h-13 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                                          {c.gambarUrl ? (
                                            <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <Camera className="w-4 h-4 text-slate-400 stroke-1" />
                                          )}
                                        </div>
                                        <div>
                                           <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                                           <div className="text-xs font-mono text-slate-500">{c.ic}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                     {c.daerah || '-'}, {c.negeri || '-'}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     {(() => {
                                        if(!c.upkk) return <span className="text-xs text-slate-400">Tiada</span>;
                                        const grades = Object.values(c.upkk).filter(v => v && typeof v === 'string' && v.trim() !== '');
                                        if(grades.length === 0) return <span className="text-xs text-slate-400">Tiada</span>;
                                        
                                        const counts: Record<string, number> = {};
                                        grades.forEach(g => { counts[g as string] = (counts[g as string] || 0) + 1; });
                                        const formatted = Object.entries(counts).sort().map(([g, count]) => `${count}${g}`).join(', ');
                                        return <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block whitespace-nowrap">{formatted}</div>;
                                     })()}
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
                                        <button onClick={()=>setKelayakan(c.ic, true)} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-200 px-2 py-1 rounded font-bold border border-emerald-200">LAYAK</button>
                                        <button onClick={()=>setKelayakan(c.ic, false)} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-200 px-2 py-1 rounded font-bold border border-red-200">TIDAK LAYAK</button>
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
      onClick={() => setEditCandidate(c)}
      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg"
      title="Kemaskini Maklumat"
    >
      <Edit className="w-5 h-5" />
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
                {filteredPermohonan.length > itemsPerPage && (
                   <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                     <span className="text-sm text-slate-500">
                       Memaparkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, filteredPermohonan.length)} daripada {filteredPermohonan.length} rekod
                     </span>
                     <div className="flex gap-2">
                       <button
                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                         disabled={currentPage === 1}
                         className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Sebelumnya
                       </button>
                       <button
                         onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredPermohonan.length / itemsPerPage), p + 1))}
                         disabled={currentPage >= Math.ceil(filteredPermohonan.length / itemsPerPage)}
                         className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         Seterusnya
                       </button>
                     </div>
                   </div>
                )}
             </div>
          </div>
       )}

       
       

       {activeTab === 'MARKAH' && (
          <div className="space-y-6 animate-in fade-in">
             <PentadbirView />
          </div>
       )}

       {editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => setEditCandidate(null)}
         />
       )}

       {showAddModal && (
         <AddCandidateModal 
            onClose={() => setShowAddModal(false)} 
         />
       )}
    </div>
  );
}

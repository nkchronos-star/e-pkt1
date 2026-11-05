import { useState, useEffect, useRef } from 'react';
import { useAppContext, isDateActive, getTodayMalaysia, isOfferExpired, formatIsoToMalayDate, parseMalayDateToIso, DEFAULT_TAHFIZ_ITEMS, ensureTahfizRubrics } from '../../store';
import { LogOut, Printer, Users, FileSignature, CheckSquare, Settings, Lock, Unlock, CheckCircle, XCircle, Trash2, Edit, BarChart2, Link as LinkIcon, FileText, Download, Search, UserPlus, Upload, PenTool, Check, RotateCcw, Camera, AlertCircle, Award, TrendingUp, Trophy, ArrowUpDown, X, Eye, EyeOff, BookOpen, MessageCircle, ExternalLink, Calendar, AlertTriangle, Clock, Smartphone, Plus, Minus, School, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import BorangCetakPDF from './BorangCetakPDF';
import BorangPukalCetakPDF from './BorangPukalCetakPDF';
import SenaraiKeputusanCetakPDF from './SenaraiKeputusanCetakPDF';
import EditCandidateModal from './EditCandidateModal';
import AddCandidateModal from './AddCandidateModal';
import CandidateDetailModal from './CandidateDetailModal';
import SearchableCandidateSelect from './SearchableCandidateSelect';

import { PenilaianTahfizCard, PenilaianAkademikCard } from './PenilaianView';
import { BorangRubrikTahfizInteraktif, PanduanRubrikTahfizModal, createDefaultRubrik2026Data, TahfizRubrik2026Data } from './TahfizRubrik2026';
import { PengurusanSoalanAkademik, PortalUjianCalon } from './UjianAkademik';
import PengurusanMaklumatPaparan from './PengurusanMaklumatPaparan';
import { Candidate, Role, User, ApplicationSettings, AssessmentItem, TahfizRubricBand } from '../../types';
import { compressImageFile, compressSignatureFile, DEFAULT_TANDATANGAN_PENGETUA, DEFAULT_TANDATANGAN_PENGARAH } from '../../lib/imageUtils';
import { normalizeCandidateDaerahNegeri } from '../../lib/poskodMalaysia';
import { EQabulLogoIcon, EQabulBrand } from '../brand/EQabulBrand';

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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setErrorMsg('Sila masukkan kata laluan baru.');
      return;
    }
    if (newPassword.trim().length < 6) {
      setErrorMsg('Kata laluan mesti sekurang-kurangnya 6 aksara demi keselamatan.');
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
      setSuccessMsg(`Kata laluan untuk ${user.username} berjaya dikemaskini!`);
      setTimeout(() => {
        onClose();
      }, 1200);
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-800">{successMsg}</p>
            <p className="text-xs text-slate-500">Menutup tetingkap...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Kata Laluan Baru (Min 6 aksara)</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata laluan baru..."
                  className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800 bg-slate-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  title={showNewPassword ? 'Sembunyikan Kata Laluan' : 'Papar Kata Laluan'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Sahkan Kata Laluan Baru</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Ulang kata laluan baru..."
                  className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800 bg-slate-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  title={showConfirmPassword ? 'Sembunyikan Kata Laluan' : 'Papar Kata Laluan'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Simpan Kata Laluan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_SEC = 60;
const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minit

export default function AdminPanel() {
  const { currentUser, login, logout } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);

  // Kawalan Keselamatan: Perlindungan Brute-force (Had Percubaan & Kunci Sementara)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return parseInt(sessionStorage.getItem('eq_login_attempts') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [lockoutRemaining, setLockoutRemaining] = useState<number>(() => {
    try {
      const lockUntil = parseInt(sessionStorage.getItem('eq_login_lock_until') || '0', 10);
      const diff = Math.ceil((lockUntil - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  });

  // Pemasa Kira Detik Kunci Keselamatan
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          try {
            sessionStorage.removeItem('eq_login_lock_until');
            sessionStorage.setItem('eq_login_attempts', '0');
          } catch {}
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Kawalan Keselamatan: Log Keluar Automatik Selepas 30 Minit Tiada Aktiviti (Session Timeout)
  useEffect(() => {
    if (!currentUser) return;
    let timer: any;

    const resetInactivity = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        setError('Sesi tamat secara automatik demi keselamatan kerana tiada aktiviti selama 30 minit.');
      }, SESSION_INACTIVITY_TIMEOUT_MS);
    };

    resetInactivity();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetInactivity, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetInactivity));
    };
  }, [currentUser, logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      setError(`Sistem dikunci sementara demi keselamatan. Sila tunggu ${lockoutRemaining} saat.`);
      return;
    }

    const cleanU = username.trim();
    const cleanP = password.trim();

    if (!cleanU || !cleanP) {
      setError('Sila lengkapkan ID Pengguna dan Kata Laluan.');
      return;
    }

    setIsLoggingIn(true);
    setError('');
    try {
      const success = await login(cleanU, cleanP);
      if (success) {
        // Reset rekod percubaan gagal
        setFailedAttempts(0);
        try {
          sessionStorage.removeItem('eq_login_attempts');
          sessionStorage.removeItem('eq_login_lock_until');
        } catch {}
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        try {
          sessionStorage.setItem('eq_login_attempts', String(nextAttempts));
        } catch {}

        if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockUntil = Date.now() + LOCKOUT_DURATION_SEC * 1000;
          try {
            sessionStorage.setItem('eq_login_lock_until', String(lockUntil));
          } catch {}
          setLockoutRemaining(LOCKOUT_DURATION_SEC);
          setError(`Akses disekat sementara demi keselamatan! Anda telah melebihi ${MAX_LOGIN_ATTEMPTS} kali percubaan. Sila tunggu ${LOCKOUT_DURATION_SEC} saat sebelum mencuba lagi.`);
        } else {
          setError(`ID Pengguna atau Kata Laluan tidak sah. (Baki percubaan keselamatan: ${MAX_LOGIN_ATTEMPTS - nextAttempts})`);
        }
      }
    } catch (err: any) {
      setError('Ralat keselamatan semasa pengesahan log masuk. Sila cuba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!currentUser) {
    const isLocked = lockoutRemaining > 0;
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200 p-8 sm:p-12 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className={`w-20 h-20 ${isLocked ? 'bg-red-100 text-red-600 border-red-300' : 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200/60'} rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border transition-all`}>
             <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3 tracking-tight">Log Masuk Admin</h2>
          <p className="text-center text-slate-500 mb-8 text-sm sm:text-base font-medium">Sila masukkan ID Pengguna & Kata Laluan rasmi.</p>
          
          {isLocked && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-center animate-pulse">
              <p className="font-black text-sm">🔒 Akses Dikunci Sementara</p>
              <p className="text-xs mt-1 font-semibold">
                Demi keselamatan sistem, percubaan log masuk disekat selama <strong className="text-red-700 text-base">{lockoutRemaining}s</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wider uppercase">ID Pengguna</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLoggingIn || isLocked}
                className="w-full px-4 py-3.5 text-base border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800 disabled:opacity-50 disabled:bg-slate-100"
                placeholder="cth: admin"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 tracking-wider uppercase">Kata Laluan</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoggingIn || isLocked}
                  className="w-full pl-4 pr-12 py-3.5 text-base border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-slate-50 focus:bg-white font-medium text-slate-800 disabled:opacity-50 disabled:bg-slate-100"
                  placeholder="Kata Laluan"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  disabled={isLoggingIn || isLocked}
                  title={showPassword ? 'Sembunyikan Kata Laluan' : 'Papar Kata Laluan'}
                  aria-label={showPassword ? 'Sembunyikan Kata Laluan' : 'Papar Kata Laluan'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-xs sm:text-sm font-bold text-center bg-red-50 py-2.5 px-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}
            <button 
              type="submit" 
              disabled={isLoggingIn || isLocked}
              className={`w-full ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'} text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg text-base mt-2 flex items-center justify-center gap-2`}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengesahkan Keselamatan...
                </>
              ) : isLocked ? (
                `Sila Tunggu (${lockoutRemaining}s)`
              ) : (
                'Log Masuk'
              )}
            </button>
          </form>

          {/* Tag Keselamatan Sistem */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistem Dilindungi Protokol Keselamatan & Anti-Pencerobohan</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-0 pb-2 sm:pb-3 animate-in fade-in">
      {passwordModalUser && (
        <ChangePasswordModal user={passwordModalUser} onClose={() => setPasswordModalUser(null)} />
      )}

      {currentUser.role === 'TAHFIZ' && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/80 p-6 sm:p-10">
          <TahfizView />
        </div>
      )}
      {currentUser.role === 'AKADEMIK' && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/80 p-6 sm:p-10">
          <AkademikView />
        </div>
      )}
      {currentUser.role === 'PENTADBIR' && (
        <PentadbirPortal onOpenChangePassword={setPasswordModalUser} />
      )}
      {currentUser.role === 'SUPER_ADMIN' && (
        <SuperAdminView onOpenChangePassword={setPasswordModalUser} />
      )}
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
  const [rubrikData, setRubrikData] = useState<TahfizRubrik2026Data>(() =>
    createDefaultRubrik2026Data(null, currentUser?.name)
  );
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
  const [showFullRubricModal, setShowFullRubricModal] = useState(false);
  const lastLoadedIcRef = useRef<string>('');

  const items = ensureTahfizRubrics(settings.tahfizItems);
  
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
      if (nextC && !isCandidateEvaluated(nextC) && nextC.sedangDinilaiTahfiz?.dinilaiOleh !== currentUser?.name) {
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

  // Cadangan ulasan pantas mesra telefon untuk kemudahan penilai temuduga
  const quickPhrases = [
    '🌟 Bacaan fasih, lancar & bertajwid mantap',
    '📖 Hafazan baik & makhraj huruf tepat',
    '✨ Berkeyakinan tinggi & berpotensi cemerlang',
    '⚠️ Perlu bimbingan makhraj & hukum tajwid',
    '👍 Sahsiah diri & adab temuduga terpuji',
    '🎙️ Mempunyai suara jelas & alunan baik'
  ];

  // Muatkan markah, butiran rubrik 2026 dan draf ulasan calon secara selamat
  useEffect(() => {
    if (selectedCandidate && selectedCandidate !== lastLoadedIcRef.current) {
      lastLoadedIcRef.current = selectedCandidate;
      const targetC = candidates.find(c => c.ic === selectedCandidate);
      
      // Semak jika ada draf tempatan dalam localStorage / sessionStorage
      let localDraft: {
        markah?: Record<string, number>;
        catatan?: string;
        rubrikData?: TahfizRubrik2026Data;
      } | null = null;
      try {
        const raw = localStorage.getItem(`eqabul_draft_tahfiz_${selectedCandidate}`) || 
                    sessionStorage.getItem(`draft_tahfiz_${selectedCandidate}`);
        if (raw) {
          localDraft = JSON.parse(raw);
        }
      } catch {
        // ignore
      }

      if (targetC && targetC.markahTahfiz) {
        setMarkah(localDraft?.markah || targetC.markahTahfiz);
        setCatatan(localDraft?.catatan !== undefined ? localDraft.catatan : (targetC.markahTahfiz?.catatan || ''));
        setRubrikData(
          localDraft?.rubrikData || createDefaultRubrik2026Data(targetC, currentUser?.name)
        );
      } else if (localDraft) {
        setMarkah(localDraft.markah || {});
        setCatatan(localDraft.catatan || '');
        setRubrikData(
          localDraft.rubrikData || createDefaultRubrik2026Data(targetC, currentUser?.name)
        );
      } else {
        setMarkah({});
        setCatatan('');
        setRubrikData(createDefaultRubrik2026Data(targetC, currentUser?.name));
      }
    } else if (!selectedCandidate) {
      lastLoadedIcRef.current = '';
      setMarkah({});
      setCatatan('');
      setRubrikData(createDefaultRubrik2026Data(null, currentUser?.name));
    }
  }, [selectedCandidate]);

  // Simpan draf ulasan, markah dan butiran rubrik secara berterusan dalam localStorage & sessionStorage
  useEffect(() => {
    if (selectedCandidate) {
      try {
        const payload = JSON.stringify({ markah, catatan, rubrikData });
        localStorage.setItem(`eqabul_draft_tahfiz_${selectedCandidate}`, payload);
        sessionStorage.setItem(`draft_tahfiz_${selectedCandidate}`, payload);
      } catch {
        // ignore
      }
    }
  }, [selectedCandidate, markah, catatan, rubrikData]);

  const handleAppendPhrase = (phrase: string) => {
    if (isFormDisabled) return;
    setCatatan(prev => {
      const cleanPrev = prev.trim();
      const updated = cleanPrev ? `${cleanPrev}. ${phrase}` : phrase;
      if (selectedCandidate) {
        try {
          const payload = JSON.stringify({ markah, catatan: updated, rubrikData });
          localStorage.setItem(`eqabul_draft_tahfiz_${selectedCandidate}`, payload);
          sessionStorage.setItem(`draft_tahfiz_${selectedCandidate}`, payload);
        } catch {}
      }
      return updated;
    });
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
    
    const totalHafazan = rubrikData.bahagianHafazan.reduce(
      (sum, r) => sum + (r.tested ? r.ketepatan + r.tajwid + r.tanpaBantuan : 0),
      0
    );
    const totalTilawah =
      (Number(rubrikData.tilawahKelancaran) || 0) +
      (Number(rubrikData.tilawahTajwid) || 0) +
      (Number(rubrikData.tilawahTartil) || 0);
    const totalSahsiah = Math.round(
      rubrikData.sahsiahIndikator.reduce((sum, ind) => sum + (Number(ind.skor) || 0), 0) * 10
    ) / 10;

    const finalMarkah: Record<string, any> = {
      ...markah,
      hafazan: totalHafazan,
      tilawah: totalTilawah,
      sahsiah: Math.round(totalSahsiah),
      sahsiahTepat: totalSahsiah,
    };

    const jumlah = Math.round((totalHafazan + totalTilawah + totalSahsiah) * 10) / 10;
    const syorLabel =
      rubrikData.syorPanel === 'DISOKONG'
        ? 'Disokong'
        : rubrikData.syorPanel === 'TIDAK_DISOKONG'
        ? 'Tidak disokong'
        : 'Perlu semakan / penyelarasan';
    
    updateCandidate(currentC.ic, {
      markahTahfiz: {
        ...finalMarkah,
        jumlah: Math.round(jumlah),
        jumlahTepat: jumlah,
        syorPanel: rubrikData.syorPanel,
        butiranRubrik2026: rubrikData,
        dinilaiOleh: rubrikData.penilaiPertama?.trim() || currentUser?.name,
        penilaiKedua: rubrikData.penilaiKedua?.trim() || undefined,
        tarikhDinilai: currentC.markahTahfiz?.tarikhDinilai || new Date().toISOString(),
        catatan: catatan.trim() || `[Syor: ${syorLabel}]`
      },
      sedangDinilaiTahfiz: null // Lepaskan kunci setelah selesai disimpan
    });
    try {
      localStorage.removeItem(`eqabul_draft_tahfiz_${currentC.ic}`);
      sessionStorage.removeItem(`draft_tahfiz_${currentC.ic}`);
    } catch {
      // ignore
    }
    alert(`Penilaian Tahfiz bagi calon ${currentC.name} (Jumlah: ${jumlah}/100 · Syor: ${syorLabel}) berjaya disimpan!`);
    lastLoadedIcRef.current = '';
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
       {/* Modal Panduan Skor & Rubrik Rasmi KBT 2026 */}
       {showFullRubricModal && (
         <PanduanRubrikTahfizModal onClose={() => setShowFullRubricModal(false)} />
       )}

       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 rounded-xl">
             <FileSignature className="w-7 h-7 text-emerald-700" />
           </div>
           <div>
             <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Penilaian Temuduga Tahfiz Tingkatan 1</h3>
             <p className="text-xs sm:text-sm font-medium text-slate-500">Ujian Saringan Tilawah dan Hafazan KBT | Ambilan 2026 (Hafazan 70m · Tilawah 25m · Sahsiah 5m)</p>
           </div>
         </div>
         <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
           <button
             type="button"
             onClick={() => setShowFullRubricModal(true)}
             className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
           >
             <BookOpen className="w-4 h-4 text-emerald-600" />
             <span>📖 Panduan Skor &amp; Rubrik 2026</span>
           </button>
           <span className="font-bold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm">
             {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
         </div>
       </div>

       <div className="flex gap-2 sm:gap-4 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
         <button onClick={() => setActiveTab('NILAI')} className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'NILAI' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>1. Menilai Calon (Borang &amp; Rubrik KBT)</button>
         <button onClick={() => setActiveTab('SENARAI')} className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'SENARAI' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>2. Senarai Calon Dinilai</button>
       </div>

       {activeTab === 'NILAI' && (
         <div className="max-w-5xl animate-in fade-in space-y-6">
           {/* Searchable Dropdown Pemilihan Calon */}
           <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-emerald-100 shadow-sm">
             <label className="block text-xs sm:text-sm font-black text-slate-700 mb-2 uppercase tracking-wide flex flex-col sm:flex-row sm:items-center justify-between gap-1">
               <span>Pilih Calon Penilaian</span>
               <span className="text-[11px] font-semibold text-emerald-600 normal-case">
                 Taip nama atau No. Kad Pengenalan
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
               <div className="mt-3 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold">
                 <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                 <span>Semua calon yang layak telah selesai dinilai!</span>
               </div>
             )}
           </div>

           {currentC && (
             <div className="bg-emerald-50/60 rounded-3xl p-4 sm:p-8 border-2 border-emerald-200/80 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-emerald-100/40">
               
               {/* Amaran Jika Calon Sudah Dinilai (Tak Boleh Isi Kali Kedua) */}
               {isBlockedAlreadyEvaluated && (
                 <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 mb-5 flex items-start gap-3 shadow-xs">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="font-extrabold text-amber-900 text-sm sm:text-base">Calon Ini Telah Selesai Dinilai</h4>
                     <p className="text-xs sm:text-sm font-medium text-amber-800 mt-1 leading-relaxed">
                       Penilaian telah direkodkan oleh <strong>{currentC.markahTahfiz?.dinilaiOleh || 'Penilai'}</strong> pada {new Date(currentC.markahTahfiz?.tarikhDinilai || '').toLocaleDateString('ms-MY')} dengan jumlah markah <strong>{currentC.markahTahfiz?.jumlah}</strong>.
                       <br/>
                       Calon tidak dibenarkan dinilai kali kedua bagi mengelakkan pertindihan data.
                     </p>
                   </div>
                 </div>
               )}

               {/* Amaran Jika Calon Sedang Dinilai oleh Guru Lain Secara Serentak */}
               {isBeingEvaluatedByOther && (
                 <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 mb-5 flex items-start gap-3 shadow-xs">
                   <Lock className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="font-extrabold text-red-900 text-sm sm:text-base">Sedang Dinilai oleh Penilai Lain</h4>
                     <p className="text-xs sm:text-sm font-medium text-red-800 mt-1 leading-relaxed">
                       Calon ini sedang dinilai oleh <strong>{currentC.sedangDinilaiTahfiz?.dinilaiOleh}</strong>. Anda tidak dibenarkan mengisi markah untuk calon yang sama secara serentak bagi mengelakkan konflik markah.
                     </p>
                   </div>
                 </div>
               )}

               {/* KAD MAKLUMAT CALON MESRA TELEFON DENGAN BUTANG LIHAT PROFIL LENGKAP */}
               <div className="mb-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col gap-4">
                 <div className="flex items-start gap-4">
                   {/* Foto Calon - Tap untuk Buka Maklumat Penuh */}
                   <div 
                     onClick={() => setDetailCandidate(currentC)}
                     className="w-20 h-26 sm:w-24 sm:h-32 rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm flex items-center justify-center bg-slate-100 cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all group relative shrink-0"
                     title="Ketik untuk lihat profil lengkap calon"
                   >
                     {currentC.gambarUrl ? (
                       <img src={currentC.gambarUrl} alt={currentC.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
                     ) : (
                       <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                         <Users className="w-7 h-7 mb-1" />
                         <span className="text-[9px] font-bold uppercase">Tiada Gambar</span>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white p-1 text-center">
                       <Eye className="w-5 h-5 drop-shadow mb-0.5" />
                       <span className="text-[9px] font-bold">Ketik Lihat</span>
                     </div>
                   </div>

                   {/* Maklumat Utama Calon */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 flex-wrap mb-1">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                         Calon Temuduga
                       </span>
                       {currentC.jantina && (
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${currentC.jantina === 'Lelaki' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-pink-50 text-pink-700 border border-pink-200'}`}>
                           {currentC.jantina}
                         </span>
                       )}
                     </div>

                     <h4 className="font-black text-lg sm:text-2xl text-slate-900 leading-tight truncate" title={currentC.name}>
                       {currentC.name}
                     </h4>

                     <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 text-xs">
                       <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                         IC: {currentC.ic}
                       </span>
                       {currentC.namaSekolahRendah && (
                         <span className="font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 truncate max-w-[200px]" title={currentC.namaSekolahRendah}>
                           <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                           <span className="truncate">{currentC.namaSekolahRendah}</span>
                         </span>
                       )}
                     </div>

                     {/* Ringkasan Pantas UPKK jika ada */}
                     {currentC.upkk && (
                       <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] font-semibold text-slate-600">
                         <span className="text-slate-400 font-bold">UPKK:</span>
                         <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold border border-amber-200">
                           Al-Quran: {currentC.upkk.alquran || '-'}
                         </span>
                         {currentC.upkk.bahasaarab && (
                           <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                             B. Arab: {currentC.upkk.bahasaarab}
                           </span>
                         )}
                         {currentC.upkk.jawikhat && (
                           <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                             Jawi: {currentC.upkk.jawikhat}
                           </span>
                         )}
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Butang Pintas Membuka Modal Maklumat Penuh Calon (Profil, UPKK, Dokumen) */}
                 <button
                   type="button"
                   onClick={() => setDetailCandidate(currentC)}
                   className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:brightness-105 active:scale-[0.98] transition"
                 >
                   <BookOpen className="w-4 h-4" />
                   <span>Lihat Maklumat Lengkap Calon (Profil, UPKK, PBD & Dokumen Sijil)</span>
                 </button>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* BORANG PENILAIAN & RUBRIK TEMUDUGA TAHFIZ TINGKATAN 1 (AMBILAN 2026) */}
                  <BorangRubrikTahfizInteraktif
                    candidate={currentC}
                    evaluatorName={currentUser?.name || ''}
                    isFormDisabled={isFormDisabled}
                    markah={markah}
                    setMarkah={setMarkah}
                    catatan={catatan}
                    setCatatan={setCatatan}
                    rubrikData={rubrikData}
                    setRubrikData={setRubrikData}
                    onOpenGuideline={() => setShowFullRubricModal(true)}
                  />
                  
                  {/* BAHAGIAN ULASAN BERDASARKAN BUKTI DENGAN CADANGAN PANTAS & DRAF SELAMAT */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-100/80 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide">
                        Ulasan Berdasarkan Bukti / Catatan Panel Penilai
                      </label>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Draf ulasan &amp; rubrik kekal selamat tersimpan
                      </span>
                    </div>

                    {/* Cadangan Frasa Ulasan Pantas (Ketik terus masuk teks tanpa perlu taip panjang di telefon) */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Cadangan Ulasan Pantas (Ketik untuk tambah):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickPhrases.map((phrase, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isFormDisabled}
                            onClick={() => handleAppendPhrase(phrase)}
                            className="text-left text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea 
                        rows={3} 
                        disabled={isFormDisabled}
                        value={catatan} 
                        onChange={e => {
                          const val = e.target.value;
                          setCatatan(val);
                          if (selectedCandidate) {
                            try {
                              const payload = JSON.stringify({ markah, catatan: val, rubrikData });
                              localStorage.setItem(`eqabul_draft_tahfiz_${selectedCandidate}`, payload);
                              sessionStorage.setItem(`draft_tahfiz_${selectedCandidate}`, payload);
                            } catch {}
                          }
                        }} 
                        placeholder="Masukkan ulasan berdasarkan bukti pemerhatian atau ketik cadangan pantas di atas..."
                        className={`w-full p-3 sm:p-4 rounded-xl border-2 text-sm sm:text-base font-medium text-slate-800 transition-all ${
                          isFormDisabled 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
                        }`}
                      />
                    </div>

                    {/* Status Keselamatan Draf (Menjamin Ulasan Tidak Hilang) */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Draf ulasan &amp; markah rubrik tersimpan automatik di peranti</span>
                      </div>
                      <span className="text-slate-400 font-mono">{catatan.length} aksara</span>
                    </div>
                  </div>

                  {/* BUTANG SIMPAN BESAR & MESRA SKRIN SENTUH */}
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isFormDisabled}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        isFormDisabled
                          ? 'bg-slate-400 text-white cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-105 active:scale-[0.98] text-white shadow-emerald-700/30'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      <span>
                        {isBlockedAlreadyEvaluated 
                          ? 'Telah Selesai Dinilai - Tidak Boleh Diisi Semula' 
                          : isBeingEvaluatedByOther 
                          ? 'Sedang Dinilai oleh Penilai Lain' 
                          : isEditingSameDay 
                          ? 'Kemaskini Maklumat Penilaian Tahfiz' 
                          : 'Simpan Maklumat Penilaian Tahfiz'}
                      </span>
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
                             <div 
                               onClick={() => setDetailCandidate(c)}
                               className="w-12 h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all group relative shrink-0 flex items-center justify-center bg-slate-100"
                               title="Klik untuk lihat maklumat calon"
                             >
                               {c.gambarUrl ? (
                                 <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
                               ) : (
                                 <div className="flex flex-col items-center justify-center text-slate-400">
                                   <Users className="w-5 h-5 mb-1" />
                                 </div>
                               )}
                               <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                 <Eye className="w-4 h-4 text-white drop-shadow" />
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <button 
                               type="button"
                               onClick={() => setDetailCandidate(c)}
                               className="font-bold text-slate-900 hover:text-emerald-700 hover:underline transition text-left block"
                               title={`Klik untuk lihat maklumat ${c.name}`}
                             >
                               {c.name}
                             </button>
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

       {detailCandidate && (
         <CandidateDetailModal 
            candidate={detailCandidate} 
            onClose={() => setDetailCandidate(null)} 
         />
       )}
    </div>
  );
}


// ================= AKADEMIK VIEW =================
function AkademikRow({ candidate, updateCandidate, resetCandidateExamMark, currentUser, akademikItems, index, onLaunchExam }: any) {
  // Calon dianggap telah dinilai jika sudah ada markah disimpan atau nama penilai
  const isAlreadyEvaluated = Boolean(
    candidate.markahAkademik && 
    (candidate.markahAkademik.jumlah !== undefined || candidate.markahAkademik.dinilaiOleh) &&
    (candidate.markahAkademik.jumlah > 0 || candidate.markahAkademik.dinilaiOleh)
  );

  const [markah, setMarkah] = useState<Record<string, number>>(() => {
     const init: Record<string, number> = {};
     akademikItems.forEach((i: any) => {
        let val = candidate.markahAkademik?.[i.id];
        if (val === undefined && (i.id === 'sains' || i.name?.toLowerCase().includes('sains'))) {
          val = candidate.markahAkademik?.sains ?? candidate.markahAkademik?.a_1791595296044;
        }
        val = val ?? 0;
        if (typeof val === 'number' && i.weight && val > i.weight) {
          val = i.weight;
        }
        init[i.id] = val;
     });
     return init;
  });

  const draftKey = `eqabul_draft_akademik_${candidate.ic}`;

  const [isLocked, setIsLocked] = useState<boolean>(isAlreadyEvaluated);
  const [isSaved, setIsSaved] = useState<boolean>(isAlreadyEvaluated);
  const [catatan, setCatatan] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(`eqabul_draft_akademik_${candidate.ic}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.catatan !== undefined) return parsed.catatan;
      }
    } catch {}
    return candidate.markahAkademik?.catatan || '';
  });

  // Kemas kini secara langsung (Real-time Sync) apabila calon selesai menjawab Ujian Akademik Atas Talian (Auto-Skor)
  useEffect(() => {
    if (candidate.markahAkademik) {
      const nextMarkah: Record<string, number> = {};
      akademikItems.forEach((i: any) => {
        let val = candidate.markahAkademik?.[i.id];
        if (val === undefined && (i.id === 'sains' || i.name?.toLowerCase().includes('sains'))) {
          val = candidate.markahAkademik?.sains ?? candidate.markahAkademik?.a_1791595296044;
        }
        val = val ?? 0;
        if (typeof val === 'number' && i.weight && val > i.weight) {
          val = i.weight;
        }
        nextMarkah[i.id] = val;
      });
      setMarkah(nextMarkah);
      setCatatan(candidate.markahAkademik.catatan || '');
      const hasEval = Boolean(
        (candidate.markahAkademik.jumlah !== undefined && candidate.markahAkademik.jumlah > 0) ||
        candidate.markahAkademik.dinilaiOleh
      );
      if (hasEval) {
        setIsLocked(true);
        setIsSaved(true);
      }
    }
  }, [candidate.markahAkademik, akademikItems]);

  const handleSave = () => {
    const jumlah = akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0);
    const cleanedPrev = { ...(candidate.markahAkademik || {}) };
    delete cleanedPrev.autoGraded;
    delete cleanedPrev.jawapanCalon;
    delete cleanedPrev.butiranSkor;
    updateCandidate(candidate.ic, {
      markahAkademik: {
        ...cleanedPrev,
        ...markah,
        jumlah,
        catatan: catatan.trim(),
        dinilaiOleh: currentUser?.name || 'Penyelaras Akademik',
        tarikhDinilai: new Date().toISOString()
      }
    });
    try {
      localStorage.removeItem(draftKey);
    } catch {}
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900">{candidate.name}</span>
          {candidate.markahAkademik?.autoGraded && (
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              ⚡ Auto-Skor Ujian
            </span>
          )}
        </div>
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
      <td className="px-3 py-3 border-b border-slate-100 text-center min-w-[160px]">
        {isLocked ? (
          <span className="text-xs text-slate-600 italic block line-clamp-2" title={catatan}>{catatan || '-'}</span>
        ) : (
          <input 
            type="text" 
            value={catatan} 
            onChange={e => {
              const val = e.target.value;
              setCatatan(val);
              try {
                localStorage.setItem(draftKey, JSON.stringify({ markah, catatan: val }));
              } catch {}
            }} 
            placeholder="Catatan penilai..." 
            className="w-full border border-blue-200 rounded-lg p-1.5 text-xs text-slate-800 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-400 outline-none"
          />
        )}
      </td>
      <td className="px-4 py-3 border-b border-slate-100 text-center">
        {isLocked ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Selesai Dinilai
            </span>
            {candidate.markahAkademik?.dinilaiOleh && (
              <span className="text-[10px] text-slate-500 font-medium max-w-[140px] truncate" title={`Dinilai oleh: ${candidate.markahAkademik.dinilaiOleh}`}>
                {candidate.markahAkademik.dinilaiOleh}
              </span>
            )}
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsLocked(false);
                  setIsSaved(false);
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition cursor-pointer"
              >
                <Unlock className="w-3 h-3 text-slate-400" /> Buka Kunci
              </button>
              {candidate.markahAkademik?.autoGraded && resetCandidateExamMark && (
                <button
                  type="button"
                  onClick={() => resetCandidateExamMark(candidate.ic)}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md transition cursor-pointer"
                  title="Kembalikan markah asal sebelum ujian atas talian"
                >
                  Reset Ujian
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button 
               onClick={handleSave} 
               className="w-full px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95 cursor-pointer"
            >
              Simpan Manual
            </button>
            {onLaunchExam && (
              <button
                type="button"
                onClick={() => onLaunchExam(candidate.ic)}
                className="w-full px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                title="Buka skrin ujian akademik untuk calon ini"
              >
                Buka Ujian Calon
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function AkademikMobileCard({ candidate, updateCandidate, resetCandidateExamMark, currentUser, akademikItems, index, onOpenDetail, onLaunchExam }: any) {
  const isAlreadyEvaluated = Boolean(
    candidate.markahAkademik && 
    (candidate.markahAkademik.jumlah !== undefined || candidate.markahAkademik.dinilaiOleh) &&
    (candidate.markahAkademik.jumlah > 0 || candidate.markahAkademik.dinilaiOleh)
  );

  const [markah, setMarkah] = useState<Record<string, number>>(() => {
     const init: Record<string, number> = {};
     akademikItems.forEach((i: any) => {
        let val = candidate.markahAkademik?.[i.id];
        if (val === undefined && (i.id === 'sains' || i.name?.toLowerCase().includes('sains'))) {
          val = candidate.markahAkademik?.sains ?? candidate.markahAkademik?.a_1791595296044;
        }
        val = val ?? 0;
        if (typeof val === 'number' && i.weight && val > i.weight) {
          val = i.weight;
        }
        init[i.id] = val;
     });
     return init;
  });

  const draftKey = `eqabul_draft_akademik_${candidate.ic}`;

  const [isLocked, setIsLocked] = useState<boolean>(isAlreadyEvaluated);
  const [catatan, setCatatan] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(`eqabul_draft_akademik_${candidate.ic}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.catatan !== undefined) return parsed.catatan;
      }
    } catch {}
    return candidate.markahAkademik?.catatan || '';
  });

  useEffect(() => {
    if (candidate.markahAkademik) {
      const nextMarkah: Record<string, number> = {};
      akademikItems.forEach((i: any) => {
        let val = candidate.markahAkademik?.[i.id];
        if (val === undefined && (i.id === 'sains' || i.name?.toLowerCase().includes('sains'))) {
          val = candidate.markahAkademik?.sains ?? candidate.markahAkademik?.a_1791595296044;
        }
        val = val ?? 0;
        if (typeof val === 'number' && i.weight && val > i.weight) {
          val = i.weight;
        }
        nextMarkah[i.id] = val;
      });
      setMarkah(nextMarkah);
      setCatatan(candidate.markahAkademik.catatan || '');
      const hasEval = Boolean(
        (candidate.markahAkademik.jumlah !== undefined && candidate.markahAkademik.jumlah > 0) ||
        candidate.markahAkademik.dinilaiOleh
      );
      if (hasEval) {
        setIsLocked(true);
      }
    }
  }, [candidate.markahAkademik, akademikItems]);

  const adjustMarkah = (field: string, delta: number, maxWeight: number) => {
    if (isLocked) return;
    const cur = markah[field] ?? 0;
    let next = cur + delta;
    if (next > maxWeight) next = maxWeight;
    if (next < 0) next = 0;
    setMarkah(prev => ({ ...prev, [field]: next }));
  };

  const handleSave = () => {
    const jumlah = akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0);
    const cleanedPrev = { ...(candidate.markahAkademik || {}) };
    delete cleanedPrev.autoGraded;
    delete cleanedPrev.jawapanCalon;
    delete cleanedPrev.butiranSkor;
    updateCandidate(candidate.ic, {
      markahAkademik: {
        ...cleanedPrev,
        ...markah,
        jumlah,
        catatan: catatan.trim(),
        dinilaiOleh: currentUser?.name || 'Penyelaras Akademik',
        tarikhDinilai: new Date().toISOString()
      }
    });
    try {
      localStorage.removeItem(draftKey);
    } catch {}
    setIsLocked(true);
  };

  const total = akademikItems.reduce((acc: number, item: any) => acc + (markah[item.id] || 0), 0);
  const maxTotal = akademikItems.reduce((acc: number, item: any) => acc + (item.weight || 0), 0);

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
      isLocked 
        ? 'bg-slate-50/70 border-slate-200' 
        : 'bg-white border-blue-200 shadow-sm'
    }`}>
      {/* Header Kad Calon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight truncate">
                {candidate.name}
              </h4>
              {candidate.markahAkademik?.autoGraded && (
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                  ⚡ Auto-Skor
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 flex-wrap">
              <span className="font-mono font-bold">{candidate.ic}</span>
              {candidate.jantina && (
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                  {candidate.jantina}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Butang Lihat Maklumat Calon */}
        <button
          type="button"
          onClick={() => onOpenDetail(candidate)}
          className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0"
          title="Lihat maklumat calon"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Profil</span>
        </button>
      </div>

      {/* Input Subjek Akademik Berstepper Sentuh */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {akademikItems.map((item: any) => {
          const val = markah[item.id] ?? 0;
          return (
            <div key={item.id} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase">{item.name}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">/{item.weight}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isLocked || val <= 0}
                  onClick={() => adjustMarkah(item.id, -1, item.weight)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 disabled:opacity-40 transition active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isLocked}
                  value={markah[item.id] !== undefined ? markah[item.id] : ''}
                  onChange={e => {
                    if (isLocked) return;
                    let v = parseInt(e.target.value);
                    if (isNaN(v)) {
                      const copy = { ...markah };
                      delete copy[item.id];
                      setMarkah(copy);
                      return;
                    }
                    if (v > item.weight) v = item.weight;
                    if (v < 0) v = 0;
                    setMarkah(prev => ({ ...prev, [item.id]: v }));
                  }}
                  className="flex-1 min-w-0 h-9 rounded-lg border text-center font-black text-lg bg-white text-slate-900 border-blue-200 focus:border-blue-500"
                />
                <button
                  type="button"
                  disabled={isLocked || val >= item.weight}
                  onClick={() => adjustMarkah(item.id, 1, item.weight)}
                  className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 disabled:opacity-40 transition active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jumlah & Ulasan */}
      <div className="flex items-center justify-between bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
        <span className="text-xs font-bold text-blue-900">Jumlah Markah Akademik:</span>
        <span className="text-lg font-black text-blue-700">{total} / {maxTotal}</span>
      </div>

      <div className="space-y-1">
        <input
          type="text"
          disabled={isLocked}
          value={catatan}
          onChange={e => {
            const val = e.target.value;
            setCatatan(val);
            try {
              localStorage.setItem(draftKey, JSON.stringify({ markah, catatan: val }));
            } catch {}
          }}
          placeholder="Catatan penilai akademik..."
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-blue-500"
        />
      </div>

      {/* Tindakan Simpan / Terkunci */}
      <div className="pt-1">
        {isLocked ? (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Selesai Dinilai
            </span>
            <div className="flex items-center gap-2">
              {candidate.markahAkademik?.autoGraded && resetCandidateExamMark && (
                <button
                  type="button"
                  onClick={() => resetCandidateExamMark(candidate.ic)}
                  className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  Reset Ujian
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsLocked(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" /> Buka Kunci
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Manual</span>
            </button>
            {onLaunchExam && (
              <button
                type="button"
                onClick={() => onLaunchExam(candidate.ic)}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Ujian Calon</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AkademikView() {
  const { candidates, updateCandidate, resetCandidateExamMark, currentUser, settings } = useAppContext();
  const [activeSubTab, setActiveSubTab] = useState<'SOALAN' | 'MARKAH' | 'KIOSK'>('SOALAN');
  const [kioskCandidateIc, setKioskCandidateIc] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
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

  const handleLaunchCandidateExam = (ic?: string) => {
    setKioskCandidateIc(ic);
    setActiveSubTab('KIOSK');
  };

  return (
    <div className="animate-in fade-in space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-100 rounded-xl">
             <CheckSquare className="w-7 h-7 text-blue-700" />
           </div>
           <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Panel Guru Akademik & Ujian Temuduga</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Bina soalan ujian temuduga &amp; markah calon akan masuk secara automatik ke dalam rekod akademik
              </p>
           </div>
         </div>
         <span className="font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 self-start sm:self-auto text-xs sm:text-sm">
           {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
         </span>
       </div>

       {/* Bar Navigasi Fungsi Guru Akademik */}
       <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
         <button
           type="button"
           onClick={() => setActiveSubTab('SOALAN')}
           className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
             activeSubTab === 'SOALAN'
               ? 'bg-blue-600 text-white shadow-sm'
               : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
           }`}
         >
           <BookOpen className="w-4 h-4" />
           <span>1. Bina Soalan Ujian (Auto-Skor)</span>
           <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${activeSubTab === 'SOALAN' ? 'bg-blue-800 text-white' : 'bg-white text-slate-700'}`}>
             {(settings.soalanAkademik || []).length} Soalan
           </span>
         </button>

         <button
           type="button"
           onClick={() => setActiveSubTab('MARKAH')}
           className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
             activeSubTab === 'MARKAH'
               ? 'bg-blue-600 text-white shadow-sm'
               : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
           }`}
         >
           <CheckSquare className="w-4 h-4" />
           <span>2. Rekod Markah Akademik Calon</span>
           <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${activeSubTab === 'MARKAH' ? 'bg-blue-800 text-white' : 'bg-white text-slate-700'}`}>
             {eligibleCandidates.filter(c => c.markahAkademik && (c.markahAkademik.jumlah > 0 || c.markahAkademik.dinilaiOleh)).length}/{eligibleCandidates.length}
           </span>
         </button>

         <button
           type="button"
           onClick={() => {
             setKioskCandidateIc(undefined);
             setActiveSubTab('KIOSK');
           }}
           className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
             activeSubTab === 'KIOSK'
               ? 'bg-emerald-600 text-white shadow-sm'
               : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
           }`}
         >
           <Sparkles className="w-4 h-4" />
           <span>3. Bilik / Kiosk Ujian Calon</span>
         </button>
       </div>

       {/* TAB 1: PEMBINA SOALAN UJIAN TEMUDUGA (AUTO-SKOR) */}
       {activeSubTab === 'SOALAN' && (
         <PengurusanSoalanAkademik onLaunchCandidateExam={handleLaunchCandidateExam} />
       )}

       {/* TAB 3: KIOSK / SKRIN UJIAN CALON */}
       {activeSubTab === 'KIOSK' && (
         <div className="space-y-4">
           <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
             <div>
               <h4 className="font-bold text-emerald-950 text-sm">Mod Kiosk Ujian Calon</h4>
               <p className="text-xs text-emerald-800">
                 Calon boleh terus menjawab soalan di skrin ini. Sebaik sahaja calon menghantar jawapan, markah akan terus masuk ke dalam <strong>Rekod Markah Akademik Calon</strong> secara automatik.
               </p>
             </div>
             <button
               type="button"
               onClick={() => setActiveSubTab('MARKAH')}
               className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shrink-0 cursor-pointer"
             >
               Lihat Jadual Markah
             </button>
           </div>
           <PortalUjianCalon
             preselectedIc={kioskCandidateIc}
             onCompleted={() => setActiveSubTab('MARKAH')}
           />
         </div>
       )}

       {/* TAB 2: REKOD MARKAH AKADEMIK CALON */}
       {activeSubTab === 'MARKAH' && (
       <>
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

       {/* 1. PAPARAN KAD TELEFON (MESRA PENGGUNA PHONE) */}
       <div className="block md:hidden space-y-4 mb-10">
         {eligibleCandidates.length === 0 ? (
           <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 text-slate-500 font-medium">
             Tiada calon yang layak temuduga buat masa ini.
           </div>
         ) : filteredCandidates.length === 0 ? (
           <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 text-slate-500 font-medium">
             Tiada calon sepadan dengan carian "{searchQuery}"
           </div>
         ) : (
           filteredCandidates.map((c, idx) => (
             <AkademikMobileCard
               key={c.id || c.ic}
               candidate={c}
               updateCandidate={updateCandidate}
               resetCandidateExamMark={resetCandidateExamMark}
               currentUser={currentUser}
               akademikItems={akademikItems}
               index={idx}
               onOpenDetail={setDetailCandidate}
               onLaunchExam={handleLaunchCandidateExam}
             />
           ))
         )}
       </div>

       {/* 2. PAPARAN JADUAL KOMPUTER / TABLET (DESKTOP VIEW) */}
       <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-10">
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
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Catatan Penilai</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tindakan</th>
                   </tr>
                </thead>
                <tbody>
                   {eligibleCandidates.length === 0 ? (
                      <tr>
                         <td colSpan={akademikItems.length + 5} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
                            Tiada calon yang layak temuduga buat masa ini.<br/>
                            <span className="text-sm mt-2 inline-block text-slate-400">Sistem hanya memaparkan calon yang LAYAK untuk dinilai.</span>
                         </td>
                      </tr>
                   ) : filteredCandidates.length === 0 ? (
                      <tr>
                         <td colSpan={akademikItems.length + 5} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/30">
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
                         <AkademikRow key={c.id || c.ic} candidate={c} updateCandidate={updateCandidate} resetCandidateExamMark={resetCandidateExamMark} currentUser={currentUser} akademikItems={akademikItems} index={idx} onLaunchExam={handleLaunchCandidateExam} />
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </div>
       </>
       )}

       {detailCandidate && (
         <CandidateDetailModal 
            candidate={detailCandidate} 
            onClose={() => setDetailCandidate(null)} 
         />
       )}
    </div>
  );
}


// ================= PENTADBIR VIEW =================

function AnalisisKemasukan({ candidates }: { candidates: any[] }) {
  const { settings, updateCandidate, currentUser } = useAppContext();
  const [analisisSection, setAnalisisSection] = useState<'TAHUN_SEMASA' | 'NEGERI_DAERAH'>('TAHUN_SEMASA');
  const [isSyncingDaerah, setIsSyncingDaerah] = useState(false);
  const [syncDaerahMsg, setSyncDaerahMsg] = useState('');

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

  const terbatal = ditawarkan.filter(c => c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings)));
  const terbatalL = terbatal.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const terbatalP = terbatal.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const belum = ditawarkan.filter(c => !c.maklumBalasTawaran && !isOfferExpired(c, settings));
  const belumL = belum.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const belumP = belum.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  // Gunakan normalizeCandidateDaerahNegeri supaya variasi ejaan daerah (cth: Jengka, Kota Gelanggi, Kuala Lipis) disatukan dengan tepat
  const demografiData = permohonan.reduce((acc, c) => {
    const norm = normalizeCandidateDaerahNegeri(c);
    const n = norm.negeri || 'TIADA MAKLUMAT';
    const d = norm.daerah || 'TIADA MAKLUMAT';
    if (!acc[n]) acc[n] = {};
    if (!acc[n][d]) acc[n][d] = { jumlah: 0, layak: 0, tawaran: 0, terima: 0 };
    acc[n][d].jumlah++;
    if (c.statusTemuduga === 'LAYAK') acc[n][d].layak++;
    if (c.statusTawaran === 'BERJAYA') acc[n][d].tawaran++;
    if (c.maklumBalasTawaran === 'TERIMA') acc[n][d].terima++;
    return acc;
  }, {} as Record<string, Record<string, { jumlah: number; layak: number; tawaran: number; terima: number }>>);

  const sortedNegeri = Object.keys(demografiData).sort();

  // Kira berapa rekod calon sedia ada yang mempunyai ejaan daerah/negeri berbeza daripada standard poskod
  const unstandardizedCandidates = permohonan.filter(c => {
    const norm = normalizeCandidateDaerahNegeri(c);
    return (
      norm.daerah !== 'TIADA MAKLUMAT' &&
      ((c.daerah || '').trim().toUpperCase() !== norm.daerah ||
        (c.negeri || '').trim().toUpperCase() !== norm.negeri)
    );
  });

  const handleSyncStandardDaerah = async () => {
    if (unstandardizedCandidates.length === 0) return;
    setIsSyncingDaerah(true);
    setSyncDaerahMsg('');
    try {
      let count = 0;
      for (const c of unstandardizedCandidates) {
        const norm = normalizeCandidateDaerahNegeri(c);
        await updateCandidate(c.ic, {
          daerah: norm.daerah,
          negeri: norm.negeri,
        });
        count++;
      }
      setSyncDaerahMsg(`${count} rekod pemohon telah diselaraskan mengikut nama Daerah & Negeri rasmi!`);
      setTimeout(() => setSyncDaerahMsg(''), 5000);
    } catch (err) {
      console.error('Gagal menyelaraskan daerah:', err);
    } finally {
      setIsSyncingDaerah(false);
    }
  };

  const handleExportDemografiCSV = () => {
    const headers = ['Bil', 'Negeri', 'Daerah', 'Jumlah Permohonan', 'Layak Temuduga', 'Ditawarkan', 'Terima Tawaran'];
    const rows: any[] = [];
    let bil = 1;
    sortedNegeri.forEach(negeri => {
      const daerahs = Object.keys(demografiData[negeri]).sort();
      daerahs.forEach(daerah => {
        const row = demografiData[negeri][daerah];
        rows.push([bil++, negeri, daerah, row.jumlah, row.layak, row.tawaran, row.terima]);
      });
    });
    downloadCSV([headers, ...rows], `Analisis_Permohonan_Mengikut_Negeri_Daerah.csv`);
  };

  return (
    <div className="space-y-5">
      {/* MENU ANALISIS DI BAHAGIAN ATAS (Sticky / Frozen) */}
      <div
        style={{ top: 'calc(var(--header-height, 116px) + 56px)' }}
        className="sticky z-30 bg-[#f4f7ee]/95 backdrop-blur-md py-1.5"
      >
        <div className="bg-white/95 p-2 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              id: 'TAHUN_SEMASA',
              label: '1. Analisis Kemasukan Tahun Semasa',
              sub: 'Statistik permohonan, temuduga & tawaran',
              icon: BarChart2,
              iconBg: 'bg-purple-600 text-white',
            },
            {
              id: 'NEGERI_DAERAH',
              label: '2. Statistik Permohonan Mengikut Negeri dan Daerah',
              sub: 'Pecahan calon mengikut negeri & daerah rasmi',
              icon: School,
              iconBg: 'bg-emerald-600 text-white',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = analisisSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAnalisisSection(item.id as any)}
                className={`relative w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium border border-slate-200/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${item.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className={`text-xs sm:text-[13.5px] leading-snug ${isActive ? 'font-extrabold text-white' : 'font-semibold text-slate-800'}`}>
                    {item.label}
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KANDUNGAN ANALISIS TERUS MENGIKUT PILIHAN MENU (Penuh Lebar) */}
      <div className="space-y-6">
          {analisisSection === 'TAHUN_SEMASA' && (
            <div className="animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-slate-500 font-bold mb-1.5 uppercase tracking-wide text-xs">Jumlah Permohonan</div>
                  <div className="text-4xl font-extrabold text-slate-800 mb-1">{permohonan.length}</div>
                  <div className="text-slate-500 text-xs font-semibold">(L: {permohonanL} / P: {permohonanP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-purple-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Layak Temuduga</div>
                  <div className="text-4xl font-extrabold text-purple-600 mb-1">{temuduga.length}</div>
                  <div className="text-purple-600/80 text-xs font-semibold">(L: {temudugaL} / P: {temudugaP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-blue-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Jumlah Ditawarkan</div>
                  <div className="text-4xl font-extrabold text-blue-600 mb-1">{ditawarkan.length}</div>
                  <div className="text-blue-600/80 text-xs font-semibold">(L: {ditawarkanL} / P: {ditawarkanP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-emerald-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Tawaran Diterima</div>
                  <div className="text-4xl font-extrabold text-emerald-600 mb-1">{terima.length}</div>
                  <div className="text-emerald-600/80 text-xs font-semibold">(L: {terimaL} / P: {terimaP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-slate-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Tawaran Ditolak</div>
                  <div className="text-4xl font-extrabold text-slate-700 mb-1">{tolak.length}</div>
                  <div className="text-slate-500 text-xs font-semibold">(L: {tolakL} / P: {tolakP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/20 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-rose-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Terbatal (Gagal Respon)</div>
                  <div className="text-4xl font-extrabold text-rose-600 mb-1">{terbatal.length}</div>
                  <div className="text-rose-600/80 text-xs font-semibold">(L: {terbatalL} / P: {terbatalP})</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm text-center flex flex-col justify-center items-center">
                  <div className="text-amber-600 font-bold mb-1.5 uppercase tracking-wide text-xs">Menunggu Maklum Balas</div>
                  <div className="text-4xl font-extrabold text-amber-600 mb-1">{belum.length}</div>
                  <div className="text-amber-600/80 text-xs font-semibold">(L: {belumL} / P: {belumP})</div>
                </div>
              </div>
            </div>
          )}

          {analisisSection === 'NEGERI_DAERAH' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-end gap-2">
                {currentUser?.role === 'SUPER_ADMIN' && unstandardizedCandidates.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSyncStandardDaerah}
                    disabled={isSyncingDaerah}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    title="Kemas kini ejaan daerah & negeri calon sedia ada di dalam pangkalan data mengikut poskod"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>
                      {isSyncingDaerah
                        ? 'Menyelaraskan...'
                        : `Selaraskan ${unstandardizedCandidates.length} Rekod Daerah`}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExportDemografiCSV}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Muat Turun CSV</span>
                </button>
              </div>

              {syncDaerahMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syncDaerahMsg}</span>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-max">
                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                      <tr>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Negeri</th>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Daerah (Diselaraskan)</th>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Permohonan</th>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Layak Temuduga</th>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Ditawarkan</th>
                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Terima Tawaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sortedNegeri.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">Tiada data demografi.</td>
                        </tr>
                      ) : (
                        sortedNegeri.map((negeri) => {
                          const daerahs = Object.keys(demografiData[negeri]).sort();
                          return daerahs.map((daerah, idx) => (
                            <tr key={`${negeri}-${daerah}`} className="hover:bg-slate-50 transition-colors">
                              {idx === 0 ? (
                                <td className="px-4 py-3 border-r border-slate-100 font-extrabold text-slate-800 align-top" rowSpan={daerahs.length}>
                                  {negeri}
                                </td>
                              ) : null}
                              <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-50">{daerah}</td>
                              <td className="px-4 py-3 text-center font-extrabold text-slate-800 bg-slate-50/50">{demografiData[negeri][daerah].jumlah}</td>
                              <td className="px-4 py-3 text-center font-extrabold text-purple-600 bg-purple-50/30">{demografiData[negeri][daerah].layak}</td>
                              <td className="px-4 py-3 text-center font-extrabold text-blue-600 bg-blue-50/30">{demografiData[negeri][daerah].tawaran}</td>
                              <td className="px-4 py-3 text-center font-extrabold text-emerald-600 bg-emerald-50/30">{demografiData[negeri][daerah].terima}</td>
                            </tr>
                          ));
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export function downloadCSV(data: any[], filename: string) {
  try {
    const csvContent = "\uFEFF" + data.map(row => 
      row.map((cell: any) => {
        const val = cell === null || cell === undefined ? '' : String(cell);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(",")
    ).join("\r\n");

    const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Sokongan untuk IE / Edge lama jika ada
    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, safeFilename);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", safeFilename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 500);
  } catch (err) {
    console.error("Gagal muat turun CSV:", err);
  }
}

export function exportCandidatesCategoryCSV(
  list: Candidate[],
  filenamePrefix: string,
  tahfizMax: number,
  akademikMax: number
) {
  const jumlahMax = tahfizMax + akademikMax;
  const headers = [
    "Bil",
    "No. Kad Pengenalan",
    "Nama Calon",
    "Jantina",
    "Tarikh Lahir",
    "Tempat Lahir",
    "Sekolah Asal",
    "Daerah",
    "Negeri",
    "No. KP Bapa",
    "Nama Bapa",
    "Pekerjaan Bapa",
    "No. Tel Bapa",
    "No. KP Ibu",
    "Nama Ibu",
    "Pekerjaan Ibu",
    "No. Tel Ibu",
    "Gred UPKK Al-Quran",
    "Gred UPKK Bahasa Arab",
    "Gred UPKK Jawi & Khat",
    "Status Temuduga",
    "Markah Tahfiz",
    `Tahfiz Max (${tahfizMax})`,
    "Penilai Tahfiz",
    "Catatan Tahfiz",
    "Markah Akademik",
    `Akademik Max (${akademikMax})`,
    "Penilai Akademik",
    "Catatan Akademik",
    "Markah Keseluruhan",
    `Jumlah Max (${jumlahMax})`,
    "Markah Peratus (%)",
    "Status Tawaran",
    "Maklum Balas Tawaran"
  ];

  const rows = list.map((c, i) => {
    const t = Number(c.markahTahfiz?.jumlah || 0);
    const a = Number(c.markahAkademik?.jumlah || 0);
    const total = t + a;
    const pct = jumlahMax > 0 ? ((total / jumlahMax) * 100).toFixed(1) + '%' : '0%';
    return [
      i + 1,
      c.ic || '',
      c.name || '',
      c.jantina || '',
      c.tarikhLahir || '',
      c.tempatLahir || '',
      c.namaSekolahRendah || '',
      c.daerah || '',
      c.negeri || '',
      c.icBapa || '',
      c.namaBapa || '',
      c.pekerjaanBapa || '',
      c.telefonBapa || '',
      c.icIbu || '',
      c.namaIbu || '',
      c.pekerjaanIbu || '',
      c.telefonIbu || '',
      c.upkk?.alquran || '',
      c.upkk?.bahasaarab || '',
      c.upkk?.jawikhat || '',
      c.statusTemuduga || 'MENUNGGU',
      c.markahTahfiz?.jumlah !== undefined ? c.markahTahfiz.jumlah : 'Belum Dinilai',
      tahfizMax,
      c.markahTahfiz?.dinilaiOleh || '',
      c.markahTahfiz?.catatan || '',
      c.markahAkademik?.jumlah !== undefined ? c.markahAkademik.jumlah : 'Belum Dinilai',
      akademikMax,
      c.markahAkademik?.dinilaiOleh || '',
      c.markahAkademik?.catatan || '',
      total,
      jumlahMax,
      pct,
      c.statusTawaran || 'DALAM_PERTIMBANGAN',
      c.maklumBalasTawaran || ''
    ];
  });

  downloadCSV([headers, ...rows], `${filenamePrefix}_${list.length}_Calon.csv`);
}

function PentadbirView({ readOnly = false }: { readOnly?: boolean }) {
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);
  const [showPrintSenarai, setShowPrintSenarai] = useState<boolean>(false);
  const [isCsvSuccess, setIsCsvSuccess] = useState<boolean>(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);

  const { candidates, settings, updateCandidate, currentUser } = useAppContext();
  const isReadOnly = readOnly || currentUser?.role === 'PENTADBIR';
  const [filter, setFilter] = useState('LAYAK_TEMUDUGA');
  const [genderFilter, setGenderFilter] = useState<'SEMUA' | 'LELAKI' | 'PEREMPUAN'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'MARKAH_DESC' | 'MARKAH_ASC' | 'TAHFIZ_DESC' | 'AKADEMIK_DESC' | 'NAMA_ASC' | 'JANTINA_LELAKI_FIRST' | 'JANTINA_PEREMPUAN_FIRST'>('MARKAH_DESC');

  const tahfizMax = settings.tahfizItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 100;
  const akademikMax = settings.akademikItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 40;
  const jumlahMax = tahfizMax + akademikMax;

  // Helper untuk menentukan jantina secara tepat (fallback guna digit terakhir no KP jika kosong)
  const getCandidateGender = (c: Candidate): 'LELAKI' | 'PEREMPUAN' => {
    const raw = (c.jantina || '').toString().trim().toUpperCase();
    if (raw === 'LELAKI' || raw === 'L' || raw.includes('BANIN')) return 'LELAKI';
    if (raw === 'PEREMPUAN' || raw === 'P' || raw.includes('BANAT')) return 'PEREMPUAN';
    const digits = (c.ic || '').replace(/\D/g, '');
    if (digits.length >= 1) {
      const last = parseInt(digits.slice(-1), 10);
      if (!isNaN(last)) {
        return last % 2 === 0 ? 'PEREMPUAN' : 'LELAKI';
      }
    }
    return 'LELAKI';
  };

  // Helper untuk mendapatkan nilai nombor markah
  const getTahfizScore = (c: Candidate): number | null => {
    if (!c.markahTahfiz) return null;
    const val = Number(c.markahTahfiz.jumlah);
    return isNaN(val) ? null : val;
  };

  const getAkademikScore = (c: Candidate): number | null => {
    if (!c.markahAkademik) return null;
    let val = Number(c.markahAkademik.jumlah);
    if (isNaN(val)) return null;
    if (akademikMax > 0 && val > akademikMax) {
      val = akademikMax;
    }
    return val;
  };

  // 1. Kira ranking merit global bagi semua calon yang mempunyai markah
  const meritRankMap = new Map<string, number>();
  const allScoredCandidates = [...candidates]
    .filter(c => getTahfizScore(c) !== null || getAkademikScore(c) !== null)
    .sort((a, b) => {
      const aTotal = (getTahfizScore(a) ?? 0) + (getAkademikScore(a) ?? 0);
      const bTotal = (getTahfizScore(b) ?? 0) + (getAkademikScore(b) ?? 0);
      if (bTotal !== aTotal) return bTotal - aTotal;
      const aTahfiz = getTahfizScore(a) ?? 0;
      const bTahfiz = getTahfizScore(b) ?? 0;
      if (bTahfiz !== aTahfiz) return bTahfiz - aTahfiz;
      return (a.name || '').localeCompare(b.name || '');
    });

  allScoredCandidates.forEach((c, idx) => {
    meritRankMap.set(c.ic, idx + 1);
  });

  // 2. Kira ranking merit khusus Lelaki (Banin)
  const meritRankMapLelaki = new Map<string, number>();
  const scoredLelaki = allScoredCandidates.filter(c => getCandidateGender(c) === 'LELAKI');
  scoredLelaki.forEach((c, idx) => {
    meritRankMapLelaki.set(c.ic, idx + 1);
  });

  // 3. Kira ranking merit khusus Perempuan (Banat)
  const meritRankMapPerempuan = new Map<string, number>();
  const scoredPerempuan = allScoredCandidates.filter(c => getCandidateGender(c) === 'PEREMPUAN');
  scoredPerempuan.forEach((c, idx) => {
    meritRankMapPerempuan.set(c.ic, idx + 1);
  });

  // Filter calon mengikut status
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
  } else if (filter === 'TERBATAL') {
    baseCandidates = candidates.filter(c => c.statusTawaran === 'BERJAYA' && (c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings))));
  } else if (filter === 'BELUM_RESPON') {
    baseCandidates = candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran && !isOfferExpired(c, settings));
  } else if (filter === 'DALAM_PERTIMBANGAN') {
    baseCandidates = candidates.filter(c => c.statusTawaran === 'DALAM_PERTIMBANGAN' || (!c.statusTawaran && c.statusTemuduga === 'LAYAK'));
  } else if (filter === 'LENGKAP_DINILAI') {
    baseCandidates = candidates.filter(c => getTahfizScore(c) !== null && getAkademikScore(c) !== null);
  } else if (filter === 'BELUM_LENGKAP') {
    baseCandidates = candidates.filter(c => getTahfizScore(c) === null || getAkademikScore(c) === null);
  } else {
    // Default 'LAYAK_TEMUDUGA'
    baseCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    baseCandidates = baseCandidates.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.ic?.includes(q) || 
      c.namaSekolahRendah?.toLowerCase().includes(q)
    );
  }

  // Jumlah sebelum tapisan tab jantina
  const countSemua = baseCandidates.length;
  const countLelaki = baseCandidates.filter(c => getCandidateGender(c) === 'LELAKI').length;
  const countPerempuan = baseCandidates.filter(c => getCandidateGender(c) === 'PEREMPUAN').length;

  // Tapis mengikut jantina jika tab Lelaki atau Perempuan dipilih
  let candidatesToDisplay = baseCandidates;
  if (genderFilter === 'LELAKI') {
    candidatesToDisplay = baseCandidates.filter(c => getCandidateGender(c) === 'LELAKI');
  } else if (genderFilter === 'PEREMPUAN') {
    candidatesToDisplay = baseCandidates.filter(c => getCandidateGender(c) === 'PEREMPUAN');
  }

  // Petakan calon dengan kiraan markah & %
  const scoredItems = candidatesToDisplay.map(c => {
    const tScore = getTahfizScore(c);
    const aScore = getAkademikScore(c);
    const hasTahfiz = tScore !== null;
    const hasAkademik = aScore !== null;
    const hasBoth = hasTahfiz && hasAkademik;
    const hasAny = hasTahfiz || hasAkademik;
    const jumlahScore = (tScore ?? 0) + (aScore ?? 0);
    const peratus = jumlahMax > 0 ? (jumlahScore / jumlahMax) * 100 : 0;
    
    const cGender = getCandidateGender(c);
    const globalRank = meritRankMap.get(c.ic) || null;
    const genderRank = cGender === 'LELAKI' 
      ? (meritRankMapLelaki.get(c.ic) || null)
      : (meritRankMapPerempuan.get(c.ic) || null);

    // Sekiranya sedang melihat tab Lelaki atau Perempuan, utamakan paparan rank jantina
    const rank = (genderFilter === 'LELAKI' || genderFilter === 'PEREMPUAN')
      ? genderRank
      : globalRank;

    return {
      candidate: c,
      gender: cGender,
      tScore,
      aScore,
      hasTahfiz,
      hasAkademik,
      hasBoth,
      hasAny,
      jumlahScore,
      peratus,
      rank,
      globalRank,
      genderRank
    };
  });

  // Susunan murid (Sorting)
  const sortedItems = [...scoredItems].sort((a, b) => {
    if (sortBy === 'MARKAH_DESC') {
      if (a.hasAny && !b.hasAny) return -1;
      if (!a.hasAny && b.hasAny) return 1;
      if (b.jumlahScore !== a.jumlahScore) return b.jumlahScore - a.jumlahScore;
      if ((b.tScore ?? 0) !== (a.tScore ?? 0)) return (b.tScore ?? 0) - (a.tScore ?? 0);
      return (a.candidate.name || '').localeCompare(b.candidate.name || '');
    }
    if (sortBy === 'MARKAH_ASC') {
      if (a.hasAny && !b.hasAny) return -1;
      if (!a.hasAny && b.hasAny) return 1;
      if (a.jumlahScore !== b.jumlahScore) return a.jumlahScore - b.jumlahScore;
      return (a.candidate.name || '').localeCompare(b.candidate.name || '');
    }
    if (sortBy === 'TAHFIZ_DESC') {
      const at = a.tScore ?? -1;
      const bt = b.tScore ?? -1;
      if (bt !== at) return bt - at;
      return b.jumlahScore - a.jumlahScore;
    }
    if (sortBy === 'AKADEMIK_DESC') {
      const aa = a.aScore ?? -1;
      const ba = b.aScore ?? -1;
      if (ba !== aa) return ba - aa;
      return b.jumlahScore - a.jumlahScore;
    }
    if (sortBy === 'JANTINA_LELAKI_FIRST') {
      if (a.gender !== b.gender) return a.gender === 'LELAKI' ? -1 : 1;
      if (b.jumlahScore !== a.jumlahScore) return b.jumlahScore - a.jumlahScore;
      return (a.candidate.name || '').localeCompare(b.candidate.name || '');
    }
    if (sortBy === 'JANTINA_PEREMPUAN_FIRST') {
      if (a.gender !== b.gender) return a.gender === 'PEREMPUAN' ? -1 : 1;
      if (b.jumlahScore !== a.jumlahScore) return b.jumlahScore - a.jumlahScore;
      return (a.candidate.name || '').localeCompare(b.candidate.name || '');
    }
    if (sortBy === 'NAMA_ASC') {
      return (a.candidate.name || '').localeCompare(b.candidate.name || '');
    }
    return 0;
  });

  // Statistik Ringkasan
  const evaluatedItems = sortedItems.filter(i => i.hasAny);
  const avgPercent = evaluatedItems.length > 0 
    ? (evaluatedItems.reduce((acc, i) => acc + i.peratus, 0) / evaluatedItems.length).toFixed(1)
    : '0.0';
  const topCandidateItem = evaluatedItems.length > 0
    ? [...evaluatedItems].sort((a, b) => b.jumlahScore - a.jumlahScore)[0]
    : null;
  const lengkapCount = sortedItems.filter(i => i.hasBoth).length;
  const ditawarkanCount = sortedItems.filter(i => i.candidate.statusTawaran === 'BERJAYA').length;

  // Calon terbaik Lelaki & Perempuan bagi maklumat komprehensif
  const topBoyCandidate = scoredLelaki.length > 0 ? scoredLelaki[0] : null;
  const topGirlCandidate = scoredPerempuan.length > 0 ? scoredPerempuan[0] : null;

  const handleDownloadExcel = () => {
    const headers = [
      "Kedudukan Keseluruhan",
      "Kedudukan Jantina",
      "Kategori Jantina",
      "No. Kad Pengenalan",
      "Nama Calon",
      "Jantina Asal",
      "Sekolah Asal",
      "Markah Tahfiz",
      `Tahfiz Max (${tahfizMax})`,
      "Penilai Tahfiz",
      "Catatan Penilai Tahfiz",
      "Markah Akademik",
      `Akademik Max (${akademikMax})`,
      "Penilai Akademik",
      "Catatan Penilai Akademik",
      "Markah Keseluruhan (Tahfiz + Akademik)",
      `Jumlah Max (${jumlahMax})`,
      "Markah Peratus (%)",
      "Status Temuduga",
      "Status Tawaran",
      "Maklum Balas Tawaran (Murid)",
      "No. Tel Bapa",
      "No. Tel Ibu"
    ];
    
    const rows = sortedItems.map((item) => [
      item.globalRank ? `#${item.globalRank}` : '-',
      item.genderRank ? `#${item.genderRank} (${item.gender === 'LELAKI' ? 'L' : 'P'})` : '-',
      item.gender === 'LELAKI' ? 'Lelaki' : 'Perempuan',
      item.candidate.ic || '',
      item.candidate.name || '',
      item.candidate.jantina || (item.gender === 'LELAKI' ? 'Lelaki' : 'Perempuan'),
      item.candidate.namaSekolahRendah || '',
      item.tScore !== null ? item.tScore : 'Belum Dinilai',
      tahfizMax,
      item.candidate.markahTahfiz?.dinilaiOleh || '',
      item.candidate.markahTahfiz?.catatan || '',
      item.aScore !== null ? item.aScore : 'Belum Dinilai',
      akademikMax,
      item.candidate.markahAkademik?.dinilaiOleh || '',
      item.candidate.markahAkademik?.catatan || '',
      item.hasAny ? item.jumlahScore : '0',
      jumlahMax,
      item.hasAny ? `${item.peratus.toFixed(1)}%` : '0%',
      item.candidate.statusTemuduga || '',
      item.candidate.statusTawaran || '',
      item.candidate.maklumBalasTawaran || '',
      item.candidate.telefonBapa || '',
      item.candidate.telefonIbu || ''
    ]);

    const labelJantina = genderFilter === 'LELAKI' ? 'Lelaki' : genderFilter === 'PEREMPUAN' ? 'Perempuan' : 'Semua';
    downloadCSV([headers, ...rows], `Keputusan_Ranking_${labelJantina}_${filter}.csv`);
    setIsCsvSuccess(true);
    setTimeout(() => setIsCsvSuccess(false), 3000);
  };

  if (printCandidate) return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={baseCandidates} onClose={() => setPrintPukalBorang(false)} />;
  if (showPrintSenarai) {
    return (
      <SenaraiKeputusanCetakPDF
        items={sortedItems}
        genderFilter={genderFilter}
        statusFilter={filter}
        settings={settings}
        tahfizMax={tahfizMax}
        akademikMax={akademikMax}
        jumlahMax={jumlahMax}
        onClose={() => setShowPrintSenarai(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
       {/* Tajuk & Header */}
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-100 rounded-xl shadow-xs">
             <Trophy className="w-7 h-7 text-emerald-700" />
           </div>
           <div>
             <div className="flex flex-wrap items-center gap-2">
               <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Keputusan Temuduga & Tawaran</h3>
               {isReadOnly && (
                 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                   <Eye className="w-3.5 h-3.5 text-amber-700" />
                   Mod Paparan Pentadbir (Tanpa Tambah/Kemaskini/Padam)
                 </span>
               )}
             </div>
             <p className="text-sm text-slate-500 font-medium mt-0.5">
               Analisis markah keseluruhan (Tahfiz + Akademik), peratusan akhir dan susunan merit murid.
             </p>
           </div>
         </div>

         <div className="flex flex-wrap items-center gap-2.5">
           <button 
             type="button"
             onClick={() => setPrintPukalBorang(true)}
             className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
             title="Cetak / Muat turun PDF borang permohonan secara pukal mengikut tapisan semasa"
           >
             <FileText className="w-4 h-4 text-rose-600" />
             PDF Borang Pukal ({baseCandidates.length})
           </button>
           <button 
             type="button"
             onClick={() => setShowPrintSenarai(true)}
             className="flex items-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl font-bold transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
             title="Cetak senarai keputusan ini atau simpan PDF rasmi"
           >
             <Printer className="w-4 h-4 text-emerald-600" />
             Cetak Senarai Markah
           </button>
           <button 
             type="button"
             onClick={handleDownloadExcel}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
             title="Muat turun data keputusan dalam format fail CSV / Excel"
           >
             {isCsvSuccess ? (
               <>
                 <CheckCircle className="w-4 h-4 text-emerald-400" />
                 <span>Dimuat Turun!</span>
               </>
             ) : (
               <>
                 <Download className="w-4 h-4" />
                 <span>Muat Turun CSV</span>
               </>
             )}
           </button>
         </div>
       </div>

       {/* Kad Ringkasan Statistik Markah */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
               {genderFilter === 'LELAKI' ? 'Calon Lelaki' : genderFilter === 'PEREMPUAN' ? 'Calon Perempuan' : 'Jumlah Calon'}
             </span>
             <Users className="w-4 h-4 text-emerald-600" />
           </div>
           <div className="text-2xl font-black text-slate-900">{sortedItems.length}</div>
           <div className="text-xs text-slate-500 mt-1 font-medium">
             {genderFilter === 'SEMUA' ? (
               <span>👦 {countLelaki} Lelaki &bull; 👧 {countPerempuan} Perempuan</span>
             ) : (
               <span>Daripada {countSemua} calon</span>
             )}
           </div>
         </div>

         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 shadow-xs">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Lengkap Dinilai</span>
             <CheckCircle className="w-4 h-4 text-blue-600" />
           </div>
           <div className="text-2xl font-black text-slate-900">
             {lengkapCount} <span className="text-xs font-bold text-slate-500">/ {sortedItems.length}</span>
           </div>
           <div className="text-xs text-slate-500 mt-1 font-medium">Tahfiz & Akademik lengkap</div>
         </div>

         <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 rounded-2xl p-4 shadow-xs">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Purata Markah %</span>
             <TrendingUp className="w-4 h-4 text-purple-600" />
           </div>
           <div className="text-2xl font-black text-purple-900">{avgPercent}%</div>
           <div className="text-xs text-slate-500 mt-1 font-medium">
             Bagi {genderFilter === 'LELAKI' ? 'lelaki dinilai' : genderFilter === 'PEREMPUAN' ? 'perempuan dinilai' : 'calon dinilai'}
           </div>
         </div>

         <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
               {genderFilter === 'LELAKI' ? '👦 Juara Lelaki' : genderFilter === 'PEREMPUAN' ? '👧 Juara Perempuan' : 'Markah Tertinggi'}
             </span>
             <Award className="w-4 h-4 text-amber-600" />
           </div>
           <div className="text-2xl font-black text-amber-900">
             {topCandidateItem ? `${topCandidateItem.peratus.toFixed(1)}%` : '-'}
           </div>
           <div className="text-xs text-slate-600 mt-1 font-medium truncate" title={topCandidateItem?.candidate.name}>
             {topCandidateItem ? topCandidateItem.candidate.name : 'Belum ada penilaian'}
           </div>
           {genderFilter === 'SEMUA' && (topBoyCandidate || topGirlCandidate) && (
             <div className="mt-2 pt-2 border-t border-amber-200/60 flex flex-col gap-0.5 text-[10px]">
               {topBoyCandidate && (
                 <div className="truncate text-blue-800 font-semibold" title={topBoyCandidate.name}>
                   👦 Top L: {topBoyCandidate.name}
                 </div>
               )}
               {topGirlCandidate && (
                 <div className="truncate text-pink-800 font-semibold" title={topGirlCandidate.name}>
                   👧 Top P: {topGirlCandidate.name}
                 </div>
               )}
             </div>
           )}
         </div>
       </div>

       {/* Bahagian Kawalan, Penapis, Susunan & Carian */}
       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
         {/* Tab Kategori Ranking: Semua, Lelaki, Perempuan */}
         <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200/90">
           <div className="flex flex-wrap items-center gap-1.5">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Kategori Ranking:</span>
             <button
               type="button"
               onClick={() => setGenderFilter('SEMUA')}
               className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                 genderFilter === 'SEMUA'
                   ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                   : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
               }`}
             >
               <Users className="w-3.5 h-3.5" />
               <span>Semua Calon</span>
               <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${genderFilter === 'SEMUA' ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                 {countSemua}
               </span>
             </button>

             <button
               type="button"
               onClick={() => setGenderFilter('LELAKI')}
               className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                 genderFilter === 'LELAKI'
                   ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                   : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
               }`}
             >
               <span>👦 Lelaki (Banin)</span>
               <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${genderFilter === 'LELAKI' ? 'bg-blue-700 text-blue-100' : 'bg-blue-50 text-blue-700'}`}>
                 {countLelaki}
               </span>
             </button>

             <button
               type="button"
               onClick={() => setGenderFilter('PEREMPUAN')}
               className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                 genderFilter === 'PEREMPUAN'
                   ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-500/30'
                   : 'bg-white text-pink-700 hover:bg-pink-50 border border-pink-200'
               }`}
             >
               <span>👧 Perempuan (Banat)</span>
               <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${genderFilter === 'PEREMPUAN' ? 'bg-pink-700 text-pink-100' : 'bg-pink-50 text-pink-700'}`}>
                 {countPerempuan}
               </span>
             </button>
           </div>

           <div className="px-2 text-xs font-bold">
             {genderFilter === 'LELAKI' && (
               <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 inline-flex items-center gap-1.5">
                 👦 Memaparkan senarai & ranking calon Lelaki sahaja
               </span>
             )}
             {genderFilter === 'PEREMPUAN' && (
               <span className="text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100 inline-flex items-center gap-1.5">
                 👧 Memaparkan senarai & ranking calon Perempuan sahaja
               </span>
             )}
             {genderFilter === 'SEMUA' && (
               <span className="text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                 👥 Memaparkan semua calon dengan ranking keseluruhan & jantina
               </span>
             )}
           </div>
         </div>

         <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
           {/* Carian Pantas */}
           <div className="relative flex-1 min-w-[260px]">
             <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Cari nama calon, No. KP atau sekolah..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
               >
                 ✕
               </button>
             )}
           </div>

           {/* Filter Status Calon */}
           <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tapisan:</span>
               <select 
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
                 className="px-4 py-2.5 rounded-xl text-xs font-bold border-2 border-slate-200 bg-white text-slate-800 shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
               >
                 <option value="LAYAK_TEMUDUGA">Layak Temuduga ({candidates.filter(c => c.statusTemuduga === 'LAYAK').length})</option>
                 <option value="SEMUA_PERMOHONAN">Semua Permohonan ({candidates.length})</option>
                 <option value="LENGKAP_DINILAI">Lengkap Dinilai ({candidates.filter(c => getTahfizScore(c) !== null && getAkademikScore(c) !== null).length})</option>
                 <option value="BELUM_LENGKAP">Belum Lengkap Dinilai ({candidates.filter(c => getTahfizScore(c) === null || getAkademikScore(c) === null).length})</option>
                 <option value="BERJAYA">Ditawarkan ({candidates.filter(c => c.statusTawaran === 'BERJAYA').length})</option>
                 <option value="DALAM_PERTIMBANGAN">Dalam Proses Penilaian ({candidates.filter(c => c.statusTawaran === 'DALAM_PERTIMBANGAN' || (!c.statusTawaran && c.statusTemuduga === 'LAYAK')).length})</option>
                 <option value="GAGAL">Tidak Berjaya ({candidates.filter(c => c.statusTawaran === 'GAGAL').length})</option>
                 <option value="TERIMA">Tawaran Diterima ({candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length})</option>
                 <option value="TOLAK">Tolak Tawaran ({candidates.filter(c => c.maklumBalasTawaran === 'TOLAK').length})</option>
                 <option value="TERBATAL">Tawaran Terbatal ({candidates.filter(c => c.statusTawaran === 'BERJAYA' && (c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings)))).length})</option>
                 <option value="BELUM_RESPON">Belum Respons ({candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran && !isOfferExpired(c, settings)).length})</option>
                 <option value="MENUNGGU">Menunggu Saringan ({candidates.filter(c => c.statusTemuduga === 'MENUNGGU' || !c.statusTemuduga).length})</option>
               </select>
             </div>

             {/* Susunan Murid */}
             <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Susunan:</span>
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as any)}
                 className="px-4 py-2.5 rounded-xl text-xs font-bold border-2 border-emerald-300 bg-emerald-50/60 text-emerald-900 shadow-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
               >
                 <option value="MARKAH_DESC">🏆 Markah Akhir (Tertinggi ke Terendah)</option>
                 <option value="MARKAH_ASC">Markah Akhir (Terendah ke Tertinggi)</option>
                 <option value="JANTINA_LELAKI_FIRST">👦 Susun Lelaki Dahulu (Kemudian Markah)</option>
                 <option value="JANTINA_PEREMPUAN_FIRST">👧 Susun Perempuan Dahulu (Kemudian Markah)</option>
                 <option value="TAHFIZ_DESC">Markah Tahfiz Tertinggi</option>
                 <option value="AKADEMIK_DESC">Markah Akademik Tertinggi</option>
                 <option value="NAMA_ASC">Nama Calon (A - Z)</option>
               </select>
             </div>

             {!isReadOnly && (
               <button 
                 type="button"
                 onClick={() => setShowAddModal(true)}
                 className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-xs text-xs whitespace-nowrap"
               >
                 <UserPlus className="w-3.5 h-3.5" />
                 + Tambah Calon
               </button>
             )}
           </div>
         </div>

         {/* Bar Pemberitahuan Susunan & Skala Markah */}
         <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 gap-2">
           <div className="flex items-center gap-2 font-medium">
             <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
             <span>Skala Penilaian: <strong>Tahfiz (/{tahfizMax})</strong> + <strong>Akademik (/{akademikMax})</strong> = <strong>Jumlah Penuh (/{jumlahMax})</strong></span>
           </div>
           <div className="flex items-center gap-4 text-[11px] font-semibold">
             <span>Ditawarkan: <strong className="text-emerald-700">{ditawarkanCount}</strong></span>
             <span>Belum Ditawarkan: <strong className="text-slate-700">{sortedItems.length - ditawarkanCount}</strong></span>
           </div>
         </div>
       </div>

       {!isReadOnly && showAddModal && <AddCandidateModal onClose={() => setShowAddModal(false)} />}

       {/* Jadual Keputusan Murid */}
       <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-200 text-left text-sm table-auto">
              <thead className="bg-slate-50/90 text-slate-600">
                <tr>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider w-12 whitespace-nowrap">
                    {genderFilter === 'LELAKI' ? 'Ked. L' : genderFilter === 'PEREMPUAN' ? 'Ked. P' : 'Ked (Merit)'}
                  </th>
                  <th className="px-1.5 py-2 text-xs font-bold uppercase tracking-wider min-w-[130px] max-w-[180px]">
                    Nama Calon & No. KP
                  </th>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    Tahfiz ({tahfizMax})
                  </th>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    Akademik ({akademikMax})
                  </th>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider bg-slate-100/70 whitespace-nowrap">
                    Jumlah ({jumlahMax})
                  </th>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider bg-slate-100/70 whitespace-nowrap">
                    %
                  </th>
                  <th className="px-1 py-2 text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap">
                    Status Tawaran
                  </th>
                  <th className="px-1.5 py-2 text-xs font-bold uppercase tracking-wider text-center max-w-[160px] whitespace-nowrap" title="Catatan dan ulasan penilai temuduga">
                    Catatan Penilai Temuduga
                  </th>
                  <th className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    {isReadOnly ? 'Paparan' : 'Tindakan'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sortedItems.map((item, idx) => {
                  const c = item.candidate;
                  return (
                    <tr key={c.id || c.ic} className="hover:bg-slate-50/80 transition-colors">
                      {/* Kedudukan / Ranking */}
                      <td className="px-2 py-2.5 text-center whitespace-nowrap">
                        {item.rank === 1 ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                              🏆 #1 {genderFilter === 'LELAKI' ? 'L' : genderFilter === 'PEREMPUAN' ? 'P' : ''}
                            </span>
                            {genderFilter === 'SEMUA' && item.genderRank && (
                              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                                {item.gender === 'LELAKI' ? '👦 L' : '👧 P'} #{item.genderRank}
                              </span>
                            )}
                            {(genderFilter === 'LELAKI' || genderFilter === 'PEREMPUAN') && item.globalRank && (
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                Semua: #{item.globalRank}
                              </span>
                            )}
                          </div>
                        ) : item.rank === 2 ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-200 text-slate-800 border border-slate-300 shadow-xs">
                              🥈 #2 {genderFilter === 'LELAKI' ? 'L' : genderFilter === 'PEREMPUAN' ? 'P' : ''}
                            </span>
                            {genderFilter === 'SEMUA' && item.genderRank && (
                              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                                {item.gender === 'LELAKI' ? '👦 L' : '👧 P'} #{item.genderRank}
                              </span>
                            )}
                            {(genderFilter === 'LELAKI' || genderFilter === 'PEREMPUAN') && item.globalRank && (
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                Semua: #{item.globalRank}
                              </span>
                            )}
                          </div>
                        ) : item.rank === 3 ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                              🥉 #3 {genderFilter === 'LELAKI' ? 'L' : genderFilter === 'PEREMPUAN' ? 'P' : ''}
                            </span>
                            {genderFilter === 'SEMUA' && item.genderRank && (
                              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                                {item.gender === 'LELAKI' ? '👦 L' : '👧 P'} #{item.genderRank}
                              </span>
                            )}
                            {(genderFilter === 'LELAKI' || genderFilter === 'PEREMPUAN') && item.globalRank && (
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                Semua: #{item.globalRank}
                              </span>
                            )}
                          </div>
                        ) : item.rank ? (
                          <div className="flex flex-col items-center">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-black ${
                              genderFilter === 'LELAKI'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : genderFilter === 'PEREMPUAN'
                                ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              #{item.rank}
                            </span>
                            {genderFilter === 'SEMUA' && item.genderRank && (
                              <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                                {item.gender === 'LELAKI' ? '👦 L' : '👧 P'} #{item.genderRank}
                              </span>
                            )}
                            {(genderFilter === 'LELAKI' || genderFilter === 'PEREMPUAN') && item.globalRank && (
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                Semua: #{item.globalRank}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">#{idx + 1}</span>
                        )}
                      </td>

                      {/* Nama & IC Sahaja (Kotak Padat Sesuai - Klik Gambar/Nama Untuk Lihat Maklumat Penuh) */}
                      <td className="px-1.5 py-1.5 max-w-[170px]">
                         <div className="flex items-center gap-2">
                           <div 
                             onClick={() => setDetailCandidate(c)}
                             className="w-8 h-10 bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center shadow-2xs cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:scale-110 active:scale-95 transition-all group relative"
                             title="Klik gambar untuk lihat maklumat calon"
                           >
                             {c.gambarUrl ? (
                               <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
                             ) : (
                               <Camera className="w-3.5 h-3.5 text-slate-400 stroke-1" />
                             )}
                             <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Eye className="w-3 h-3 text-white drop-shadow" />
                             </div>
                           </div>
                           <div className="min-w-0 flex-1">
                             <button
                               type="button"
                               onClick={() => setDetailCandidate(c)}
                               className="font-bold text-slate-900 truncate text-xs leading-snug hover:text-emerald-700 hover:underline transition text-left block w-full"
                               title={`Klik untuk lihat maklumat ${c.name}`}
                             >
                               {c.name}
                             </button>
                             <div className="flex items-center gap-1.5 mt-0.5">
                               <span className="text-[11px] font-mono font-semibold text-slate-600 truncate">
                                 {c.ic}
                               </span>
                               <span className={`inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                                 item.gender === 'LELAKI'
                                   ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                   : 'bg-pink-100 text-pink-700 border border-pink-200'
                               }`}>
                                 {item.gender === 'LELAKI' ? '👦 L' : '👧 P'}
                               </span>
                             </div>
                           </div>
                         </div>
                      </td>

                      {/* Markah Tahfiz */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center">
                         {item.hasTahfiz ? (
                           <div>
                             <span className="font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-lg text-xs sm:text-sm border border-emerald-100 inline-block">
                               {item.tScore} <span className="text-[10px] font-semibold text-emerald-500">/{tahfizMax}</span>
                             </span>
                             {c.markahTahfiz?.dinilaiOleh && (
                               <div className="text-[9px] text-slate-500 mt-0.5 uppercase font-semibold max-w-[100px] truncate mx-auto" title={c.markahTahfiz.dinilaiOleh}>
                                 {c.markahTahfiz.dinilaiOleh}
                               </div>
                             )}
                           </div>
                         ) : (
                           <span className="text-xs font-medium text-slate-400 italic">Belum</span>
                         )}
                      </td>

                      {/* Markah Akademik */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center">
                         {item.hasAkademik ? (
                           <div>
                             <span className="font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-lg text-xs sm:text-sm border border-blue-100 inline-block">
                               {item.aScore} <span className="text-[10px] font-semibold text-blue-500">/{akademikMax}</span>
                             </span>
                             {c.markahAkademik?.dinilaiOleh && (
                               <div className="text-[9px] text-slate-500 mt-0.5 uppercase font-semibold max-w-[100px] truncate mx-auto" title={c.markahAkademik.dinilaiOleh}>
                                 {c.markahAkademik.dinilaiOleh}
                               </div>
                             )}
                           </div>
                         ) : (
                           <span className="text-xs font-medium text-slate-400 italic">Belum</span>
                         )}
                      </td>

                      {/* Markah Keseluruhan (Tahfiz + Akademik) */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center bg-slate-50/50">
                         {item.hasAny ? (
                           <div>
                             <div className="inline-flex items-baseline gap-0.5 bg-white px-1.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                               <span className="font-black text-xs sm:text-sm text-slate-900">
                                 {item.jumlahScore}
                               </span>
                               <span className="text-[9px] font-bold text-slate-400">
                                 /{jumlahMax}
                               </span>
                             </div>
                             {!item.hasBoth && (
                               <div className="text-[8.5px] font-bold text-amber-600 mt-0.5">
                                 *Belum lengkap
                               </div>
                             )}
                           </div>
                         ) : (
                           <span className="text-xs text-slate-400 font-medium italic">-</span>
                         )}
                      </td>

                      {/* Markah Peratus (%) */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center bg-slate-50/50">
                         {item.hasAny ? (
                           <div className="w-12 mx-auto">
                             <div className="flex items-center justify-center mb-0.5">
                               <span className={`text-xs font-black ${
                                 item.peratus >= 80 ? 'text-emerald-700' :
                                 item.peratus >= 65 ? 'text-blue-700' :
                                 item.peratus >= 50 ? 'text-amber-700' : 'text-rose-700'
                               }`}>
                                 {item.peratus.toFixed(1)}%
                               </span>
                             </div>
                             <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden">
                               <div 
                                 className={`h-full rounded-full transition-all duration-300 ${
                                   item.peratus >= 80 ? 'bg-emerald-500' :
                                   item.peratus >= 65 ? 'bg-blue-500' :
                                   item.peratus >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                 }`}
                                 style={{ width: `${Math.min(100, Math.max(0, item.peratus))}%` }}
                               />
                             </div>
                           </div>
                         ) : (
                           <span className="text-xs text-slate-400 font-medium">-</span>
                         )}
                      </td>

                      {/* Status Tawaran - Dibuat 2 Baris Untuk Dalam Proses Penilaian */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center">
                         <div className="relative inline-block">
                           <div className={`px-2 py-1 rounded-xl text-[10px] font-extrabold uppercase border text-center transition-colors pointer-events-none ${
                             c.statusTawaran === 'BERJAYA' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                             c.statusTawaran === 'GAGAL' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                             'bg-slate-100 text-slate-700 border-slate-300'
                           }`}>
                             {c.statusTawaran === 'BERJAYA' ? (
                               <span>Ditawarkan</span>
                             ) : c.statusTawaran === 'GAGAL' ? (
                               <span>Tidak Ditawarkan</span>
                             ) : (
                               <div className="leading-[1.15] text-[9px] tracking-tight">
                                 <div>Dalam Proses</div>
                                 <div className="mt-0.5">Penilaian</div>
                               </div>
                             )}
                           </div>
                           {!isReadOnly && (
                             <select
                               value={c.statusTawaran || 'DALAM_PERTIMBANGAN'}
                               onChange={(e) => updateCandidate(c.ic, { statusTawaran: e.target.value as any })}
                               className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                               title="Klik untuk tukar Status Tawaran Calon"
                             >
                               <option value="DALAM_PERTIMBANGAN">Dalam Proses Penilaian</option>
                               <option value="BERJAYA">Ditawarkan</option>
                               <option value="GAGAL">Tidak Ditawarkan</option>
                             </select>
                           )}
                         </div>
                         {/* Maklum Balas Penerimaan Murid */}
                         {c.statusTawaran === 'BERJAYA' && (
                           <div className="mt-0.5">
                             {c.maklumBalasTawaran === 'TERIMA' ? (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" title="Calon telah menerima tawaran kemasukan">
                                 ✓ Diterima
                               </span>
                             ) : c.maklumBalasTawaran === 'TOLAK' ? (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-slate-100 text-slate-700 border border-slate-300" title="Calon telah menolak tawaran">
                                 ✗ Ditolak
                               </span>
                             ) : c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings)) ? (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="Tawaran terbatal secara automatik kerana gagal respon sebelum tarikh akhir">
                                 ⚠ Terbatal
                               </span>
                             ) : (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Menunggu pengesahan calon sebelum tarikh akhir">
                                 ⏳ Belum Respon
                               </span>
                             )}
                           </div>
                         )}
                      </td>

                      {/* Catatan Penilai Temuduga - Mengikut Permintaan Pengguna */}
                      <td className="px-1.5 py-1.5 text-left max-w-[160px]">
                         {c.markahTahfiz?.catatan || c.markahAkademik?.catatan ? (
                           <div 
                             className="space-y-0.5 cursor-pointer group"
                             onClick={() => setDetailCandidate(c)}
                             title="Klik untuk lihat maklumat terperinci calon"
                           >
                             {c.markahTahfiz?.catatan && (
                               <div className="bg-emerald-50/90 border border-emerald-200/80 rounded px-1.5 py-0.5 text-[9.5px] text-emerald-950 line-clamp-2 leading-tight">
                                 <span className="font-extrabold text-emerald-700">Tahfiz: </span>
                                 <span className="italic">{c.markahTahfiz.catatan}</span>
                               </div>
                             )}
                             {c.markahAkademik?.catatan && (
                               <div className="bg-blue-50/90 border border-blue-200/80 rounded px-1.5 py-0.5 text-[9.5px] text-blue-950 line-clamp-2 leading-tight">
                                 <span className="font-extrabold text-blue-700">Akademik: </span>
                                 <span className="italic">{c.markahAkademik.catatan}</span>
                               </div>
                             )}
                           </div>
                         ) : (
                           <div className="text-center">
                             <span className="text-xs text-slate-400 font-medium italic">-</span>
                           </div>
                         )}
                      </td>

                      {/* Tindakan */}
                      <td className="px-1 py-1.5 whitespace-nowrap text-center">
                         <div className="flex items-center justify-center gap-1">
                           <button
                             type="button"
                             onClick={() => setDetailCandidate(c)}
                             className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition shadow-2xs cursor-pointer"
                             title="Lihat Maklumat Penuh Calon"
                           >
                             <Eye className="w-3 h-3 text-emerald-600" />
                             Lihat
                           </button>
                           <button
                             type="button"
                             onClick={() => setPrintCandidate(c)}
                             className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition shadow-2xs cursor-pointer"
                             title="Cetak / Simpan PDF Borang Calon"
                           >
                             <FileText className="w-3 h-3" />
                             PDF
                           </button>
                           {!isReadOnly && (
                             <button
                               type="button"
                               onClick={() => setEditCandidate(c)}
                               className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition shadow-2xs cursor-pointer"
                               title="Kemaskini Maklumat & Gambar Calon"
                             >
                               <Edit className="w-3 h-3" />
                               Kemaskini
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  );
                })}

                {sortedItems.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-slate-500 font-medium">
                      <div className="max-w-sm mx-auto space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-700">Tiada rekod calon ditemui</p>
                        <p className="text-xs text-slate-400">Cuba ubah kata kunci carian atau tetapan tapisan di atas.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
       </div>

       {detailCandidate && (
         <CandidateDetailModal 
            candidate={detailCandidate} 
            onClose={() => setDetailCandidate(null)} 
            onEdit={isReadOnly ? undefined : (cand) => {
              setDetailCandidate(null);
              setEditCandidate(cand);
            }}
            onPrint={(cand) => {
              setDetailCandidate(null);
              setPrintCandidate(cand);
            }}
            meritRank={{
              rank: meritRankMap.get(detailCandidate.ic) || null,
              genderRank: (detailCandidate.jantina || '').toUpperCase().includes('L')
                ? (meritRankMapLelaki.get(detailCandidate.ic) || null)
                : (meritRankMapPerempuan.get(detailCandidate.ic) || null),
              totalScore: (detailCandidate.markahTahfiz?.jumlah || 0) + (detailCandidate.markahAkademik?.jumlah || 0),
              percentage: Number(
                jumlahMax > 0 
                  ? (((detailCandidate.markahTahfiz?.jumlah || 0) + (detailCandidate.markahAkademik?.jumlah || 0)) / jumlahMax * 100).toFixed(1)
                  : 0
              )
            }}
         />
       )}

       {!isReadOnly && editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => setEditCandidate(null)}
         />
       )}
    </div>
  );
}

// ================= PORTAL KHAS PENTADBIR (PAPARAN & MUAT TURUN PUKAL SAHAJA) =================
function PentadbirPortal({ onOpenChangePassword }: { onOpenChangePassword?: (u: User) => void }) {
  const { candidates, settings, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'PERMOHONAN' | 'MARKAH' | 'ANALISIS'>('PERMOHONAN');
  const [statusFilter, setStatusFilter] = useState<'SEMUA' | 'LAYAK' | 'TIDAK_LAYAK' | 'DAPAT_TAWARAN' | 'TERIMA_TAWARAN' | 'TOLAK_TAWARAN'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [pukalPrintData, setPukalPrintData] = useState<{ list: Candidate[]; title: string } | null>(null);
  const itemsPerPage = 15;

  const tahfizMax = settings.tahfizItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 100;
  const akademikMax = settings.akademikItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 40;
  const jumlahMax = tahfizMax + akademikMax;

  // 4 Kategori Utama Mengikut Keperluan Pentadbir
  const semuaPemohon = candidates;
  const layakTemudugaList = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  const tidakLayakList = candidates.filter(c => c.statusTemuduga !== 'LAYAK');
  const dapatTawaranList = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  const terimaTawaranList = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  const tolakBelumResponList = candidates.filter(c => c.statusTawaran === 'BERJAYA' && c.maklumBalasTawaran !== 'TERIMA');

  const filteredList = candidates.filter(c => {
    if (statusFilter === 'LAYAK' && c.statusTemuduga !== 'LAYAK') return false;
    if (statusFilter === 'TIDAK_LAYAK' && c.statusTemuduga === 'LAYAK') return false;
    if (statusFilter === 'DAPAT_TAWARAN' && c.statusTawaran !== 'BERJAYA') return false;
    if (statusFilter === 'TERIMA_TAWARAN' && c.maklumBalasTawaran !== 'TERIMA') return false;
    if (statusFilter === 'TOLAK_TAWARAN' && !(c.statusTawaran === 'BERJAYA' && c.maklumBalasTawaran !== 'TERIMA')) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.ic?.toLowerCase().includes(q) ||
      c.namaSekolahRendah?.toLowerCase().includes(q) ||
      c.daerah?.toLowerCase().includes(q) ||
      c.negeri?.toLowerCase().includes(q)
    );
  });

  if (printCandidate) {
    return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  }

  if (pukalPrintData) {
    return (
      <BorangPukalCetakPDF
        candidates={pukalPrintData.list}
        titlePrefix={pukalPrintData.title}
        onClose={() => setPukalPrintData(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Bar Atas Portal Pentadbir */}
      <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Portal Rasmi Pentadbir
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  Akses Lihat, Semak &amp; Muat Turun Pukal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Paparan penuh maklumat pemohon, kelayakan temuduga, markah penilaian &amp; status tawaran (Mod Baca Sahaja — Tanpa Akses Tambah/Kemaskini/Padam).
              </p>
            </div>
          </div>

          {currentUser && onOpenChangePassword && (
            <button
              type="button"
              onClick={() => onOpenChangePassword(currentUser)}
              className="self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Tukar Kata Laluan ({currentUser.username})
            </button>
          )}
        </div>

        {/* Navigasi Tab Utama Pentadbir */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('PERMOHONAN')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'PERMOHONAN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Maklumat Pemohon, Temuduga &amp; Tawaran (Muat Turun Pukal)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'PERMOHONAN' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700'}`}>
              {candidates.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MARKAH')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'MARKAH'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>2. Lihat Markah &amp; Ranking Temuduga</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'MARKAH' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700'}`}>
              {layakTemudugaList.length} Layak
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ANALISIS')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ANALISIS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>3. Analisis Kemasukan &amp; Tawaran</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MAKLUMAT PEMOHON, TEMUDUGA, TAWARAN & MUAT TURUN PUKAL */}
      {activeTab === 'PERMOHONAN' && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/80 p-5 sm:p-8 space-y-6">
          {/* Pusat Muat Turun & Cetakan Pukal (4 Kategori Utama) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-600" />
                  Muat Turun &amp; Cetakan Pukal (Pentadbir)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Muat turun senarai penuh dalam format <strong>Excel / CSV</strong> atau <strong>Borang Permohonan Pukal (PDF)</strong> mengikut kategori.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {/* Kategori 1: Senarai Pemohon */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">1. Semua Pemohon</span>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('SEMUA'); setCurrentPage(1); }}
                      className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Lihat Senarai →
                    </button>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{semuaPemohon.length} <span className="text-xs font-bold text-slate-400">Calon</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => exportCandidatesCategoryCSV(semuaPemohon, 'Senarai_Semua_Pemohon', tahfizMax, akademikMax)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold transition cursor-pointer"
                    title="Muat turun CSV/Excel Semua Pemohon"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Excel / CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setPukalPrintData({ list: semuaPemohon, title: 'Semua Pemohon' })}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition cursor-pointer"
                    title="Cetak / Simpan PDF Borang Pukal Semua Pemohon"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    Borang PDF
                  </button>
                </div>
              </div>

              {/* Kategori 2: Senarai Calon Layak Temuduga */}
              <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-2xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">2. Layak Temuduga</span>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('LAYAK'); setCurrentPage(1); }}
                      className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
                    >
                      Lihat Senarai →
                    </button>
                  </div>
                  <div className="text-2xl font-black text-purple-700 mt-1">{layakTemudugaList.length} <span className="text-xs font-bold text-purple-400">Calon</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={() => exportCandidatesCategoryCSV(layakTemudugaList, 'Senarai_Calon_Layak_Temuduga', tahfizMax, akademikMax)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition cursor-pointer"
                    title="Muat turun CSV/Excel Calon Layak Temuduga"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Excel / CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setPukalPrintData({ list: layakTemudugaList, title: 'Calon Layak Temuduga' })}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200 transition cursor-pointer"
                    title="Cetak / Simpan PDF Borang Pukal Calon Layak Temuduga"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-600" />
                    Borang PDF
                  </button>
                </div>
              </div>

              {/* Kategori 3: Senarai Calon Dapat Tawaran */}
              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-2xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">3. Dapat Tawaran</span>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('DAPAT_TAWARAN'); setCurrentPage(1); }}
                      className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      Lihat Senarai →
                    </button>
                  </div>
                  <div className="text-2xl font-black text-blue-700 mt-1">{dapatTawaranList.length} <span className="text-xs font-bold text-blue-400">Calon</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100">
                  <button
                    type="button"
                    onClick={() => exportCandidatesCategoryCSV(dapatTawaranList, 'Senarai_Calon_Dapat_Tawaran', tahfizMax, akademikMax)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition cursor-pointer"
                    title="Muat turun CSV/Excel Calon Dapat Tawaran"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Excel / CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setPukalPrintData({ list: dapatTawaranList, title: 'Calon Dapat Tawaran' })}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition cursor-pointer"
                    title="Cetak / Simpan PDF Borang Pukal Calon Dapat Tawaran"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    Borang PDF
                  </button>
                </div>
              </div>

              {/* Kategori 4: Senarai Calon Terima Tawaran */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">4. Terima Tawaran</span>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('TERIMA_TAWARAN'); setCurrentPage(1); }}
                      className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Lihat Senarai →
                    </button>
                  </div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{terimaTawaranList.length} <span className="text-xs font-bold text-emerald-400">Calon</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100">
                  <button
                    type="button"
                    onClick={() => exportCandidatesCategoryCSV(terimaTawaranList, 'Senarai_Calon_Terima_Tawaran', tahfizMax, akademikMax)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                    title="Muat turun CSV/Excel Calon Terima Tawaran"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Excel / CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setPukalPrintData({ list: terimaTawaranList, title: 'Calon Terima Tawaran' })}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition cursor-pointer"
                    title="Cetak / Simpan PDF Borang Pukal Calon Terima Tawaran"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    Borang PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tapisan Kategori & Carian */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => { setStatusFilter('SEMUA'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'SEMUA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Pemohon ({semuaPemohon.length})
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('LAYAK'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'LAYAK' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-900'
                }`}
              >
                Layak Temuduga ({layakTemudugaList.length})
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('DAPAT_TAWARAN'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'DAPAT_TAWARAN' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-700 hover:text-blue-900'
                }`}
              >
                Dapat Tawaran ({dapatTawaranList.length})
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('TERIMA_TAWARAN'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'TERIMA_TAWARAN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                Terima Tawaran ({terimaTawaranList.length})
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('TOLAK_TAWARAN'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'TOLAK_TAWARAN' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                Tolak / Belum Respon ({tolakBelumResponList.length})
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('TIDAK_LAYAK'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === 'TIDAK_LAYAK' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                Tidak Layak / Menunggu ({tidakLayakList.length})
              </button>
            </div>

            <div className="relative min-w-[240px] sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, No. KP, sekolah, daerah..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-8 py-2 border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Jadual Senarai Pemohon / Temuduga / Tawaran (Paparan Sahaja) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase w-12 text-center">Bil</th>
                    <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase">Maklumat Pemohon</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase">Sekolah &amp; Daerah</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase text-center">UPKK</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase text-center">Status Temuduga</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase text-center">Markah Temuduga</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase text-center">Status Tawaran</th>
                    <th className="px-3 py-3.5 text-xs font-bold text-slate-500 uppercase text-center">Paparan &amp; Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Tiada rekod calon ditemui bagi tapisan ini.
                      </td>
                    </tr>
                  ) : (
                    filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c, index) => {
                      const tScore = c.markahTahfiz?.jumlah;
                      const aScore = c.markahAkademik?.jumlah;
                      const hasAnyScore = tScore !== undefined || aScore !== undefined;
                      const totalScore = Number(tScore || 0) + Number(aScore || 0);
                      const pct = jumlahMax > 0 ? ((totalScore / jumlahMax) * 100).toFixed(1) : '0.0';

                      return (
                        <tr key={c.id || c.ic} className="hover:bg-slate-50/80 transition">
                          <td className="px-3 py-3.5 text-center text-xs font-bold text-slate-500">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={() => setDetailCandidate(c)}
                                className="w-10 h-13 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500 transition group relative"
                                title="Klik untuk lihat maklumat penuh pemohon"
                              >
                                {c.gambarUrl ? (
                                  <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Camera className="w-4 h-4 text-slate-400" />
                                )}
                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setDetailCandidate(c)}
                                  className="font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 hover:underline text-left block cursor-pointer"
                                >
                                  {c.name}
                                </button>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-mono text-slate-500">{c.ic}</span>
                                  {c.jantina && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                      c.jantina.toUpperCase().includes('L')
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'bg-pink-50 text-pink-700 border border-pink-200'
                                    }`}>
                                      {c.jantina}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-xs text-slate-600">
                            <div className="font-bold text-slate-800 truncate max-w-[180px]" title={c.namaSekolahRendah}>
                              {c.namaSekolahRendah || '-'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {c.daerah || '-'}, {c.negeri || '-'}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            {(() => {
                              if (!c.upkk) return <span className="text-xs text-slate-400">-</span>;
                              const grades = Object.values(c.upkk).filter(v => v && typeof v === 'string' && v.trim() !== '');
                              if (grades.length === 0) return <span className="text-xs text-slate-400">-</span>;
                              const counts: Record<string, number> = {};
                              grades.forEach(g => { counts[g as string] = (counts[g as string] || 0) + 1; });
                              const formatted = Object.entries(counts).sort().map(([g, count]) => `${count}${g}`).join(', ');
                              return <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 whitespace-nowrap">{formatted}</span>;
                            })()}
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            {c.statusTemuduga === 'LAYAK' ? (
                              <span className="bg-purple-100 text-purple-800 border border-purple-300 font-extrabold px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap">
                                LAYAK TEMUDUGA
                              </span>
                            ) : c.statusTemuduga === 'TIDAK_LAYAK' ? (
                              <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap">
                                TIDAK LAYAK
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-600 border border-slate-200 font-bold px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap">
                                MENUNGGU
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-center whitespace-nowrap">
                            {hasAnyScore ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {totalScore}/{jumlahMax} ({pct}%)
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                                  T: {tScore ?? '-'} | A: {aScore ?? '-'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Belum Dinilai</span>
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center gap-1">
                              {c.statusTawaran === 'BERJAYA' ? (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                                  DITAWARKAN
                                </span>
                              ) : c.statusTawaran === 'GAGAL' ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                                  TIDAK DITAWARKAN
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 border border-slate-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                  DALAM PERTIMBANGAN
                                </span>
                              )}

                              {c.statusTawaran === 'BERJAYA' && (
                                c.maklumBalasTawaran === 'TERIMA' ? (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    ✓ Terima Tawaran
                                  </span>
                                ) : c.maklumBalasTawaran === 'TOLAK' ? (
                                  <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                    ✗ Tolak Tawaran
                                  </span>
                                ) : c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings)) ? (
                                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    ⚠ Tawaran Terbatal
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    ⏳ Belum Respon
                                  </span>
                                )
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDetailCandidate(c)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                                title="Paparkan Maklumat Lengkap Pemohon"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Lihat Profil
                              </button>
                              <button
                                type="button"
                                onClick={() => setPrintCandidate(c)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition cursor-pointer"
                                title="Cetak / Muat Turun PDF Borang Pemohon"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Borang PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filteredList.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 gap-3">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Memaparkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredList.length)} daripada {filteredList.length} rekod
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredList.length / itemsPerPage), p + 1))}
                    disabled={currentPage >= Math.ceil(filteredList.length / itemsPerPage)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Seterusnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MARKAH & KEPUTUSAN TEMUDUGA (PAPARAN SAHAJA - TANPA TAMBAH/KEMASKINI/PADAM) */}
      {activeTab === 'MARKAH' && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/80 p-5 sm:p-8">
          <PentadbirView readOnly={true} />
        </div>
      )}

      {/* TAB 3: ANALISIS KEMASUKAN & PENERIMAAN TAWARAN */}
      {activeTab === 'ANALISIS' && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/80 p-5 sm:p-8 space-y-6">
          <AnalisisKemasukan candidates={candidates} />
        </div>
      )}

      {/* Modal Maklumat Lengkap Pemohon (Mod Baca Sahaja — Tanpa onEdit) */}
      {detailCandidate && (
        <CandidateDetailModal
          candidate={detailCandidate}
          onClose={() => setDetailCandidate(null)}
          onPrint={(cand) => {
            setDetailCandidate(null);
            setPrintCandidate(cand);
          }}
        />
      )}
    </div>
  );
}

// ================= SUPER ADMIN VIEW =================
function SuperAdminView({ onOpenChangePassword }: { onOpenChangePassword?: (u: User) => void }) {
  const { settings, updateSettings, syncSettingsToServer, candidates, updateCandidate, deleteCandidate, users, addUser, updateUser, deleteUser, infographics, addInfographic, deleteInfographic, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'KAWALAN' | 'PENGGUNA' | 'ANALISIS' | 'PERMOHONAN' | 'MARKAH'>('KAWALAN');
  const [kawalanSection, setKawalanSection] = useState<'UTAMA' | 'SURAT_TEMUDUGA' | 'SURAT_TAWARAN' | 'PENJENAMAAN' | 'MAKLUMAT_PAPARAN' | 'UJIAN_AKADEMIK' | 'TAHFIZ'>('UTAMA');
  const [isKawalanMenuHidden, setIsKawalanMenuHidden] = useState<boolean>(false);
  const [newTahfizComp, setNewTahfizComp] = useState({ name: '', weight: 10, soalanPanduan: '' });
  const [newAkademikComp, setNewAkademikComp] = useState({ name: '', weight: 20 });
  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);
  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);
  const [printPukalLayak, setPrintPukalLayak] = useState<boolean>(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);
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

  const tahfizItemsWithRubrics = ensureTahfizRubrics(settings.tahfizItems);
  const tahfizMax = tahfizItemsWithRubrics.reduce((a, b) => a + Number(b.weight || 0), 0) || 100;
  const akademikMax = settings.akademikItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 40;
  const jumlahMax = tahfizMax + akademikMax;

  const handleDownloadLayak = () => {
    const headers = [
      "Bil", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
      "Status Temuduga", "Markah Tahfiz", `Tahfiz Max (${tahfizMax})`, "Markah Akademik", `Akademik Max (${akademikMax})`, 
      "Markah Keseluruhan", `Jumlah Max (${jumlahMax})`, "Markah Peratus (%)", "Status Tawaran", "Maklum Balas"
    ];
    const rows = layakCandidates.map((c, i) => {
      const t = Number(c.markahTahfiz?.jumlah || 0);
      const a = Number(c.markahAkademik?.jumlah || 0);
      const total = t + a;
      const pct = jumlahMax > 0 ? ((total / jumlahMax) * 100).toFixed(1) + '%' : '0%';
      return [
        i + 1, c.ic || '', c.name || '', c.jantina || '', c.tarikhLahir || '', c.tempatLahir || '', 
        c.namaSekolahRendah || '', c.icBapa || '', c.namaBapa || '', c.telefonBapa || '', 
        c.icIbu || '', c.namaIbu || '', c.telefonIbu || '', c.statusTemuduga || '', 
        c.markahTahfiz?.jumlah || '0', tahfizMax,
        c.markahAkademik?.jumlah || '0', akademikMax,
        total, jumlahMax, pct,
        c.statusTawaran || '', c.maklumBalasTawaran || ''
      ];
    });
    downloadCSV([headers, ...rows], `Senarai_Calon_Layak_Temuduga_${layakCandidates.length}.csv`);
  };

  const handleDownloadSemua = () => {
    const headers = [
      "Bil", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", 
      "Sekolah Asal", "No. KP Bapa", "Nama Bapa", "No. Tel Bapa", "No. KP Ibu", "Nama Ibu", "No. Tel Ibu",
      "Status Temuduga", "Markah Tahfiz", `Tahfiz Max (${tahfizMax})`, "Markah Akademik", `Akademik Max (${akademikMax})`, 
      "Markah Keseluruhan", `Jumlah Max (${jumlahMax})`, "Markah Peratus (%)", "Status Tawaran", "Maklum Balas"
    ];
    const rows = candidates.map((c, i) => {
      const t = Number(c.markahTahfiz?.jumlah || 0);
      const a = Number(c.markahAkademik?.jumlah || 0);
      const total = t + a;
      const pct = jumlahMax > 0 ? ((total / jumlahMax) * 100).toFixed(1) + '%' : '0%';
      return [
        i + 1, c.ic || '', c.name || '', c.jantina || '', c.tarikhLahir || '', c.tempatLahir || '', 
        c.namaSekolahRendah || '', c.icBapa || '', c.namaBapa || '', c.telefonBapa || '', 
        c.icIbu || '', c.namaIbu || '', c.telefonIbu || '', c.statusTemuduga || '', 
        c.markahTahfiz?.jumlah || '0', tahfizMax,
        c.markahAkademik?.jumlah || '0', akademikMax,
        total, jumlahMax, pct,
        c.statusTawaran || '', c.maklumBalasTawaran || ''
      ];
    });
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
    } else if (name === 'tarikhBukaUjianAkademik' || name === 'tarikhTutupUjianAkademik') {
      const start = name === 'tarikhBukaUjianAkademik' ? value : (settings.tarikhBukaUjianAkademik || '');
      const end = name === 'tarikhTutupUjianAkademik' ? value : settings.tarikhTutupUjianAkademik;
      if (start) {
        updated.ujianAkademikBuka = isDateActive(start, end);
      }
    } else if (name === 'tarikhAkhirTerimaTawaranDate') {
      updated.tarikhAkhirTerimaTawaranDate = value;
      if (value) {
        updated.tarikhAkhirTerimaTawaran = formatIsoToMalayDate(value);
      }
    } else if (name === 'tarikhAkhirTerimaTawaran') {
      updated.tarikhAkhirTerimaTawaran = value;
      const parsedIso = parseMalayDateToIso(value);
      if (parsedIso) {
        updated.tarikhAkhirTerimaTawaranDate = parsedIso;
      }
    } else if (name === 'tarikhSemakPertimbanganDate') {
      updated.tarikhSemakPertimbanganDate = value;
      if (value) {
        updated.tarikhSemakPertimbangan = formatIsoToMalayDate(value);
      }
    } else if (name === 'tarikhSemakPertimbangan') {
      updated.tarikhSemakPertimbangan = value;
      const parsedIso = parseMalayDateToIso(value);
      if (parsedIso) {
        updated.tarikhSemakPertimbanganDate = parsedIso;
      }
    }

    updateSettings(updated);
  };

  const handleAutoTickAll = () => {
    const autoBorang = isDateActive(settings.tarikhBukaBorang, settings.tarikhTutupBorang);
    const autoTemuduga = isDateActive(settings.tarikhBukaTemuduga, settings.tarikhTutupTemuduga);
    const autoTawaran = isDateActive(settings.tarikhBukaTawaran, settings.tarikhTutupTawaran);
    const autoUjian = settings.tarikhBukaUjianAkademik
      ? isDateActive(settings.tarikhBukaUjianAkademik, settings.tarikhTutupUjianAkademik)
      : Boolean(settings.ujianAkademikBuka);
    updateSettings({
      borangBuka: autoBorang,
      temudugaBuka: autoTemuduga,
      tawaranBuka: autoTawaran,
      ujianAkademikBuka: autoUjian
    });
    setSaveStatusMsg(`Status berjaya di-auto-tick mengikut tarikh hari ini (${getTodayMalaysia()})!`);
    setTimeout(() => setSaveStatusMsg(''), 4000);
  };

  const handleTextSettings = (name: string, value: string) => {
    updateSettings({ [name]: value });
  };

  const handleBatchCancelExpiredOffers = async () => {
    const expiredCandidates = candidates.filter(
      c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran && isOfferExpired(c, settings)
    );
    if (expiredCandidates.length === 0) {
      alert('Tiada calon tawaran yang telah tamat tempoh respon.');
      return;
    }
    const confirmCancel = window.confirm(
      `Sebanyak ${expiredCandidates.length} orang calon ditawarkan masih belum memberi sebarang maklum balas dan telah melepasi tarikh akhir (${settings.tarikhAkhirTerimaTawaran || settings.tarikhAkhirTerimaTawaranDate || 'tiada tarikh'}).\n\nAdakah anda pasti mahu mengemas kini status maklum balas mereka kepada 'TERBATAL' (Tawaran Terbatal Automatik)?`
    );
    if (!confirmCancel) return;
    setIsSavingSettings(true);
    try {
      for (const c of expiredCandidates) {
        await updateCandidate(c.ic, { maklumBalasTawaran: 'TERBATAL' });
      }
      alert(`Berjaya! Sebanyak ${expiredCandidates.length} orang calon kini dikemaskini status kepada 'TERBATAL' dalam sistem.`);
    } catch (e: any) {
      alert('Ralat membatalkan tawaran: ' + (e?.message || 'Sila cuba lagi'));
    } finally {
      setIsSavingSettings(false);
    }
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
        linkGroupWhatsappTemuduga: settings.linkGroupWhatsappTemuduga || '',
        namaPengetua: settings.namaPengetua || 'HAJAH JUITA BINTI HAMZAH',
        tandatanganPengetua: settings.tandatanganPengetua || DEFAULT_TANDATANGAN_PENGETUA
      };
      await updateSettings(partial);
      await syncSettingsToServer(partial);
      setSaveStatusMsg('Tetapan Surat Temuduga, Pautan WhatsApp & Pengetua berjaya disimpan!');
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
        linkGroupWhatsapp: settings.linkGroupWhatsapp || '',
        rujukanSuratTawaran: settings.rujukanSuratTawaran || '',
        tarikhSuratTawaran: settings.tarikhSuratTawaran || '',
        tarikhLaporDiri: settings.tarikhLaporDiri || '',
        masaLaporDiri: settings.masaLaporDiri || '',
        tarikhAkhirTerimaTawaran: settings.tarikhAkhirTerimaTawaran || '',
        tarikhAkhirTerimaTawaranDate: settings.tarikhAkhirTerimaTawaranDate || '',
        tarikhSemakPertimbangan: settings.tarikhSemakPertimbangan || '',
        tarikhSemakPertimbanganDate: settings.tarikhSemakPertimbanganDate || '',
        namaPengarahTawaran: settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN',
        jawatanPengarahTawaran1: settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan',
        jawatanPengarahTawaran2: settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam',
        jawatanPengarahTawaran3: settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang',
        tandatanganPengarahTawaran: settings.tandatanganPengarahTawaran || DEFAULT_TANDATANGAN_PENGARAH
      };
      await updateSettings(partial);
      await syncSettingsToServer(partial);
      setSaveStatusMsg('Tetapan Surat Tawaran, Tarikh Akhir Respon & Group WhatsApp berjaya disimpan!');
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
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'SEMUA' | 'TAHFIZ' | 'AKADEMIK' | 'PENTADBIR' | 'SUPER_ADMIN'>('SEMUA');

  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'SEMUA' && u.role !== userRoleFilter) return false;
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase().trim();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

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
  if (printPukalLayak) return <BorangPukalCetakPDF candidates={layakCandidates} onClose={() => setPrintPukalLayak(false)} titlePrefix="Calon Layak Temuduga" />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={filteredPermohonan} onClose={() => setPrintPukalBorang(false)} />;

  return (
    <div className="space-y-4">
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
       {/* Bar Tab Pembekuan + Kawalan Sistem & Konfigurasi Portal (Sticky Freeze) */}
       <div 
         style={{ top: 'var(--header-height, 116px)' }}
         className="sticky z-40 space-y-2 bg-[#f4f7ee]/95 backdrop-blur-md pb-1.5 pt-0.5 mb-2 transition-all"
       >
         <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-1.5 sm:p-2 flex flex-wrap items-center justify-between gap-2">
           <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1 py-0.5">
             <button 
               type="button"
               onClick={() => setActiveTab('KAWALAN')} 
               className={`px-4 sm:px-5 py-2 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                 activeTab === 'KAWALAN' ? 'bg-slate-900 text-white shadow-slate-300 scale-[1.02]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
               }`}
             >
               <Settings className="w-4 h-4 text-emerald-400" />
               <span>Kawalan Sistem</span>
             </button>
             <button 
               type="button"
               onClick={() => setActiveTab('PENGGUNA')} 
               className={`px-4 sm:px-5 py-2 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                 activeTab === 'PENGGUNA' ? 'bg-amber-600 text-white shadow-amber-200 scale-[1.02]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
               }`}
             >
               <Users className="w-4 h-4 text-amber-200" />
               <span>Daftar Pengguna</span>
             </button>
             <button 
               type="button"
               onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }} 
               className={`px-4 sm:px-5 py-2 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                 activeTab === 'PERMOHONAN' ? 'bg-blue-600 text-white shadow-blue-200 scale-[1.02]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
               }`}
             >
               <FileText className="w-4 h-4 text-blue-200" />
               <span>Permohonan ({candidates.length})</span>
             </button>
             <button 
               type="button"
               onClick={() => setActiveTab('MARKAH')} 
               className={`px-4 sm:px-5 py-2 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                 activeTab === 'MARKAH' ? 'bg-emerald-600 text-white shadow-emerald-200 scale-[1.02]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
               }`}
             >
               <CheckCircle className="w-4 h-4 text-emerald-200" />
               <span>Keputusan</span>
             </button>
             <button 
               type="button"
               onClick={() => setActiveTab('ANALISIS')} 
               className={`px-4 sm:px-5 py-2 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                 activeTab === 'ANALISIS' ? 'bg-purple-600 text-white shadow-purple-200 scale-[1.02]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
               }`}
             >
               <BarChart2 className="w-4 h-4 text-purple-200" />
               <span>Analisis</span>
             </button>
           </div>
         </div>

         {/* Bar Atas Kawalan Sistem & Konfigurasi Portal (Dibekukan / Frozen Bersama Tab Bar) */}
         {activeTab === 'KAWALAN' && (
           <div className="bg-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-200/90 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
             <div>
               <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                 <Settings className="w-5 h-5 text-emerald-600 shrink-0" />
                 <span>Kawalan Sistem &amp; Konfigurasi Portal</span>
               </h3>
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-600">
                 <span className="inline-flex items-center gap-1.5 font-semibold">
                   <span className={`w-2 h-2 rounded-full ${settings.borangBuka ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                   Permohonan: <strong className={settings.borangBuka ? 'text-emerald-700' : 'text-rose-600'}>{settings.borangBuka ? 'DIBUKA' : 'DITUTUP'}</strong>
                 </span>
                 <span className="text-slate-300">·</span>
                 <span className="inline-flex items-center gap-1.5 font-semibold">
                   <span className={`w-2 h-2 rounded-full ${settings.temudugaBuka ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                   Temuduga: <strong className={settings.temudugaBuka ? 'text-emerald-700' : 'text-slate-600'}>{settings.temudugaBuka ? 'DIBUKA' : 'DITUTUP'}</strong>
                 </span>
                 <span className="text-slate-300">·</span>
                 <span className="inline-flex items-center gap-1.5 font-semibold">
                   <span className={`w-2 h-2 rounded-full ${settings.ujianAkademikBuka ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                   Ujian Akademik: <strong className={settings.ujianAkademikBuka ? 'text-emerald-700' : 'text-slate-600'}>{settings.ujianAkademikBuka ? 'DIBUKA' : 'DITUTUP'}</strong>
                 </span>
                 <span className="text-slate-300">·</span>
                 <span className="inline-flex items-center gap-1.5 font-semibold">
                   <span className={`w-2 h-2 rounded-full ${settings.tawaranBuka ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                   Tawaran: <strong className={settings.tawaranBuka ? 'text-emerald-700' : 'text-slate-600'}>{settings.tawaranBuka ? 'DIBUKA' : 'DITUTUP'}</strong>
                 </span>
               </div>
               {saveStatusMsg && (
                 <p className="text-xs text-emerald-600 font-bold mt-1">✓ {saveStatusMsg}</p>
               )}
             </div>

             <div className="flex items-center gap-2 w-full md:w-auto justify-end">
               <button
                 type="button"
                 onClick={() => setIsKawalanMenuHidden(prev => !prev)}
                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1.5 text-xs cursor-pointer shrink-0"
                 title={isKawalanMenuHidden ? 'Papar Menu Kawalan Sistem' : 'Sembunyikan Menu Kawalan Sistem'}
               >
                 {isKawalanMenuHidden ? (
                   <>
                     <PanelLeftOpen className="w-4 h-4 text-emerald-600" />
                     <span>Papar Menu</span>
                   </>
                 ) : (
                   <>
                     <PanelLeftClose className="w-4 h-4 text-slate-600" />
                     <span>Sembunyi Menu</span>
                   </>
                 )}
               </button>

               <button
                 type="button"
                 onClick={handleSaveAllSettings}
                 disabled={isSavingSettings}
                 className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold px-5 py-2 rounded-xl shadow-sm transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0 justify-center"
               >
                 {isSavingSettings ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>Menyimpan...</span>
                   </>
                 ) : (
                   <>
                     <Check className="w-4 h-4" />
                     <span>Simpan Semua Tetapan</span>
                   </>
                 )}
               </button>
             </div>
           </div>
         )}
       </div>

       {activeTab === 'KAWALAN' && (
         <div className="space-y-6">
           {/* Susun Atur 2 Lajur (Gaya Tetapan Moden: Menu di Sebelah Kiri Frozen, Boleh Hide/Unhide & Scroll) */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
             {/* LAJUR KIRI: Navigasi 7 Fungsi Utama (Sticky / Frozen + Scroll + Hide/Unhide) */}
             {!isKawalanMenuHidden && (
               <aside
                 style={{ top: 'calc(var(--header-height, 116px) + 148px)' }}
                 className="lg:col-span-4 xl:col-span-3 lg:sticky lg:self-start bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-slate-200/80 shadow-xs z-20 flex flex-col max-h-[calc(100vh-var(--header-height,116px)-164px)]"
               >
                 <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between shrink-0">
                   <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                     Menu Kawalan Sistem
                   </span>
                   <button
                     type="button"
                     onClick={() => setIsKawalanMenuHidden(true)}
                     className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                     title="Sembunyikan Menu Kawalan Sistem"
                   >
                     <PanelLeftClose className="w-4 h-4" />
                   </button>
                 </div>

                 <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-0.5 flex-1">
                   {[
                     {
                       id: 'UTAMA',
                       label: '1. Tetapan Utama',
                       sub: 'Status buka/tutup & tarikh operasi',
                       icon: Settings,
                       iconBg: 'bg-blue-500 text-white',
                     },
                     {
                       id: 'SURAT_TEMUDUGA',
                       label: '2. Tetapan Surat Temuduga',
                       sub: 'Jadual, tempat, WhatsApp & Pengetua',
                       icon: Calendar,
                       iconBg: 'bg-indigo-500 text-white',
                     },
                     {
                       id: 'SURAT_TAWARAN',
                       label: '3. Tetapan Surat Tawaran',
                       sub: 'Tarikh lapor diri, WhatsApp & Pengarah',
                       icon: Award,
                       iconBg: 'bg-amber-500 text-white',
                     },
                     {
                       id: 'PENJENAMAAN',
                       label: '4. Penjenamaan & Logo Sistem',
                       sub: 'Logo e-QABUL header & footer',
                       icon: Sparkles,
                       iconBg: 'bg-emerald-600 text-white',
                     },
                     {
                       id: 'MAKLUMAT_PAPARAN',
                       label: '5. Pengurusan Maklumat Paparan',
                       sub: 'Pengenalan, video, info, subjek & panduan',
                       icon: BookOpen,
                       iconBg: 'bg-purple-600 text-white',
                     },
                     {
                       id: 'UJIAN_AKADEMIK',
                       label: '6. Tetapan Akademik',
                       sub: 'Penilaian Akademik & wajaran subjek',
                       icon: CheckSquare,
                       iconBg: 'bg-sky-600 text-white',
                     },
                     {
                       id: 'TAHFIZ',
                       label: '7. Tetapan Tahfiz',
                       sub: 'Penilaian Tahfiz & wajaran markah',
                       icon: FileSignature,
                       iconBg: 'bg-teal-600 text-white',
                     },
                   ].map((item) => {
                     const Icon = item.icon;
                     const isActive = kawalanSection === item.id;
                     return (
                       <button
                         key={item.id}
                         type="button"
                         onClick={() => setKawalanSection(item.id as any)}
                         className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer group ${
                           isActive
                             ? 'bg-slate-100/95 text-slate-950 shadow-2xs font-bold'
                             : 'text-slate-700 hover:bg-slate-100/60 hover:text-slate-900 font-medium'
                         }`}
                       >
                         {isActive && (
                           <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-emerald-600" />
                         )}

                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${item.iconBg}`}>
                           <Icon className="w-4 h-4" />
                         </div>

                         <div className="min-w-0 flex-1">
                           <div className={`text-xs sm:text-[13.5px] leading-snug ${isActive ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                             {item.label}
                           </div>
                           <div className="text-[11px] text-slate-500 truncate mt-0.5">
                             {item.sub}
                           </div>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               </aside>
             )}

             {/* LAJUR KANAN: Paparan Kad Tetapan Mengikut Menu Yang Dipilih */}
             <div className={`${isKawalanMenuHidden ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'} space-y-4`}>
               {/* =========================================================
                   1. TETAPAN UTAMA
                  ========================================================= */}
               {kawalanSection === 'UTAMA' && (
                 <div className="space-y-4 animate-in fade-in duration-200">
                   {/* Header Seksyen */}
                   <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                     <div>
                       <h4 className="text-base sm:text-lg font-extrabold text-slate-900">1. Tetapan Utama</h4>
                       <p className="text-xs text-slate-500 mt-0.5">
                         Tarikh hari ini (Malaysia): <strong className="text-slate-800">{getTodayMalaysia()}</strong> · Sistem auto-tick mengikut tarikh mula & akhir.
                       </p>
                     </div>
                     <button
                       type="button"
                       onClick={handleAutoTickAll}
                       className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
                     >
                       <CheckSquare className="w-4 h-4 text-indigo-600" />
                       <span>Auto-Tick Ikut Tarikh Hari Ini</span>
                     </button>
                   </div>

                   {/* Kad 1: Tahun Sesi Kemasukan */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                           <School className="w-5 h-5" />
                         </div>
                         <div>
                           <h5 className="font-bold text-slate-900 text-sm sm:text-base">Tahun Sesi Kemasukan</h5>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Tahun sesi kemasukan murid Tingkatan 1 yang dipaparkan pada header dan surat rasmi
                           </p>
                         </div>
                       </div>
                       <div className="w-full sm:w-56 shrink-0">
                         <input
                           type="text"
                           name="sesiKemasukan"
                           value={settings.sesiKemasukan || '2026 / 2027'}
                           onChange={handleSettingsChange}
                           className="w-full border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white outline-none"
                           placeholder="cth: 2026 / 2027"
                         />
                       </div>
                     </div>
                   </div>

                   {/* Kad 2: Kawalan Borang Permohonan */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-4">
                     <div className="flex items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2.5 flex-wrap">
                             <h5 className="font-bold text-slate-900 text-sm sm:text-base">Borang Permohonan Kemasukan</h5>
                             <span className={`text-[11px] font-bold ${settings.borangBuka ? 'text-emerald-700' : 'text-rose-600'}`}>
                               · {settings.borangBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                             </span>
                             {settings.tarikhBukaBorang && (
                               <span className="text-[11px] text-slate-500 font-medium">
                                 ({isDateActive(settings.tarikhBukaBorang, settings.tarikhTutupBorang) ? '✓ Auto-aktif' : '⏳ Auto-tutup'})
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Buka atau tutup akses mengisi borang permohonan kemasukan Tingkatan 1 kepada orang awam
                           </p>
                         </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer shrink-0">
                         <input type="checkbox" name="borangBuka" checked={settings.borangBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 pl-0 sm:pl-14">
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Mula Dibuka</label>
                         <input type="date" name="tarikhBukaBorang" value={settings.tarikhBukaBorang || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Akhir / Ditutup (Pilihan)</label>
                         <input type="date" name="tarikhTutupBorang" value={settings.tarikhTutupBorang || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                     </div>
                   </div>

                   {/* Kad 3: Kawalan Semakan Temuduga */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-4">
                     <div className="flex items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                           <Search className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2.5 flex-wrap">
                             <h5 className="font-bold text-slate-900 text-sm sm:text-base">Semakan Kelayakan Temuduga</h5>
                             <span className={`text-[11px] font-bold ${settings.temudugaBuka ? 'text-emerald-700' : 'text-rose-600'}`}>
                               · {settings.temudugaBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                             </span>
                             {settings.tarikhBukaTemuduga && (
                               <span className="text-[11px] text-slate-500 font-medium">
                                 ({isDateActive(settings.tarikhBukaTemuduga, settings.tarikhTutupTemuduga) ? '✓ Auto-aktif' : '⏳ Auto-tutup'})
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Buka atau tutup semakan keputusan panggilan temuduga dan muat turun surat panggilan
                           </p>
                         </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer shrink-0">
                         <input type="checkbox" name="temudugaBuka" checked={settings.temudugaBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 pl-0 sm:pl-14">
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Mula Paparan</label>
                         <input type="date" name="tarikhBukaTemuduga" value={settings.tarikhBukaTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Akhir Paparan (Pilihan)</label>
                         <input type="date" name="tarikhTutupTemuduga" value={settings.tarikhTutupTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                     </div>
                   </div>

                   {/* Kad 4: Kawalan Semakan Tawaran */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-4">
                     <div className="flex items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                           <Award className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2.5 flex-wrap">
                             <h5 className="font-bold text-slate-900 text-sm sm:text-base">Semakan Keputusan Tawaran</h5>
                             <span className={`text-[11px] font-bold ${settings.tawaranBuka ? 'text-emerald-700' : 'text-rose-600'}`}>
                               · {settings.tawaranBuka ? 'STATUS: DIBUKA' : 'STATUS: DITUTUP'}
                             </span>
                             {settings.tarikhBukaTawaran && (
                               <span className="text-[11px] text-slate-500 font-medium">
                                 ({isDateActive(settings.tarikhBukaTawaran, settings.tarikhTutupTawaran) ? '✓ Auto-aktif' : '⏳ Auto-tutup'})
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Buka atau tutup semakan keputusan tawaran kemasukan Tingkatan 1 dan pengesahan terima/tolak
                           </p>
                         </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer shrink-0">
                         <input type="checkbox" name="tawaranBuka" checked={settings.tawaranBuka} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 pl-0 sm:pl-14">
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Mula Paparan</label>
                         <input type="date" name="tarikhBukaTawaran" value={settings.tarikhBukaTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Akhir Paparan (Pilihan)</label>
                         <input type="date" name="tarikhTutupTawaran" value={settings.tarikhTutupTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                     </div>
                   </div>

                   {/* Kad 5: Kawalan Status Portal Ujian Akademik Calon */}
                   <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-4">
                     <div className="flex items-center justify-between gap-4">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                           <BookOpen className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2.5 flex-wrap">
                             <h5 className="font-bold text-slate-900 text-sm sm:text-base">Portal Ujian Akademik Calon</h5>
                             <span className={`text-[11px] font-bold ${settings.ujianAkademikBuka ? 'text-emerald-700' : 'text-rose-600'}`}>
                               · {settings.ujianAkademikBuka ? 'STATUS: DIBUKA (MENU MUNCUL)' : 'STATUS: DITUTUP (MENU DISEMBUNYIKAN)'}
                             </span>
                             {settings.tarikhBukaUjianAkademik && (
                               <span className="text-[11px] text-slate-500 font-medium">
                                 ({isDateActive(settings.tarikhBukaUjianAkademik, settings.tarikhTutupUjianAkademik) ? '✓ Auto-aktif' : '⏳ Auto-tutup'})
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Menu <strong>Ujian Akademik</strong> di bar navigasi utama hanya akan muncul kepada calon apabila status portal ini dibuka (manual atau automatik mengikut tarikh).
                           </p>
                         </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer shrink-0">
                         <input type="checkbox" name="ujianAkademikBuka" checked={Boolean(settings.ujianAkademikBuka)} onChange={handleSettingsChange} className="sr-only peer" />
                         <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                       </label>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 pl-0 sm:pl-14">
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Mula Buka Portal Ujian (Auto)</label>
                         <input type="date" name="tarikhBukaUjianAkademik" value={settings.tarikhBukaUjianAkademik || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Akhir / Tutup Portal Ujian (Pilihan)</label>
                         <input type="date" name="tarikhTutupUjianAkademik" value={settings.tarikhTutupUjianAkademik || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white" />
                       </div>
                     </div>

                     <div className="pl-0 sm:pl-14 pt-1 flex items-center justify-between flex-wrap gap-2">
                       <span className="text-[11px] text-slate-500">
                         Tempoh semasa: <strong>{settings.masaUjianAkademikMinit || 30} minit</strong> · PIN: <strong>{settings.pinUjianAkademik || 'Tiada PIN'}</strong>
                       </span>
                       <button
                         type="button"
                         onClick={() => setKawalanSection('UJIAN_AKADEMIK')}
                         className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                       >
                         Buka Tetapan Penuh & Soalan Ujian Akademik →
                       </button>
                     </div>
                   </div>
                 </div>
               )}

               {/* =========================================================
                   2. TETAPAN SURAT TEMUDUGA
                  ========================================================= */}
               {kawalanSection === 'SURAT_TEMUDUGA' && (
                 <div className="space-y-4 animate-in fade-in duration-200">
                   <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                     <div>
                       <h4 className="text-base sm:text-lg font-extrabold text-slate-900">2. Tetapan Surat Temuduga</h4>
                       <p className="text-xs text-slate-500 mt-0.5">
                         Ketetapan tarikh, masa, lokasi, etika pakaian serta tandatangan Pengetua pada Surat Panggilan Temuduga.
                       </p>
                     </div>
                     <button
                       type="button"
                       onClick={handleSaveTemudugaSettings}
                       disabled={isSavingSettings}
                       className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-2 text-xs shrink-0 cursor-pointer"
                     >
                       <Check className="w-3.5 h-3.5" />
                       <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Tetapan Temuduga'}</span>
                     </button>
                   </div>

                   {/* Kad 1: Maklumat Jadual & Tempat Temuduga */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                         <Calendar className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Tarikh, Masa, Tempat & Etika Pakaian</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Maklumat ini akan dipaparkan secara automatik di dalam Surat Panggilan Temuduga bagi calon yang layak
                         </p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Keluar Surat (Atas Kanan)</label>
                         <input type="text" name="tarikhSuratPanggilan" value={settings.tarikhSuratPanggilan || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 8 September 2026" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Temuduga</label>
                         <input type="text" name="tarikhTemuduga" value={settings.tarikhTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 8 November 2026" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Hari Temuduga</label>
                         <input type="text" name="hariTemuduga" value={settings.hariTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: Sabtu" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Masa Temuduga</label>
                         <input type="text" name="masaTemuduga" value={settings.masaTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 8.00 pagi" />
                       </div>
                       <div className="lg:col-span-2">
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tempat Temuduga</label>
                         <input type="text" name="tempatTemuduga" value={settings.tempatTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: Laman Selera, SMA Kota Gelanggi 3" />
                       </div>
                       <div className="md:col-span-2 lg:col-span-3">
                         <label className="block text-xs font-bold text-slate-600 mb-1">Etika Pakaian Temuduga</label>
                         <input type="text" name="pakaianTemuduga" value={settings.pakaianTemuduga || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: Uniform sekolah lengkap" />
                       </div>
                     </div>
                   </div>

                   {/* Kad 2: Pautan Group WhatsApp Rasmi (Calon Layak Temuduga) */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                         <MessageCircle className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pautan Group WhatsApp Rasmi (Calon Layak Temuduga)</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Hanya dipaparkan kepada calon yang berstatus <strong>LAYAK KE TEMUDUGA</strong> pada halaman Semakan Kelayakan Temuduga
                         </p>
                       </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                       <input
                         type="url"
                         name="linkGroupWhatsappTemuduga"
                         value={settings.linkGroupWhatsappTemuduga || ''}
                         onChange={handleSettingsChange}
                         className="flex-1 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none"
                         placeholder="https://chat.whatsapp.com/XXXXX..."
                       />
                       {settings.linkGroupWhatsappTemuduga ? (
                         <a
                           href={settings.linkGroupWhatsappTemuduga}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                         >
                           <MessageCircle className="w-3.5 h-3.5" />
                           <span>Uji Pautan WhatsApp</span>
                           <ExternalLink className="w-3 h-3 opacity-80" />
                         </a>
                       ) : (
                         <span className="text-xs text-amber-700 font-bold bg-amber-50 px-3.5 py-2.5 rounded-xl border border-amber-200 whitespace-nowrap text-center">
                           Pautan Belum Ditetapkan
                         </span>
                       )}
                     </div>
                   </div>

                   {/* Kad 3: Maklumat Pengetua & Tandatangan */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                         <FileSignature className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Maklumat Pengetua & Tandatangan Digital</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Nama dan tandatangan Pengetua SMA Kota Gelanggi 3 pada Surat Panggilan Temuduga
                         </p>
                       </div>
                     </div>

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
                           className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs uppercase"
                         />
                         <p className="text-[11px] text-slate-500 leading-relaxed">
                           Nama pengetua akan tertera pada bahagian bawah Surat Panggilan Temuduga bersama jawatan Pengetua SMA Kota Gelanggi 3.
                         </p>
                       </div>

                       <div className="lg:col-span-7 space-y-3">
                         <label className="block text-xs font-bold text-slate-700">
                           Imej Tandatangan Pengetua
                         </label>

                         {settings.tandatanganPengetua ? (
                           <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                             <div className="flex items-center gap-4">
                               <div className="h-16 w-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
                                 <img
                                   src={settings.tandatanganPengetua}
                                   alt="Imej Tandatangan Pengetua"
                                   className="h-full w-full object-contain"
                                 />
                               </div>
                               <div>
                                 <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
                                   <Check className="w-3.5 h-3.5" /> Tandatangan Aktif
                                 </span>
                                 <span className="text-[11px] text-slate-600 block mt-1 font-semibold truncate max-w-[200px]">
                                   {settings.namaPengetua || 'HAJAH JUITA BINTI HAMZAH'}
                                 </span>
                               </div>
                             </div>
                             <button
                               type="button"
                               onClick={() => updateSettings({ tandatanganPengetua: '' })}
                               className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
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
                               className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition whitespace-nowrap cursor-pointer"
                             >
                               Guna Tandatangan Rasmi
                             </button>
                           </div>
                         )}

                         <div className="flex flex-wrap items-center gap-2 pt-1">
                           <label className="cursor-pointer bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs">
                             <Upload className="w-3.5 h-3.5 text-emerald-600" />
                             <span>Muat Naik Fail Gambar</span>
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
                                   }
                                 }
                               }}
                             />
                           </label>

                           <button
                             type="button"
                             onClick={() => setSignaturePadTarget('PENGETUA')}
                             className="bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                           >
                             <PenTool className="w-3.5 h-3.5 text-blue-600" />
                             <span>Tandatangan Atas Skrin</span>
                           </button>

                           {settings.tandatanganPengetua !== DEFAULT_TANDATANGAN_PENGETUA && (
                             <button
                               type="button"
                               onClick={() => updateSettings({ tandatanganPengetua: DEFAULT_TANDATANGAN_PENGETUA })}
                               className="text-xs text-slate-500 hover:text-emerald-700 font-semibold underline px-2 py-1 flex items-center gap-1 cursor-pointer"
                             >
                               <RotateCcw className="w-3 h-3" /> Set Semula Rasmi
                             </button>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* =========================================================
                   3. TETAPAN SURAT TAWARAN
                  ========================================================= */}
               {kawalanSection === 'SURAT_TAWARAN' && (
                 <div className="space-y-4 animate-in fade-in duration-200">
                   <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                     <div>
                       <h4 className="text-base sm:text-lg font-extrabold text-slate-900">3. Tetapan Surat Tawaran</h4>
                       <p className="text-xs text-slate-500 mt-0.5">
                         Pengurusan rujukan surat, tarikh lapor diri, tarikh akhir pengesahan, pautan WhatsApp & tandatangan Pengarah.
                       </p>
                     </div>
                     <button
                       type="button"
                       onClick={handleSaveTawaranSettings}
                       disabled={isSavingSettings}
                       className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-2 text-xs shrink-0 cursor-pointer"
                     >
                       <Check className="w-3.5 h-3.5" />
                       <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Tetapan Tawaran'}</span>
                     </button>
                   </div>

                   {/* Kad 1: Maklumat Asas Surat Tawaran & Lapor Diri */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Maklumat Rujukan Surat, Lapor Diri & Borang Pendaftaran</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Butiran rasmi yang dipaparkan pada Surat Tawaran Kemasukan Tingkatan 1
                         </p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
                       <div>
                         <div className="flex items-center justify-between mb-1">
                           <label className="block text-xs font-bold text-slate-600">Pautan Borang Pendaftaran</label>
                           {settings.borangTingkatan1Link && (
                             <a
                               href={settings.borangTingkatan1Link.startsWith('http') ? settings.borangTingkatan1Link : `https://${settings.borangTingkatan1Link}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-[10.5px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                             >
                               <ExternalLink className="w-3 h-3" /> Uji Pautan
                             </a>
                           )}
                         </div>
                         <input type="text" name="borangTingkatan1Link" value={settings.borangTingkatan1Link || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="https://drive.google.com/..." />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Rujukan Surat</label>
                         <input type="text" name="rujukanSuratTawaran" value={settings.rujukanSuratTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: JPNP.SPI.800-1/1/4 Jld.2" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Surat (Atas Kanan)</label>
                         <input type="text" name="tarikhSuratTawaran" value={settings.tarikhSuratTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 17 November 2025" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Tarikh Lapor Diri</label>
                         <input type="text" name="tarikhLaporDiri" value={settings.tarikhLaporDiri || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 11 JANUARI 2026 (AHAD)" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Masa Lapor Diri</label>
                         <input type="text" name="masaLaporDiri" value={settings.masaLaporDiri || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="cth: 8.30 PAGI" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Nama Penandatangan Tawaran</label>
                         <input type="text" name="namaPengarahTawaran" value={settings.namaPengarahTawaran || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold uppercase text-slate-800 bg-slate-50 focus:bg-white" placeholder="HAJI HASDAN BIN HASAN" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Jawatan Baris 1</label>
                         <input type="text" name="jawatanPengarahTawaran1" value={settings.jawatanPengarahTawaran1 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="Ketua Penolong Pengarah Kanan" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Jawatan Baris 2</label>
                         <input type="text" name="jawatanPengarahTawaran2" value={settings.jawatanPengarahTawaran2 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="Sektor Pendidikan Islam" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1">Jawatan Baris 3</label>
                         <input type="text" name="jawatanPengarahTawaran3" value={settings.jawatanPengarahTawaran3 || ''} onChange={handleSettingsChange} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-slate-50 focus:bg-white" placeholder="b.p Pengarah Pendidikan Pahang" />
                       </div>
                     </div>
                   </div>

                   {/* Kad 2: Tarikh Akhir Pengesahan Penerimaan Tawaran */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                           <Calendar className="w-5 h-5" />
                         </div>
                         <div>
                           <h5 className="font-bold text-slate-900 text-sm sm:text-base">Tarikh Akhir Pengesahan Penerimaan Tawaran</h5>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Calon wajib membuat pengesahan (Terima / Tolak) sebelum atau pada tarikh ini. Gagal respon akan menyebabkan tawaran terbatal secara automatik.
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                       <div>
                         <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Tarikh Akhir (Kalendar):</label>
                         <input
                           type="date"
                           name="tarikhAkhirTerimaTawaranDate"
                           value={settings.tarikhAkhirTerimaTawaranDate || ''}
                           onChange={handleSettingsChange}
                           className="w-full border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 bg-white outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-700 mb-1">Teks Paparan Tarikh (Surat & Semakan Awam):</label>
                         <input
                           type="text"
                           name="tarikhAkhirTerimaTawaran"
                           value={settings.tarikhAkhirTerimaTawaran || ''}
                           onChange={handleSettingsChange}
                           className="w-full border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 bg-white outline-none"
                           placeholder="cth: 28 November 2026"
                         />
                       </div>
                     </div>

                     <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                       <div className="flex items-center gap-2 flex-wrap text-slate-600">
                         <span className="font-bold text-rose-700">Polisi Auto-Batal Aktif</span>
                         <span>·</span>
                         <span>Belum Maklum Balas: <strong className="text-amber-800">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && !c.maklumBalasTawaran && !isOfferExpired(c, settings)).length}</strong> orang</span>
                         <span>·</span>
                         <span>Terbatal: <strong className="text-rose-700">{candidates.filter(c => c.statusTawaran === 'BERJAYA' && (c.maklumBalasTawaran === 'TERBATAL' || (!c.maklumBalasTawaran && isOfferExpired(c, settings)))).length}</strong> orang</span>
                       </div>

                       <button
                         type="button"
                         onClick={handleBatchCancelExpiredOffers}
                         className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-2xs transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                       >
                         <AlertTriangle className="w-3.5 h-3.5" />
                         <span>Imbas & Sahkan Status Terbatal</span>
                       </button>
                     </div>
                   </div>

                   {/* Kad 3: Pautan Group WhatsApp Rasmi */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                         <MessageCircle className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pautan Group WhatsApp Rasmi (Calon Menerima Tawaran)</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Hanya dipaparkan kepada calon yang telah mengesahkan <strong>MENERIMA TAWARAN</strong>
                         </p>
                       </div>
                     </div>

                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                       <input
                         type="url"
                         name="linkGroupWhatsapp"
                         value={settings.linkGroupWhatsapp || ''}
                         onChange={handleSettingsChange}
                         className="flex-1 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none"
                         placeholder="https://chat.whatsapp.com/XXXXX..."
                       />
                       {settings.linkGroupWhatsapp ? (
                         <a
                           href={settings.linkGroupWhatsapp}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                         >
                           <MessageCircle className="w-3.5 h-3.5" />
                           <span>Uji Pautan WhatsApp</span>
                           <ExternalLink className="w-3 h-3 opacity-80" />
                         </a>
                       ) : (
                         <span className="text-xs text-amber-700 font-bold bg-amber-50 px-3.5 py-2.5 rounded-xl border border-amber-200 whitespace-nowrap text-center">
                           Pautan Belum Ditetapkan
                         </span>
                       )}
                     </div>
                   </div>

                   {/* Kad 4: Tarikh Semakan Semula Keputusan (Dalam Pertimbangan) */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                       <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                           <Clock className="w-5 h-5" />
                         </div>
                         <div>
                           <h5 className="font-bold text-slate-900 text-sm sm:text-base">Tarikh Semakan Semula (Calon Dalam Pertimbangan)</h5>
                           <p className="text-xs text-slate-500 mt-0.5">
                             Tarikh untuk calon berstatus &quot;Dalam Proses Penilaian&quot; menyemak semula keputusan tawaran ({candidates.filter(c => c.statusTawaran === 'DALAM_PERTIMBANGAN' || (!c.statusTawaran && c.statusTemuduga === 'LAYAK')).length} calon semasa)
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                       <div>
                         <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Tarikh Semakan Semula (Kalendar):</label>
                         <input
                           type="date"
                           name="tarikhSemakPertimbanganDate"
                           value={settings.tarikhSemakPertimbanganDate || ''}
                           onChange={handleSettingsChange}
                           className="w-full border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 bg-white outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-700 mb-1">Teks Paparan Tarikh (Portal Semakan):</label>
                         <input
                           type="text"
                           name="tarikhSemakPertimbangan"
                           value={settings.tarikhSemakPertimbangan || ''}
                           onChange={handleSettingsChange}
                           className="w-full border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 bg-white outline-none"
                           placeholder="cth: 30 Oktober 2026"
                         />
                       </div>
                     </div>
                   </div>

                   {/* Kad 5: Tandatangan Ketua Penolong Pengarah Kanan */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                         <FileSignature className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Tandatangan Ketua Penolong Pengarah Kanan (Surat Tawaran)</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Imej tandatangan pengesahan pada Surat Tawaran Kemasukan Tingkatan 1
                         </p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
                       <div className="lg:col-span-5 space-y-2">
                         <label className="block text-xs font-bold text-slate-700">Pratonton Maklumat Penandatangan</label>
                         <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                           <span className="text-xs font-bold text-slate-900 block uppercase">
                             {settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN'}
                           </span>
                           <span className="text-[11px] text-slate-500 block leading-tight">
                             {settings.jawatanPengarahTawaran1 || 'Ketua Penolong Pengarah Kanan'}<br />
                             {settings.jawatanPengarahTawaran2 || 'Sektor Pendidikan Islam'}<br />
                             {settings.jawatanPengarahTawaran3 || 'b.p Pengarah Pendidikan Pahang'}
                           </span>
                         </div>
                       </div>

                       <div className="lg:col-span-7 space-y-3">
                         <label className="block text-xs font-bold text-slate-700">Imej Tandatangan Pengarah</label>
                         {settings.tandatanganPengarahTawaran ? (
                           <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                             <div className="flex items-center gap-4">
                               <div className="h-16 w-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
                                 <img
                                   src={settings.tandatanganPengarahTawaran}
                                   alt="Tandatangan Tawaran"
                                   className="h-full w-full object-contain"
                                 />
                               </div>
                               <div>
                                 <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
                                   <Check className="w-3.5 h-3.5" /> Tandatangan Aktif
                                 </span>
                                 <span className="text-[11px] text-slate-600 block mt-1 font-semibold truncate max-w-[200px]">
                                   {settings.namaPengarahTawaran || 'HAJI HASDAN BIN HASAN'}
                                 </span>
                               </div>
                             </div>
                             <button
                               type="button"
                               onClick={() => updateSettings({ tandatanganPengarahTawaran: '' })}
                               className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
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
                               className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition whitespace-nowrap cursor-pointer"
                             >
                               Guna Tandatangan Rasmi
                             </button>
                           </div>
                         )}

                         <div className="flex flex-wrap items-center gap-2 pt-1">
                           <label className="cursor-pointer bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs">
                             <Upload className="w-3.5 h-3.5 text-emerald-600" />
                             <span>Muat Naik Fail Gambar</span>
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
                                   }
                                 }
                               }}
                             />
                           </label>

                           <button
                             type="button"
                             onClick={() => setSignaturePadTarget('PENGARAH')}
                             className="bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                           >
                             <PenTool className="w-3.5 h-3.5 text-blue-600" />
                             <span>Tandatangan Atas Skrin</span>
                           </button>

                           {settings.tandatanganPengarahTawaran !== DEFAULT_TANDATANGAN_PENGARAH && (
                             <button
                               type="button"
                               onClick={() => updateSettings({ tandatanganPengarahTawaran: DEFAULT_TANDATANGAN_PENGARAH })}
                               className="text-xs text-slate-500 hover:text-emerald-700 font-semibold underline px-2 py-1 flex items-center gap-1 cursor-pointer"
                             >
                               <RotateCcw className="w-3 h-3" /> Set Semula Rasmi
                             </button>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* =========================================================
                   4. PENJENAMAAN & LOGO SISTEM
                  ========================================================= */}
               {kawalanSection === 'PENJENAMAAN' && (
                 <div className="space-y-4 animate-in fade-in duration-200">
                   <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/80 shadow-2xs">
                     <h4 className="text-base sm:text-lg font-extrabold text-slate-900">4. Penjenamaan & Logo Sistem</h4>
                     <p className="text-xs text-slate-500 mt-0.5">
                       Pengurusan identiti visual rasmi <strong>e-QABUL</strong> dan gandingan bersama Logo SMA Kota Gelanggi 3.
                     </p>
                   </div>

                   {/* Kad 1: Pratonton Langsung Header */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                         <Sparkles className="w-5 h-5" />
                       </div>
                       <div>
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pratonton Gandingan Logo di Bar Utama (Header)</h5>
                         <p className="text-xs text-slate-500 mt-0.5">
                           Logo rasmi sekolah SMA Kota Gelanggi 3 digandingkan bersama logo sistem e-QABUL
                         </p>
                       </div>
                     </div>

                     <div className="bg-gradient-to-r from-[#074731] via-[#0c6b4b] to-[#074731] p-4 rounded-xl text-white flex items-center justify-between border border-emerald-900 shadow-inner">
                       <div className="flex items-center gap-4">
                         <div className="bg-white p-1 rounded-full w-14 h-14 flex items-center justify-center shrink-0 shadow-md ring-2 ring-emerald-400/40">
                           <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo SMAG3" className="h-11 w-auto object-contain" />
                         </div>
                         <div className="hidden sm:block border-r border-emerald-400/30 pr-4 py-0.5">
                           <span className="font-black text-sm tracking-tight uppercase block">SMA KOTA GELANGGI 3</span>
                           <span className="text-[10px] text-emerald-200 uppercase font-semibold">Jerantut, Pahang</span>
                         </div>
                         <EQabulBrand customUrl={settings.logoEqabulUrl} />
                       </div>
                     </div>
                   </div>

                   {/* Kad 2: Logo e-QABUL Header */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs">
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                       <div className="md:col-span-8 space-y-2">
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Logo e-QABUL Header (Bulatan Atas)</h5>
                         <p className="text-xs text-slate-500">
                           Muat naik fail imej logo e-QABUL atau masukkan pautan URL terus untuk dipaparkan pada bulatan logo kedua di bahagian Header.
                         </p>
                         <input
                           type="text"
                           name="logoEqabulUrl"
                           value={settings.logoEqabulUrl || ''}
                           onChange={handleSettingsChange}
                           placeholder="Pautan URL terus (contoh: https://i.postimg.cc/.../logo.png)"
                           className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                         />
                       </div>
                       <div className="md:col-span-4 flex flex-col justify-center items-center gap-2.5">
                         {settings.logoEqabulUrl && (
                           <div className="relative group w-14 h-14 rounded-xl bg-white p-1.5 border border-slate-200 shadow-2xs flex items-center justify-center">
                             <img src={settings.logoEqabulUrl} alt="Preview Header" className="max-h-full max-w-full object-contain" />
                             <button
                               type="button"
                               onClick={() => updateSettings({ logoEqabulUrl: '' })}
                               className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full text-xs shadow-md hover:bg-red-600 cursor-pointer"
                               title="Padam Gambar"
                             >
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                         )}
                         <label className="w-full cursor-pointer bg-slate-50 border border-dashed border-emerald-500 hover:bg-emerald-50 text-slate-700 text-xs font-bold p-3 rounded-xl transition flex flex-col items-center justify-center gap-1 text-center">
                           <Upload className="w-4 h-4 text-emerald-600" />
                           <span>Muat Naik Logo Header</span>
                           <span className="text-[10px] text-slate-400 font-normal">PNG / JPG / WEBP</span>
                           <input
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 try {
                                   const compressed = await compressImageFile(file, 800, 800, 0.95);
                                   if (compressed) {
                                     updateSettings({ logoEqabulUrl: compressed });
                                   }
                                 } catch (err) {
                                   console.error('Ralat logo e-qabul header:', err);
                                 }
                               }
                             }}
                           />
                         </label>
                       </div>
                     </div>
                   </div>

                   {/* Kad 3: Logo e-QABUL Melintang Footer */}
                   <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs">
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                       <div className="md:col-span-8 space-y-2">
                         <h5 className="font-bold text-slate-900 text-sm sm:text-base">Logo e-QABUL Melintang (Footer)</h5>
                         <p className="text-xs text-slate-500">
                           Muat naik fail imej logo melintang atau tampal pautan URL untuk rujukan identiti di bahagian bawah halaman.
                         </p>
                         <input
                           type="text"
                           name="logoEqabulHorizontalUrl"
                           value={settings.logoEqabulHorizontalUrl || ''}
                           onChange={handleSettingsChange}
                           placeholder="Pautan URL terus (contoh: https://i.postimg.cc/.../logo-melintang.png)"
                           className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                         />
                       </div>
                       <div className="md:col-span-4 flex flex-col justify-center items-center gap-2.5">
                         {settings.logoEqabulHorizontalUrl && (
                           <div className="relative group h-12 px-3 rounded-xl bg-white p-1 border border-slate-200 shadow-2xs flex items-center justify-center">
                             <img src={settings.logoEqabulHorizontalUrl} alt="Preview Footer" className="max-h-full w-auto object-contain" />
                             <button
                               type="button"
                               onClick={() => updateSettings({ logoEqabulHorizontalUrl: '' })}
                               className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full text-xs shadow-md hover:bg-red-600 cursor-pointer"
                               title="Padam Gambar"
                             >
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                         )}
                         <label className="w-full cursor-pointer bg-slate-50 border border-dashed border-amber-500 hover:bg-amber-50 text-slate-700 text-xs font-bold p-3 rounded-xl transition flex flex-col items-center justify-center gap-1 text-center">
                           <Upload className="w-4 h-4 text-amber-600" />
                           <span>Muat Naik Logo Footer</span>
                           <span className="text-[10px] text-slate-400 font-normal">PNG / JPG / WEBP</span>
                           <input
                             type="file"
                             accept="image/*"
                             className="hidden"
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 try {
                                   const compressed = await compressImageFile(file, 1200, 600, 0.95);
                                   if (compressed) {
                                       updateSettings({ logoEqabulHorizontalUrl: compressed });
                                   }
                                 } catch (err) {
                                   console.error('Ralat logo e-qabul footer:', err);
                                 }
                               }
                             }}
                           />
                         </label>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* =========================================================
                   5. PENGURUSAN MAKLUMAT PAPARAN
                  ========================================================= */}
               {kawalanSection === 'MAKLUMAT_PAPARAN' && (
                 <PengurusanMaklumatPaparan />
               )}

               {/* =========================================================
                   6. TETAPAN AKADEMIK (HANYA KAD PENILAIAN AKADEMIK - GAMBAR 2)
                  ========================================================= */}
               {kawalanSection === 'UJIAN_AKADEMIK' && (
                 <div className="animate-in fade-in duration-200 max-w-2xl">
                   <PenilaianAkademikCard />
                 </div>
               )}

               {/* =========================================================
                   7. TETAPAN TAHFIZ (HANYA KAD PENILAIAN TAHFIZ - GAMBAR 1)
                  ========================================================= */}
               {kawalanSection === 'TAHFIZ' && (
                 <div className="animate-in fade-in duration-200 max-w-2xl">
                   <PenilaianTahfizCard />
                 </div>
               )}

               {/* Bar Bawah Simpan Tetapan */}
               <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                 <span className="text-xs text-slate-500">
                   Pastikan anda menekan butang simpan selepas membuat perubahan supaya tetapan dikemaskini ke pangkalan data.
                 </span>
                 <button
                   type="button"
                   onClick={handleSaveAllSettings}
                   disabled={isSavingSettings}
                   className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
                 >
                   {isSavingSettings ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       <span>Menyimpan Tetapan...</span>
                     </>
                   ) : (
                     <>
                       <Check className="w-4 h-4 text-emerald-400" />
                       <span>Simpan Semua Tetapan Sistem</span>
                     </>
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {activeTab === 'PENGGUNA' && (
          <div className="space-y-12 animate-in fade-in">
             <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                   <div>
                      <div className="flex items-center gap-3">
                         <h3 className="text-xl font-bold text-slate-900">Senarai Pengguna Sistem</h3>
                         <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                           {users.length} Akaun
                         </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Urus senarai pengguna, cari nama pentadbir/guru, tukar kata laluan, dan peranan akaun.</p>
                   </div>

                   {/* Carian & Penapis Pengguna */}
                   <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                      <div className="relative min-w-[280px]">
                         <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                         <input 
                            type="text" 
                            value={userSearchQuery} 
                            onChange={e => setUserSearchQuery(e.target.value)} 
                            placeholder="Cari nama pengguna atau ID login..." 
                            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-xs font-medium text-slate-800 placeholder:text-slate-400"
                         />
                         {userSearchQuery && (
                            <button 
                               type="button" 
                               onClick={() => setUserSearchQuery('')} 
                               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition"
                               title="Kosongkan carian"
                            >
                               <X className="w-3.5 h-3.5" />
                            </button>
                         )}
                      </div>

                      {/* Tapisan Peranan */}
                      <select 
                         value={userRoleFilter} 
                         onChange={e => setUserRoleFilter(e.target.value as any)} 
                         className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs"
                      >
                         <option value="SEMUA">Semua Peranan ({users.length})</option>
                         <option value="TAHFIZ">Guru Tahfiz ({users.filter(u => u.role === "TAHFIZ").length})</option>
                         <option value="AKADEMIK">Guru Akademik ({users.filter(u => u.role === "AKADEMIK").length})</option>
                         <option value="PENTADBIR">Pentadbir ({users.filter(u => u.role === "PENTADBIR").length})</option>
                         <option value="SUPER_ADMIN">Super Admin ({users.filter(u => u.role === "SUPER_ADMIN").length})</option>
                      </select>
                   </div>
                </div>

                {/* Maklumat Hasil Carian */}
                {(userSearchQuery.trim() || userRoleFilter !== "SEMUA") && (
                   <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between text-xs text-amber-900">
                      <span className="font-medium">
                         Menunjukkan <strong className="font-bold text-amber-950">{filteredUsers.length}</strong> daripada <strong className="font-bold text-amber-950">{users.length}</strong> pengguna
                         {userSearchQuery.trim() && <> untuk carian nama/ID "<strong>{userSearchQuery}</strong>"</>}
                         {userRoleFilter !== "SEMUA" && <> [Peranan: <strong>{userRoleFilter}</strong>]</>}
                      </span>
                      <button 
                         type="button" 
                         onClick={() => { setUserSearchQuery(''); setUserRoleFilter("SEMUA"); }}
                         className="font-bold underline hover:text-amber-950 text-amber-800 text-xs ml-2 cursor-pointer"
                      >
                         Reset Carian
                      </button>
                   </div>
                )}

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
                         {filteredUsers.length > 0 ? (
                            filteredUsers.map(u => (
                               <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-slate-800">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 flex-shrink-0">
                                           {u.name ? u.name.trim().charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <span className="font-semibold text-slate-800">{u.name}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.username}</td>
                                  <td className="px-6 py-4">
                                     {u.role === "SUPER_ADMIN" ? (
                                        <span className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold">Super Admin</span>
                                     ) : u.role === "PENTADBIR" ? (
                                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">Pentadbir</span>
                                     ) : u.role === "TAHFIZ" ? (
                                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">Guru Tahfiz</span>
                                     ) : u.role === "AKADEMIK" ? (
                                        <span className="bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1 rounded-full text-xs font-bold">Guru Akademik</span>
                                     ) : (
                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold">{u.role}</span>
                                     )}
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
                                        <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Padam Pengguna"><Trash2 className="w-4 h-4" /></button>
                                     )}
                                  </td>
                               </tr>
                            ))
                         ) : (
                            <tr>
                               <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                                        <Search className="w-6 h-6" />
                                     </div>
                                     <p className="font-bold text-slate-700 mb-1">Tiada pengguna dijumpai</p>
                                     <p className="text-xs text-slate-500 mb-4">
                                        Tiada akaun pengguna yang sepadan dengan nama atau carian "{userSearchQuery}".
                                     </p>
                                     <button 
                                        type="button" 
                                        onClick={() => { setUserSearchQuery(''); setUserRoleFilter("SEMUA"); }} 
                                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                                     >
                                        Kosongkan Carian
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         )}
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

       {activeTab === 'ANALISIS' && (
          <div className="space-y-6">
             <AnalisisKemasukan candidates={candidates} />
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
                    
                    {/* Butang PDF Borang Permohonan Calon Layak Temuduga */}
                    <button 
                      type="button"
                      onClick={() => setPrintPukalLayak(true)}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap ring-2 ring-rose-300"
                      title="Buka pratonton dan simpan semua borang permohonan calon layak temuduga dalam format PDF"
                    >
                      <FileText className="w-4 h-4" />
                      PDF Borang Calon Layak ({layakCandidates.length})
                    </button>

                    {/* Butang Muat Turun Calon Layak Temuduga (Excel/CSV) */}
                    <button 
                      type="button"
                      onClick={handleDownloadLayak}
                      className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap ring-2 ring-purple-300 cursor-pointer"
                      title="Muat turun senarai data calon berstatus Layak Temuduga ke Excel/CSV"
                    >
                      <Download className="w-4 h-4" />
                      Excel Calon Layak ({layakCandidates.length})
                    </button>

                    {/* Butang Muat Turun Calon Dapat Tawaran (Excel/CSV) */}
                    <button 
                      type="button"
                      onClick={() => exportCandidatesCategoryCSV(candidates.filter(c => c.statusTawaran === 'BERJAYA'), 'Senarai_Calon_Dapat_Tawaran', tahfizMax, akademikMax)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                      title="Muat turun senarai data calon yang Dapat Tawaran ke Excel/CSV"
                    >
                      <Download className="w-4 h-4" />
                      Dapat Tawaran ({candidates.filter(c => c.statusTawaran === 'BERJAYA').length})
                    </button>

                    {/* Butang Muat Turun Calon Terima Tawaran (Excel/CSV) */}
                    <button 
                      type="button"
                      onClick={() => exportCandidatesCategoryCSV(candidates.filter(c => c.maklumBalasTawaran === 'TERIMA'), 'Senarai_Calon_Terima_Tawaran', tahfizMax, akademikMax)}
                      className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                      title="Muat turun senarai data calon yang Terima Tawaran ke Excel/CSV"
                    >
                      <Download className="w-4 h-4" />
                      Terima Tawaran ({candidates.filter(c => c.maklumBalasTawaran === 'TERIMA').length})
                    </button>

                    {/* Butang Muat Turun Semua */}
                    <button 
                      type="button"
                      onClick={handleDownloadSemua}
                      className="flex items-center gap-1.5 bg-slate-600 hover:bg-slate-700 text-white px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap cursor-pointer"
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
                                        <div 
                                          onClick={() => setDetailCandidate(c)}
                                          className="w-10 h-13 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:scale-105 active:scale-95 transition-all group relative"
                                          title="Klik gambar untuk lihat maklumat calon"
                                        >
                                          {c.gambarUrl ? (
                                            <img src={c.gambarUrl} alt={c.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
                                          ) : (
                                            <Camera className="w-4 h-4 text-slate-400 stroke-1" />
                                          )}
                                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Eye className="w-4 h-4 text-white drop-shadow" />
                                          </div>
                                        </div>
                                        <div>
                                           <button 
                                             type="button"
                                             onClick={() => setDetailCandidate(c)}
                                             className="font-bold text-slate-800 text-sm hover:text-emerald-700 hover:underline transition text-left block"
                                             title={`Klik untuk lihat maklumat ${c.name}`}
                                           >
                                             {c.name}
                                           </button>
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
      type="button"
      onClick={() => setDetailCandidate(c)}
      className="text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition"
      title="Lihat Maklumat Calon"
    >
      <Eye className="w-5 h-5" />
    </button>

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
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 p-6 sm:p-8 md:p-10 animate-in fade-in">
             <PentadbirView />
          </div>
       )}

       {detailCandidate && (
         <CandidateDetailModal 
            candidate={detailCandidate} 
            onClose={() => setDetailCandidate(null)} 
            onEdit={(cand) => {
              setDetailCandidate(null);
              setEditCandidate(cand);
            }}
            onPrint={(cand) => {
              setDetailCandidate(null);
              setPrintCandidate(cand);
            }}
         />
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

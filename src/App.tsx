import { useState, useEffect, useRef } from 'react';
import { AppProvider, useAppContext } from './store';
import { Home, FileText, CheckCircle, GraduationCap, Settings, BookOpen, Menu, X, LogOut } from 'lucide-react';

import Utama from './components/dashboard/Utama';
import Panduan from './components/dashboard/Panduan';
import Borang from './components/dashboard/Borang';
import SemakTemuduga from './components/dashboard/SemakTemuduga';
import SemakTawaran from './components/dashboard/SemakTawaran';
import AdminPanel from './components/dashboard/AdminPanel';
import { EQabulEmblem } from './components/brand/EQabulBrand';

type View = 'utama' | 'panduan' | 'borang' | 'temuduga' | 'tawaran' | 'admin';

function AppContent() {
  const { settings, isInitialized, currentUser, logout } = useAppContext();
  const sesiKemasukan = settings?.sesiKemasukan || 'Sesi Kemasukan 2026/2027';
  const [activeView, setActiveView] = useState<View>('utama');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    const timeout = setTimeout(updateHeaderHeight, 60);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timeout);
    };
  }, [mobileMenuOpen, currentUser, activeView]);

  const navItems = [
    { id: 'utama', label: 'Utama', icon: Home },
    { id: 'borang', label: 'Permohonan', icon: FileText },
    { id: 'temuduga', label: 'Semak Temuduga', icon: CheckCircle },
    { id: 'tawaran', label: 'Semak Tawaran', icon: GraduationCap },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7ee]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-800 font-bold">Memuatkan Sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7ee] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Header Utama Rasmi - Penuh Selebar Skrin (Edge-to-Edge) & Melekat Kekal (Sticky Frozen) */}
      <header 
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#084e36] via-[#0d6e4d] to-[#084e36] text-white shadow-xl border-b border-emerald-500/40 backdrop-blur-md print:hidden"
      >
        {/* Bahagian Atas Header: Susunan Harmoni 2 Logo, Tipografi Rasmi Lengkap & Kad Sesi (Auto-Resize Telefon Pintar) */}
        <div className="max-w-[1400px] mx-auto px-2.5 sm:px-5 lg:px-6 py-2 sm:py-3.5 flex justify-between items-center gap-2 sm:gap-4 lg:gap-6">
              
              {/* Sisi Kiri: Gandingan Harmoni Dua Logo & Blok Tipografi Padu */}
              <div className="flex items-center gap-2 sm:gap-3.5 md:gap-5 min-w-0 flex-1">
                
                {/* Kluster Dua Logo Bersebelahan (Logo Sekolah & Logo e-QABUL) - Skala Auto Fleksibel */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 select-none">
                  {/* 1. Logo Rasmi SMA Kota Gelanggi 3 */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full blur-xs opacity-50 group-hover:opacity-85 transition"></div>
                    <div className="relative bg-white p-0.5 sm:p-1 rounded-full w-9 h-9 min-[400px]:w-11 min-[400px]:h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 flex items-center justify-center shrink-0 shadow-md ring-1.5 sm:ring-2 ring-amber-400">
                      <img 
                        src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" 
                        alt="Logo Rasmi SMA Kota Gelanggi 3" 
                        className="h-7 min-[400px]:h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-xs" 
                      />
                    </div>
                  </div>

                  {/* 2. Logo e-QABUL (Image 2) */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/80 to-emerald-400/80 rounded-full blur-xs opacity-50 group-hover:opacity-85 transition"></div>
                    <div className="relative bg-white p-0.5 sm:p-1 rounded-full shadow-md ring-1.5 sm:ring-2 ring-amber-400 flex items-center justify-center w-9 h-9 min-[400px]:w-11 min-[400px]:h-11 sm:w-13 sm:h-13 md:w-15 md:h-15 shrink-0">
                      {settings.logoEqabulUrl ? (
                        <img 
                          src={settings.logoEqabulUrl} 
                          alt="Logo e-QABUL Asal" 
                          className="w-7 h-7 min-[400px]:w-8 min-[400px]:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                        />
                      ) : (
                        <EQabulEmblem className="w-7 h-7 min-[400px]:w-8 min-[400px]:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 drop-shadow-xs" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Garisan Pemisah Halus Emas */}
                <div className="hidden sm:block h-10 md:h-14 w-[1px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent shrink-0"></div>

                {/* BLOK TIPOGRAFI PADU & BERMARTABAT (Auto-Resize Sempurna Untuk Telefon Mudah Alih) */}
                <div className="flex flex-col justify-center min-w-0 select-none overflow-hidden">
                  
                  {/* Baris 1: Nama Penuh Institusi & Lencana Rasmi */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0">
                    <span className="font-extrabold text-[10px] min-[380px]:text-[11px] sm:text-xs md:text-sm lg:text-[15px] uppercase tracking-wide sm:tracking-wider text-emerald-100 drop-shadow-sm leading-tight truncate sm:whitespace-normal">
                      Sekolah Menengah Agama Kota Gelanggi 3
                    </span>
                    <span className="hidden sm:inline-block text-amber-400 font-bold text-xs">•</span>
                    <span className="hidden min-[480px]:inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-bold text-amber-300 shrink-0">
                      <span className="hidden md:inline">Jerantut, Pahang</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-400/40 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-xs">
                        KBT Tahfiz
                      </span>
                    </span>
                  </div>

                  {/* Baris 2: Tajuk Utama Sistem (e-QABUL : SISTEM KEMASUKAN TINGKATAN 1) */}
                  <div className="flex items-baseline gap-1.5 sm:gap-2.5 md:gap-3 flex-wrap mt-0.5 min-w-0">
                    <div className="flex items-baseline font-black tracking-tight text-xl min-[360px]:text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md leading-none shrink-0">
                      <span className="text-emerald-300 font-black italic mr-0.5">e-</span>
                      <span className="text-white">Q</span>
                      <span className="text-white">ABUL</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 min-w-0 overflow-hidden">
                      <span className="text-amber-400 font-bold text-xs sm:text-base md:text-lg hidden min-[360px]:inline">|</span>
                      <span className="font-black text-[9px] min-[360px]:text-[10.5px] sm:text-xs md:text-sm lg:text-base uppercase tracking-tight sm:tracking-wide text-amber-300 drop-shadow-sm leading-tight truncate sm:whitespace-normal">
                        Sistem Kemasukan Murid Tingkatan 1
                      </span>
                    </div>
                  </div>

                  {/* Baris 3: Penerangan Fungsi & Cogan Kata */}
                  <div className="flex items-center gap-1.5 text-[8.5px] min-[360px]:text-[9.5px] sm:text-[11px] md:text-xs text-emerald-100/90 mt-0.5 leading-tight overflow-hidden">
                    <span className="font-semibold italic text-amber-200 drop-shadow-xs truncate">
                      "Satu Gerbang, Segala Urusan Kemasukan"
                    </span>
                    <span className="hidden md:inline text-amber-400 font-bold">•</span>
                    <span className="font-medium text-emerald-200/90 hidden md:inline">
                      Portal Rasmi Pengambilan Murid & Semakan Tawaran
                    </span>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: Kad Ringkasan Sesi Kemasukan & Status Admin / Log Keluar */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {currentUser ? (
                  <div className="flex items-center gap-1.5 sm:gap-3 bg-emerald-950/85 border border-amber-400/50 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-md">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-300 text-emerald-950 font-black flex items-center justify-center text-[11px] sm:text-sm shadow-sm shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-black text-amber-300 leading-tight truncate max-w-[130px]" title={currentUser.name}>
                        {currentUser.name}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-emerald-300 tracking-wider">
                        {currentUser.role.replace('_', ' ')}
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { logout(); setActiveView('utama'); }}
                      className="flex items-center gap-1 sm:gap-1.5 bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-400/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition shadow-xs hover:scale-[1.02] active:scale-95"
                      title="Log Keluar dari Sistem"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Log Keluar</span>
                    </button>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center">
                    <div className="bg-emerald-950/75 border border-amber-400/40 px-3.5 sm:px-4 py-2 rounded-2xl text-right shadow-lg backdrop-blur-md flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-emerald-200/90 tracking-wider">
                          Sesi Kemasukan
                        </div>
                        <div className="text-xs sm:text-sm font-black text-amber-300 tracking-wide leading-tight">
                          {settings.sesiKemasukan || '2025 / 2026'}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-[9px] text-emerald-300 font-semibold mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Portal Aktif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  className="md:hidden p-1.5 sm:p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0 active:scale-95"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>

            {/* Bahagian Bawah Header: Navigasi Hijau Zamrud Berwibawa & Butang Emas (FREEZE SEKALI) */}
            <nav className="bg-[#053d2b] border-t border-emerald-500/40 shadow-inner">
              <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-1.5 hidden md:flex items-center justify-between gap-1 overflow-x-auto">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as View)}
                        className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                          isActive 
                            ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-950 shadow-md font-black scale-[1.02]' 
                            : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-300'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Status Portal Aktif di Sebelah Kanan */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-[11px] text-emerald-200 font-semibold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Portal Aktif</span>
                </div>
              </div>
            </nav>

            {/* Mobile Nav Dropdown (Hijau Zamrud Dalaman) */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-[#053d2b] border-t border-emerald-600/60 p-2.5 space-y-1 animate-in slide-in-from-top-2">
                {currentUser && (
                  <div className="bg-emerald-950/90 border border-amber-400/40 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-xs shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs font-bold text-amber-200 leading-tight truncate">{currentUser.name}</div>
                        <div className="text-[9px] text-emerald-300 uppercase">{currentUser.role.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setActiveView('utama'); setMobileMenuOpen(false); }}
                      className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      <LogOut className="w-3 h-3" /> Log Keluar
                    </button>
                  </div>
                )}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveView(item.id as View); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-amber-400 text-emerald-950 font-black shadow-sm'
                          : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-300'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </header>

      {/* Main Content - Saiz Selaras Tepat Dengan Header & Footer (max-w-[1400px] & px-3 sm:px-5 lg:px-6) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 print:p-0 print:m-0 print:max-w-none">
        {activeView === 'utama' && <Utama onNavigate={setActiveView} />}
        {activeView === 'panduan' && <Panduan onNavigate={setActiveView} />}
        {activeView === 'borang' && <Borang onNavigate={setActiveView} />}
        {activeView === 'temuduga' && <SemakTemuduga />}
        {activeView === 'tawaran' && <SemakTawaran />}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Footer Bersaiz Selaras & Padu Sepadan Tepat Dengan Header (Auto-Resize Telefon Mudah Alih) */}
      <footer className="mt-auto w-full bg-gradient-to-r from-[#042f21] via-[#074732] to-[#042f21] border-t-2 border-amber-400/90 shadow-2xl print:hidden text-white">
        <div className="max-w-[1400px] mx-auto px-2.5 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 text-center space-y-1 sm:space-y-1.5">
          {/* Baris 1: Logo & e-Qabul + Cogan Kata + Inovasi Sekolah */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap text-[11px] sm:text-xs md:text-sm">
            <div className="inline-flex items-center gap-1.5 shrink-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/95 p-0.5 shadow-xs flex items-center justify-center ring-1 ring-amber-400/80 shrink-0">
                {settings.logoEqabulUrl ? (
                  <img src={settings.logoEqabulUrl} alt="e-Qabul" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                ) : (
                  <EQabulEmblem className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="font-black text-xs sm:text-base tracking-tight select-none">
                <span className="text-emerald-300 italic">e-</span>
                <span className="text-amber-300">Qabul</span>
              </span>
            </div>

            <span className="text-amber-400/60 font-bold">•</span>
            <span className="text-white font-bold text-[10.5px] sm:text-xs md:text-sm">
              Satu Gerbang, Segala Urusan Kemasukan
            </span>
            <span className="hidden md:inline text-emerald-500/80 font-bold">|</span>
            <span className="hidden sm:inline text-emerald-200/90 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              INOVASI SMA KOTA GELANGGI 3 (Unit ICT & HEM)
            </span>
          </div>

          {/* Baris 2: Peringatan Tanggungjawab Pengguna (Dikekalkan) */}
          <p className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] text-emerald-200/80 italic leading-snug max-w-4xl mx-auto px-2">
            Pengguna Web bertanggungjawab untuk merahsiakan pengenalan identiti. Pihak sekolah tidak bertanggungjawab atas kecuaian pencerobohan identiti.
          </p>

          {/* Baris 3: Hak Cipta Ringkas */}
          <p className="text-[8.5px] sm:text-[10px] text-emerald-400/80 pt-0.5">
            &copy; {new Date().getFullYear()} e-Qabul SMAG3 &bull; Hak Cipta Terpelihara
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

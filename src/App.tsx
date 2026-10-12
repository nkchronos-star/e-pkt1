import { useState } from 'react';
import { AppProvider, useAppContext } from './store';
import { Home, FileText, CheckCircle, GraduationCap, Settings, BookOpen, Menu, X } from 'lucide-react';

import Utama from './components/dashboard/Utama';
import Panduan from './components/dashboard/Panduan';
import Borang from './components/dashboard/Borang';
import SemakTemuduga from './components/dashboard/SemakTemuduga';
import SemakTawaran from './components/dashboard/SemakTawaran';
import AdminPanel from './components/dashboard/AdminPanel';
import { EQabulEmblem } from './components/brand/EQabulBrand';

type View = 'utama' | 'panduan' | 'borang' | 'temuduga' | 'tawaran' | 'admin';

function AppContent() {
  const { settings, isInitialized } = useAppContext();
  const sesiKemasukan = settings?.sesiKemasukan || 'Sesi Kemasukan 2026/2027';
  const [activeView, setActiveView] = useState<View>('utama');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'utama', label: 'Utama', icon: Home },
    { id: 'panduan', label: 'Panduan', icon: BookOpen },
    { id: 'borang', label: 'Borang Permohonan', icon: FileText },
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
      
      {/* Sticky Frozen Floating Header Container (Kiri Kanan Ada Ruang & Freeze Bila Scroll) */}
      <div className="sticky top-0 z-50 w-full print:hidden">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 pt-2.5 sm:pt-3 pb-1">
          {/* Header Card Hijau Zamrud Diraja Eksklusif (Kemas, Berwibawa & Tidak Terlalu Cerah) */}
          <header className="bg-gradient-to-r from-[#084e36] via-[#0d6e4d] to-[#084e36] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-500/40 backdrop-blur-md overflow-hidden ring-1 ring-amber-400/20">
            {/* Bahagian Atas Header: Susunan Harmoni 2 Logo, Tipografi Rasmi Lengkap & Kad Sesi */}
            <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center gap-3 lg:gap-6">
              
              {/* Sisi Kiri: Gandingan Harmoni Dua Logo & Blok Tipografi Padu */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0">
                
                {/* Kluster Dua Logo Bersebelahan (Logo Sekolah & Logo e-QABUL) */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
                  {/* 1. Logo Rasmi SMA Kota Gelanggi 3 */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full blur-sm opacity-50 group-hover:opacity-85 transition"></div>
                    <div className="relative bg-white p-1 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-amber-400">
                      <img 
                        src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" 
                        alt="Logo Rasmi SMA Kota Gelanggi 3" 
                        className="h-10 sm:h-11 md:h-13 w-auto object-contain drop-shadow-sm" 
                      />
                    </div>
                  </div>

                  {/* 2. Logo e-QABUL (Image 2) */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/80 to-emerald-400/80 rounded-full blur-sm opacity-50 group-hover:opacity-85 transition"></div>
                    <div className="relative bg-white p-1 rounded-full shadow-lg ring-2 ring-amber-400 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 shrink-0">
                      {settings.logoEqabulUrl ? (
                        <img 
                          src={settings.logoEqabulUrl} 
                          alt="Logo e-QABUL Asal" 
                          className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 object-contain"
                        />
                      ) : (
                        <EQabulEmblem className="w-10 h-10 sm:w-11 sm:h-11 md:w-13 md:h-13 drop-shadow-sm" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Garisan Pemisah Halus Emas */}
                <div className="hidden sm:block h-12 md:h-14 w-[1px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent shrink-0"></div>

                {/* BLOK TIPOGRAFI PADU & BERMARTABAT (Lengkap, Tersusun & Tidak Kosong) */}
                <div className="flex flex-col justify-center min-w-0 select-none">
                  
                  {/* Baris 1: Nama Penuh Institusi & Lencana Rasmi */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm md:text-[15px] uppercase tracking-wider text-emerald-100 drop-shadow-sm leading-tight">
                      Sekolah Menengah Agama Kota Gelanggi 3
                    </span>
                    <span className="hidden sm:inline-block text-amber-400 font-bold text-xs">•</span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-300">
                      <span className="hidden md:inline">Jerantut, Pahang</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-400/40 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-xs">
                        KBT Tahfiz
                      </span>
                    </span>
                  </div>

                  {/* Baris 2: Tajuk Utama Sistem (e-QABUL : SISTEM KEMASUKAN TINGKATAN 1) */}
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap mt-0.5">
                    <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md leading-none">
                      <span className="text-emerald-300 font-black italic mr-0.5">e-</span>
                      <span className="text-white">Q</span>
                      <span className="text-white">ABUL</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-amber-400 font-bold text-base sm:text-lg hidden sm:inline">|</span>
                      <span className="font-black text-xs sm:text-sm md:text-base uppercase tracking-wide text-amber-300 drop-shadow-sm">
                        Sistem Kemasukan Murid Tingkatan 1
                      </span>
                    </div>
                  </div>

                  {/* Baris 3: Penerangan Fungsi & Cogan Kata */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-100/90 mt-0.5 flex-wrap">
                    <span className="font-medium text-emerald-200/90 hidden md:inline">
                      Portal Rasmi Pengambilan Murid & Semakan Tawaran
                    </span>
                    <span className="hidden md:inline text-amber-400 font-bold">•</span>
                    <span className="font-semibold italic text-amber-200 drop-shadow-xs">
                      "Satu Gerbang, Segala Urusan Kemasukan"
                    </span>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: Kad Ringkasan Sesi Kemasukan & Status Portal */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

                <button 
                  className="md:hidden p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6 text-amber-300" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Bahagian Bawah Header: Navigasi Hijau Zamrud Berwibawa & Butang Emas (FREEZE SEKALI) */}
            <nav className="bg-[#053d2b] border-t border-emerald-500/40 px-3 sm:px-5 py-1.5 hidden md:flex items-center justify-between gap-1 overflow-x-auto shadow-inner">
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
            </nav>

            {/* Mobile Nav Dropdown (Hijau Zamrud Dalaman) */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-[#053d2b] border-t border-emerald-600/60 p-2.5 space-y-1 animate-in slide-in-from-top-2">
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
        </div>
      </div>

      {/* Main Content - Saiz Selaras Tepat Dengan Header & Footer (max-w-[1400px] & px-3 sm:px-5 lg:px-6) */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 print:p-0 print:m-0 print:max-w-none">
        {activeView === 'utama' && <Utama onNavigate={setActiveView} />}
        {activeView === 'panduan' && <Panduan />}
        {activeView === 'borang' && <Borang />}
        {activeView === 'temuduga' && <SemakTemuduga />}
        {activeView === 'tawaran' && <SemakTawaran />}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Footer Nipis & Elegan Mengikut Permintaan Pengguna */}
      <footer className="mt-auto py-3 pb-4 px-3 sm:px-5 lg:px-6 print:hidden">
        <div className="max-w-[1400px] mx-auto bg-[#073b2a] text-white rounded-xl sm:rounded-2xl shadow-md border border-emerald-600/30 py-3 sm:py-3.5 px-4 sm:px-6 text-center space-y-1.5">
          {/* Baris 1: Logo & e-Qabul + Cogan Kata + Inovasi Sekolah */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            <div className="inline-flex items-center gap-1.5 shrink-0">
              <div className="w-6 h-6 rounded-full bg-white/95 p-0.5 shadow-sm flex items-center justify-center ring-1 ring-amber-400/80 shrink-0">
                {settings.logoEqabulUrl ? (
                  <img src={settings.logoEqabulUrl} alt="e-Qabul" className="w-5 h-5 object-contain" />
                ) : (
                  <EQabulEmblem className="w-5 h-5" />
                )}
              </div>
              <span className="font-black text-sm sm:text-base tracking-tight select-none">
                <span className="text-emerald-300 italic">e-</span>
                <span className="text-amber-300">Qabul</span>
              </span>
            </div>

            <span className="text-amber-400/60 font-bold">•</span>
            <span className="text-white font-bold">
              Satu Gerbang, Segala Urusan Kemasukan
            </span>
            <span className="hidden md:inline text-emerald-500/80 font-bold">|</span>
            <span className="hidden sm:inline text-emerald-200/90 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              INOVASI SMA KOTA GELANGGI 3 (Unit ICT & HEM)
            </span>
          </div>

          {/* Baris 2: Peringatan Tanggungjawab Pengguna (Dikekalkan) */}
          <p className="text-[10px] sm:text-[11px] text-emerald-200/80 italic leading-snug max-w-4xl mx-auto">
            Pengguna Web bertanggungjawab untuk merahsiakan pengenalan identiti. Pihak sekolah tidak bertanggungjawab atas kecuaian pencerobohan identiti.
          </p>

          {/* Baris 3: Hak Cipta Ringkas */}
          <p className="text-[9px] sm:text-[10px] text-emerald-400/80 pt-0.5">
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

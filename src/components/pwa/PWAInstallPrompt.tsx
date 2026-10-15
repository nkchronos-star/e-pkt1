import React, { useState } from 'react';
import { Smartphone, Download, Share2, PlusSquare, X, CheckCircle, Sparkles, ChevronRight, Laptop } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallPromptProps {
  variant?: 'button' | 'banner' | 'card' | 'compact';
  className?: string;
}

export default function PWAInstallPrompt({ variant = 'button', className = '' }: PWAInstallPromptProps) {
  const { isInstalled, isInstallable, isIOS, promptInstall } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode (already installed), no need to nag
  if (isInstalled) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-900/60 text-emerald-200 border border-emerald-500/40">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Aplikasi Terpasang</span>
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await promptInstall();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
        return;
      }
    }
    // If iOS or prompt not natively triggerable directly, open instructional modal
    setShowModal(true);
  };

  return (
    <>
      {/* 1. VARIANT: BUTTON (Nav / Header / Toolbar) */}
      {variant === 'button' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-md active:scale-95 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-emerald-950 border border-amber-300 hover:brightness-105 hover:shadow-amber-500/20 ${className}`}
          title="Pasang aplikasi e-Qabul pada telefon anda"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-950 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="whitespace-nowrap font-black">Pasang App</span>
        </button>
      )}

      {/* 2. VARIANT: COMPACT (Small badge style) */}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 transition active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Pasang di Telefon</span>
        </button>
      )}

      {/* 3. VARIANT: BANNER / SHOWCASE (Mesra Calon, Ibu Bapa & Penilai di Laptop, Tablet, Telefon) */}
      {variant === 'banner' && (
        <div className={`bg-gradient-to-r from-[#043d2a] via-[#084e36] to-[#0d6e4d] text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-400/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${className}`}>
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md ring-2 ring-amber-300/50 mt-0.5">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-amber-300 tracking-wide">
                  Aplikasi e-Qabul Mesra Telefon, Tablet & Laptop
                </span>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Calon & Penilai
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed mt-1">
                Sistem ini dioptimumkan sepenuhnya untuk semua peranti. Calon & ibu bapa boleh semak keputusan & borang dengan pantas, manakala panel penemuduga boleh menilai secara lancar pada telefon atau tablet.
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-emerald-200/90 flex-wrap">
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-amber-300" /> Boleh dipasang terus di telefon</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-amber-300" /> Tiada muat turun Play Store / App Store</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-amber-300" /> Akses pantas & responsif</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-emerald-950 shadow-lg hover:brightness-105 active:scale-95 transition whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Pasang di Telefon / Laptop</span>
          </button>
        </div>
      )}

      {/* 4. VARIANT: CARD (Showcase Komprehensif di Halaman Utama) */}
      {variant === 'card' && (
        <div className={`bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 rounded-2xl p-5 sm:p-6 border-2 border-emerald-200/90 shadow-sm relative overflow-hidden ${className}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  📱 Mesra Telefon & Tablet
                </span>
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  💻 Mesra Komputer & Laptop
                </span>
                <span className="bg-blue-100 text-blue-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  ✨ Untuk Calon & Penilai
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Sistem e-Qabul SMAG3 Boleh Dipasang Pada Telefon Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  Buka aplikasi seperti aplikasi telefon sebenar tanpa perlu menaip alamat laman web setiap kali. Mudah untuk calon dan ibu bapa menyemak panggilan temuduga serta keputusan tawaran, dan sangat memudahkan panel penemuduga memasukkan markah calon secara pantas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 mb-1">
                    <Smartphone className="w-4 h-4" /> Telefon Pintar
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Semakan mudah alih, pantas dan butang sentuh bersaiz ergonomik.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-teal-700 font-bold text-xs flex items-center gap-1.5 mb-1">
                    <Laptop className="w-4 h-4" /> Tablet & iPad
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Paparan luas dan selesa untuk temuduga dan semakan dokumen calon.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-blue-700 font-bold text-xs flex items-center gap-1.5 mb-1">
                    <Laptop className="w-4 h-4" /> Laptop & PC
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Sesuai untuk cetakan rasmi surat tawaran dan pengurusan pangkalan data.
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 items-stretch lg:items-end justify-center">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-lg hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Aplikasi Sekarang</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center lg:text-right font-medium">
                Menyokong Android, iPhone, iPad, Windows & Mac
              </p>
            </div>
          </div>
        </div>
      )}

      {/* POPUP / MODAL: PANDUAN PEMASANGAN PWA (ANDROID & IOS SAFARI) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-emerald-600/30 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#043d2a] to-[#084e36] text-white p-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    Pasang e-Qabul Pada Telefon
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold">
                    Aplikasi Web Progresif (PWA) Rasmi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Native Prompt Trigger Button if Available */}
              {isInstallable && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-xs font-bold text-emerald-900 mb-3">
                    Pelayar anda sedia untuk memasang aplikasi dengan satu klik:
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await promptInstall();
                      if (res) {
                        setShowModal(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Pasang Aplikasi Sekarang
                  </button>
                </div>
              )}

              {/* iOS Safari Instructions */}
              {isIOS ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </span>
                    <span>Cara Pasang di iPhone / iPad (Safari):</span>
                  </div>
                  
                  <ol className="text-xs text-slate-700 space-y-2.5 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>
                        Ketik ikon <strong>Kongsi (Share)</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> di bahagian bawah skrin pelayar Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>
                        Tatal menu ke bawah dan ketik <strong>'Tambah ke Skrin Utama' (Add to Home Screen)</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" />.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <span>
                        Ketik <strong>'Tambah' (Add)</strong> di sudut atas kanan skrin. Ikon e-Qabul akan muncul pada skrin telefon anda!
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                /* Android / Chrome / General Browser Instructions */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <span>Cara Pasang di Telefon Android (Chrome):</span>
                  </div>

                  <ol className="text-xs text-slate-700 space-y-2.5 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>
                        Ketik menu titik tiga (⋮) di sudut atas kanan pelayar Google Chrome.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>
                        Pilih <strong>'Pasang Aplikasi' (Install app)</strong> atau <strong>'Tambah ke Skrin Utama' (Add to Home Screen)</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 font-bold text-slate-800 flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <span>
                        Ketik <strong>'Pasang' (Install)</strong>. Aplikasi kini boleh dibuka terus dari skrin telefon anda seperti aplikasi biasa!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Kelebihan untuk Calon & Penilai */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-950 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Kelebihan Memasang Aplikasi:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Calon & Ibu Bapa:</strong> Semak keputusan temuduga dan muat turun tawaran terus tanpa perlu menaip URL setiap kali.</li>
                  <li><strong>Panel Penilai:</strong> Paparan borang markah sentuh yang responsif serta draf ulasan automatik tersimpan tanpa hilang.</li>
                  <li><strong>Paparan Penuh:</strong> Buka dengan lancar seperti aplikasi telefon tanpa bar carian pelayar.</li>
                  <li><strong>Mesra Semua Peranti:</strong> Berfungsi cemerlang pada telefon, tablet (iPad), serta laptop/komputer.</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-900 text-white transition"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

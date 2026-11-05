import { useState } from 'react';
import { Info, CheckCircle, FileText, Calendar, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  useAppContext,
  DEFAULT_PANDUAN_SYARAT_ITEMS,
  DEFAULT_PANDUAN_LANGKAH_ITEMS,
  DEFAULT_PANDUAN_DOKUMEN_ITEMS,
} from '../../store';

interface PanduanProps {
  onNavigate?: (view: any) => void;
  isGateMode?: boolean;
  onProceed?: () => void;
}

export default function Panduan({ onNavigate, isGateMode = false, onProceed }: PanduanProps) {
  const { infographics, settings } = useAppContext();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [errorNotice, setErrorNotice] = useState(false);

  const syaratItems =
    Array.isArray(settings.panduanSyaratItems) && settings.panduanSyaratItems.length > 0
      ? settings.panduanSyaratItems
      : DEFAULT_PANDUAN_SYARAT_ITEMS;

  const langkahItems =
    Array.isArray(settings.panduanLangkahItems) && settings.panduanLangkahItems.length > 0
      ? settings.panduanLangkahItems
      : DEFAULT_PANDUAN_LANGKAH_ITEMS;

  const dokumenItems =
    Array.isArray(settings.panduanDokumenItems) && settings.panduanDokumenItems.length > 0
      ? settings.panduanDokumenItems
      : DEFAULT_PANDUAN_DOKUMEN_ITEMS;

  const handleProceedClick = () => {
    if (!hasAgreed) {
      setErrorNotice(true);
      return;
    }
    setErrorNotice(false);
    try {
      sessionStorage.setItem('borang_panduan_read', 'true');
    } catch {}

    if (onProceed) {
      onProceed();
    } else if (onNavigate) {
      onNavigate('borang');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in duration-500 py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Banner Khas: Langkah Wajib Sebelum Isi Borang Permohonan */}
      {isGateMode && (
        <div className="mb-8 bg-gradient-to-r from-emerald-900 via-[#084e36] to-[#043d2a] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border-2 border-amber-400/60 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-lg font-black text-xl">
                1
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Langkah 1 Wajib
                  </span>
                  <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                    Sebelum Mengisi Borang
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white mt-1 tracking-tight">
                  Sila Baca &amp; Fahami Panduan Permohonan Ini Dahulu
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-1 max-w-3xl">
                  Calon dan ibu bapa diwajibkan membaca semua syarat kelayakan, tarikh penting, dan dokumen yang diperlukan di bawah. Selesai membaca keseluruhan panduan, sila klik butang <strong>&quot;Saya Faham &amp; Teruskan&quot;</strong> di bahagian bawah untuk membuka paparan borang permohonan.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-white/10 border border-white/20 shrink-0 text-center">
              <span className="text-[10px] text-emerald-200 uppercase font-semibold">Status Calon</span>
              <span className="text-xs font-black text-amber-300">Membaca Panduan</span>
            </div>
          </div>
        </div>
      )}

      {/* Tajuk Utama */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4 shadow-sm">
          <Info className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Panduan Permohonan Kemasukan Tingkatan 1
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Sila baca panduan ini dengan teliti sebelum memulakan permohonan. Pastikan semua maklumat yang diisi adalah tepat, benar dan memenuhi syarat kelayakan.
        </p>
      </div>

      {/* Kad Proses Kemasukan */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden mb-10 sm:mb-12">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-indigo-50/40 border-b border-emerald-100 p-6 sm:p-8 flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Proses &amp; Syarat Kemasukan</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Langkah lengkap dari pendaftaran hingga pendaftaran rasmi</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-12">
          {settings.panduanContent && settings.panduanContent.trim() && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
              {settings.panduanContent}
            </div>
          )}

          <div className="relative border-l-[3px] border-emerald-200 ml-3 sm:ml-6 md:ml-8 space-y-10 sm:space-y-12">
            {langkahItems.map((langkah, idx) => (
              <div key={langkah.id} className="relative pl-7 sm:pl-10 md:pl-12 group">
                <div className="absolute -left-[11px] sm:-left-[12px] top-1 w-5 h-5 rounded-full bg-emerald-600 ring-4 sm:ring-[6px] ring-emerald-100 flex items-center justify-center text-white text-[10px] font-black">
                  {idx + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  {langkah.title}
                </h3>
                <p className="text-slate-600 mb-5 leading-relaxed text-xs sm:text-sm">
                  {langkah.description}
                </p>

                {idx === 0 && (
                  <>
                    {/* Syarat-Syarat Permohonan (Kelayakan) Visual Box */}
                    {syaratItems.length > 0 && (
                      <div className="my-6 max-w-3xl">
                        <div className="flex justify-center -mb-3.5 relative z-10">
                          <div className="bg-[#f04e38] text-white text-xs sm:text-sm font-black px-6 sm:px-8 py-2 rounded-2xl shadow-md border-2 border-white tracking-wide flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Syarat-Syarat Permohonan Kemasukan</span>
                          </div>
                        </div>
                        <div className="bg-[#d4e74e] border-2 border-[#b8cb36] rounded-3xl p-5 sm:p-8 pt-7 sm:pt-8 shadow-md">
                          <ul className="space-y-2.5 text-slate-900 text-xs sm:text-sm font-semibold leading-relaxed">
                            {syaratItems.map((sy) => (
                              <li key={sy.id} className="flex items-start gap-2.5">
                                <span className="text-slate-900 font-bold select-none text-base sm:text-lg leading-none mt-0.5">•</span>
                                <span>{sy.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Dokumen Diperlukan */}
                    {dokumenItems.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 mb-4">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 mb-2.5 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" /> Dokumen Diperlukan Semasa Mengisi Borang:
                        </h4>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-medium pl-1">
                          {dokumenItems.map((dok) => (
                            <li key={dok.id} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                              <span>{dok.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Peringatan Wajib Cetak Borang */}
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        <strong>Peringatan Penting:</strong> Sila cetak atau simpan salinan <strong>BORANG PERMOHONAN KEMASUKAN</strong> setelah permohonan selesai dihantar. Borang cetakan ini <strong>wajib dibawa</strong> bersama semasa sesi temuduga bagi calon yang berjaya dipanggil.
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infografik Jika Ada */}
      {infographics && infographics.length > 0 && (
        <div className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-5 flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-600" /> Infografik Panduan Rasmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infographics.map((info) => (
              <div key={info.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img src={info.url} alt={info.title} className="w-full h-auto object-contain bg-slate-50" />
                <div className="p-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">{info.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maklumat Penting */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-100/40 rounded-2xl sm:rounded-[2rem] border border-emerald-200/80 p-6 sm:p-8 text-center shadow-sm mb-10">
        <div className="inline-flex p-3 bg-emerald-200/60 rounded-xl mb-4 text-emerald-800">
          <Info className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950 mb-2">Peringatan Integriti &amp; Bantuan</h3>
        <p className="text-emerald-800 max-w-2xl mx-auto font-medium leading-relaxed text-xs sm:text-sm">
          Sila pastikan semua maklumat yang dimasukkan adalah tepat dan sahih. Sebarang pemalsuan dokumen atau maklumat boleh membatalkan tawaran kemasukan. Sekiranya anda memerlukan bantuan lanjut, sila hubungi pihak pengurusan sekolah SMA Kota Gelanggi 3.
        </p>
      </div>

      {/* BAHAGIAN PENGESAHAN & BUTANG "SAYA FAHAM & TERUSKAN" */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 shadow-xl p-5 sm:p-8 text-center space-y-5 animate-in slide-in-from-bottom-2">
        <div className="max-w-2xl mx-auto">
          <label className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer text-left">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => {
                setHasAgreed(e.target.checked);
                if (e.target.checked) setErrorNotice(false);
              }}
              className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 shrink-0 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed select-none">
              Saya mengaku bahawa saya telah membaca, memahami, dan mengesahkan segala syarat kelayakan, tatacara kemasukan, serta dokumen yang diperlukan di atas dan bersedia untuk mengisi borang permohonan.
            </span>
          </label>

          {errorNotice && (
            <p className="text-xs font-bold text-rose-600 mt-2 flex items-center justify-center gap-1.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Sila tandakan kotak pengesahan di atas terlebih dahulu untuk meneruskan ke borang permohonan.
            </p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleProceedClick}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer ${
              hasAgreed
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:brightness-105 active:scale-95 text-white shadow-emerald-700/30 ring-4 ring-emerald-300/40'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
            }`}
          >
            <CheckCircle className="w-5 h-5 text-amber-300" />
            <span>Saya Faham &amp; Teruskan</span>
            <ArrowRight className="w-5 h-5 text-emerald-100" />
          </button>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Ketik butang ini untuk membuka paparan Permohonan Kemasukan
          </p>
        </div>
      </div>
    </div>
  );
}

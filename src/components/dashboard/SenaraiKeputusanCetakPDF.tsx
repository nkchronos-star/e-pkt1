import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, Download } from 'lucide-react';
import { EQabulEmblem } from '../brand/EQabulBrand';

interface SenaraiKeputusanItem {
  candidate: any;
  gender: 'LELAKI' | 'PEREMPUAN';
  tScore: number | null;
  aScore: number | null;
  hasTahfiz: boolean;
  hasAkademik: boolean;
  hasBoth: boolean;
  hasAny: boolean;
  jumlahScore: number;
  peratus: number;
  globalRank: number | null;
  genderRank: number | null;
}

interface SenaraiKeputusanCetakPDFProps {
  items: SenaraiKeputusanItem[];
  genderFilter: 'SEMUA' | 'LELAKI' | 'PEREMPUAN';
  statusFilter: string;
  settings: any;
  tahfizMax: number;
  akademikMax: number;
  jumlahMax: number;
  onClose: () => void;
}

export default function SenaraiKeputusanCetakPDF({
  items,
  genderFilter,
  statusFilter,
  settings,
  tahfizMax,
  akademikMax,
  jumlahMax,
  onClose,
}: SenaraiKeputusanCetakPDFProps) {
  useEffect(() => {
    // Memberikan masa sekejap untuk DOM dan gambar siap dimuat sebelum membuka dialog cetakan
    const timer = setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn('Pelayar tidak membenarkan cetakan automatik, sila gunakan butang Cetak.', e);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const totalCalon = items.length;
  const countLelaki = items.filter(i => i.gender === 'LELAKI').length;
  const countPerempuan = items.filter(i => i.gender === 'PEREMPUAN').length;
  const evaluatedCount = items.filter(i => i.hasAny).length;
  const avgPercent = evaluatedCount > 0 
    ? (items.filter(i => i.hasAny).reduce((acc, i) => acc + i.peratus, 0) / evaluatedCount).toFixed(1)
    : '0.0';

  const filterLabel = statusFilter === 'SEMUA' ? 'Semua Status'
    : statusFilter === 'LAYAK_TEMUDUGA' ? 'Calon Layak Temuduga'
    : statusFilter === 'BERJAYA' ? 'Calon Berjaya Ditawarkan'
    : statusFilter === 'SIMPANAN' ? 'Calon Simpanan'
    : statusFilter === 'TIDAK_LAYAK' ? 'Calon Tidak Layak'
    : statusFilter === 'BELUM_SELESAI' ? 'Belum Selesai Penilaian'
    : statusFilter;

  const genderLabel = genderFilter === 'LELAKI' ? 'Lelaki (Banin)'
    : genderFilter === 'PEREMPUAN' ? 'Perempuan (Banat)'
    : 'Keseluruhan (Lelaki & Perempuan)';

  const dateStr = new Date().toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto print:static print:bg-white print:overflow-visible print:block printable-area">
      {/* Action Bar (Hanya muncul di skrin, TIDAK dicetak) */}
      <div className="sticky top-0 bg-slate-900 text-white p-3.5 sm:p-4 flex flex-wrap justify-between items-center print:hidden shadow-xl z-20 gap-3 border-b border-slate-700">
        <div>
          <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            Pratonton Cetakan Senarai Keputusan Temuduga & Tawaran
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            💡 Untuk menyimpan fail PDF: Pada tetingkap cetakan pelayar, pilih <strong className="text-emerald-400">&quot;Destination / Destinasi: Save as PDF&quot;</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Simpan / Cetak Senarai ({totalCalon})
          </button>
          <button 
            type="button"
            onClick={onClose} 
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" /> Tutup
          </button>
        </div>
      </div>

      {/* Dokumen Rasmi Bercetak (A4 Landscape) */}
      <div className="w-full py-6 px-4 print:p-0 print:block">
        <div className="max-w-[1200px] mx-auto bg-white p-6 sm:p-10 shadow-lg print:shadow-none print:p-0 print:max-w-none text-slate-900 font-sans">
          
          {/* Header Dokumen Rasmi */}
          <div className="border-b-2 border-slate-800 pb-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0">
                {settings?.logoSekolahUrl ? (
                  <img src={settings.logoSekolahUrl} alt="Logo Sekolah" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                ) : (
                  <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Logo SMA" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                )}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {settings?.namaSekolah || 'SEKOLAH MENENGAH AGAMA KOTA GELANGGI 3'}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wide">
                  SENARAI KEPUTUSAN TEMUDUGA & TAWARAN KEMASUKAN TINGKATAN 1
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Sesi Kemasukan: <strong className="text-slate-800">{settings?.sesiKemasukan || '2025 / 2026'}</strong> &bull; Kategori: <strong className="text-slate-800">{genderLabel}</strong> &bull; Penapis: <strong className="text-slate-800">{filterLabel}</strong>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 select-none hidden sm:block">
              <div className="inline-flex items-center gap-1.5 font-black text-sm tracking-tight text-slate-900">
                <span className="text-emerald-700 italic">e-</span>
                <span>QABUL</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Tarikh Cetakan:</div>
              <div className="text-[11px] font-bold text-slate-700">{dateStr}</div>
            </div>
          </div>

          {/* Kad Statistik Ringkas Atas Jadual */}
          <div className="grid grid-cols-4 gap-2.5 mb-4 text-center text-xs">
            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Jumlah Calon</span>
              <span className="text-base font-black text-slate-900">{totalCalon}</span>
              <span className="text-[10px] text-slate-500 block">({countLelaki} L / {countPerempuan} P)</span>
            </div>
            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Telah Dinilai</span>
              <span className="text-base font-black text-emerald-800">{evaluatedCount}</span>
              <span className="text-[10px] text-slate-500 block">daripada {totalCalon} calon</span>
            </div>
            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Purata Markah %</span>
              <span className="text-base font-black text-blue-800">{avgPercent}%</span>
              <span className="text-[10px] text-slate-500 block">calon dinilai</span>
            </div>
            <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
              <span className="text-slate-500 block text-[10px] font-bold uppercase">Skala Markah</span>
              <span className="text-base font-black text-slate-900">{jumlahMax} Markah</span>
              <span className="text-[10px] text-slate-500 block">(T:{tahfizMax} + A:{akademikMax})</span>
            </div>
          </div>

          {/* Jadual Keputusan Rasmi */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10.5px]">
                  <th className="border border-slate-300 px-2 py-2 text-center w-10">Bil</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Merit</th>
                  <th className="border border-slate-300 px-2.5 py-2 w-28">No. KP</th>
                  <th className="border border-slate-300 px-2.5 py-2">Nama Calon</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-12">Jantina</th>
                  <th className="border border-slate-300 px-2.5 py-2">Sekolah Asal</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Tahfiz<br/>({tahfizMax})</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Akademik<br/>({akademikMax})</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Jumlah<br/>({jumlahMax})</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16">Peratus (%)</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-24">Status Temuduga</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-24">Status Tawaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500 italic">
                      Tiada rekod calon yang sepadan dengan penapis ini.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const c = item.candidate;
                    return (
                      <tr key={c.id || c.ic || idx} className="hover:bg-slate-50/80">
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-medium text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                          {item.globalRank ? (
                            <span className="font-extrabold text-slate-900">#{item.globalRank}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                          {item.genderRank && (
                            <span className="block text-[9.5px] text-slate-500 font-semibold">
                              #{item.genderRank} ({item.gender === 'LELAKI' ? 'L' : 'P'})
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-800">
                          {c.ic}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 font-bold text-slate-900 uppercase">
                          {c.name}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold">
                          {item.gender === 'LELAKI' ? (
                            <span className="text-blue-700 font-bold">L</span>
                          ) : (
                            <span className="text-pink-700 font-bold">P</span>
                          )}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 text-[11px] text-slate-700 truncate max-w-[150px]" title={c.namaSekolahRendah}>
                          {c.namaSekolahRendah || '-'}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold text-slate-800">
                          {item.tScore !== null ? item.tScore : <span className="text-slate-400 italic text-[10px]">Belum</span>}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold text-slate-800">
                          {item.aScore !== null ? item.aScore : <span className="text-slate-400 italic text-[10px]">Belum</span>}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-black text-slate-900">
                          {item.hasAny ? item.jumlahScore : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-black">
                          {item.hasAny ? (
                            <span className={item.peratus >= 80 ? 'text-emerald-700' : item.peratus >= 60 ? 'text-blue-700' : 'text-slate-700'}>
                              {item.peratus.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold text-[10.5px]">
                          {c.statusTemuduga === 'HADIR' ? (
                            <span className="text-emerald-700 font-bold">HADIR</span>
                          ) : c.statusTemuduga === 'TIDAK_HADIR' ? (
                            <span className="text-rose-700 font-bold">TIDAK HADIR</span>
                          ) : (
                            <span className="text-slate-500 font-medium">{c.statusTemuduga || 'BELUM'}</span>
                          )}
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold text-[10.5px]">
                          {c.statusTawaran === 'BERJAYA' ? (
                            <span className="text-emerald-700 font-black">TAWARAN</span>
                          ) : c.statusTawaran === 'SIMPANAN' ? (
                            <span className="text-amber-700 font-bold">SIMPANAN</span>
                          ) : c.statusTawaran === 'TIDAK_LAYAK' ? (
                            <span className="text-rose-700 font-medium">TIDAK BERJAYA</span>
                          ) : (
                            <span className="text-slate-500">{c.statusTawaran || '-'}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Ruang Pengesahan & Tandatangan (Bercetak) */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
            <div>
              <p className="font-bold text-slate-700 mb-1">Disediakan Oleh:</p>
              <div className="h-16 border-b border-dashed border-slate-400"></div>
              <p className="mt-1 font-bold text-slate-900">Urusetia Temuduga & Kemasukan</p>
              <p className="text-[11px] text-slate-500">Tarikh: {dateStr}</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-1">Disemak & Disahkan Oleh:</p>
              <div className="h-16 border-b border-dashed border-slate-400"></div>
              <p className="mt-1 font-bold text-slate-900">Pengetua / Pengerusi Jawatankuasa Pemilihan</p>
              <p className="text-[11px] text-slate-500">SMA Kota Gelanggi 3</p>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: A4 landscape; 
            margin: 0.8cm; 
          }
          body {
            background: white !important;
            color: black !important;
          }
          .printable-area {
            position: static !important;
            overflow: visible !important;
            background: white !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          .break-inside-avoid {
            page-break-inside: avoid !important;
          }
        }
      `}} />
    </div>,
    document.body
  );
}

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
  RotateCcw,
  FileText,
  Printer,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Candidate } from '../../types';

export interface HafazanPartRow {
  partNo: number;
  ketepatan: number; // 0..4
  tajwid: number; // 0..2
  tanpaBantuan: number; // 0..1
  catatanRalat: string; // H, T, B, ayat diuji
  tested: boolean;
}

export interface SahsiahIndicatorRow {
  id: number;
  label: string;
  skor: number; // 0, 0.5, 1
  bukti: string;
}

export interface TahfizRubrik2026Data {
  // Maklumat sokongan calon (berasingan)
  khatamTilawah: 'YA' | 'TIDAK' | 'BELUM_DISAHKAN';
  catatanUasa: string;
  catatanPsra: string;
  upkkAlquran: string;
  upkkJawi: string;

  // A. Hafazan 70 markah
  surahHafazan: string;
  setUjianHafazan: string;
  bahagianHafazan: HafazanPartRow[];

  // B. Tilawah 25 markah
  surahTilawah: string;
  setUjianTilawah: string;
  tilawahKelancaran: number; // 0..10
  tilawahTajwid: number; // 0..10
  tilawahTartil: number; // 0..5
  catatanRalatTilawah: string;

  // C. Sahsiah 5 markah
  sahsiahIndikator: SahsiahIndicatorRow[];

  // Rumusan & Syor Panel
  syorPanel: 'DISOKONG' | 'TIDAK_DISOKONG' | 'PERLU_SEMAKAN';
  penilaiPertama: string;
  penilaiKedua: string;
}

export const SAHSIAH_INDICATORS_DEFAULT: { id: number; label: string }[] = [
  { id: 1, label: 'Adab pertuturan dan menghormati orang lain' },
  { id: 2, label: 'Mendengar dan memahami arahan yang munasabah' },
  { id: 3, label: 'Minat yang dinyatakan terhadap pembelajaran tahfiz' },
  { id: 4, label: 'Kesungguhan mencuba walaupun menghadapi kesukaran' },
  { id: 5, label: 'Kesediaan mengikuti rutin program / asrama' },
];

export function createDefaultRubrik2026Data(
  candidate?: Candidate | null,
  evaluatorName?: string
): TahfizRubrik2026Data {
  const existing: Partial<TahfizRubrik2026Data> | undefined =
    candidate?.markahTahfiz?.butiranRubrik2026;

  const pbdSummary = candidate?.pbd
    ? [
        candidate.pbd.bm ? `BM: ${candidate.pbd.bm}` : '',
        candidate.pbd.bi ? `BI: ${candidate.pbd.bi}` : '',
        candidate.pbd.matematik ? `Mat: ${candidate.pbd.matematik}` : '',
        candidate.pbd.sains ? `Sains: ${candidate.pbd.sains}` : '',
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  const defaultHafazan: HafazanPartRow[] = Array.from({ length: 10 }, (_, idx) => ({
    partNo: idx + 1,
    ketepatan: 4,
    tajwid: 2,
    tanpaBantuan: 1,
    catatanRalat: '',
    tested: true,
  }));

  const defaultSahsiah: SahsiahIndicatorRow[] = SAHSIAH_INDICATORS_DEFAULT.map((ind) => ({
    id: ind.id,
    label: ind.label,
    skor: 1,
    bukti: '',
  }));

  return {
    khatamTilawah: existing?.khatamTilawah || 'BELUM_DISAHKAN',
    catatanUasa: existing?.catatanUasa ?? pbdSummary,
    catatanPsra: existing?.catatanPsra ?? '',
    upkkAlquran: existing?.upkkAlquran ?? (candidate?.upkk?.alquran || '-'),
    upkkJawi: existing?.upkkJawi ?? (candidate?.upkk?.jawikhat || '-'),

    surahHafazan: existing?.surahHafazan ?? '',
    setUjianHafazan: existing?.setUjianHafazan ?? '',
    bahagianHafazan:
      existing?.bahagianHafazan && existing.bahagianHafazan.length === 10
        ? existing.bahagianHafazan
        : defaultHafazan,

    surahTilawah: existing?.surahTilawah ?? '',
    setUjianTilawah: existing?.setUjianTilawah ?? '',
    tilawahKelancaran:
      typeof existing?.tilawahKelancaran === 'number' ? existing.tilawahKelancaran : 10,
    tilawahTajwid: typeof existing?.tilawahTajwid === 'number' ? existing.tilawahTajwid : 10,
    tilawahTartil: typeof existing?.tilawahTartil === 'number' ? existing.tilawahTartil : 5,
    catatanRalatTilawah: existing?.catatanRalatTilawah ?? '',

    sahsiahIndikator:
      existing?.sahsiahIndikator && existing.sahsiahIndikator.length === 5
        ? existing.sahsiahIndikator
        : defaultSahsiah,

    syorPanel: existing?.syorPanel || 'DISOKONG',
    penilaiPertama: existing?.penilaiPertama || evaluatorName || '',
    penilaiKedua: existing?.penilaiKedua || '',
  };
}

export function PanduanRubrikTahfizModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#043d2a] via-[#084e36] to-[#043d2a] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Panduan Skor &amp; Rubrik Penilaian Temuduga Tahfiz Tingkatan 1 (Ambilan 2026)
              </h4>
              <p className="text-[11px] text-emerald-200">
                Ujian Saringan Tilawah dan Hafazan KBT · Panduan seragam untuk semua penilai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/assets/aistudio/Rubrik_Temuduga_Tahfiz_Tingkatan_1_2026_Ditambah_Baik_bbebe03d.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Buka PDF Rubrik Rasmi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/70 text-slate-800">
          {/* 1. Hafazan 10 bahagian x 7 markah */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="bg-[#1b365d] text-white px-4 py-3 flex items-center justify-between">
              <h5 className="font-extrabold text-sm sm:text-base">
                1. Hafazan — 10 Bahagian &times; 7 Markah (Jumlah: 70 Markah)
              </h5>
              <span className="text-xs font-bold bg-white/15 px-2.5 py-0.5 rounded-full">
                Ketepatan 4 + Tajwid 2 + Tanpa Bantuan 1
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3 border-r border-slate-200 w-48">Aspek</th>
                    <th className="p-3 border-r border-slate-200 w-24 text-center">Julat</th>
                    <th className="p-3">Deskriptor dan Kaedah Penskoran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Ketepatan hafazan</td>
                    <td className="p-3 text-center font-black text-emerald-700 border-r border-slate-200">
                      0 – 4
                    </td>
                    <td className="p-3 leading-relaxed">
                      <strong>4</strong> = bahagian lengkap dan tepat; <strong>3</strong> = satu ralat hafazan;{' '}
                      <strong>2</strong> = dua ralat; <strong>1</strong> = tiga atau lebih ralat tetapi masih ada bacaan betul;{' '}
                      <strong>0</strong> = tidak dapat menyampaikan bahagian yang diuji.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Tajwid dan makhraj</td>
                    <td className="p-3 text-center font-black text-emerald-700 border-r border-slate-200">
                      0 – 2
                    </td>
                    <td className="p-3 leading-relaxed">
                      <strong>2</strong> = tiada ralat tajwid / makhraj; <strong>1</strong> = satu ralat;{' '}
                      <strong>0</strong> = dua atau lebih ralat, atau tiada bacaan yang boleh dinilai.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Tanpa bantuan penilai</td>
                    <td className="p-3 text-center font-black text-emerald-700 border-r border-slate-200">
                      0 – 1
                    </td>
                    <td className="p-3 leading-relaxed">
                      <strong>1</strong> = menyambung bahagian dengan sendiri tanpa sebarang petunjuk lisan;{' '}
                      <strong>0</strong> = menerima petunjuk / sambungan kalimah, atau tidak mencuba.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 text-xs text-amber-950 font-medium">
              <strong>Kod ralat:</strong> <code>H</code> = tersalah / tertinggal kalimah;{' '}
              <code>T</code> = tajwid / makhraj; <code>B</code> = bantuan penilai. Pembetulan sendiri masih direkod sebagai ralat tetapi tidak dikira sebagai bantuan. Tiada respons pada sesuatu bahagian = 0/7.
            </div>
          </div>

          {/* 2. Tilawah 25 markah */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="bg-[#1b365d] text-white px-4 py-3 flex items-center justify-between">
              <h5 className="font-extrabold text-sm sm:text-base">
                2. Tilawah — 25 Markah
              </h5>
              <span className="text-xs font-bold bg-white/15 px-2.5 py-0.5 rounded-full">
                Kelancaran 10 + Tajwid 10 + Tartil/Waqaf 5
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3 border-r border-slate-200 w-48">Aspek</th>
                    <th className="p-3 border-r border-slate-200 w-24 text-center">Julat</th>
                    <th className="p-3">Deskriptor dan Kaedah Penskoran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Kelancaran dan fasahah</td>
                    <td className="p-3 text-center font-black text-blue-700 border-r border-slate-200">
                      0 – 10
                    </td>
                    <td className="p-3 leading-relaxed">
                      Mula pada <strong>10</strong>; tolak 1 bagi setiap ralat kalimah / baris, tertinggal perkataan atau gangguan kelancaran yang jelas. Skor minimum 0.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Tajwid dan makhraj</td>
                    <td className="p-3 text-center font-black text-blue-700 border-r border-slate-200">
                      0 – 10
                    </td>
                    <td className="p-3 leading-relaxed">
                      Mula pada <strong>10</strong>; tolak 1 bagi setiap ralat hukum tajwid atau sebutan / sifat huruf yang berbeza daripada ralat kalimah yang telah dikira. Skor minimum 0.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">Tartil, waqaf dan ibtida&apos;</td>
                    <td className="p-3 text-center font-black text-blue-700 border-r border-slate-200">
                      0 – 5
                    </td>
                    <td className="p-3 leading-relaxed">
                      Mula pada <strong>5</strong>; tolak 1 setiap kali berhenti atau memulakan pada tempat yang menjejaskan bacaan, atau rentak terlalu tergesa sehingga mengganggu tertib. Skor minimum 0.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
              Satu kejadian tidak dihukum dua kali untuk aspek yang sama. Keindahan suara atau kemahiran tarannum tidak dijadikan syarat tambahan kecuali diputuskan secara rasmi oleh jawatankuasa.
            </div>
          </div>

          {/* 3. Sahsiah 5 markah */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h5 className="font-extrabold text-sm sm:text-base text-slate-900">
                3. Sahsiah dan Kecenderungan — 5 Markah (5 Indikator &times; 0 / 0.5 / 1)
              </h5>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Maksimum: 5m
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Bagi setiap satu daripada lima indikator pada borang: <strong>1</strong> = jelas ditunjukkan;{' '}
              <strong>0.5</strong> = ditunjukkan sebahagian / selepas penjelasan; <strong>0</strong> = belum ditunjukkan selepas diberi peluang munasabah.{' '}
              <span className="text-amber-800 font-bold">Tulis bukti ringkas bagi skor 0 atau 0.5.</span>
            </p>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
              <div className="font-bold">Contoh Soalan Asas Seragam Kepada Calon:</div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>&ldquo;Mengapa mahu mengikuti tahfiz?&rdquo;</li>
                <li>&ldquo;Bagaimana mengurus masa hafazan?&rdquo;</li>
                <li>&ldquo;Apakah yang akan dilakukan apabila hafazan sukar?&rdquo;</li>
              </ul>
            </div>
            <p className="text-xs text-slate-500 italic">
              Penilai hendaklah memberi ruang bagi calon yang gugup, mempunyai keperluan pendidikan khusus atau memerlukan arahan diulang. Jangan menolak markah semata-mata kerana pemalu. Tidak menilai rupa, keyakinan suara, latar keluarga atau keputusan akademik di bawah komponen sahsiah.
            </p>
          </div>

          {/* 4. Prosedur Pelaksanaan & Penyelarasan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3">
            <h5 className="font-extrabold text-sm sm:text-base text-slate-900 border-b border-slate-100 pb-2">
              Prosedur Pelaksanaan dan Penyelarasan
            </h5>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
              <li>Tetapkan sebelum sesi: bank petikan / bahagian hafazan yang setara, julat ayat, kaedah pemilihan set dan tempoh yang munasabah.</li>
              <li>Pastikan calon memperoleh arahan serupa; penilai menggunakan teks rujukan yang sama serta menandakan setiap ralat pada masa bacaan berlangsung.</li>
              <li>Gunakan petunjuk bantuan yang seragam. Petunjuk yang diberikan mesti dicatat dalam lajur bantuan.</li>
              <li>Skor hafazan diberi untuk 10 bahagian yang telah ditetapkan. Jika tidak dapat mencuba sesuatu bahagian, markah bahagian itu ialah 0/7; jangan anggarkan skor bagi bahagian tidak diuji.</li>
              <li>Penilai merekod skor secara bebas apabila terdapat dua orang penilai. Sekiranya perbezaan skor ketara, jawatankuasa membuat penyelarasan berdasarkan ralat yang dicatat.</li>
              <li>Sebelum temuduga sebenar, uji rubrik pada contoh bacaan yang sama dan selaraskan takrif ralat.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Rujukan: Lembaga Peperiksaan KPM (2018) &amp; SPI KPM Bil. 10 Tahun 2023 (Garis Panduan KBT).
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}

interface BorangRubrikTahfizProps {
  candidate: Candidate;
  evaluatorName: string;
  isFormDisabled: boolean;
  markah: Record<string, number>;
  setMarkah: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  catatan: string;
  setCatatan: (val: string) => void;
  rubrikData: TahfizRubrik2026Data;
  setRubrikData: React.Dispatch<React.SetStateAction<TahfizRubrik2026Data>>;
  onOpenGuideline: () => void;
}

export function BorangRubrikTahfizInteraktif({
  candidate,
  evaluatorName,
  isFormDisabled,
  setMarkah,
  catatan,
  setCatatan,
  rubrikData,
  setRubrikData,
  onOpenGuideline,
}: BorangRubrikTahfizProps) {
  // Kira jumlah automatik mengikut spesifikasi e-QABUL dalam PDF
  const totalKetepatan = rubrikData.bahagianHafazan.reduce(
    (sum, r) => sum + (r.tested ? r.ketepatan : 0),
    0
  );
  const totalTajwidHafazan = rubrikData.bahagianHafazan.reduce(
    (sum, r) => sum + (r.tested ? r.tajwid : 0),
    0
  );
  const totalTanpaBantuan = rubrikData.bahagianHafazan.reduce(
    (sum, r) => sum + (r.tested ? r.tanpaBantuan : 0),
    0
  );
  const jumlahHafazan = totalKetepatan + totalTajwidHafazan + totalTanpaBantuan; // /70

  const jumlahTilawah =
    (Number(rubrikData.tilawahKelancaran) || 0) +
    (Number(rubrikData.tilawahTajwid) || 0) +
    (Number(rubrikData.tilawahTartil) || 0); // /25

  const jumlahSahsiahRaw = rubrikData.sahsiahIndikator.reduce(
    (sum, ind) => sum + (Number(ind.skor) || 0),
    0
  );
  // Bundarkan ke nombor bulat / perpuluhan tepat untuk paparan & simpanan
  const jumlahSahsiah = Math.round(jumlahSahsiahRaw * 10) / 10; // /5
  const jumlahKeseluruhan = Math.round((jumlahHafazan + jumlahTilawah + jumlahSahsiah) * 10) / 10; // /100

  // Sinkronkan jumlah Hafazan, Tilawah & Sahsiah ke objek markah utama supaya jadual & keputusan kekal serasi
  useEffect(() => {
    setMarkah((prev) => {
      const sahsiahRounded = Math.round(jumlahSahsiah);
      if (
        prev.hafazan === jumlahHafazan &&
        prev.tilawah === jumlahTilawah &&
        prev.sahsiah === sahsiahRounded
      ) {
        return prev;
      }
      return {
        ...prev,
        hafazan: jumlahHafazan,
        tilawah: jumlahTilawah,
        sahsiah: sahsiahRounded,
      };
    });
  }, [jumlahHafazan, jumlahTilawah, jumlahSahsiah, setMarkah]);

  const updateHafazanRow = (partNo: number, patch: Partial<HafazanPartRow>) => {
    if (isFormDisabled) return;
    setRubrikData((prev) => ({
      ...prev,
      bahagianHafazan: prev.bahagianHafazan.map((row) =>
        row.partNo === partNo ? { ...row, ...patch } : row
      ),
    }));
  };

  const appendErrorCodeHafazan = (partNo: number, code: string) => {
    if (isFormDisabled) return;
    setRubrikData((prev) => ({
      ...prev,
      bahagianHafazan: prev.bahagianHafazan.map((row) => {
        if (row.partNo !== partNo) return row;
        const current = row.catatanRalat.trim();
        const next = current ? `${current}, ${code}` : code;
        return { ...row, catatanRalat: next };
      }),
    }));
  };

  const updateSahsiahRow = (id: number, patch: Partial<SahsiahIndicatorRow>) => {
    if (isFormDisabled) return;
    setRubrikData((prev) => ({
      ...prev,
      sahsiahIndikator: prev.sahsiahIndikator.map((ind) =>
        ind.id === id ? { ...ind, ...patch } : ind
      ),
    }));
  };

  // Semak jika ada indikator sahsiah bernilai 0 atau 0.5 yang belum diisi bukti ringkas
  const missingSahsiahEvidence = rubrikData.sahsiahIndikator.filter(
    (ind) => (ind.skor === 0 || ind.skor === 0.5) && !ind.bukti.trim()
  );

  return (
    <div className="space-y-6">
      {/* HEADER BORANG PENILAIAN TEMUDUGA TAHFIZ TINGKATAN 1 */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              Temuduga KBT Tingkatan 1 | Ambilan 2026
            </span>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              Borang Penilaian Temuduga Tahfiz Tingkatan 1
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Ujian Saringan Tilawah dan Hafazan KBT · Skala Penuh: 100 Markah (Hafazan 70 + Tilawah 25 + Sahsiah 5)
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenGuideline}
            className="bg-[#1b365d] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Panduan Skor &amp; Rubrik Penilai</span>
          </button>
        </div>

        {/* MAKLUMAT SOKONGAN CALON (Direkod secara berasingan; tidak ditambah kepada 100 markah) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h5 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-800">
              Maklumat Sokongan Calon
            </h5>
            <span className="text-[11px] text-slate-500 italic">
              Direkod secara berasingan; tidak ditambah secara automatik kepada 100 markah ujian.
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-[#1b365d] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3.5 border-r border-slate-600 w-1/3">Maklumat</th>
                  <th className="py-2.5 px-3.5">Rekod</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200">
                    Khatam tilawah al-Quran
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        { val: 'YA', label: 'Ya' },
                        { val: 'TIDAK', label: 'Tidak' },
                        { val: 'BELUM_DISAHKAN', label: 'Belum disahkan' },
                      ].map((opt) => (
                        <label
                          key={opt.val}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold cursor-pointer transition ${
                            rubrikData.khatamTilawah === opt.val
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="khatamTilawah"
                            disabled={isFormDisabled}
                            checked={rubrikData.khatamTilawah === opt.val}
                            onChange={() =>
                              setRubrikData((prev) => ({
                                ...prev,
                                khatamTilawah: opt.val as any,
                              }))
                            }
                            className="sr-only"
                          />
                          <span>
                            [{rubrikData.khatamTilawah === opt.val ? '✓' : ' '}] {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200">
                    UASA Tahun 6 / PBD
                  </td>
                  <td className="py-2.5 px-3.5">
                    <input
                      type="text"
                      disabled={isFormDisabled}
                      value={rubrikData.catatanUasa}
                      onChange={(e) =>
                        setRubrikData((prev) => ({ ...prev, catatanUasa: e.target.value }))
                      }
                      placeholder="Keputusan / catatan UASA Tahun 6..."
                      className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200">
                    Ujian sekolah agama / PSRA
                  </td>
                  <td className="py-2.5 px-3.5">
                    <input
                      type="text"
                      disabled={isFormDisabled}
                      value={rubrikData.catatanPsra}
                      onChange={(e) =>
                        setRubrikData((prev) => ({ ...prev, catatanPsra: e.target.value }))
                      }
                      placeholder="Keputusan / catatan sekolah agama..."
                      className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200">
                    UPKK
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 shrink-0">Al-Quran:</span>
                        <input
                          type="text"
                          disabled={isFormDisabled}
                          value={rubrikData.upkkAlquran}
                          onChange={(e) =>
                            setRubrikData((prev) => ({ ...prev, upkkAlquran: e.target.value }))
                          }
                          className="flex-1 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 shrink-0">Jawi:</span>
                        <input
                          type="text"
                          disabled={isFormDisabled}
                          value={rubrikData.upkkJawi}
                          onChange={(e) =>
                            setRubrikData((prev) => ({ ...prev, upkkJawi: e.target.value }))
                          }
                          className="flex-1 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BAHAGIAN A: HAFAZAN 70 MARKAH (10 BAHAGIAN x 7 MARKAH)
         ===================================================================== */}
      <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              A. Hafazan (70 Markah)
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Setiap bahagian bernilai <strong>7 markah</strong>: Ketepatan <strong>4</strong> + Tajwid{' '}
              <strong>2</strong> + Tanpa bantuan <strong>1</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              disabled={isFormDisabled}
              onClick={() => {
                setRubrikData((prev) => ({
                  ...prev,
                  bahagianHafazan: prev.bahagianHafazan.map((r) => ({
                    ...r,
                    tested: true,
                    ketepatan: 4,
                    tajwid: 2,
                    tanpaBantuan: 1,
                  })),
                }));
              }}
              className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              Set Semua Penuh (70/70)
            </button>
            <span className="text-sm font-black px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white shadow-2xs">
              Skor Hafazan: {jumlahHafazan} / 70
            </span>
          </div>
        </div>

        {/* Surah / Julat Ayat & Set Ujian Hafazan */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="sm:col-span-8">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Surah / Julat Ayat Hafazan:
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.surahHafazan}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, surahHafazan: e.target.value }))
              }
              placeholder="Contoh: Surah Al-Mulk (Ayat 1 - 15) / Petikan Hafazan KBT"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Set Ujian:
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.setUjianHafazan}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, setUjianHafazan: e.target.value }))
              }
              placeholder="Contoh: Set A / Set 1"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Nota Ringkas Panduan Skor Hafazan */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl px-3.5 py-2.5 text-[11px] sm:text-xs text-amber-950 space-y-1">
          <div>
            <strong>Panduan Skor:</strong> Ketepatan (<strong>4</strong>=tepat, <strong>3</strong>=1 ralat,{' '}
            <strong>2</strong>=2 ralat, <strong>1</strong>=&ge;3 ralat, <strong>0</strong>=gagal) · Tajwid (
            <strong>2</strong>=tiada ralat, <strong>1</strong>=1 ralat, <strong>0</strong>=&ge;2 ralat) · Tanpa Bantuan (
            <strong>1</strong>=sendiri, <strong>0</strong>=dibantu/tidak cuba).
          </div>
          <div>
            <strong>Kod Ralat:</strong> <code>H</code> = tersalah / tertinggal kalimah; <code>T</code> = tajwid / makhraj;{' '}
            <code>B</code> = bantuan penilai. Tiada respons pada sesuatu bahagian = <strong>0/7</strong>.
          </div>
        </div>

        {/* Jadual 10 Bahagian Hafazan */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead className="bg-[#1b365d] text-white font-bold">
              <tr>
                <th className="py-2.5 px-2.5 text-center w-10 border-r border-slate-600">Bil.</th>
                <th className="py-2.5 px-3 w-36 border-r border-slate-600">Bahagian hafazan</th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-600">
                  Ketepatan (/4)
                </th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-600">
                  Tajwid (/2)
                </th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-600">
                  Tanpa bantuan (/1)
                </th>
                <th className="py-2.5 px-2.5 text-center w-24 border-r border-slate-600">
                  Skor (/7)
                </th>
                <th className="py-2.5 px-3">Kod / catatan ralat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rubrikData.bahagianHafazan.map((row) => {
                const rowScore = row.tested
                  ? row.ketepatan + row.tajwid + row.tanpaBantuan
                  : 0;
                return (
                  <tr
                    key={row.partNo}
                    className={
                      !row.tested
                        ? 'bg-slate-100/80 text-slate-400'
                        : 'hover:bg-emerald-50/30 transition-colors'
                    }
                  >
                    <td className="py-2.5 px-2.5 text-center font-black text-slate-700 border-r border-slate-200">
                      {row.partNo}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800 border-r border-slate-200">
                      <div className="flex items-center justify-between gap-1">
                        <span>Bahagian {row.partNo}</span>
                        <button
                          type="button"
                          disabled={isFormDisabled}
                          onClick={() =>
                            updateHafazanRow(row.partNo, {
                              tested: true,
                              ketepatan: rowScore === 0 ? 4 : 0,
                              tajwid: rowScore === 0 ? 2 : 0,
                              tanpaBantuan: rowScore === 0 ? 1 : 0,
                            })
                          }
                          title={rowScore === 0 ? 'Set 7/7' : 'Set 0/7 (Tiada respons)'}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          {rowScore === 0 ? 'Set 7/7' : '0/7'}
                        </button>
                      </div>
                    </td>

                    {/* Ketepatan 0..4 */}
                    <td className="py-2 px-2 text-center border-r border-slate-200">
                      <div className="inline-flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={isFormDisabled}
                            onClick={() =>
                              updateHafazanRow(row.partNo, { tested: true, ketepatan: val })
                            }
                            className={`w-7 h-7 rounded-lg font-black text-xs transition cursor-pointer ${
                              row.tested && row.ketepatan === val
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Tajwid 0..2 */}
                    <td className="py-2 px-2 text-center border-r border-slate-200">
                      <div className="inline-flex items-center gap-1">
                        {[0, 1, 2].map((val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={isFormDisabled}
                            onClick={() =>
                              updateHafazanRow(row.partNo, { tested: true, tajwid: val })
                            }
                            className={`w-7 h-7 rounded-lg font-black text-xs transition cursor-pointer ${
                              row.tested && row.tajwid === val
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Tanpa Bantuan 0..1 */}
                    <td className="py-2 px-2 text-center border-r border-slate-200">
                      <div className="inline-flex items-center gap-1">
                        {[0, 1].map((val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={isFormDisabled}
                            onClick={() =>
                              updateHafazanRow(row.partNo, { tested: true, tanpaBantuan: val })
                            }
                            className={`w-7 h-7 rounded-lg font-black text-xs transition cursor-pointer ${
                              row.tested && row.tanpaBantuan === val
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Skor /7 */}
                    <td className="py-2 px-2.5 text-center font-black text-sm border-r border-slate-200 bg-emerald-50/40 text-emerald-900">
                      {rowScore} <span className="text-slate-400 font-semibold text-xs">/7</span>
                    </td>

                    {/* Kod / Catatan Ralat */}
                    <td className="py-2 px-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 shrink-0">
                          {['H', 'T', 'B'].map((code) => (
                            <button
                              key={code}
                              type="button"
                              disabled={isFormDisabled}
                              onClick={() => appendErrorCodeHafazan(row.partNo, code)}
                              title={
                                code === 'H'
                                  ? 'Tambah kod H (Ralat Hafazan/Kalimah)'
                                  : code === 'T'
                                  ? 'Tambah kod T (Ralat Tajwid/Makhraj)'
                                  : 'Tambah kod B (Bantuan Penilai)'
                              }
                              className="px-1.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-[10px] transition cursor-pointer"
                            >
                              +{code}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          disabled={isFormDisabled}
                          value={row.catatanRalat}
                          onChange={(e) =>
                            updateHafazanRow(row.partNo, { catatanRalat: e.target.value })
                          }
                          placeholder="Kod ralat (H/T/B) atau ayat..."
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Baris JUMLAH HAFAZAN */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-2.5 text-center border-r border-slate-300" colSpan={2}>
                  JUMLAH HAFAZAN
                </td>
                <td className="py-3 px-2.5 text-center border-r border-slate-300 text-emerald-800">
                  {totalKetepatan} / 40
                </td>
                <td className="py-3 px-2.5 text-center border-r border-slate-300 text-emerald-800">
                  {totalTajwidHafazan} / 20
                </td>
                <td className="py-3 px-2.5 text-center border-r border-slate-300 text-emerald-800">
                  {totalTanpaBantuan} / 10
                </td>
                <td className="py-3 px-2.5 text-center border-r border-slate-300 bg-emerald-100 text-emerald-950 text-sm">
                  {jumlahHafazan} / 70
                </td>
                <td className="py-3 px-3 text-[11px] font-semibold text-slate-500">
                  Jumlah automatik maksimum 70 markah
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          BAHAGIAN B: TILAWAH 25 MARKAH
         ===================================================================== */}
      <div className="bg-white rounded-2xl border-2 border-blue-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              B. Tilawah (25 Markah)
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Kelancaran &amp; fasahah (<strong>/10</strong>) + Tajwid &amp; makhraj (<strong>/10</strong>) + Tartil, waqaf &amp; ibtida&apos; (<strong>/5</strong>)
            </p>
          </div>
          <span className="text-sm font-black px-3.5 py-1.5 rounded-xl bg-blue-700 text-white shadow-2xs self-start sm:self-auto">
            Skor Tilawah: {jumlahTilawah} / 25
          </span>
        </div>

        {/* Surah / Julat Ayat & Set Ujian Tilawah */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="sm:col-span-8">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Surah / Julat Ayat Tilawah:
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.surahTilawah}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, surahTilawah: e.target.value }))
              }
              placeholder="Contoh: Surah Al-Baqarah Ayat 255-257"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Set Ujian:
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.setUjianTilawah}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, setUjianTilawah: e.target.value }))
              }
              placeholder="Contoh: Set B"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Jadual 3 Aspek Tilawah */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-[#1b365d] text-white font-bold">
              <tr>
                <th className="py-2.5 px-3 text-center w-12 border-r border-slate-600">Bil.</th>
                <th className="py-2.5 px-3.5 w-56 border-r border-slate-600">Aspek</th>
                <th className="py-2.5 px-3.5 text-center w-64 border-r border-slate-600">Skor</th>
                <th className="py-2.5 px-3.5">Panduan pemerhatian &amp; kaedah penskoran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* 1. Kelancaran dan fasahah /10 */}
              <tr>
                <td className="p-3 text-center font-black text-slate-700 border-r border-slate-200">
                  1
                </td>
                <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                  Kelancaran dan fasahah
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahKelancaran <= 0}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahKelancaran: Math.max(0, prev.tilawahKelancaran - 1),
                        }))
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs transition cursor-pointer disabled:opacity-40"
                      title="Tolak 1 markah bagi setiap ralat"
                    >
                      -1 Ralat
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      disabled={isFormDisabled}
                      value={rubrikData.tilawahKelancaran}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
                        setRubrikData((prev) => ({ ...prev, tilawahKelancaran: val }));
                      }}
                      className="w-16 text-center font-black text-base border-2 border-blue-300 rounded-lg py-1 text-slate-900"
                    />
                    <span className="font-bold text-slate-500 text-xs">/ 10</span>
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahKelancaran >= 10}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahKelancaran: Math.min(10, prev.tilawahKelancaran + 1),
                        }))
                      }
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition cursor-pointer disabled:opacity-40"
                    >
                      +1
                    </button>
                  </div>
                </td>
                <td className="p-3 text-xs text-slate-600 leading-relaxed">
                  <strong>Ketepatan kalimah, baris dan kelancaran tanpa pengulangan yang mengganggu.</strong>{' '}
                  (Mula pada 10; tolak 1 bagi setiap ralat kalimah / baris, tertinggal perkataan atau gangguan kelancaran yang jelas).
                </td>
              </tr>

              {/* 2. Tajwid dan makhraj /10 */}
              <tr>
                <td className="p-3 text-center font-black text-slate-700 border-r border-slate-200">
                  2
                </td>
                <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                  Tajwid dan makhraj
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahTajwid <= 0}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahTajwid: Math.max(0, prev.tilawahTajwid - 1),
                        }))
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs transition cursor-pointer disabled:opacity-40"
                      title="Tolak 1 markah bagi setiap ralat"
                    >
                      -1 Ralat
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      disabled={isFormDisabled}
                      value={rubrikData.tilawahTajwid}
                      onChange={(e) => {
                        const val = Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
                        setRubrikData((prev) => ({ ...prev, tilawahTajwid: val }));
                      }}
                      className="w-16 text-center font-black text-base border-2 border-blue-300 rounded-lg py-1 text-slate-900"
                    />
                    <span className="font-bold text-slate-500 text-xs">/ 10</span>
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahTajwid >= 10}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahTajwid: Math.min(10, prev.tilawahTajwid + 1),
                        }))
                      }
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition cursor-pointer disabled:opacity-40"
                    >
                      +1
                    </button>
                  </div>
                </td>
                <td className="p-3 text-xs text-slate-600 leading-relaxed">
                  <strong>Hukum tajwid, panjang pendek bacaan, sebutan dan sifat huruf.</strong>{' '}
                  (Mula pada 10; tolak 1 bagi setiap ralat hukum tajwid atau sebutan / sifat huruf yang berbeza daripada ralat kalimah).
                </td>
              </tr>

              {/* 3. Tartil, waqaf dan ibtida' /5 */}
              <tr>
                <td className="p-3 text-center font-black text-slate-700 border-r border-slate-200">
                  3
                </td>
                <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                  Tartil, waqaf dan ibtida&apos;
                </td>
                <td className="p-3 border-r border-slate-200">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahTartil <= 0}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahTartil: Math.max(0, prev.tilawahTartil - 1),
                        }))
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs transition cursor-pointer disabled:opacity-40"
                      title="Tolak 1 markah bagi setiap ralat"
                    >
                      -1 Ralat
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      disabled={isFormDisabled}
                      value={rubrikData.tilawahTartil}
                      onChange={(e) => {
                        const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0));
                        setRubrikData((prev) => ({ ...prev, tilawahTartil: val }));
                      }}
                      className="w-16 text-center font-black text-base border-2 border-blue-300 rounded-lg py-1 text-slate-900"
                    />
                    <span className="font-bold text-slate-500 text-xs">/ 5</span>
                    <button
                      type="button"
                      disabled={isFormDisabled || rubrikData.tilawahTartil >= 5}
                      onClick={() =>
                        setRubrikData((prev) => ({
                          ...prev,
                          tilawahTartil: Math.min(5, prev.tilawahTartil + 1),
                        }))
                      }
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition cursor-pointer disabled:opacity-40"
                    >
                      +1
                    </button>
                  </div>
                </td>
                <td className="p-3 text-xs text-slate-600 leading-relaxed">
                  <strong>Rentak bacaan tertib; tempat berhenti dan memulakan bacaan sesuai.</strong>{' '}
                  (Mula pada 5; tolak 1 setiap kali berhenti/memulakan pada tempat yang menjejaskan bacaan atau terlalu tergesa).
                </td>
              </tr>

              {/* Baris JUMLAH TILAWAH */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300" colSpan={2}>
                  JUMLAH TILAWAH
                </td>
                <td className="p-3 text-center border-r border-slate-300 bg-blue-100 text-blue-950 text-base">
                  {jumlahTilawah} / 25
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 shrink-0">Catatan ralat:</span>
                    <input
                      type="text"
                      disabled={isFormDisabled}
                      value={rubrikData.catatanRalatTilawah}
                      onChange={(e) =>
                        setRubrikData((prev) => ({
                          ...prev,
                          catatanRalatTilawah: e.target.value,
                        }))
                      }
                      placeholder="Rekodkan kod / catatan ralat tilawah jika ada..."
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-normal text-slate-800"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 italic">
          Keindahan suara atau kemahiran tarannum tidak dijadikan syarat tambahan kecuali diputuskan secara rasmi oleh jawatankuasa.
        </p>
      </div>

      {/* =====================================================================
          BAHAGIAN C: SAHSIAH DAN KECENDERUNGAN 5 MARKAH
         ===================================================================== */}
      <div className="bg-white rounded-2xl border-2 border-teal-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              C. Sahsiah dan Kecenderungan (5 Markah)
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Setiap indikator diberikan <strong>0</strong>, <strong>0.5</strong> atau <strong>1</strong> markah berdasarkan pemerhatian dan jawapan calon.
            </p>
          </div>
          <span className="text-sm font-black px-3.5 py-1.5 rounded-xl bg-teal-700 text-white shadow-2xs self-start sm:self-auto">
            Skor Sahsiah: {jumlahSahsiah} / 5
          </span>
        </div>

        {/* Soalan Asas Seragam */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl px-3.5 py-2.5 text-xs text-teal-950">
          <strong>Gunakan soalan asas yang sama kepada semua calon:</strong> &ldquo;Mengapa mahu mengikuti tahfiz?&rdquo; · &ldquo;Bagaimana mengurus masa hafazan?&rdquo; · &ldquo;Apakah yang akan dilakukan apabila hafazan sukar?&rdquo;
        </div>

        {missingSahsiahEvidence.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Perhatian: Mengikut rubrik rasmi, skor <strong>0</strong> atau <strong>0.5</strong> pada komponen Sahsiah memerlukan catatan / bukti ringkas dalam lajur di sebelah kanan.
            </span>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-[#1b365d] text-white font-bold">
              <tr>
                <th className="py-2.5 px-3 text-center w-12 border-r border-slate-600">Bil.</th>
                <th className="py-2.5 px-3.5 border-r border-slate-600">Indikator</th>
                <th className="py-2.5 px-3 text-center w-44 border-r border-slate-600">
                  Skor (/1)
                </th>
                <th className="py-2.5 px-3.5">Bukti ringkas / jawapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rubrikData.sahsiahIndikator.map((ind) => {
                const needsEvidence = (ind.skor === 0 || ind.skor === 0.5) && !ind.bukti.trim();
                return (
                  <tr key={ind.id} className="hover:bg-slate-50/60">
                    <td className="p-3 text-center font-black text-slate-700 border-r border-slate-200">
                      {ind.id}
                    </td>
                    <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                      {ind.label}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200">
                      <div className="inline-flex items-center gap-1.5">
                        {[0, 0.5, 1].map((val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={isFormDisabled}
                            onClick={() => updateSahsiahRow(ind.id, { skor: val })}
                            className={`px-2.5 py-1.5 rounded-lg font-black text-xs transition cursor-pointer ${
                              ind.skor === val
                                ? 'bg-teal-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        disabled={isFormDisabled}
                        value={ind.bukti}
                        onChange={(e) => updateSahsiahRow(ind.id, { bukti: e.target.value })}
                        placeholder={
                          ind.skor < 1
                            ? 'Wajib tulis bukti ringkas bagi skor 0 atau 0.5...'
                            : 'Bukti ringkas / jawapan calon (pilihan)...'
                        }
                        className={`w-full rounded-lg px-3 py-1.5 text-xs ${
                          needsEvidence
                            ? 'bg-amber-50 border-2 border-amber-400 text-slate-900 placeholder:text-amber-700'
                            : 'bg-slate-50 focus:bg-white border border-slate-200 text-slate-800'
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <td className="p-3 text-center border-r border-slate-300" colSpan={2}>
                  JUMLAH SAHSIAH
                </td>
                <td className="p-3 text-center border-r border-slate-300 bg-teal-100 text-teal-950 text-base">
                  {jumlahSahsiah} / 5
                </td>
                <td className="p-3 text-xs font-medium text-slate-500">
                  Tidak menilai rupa, keyakinan suara, latar keluarga atau keputusan akademik di bawah komponen sahsiah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          RUMUSAN DAN SYOR PANEL (/100)
         ===================================================================== */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-6 shadow-sm space-y-5">
        <h4 className="text-base sm:text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Rumusan dan Syor Panel
        </h4>

        {/* Jadual Rumusan Markah */}
        <div className="overflow-hidden rounded-xl border border-slate-300">
          <table className="w-full text-center border-collapse">
            <thead className="bg-[#1b365d] text-white text-xs sm:text-sm font-bold">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-600">Hafazan /70</th>
                <th className="py-2.5 px-3 border-r border-slate-600">Tilawah /25</th>
                <th className="py-2.5 px-3 border-r border-slate-600">Sahsiah /5</th>
                <th className="py-2.5 px-3 bg-emerald-800">JUMLAH /100</th>
              </tr>
            </thead>
            <tbody className="bg-white font-black text-lg sm:text-2xl">
              <tr>
                <td className="py-3.5 px-3 border-r border-slate-200 text-emerald-700">
                  {jumlahHafazan}
                </td>
                <td className="py-3.5 px-3 border-r border-slate-200 text-blue-700">
                  {jumlahTilawah}
                </td>
                <td className="py-3.5 px-3 border-r border-slate-200 text-teal-700">
                  {jumlahSahsiah}
                </td>
                <td className="py-3.5 px-3 bg-emerald-50 text-emerald-900 text-2xl sm:text-3xl">
                  {jumlahKeseluruhan}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pilihan Syor Panel */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Syor Panel Penilai:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {[
              {
                val: 'DISOKONG',
                label: 'Disokong',
                activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
              },
              {
                val: 'TIDAK_DISOKONG',
                label: 'Tidak disokong',
                activeClass: 'bg-rose-600 text-white border-rose-600 shadow-xs',
              },
              {
                val: 'PERLU_SEMAKAN',
                label: 'Perlu semakan / penyelarasan',
                activeClass: 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs',
              },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                disabled={isFormDisabled}
                onClick={() =>
                  setRubrikData((prev) => ({ ...prev, syorPanel: opt.val as any }))
                }
                className={`px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black transition cursor-pointer ${
                  rubrikData.syorPanel === opt.val
                    ? opt.activeClass
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                [{rubrikData.syorPanel === opt.val ? '✓' : ' '}] {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nama Penilai 1 & Penilai Kedua */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Penilai 1:
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.penilaiPertama || evaluatorName}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, penilaiPertama: e.target.value }))
              }
              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Penilai kedua (jika ada):
            </label>
            <input
              type="text"
              disabled={isFormDisabled}
              value={rubrikData.penilaiKedua}
              onChange={(e) =>
                setRubrikData((prev) => ({ ...prev, penilaiKedua: e.target.value }))
              }
              placeholder="Nama penilai kedua (pilihan)"
              className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Syor penilai bukan keputusan tawaran automatik; keputusan tertakluk kepada ketetapan jawatankuasa.
        </p>
      </div>
    </div>
  );
}

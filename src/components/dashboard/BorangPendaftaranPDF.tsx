import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';
import { DEFAULT_TANDATANGAN_PENGETUA } from '../../lib/imageUtils';
import { Printer, X, Download, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

export default function BorangPendaftaranPDF({ candidate, onClose }: Props) {
  const { settings } = useAppContext();
  const sigPengetua = settings.tandatanganPengetua || DEFAULT_TANDATANGAN_PENGETUA;

  useEffect(() => {
    // Scroll to top on open
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const cName = candidate.name || '';
  const cIC = candidate.ic || '';
  const cDOB = candidate.tarikhLahir || '';
  const cGender = candidate.jantina || '';
  const cAddress = [candidate.alamat1, candidate.alamat2, candidate.poskod, candidate.daerah, candidate.negeri].filter(Boolean).join(', ');
  const cBapa = candidate.namaBapa && candidate.namaBapa !== '-' ? candidate.namaBapa : '';
  const cICBapa = candidate.icBapa && candidate.icBapa !== '-' ? candidate.icBapa : '';
  const cTelBapa = candidate.telefonBapa && candidate.telefonBapa !== '-' ? candidate.telefonBapa : '';
  const cIbu = candidate.namaIbu && candidate.namaIbu !== '-' ? candidate.namaIbu : '';
  const cICIbu = candidate.icIbu && candidate.icIbu !== '-' ? candidate.icIbu : '';
  const cTelIbu = candidate.telefonIbu && candidate.telefonIbu !== '-' ? candidate.telefonIbu : '';

  return createPortal(
    <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm overflow-y-auto print:static print:bg-white print:overflow-visible print:block printable-area">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="sticky top-0 bg-slate-900 text-white p-4 shadow-xl z-50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-white">
              Pakej Dokumen & Borang Pendaftaran Tingkatan 1 (12 Halaman)
            </h2>
            <p className="text-xs text-slate-300">
              Calon: <strong className="text-emerald-400">{cName || 'Murid'}</strong> ({cIC || '-'}) | SMA Kota Gelanggi 3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Simpan PDF / Cetak (12 Halaman)</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            <X className="w-4 h-4" />
            <span>Tutup</span>
          </button>
        </div>
      </div>

      {/* Guide Banner for Parents (Hidden in Print) */}
      <div className="max-w-[210mm] mx-auto mt-4 px-4 print:hidden">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-900 flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Panduan Muat Turun & Simpan Sebagai Fail PDF:</p>
            <p className="mt-0.5 text-blue-800">
              Tekan butang hijau <strong>"Simpan PDF / Cetak"</strong> di atas. Apabila tetingkap cetakan pelayar muncul, tukar <em>Destination / Destinasi</em> kepada <strong>"Save as PDF" (Simpan sebagai PDF)</strong>, kemudian tekan <em>Save</em> untuk menyimpan fail 12 halaman ini terus ke telefon atau komputer anda.
            </p>
          </div>
        </div>
      </div>

      {/* Document Pages Container */}
      <div className="w-full py-6 print:py-0 print:block text-slate-900">
        <div className="max-w-[210mm] mx-auto bg-transparent flex flex-col gap-6 print:gap-0 print:block">

          {/* ========================================================
              PAGE 1: SENARAI SEMAK ITEM SEMASA PENDAFTARAN
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[13px] leading-relaxed">
            <h1 className="text-center font-bold text-base sm:text-lg mb-8 tracking-wide uppercase border-b-2 border-slate-900 pb-3">
              SENARAI SEMAK ITEM YANG PERLU DI BAWA SEMASA PENDAFTARAN
            </h1>

            <div className="space-y-4 mb-10">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">1.</span> Lampiran 1 : Borang APDM
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">2.</span> Lampiran 2 : Borang akuan pendapatan (jika tiada slip gaji)
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">3.</span> Lampiran 3 : Surat akuan ibu bapa/penjaga
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">4.</span> Lampiran 4 : Surat akujanji murid
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">5.</span> Surat Akuan Kesihatan murid
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">6.</span> Buku kesihatan RKM 1 (Pindaan 2009) (sekolah asal)
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">7.</span> Salinan Kad Pengenalan Pelajar
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">8.</span> Salinan Kad Pengenalan Ibu dan Bapa / Penjaga
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">9.</span> Salinan Slip Gaji Terkini (Ibu dan Bapa / Penjaga)
                  <p className="text-[11px] italic text-slate-600 mt-0.5">
                    (Sekiranya tiada slip gaji, tuan/puan diminta mengisi borang pengesahan pendapatan yang disertakan di sini dan hendaklah disahkan oleh Ketua Kampung/Penghulu).
                  </p>
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
                <div className="flex-1">
                  <span className="font-bold mr-2">10.</span> Salinan Sijil Berhenti Sekolah
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-sm shrink-0"></div>
              </div>
            </div>

            <div className="mt-8 border-t-2 border-slate-900 pt-6">
              <h2 className="font-bold text-sm mb-3 uppercase tracking-wide">ARAHAN :</h2>
              <p className="text-[12.5px] leading-relaxed mb-4">
                Semua calon yang telah menerima tawaran masuk ke <strong>SMA Kota Gelanggi 3</strong> diminta melengkapkan Borang Maklumat Murid berikut dengan disertakan sekali dokumen berikut :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[12.5px]">
                <li className="font-semibold">Salinan Kad Pengenalan Pelajar</li>
                <li className="font-semibold">Salinan Kad Pengenalan Ibu, Bapa dan Penjaga.</li>
                <li className="font-semibold">
                  Salinan Slip Gaji Terkini Ibu, Bapa dan Penjaga.
                  <p className="text-[11px] font-normal italic text-slate-600 ml-5 mt-0.5">
                    (Sekiranya tiada slip gaji, tuan/puan diminta mengisi borang pengesahan pendapatan yang disertakan disini dan hendaklah disahkan oleh Ketua Kampung/Penghulu).
                  </p>
                </li>
              </ol>
            </div>
          </div>

          {/* ========================================================
              PAGE 2: LAMPIRAN 1 - BORANG APDM (PROFIL MURID)
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-sans text-[11.5px] leading-snug">
            <div className="text-right font-bold text-xs mb-2">Lampiran 1</div>
            <h1 className="font-bold text-center text-sm tracking-wide uppercase mb-4">BORANG APDM</h1>

            <div className="mb-4 text-[12px] space-y-1">
              <p className="font-bold uppercase text-slate-800">Maklumat Sekolah</p>
              <p>Nama Sekolah : <span className="font-semibold">SMA KOTA GELANGGI 3, JERANTUT, PAHANG</span></p>
              <div className="flex justify-between">
                <span>Tingkatan / Darjah : <span className="font-semibold">TINGKATAN 1</span></span>
                <span>Nama Kelas : ........................................................</span>
              </div>
              <p>Email MOE murid : ....................................................@moe-dl.edu.my</p>
            </div>

            <p className="font-bold uppercase text-slate-800 mb-2">Profil Murid</p>

            <table className="w-full border-collapse border border-black mb-4 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">No. Kad Pengenalan</td>
                  <td className="border border-black p-2 w-1/4 font-mono font-bold">{cIC || ''}</td>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">Tarikh Lahir (DD/MM/YYYY)</td>
                  <td className="border border-black p-2 w-1/4">{cDOB || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Passport</td>
                  <td className="border border-black p-2">-</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Sijil Lahir</td>
                  <td className="border border-black p-2">{candidate.noSijilLahir || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Umur</td>
                  <td className="border border-black p-2">13 TAHUN</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Jantina</td>
                  <td className="border border-black p-2 font-semibold">{cGender ? `${cGender}` : 'Lelaki / Perempuan *'}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Kaum / Keturunan</td>
                  <td className="border border-black p-2">MELAYU</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">OKU</td>
                  <td className="border border-black p-2">Ya / Tidak *</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Negara Asal</td>
                  <td className="border border-black p-2">MALAYSIA</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Warganegara</td>
                  <td className="border border-black p-2">WARGANEGARA</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. HP</td>
                  <td className="border border-black p-2">{cTelBapa || cTelIbu || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Tel Rumah</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tarikh Masuk Sekolah Semasa</td>
                  <td className="border border-black p-2">03/01/2027</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Jarak Ke Sekolah</td>
                  <td className="border border-black p-2">............. KM</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Alamat Tetap</td>
                  <td colSpan={3} className="border border-black p-2">{cAddress || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Poskod</td>
                  <td className="border border-black p-2">{candidate.poskod || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Bandar / Negeri</td>
                  <td className="border border-black p-2">{[candidate.daerah, candidate.negeri].filter(Boolean).join(', ')}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Alamat surat menyurat<br/><span className="text-[9.5px] font-normal">(jika berbeza dari alamat tetap)</span></td>
                  <td colSpan={3} className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Poskod</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Bandar / Negeri</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Asrama</td>
                  <td className="border border-black p-2">YA</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Yatim</td>
                  <td className="border border-black p-2">Yatim / Piatu / Yatim Piatu *</td>
                </tr>
              </tbody>
            </table>

            <div className="text-[10px] text-slate-600 space-y-0.5 mt-4 border-t border-slate-200 pt-2">
              <p>Catatan :</p>
              <p>* Potong mana yang tidak berkenaan.</p>
              <p>** Hubungan dengan anak bagi pengisian selain ibu dan bapa</p>
              <p>*** Bilangan tanggungan isi Rumah tidak termasuk anak yang bekerja</p>
            </div>
            <div className="text-right text-xs mt-4 font-bold">1</div>
          </div>

          {/* ========================================================
              PAGE 3: LAMPIRAN 1 - ADIK BERADIK & STATUS IBU BAPA
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-sans text-[11.5px] leading-snug">
            <h2 className="font-bold text-xs uppercase mb-3">Maklumat Kad 001 / Maklumat Adik Beradik:</h2>

            <table className="w-full border-collapse border border-black mb-6 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/3 bg-slate-50">Bahasa Pertuturan Di Rumah</td>
                  <td className="border border-black p-2 w-1/6">BAHASA MELAYU</td>
                  <td className="border border-black p-2 font-bold w-1/3 bg-slate-50">Tahun Lahir Anak Pertama</td>
                  <td className="border border-black p-2 w-1/6"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Anak ke berapa</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tahun Lahir Anak ke-2</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Bil Adik Beradik</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tahun Lahir Anak ke-3</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Jumlah Anak Dalam Keluarga Yang Masih Hidup Tahun Ini</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tahun Lahir Anak ke-4</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Murid sekarang tinggal dengan</td>
                  <td className="border border-black p-2">IBU BAPA</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tahun Lahir Anak ke-5</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Semenjak tahun</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tahun Lahir Anak ke-6</td>
                  <td className="border border-black p-2"></td>
                </tr>
              </tbody>
            </table>

            <h2 className="font-bold text-xs uppercase mb-2">Status Bapa (Kandung / Tiri / Angkat)*</h2>
            <table className="w-full border-collapse border border-black mb-6 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">Nama Bapa</td>
                  <td className="border border-black p-2 font-semibold uppercase">{cBapa || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Bapa</td>
                  <td className="border border-black p-2">Masih hidup / Bercerai / Tidak Dapat Dikesan / Meninggal Dunia / Tiada Maklumat *</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status ialah</td>
                  <td className="border border-black p-2">Penjaga Utama / Penjaga Kedua / Tidak Berkenaan *</td>
                </tr>
              </tbody>
            </table>

            <h2 className="font-bold text-xs uppercase mb-2">Status Ibu (Kandung / Tiri / Angkat)*</h2>
            <table className="w-full border-collapse border border-black mb-6 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">Nama Ibu</td>
                  <td className="border border-black p-2 font-semibold uppercase">{cIbu || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Ibu</td>
                  <td className="border border-black p-2">Masih hidup / Bercerai / Tidak Dapat Dikesan / Meninggal Dunia / Tiada Maklumat *</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status ialah</td>
                  <td className="border border-black p-2">Penjaga Utama / Penjaga Kedua / Tidak Berkenaan *</td>
                </tr>
              </tbody>
            </table>

            <div className="text-[10px] text-slate-600 space-y-0.5 mt-6 border-t border-slate-200 pt-2">
              <p>Catatan :</p>
              <p>* Potong mana yang tidak berkenaan.</p>
              <p>** Hubungan dengan anak bagi pengisian selain ibu dan bapa</p>
              <p>*** Bilangan tanggungan isi Rumah tidak termasuk anak yang bekerja</p>
            </div>
            <div className="text-right text-xs mt-6 font-bold">2</div>
          </div>

          {/* ========================================================
              PAGE 4: LAMPIRAN 1 - PROFIL BAPA / PENJAGA UTAMA
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-sans text-[11.5px] leading-snug">
            <h2 className="font-bold text-xs uppercase mb-3">Profil Bapa / Penjaga Utama</h2>

            <table className="w-full border-collapse border border-black mb-6 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">Nama Bapa / Penjaga</td>
                  <td colSpan={3} className="border border-black p-2 font-semibold uppercase">{cBapa || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">ID Pengenalan</td>
                  <td className="border border-black p-2 font-mono font-bold">{cICBapa || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Bapa / Penjaga</td>
                  <td className="border border-black p-2">Kandung / Tiri / Abang *</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Kaum</td>
                  <td className="border border-black p-2">MELAYU</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Agama</td>
                  <td className="border border-black p-2">ISLAM</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Kewarganegaraan</td>
                  <td className="border border-black p-2">Warganegara / Bukan Warganegara *</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Negara Asal</td>
                  <td className="border border-black p-2">MALAYSIA</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Telefon (HP)</td>
                  <td className="border border-black p-2 font-mono">{cTelBapa || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Telefon Rumah</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Kategori Pekerjaan</td>
                  <td colSpan={3} className="border border-black p-2">
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div>• Bekerja Sendiri: Nyatakan: ....................</div>
                      <div>• Kakitangan awam: Nyatakan: ....................</div>
                      <div>• Kakitangan Swasta: Nyatakan: ....................</div>
                      <div>• Tidak Bekerja / Pesara: Nyatakan: ....................</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Nama Majikan</td>
                  <td colSpan={3} className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Alamat Majikan</td>
                  <td colSpan={3} className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Poskod / Bandar</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Negeri / Tel Pejabat</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No Cukai Pendapatan</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Pendapatan Sebulan</td>
                  <td className="border border-black p-2">RM ............................</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tanggungan ***</td>
                  <td colSpan={3} className="border border-black p-2">............ Orang</td>
                </tr>
              </tbody>
            </table>

            <div className="text-[10px] text-slate-600 space-y-0.5 mt-8 border-t border-slate-200 pt-2">
              <p>Catatan :</p>
              <p>* Potong mana yang tidak berkenaan.</p>
              <p>** Hubungan dengan anak bagi pengisian selain ibu dan bapa</p>
              <p>*** Bilangan tanggungan isi Rumah tidak termasuk anak yang bekerja</p>
            </div>
            <div className="text-right text-xs mt-6 font-bold">3</div>
          </div>

          {/* ========================================================
              PAGE 5: LAMPIRAN 1 - PROFIL IBU / PENJAGA KEDUA
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-sans text-[11.5px] leading-snug">
            <h2 className="font-bold text-xs uppercase mb-3">Profil Ibu / Penjaga Kedua</h2>

            <table className="w-full border-collapse border border-black mb-6 text-[11px]">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4 bg-slate-50">Nama Ibu / Isteri / Penjaga</td>
                  <td colSpan={3} className="border border-black p-2 font-semibold uppercase">{cIbu || ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">ID Pengenalan</td>
                  <td className="border border-black p-2 font-mono font-bold">{cICIbu || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Ibu / Penjaga</td>
                  <td className="border border-black p-2">Kandung / Tiri / Kakak *</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Kaum</td>
                  <td className="border border-black p-2">MELAYU</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Agama</td>
                  <td className="border border-black p-2">ISLAM</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Status Kewarganegaraan</td>
                  <td className="border border-black p-2">Warganegara / Bukan Warganegara *</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Negara Asal</td>
                  <td className="border border-black p-2">MALAYSIA</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Telefon (HP)</td>
                  <td className="border border-black p-2 font-mono">{cTelIbu || ''}</td>
                  <td className="border border-black p-2 font-bold bg-slate-50">No. Telefon Rumah</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Kategori Pekerjaan</td>
                  <td colSpan={3} className="border border-black p-2">
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div>• Bekerja Sendiri: Nyatakan: ....................</div>
                      <div>• Kakitangan awam: Nyatakan: ....................</div>
                      <div>• Kakitangan Swasta: Nyatakan: ....................</div>
                      <div>• Tidak Bekerja / Pesara: Nyatakan: ....................</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Nama Majikan</td>
                  <td colSpan={3} className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Alamat Majikan</td>
                  <td colSpan={3} className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Poskod / Bandar</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Negeri / Tel Pejabat</td>
                  <td className="border border-black p-2"></td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">No Cukai Pendapatan</td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2 font-bold bg-slate-50">Pendapatan Sebulan</td>
                  <td className="border border-black p-2">RM ............................</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold bg-slate-50">Tanggungan ***</td>
                  <td colSpan={3} className="border border-black p-2">............ Orang</td>
                </tr>
              </tbody>
            </table>

            <div className="text-[10px] text-slate-600 space-y-0.5 mt-8 border-t border-slate-200 pt-2">
              <p>Catatan :</p>
              <p>* Potong mana yang tidak berkenaan.</p>
              <p>** Hubungan dengan anak bagi pengisian selain ibu dan bapa</p>
              <p>*** Bilangan tanggungan isi Rumah tidak termasuk anak yang bekerja</p>
            </div>
            <div className="text-right text-xs mt-6 font-bold">4</div>
          </div>

          {/* ========================================================
              PAGE 6: LAMPIRAN 2 - BORANG PENGAKUAN PENDAPATAN
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[12.5px] leading-relaxed">
            <div className="text-right font-sans font-bold text-xs mb-1">Lampiran 2</div>

            {/* Jata Negara Logo & Header */}
            <div className="text-center mb-6">
              <img src="/jata-negara.svg" alt="Jata Negara" className="w-16 h-auto mx-auto mb-2 object-contain" />
              <p className="font-bold text-[11px] tracking-wider uppercase">KEMENTERIAN PENDIDIKAN MALAYSIA</p>
              <h1 className="font-bold text-sm sm:text-base mt-2 uppercase tracking-wide">
                BORANG PENGAKUAN PENDAPATAN<br/>BAGI IBU BAPA/ PENJAGA<br/>YANG TIADA GAJI UNTUK TAHUN 2026/2027
              </h1>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex">
                <span className="w-48 font-bold">Nama ibu/bapa/penjaga</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5 font-sans font-semibold uppercase">: {cBapa || cIbu || ''}</span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">No Kad Pengenalan</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5 font-sans font-mono">: {cICBapa || cICIbu || ''}</span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">Nama Murid</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5 font-sans font-semibold uppercase">: {cName}</span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">Nama Sekolah</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5">: SMA Kota Gelanggi 3, 27000 Jerantut, Pahang</span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">Hubungan dengan Murid</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5">: IBU / BAPA / PENJAGA</span>
              </div>
              <div className="flex items-start">
                <span className="w-48 font-bold">Alamat ibu/bapa/penjaga</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5 leading-snug">: {cAddress || ''}</span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">Pekerjaan ibu/bapa/penjaga</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5">: </span>
              </div>
              <div className="flex">
                <span className="w-48 font-bold">Nyatakan Aktiviti Pekerjaan</span>
                <span className="flex-1 border-b border-dotted border-slate-800 pb-0.5">: </span>
              </div>
            </div>

            <p className="mb-8 leading-relaxed">
              Dengan ini saya mengaku bahawa pendapatan purata saya adalah sebanyak <strong>RM .................................</strong> sebulan.
            </p>

            <div className="flex justify-between items-end mb-8 pt-4">
              <div className="text-center w-64">
                <div className="border-b border-slate-800 h-10 mb-1"></div>
                <p>(Tandatangan ibu Bapa/Penjaga)</p>
              </div>
              <div>
                <p>Tarikh : ..........................................</p>
              </div>
            </div>

            <div className="border-t-2 border-slate-900 pt-4">
              <h3 className="font-bold text-xs uppercase mb-2">*PENGESAHAN</h3>
              <p className="text-[12px] mb-6 leading-relaxed">
                Saya dengan ini mengesahkan bahawa pendapatan yang dinyatakan di atas adalah munasabah dan benar berdasarkan pengetahuan saya.
              </p>

              <div className="flex justify-between items-end">
                <div className="space-y-2 text-[12px] flex-1 max-w-sm">
                  <div className="border-b border-slate-800 h-8 mb-1"></div>
                  <p>(Tandatangan)</p>
                  <p>Nama : .....................................................................</p>
                  <p>Jawatan Rasmi : .....................................................</p>
                  <p>Tarikh : .....................................................................</p>
                </div>

                <div className="w-28 h-28 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-wider text-center p-2">
                  Cop Rasmi
                </div>
              </div>

              <p className="text-[10px] italic text-slate-500 mt-4 border-t border-slate-200 pt-1">
                *Pengesahan hendaklah dilakukan oleh Majikan/Jaksa Pendamai/ penghulu/Ketua Kampung/AJK PIBG
              </p>
            </div>
          </div>

          {/* ========================================================
              PAGE 7: LAMPIRAN 3 - SURAT AKUAN IBU BAPA/PENJAGA
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[12px] leading-relaxed">
            <div className="text-right font-sans font-bold text-xs mb-1">Lampiran 3</div>

            <div className="text-center mb-6">
              <img src="/jata-negara.svg" alt="Jata Negara" className="w-16 h-auto mx-auto mb-2 object-contain" />
              <p className="font-bold text-[11px] tracking-wider uppercase">KEMENTERIAN PENDIDIKAN MALAYSIA</p>
              <h1 className="font-bold text-sm sm:text-base mt-1 uppercase tracking-wide">
                SMA KOTA GELANGGI 3<br/>27000 JERANTUT, PAHANG
              </h1>
              <h2 className="font-bold text-xs sm:text-sm mt-3 uppercase tracking-wider underline">
                SURAT AKUAN IBU BAPA/PENJAGA
              </h2>
            </div>

            <p className="mb-4 leading-loose">
              Saya <strong className="border-b border-dotted border-black pb-0.5 px-2">{cBapa || cIbu || '....................................................................................'}</strong> no. K/P <strong className="border-b border-dotted border-black pb-0.5 px-2">{cICBapa || cICIbu || '..........................................'}</strong> Ibu bapa/ penjaga kepada murid bernama <strong className="border-b border-dotted border-black pb-0.5 px-2">{cName || '....................................................................................'}</strong> No K/P <strong className="border-b border-dotted border-black pb-0.5 px-2">{cIC || '..........................................'}</strong> dengan ini:-
            </p>

            <ol className="list-[lower-alpha] space-y-3.5 pl-5 text-[11.5px] leading-relaxed text-justify mb-8">
              <li>
                Bersetuju untuk menukarkan anak/anak jagaan saya ke sekolah harian biasa jika didapati mengidap penyakit kronik/penyakit yang mengganggu kesihatan menyebabkan kesulitan untuk tinggal di asrama.
              </li>
              <li>
                Bersetuju mematuhi jadual sesi persekolahan dan peraturan-peraturan cuti yang ditetapkan oleh Kementerian Pelajaran Malaysia.
              </li>
              <li>
                Bersetuju mewakilkan Pengetua/wakil Pengetua untuk menandatangani bagi pihak diri saya surat keizinan yang diperlukan oleh doktor di mana-mana hospital kerajaan untuk menggunakan ubat bius dan melakukan pembedahan ke atas anak/anak jagaan saya apabila berlaku kecemasan yang memerlukan tindakan serta-merta. Tidak akan membuat sebarang tuntutan terhadap pihak sekolah mahupun Bahagian Pengurusan Sektor Pendidikan Islam selepas pembedahan tersebut.
              </li>
              <li>
                Mengizinkan anak/anak jagaan saya mengambil bahagian dalam sebarang kegiatan dan lawatan sambil belajar yang dianjurkan oleh pihak sekolah, Pejabat Pendidikan Daerah, Jabatan Pendidikan Negeri Pahang, Kementerian Pendidikan Malaysia atau sebarang pertubuhan yang disertai oleh salah satu daripada ketiga-tiga pihak di atas, walaupun dalam masa cuti sekolah serta bersetuju untuk tidak mendakwa pihak sekolah bagi kes kemalangan yang bukan disebabkan oleh kecuaian.
              </li>
              <li>
                Bersetuju untuk menerima arahan ke sekolah harian biasa sekiranya anak-anak jagaan saya tidak mematuhi peraturan sekolah dan asrama yang ditetapkan terutamanya yang melibatkan kes disiplin berat.
              </li>
            </ol>

            <div className="flex justify-between items-end mb-8 pt-2">
              <div className="text-center w-60">
                <div className="border-b border-slate-800 h-8 mb-1"></div>
                <p>(Tandatangan ibu bapa/penjaga)</p>
              </div>
              <div>
                <p>Tarikh: ...........................................</p>
              </div>
            </div>

            <div className="border-t border-slate-400 pt-3">
              <p className="font-bold text-xs mb-1">Disaksikan oleh:</p>
              <p className="text-[11px] text-slate-600 mb-4">(Guru Besar / Pengetua / pegawai Kerajaan Kumpulan A / Penghulu / Ketua Kampung)</p>

              <div className="flex justify-between items-end">
                <div className="space-y-1.5 text-[11.5px] flex-1 max-w-sm">
                  <div className="border-b border-slate-800 h-8 mb-1"></div>
                  <p>(Tandatangan Saksi)</p>
                  <p>Nama: .....................................................................</p>
                  <p>Jawatan: .................................................................</p>
                </div>
                <div>
                  <p>Tarikh: ...........................................</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PAGE 8: LAMPIRAN 4 - SURAT AKU JANJI MURID & PENJAGA
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[12px] leading-relaxed">
            <div className="text-right font-sans font-bold text-xs mb-1">Lampiran 4</div>

            <div className="text-center mb-5">
              <img src="/jata-negara.svg" alt="Jata Negara" className="w-16 h-auto mx-auto mb-2 object-contain" />
              <p className="font-bold text-[11px] tracking-wider uppercase">KEMENTERIAN PENDIDIKAN MALAYSIA</p>
              <h1 className="font-bold text-sm sm:text-base mt-1 uppercase tracking-wide">
                SMA KOTA GELANGGI 3<br/>27000 JERANTUT PAHANG
              </h1>
              <h2 className="font-bold text-xs sm:text-sm mt-3 uppercase tracking-wider underline">
                SURAT AKU JANJI MURID
              </h2>
            </div>

            <div className="mb-3">
              <span className="font-bold">NAMA MURID: </span>
              <strong className="border-b border-dotted border-black pb-0.5 px-2 font-sans uppercase">{cName}</strong>
            </div>

            <p className="text-justify mb-5 leading-relaxed text-[11.5px]">
              Saya yang bernama seperti di atas dengan ini mengaku bahawa saya bersetuju akan mematuhi segala peraturan sekolah/asrama selama saya belajar di sekolah ini. Sekiranya saya melanggar mana-mana peraturan yang telah ditetapkan, saya sanggup dan bersedia menerima sebarang bentuk hukuman yang berkaitan, setimpal dengan kesalahan yang saya telah lakukan. Persetujuan ini dibuat atas kesedaran dan kerelaan hati saya sendiri tanpa desakan atau paksaan mana-mana pihak.
            </p>

            <div className="flex justify-between items-end mb-6">
              <div className="text-center w-56">
                <div className="border-b border-slate-800 h-8 mb-1"></div>
                <p>Tandatangan murid</p>
              </div>
              <div>
                <p>Tarikh : .......................................</p>
              </div>
            </div>

            {/* Pengakuan Penjaga */}
            <div className="border-t-2 border-slate-900 pt-4">
              <h3 className="font-bold text-center text-xs uppercase tracking-wider mb-3 underline">
                PENGAKUAN PENJAGA
              </h3>

              <p className="text-justify mb-5 leading-relaxed text-[11.5px]">
                Saya <strong className="border-b border-dotted border-black pb-0.5 px-2 font-sans">{cBapa || cIbu || '....................................................................................'}</strong> ibu bapa/penjaga kepada <strong className="border-b border-dotted border-black pb-0.5 px-2 font-sans">{cName}</strong> mengakui telah membaca lampiran yang disertakan dan bersetuju menasihati anak/anak jagaan saya supaya mematuhi segala peraturan sekolah/asrama selama belajar di sekolah ini. Sekiranya anak/anak jagaan saya gagal mematuhi mana-mana peraturan yang telah ditetapkan, saya memberi sepenuh kepercayaan kepada pihak sekolah untuk mengendalikan dan menyelesaikan kes disiplin yang melibatkan anak saya termasuk ditukarkan ke sekolah harian.
              </p>

              <div className="flex justify-between items-end">
                <div className="space-y-2 text-[11.5px] flex-1 max-w-sm">
                  <div className="border-b border-slate-800 h-8 mb-1"></div>
                  <p>Tandatangan : ..............................................................</p>
                  <p>Nama : <span className="font-sans font-semibold uppercase">{cBapa || cIbu || '......................................................................'}</span></p>
                  <p>No. K/P : <span className="font-sans font-mono">{cICBapa || cICIbu || '...................................................................'}</span></p>
                </div>
                <div>
                  <p>Tarikh : .......................................</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PAGE 9: SURAT AKUAN KESIHATAN MURID
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[12px] leading-relaxed">
            <h1 className="font-bold text-center text-sm sm:text-base uppercase tracking-wider underline mb-6">
              SURAT AKUAN KESIHATAN MURID
            </h1>

            <div className="mb-4 text-[11.5px] leading-snug">
              <p>Kepada,</p>
              <p className="font-bold">Tuan / Puan Pengetua,</p>
              <p>SMA Kota Gelanggi 3,</p>
              <p>27000 Jerantut,</p>
              <p>Pahang Darul Makmur.</p>
              <p className="text-right mt-1">Tarikh: ................................................</p>
            </div>

            <h2 className="font-bold uppercase tracking-wide text-xs mb-2 underline">AKUAN KESIHATAN PELAJAR</h2>

            <p className="mb-3 text-[11.5px]">Saya dengan ini mengesahkan bahawa pelajar:-</p>

            <div className="space-y-1 mb-4 text-[11.5px]">
              <p>Nama : <strong className="font-sans uppercase border-b border-dotted border-black pb-0.5 px-2">{cName}</strong></p>
              <p>No. K.P : <strong className="font-sans font-mono border-b border-dotted border-black pb-0.5 px-2">{cIC}</strong></p>
            </div>

            <div className="space-y-2 mb-4 text-[11.5px]">
              <div className="flex items-center gap-3">
                <span>1. Sihat</span>
                <div className="w-5 h-5 border-2 border-black"></div>
                <span className="font-bold">atau</span>
              </div>
              <p>2. Menghidap sakit:</p>
            </div>

            <table className="w-full border-collapse border border-black mb-5 text-[11px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-black p-2 w-10 text-center">BIL</th>
                  <th className="border border-black p-2 text-left">Jenis penyakit</th>
                  <th className="border border-black p-2 w-32 text-center">Jika ada tandakan ( / )</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">1</td>
                  <td className="border border-black p-1.5">Kecacatan fizikal/mental</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">2</td>
                  <td className="border border-black p-1.5">Menghidap asma/lelah</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">3</td>
                  <td className="border border-black p-1.5">Penyakit jantung</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">4</td>
                  <td className="border border-black p-1.5">Leukimia</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">5</td>
                  <td className="border border-black p-1.5">Batuk kering</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">6</td>
                  <td className="border border-black p-1.5">Penyakit berjangkit/sawan</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center font-bold">7</td>
                  <td className="border border-black p-1.5">Sakit lain: ........................................................................</td>
                  <td className="border border-black p-1.5 text-center"></td>
                </tr>
              </tbody>
            </table>

            <p className="text-[11.5px] leading-relaxed mb-6">
              Oleh itu pelajar ini <strong>* sesuai / tidak sesuai</strong> tinggal di asrama dan <strong>* boleh / tidak boleh</strong> menyertai aktiviti kokurikulum
            </p>

            <div className="flex justify-between items-end mb-6">
              <div className="space-y-2 text-[11.5px]">
                <div className="border-b border-slate-800 h-8 mb-1 w-64"></div>
                <p>Tandatangan Pegawai Perubatan : ..............................................</p>
              </div>
              <div className="w-24 h-24 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-[9px] text-slate-400 uppercase text-center p-2">
                Cop Rasmi
              </div>
            </div>

            <p className="text-xs font-bold text-red-600 text-center border-t border-red-200 pt-3">
              * Perhatian: Borang kesihatan ini adalah <u>WAJIB</u> di isi dalam tempoh 30 hari
            </p>
          </div>

          {/* ========================================================
              PAGE 10: SENARAI KEPERLUAN KOPERASI TAHUN 2027
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-sans text-[10.5px] leading-tight">
            <h1 className="font-bold text-center text-xs sm:text-sm uppercase tracking-wide mb-3">
              SENARAI KEPERLUAN KOPERASI SMA KOTA GELANGGI 3 TAHUN 2027
            </h1>

            <div className="flex justify-between mb-3 font-semibold text-[11px]">
              <div>Nama : <span className="font-bold uppercase">{cName}</span></div>
              <div>Kelas : <span className="font-bold">TINGKATAN 1</span></div>
            </div>

            <table className="w-full border-collapse border border-black mb-3 text-[10px]">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="border border-black p-1 w-7 text-center">BIL</th>
                  <th className="border border-black p-1 text-left">BARANGAN KOPERASI</th>
                  <th className="border border-black p-1 w-12 text-center">KUANTITI</th>
                  <th className="border border-black p-1 w-14 text-center">LELAKI (RM)</th>
                  <th className="border border-black p-1 w-16 text-center">PEREMPUAN (RM)</th>
                  <th className="border border-black p-1 w-24 text-center">CATATAN BELIAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1">YURAN RM 3 + SYER KOPERASI RM 10</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">13.00</td>
                  <td className="border border-black p-1 text-center">13.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">2</td>
                  <td className="border border-black p-1">FAIL PERIBADI</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">3</td>
                  <td className="border border-black p-1">BUKU PERATURAN SEKOLAH</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">4</td>
                  <td className="border border-black p-1">KAD PENILAIAN KOKURIKULUM</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1 text-center">5.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">5</td>
                  <td className="border border-black p-1">BUKU PETAK KECIL F5</td>
                  <td className="border border-black p-1 text-center">4</td>
                  <td className="border border-black p-1 text-center">4.00</td>
                  <td className="border border-black p-1 text-center">4.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">6</td>
                  <td className="border border-black p-1">KERTAS KAJANG A4</td>
                  <td className="border border-black p-1 text-center">2</td>
                  <td className="border border-black p-1 text-center">6.00</td>
                  <td className="border border-black p-1 text-center">6.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">7</td>
                  <td className="border border-black p-1">BUKU NOTA A4</td>
                  <td className="border border-black p-1 text-center">10</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">8</td>
                  <td className="border border-black p-1">LENCANA</td>
                  <td className="border border-black p-1 text-center">5</td>
                  <td className="border border-black p-1 text-center">4.00</td>
                  <td className="border border-black p-1 text-center">4.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">9</td>
                  <td className="border border-black p-1">TANDA NAMA</td>
                  <td className="border border-black p-1 text-center">4</td>
                  <td className="border border-black p-1 text-center">10.00</td>
                  <td className="border border-black p-1 text-center">10.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">10</td>
                  <td className="border border-black p-1">TALI LEHER</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">15.00</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">11</td>
                  <td className="border border-black p-1">CADAR DAN SARUNG BANTAL</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">12</td>
                  <td className="border border-black p-1">SELIMUT ASRAMA</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1 text-center">30.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">13</td>
                  <td className="border border-black p-1">T-SHIRT KOKURIKULUM</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">35.00</td>
                  <td className="border border-black p-1 text-center">45.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">14</td>
                  <td className="border border-black p-1">T-SHIRT ASRAMA</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">35.00</td>
                  <td className="border border-black p-1 text-center">45.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">15</td>
                  <td className="border border-black p-1">T-SHIRT RUMAH SUKAN</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">35.00</td>
                  <td className="border border-black p-1 text-center">45.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">16</td>
                  <td className="border border-black p-1">JUBAH SEKOLAH PUTIH (L)</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">65.00</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">17</td>
                  <td className="border border-black p-1">JUBAH SEKOLAH HITAM (P)</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1 text-center">65.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">18</td>
                  <td className="border border-black p-1">KAIN BATIK 2 METER (L)</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">40.00</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">19</td>
                  <td className="border border-black p-1">KAIN BATIK 4 METER (P)</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1 text-center">80.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr>
                  <td className="border border-black p-1 text-center">20</td>
                  <td className="border border-black p-1">SERBAN</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">10.00</td>
                  <td className="border border-black p-1 text-center">-</td>
                  <td className="border border-black p-1"></td>
                </tr>
                <tr className="font-bold bg-slate-100">
                  <td colSpan={3} className="border border-black p-1 text-right">JUMLAH (RM)</td>
                  <td className="border border-black p-1 text-center font-bold">RM 347.00</td>
                  <td className="border border-black p-1 text-center font-bold">RM 387.00</td>
                  <td className="border border-black p-1"></td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-1.5 text-[10px] mb-3">
              <p>1. Sila bawa slip ini semasa hari pendaftaran untuk semakan Guru Kelas dan Koperasi.</p>
              <p>2. Bayaran boleh dibuat secara <strong>TUNAI</strong> atau <strong>TRANSFER ONLINE</strong> melalui akaun <strong>BANK ISLAM</strong>:</p>

              <div className="bg-slate-50 border border-slate-400 p-2 text-center rounded my-1 font-sans">
                <p className="font-bold text-[11px]">KOPERASI SEKOLAH MENENGAH AGAMA KOTA GELANGGI 3 :</p>
                <p className="text-sm font-extrabold font-mono text-emerald-800 tracking-wider">06055010032458</p>
                <p className="text-[10px] text-slate-600">Reference : Nama Pelajar ({cName})</p>
              </div>

              <p>3. Sila hantar bukti pembayaran ke nombor <strong>019-4156209 (Cik Nor Atikah)</strong></p>
            </div>

            <div className="border-t border-dashed border-slate-500 pt-2 text-[9.5px]">
              <p className="text-center italic mb-2">------------------------------------------- (untuk kegunaan koperasi sahaja) -------------------------------------------</p>
              <div className="flex justify-between">
                <div>Jumlah Belian (RM) : ................................</div>
                <div>Jumlah Bayaran (RM): ................................</div>
                <div>Status : Selesai / Belum Selesai (Baki : ..........................)</div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PAGE 11: PERINGATAN MEMBAWA BARANG-BARANG LARANGAN
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[12px] leading-relaxed">
            {/* Header Sekolah */}
            <div className="flex items-start gap-4 border-b-2 border-slate-900 pb-3 mb-6">
              <img src="/jata-negara.svg" alt="Jata Negara" className="w-16 h-auto object-contain shrink-0" />
              <div className="flex-1">
                <h1 className="font-bold text-sm sm:text-base uppercase tracking-wider text-slate-900">SMA KOTA GELANGGI 3</h1>
                <p className="text-xs">27000 JERANTUT, PAHANG DARUL MAKMUR</p>
                <p className="text-[11px] text-slate-600">Tel: 09-2051555 | E-MEL: cft2001@moe.edu.my</p>
              </div>
            </div>

            <div className="flex justify-between items-start text-[11.5px] mb-6">
              <div>
                <p>Kepada,</p>
                <p className="font-bold">Semua ibu, bapa dan Penjaga Murid,</p>
                <p>SMA Kota Gelanggi 3,</p>
                <p>27000 Jerantut, Pahang.</p>
              </div>
              <div className="text-right">
                <p>Rujukan Kami: SMAKG03.700-2/1/1( )</p>
                <p>Tarikh: 03 Januari 2027</p>
              </div>
            </div>

            <p className="mb-2">Tuan / Puan,</p>

            <h2 className="font-bold text-xs uppercase tracking-wide underline mb-4">
              PERINGATAN MEMBAWA BARANG-BARANG LARANGAN KE SEKOLAH DAN ASRAMA
            </h2>

            <p className="mb-3 text-justify">
              Saya dengan segala hormatnya merujuk kepada perkara di atas.
            </p>

            <p className="mb-3 text-justify">
              2. Adalah dimaklumkan bahawa pengurusan disiplin murid di sekolah memang menjadi agenda utama sekolah agar disiplin murid yang tinggi dapat menjana kecemerlangan sahsiah dan akademik murid.
            </p>

            <p className="mb-3 text-justify">
              3. Sehubungan dengan itu, terdapat kes-kes yang mana murid-murid telah membawa barang larangan ke sekolah khususnya di asrama. Bersama surat ini diedarkan senarai barang-barang Larangan ke sekolah dan asrama.
            </p>

            <p className="mb-3 text-justify">
              4. Seperkara lagi, Surat Pekeliling Ikhtisas Bil. 2/2009 yang menyatakan tentang Penguatkuasaan Larangan Membawa Dan Menggunakan Telefon Bimbit Oleh Murid Di Sekolah, No. Rujukan : KP(BS-Dsr) 201/002/1 Jld.2 (2) bertarikh 25 Mac 2009 dirujuk dan dilampirkan bersama surat ini. Peraturan ini dikuatkuasakan oleh pihak sekolah dan asrama bagi mengelakkan pelbagai masalah disiplin yang timbul seperti kes kecurian, penyalahgunaan semasa pengajaran pembelajaran serta penyebaran bahan-bahan maklumat yang boleh mempengaruhi perlakuan yang negatif dalam kalangan murid sekolah.
            </p>

            <p className="mb-6 text-justify">
              5. Oleh itu, pihak sekolah meminta agar semua ibu bapa/penjaga dapat memberikan kerjasama dan komitmen dalam menjayakan pelaksanaan peraturan yang telah ditetapkan oleh pihak sekolah dan Kementerian Pendidikan.
            </p>

            <p className="mb-4">Sekian, untuk makluman dan tindakan pihak tuan/puan, terima kasih.</p>

            <div className="font-bold mb-6 text-[11px] space-y-0.5">
              <p>“MALAYSIA MADANI”</p>
              <p>“BERKHIDMAT UNTUK NEGARA”</p>
            </div>

            <p className="mb-2">Saya yang menjalankan amanah,</p>

            {/* Signature Pengetua */}
            <div className="w-32 h-14 relative my-1">
              <img src={sigPengetua} alt="Tandatangan Pengetua" className="h-full object-contain" />
            </div>

            <div className="font-bold text-[11.5px] uppercase">
              <p>(JUITA BINTI HAMZAH)</p>
              <p className="font-normal text-slate-700">Pengetua</p>
              <p className="font-normal text-slate-700">SMA Kota Gelanggi 3</p>
            </div>
          </div>

          {/* ========================================================
              PAGE 12: LAMPIRAN A - SENARAI BARANG LARANGAN & PANDUAN
             ======================================================== */}
          <div className="print-page bg-white p-6 sm:p-8 print:p-0 shadow-lg print:shadow-none text-slate-900 relative font-serif text-[11px] leading-relaxed">
            <div className="text-right font-sans font-bold text-xs mb-1">Lampiran A</div>

            <h1 className="font-bold text-center text-xs sm:text-sm uppercase tracking-wide underline mb-5">
              SENARAI BARANG LARANGAN DAN PANDUAN PENJAGAAN HARTA BENDA
            </h1>

            <h2 className="font-bold text-xs uppercase underline mb-2">BARANG LARANGAN</h2>

            <div className="mb-4">
              <p className="font-semibold mb-1">a. Barang-barang berikut adalah <u>DILARANG</u> dibawa ke sekolah atau asrama:</p>
              <ol className="list-[lower-roman] pl-6 space-y-0.5 text-justify">
                <li>Televisyen, radio walkman, MP4 dan discman, telefon bimbit, kamera termasuk charger, SIM card, cerek elektrik, heater dan lain-lain aksesori berkaitan.</li>
                <li>Rokok / mancis/ pemetik api.</li>
                <li>Gula-gula getah (chewing gum)</li>
                <li>Minuman keras</li>
                <li>Barang kemas</li>
                <li>Pakaian yang menjolok mata</li>
                <li>Baju / seluar jeans</li>
                <li>BajuT ala rockers / berlambang jenama rokok/ /tulisan berunsur negatif.</li>
                <li>Minuman keras</li>
                <li>Buku /majalah / risalah / gambar / CD /VCD berunsur lucah / novel berunsur seram@ percintaan@ fahaman agama/politik melampau dan tidak ilmiah.</li>
                <li>Komputer riba.</li>
                <li>Risalah perkauman dan politik</li>
                <li>Benda-benda tajam dan berbahaya.</li>
                <li>Makanan ‘junk food’</li>
                <li>Bahan letupan.</li>
                <li>Barang-barang lain yang disifatkan oleh Pengetua tidak perlu dan membahayakan keselamatan pelajar.</li>
                <li>Permainan daun terup</li>
              </ol>
            </div>

            <p className="mb-4 text-justify font-semibold">
              b. Barang-barang larangan yang dirampas oleh pihak sekolah <u>HANYA</u> dipulangkan kepada IBU, BAPA dan PENJAGA pelajar sahaja.
            </p>

            <h2 className="font-bold text-xs uppercase underline mb-2">HARTA PERSENDIRIAN DAN PENJAGAAN</h2>

            <ol className="list-[lower-alpha] pl-5 space-y-1 mb-6 text-justify">
              <li>Menjadi tanggungjawab setiap pelajar menjaga harta benda milik masing-masing.</li>
              <li>Buku-buku persendirian, pakaian atau apa juga barangan hak milik pelajar hendaklah ditulis nama sendiri dan dijaga dengan cermat, bersih dan sempurna.</li>
              <li>Wang atau barang berharga tidak boleh ditinggalkan di dalam kelas, kamar atau tempat-tempat yang terbuka.</li>
              <li>Pelajar hanya dibenar menyimpan sebanyak <strong>RM 50.00</strong> pada satu satu masa.</li>
              <li>Sebarang wang atau barang-barang lain yang dijumpai hendaklah diserahkan kepada pengawas, guru bertugas harian atau warden untuk diumumkan dan dipulangkan kepada pemiliknya.</li>
              <li>Sebarang kes kehilangan hendaklah dilaporkan kepada Guru Bertugas atau Warden bertugas dengan segera.</li>
            </ol>

            <div className="pt-2">
              <p className="mb-1">Disahkan oleh,</p>
              <div className="w-32 h-14 relative my-1">
                <img src={sigPengetua} alt="Tandatangan Pengetua" className="h-full object-contain" />
              </div>
              <div className="font-bold text-[11.5px] uppercase">
                <p>(JUITA BINTI HAMZAH)</p>
                <p className="font-normal text-slate-700">Pengetua</p>
                <p className="font-normal text-slate-700">SMA Kota Gelanggi 3</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .printable-area {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-page {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            min-height: auto !important;
            max-height: 280mm !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}} />
    </div>,
    document.body
  );
}

import React from 'react';
import { Candidate } from '../../types';
import { Printer, XCircle } from 'lucide-react';

export function BorangPukalCetakPDF({ candidates, onClose }: { candidates: Candidate[], onClose: () => void }) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 flex justify-center overflow-y-auto p-4 sm:p-8 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl flex flex-col relative my-auto max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-100 p-4 sm:p-6 rounded-t-2xl border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 print:hidden">
            <div>
               <h2 className="text-xl font-bold text-slate-800">Cetak Pukal Borang Permohonan</h2>
               <p className="text-sm text-slate-500">Menyediakan {candidates.length} borang untuk dicetak</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
                    <Printer className="w-5 h-5" /> Cetak Sekarang
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                    <XCircle className="w-8 h-8" />
                </button>
            </div>
        </div>

        {/* Print Content Area */}
        <div className="overflow-y-auto" id="printable-pukal-area">
          {candidates.map((candidate, index) => (
            <div key={candidate.id} className="p-4 sm:p-6 print:p-0 w-full max-w-4xl mx-auto printable-page font-sans text-[11px] print:text-[10px] break-after-page text-black bg-white relative">
              {/* HEADER */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">BORANG PERMOHONAN KEMASUKAN</h1>
                <p className="text-slate-600 font-medium">Sistem Permohonan Sekolah</p>
              </div>

              <div className="grid grid-cols-4 gap-8">
                  {/* BUTIRAN */}
                  <div className="col-span-3">
                      <section>
                        <h3 className="bg-slate-100 p-1.5 font-bold text-slate-800 uppercase text-[11px] print:text-[10px] border-l-4 border-slate-800 mb-2 print:mb-1">A. Butiran Pemohon</h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div className="col-span-2">
                                <span className="block text-slate-500 font-medium text-xs">Nama Penuh</span>
                                <span className="font-bold text-slate-900 uppercase">{candidate.name}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">No. Kad Pengenalan</span>
                                <span className="font-bold text-slate-900">{candidate.ic}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">Tarikh Lahir</span>
                                <span className="font-bold text-slate-900">{candidate.tarikhLahir || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">Jantina</span>
                                <span className="font-bold text-slate-900 uppercase">{candidate.jantina || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 font-medium text-xs">Tempat Lahir</span>
                                <span className="font-bold text-slate-900 uppercase">{candidate.tempatLahir || '-'}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-slate-500 font-medium text-xs">Alamat</span>
                                <span className="font-bold text-slate-900 uppercase">{candidate.alamat1} {candidate.alamat2}, {candidate.poskod} {candidate.daerah}, {candidate.negeri}</span>
                            </div>
                        </div>
                      </section>
                  </div>

                  {/* GAMBAR */}
                  <div className="col-span-1">
                      <div className="w-full aspect-[3/4] border-2 border-slate-300 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
                         {candidate.gambarUrl ? (
                             <img src={candidate.gambarUrl} alt="Gambar Calon" className="w-full h-full object-cover" />
                         ) : (
                             <span className="text-xs text-slate-400 font-medium text-center px-4">Tiada Gambar</span>
                         )}
                      </div>
                  </div>
               </div>
               
               {/* KELUARGA */}
               <section className="mt-4 print:mt-2">
                    <h3 className="bg-slate-100 p-1.5 font-bold text-slate-800 uppercase text-[11px] print:text-[10px] border-l-4 border-slate-800 mb-2 print:mb-1">B. Maklumat Ibu Bapa / Penjaga</h3>
                    <div className="grid grid-cols-2 gap-4 text-[11px] print:text-[10px]">
                        <div>
                            <span className="block font-black text-slate-900 border-b border-slate-200 pb-1 mb-1">BAPA / PENJAGA</span>
                            <div className="space-y-1">
                                <div><span className="block text-slate-500 text-xs">Nama</span> <span className="font-bold uppercase">{candidate.namaBapa || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">No. Kad Pengenalan</span> <span className="font-bold">{candidate.icBapa || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">No. Telefon</span> <span className="font-bold">{candidate.telefonBapa || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">Pekerjaan</span> <span className="font-bold uppercase">{candidate.pekerjaanBapa || '-'}</span></div>
                            </div>
                        </div>
                        <div>
                            <span className="block font-black text-slate-900 border-b border-slate-200 pb-1 mb-1">IBU</span>
                            <div className="space-y-1">
                                <div><span className="block text-slate-500 text-xs">Nama</span> <span className="font-bold uppercase">{candidate.namaIbu || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">No. Kad Pengenalan</span> <span className="font-bold">{candidate.icIbu || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">No. Telefon</span> <span className="font-bold">{candidate.telefonIbu || '-'}</span></div>
                                <div><span className="block text-slate-500 text-xs">Pekerjaan</span> <span className="font-bold uppercase">{candidate.pekerjaanIbu || '-'}</span></div>
                            </div>
                        </div>
                    </div>
               </section>

               {/* AKADEMIK */}
               <section>
                    <h3 className="bg-slate-100 p-1.5 font-bold text-slate-800 uppercase text-[11px] print:text-[10px] border-l-4 border-slate-800 mb-2 print:mb-1 mt-6">C. Maklumat Akademik</h3>
                    <div className="grid grid-cols-2 gap-4 text-[11px] print:text-[10px]">
                        <div>
                            <span className="block text-slate-500 font-bold mb-2">PBD (Akhir Tahun Darjah 5)</span>
                            <ul className="space-y-1">
                                <li>BM: <span className="font-bold">{candidate.pbd?.bm || '-'}</span></li>
                                <li>BI: <span className="font-bold">{candidate.pbd?.bi || '-'}</span></li>
                                <li>Math: <span className="font-bold">{candidate.pbd?.matematik || '-'}</span></li>
                                <li>Sains: <span className="font-bold">{candidate.pbd?.sains || '-'}</span></li>
                            </ul>
                        </div>
                        <div>
                            <span className="block text-slate-500 font-bold mb-2">PBD (Pertengahan Darjah 6)</span>
                            <ul className="space-y-1">
                                <li>BM: <span className="font-bold">{candidate.pbdD6?.bm || '-'}</span></li>
                                <li>BI: <span className="font-bold">{candidate.pbdD6?.bi || '-'}</span></li>
                                <li>Math: <span className="font-bold">{candidate.pbdD6?.matematik || '-'}</span></li>
                                <li>Sains: <span className="font-bold">{candidate.pbdD6?.sains || '-'}</span></li>
                            </ul>
                        </div>
                        <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <span className="block text-slate-500 font-bold mb-2">Keputusan UPKK</span>
                            <ul className="grid grid-cols-2 gap-2">
                                <li>Al-Quran: <span className="font-bold">{candidate.upkk?.alquran || '-'}</span></li>
                                <li>Akidah: <span className="font-bold">{candidate.upkk?.akidah || '-'}</span></li>
                                <li>Sirah: <span className="font-bold">{candidate.upkk?.sirah || '-'}</span></li>
                                <li>Adab: <span className="font-bold">{candidate.upkk?.adab || '-'}</span></li>
                                <li>Jawi & Khat: <span className="font-bold">{candidate.upkk?.jawikhat || '-'}</span></li>
                                <li>Bahasa Arab: <span className="font-bold">{candidate.upkk?.bahasaarab || '-'}</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

               {/* PENGESAHAN */}
               <section className="mt-4 print:mt-2">
                    <h3 className="bg-slate-100 p-1.5 font-bold text-slate-800 uppercase text-[11px] print:text-[10px] border-l-4 border-slate-800 mb-2 print:mb-1">D. Pengesahan</h3>
                    <div className="p-2 border-2 border-slate-200 rounded-lg text-xs print:text-[10px] text-slate-700 text-justify">
                        Saya mengesahkan bahawa segala maklumat yang diberikan di dalam borang ini adalah benar dan tepat. Saya memahami bahawa permohonan ini boleh dibatalkan sekiranya terdapat maklumat palsu.
                        <div className="mt-4 print:mt-2 grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="border-b-2 border-slate-400 w-48 mx-auto mb-2"></div>
                                <span className="block font-bold">Tandatangan Pemohon</span>
                            </div>
                            <div>
                                <div className="border-b-2 border-slate-400 w-48 mx-auto mb-2"></div>
                                <span className="block font-bold">Tandatangan Ibu Bapa / Penjaga</span>
                            </div>
                        </div>
                    </div>
               </section>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm;
          transform: scale(0.90);
          transform-origin: top center; }
          body * { visibility: hidden !important; }
          
          .fixed.inset-0 { 
             position: absolute !important; 
             left: 0 !important;
             top: 0 !important;
             overflow: visible !important;
             background: transparent !important;
             height: auto !important;
             min-height: 100% !important;
             display: block !important;
             padding: 0 !important;
          }
          
          .bg-white.max-w-4xl.w-full {
             display: block !important;
             box-shadow: none !important;
             max-width: none !important;
             width: 100% !important;
             margin: 0 !important;
             border-radius: 0 !important;
          }
          
          .max-h-\[90vh\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          #printable-pukal-area, #printable-pukal-area * { visibility: visible !important; }
          #printable-pukal-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          
          .printable-page {
             box-sizing: border-box;
             /* Remove fixed height to prevent blank extra pages */
          }
          
          .break-after-page { 
             page-break-after: always !important; 
             break-after: page !important;
          }
          .break-after-page:last-child { 
             page-break-after: auto !important; 
             break-after: auto !important;
          }
        }
      `}} />
    </div>
  );
}

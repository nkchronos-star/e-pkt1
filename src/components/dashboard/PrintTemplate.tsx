import React from 'react';
import { Candidate } from '../../types';

export default function PrintTemplate({ candidate }: { candidate: Partial<Candidate> }) {
  return (
    <div className="bg-white text-black p-4 sm:p-8 print:p-0 font-sans">
       <div className="text-center border-b-[3px] border-black pb-4 mb-6 print:mb-4">
          <h1 className="text-2xl print:text-xl font-bold uppercase tracking-wide">Borang Permohonan Kemasukan</h1>
          <p className="text-sm print:text-[11px] mt-1 text-gray-700">Sistem Permohonan Sekolah</p>
       </div>
       
       {/* Section A */}
       <div className="mb-6 print:mb-4 relative">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-5 bg-blue-900"></div>
             <h2 className="font-bold text-sm print:text-xs uppercase">A. Butiran Pemohon</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-y-4 print:gap-y-2 gap-x-4 text-sm print:text-[11px]">
             <div className="col-span-2">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Nama Penuh</div>
                <div className="font-bold uppercase">{candidate.name || candidate.name || '-'}</div>
             </div>
             <div className="col-span-1 row-span-4 flex justify-end">
                {candidate.gambarUrl ? (
                   <img src={candidate.gambarUrl} alt="Passport" className="w-24 h-32  object-cover border border-gray-300" style={{ width: '90px', height: '120px' }} />
                ) : (
                   <div className="border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 text-xs" style={{ width: '90px', height: '120px' }}>Gambar</div>
                )}
             </div>
             
             <div className="col-span-1">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">No. Kad Pengenalan</div>
                <div className="font-bold">{candidate.ic || candidate.ic || '-'}</div>
             </div>
             <div className="col-span-1">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Tarikh Lahir</div>
                <div className="font-bold">{candidate.tarikhLahir || '-'}</div>
             </div>
             
             <div className="col-span-1">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Jantina</div>
                <div className="font-bold uppercase">{candidate.jantina || '-'}</div>
             </div>
             <div className="col-span-1">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Tempat Lahir</div>
                <div className="font-bold uppercase">{candidate.tempatLahir || '-'}</div>
             </div>
             
             <div className="col-span-2 mt-2 print:mt-1">
                <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Alamat</div>
                <div className="font-bold uppercase">{candidate.alamat1 || '-'} {candidate.alamat2 || ''}, {candidate.poskod || ''} {candidate.daerah || ''}, {candidate.negeri || ''}</div>
             </div>
          </div>
       </div>

       {/* Section B */}
       <div className="mb-6 print:mb-4">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-5 bg-blue-900"></div>
             <h2 className="font-bold text-sm print:text-xs uppercase">B. Maklumat Ibu Bapa / Penjaga</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-8 print:gap-4 text-sm print:text-[11px]">
             <div>
                <div className="font-bold text-xs print:text-[10px] mb-3 bg-gray-100 p-1">BAPA / PENJAGA</div>
                <div className="space-y-3 print:space-y-2">
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Nama</div>
                      <div className="font-bold uppercase">{candidate.namaBapa || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">No. Kad Pengenalan</div>
                      <div className="font-bold">{candidate.icBapa || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">No. Telefon</div>
                      <div className="font-bold">{candidate.telefonBapa || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Pekerjaan</div>
                      <div className="font-bold uppercase">{candidate.pekerjaanBapa || '-'}</div>
                   </div>
                </div>
             </div>
             <div>
                <div className="font-bold text-xs print:text-[10px] mb-3 bg-gray-100 p-1">IBU</div>
                <div className="space-y-3 print:space-y-2">
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Nama</div>
                      <div className="font-bold uppercase">{candidate.namaIbu || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">No. Kad Pengenalan</div>
                      <div className="font-bold">{candidate.icIbu || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">No. Telefon</div>
                      <div className="font-bold">{candidate.telefonIbu || '-'}</div>
                   </div>
                   <div>
                      <div className="text-gray-500 text-xs print:text-[10px] mb-0.5">Pekerjaan</div>
                      <div className="font-bold uppercase">{candidate.pekerjaanIbu || '-'}</div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Section C */}
       <div className="mb-6 print:mb-4">
           <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-5 bg-blue-900"></div>
             <h2 className="font-bold text-sm print:text-xs uppercase">C. Maklumat Akademik</h2>
          </div>
          
           <div className="grid grid-cols-2 gap-8 print:gap-4 text-sm print:text-[11px] mb-4 print:mb-3">
               <div>
                   <p className="text-gray-500 text-xs print:text-[10px] mb-2">PBD (Akhir Tahun Darjah 5)</p>
                   <div className="space-y-1">
                       <div>BM: <span className="font-bold">{candidate.pbd?.bm || '-'}</span></div>
                       <div>BI: <span className="font-bold">{candidate.pbd?.bi || '-'}</span></div>
                       <div>Math: <span className="font-bold">{candidate.pbd?.matematik || '-'}</span></div>
                       <div>Sains: <span className="font-bold">{candidate.pbd?.sains || '-'}</span></div>
                   </div>
               </div>
               <div>
                   <p className="text-gray-500 text-xs print:text-[10px] mb-2">PBD (Pertengahan Darjah 6)</p>
                   <div className="space-y-1">
                       <div>BM: <span className="font-bold">{candidate.pbdD6?.bm || '-'}</span></div>
                       <div>BI: <span className="font-bold">{candidate.pbdD6?.bi || '-'}</span></div>
                       <div>Math: <span className="font-bold">{candidate.pbdD6?.matematik || '-'}</span></div>
                       <div>Sains: <span className="font-bold">{candidate.pbdD6?.sains || '-'}</span></div>
                   </div>
               </div>
           </div>
           
           <div>
               <p className="text-gray-500 text-xs print:text-[10px] mb-2">Keputusan UPKK</p>
               <div className="grid grid-cols-2 gap-x-8 print:gap-x-4 gap-y-2 print:gap-y-1 text-sm print:text-[11px]">
                   <div>Al-Quran: <span className="font-bold">{candidate.upkk?.alquran || '-'}</span></div>
                   <div>Akidah: <span className="font-bold">{candidate.upkk?.akidah || '-'}</span></div>
                   <div>Sirah: <span className="font-bold">{candidate.upkk?.sirah || '-'}</span></div>
                   <div>Adab: <span className="font-bold">{candidate.upkk?.adab || '-'}</span></div>
                   <div>Jawi & Khat: <span className="font-bold">{candidate.upkk?.jawikhat || '-'}</span></div>
                   <div>Bahasa Arab: <span className="font-bold">{candidate.upkk?.bahasaarab || '-'}</span></div>
                   <div>Ibadah: <span className="font-bold">{candidate.upkk?.ibadah || '-'}</span></div>
                   <div>Penghayatan Islam: <span className="font-bold">{candidate.upkk?.penghayatancarahidupislam || '-'}</span></div>
                   <div>Amali Solat: <span className="font-bold">{candidate.upkk?.amalisolat || '-'}</span></div>
               </div>
           </div>
       </div>

       {/* Section D */}
       <div className="mt-8 print:mt-6">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-5 bg-blue-900"></div>
             <h2 className="font-bold text-sm print:text-xs uppercase">D. Pengesahan</h2>
          </div>
          <div className="border border-gray-200 p-4 print:p-3 text-sm print:text-[10px] text-gray-700 leading-relaxed mb-12 print:mb-8">
             Saya mengesahkan bahawa segala maklumat yang diberikan di dalam borang ini adalah benar dan tepat. Saya memahami bahawa permohonan ini boleh dibatalkan sekiranya terdapat maklumat palsu.
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-center text-sm print:text-[11px]">
             <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">Tandatangan Pemohon</div>
             </div>
             <div>
                <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">Tandatangan Ibu Bapa / Penjaga</div>
             </div>
          </div>
       </div>
    </div>
  );
}

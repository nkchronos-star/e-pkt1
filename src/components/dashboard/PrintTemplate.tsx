import React from 'react';
import { Candidate } from '../../types';

export default function PrintTemplate({ candidate }: { candidate: Partial<Candidate> }) {
  return (
    <div className="bg-white text-slate-800 p-4 sm:p-8 print:pt-0 print:px-2 print:pb-0">
       <div className="text-center border-b-2 border-slate-800 pb-4 print:pb-2 mb-6 print:mb-3">
          <h1 className="text-2xl print:text-lg font-extrabold uppercase">Borang Permohonan Kemasukan</h1>
          <p className="text-sm print:text-[10px] font-medium mt-1">Salinan Permohonan Calon</p>
       </div>
       
       <div className="flex gap-6 print:gap-4 mb-6 print:mb-3 items-start">
          {candidate.gambarUrl ? (
             <img src={candidate.gambarUrl} alt="Passport" className="w-24 h-32 print:w-20 print:h-28 object-cover border border-slate-300" />
          ) : (
             <div className="w-24 h-32 print:w-20 print:h-28 border border-slate-300 flex items-center justify-center text-xs text-slate-400 bg-slate-50">Tiada Gambar</div>
          )}
          <div className="flex-1 grid grid-cols-2 gap-y-2 print:gap-y-1 gap-x-4 print:gap-x-2 text-sm print:text-[10px]">
             <div className="col-span-2 font-bold text-base print:text-sm mb-2 print:mb-1">{candidate.name || candidate.studentName || '-'}</div>
             <div><strong>No. Kad Pengenalan:</strong> {candidate.ic || candidate.icNumber || '-'}</div>
             <div><strong>No. Sijil Lahir:</strong> {candidate.noSijilLahir || '-'}</div>
             <div><strong>Tarikh Lahir:</strong> {candidate.tarikhLahir || '-'}</div>
             <div><strong>Tempat Lahir:</strong> {candidate.tempatLahir || '-'}</div>
             <div><strong>Jantina:</strong> {candidate.jantina || '-'}</div>
             <div className="col-span-2"><strong>Asal Sekolah:</strong> {candidate.namaSekolahRendah || '-'}</div>
             <div className="col-span-2"><strong>Alamat:</strong> {candidate.alamat1 || '-'} {candidate.alamat2 || ''}, {candidate.poskod || ''} {candidate.daerah || ''}, {candidate.negeri || ''}</div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4 sm:gap-8 print:gap-4 mb-6 print:mb-3 text-sm print:text-[10px]">
          <div>
             <h3 className="font-bold border-b border-slate-200 pb-2 print:pb-1 mb-2 print:mb-1 uppercase text-xs print:text-[10px] tracking-wider">Maklumat Bapa</h3>
             <div className="space-y-1">
                <div><strong>Nama:</strong> {candidate.namaBapa || '-'}</div>
                <div><strong>No. KP:</strong> {candidate.icBapa || '-'}</div>
                <div><strong>No. Tel:</strong> {candidate.telefonBapa || '-'}</div>
                <div><strong>Pekerjaan:</strong> {candidate.pekerjaanBapa || '-'}</div>
             </div>
          </div>
          <div>
             <h3 className="font-bold border-b border-slate-200 pb-2 print:pb-1 mb-2 print:mb-1 uppercase text-xs print:text-[10px] tracking-wider">Maklumat Ibu</h3>
             <div className="space-y-1">
                <div><strong>Nama:</strong> {candidate.namaIbu || '-'}</div>
                <div><strong>No. KP:</strong> {candidate.icIbu || '-'}</div>
                <div><strong>No. Tel:</strong> {candidate.telefonIbu || '-'}</div>
                <div><strong>Pekerjaan:</strong> {candidate.pekerjaanIbu || '-'}</div>
             </div>
          </div>
       </div>

       <div className="mb-6 print:mb-3 text-sm print:text-[10px]">
           <h3 className="font-bold border-b border-slate-200 pb-2 print:pb-1 mb-2 print:mb-1 uppercase text-xs print:text-[10px] tracking-wider">Keputusan PBD & UPKK</h3>
           <div className="grid grid-cols-2 gap-4">
               <div>
                   <p className="font-bold mb-1">PBD Akhir Tahun Darjah 5</p>
                   <ul className="list-disc list-inside text-xs print:text-[10px]">
                       <li>Bahasa Melayu: {candidate.pbd?.bm || '-'}</li>
                       <li>Bahasa Inggeris: {candidate.pbd?.bi || '-'}</li>
                       <li>Matematik: {candidate.pbd?.matematik || '-'}</li>
                       <li>Sains: {candidate.pbd?.sains || '-'}</li>
                   </ul>
               </div>
               <div>
                   <p className="font-bold mb-1">PBD Pertengahan Darjah 6</p>
                   <ul className="list-disc list-inside text-xs print:text-[10px]">
                       <li>Bahasa Melayu: {candidate.pbdD6?.bm || '-'}</li>
                       <li>Bahasa Inggeris: {candidate.pbdD6?.bi || '-'}</li>
                       <li>Matematik: {candidate.pbdD6?.matematik || '-'}</li>
                       <li>Sains: {candidate.pbdD6?.sains || '-'}</li>
                   </ul>
               </div>
           </div>
           <div className="mt-4 print:mt-2">
               <p className="font-bold mb-1">UPKK</p>
               <ul className="grid grid-cols-2 gap-x-4 print:gap-x-2 gap-y-1 text-xs print:text-[10px]">
                   <li>Al-Quran: {candidate.upkk?.alquran || '-'}</li>
                   <li>Akidah: {candidate.upkk?.akidah || '-'}</li>
                   <li>Sirah: {candidate.upkk?.sirah || '-'}</li>
                   <li>Adab: {candidate.upkk?.adab || '-'}</li>
                   <li>Jawi & Khat: {candidate.upkk?.jawikhat || '-'}</li>
                   <li>Bahasa Arab: {candidate.upkk?.bahasaarab || '-'}</li>
                   <li>Ibadah: {candidate.upkk?.ibadah || '-'}</li>
                   <li>Penghayatan Islam: {candidate.upkk?.penghayatancarahidupislam || '-'}</li>
                   <li>Amali Solat: {candidate.upkk?.amalisolat || '-'}</li>
               </ul>
           </div>
       </div>

       <div className="text-center pt-4 print:pt-2 border-t mt-4 print:mt-2 border-slate-200 text-xs print:text-[10px] text-slate-500">
          <p>Borang ini dijana oleh komputer. Sila bawa salinan ini semasa temuduga (jika terpilih).</p>
       </div>
    </div>
  );
}

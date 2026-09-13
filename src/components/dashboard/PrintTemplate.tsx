import React from 'react';
import { Candidate } from '../../types';

export default function PrintTemplate({ candidate }: { candidate: Partial<Candidate> }) {
  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12">
       <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-2xl font-extrabold uppercase">Borang Permohonan Kemasukan</h1>
          <p className="text-sm font-medium mt-1">Salinan Permohonan Calon</p>
       </div>
       
       <div className="flex gap-6 mb-8 items-start">
          {candidate.gambarUrl ? (
             <img src={candidate.gambarUrl} alt="Passport" className="w-24 h-32 object-cover border border-slate-300" />
          ) : (
             <div className="w-24 h-32 border border-slate-300 flex items-center justify-center text-xs text-slate-400 bg-slate-50">Tiada Gambar</div>
          )}
          <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
             <div className="col-span-2 font-bold text-base mb-2">{candidate.name || candidate.studentName || '-'}</div>
             <div><strong>No. Kad Pengenalan:</strong> {candidate.ic || candidate.icNumber || '-'}</div>
             <div><strong>No. Sijil Lahir:</strong> {candidate.noSijilLahir || '-'}</div>
             <div><strong>Tarikh Lahir:</strong> {candidate.tarikhLahir || '-'}</div>
             <div><strong>Tempat Lahir:</strong> {candidate.tempatLahir || '-'}</div>
             <div><strong>Jantina:</strong> {candidate.jantina || '-'}</div>
             <div className="col-span-2"><strong>Asal Sekolah:</strong> {candidate.namaSekolahRendah || '-'}</div>
             <div className="col-span-2"><strong>Alamat:</strong> {candidate.alamat1 || '-'} {candidate.alamat2 || ''}, {candidate.poskod || ''} {candidate.daerah || ''}, {candidate.negeri || ''}</div>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
             <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Maklumat Bapa</h3>
             <div className="space-y-1">
                <div><strong>Nama:</strong> {candidate.namaBapa || '-'}</div>
                <div><strong>No. KP:</strong> {candidate.icBapa || '-'}</div>
                <div><strong>No. Tel:</strong> {candidate.telefonBapa || '-'}</div>
                <div><strong>Pekerjaan:</strong> {candidate.pekerjaanBapa || '-'}</div>
             </div>
          </div>
          <div>
             <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Maklumat Ibu</h3>
             <div className="space-y-1">
                <div><strong>Nama:</strong> {candidate.namaIbu || '-'}</div>
                <div><strong>No. KP:</strong> {candidate.icIbu || '-'}</div>
                <div><strong>No. Tel:</strong> {candidate.telefonIbu || '-'}</div>
                <div><strong>Pekerjaan:</strong> {candidate.pekerjaanIbu || '-'}</div>
             </div>
          </div>
       </div>

       <div className="mb-8 text-sm">
           <h3 className="font-bold border-b border-slate-200 pb-2 mb-2 uppercase text-xs tracking-wider">Keputusan PBD & UPKK</h3>
           <div className="grid grid-cols-2 gap-4">
               <div>
                   <p className="font-bold mb-1">PBD Akhir Tahun Darjah 5</p>
                   <ul className="list-disc list-inside text-xs">
                       <li>Bahasa Melayu: {candidate.pbd?.bm || '-'}</li>
                       <li>Bahasa Inggeris: {candidate.pbd?.bi || '-'}</li>
                       <li>Matematik: {candidate.pbd?.matematik || '-'}</li>
                       <li>Sains: {candidate.pbd?.sains || '-'}</li>
                   </ul>
               </div>
               <div>
                   <p className="font-bold mb-1">PBD Pertengahan Darjah 6</p>
                   <ul className="list-disc list-inside text-xs">
                       <li>Bahasa Melayu: {candidate.pbdD6?.bm || '-'}</li>
                       <li>Bahasa Inggeris: {candidate.pbdD6?.bi || '-'}</li>
                       <li>Matematik: {candidate.pbdD6?.matematik || '-'}</li>
                       <li>Sains: {candidate.pbdD6?.sains || '-'}</li>
                   </ul>
               </div>
           </div>
           <div className="mt-4">
               <p className="font-bold mb-1">UPKK</p>
               <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
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

       <div className="text-center pt-8 border-t border-slate-200 text-xs text-slate-500">
          <p>Borang ini dijana oleh komputer. Sila bawa salinan ini semasa temuduga (jika terpilih).</p>
       </div>
    </div>
  );
}

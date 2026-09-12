import { useState } from 'react';
import { useAppContext } from '../../store';
import { Search, Info, CheckCircle, XCircle, Clock, Printer, Calendar, Download, FileText } from 'lucide-react';
import { Candidate } from '../../types';
import SuratTawaran from './SuratTawaran';

export default function SemakTawaran() {
  const { settings, candidates, updateCandidate } = useAppContext();
  const [icInput, setIcInput] = useState('');
  const [result, setResult] = useState<Candidate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const formatTarikh = (tarikhStr: string) => {
     if(!tarikhStr) return '-';
     const d = new Date(tarikhStr);
     if(isNaN(d.getTime())) return tarikhStr;
     const day = String(d.getDate()).padStart(2, '0');
     const month = d.toLocaleDateString('ms-MY', { month: 'long' });
     const year = d.getFullYear();
     return `${day} - ${month} - ${year}`;
  };

  if (!settings.tawaranBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Semakan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Semakan tawaran kemasukan belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh semakan akan dibuka: <span className="font-semibold">{formatTarikh(settings.tarikhBukaTawaran)}</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIc = icInput.replace(/[^0-9]/g, '');
    const found = candidates.find(c => c.ic === cleanIc);
    setResult(found || null);
    setHasSearched(true);
  };

  const handleMaklumBalas = (status: 'TERIMA' | 'TOLAK') => {
    if (result) {
      const updated = { ...result, maklumBalasTawaran: status };
      updateCandidate(result.ic, { maklumBalasTawaran: status });
      setResult(updated);
      setShowPopup(false);
      
      if (status === 'TOLAK') {
        alert('Anda telah memilih untuk MENOLAK tawaran ini.');
      } else {
        alert('Tahniah! Anda telah MENERIMA tawaran ini.');
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12 no-print">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
           <Search className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Semakan Tawaran</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">Sila masukkan No. Kad Pengenalan pemohon (tanpa sengkang) untuk menyemak status tawaran kemasukan.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 mb-12 border border-slate-100 no-print">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Contoh: 140101061234"
            maxLength={12}
            value={icInput}
            onChange={(e) => setIcInput(e.target.value)}
            className="flex-1 px-8 py-5 rounded-full border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-lg font-bold text-slate-800 placeholder-slate-400 transition-all outline-none"
            required
          />
          <button 
            type="submit"
            className="bg-emerald-600 text-white px-10 py-5 rounded-full font-extrabold hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            Semak Status
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          {!result ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-12 text-center no-print">
               <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-6">
                 <XCircle className="w-10 h-10 text-red-600" />
               </div>
               <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Rekod Tidak Ditemui</h3>
               <p className="text-slate-500">Sila pastikan No. Kad Pengenalan yang dimasukkan adalah betul.</p>
            </div>
          ) : result.statusTawaran === 'BERJAYA' ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-8 md:p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 no-print"></div>
               
               <div className="no-print">
                 <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6">
                   <CheckCircle className="w-12 h-12 text-emerald-600" />
                 </div>
                 <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Tahniah!</h2>
                 <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium">
                   Tahniah Permohonan kemasukan ke tingakatan 1 SMA Kota Gelanggi 3 2027 adalah berjaya.
                 </p>
                 <p className="text-slate-500 mb-10 text-lg">
                   Pihak sekolah mengucapkan setinggi-tinggi tahniah atas kejayaan ini. Sehubungan itu, pihak tuan/puan diminta untuk membuat tindakan lanjut. Segala kerjasama dan perhatian tuan/puan amat dihargai.
                 </p>

                 {result.maklumBalasTawaran ? (
                    result.maklumBalasTawaran === 'TERIMA' ? (
                      <>
                      <div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-8 animate-in zoom-in duration-300 shadow-inner">
                         <h3 className="font-extrabold text-xl text-slate-900 mb-3">Anda Telah Menerima Tawaran Ini</h3>
                         <p className="text-emerald-700 font-medium mb-8 leading-relaxed max-w-xl mx-auto">
                           Sila cetak <strong>Surat Tawaran</strong> dan lengkapkan <strong>Borang Maklumat Murid & Borang Asrama</strong> di bawah. <br/>Bawa dokumen-dokumen ini semasa hari pendaftaran pada <strong className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">3 Januari 2027</strong>.
                         </p>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                           <button onClick={() => window.print()} className="flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                             <Printer className="w-10 h-10" />
                             <span className="font-bold text-sm tracking-wide text-center">1. CETAK<br/>SURAT TAWARAN</span>
                           </button>
                           
                           {settings.borangTingkatan1Link ? (
                             <a href={settings.borangTingkatan1Link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1">
                               <Download className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                             </a>
                           ) : (
                             <button onClick={() => alert('Maaf, pautan borang belum dikemaskini oleh pihak sekolah.')} className="flex flex-col items-center justify-center gap-3 no-print text-slate-400 p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 cursor-not-allowed">
                               <Download className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">2. MUAT TURUN<br/>BORANG PENDAFTARAN</span>
                             </button>
                           )}
                         </div>
                      </div>
                      <div className="mt-12">
                         <div className="text-center mb-4 no-print text-sm font-bold text-slate-400 uppercase tracking-widest">Pratonton Surat</div>
                         <SuratTawaran candidate={result} />
                      </div>
                      </>
                    ) : (
                      <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 shadow-inner">
                         <h3 className="font-extrabold text-xl text-red-900 mb-2">Anda Telah Menolak Tawaran Ini</h3>
                         <p className="text-red-700 font-medium">Terima kasih atas maklum balas anda.</p>
                      </div>
                    )
                 ) : (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8 relative shadow-lg shadow-amber-100/20">
                       <div className="inline-flex px-4 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-sm mb-4 border border-amber-200">Tindakan Diperlukan</div>
                       <p className="text-amber-900 text-lg mb-8 font-medium leading-relaxed">
                         Sila buat pengesahan penerimaan tawaran ini sebelum <strong className="bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">{settings.tarikhAkhirTerimaTawaran || '28 November 2026'}</strong>. Sekiranya anda gagal berbuat demikian tawaran ini akan terbatal.
                       </p>
                       <button 
                         onClick={() => setShowPopup(true)}
                         className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-500/30 transition-all duration-300 w-full sm:w-auto hover:scale-105 active:scale-95"
                       >
                         Buat Pengesahan Terima/Tolak
                       </button>
                    </div>
                 )}
               </div>
            </div>
          ) : result.statusTawaran === 'GAGAL' ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-12 text-center relative overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-2 bg-slate-300"></div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Status Permohonan</h2>
               <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium">
                 Dukacita dimaklumkan bahawa permohonan kemasukan ke Tingkatan 1 di SMA Kota Gelanggi 3 adalah Tidak Berjaya.
               </p>
               <p className="text-slate-500 mb-10 text-lg">
                 Pihak sekolah merakamkan ucapan terima kasih atas minat dan penyertaan anda dalam proses pemilihan pada tahun ini.
               </p>
               <div className="font-bold text-slate-400 border-t border-slate-100 pt-8 max-w-xs mx-auto tracking-widest uppercase">
                 Terima Kasih
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-12 text-center relative overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
               <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Dalam Proses Nilaian Akhir</h2>
               <p className="text-slate-600 leading-relaxed font-medium text-lg">
                 Keputusan tawaran kemasukan masih belum dimuktamadkan. Sila semak semula kelak.
               </p>
            </div>
          )}
        </div>
      )}

      {/* Pop Up Maklum Balas */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
           <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200">
             <h3 className="text-2xl font-extrabold text-slate-900 mb-8 text-center border-b border-slate-100 pb-6 tracking-tight">Pengesahan Penerimaan Tawaran</h3>
             <div className="space-y-4">
                <button 
                  onClick={() => handleMaklumBalas('TERIMA')}
                  className="w-full text-left p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 hover:bg-slate-50 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-300 group-hover:border-emerald-500 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div>
                    <span className="block font-bold text-emerald-950 text-lg mb-1">TERIMA</span>
                    <span className="block text-emerald-600 font-medium">Saya bersetuju menerima tawaran kemasukan ke Tingkatan 1 di SMA Kota Gelanggi 3.</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleMaklumBalas('TOLAK')}
                  className="w-full text-left p-6 rounded-2xl border-2 border-red-100 hover:border-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-red-300 group-hover:border-red-500 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors">
                     <div className="w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div>
                    <span className="block font-bold text-red-950 text-lg mb-1">TOLAK</span>
                    <span className="block text-red-700 font-medium">Saya menolak tawaran kemasukan Tingkatan 1 di SMA Kota Gelanggi 3.</span>
                  </div>
                </button>
             </div>
             <button 
               onClick={() => setShowPopup(false)}
               className="mt-8 w-full py-4 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
             >
               Batal
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

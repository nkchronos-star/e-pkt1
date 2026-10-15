import { useState, useEffect } from 'react';
import { useAppContext, isOfferExpired } from '../../store';
import { Search, Info, CheckCircle, XCircle, Clock, Printer, Calendar, Download, FileText, Loader2, ExternalLink, MessageCircle, AlertTriangle, Copy, Check } from 'lucide-react';
import { Candidate } from '../../types';
import SuratTawaran from './SuratTawaran';
import BorangPendaftaranPDF from './BorangPendaftaranPDF';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function SemakTawaran() {
  const { settings, candidates, updateCandidate } = useAppContext();
  const [icInput, setIcInput] = useState('');
  const [result, setResult] = useState<Candidate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBorangPendaftaran, setShowBorangPendaftaran] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  const rawBorangLink = (settings.borangTingkatan1Link || settings.borangPendaftaranUrl || '').trim();
  const borangLink = rawBorangLink 
    ? (/^https?:\/\//i.test(rawBorangLink) ? rawBorangLink : `https://${rawBorangLink}`)
    : '';

  // Jika calon belum respon dan tarikh akhir telah berlalu, status tawaran terbatal secara automatik
  useEffect(() => {
    if (result && result.statusTawaran === 'BERJAYA' && !result.maklumBalasTawaran && isOfferExpired(result, settings)) {
      updateCandidate(result.ic, { maklumBalasTawaran: 'TERBATAL' });
      setResult(prev => prev ? { ...prev, maklumBalasTawaran: 'TERBATAL' } : null);
    }
  }, [result?.ic, result?.statusTawaran, result?.maklumBalasTawaran, settings?.tarikhAkhirTerimaTawaranDate, settings?.tarikhAkhirTerimaTawaran]);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIc = icInput.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanIc) return;
    setLoading(true);
    setHasSearched(true);
    setResult(null);

    // Semak memori jika pengguna adalah Admin yang sedang log masuk
    if (candidates && candidates.length > 0) {
      const found = candidates.find(c => c.ic?.replace(/[^a-zA-Z0-9]/g, '') === cleanIc);
      if (found) {
        setResult(found);
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Carian terus dokumen ID (kebanyakan disimpan dengan IC sebagai ID dokumen)
      const docRef = doc(db, 'candidates', cleanIc);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResult({ id: docSnap.id, ...docSnap.data() } as Candidate);
        setLoading(false);
        return;
      }

      // 2. Carian query field 'ic' mengikut nombor bersih
      const q = query(collection(db, 'candidates'), where('ic', '==', cleanIc), limit(1));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const d = qSnap.docs[0];
        setResult({ id: d.id, ...d.data() } as Candidate);
        setLoading(false);
        return;
      }

      // 3. Carian query jika IC mengandungi sengkang atau format asal
      if (icInput.trim() !== cleanIc) {
        const q2 = query(collection(db, 'candidates'), where('ic', '==', icInput.trim()), limit(1));
        const q2Snap = await getDocs(q2);
        if (!q2Snap.empty) {
          const d2 = q2Snap.docs[0];
          setResult({ id: d2.id, ...d2.data() } as Candidate);
          setLoading(false);
          return;
        }
      }

      setResult(null);
    } catch (err) {
      console.error("Ralat semakan tawaran:", err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMaklumBalas = (status: 'TERIMA' | 'TOLAK') => {
    if (result) {
      if (isOfferExpired(result, settings)) {
        alert('Maaf, tempoh masa untuk memberi maklum balas telah tamat. Tawaran ini telah terbatal secara automatik.');
        setShowPopup(false);
        return;
      }
      const updated = { ...result, maklumBalasTawaran: status };
      updateCandidate(result.ic, { maklumBalasTawaran: status });
      setResult(updated);
      setShowPopup(false);
      
      if (status === 'TOLAK') {
        alert('Anda telah memilih untuk MENOLAK tawaran ini.');
      } else {
        alert('Tahniah! Anda telah MENERIMA tawaran ini. Sila sertai group WhatsApp rasmi di bawah.');
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
            disabled={loading}
            className="bg-emerald-600 text-white px-10 py-5 rounded-full font-extrabold hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
            {loading ? 'Menyemak...' : 'Semak Status'}
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
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-8 md:p-12 text-center relative overflow-hidden print:p-0 print:shadow-none print:border-none print:overflow-visible print:bg-transparent">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 no-print"></div>
               <>
                 {!isOfferExpired(result, settings) && (
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
                   </div>
                 )}

                 {result.maklumBalasTawaran ? (
                    result.maklumBalasTawaran === 'TERIMA' ? (
                      <>
                      <div className="bg-slate-50/80 border border-emerald-200/60 rounded-2xl p-6 sm:p-8 animate-in zoom-in duration-300 shadow-inner no-print">
                         <h3 className="font-extrabold text-xl text-slate-900 mb-3">Anda Telah Menerima Tawaran Ini</h3>
                         <p className="text-emerald-700 font-medium mb-8 leading-relaxed max-w-xl mx-auto">
                           Sila cetak <strong>Surat Tawaran</strong> dan lengkapkan <strong>Borang Maklumat Murid & Borang Asrama</strong> di bawah. <br/>Bawa dokumen-dokumen ini semasa hari pendaftaran pada <strong className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">3 Januari 2027</strong>.
                         </p>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                           <div className="flex flex-col items-center w-full">
                             <button onClick={() => window.print()} className="w-full h-full flex flex-col items-center justify-center gap-3 no-print text-emerald-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-emerald-200 bg-white/50 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1">
                               <Printer className="w-10 h-10" />
                               <span className="font-bold text-sm tracking-wide text-center">1. CETAK<br/>SURAT TAWARAN</span>
                             </button>
                             <p className="text-[10.5px] leading-tight text-slate-500 mt-2 text-center font-medium opacity-80 no-print">
                               * Jika butang tidak berfungsi di ruang ini, tekan kekunci <kbd className="bg-slate-200 px-1 py-0.5 rounded text-black font-sans">Ctrl+P</kbd> atau buka sistem ini di tab/tetingkap baharu.
                             </p>
                           </div>
                           
                           <div className="flex flex-col items-center w-full">
                             {borangLink ? (
                               <a 
                                 href={borangLink} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="w-full h-full flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-blue-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 group text-center cursor-pointer"
                                 title="Klik untuk terus buka pautan borang pendaftaran di tab baharu"
                               >
                                 <div className="relative">
                                   <Download className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
                                   <ExternalLink className="w-4 h-4 text-blue-500 absolute -top-1 -right-2 bg-white rounded-full p-0.5 shadow-xs" />
                                 </div>
                                 <span className="font-bold text-sm tracking-wide text-center">
                                   2. MUAT TURUN / CETAK<br/>BORANG PENDAFTARAN (12 HALAMAN)
                                 </span>
                                 <span className="text-[11px] text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 group-hover:bg-blue-200 transition">
                                   <ExternalLink className="w-3 h-3" /> Buka Pautan Borang Rasmi
                                 </span>
                                </a>
                             ) : (
                               <button 
                                 onClick={() => setShowBorangPendaftaran(true)} 
                                 className="w-full h-full flex flex-col items-center justify-center gap-3 no-print text-blue-600 hover:text-slate-900 transition-all p-6 rounded-2xl hover:bg-white border-2 border-blue-200 bg-white/50 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 cursor-pointer"
                               >
                                 <Download className="w-10 h-10 text-blue-600" />
                                 <span className="font-bold text-sm tracking-wide text-center">
                                   2. MUAT TURUN / CETAK<br/>BORANG PENDAFTARAN (12 HALAMAN)
                                 </span>
                               </button>
                             )}

                             {borangLink ? (
                               <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                 <a 
                                   href={borangLink} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1"
                                 >
                                   <ExternalLink className="w-3 h-3" /> Pautan Google Drive / PDF Luar
                                 </a>
                                 <span className="text-slate-300">&bull;</span>
                                 <button 
                                   type="button" 
                                   onClick={() => setShowBorangPendaftaran(true)} 
                                   className="text-[11px] text-slate-500 hover:text-slate-700 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                                   title="Buka templat dokumen 12 halaman terbina dalam sistem"
                                 >
                                   <FileText className="w-3 h-3 text-slate-400" /> Templat Sistem
                                 </button>
                               </div>
                             ) : (
                               <span className="text-[10.5px] leading-tight text-slate-500 mt-2 text-center font-medium opacity-80 no-print">
                                 * Mengandungi 12 halaman lengkap dokumen & borang rasmi sekolah
                                </span>
                             )}
                           </div>
                         </div>

                         {/* 3. Pautan Group WhatsApp Rasmi Calon Menerima Tawaran */}
                         <div className="mt-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-7 shadow-lg shadow-emerald-700/25 text-left border border-emerald-400/50">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-md ring-4 ring-white/20">
                                  <MessageCircle className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="bg-amber-300 text-emerald-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                                      Tindakan Seterusnya
                                    </span>
                                    <span className="text-emerald-100 text-xs font-semibold">Tawaran Disahkan</span>
                                  </div>
                                  <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                                    Sertai Group WhatsApp Rasmi Kemasukan Tingkatan 1
                                  </h4>
                                  <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                                    Ibu bapa / penjaga murid yang telah <strong>MENERIMA TAWARAN</strong> diminta menyertai group WhatsApp rasmi ini bagi mendapatkan taklimat pendaftaran, maklumat yuran, persediaan asrama, dan urusan lapor diri.
                                  </p>
                                </div>
                              </div>

                              <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2">
                                {settings.linkGroupWhatsapp ? (
                                  <>
                                    <a 
                                      href={settings.linkGroupWhatsapp}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 font-black px-5 py-3 rounded-xl shadow-md transition-all text-sm tracking-wide hover:scale-105 active:scale-95 whitespace-nowrap"
                                    >
                                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                                      <span>Masuk Group WhatsApp</span>
                                      <ExternalLink className="w-4 h-4 text-emerald-600 opacity-80" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (settings.linkGroupWhatsapp) {
                                          navigator.clipboard.writeText(settings.linkGroupWhatsapp);
                                          setCopiedWa(true);
                                          setTimeout(() => setCopiedWa(false), 2500);
                                        }
                                      }}
                                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold px-4 py-3 rounded-xl border border-emerald-400/50 shadow-sm transition-all text-xs whitespace-nowrap"
                                      title="Salin pautan group WhatsApp"
                                    >
                                      {copiedWa ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                                      <span>{copiedWa ? 'Pautan Disalin!' : 'Salin Pautan'}</span>
                                    </button>
                                  </>
                                ) : (
                                  <div className="bg-emerald-900/50 border border-emerald-300/40 text-emerald-100 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                                    Pautan WhatsApp rasmi akan diaktifkan oleh pihak sekolah tidak lama lagi.
                                  </div>
                                )}
                              </div>
                            </div>
                         </div>
                      </div>
                      <div className="mt-12 print:mt-0">
                         <div className="text-center mb-4 no-print text-sm font-bold text-slate-400 uppercase tracking-widest">Pratonton Surat</div>
                         <SuratTawaran candidate={result} />
                      </div>
                      </>
                    ) : (
                      <div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 shadow-inner no-print">
                         <h3 className="font-extrabold text-xl text-red-900 mb-2">Anda Telah Menolak Tawaran Ini</h3>
                         <p className="text-red-700 font-medium">Terima kasih atas maklum balas anda.</p>
                      </div>
                    )
                 ) : isOfferExpired(result, settings) ? (
                    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-8 sm:p-10 shadow-lg shadow-rose-100/50 text-center no-print">
                       <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-inner">
                         <XCircle className="w-10 h-10" />
                       </div>
                       <div className="inline-block px-3.5 py-1 bg-rose-200/80 text-rose-900 rounded-full font-black text-xs uppercase tracking-wider mb-3 border border-rose-300">
                         Tawaran Terbatal (Tamat Tempoh Respon)
                       </div>
                       <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                         Tawaran Kemasukan Telah Terbatal
                       </h3>
                       <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-5">
                         Dukacita dimaklumkan bahawa tawaran kemasukan ke Tingkatan 1 bagi calon ini telah <strong>TERBATAL SECARA AUTOMATIK</strong> kerana tiada sebarang pengesahan penerimaan dibuat sebelum tarikh akhir yang ditetapkan iaitu <strong className="bg-rose-100 text-rose-950 px-2 py-0.5 rounded border border-rose-300">{settings.tarikhAkhirTerimaTawaran || '28 November 2026'}</strong>.
                       </p>
                       <div className="bg-white rounded-xl p-4 border border-rose-200 text-xs sm:text-sm text-rose-800 max-w-lg mx-auto text-left space-y-1.5 shadow-2xs">
                         <div className="font-bold flex items-center gap-1.5 text-rose-900">
                           <AlertTriangle className="w-4 h-4 text-rose-600" /> Syarat & Ketetapan Tawaran:
                         </div>
                         <p>
                           Tempat tawaran yang tidak disahkan dalam tempoh rasmi telah ditarik balik dan diserahkan kepada calon seterusnya dalam senarai menunggu / pertimbangan.
                         </p>
                       </div>
                       <p className="text-xs text-slate-400 mt-5">
                         Sebarang pertanyaan lanjut, sila hubungi pihak pentadbiran SMA Kota Gelanggi 3 di 09-2051555.
                       </p>
                    </div>
                 ) : (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8 relative shadow-lg shadow-amber-100/20 no-print">
                       <div className="inline-flex px-4 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-sm mb-4 border border-amber-200">Tindakan Diperlukan</div>
                       <p className="text-amber-900 text-lg mb-8 font-medium leading-relaxed">
                         Sila buat pengesahan penerimaan tawaran ini sebelum <strong className="bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">{settings.tarikhAkhirTerimaTawaran || '28 November 2026'}</strong>. Sekiranya anda gagal berbuat demikian sebelum tarikh tersebut, <strong>tawaran ini akan terbatal secara automatik</strong>.
                       </p>
                       <button 
                         onClick={() => setShowPopup(true)}
                         className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-500/30 transition-all duration-300 w-full sm:w-auto hover:scale-105 active:scale-95"
                       >
                         Buat Pengesahan Terima/Tolak
                       </button>
                    </div>
                 )}
               </>
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
            <div className="bg-white rounded-[2rem] shadow-xl shadow-amber-100/50 border-2 border-amber-200/80 p-8 md:p-12 text-center relative overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"></div>
               
               <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full mb-6">
                 <Clock className="w-12 h-12 text-amber-600 animate-pulse" />
               </div>

               <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase tracking-wider mb-4">
                 Status: Dalam Proses Penilaian
               </div>

               <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                 Permohonan Dalam Proses Penilaian
               </h2>
               
               <p className="text-slate-700 leading-relaxed max-w-xl mx-auto mb-6 text-lg font-medium">
                 Status permohonan kemasukan ke Tingkatan 1 SMA Kota Gelanggi 3 anda kini berada dalam status <strong className="text-amber-700">"Dalam Proses Penilaian"</strong>.
               </p>

               <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-6 md:p-8 max-w-xl mx-auto mb-6 shadow-sm">
                 <div className="flex items-center justify-center gap-2 text-amber-800 font-extrabold text-sm uppercase tracking-wide mb-2">
                   <Calendar className="w-5 h-5 text-amber-600" />
                   Tarikh Semakan Semula Keputusan
                 </div>
                 <div className="text-2xl md:text-3xl font-black text-amber-900 tracking-tight my-2">
                   {settings.tarikhSemakPertimbangan || '30 OKTOBER 2026'}
                 </div>
                 <p className="text-slate-600 text-sm md:text-base font-medium mt-3 leading-relaxed">
                   Sila layari semula sistem ini dan <strong>semak status tawaran anda pada tarikh {settings.tarikhSemakPertimbangan || '30 Oktober 2026'}</strong> bagi mengetahui sebarang pengemaskinian status tawaran rasmi anda.
                 </p>
               </div>

               <p className="text-slate-500 text-sm max-w-lg mx-auto">
                 Pihak jawatankuasa pemilihan sedang memperhalusi proses penilaian serta pengesahan kuota kemasukan. Sebarang keputusan muktamad akan dipaparkan di sini pada tarikh tersebut.
               </p>

               <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-400 font-medium">
                 {result.name} ({result.ic})
               </div>
            </div>
          )}
        </div>
      )}

      {/* Pop Up Maklum Balas */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
           <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200">
             <div className="text-center mb-6 border-b border-slate-100 pb-5">
               <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengesahan Penerimaan Tawaran</h3>
               <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                 Sila sahkan pilihan anda sebelum <strong className="text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{settings.tarikhAkhirTerimaTawaran || '28 November 2026'}</strong>.<br/>
                 <span className="text-rose-600 font-semibold">* Kegagalan memberi respon akan menyebabkan tawaran terbatal secara automatik.</span>
               </p>
             </div>
             <div className="space-y-4">
                <button 
                  onClick={() => handleMaklumBalas('TERIMA')}
                  className="w-full text-left p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-400 group-hover:border-emerald-600 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors bg-white">
                     <div className="w-3 h-3 bg-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div>
                    <span className="block font-black text-emerald-950 text-base sm:text-lg mb-0.5">TERIMA TAWARAN</span>
                    <span className="block text-emerald-700 text-xs sm:text-sm font-medium leading-relaxed">
                      Saya bersetuju menerima tawaran kemasukan ke Tingkatan 1 di SMA Kota Gelanggi 3.
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 mt-2 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      Pautan Group WhatsApp rasmi akan terus diberikan
                    </span>
                  </div>
                </button>
                <button 
                  onClick={() => handleMaklumBalas('TOLAK')}
                  className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-rose-500 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors bg-white">
                     <div className="w-3 h-3 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div>
                    <span className="block font-black text-slate-800 group-hover:text-rose-950 text-base sm:text-lg mb-0.5">TOLAK TAWARAN</span>
                    <span className="block text-slate-600 group-hover:text-rose-700 text-xs sm:text-sm font-medium leading-relaxed">
                      Saya menolak tawaran kemasukan Tingkatan 1 di SMA Kota Gelanggi 3 bagi sesi ini.
                    </span>
                  </div>
                </button>
             </div>
             <button 
               onClick={() => setShowPopup(false)}
               className="mt-6 w-full py-3.5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-sm"
             >
               Kembali
             </button>
           </div>
        </div>
      )}

      {showBorangPendaftaran && result && (
        <BorangPendaftaranPDF 
          candidate={result} 
          onClose={() => setShowBorangPendaftaran(false)} 
        />
      )}
    </div>
  );
}

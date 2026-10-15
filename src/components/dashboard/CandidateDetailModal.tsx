import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Printer, Edit, Phone, MessageSquare, MapPin, School, 
  Calendar, User, BookOpen, Award, CheckCircle2, XCircle, 
  Clock, FileText, ExternalLink, Copy, Check, Eye, ShieldAlert,
  GraduationCap, Sparkles
} from 'lucide-react';
import { Candidate, ApplicationSettings } from '../../types';
import { useAppContext, isOfferExpired } from '../../store';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
  onEdit?: (candidate: Candidate) => void;
  onPrint?: (candidate: Candidate) => void;
  meritRank?: {
    rank?: number | null;
    genderRank?: number | null;
    globalRank?: number | null;
    totalScore?: number;
    percentage?: number;
  };
}

export default function CandidateDetailModal({
  candidate,
  onClose,
  onEdit,
  onPrint,
  meritRank
}: CandidateDetailModalProps) {
  const { settings } = useAppContext();
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'AKADEMIK' | 'PENILAIAN' | 'DOKUMEN'>('PROFIL');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewPhotoFull, setPreviewPhotoFull] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Kunci scroll halaman latar belakang supaya modal kekal stabil di pandangan atas
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Pastikan kandungan modal sentiasa bermula di kedudukan teratas bila dibuka atau tukar tab
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [candidate, activeTab]);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatPhoneForWa = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('60')) return clean;
    if (clean.startsWith('0')) return '6' + clean;
    return '60' + clean;
  };

  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return 'bg-slate-100 text-slate-500 border-slate-200';
    const g = grade.toUpperCase().trim();
    if (g === 'A') return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    if (g === 'B') return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
    if (g === 'C') return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    if (g === 'D') return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
    if (g === 'E' || g === 'F') return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
  };

  // Helper kira ringkasan gred UPKK
  const upkkGrades = [
    candidate.upkk?.alquran,
    candidate.upkk?.akidah,
    candidate.upkk?.sirah,
    candidate.upkk?.adab,
    candidate.upkk?.jawikhat,
    candidate.upkk?.bahasaarab,
    candidate.upkk?.ibadah,
    candidate.upkk?.penghayatancarahidupislam,
    candidate.upkk?.amalisolat,
  ].filter(Boolean);

  const countA = upkkGrades.filter(g => g?.toUpperCase() === 'A').length;
  const countB = upkkGrades.filter(g => g?.toUpperCase() === 'B').length;
  const countC = upkkGrades.filter(g => g?.toUpperCase() === 'C').length;

  const tahfizMax = settings.tahfizItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 100;
  const akademikMax = settings.akademikItems?.reduce((a, b) => a + Number(b.weight || 0), 0) || 40;
  const totalMax = tahfizMax + akademikMax;

  const tahfizScore = candidate.markahTahfiz?.jumlah;
  const akademikScore = candidate.markahAkademik?.jumlah;
  const hasEvaluation = tahfizScore !== undefined || akademikScore !== undefined;
  const grandTotal = (tahfizScore || 0) + (akademikScore || 0);
  const calculatedPercentage = totalMax > 0 ? ((grandTotal / totalMax) * 100).toFixed(1) : '0';

  const isLelaki = (candidate.jantina || '').toUpperCase().includes('L') || (candidate.jantina || '').toUpperCase().includes('BANIN');

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      
      {/* Modal Zoom Gambar Penuh */}
      {previewPhotoFull && candidate.gambarUrl && (
        <div 
          onClick={(e) => { e.stopPropagation(); setPreviewPhotoFull(false); }} 
          className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-md w-full bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img 
              src={candidate.gambarUrl} 
              alt={candidate.name} 
              className="w-full max-h-[75vh] object-contain rounded-xl mx-auto" 
            />
            <div className="mt-3 text-center text-white text-xs font-semibold">
              {candidate.name} ({candidate.ic}) &bull; Klik di mana-mana untuk tutup
            </div>
            <button 
              type="button"
              onClick={() => setPreviewPhotoFull(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Kad Modal Utama - Bebas dari Header & Terletak Elok di Tengah Skrin */}
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER KAD PROFIL PADAT: Bertemakan Zamrud Berprestij (Kemas & Jimat Ruang Menegak) */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-white p-3 sm:p-4 border-b border-amber-400/30 relative shrink-0">
          
          {/* Butang Tutup Pantas */}
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-emerald-200 hover:text-white bg-emerald-950/50 hover:bg-emerald-950/80 rounded-full transition-colors shadow-xs"
            title="Tutup Maklumat Calon"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center sm:items-start gap-3 sm:gap-4 pr-10">
            
            {/* Gambar Calon dengan Badge & Zum (Saiz Ideal & Padat) */}
            <div className="relative group shrink-0">
              <div 
                onClick={() => candidate.gambarUrl && setPreviewPhotoFull(true)}
                className={`w-14 h-18 sm:w-16 sm:h-22 rounded-xl overflow-hidden bg-emerald-950/60 border-2 border-amber-400/80 shadow-md flex items-center justify-center ${
                  candidate.gambarUrl ? 'cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all' : ''
                }`}
                title={candidate.gambarUrl ? "Klik untuk lihat gambar saiz penuh" : "Tiada gambar"}
              >
                {candidate.gambarUrl ? (
                  <img 
                    src={candidate.gambarUrl} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-1.5 text-center text-emerald-200">
                    <User className="w-6 h-6 opacity-60 mb-0.5" />
                    <span className="text-[9px] uppercase font-bold tracking-wider">Tiada</span>
                  </div>
                )}

                {/* Overlay hover untuk hint zoom */}
                {candidate.gambarUrl && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                )}
              </div>

              {/* Lencana Jantina */}
              <div className="absolute -bottom-1.5 -right-1">
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black shadow-xs border ${
                  isLelaki 
                    ? 'bg-blue-600 text-white border-blue-300' 
                    : 'bg-pink-600 text-white border-pink-300'
                }`}>
                  {isLelaki ? '👦 L' : '👧 P'}
                </span>
              </div>
            </div>

            {/* Maklumat Utama & Ringkasan Calon */}
            <div className="flex-1 min-w-0">
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-emerald-200 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-amber-300" />
                  Kemasukan Tingkatan 1
                </span>
                
                {meritRank?.rank && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-900 shadow-xs">
                    🏆 Merit #{meritRank.rank}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-xl font-black text-white mt-0.5 leading-tight tracking-tight truncate">
                {candidate.name}
              </h2>

              {/* No. KP dengan Butang Salin */}
              <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                <div className="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-400/40 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-amber-300">
                  <span>KP: {candidate.ic}</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(candidate.ic, 'ic')}
                    className="p-0.5 hover:text-white transition-colors"
                    title="Salin No. KP"
                  >
                    {copiedField === 'ic' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {candidate.noSijilLahir && (
                  <span className="text-[11px] text-emerald-200/90 font-medium">
                    Sijil: <span className="font-mono">{candidate.noSijilLahir}</span>
                  </span>
                )}
              </div>

              {/* Senarai Lencana Status (Kemas & Padat) */}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[10px] sm:text-[11px]">
                
                {/* Status Kelayakan Temuduga */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border shadow-xs ${
                  candidate.statusTemuduga === 'LAYAK'
                    ? 'bg-emerald-500/30 text-emerald-100 border-emerald-300/50'
                    : candidate.statusTemuduga === 'TIDAK_LAYAK'
                    ? 'bg-rose-500/30 text-rose-100 border-rose-300/50'
                    : 'bg-amber-500/30 text-amber-100 border-amber-300/50'
                }`}>
                  {candidate.statusTemuduga === 'LAYAK' ? <CheckCircle2 className="w-3 h-3 text-emerald-300" /> : <Clock className="w-3 h-3" />}
                  {candidate.statusTemuduga === 'LAYAK' ? 'LAYAK TEMUDUGA' : candidate.statusTemuduga === 'TIDAK_LAYAK' ? 'TIDAK LAYAK' : 'MENUNGGU SARINGAN'}
                </span>

                {/* Status Tawaran */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border shadow-xs ${
                  candidate.statusTawaran === 'BERJAYA'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : candidate.statusTawaran === 'GAGAL'
                    ? 'bg-rose-900/60 text-rose-200 border-rose-500/40'
                    : 'bg-slate-800/80 text-slate-200 border-slate-600'
                }`}>
                  <Award className="w-3 h-3" />
                  {candidate.statusTawaran === 'BERJAYA' ? 'DITAWARKAN' : candidate.statusTawaran === 'GAGAL' ? 'TIDAK BERJAYA' : 'DALAM PROSES PENILAIAN'}
                </span>

                {/* Tarikh Semakan Semula jika Dalam Proses Penilaian */}
                {candidate.statusTawaran !== 'BERJAYA' && candidate.statusTawaran !== 'GAGAL' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/40" title="Tarikh semakan semula keputusan untuk calon dalam proses penilaian">
                    <Clock className="w-3 h-3" />
                    Semak Semula: {settings.tarikhSemakPertimbangan || '30 Okt 2026'}
                  </span>
                )}

                {/* Maklum Balas */}
                {candidate.statusTawaran === 'BERJAYA' && (
                  candidate.maklumBalasTawaran ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black uppercase border shadow-xs ${
                      candidate.maklumBalasTawaran === 'TERIMA'
                        ? 'bg-emerald-300 text-emerald-950 border-emerald-200'
                        : candidate.maklumBalasTawaran === 'TOLAK'
                        ? 'bg-slate-300 text-slate-950 border-slate-200'
                        : 'bg-rose-300 text-rose-950 border-rose-200'
                    }`}>
                      {candidate.maklumBalasTawaran === 'TERIMA' ? 'Diterima' : candidate.maklumBalasTawaran === 'TOLAK' ? 'Ditolak' : 'Terbatal'}
                    </span>
                  ) : isOfferExpired(candidate, settings) ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black uppercase border shadow-xs bg-rose-300 text-rose-950 border-rose-200" title="Tawaran terbatal kerana tiada respons sebelum tarikh akhir">
                      Terbatal (Gagal Respon)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black uppercase border shadow-xs bg-amber-200 text-amber-950 border-amber-300" title="Menunggu pengesahan calon sebelum tarikh akhir">
                      Menunggu Respon
                    </span>
                  )
                )}
              </div>

            </div>

          </div>

        </div>

        {/* BARIS TAB NAVIGASI PADAT */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('PROFIL')}
            className={`py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'PROFIL'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Maklumat Murid & Penjaga
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AKADEMIK')}
            className={`py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'AKADEMIK'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Keputusan UPKK & PBD
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENILAIAN')}
            className={`py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'PENILAIAN'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Markah Temuduga & Merit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DOKUMEN')}
            className={`py-2.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'DOKUMEN'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Dokumen & Lampiran
          </button>
        </div>

        {/* KANDUNGAN TAB (SCROLLABLE DENGAN AUTO-SCROLL KE ATAS) */}
        <div ref={contentRef} className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          
          {/* TAB 1: MAKLUMAT PERIBADI & PENJAGA */}
          {activeTab === 'PROFIL' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Kad Maklumat Peribadi Calon */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
                <h3 className="text-sm font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-emerald-600" />
                  Maklumat Terperinci Calon
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">Nama Penuh</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{candidate.name || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">No. Kad Pengenalan</span>
                    <span className="font-bold text-slate-800 font-mono block mt-0.5">{candidate.ic || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">No. Sijil Lahir</span>
                    <span className="font-bold text-slate-800 font-mono block mt-0.5">{candidate.noSijilLahir || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">Jantina</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{candidate.jantina || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">Tarikh Lahir</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{candidate.tarikhLahir || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs font-semibold block">Tempat Lahir</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{candidate.tempatLahir || '-'}</span>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-400 text-xs font-semibold block">Sekolah Rendah Asal</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <School className="w-4 h-4 text-emerald-600 shrink-0" />
                      {candidate.namaSekolahRendah || '-'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-400 text-xs font-semibold block">Alamat Kediaman</span>
                    <span className="font-medium text-slate-700 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {[candidate.alamat1, candidate.alamat2, candidate.poskod, candidate.daerah, candidate.negeri].filter(Boolean).join(', ') || '-'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 2 Kad: Bapa & Ibu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Kad Bapa / Penjaga 1 */}
                <div className="bg-blue-50/50 rounded-2xl p-4 sm:p-5 border border-blue-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-200">
                    <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                      <span>👨 Maklumat Bapa / Penjaga</span>
                    </h4>
                    {candidate.telefonBapa && (
                      <div className="flex items-center gap-1">
                        <a 
                          href={`tel:${candidate.telefonBapa}`}
                          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                          title="Hubungi Bapa"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href={`https://wa.me/${formatPhoneForWa(candidate.telefonBapa)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                          title="WhatsApp Bapa"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 text-xs block">Nama Bapa</span>
                      <span className="font-bold text-slate-800">{candidate.namaBapa || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-xs block">No. KP Bapa</span>
                        <span className="font-mono font-semibold text-slate-700">{candidate.icBapa || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">No. Telefon</span>
                        <span className="font-mono font-bold text-blue-700">{candidate.telefonBapa || '-'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-xs block">Pekerjaan</span>
                        <span className="font-medium text-slate-700">{candidate.pekerjaanBapa || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Warganegara</span>
                        <span className="font-medium text-slate-700">{candidate.warganegaraBapa || 'WARGANEGARA'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kad Ibu / Penjaga 2 */}
                <div className="bg-pink-50/50 rounded-2xl p-4 sm:p-5 border border-pink-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-pink-200">
                    <h4 className="text-xs font-black uppercase text-pink-900 tracking-wider flex items-center gap-1.5">
                      <span>👩 Maklumat Ibu</span>
                    </h4>
                    {candidate.telefonIbu && (
                      <div className="flex items-center gap-1">
                        <a 
                          href={`tel:${candidate.telefonIbu}`}
                          className="p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
                          title="Hubungi Ibu"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href={`https://wa.me/${formatPhoneForWa(candidate.telefonIbu)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                          title="WhatsApp Ibu"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 text-xs block">Nama Ibu</span>
                      <span className="font-bold text-slate-800">{candidate.namaIbu || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-xs block">No. KP Ibu</span>
                        <span className="font-mono font-semibold text-slate-700">{candidate.icIbu || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">No. Telefon</span>
                        <span className="font-mono font-bold text-pink-700">{candidate.telefonIbu || '-'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-xs block">Pekerjaan</span>
                        <span className="font-medium text-slate-700">{candidate.pekerjaanIbu || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Warganegara</span>
                        <span className="font-medium text-slate-700">{candidate.warganegaraIbu || 'WARGANEGARA'}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: KEPUTUSAN UPKK & PBD */}
          {activeTab === 'AKADEMIK' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Seksyen UPKK */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Ujian Penilaian Kelas Kafa (UPKK)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Keputusan peperiksaan KAFA 8/9 subjek utama</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black rounded-lg text-xs border border-emerald-300">
                      {countA}A {countB}B {countC}C
                    </span>
                    {candidate.upkk?.slipUrl && (
                      <a 
                        href={candidate.upkk.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Slip UPKK <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Grid 9 Subjek UPKK */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Al-Quran', val: candidate.upkk?.alquran },
                    { label: 'Ulum Syariah (Akidah)', val: candidate.upkk?.akidah },
                    { label: 'Sirah', val: candidate.upkk?.sirah },
                    { label: 'Adab (Akhlak)', val: candidate.upkk?.adab },
                    { label: 'Jawi & Khat', val: candidate.upkk?.jawikhat },
                    { label: 'Bahasa Arab', val: candidate.upkk?.bahasaarab },
                    { label: 'Ibadah', val: candidate.upkk?.ibadah },
                    { label: 'PCHI', val: candidate.upkk?.penghayatancarahidupislam },
                    { label: 'Amali Solat', val: candidate.upkk?.amalisolat },
                  ].map((sub, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
                      <span className="text-[11px] font-semibold text-slate-500 block truncate" title={sub.label}>
                        {sub.label}
                      </span>
                      <div className="mt-1 flex items-center justify-center">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border ${getGradeColor(sub.val)}`}>
                          {sub.val || '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seksyen PBD Tahun 5 & Tahun 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PBD Tahun 5 */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Pentaksiran Bilik Darjah (PBD Tahun 5)
                    </h4>
                    {candidate.pbd?.slipUrl && (
                      <a 
                        href={candidate.pbd.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        Slip T5 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: 'Bahasa Melayu', val: candidate.pbd?.bm },
                      { name: 'Bahasa Inggeris', val: candidate.pbd?.bi },
                      { name: 'Matematik', val: candidate.pbd?.matematik },
                      { name: 'Sains', val: candidate.pbd?.sains },
                    ].map((p, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-600 font-medium truncate">{p.name}</span>
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {p.val || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PBD Tahun 6 */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Pentaksiran Bilik Darjah (PBD Tahun 6)
                    </h4>
                    {candidate.pbdD6?.slipUrl && (
                      <a 
                        href={candidate.pbdD6.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        Slip T6 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: 'Bahasa Melayu', val: candidate.pbdD6?.bm },
                      { name: 'Bahasa Inggeris', val: candidate.pbdD6?.bi },
                      { name: 'Matematik', val: candidate.pbdD6?.matematik },
                      { name: 'Sains', val: candidate.pbdD6?.sains },
                    ].map((p, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-600 font-medium truncate">{p.name}</span>
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {p.val || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PENILAIAN TEMUDUGA & MERIT */}
          {activeTab === 'PENILAIAN' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Kad Rumusan Markah & Ranking */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Rumusan Skor Penilaian Akhir (Merit)
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {candidate.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Jumlah Markah</span>
                      <span className="text-xl sm:text-2xl font-black text-amber-300">
                        {grandTotal} <span className="text-xs font-normal text-slate-300">/{totalMax}</span>
                      </span>
                    </div>

                    <div className="text-center px-4 py-2 bg-emerald-600/30 rounded-xl border border-emerald-400/30">
                      <span className="text-[10px] text-emerald-200 uppercase block font-semibold">Peratusan (%)</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-300">
                        {calculatedPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 Lajur: Tahfiz & Akademik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Penilaian Tahfiz */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200">
                    <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                      📖 Ujian Tahfiz (Maks: {tahfizMax})
                    </h4>
                    <span className="text-base font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                      {tahfizScore !== undefined ? `${tahfizScore} / ${tahfizMax}` : 'Belum Dinilai'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Butiran Pecahan jika ada */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Hafazan</span>
                        <span className="font-extrabold text-emerald-800 text-sm">
                          {candidate.markahTahfiz?.hafazan ?? '-'}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Tilawah</span>
                        <span className="font-extrabold text-emerald-800 text-sm">
                          {candidate.markahTahfiz?.tilawah ?? '-'}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-slate-500 block">Sahsiah</span>
                        <span className="font-extrabold text-emerald-800 text-sm">
                          {candidate.markahTahfiz?.sahsiah ?? '-'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/60 text-xs">
                      <span className="text-slate-400 block">Dinilai Oleh:</span>
                      <span className="font-bold text-slate-800 uppercase">
                        {candidate.markahTahfiz?.dinilaiOleh || 'Tiada maklumat penilai'}
                      </span>
                      {candidate.markahTahfiz?.tarikhDinilai && (
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Tarikh: {new Date(candidate.markahTahfiz.tarikhDinilai).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {candidate.markahTahfiz?.catatan && (
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-xs">
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Catatan Penilai:</span>
                        <p className="text-slate-700 italic mt-0.5">{candidate.markahTahfiz.catatan}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Penilaian Akademik */}
                <div className="bg-blue-50/50 rounded-2xl p-4 sm:p-5 border border-blue-200">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-200">
                    <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                      📝 Ujian Akademik (Maks: {akademikMax})
                    </h4>
                    <span className="text-base font-black text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-300 shadow-2xs">
                      {akademikScore !== undefined ? `${akademikScore} / ${akademikMax}` : 'Belum Dinilai'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Pecahan Akademik - Berdasarkan Komponen Penilaian Sebenar (Matematik & Sains) */}
                    {(() => {
                      const items = settings.akademikItems && settings.akademikItems.length > 0 
                        ? settings.akademikItems 
                        : [
                            { id: 'matematik', name: 'Matematik', weight: 20 },
                            { id: 'sains', name: 'Sains', weight: 20 }
                          ];
                      
                      const getSubjectScore = (id: string, name: string) => {
                        if (!candidate.markahAkademik) return '-';
                        if (candidate.markahAkademik[id] !== undefined && candidate.markahAkademik[id] !== null) {
                          return candidate.markahAkademik[id];
                        }
                        if (id === 'sains' || name.toLowerCase().includes('sains')) {
                          if (candidate.markahAkademik.sains !== undefined) return candidate.markahAkademik.sains;
                          if (candidate.markahAkademik.a_1791595296044 !== undefined) return candidate.markahAkademik.a_1791595296044;
                        }
                        if (id === 'matematik' || name.toLowerCase().includes('matematik')) {
                          if (candidate.markahAkademik.matematik !== undefined) return candidate.markahAkademik.matematik;
                        }
                        return '-';
                      };

                      return (
                        <div className="grid grid-cols-2 gap-2.5 text-center">
                          {items.map((item) => {
                            const val = getSubjectScore(item.id, item.name);
                            return (
                              <div key={item.id} className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs">
                                <span className="text-[11px] font-bold text-slate-500 block uppercase">
                                  {item.name} ({item.weight}m)
                                </span>
                                <span className="font-black text-blue-800 text-base sm:text-lg block mt-0.5">
                                  {val !== '-' ? `${val} / ${item.weight}` : '-'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    <div className="pt-2 border-t border-blue-200/60 text-xs">
                      <span className="text-slate-400 block">Dinilai Oleh:</span>
                      <span className="font-bold text-slate-800 uppercase">
                        {candidate.markahAkademik?.dinilaiOleh || 'Tiada maklumat penilai'}
                      </span>
                      {candidate.markahAkademik?.tarikhDinilai && (
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Tarikh: {new Date(candidate.markahAkademik.tarikhDinilai).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {candidate.markahAkademik?.catatan && (
                      <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200 text-xs">
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Catatan Penilai:</span>
                        <p className="text-slate-700 italic mt-0.5">{candidate.markahAkademik.catatan}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: DOKUMEN & LAMPIRAN */}
          {activeTab === 'DOKUMEN' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Kad Gambar Calon */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-slate-700 mb-2">Foto Pasport Calon</span>
                  <div className="w-24 h-32 rounded-xl bg-slate-200 overflow-hidden border border-slate-300 shadow-sm flex items-center justify-center">
                    {candidate.gambarUrl ? (
                      <img src={candidate.gambarUrl} alt="Foto" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">Tiada foto</span>
                    )}
                  </div>
                  {candidate.gambarUrl && (
                    <button 
                      type="button" 
                      onClick={() => setPreviewPhotoFull(true)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat Penuh
                    </button>
                  )}
                </div>

                {/* Kad Slip UPKK */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Slip Keputusan UPKK</span>
                    <p className="text-[11px] text-slate-400 mt-1">Dokumen sokongan keputusan peperiksaan UPKK</p>
                  </div>
                  <div className="my-4">
                    {candidate.upkk?.slipUrl ? (
                      <FileText className="w-12 h-12 text-emerald-600 mx-auto" />
                    ) : (
                      <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    )}
                  </div>
                  {candidate.upkk?.slipUrl ? (
                    <a 
                      href={candidate.upkk.slipUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Slip UPKK
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Tiada fail slip dimuat naik</span>
                  )}
                </div>

                {/* Kad Slip PBD */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Slip Pentaksiran PBD</span>
                    <p className="text-[11px] text-slate-400 mt-1">Laporan bilik darjah sekolah rendah</p>
                  </div>
                  <div className="my-4">
                    {candidate.pbd?.slipUrl || candidate.pbdD6?.slipUrl ? (
                      <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                    ) : (
                      <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    {candidate.pbd?.slipUrl && (
                      <a 
                        href={candidate.pbd.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Slip PBD Tahun 5
                      </a>
                    )}
                    {candidate.pbdD6?.slipUrl && (
                      <a 
                        href={candidate.pbdD6.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Slip PBD Tahun 6
                      </a>
                    )}
                    {!candidate.pbd?.slipUrl && !candidate.pbdD6?.slipUrl && (
                      <span className="text-xs text-slate-400 italic">Tiada fail slip dimuat naik</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* FOOTER KAD: BUTANG TINDAKAN PANTAS */}
        <div className="p-3 sm:p-4 bg-slate-100/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            ID Calon: <span className="font-mono text-slate-700">{candidate.id || candidate.ic}</span> &bull; Status: <span className="font-bold text-slate-700">{candidate.statusBorang || 'LENGKAP'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {onPrint && (
              <button 
                type="button"
                onClick={() => onPrint(candidate)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
                title="Cetak Borang Permohonan Lengkap"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                Cetak Borang
              </button>
            )}

            {onEdit && (
              <button 
                type="button"
                onClick={() => onEdit(candidate)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
                title="Kemaskini Data Calon"
              >
                <Edit className="w-4 h-4" />
                Kemaskini
              </button>
            )}

            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>

    </div>,
    document.body
  );
}

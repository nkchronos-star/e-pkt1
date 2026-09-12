import { useState } from 'react';
import { useAppContext } from '../../store';
import { Search, Printer, Calendar, XCircle, CheckCircle2 } from 'lucide-react';
import { Candidate } from '../../types';
import SuratPanggilan from './SuratPanggilan';

export default function SemakTemuduga() {
  const { settings, candidates } = useAppContext();
  const [ic, setIc] = useState('');
  const [result, setResult] = useState<Candidate | null | 'NOT_FOUND'>(null);
  
  const isBuka = settings.temudugaBuka;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ic) return;
    
    const candidate = candidates.find(c => c.ic === ic);
    if (candidate) {
      setResult(candidate);
    } else {
      setResult('NOT_FOUND');
    }
  };

  const formatTarikh = (tarikhStr: string) => {
     if(!tarikhStr) return '-';
     const d = new Date(tarikhStr);
     if(isNaN(d.getTime())) return tarikhStr;
     const day = String(d.getDate()).padStart(2, '0');
     const month = d.toLocaleDateString('ms-MY', { month: 'long' });
     const year = d.getFullYear();
     return `${day} - ${month} - ${year}`;
  };

  if (!isBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Semakan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Semakan kelayakan temuduga belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh semakan akan dibuka: <span className="font-semibold">{formatTarikh(settings.tarikhBukaTemuduga)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10 no-print">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
           <Search className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Semakan Kelayakan Temuduga</h1>
        <p className="text-slate-500 text-lg">Sila masukkan Nombor Kad Pengenalan pemohon tanpa sempang (-) untuk menyemak kelayakan.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 p-6 sm:p-10 mb-8 no-print">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="ic" className="sr-only">No. Kad Pengenalan</label>
            <input 
              type="text" 
              id="ic"
              placeholder="Contoh: 140101061234"
              className="w-full text-lg border-2 border-slate-200 rounded-xl px-5 py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
              value={ic}
              onChange={(e) => setIc(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5" /> Semak
          </button>
        </form>
      </div>

      {result === 'NOT_FOUND' && (
        <div className="bg-red-50 text-red-900 p-8 rounded-[2rem] border border-red-100 text-center animate-in slide-in-from-bottom-4 shadow-lg shadow-red-100/50 no-print">
           <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
             <XCircle className="w-10 h-10 text-red-500" />
           </div>
           <p className="font-bold text-lg">Maaf, rekod tidak ditemui. Sila pastikan No. Kad Pengenalan yang dimasukkan adalah betul.</p>
        </div>
      )}

      {result && result !== 'NOT_FOUND' && (
        <div className="animate-in slide-in-from-bottom-4">
          {result.statusTemuduga === 'LAYAK' ? (
            <div>
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-200/50 border border-emerald-100 overflow-hidden text-center relative mb-8 no-print transition-transform hover:-translate-y-1">
                 <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white">
                    <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-emerald-100 drop-shadow-lg" />
                    <h2 className="text-3xl font-extrabold tracking-tight">TAHNIAH!</h2>
                 </div>
                 <div className="p-10">
                   <p className="text-lg text-slate-700 mb-8 leading-relaxed font-medium">
                     Anda berjaya ke peringkat temuduga bagi pengambilan <br/>
                     pelajar tingkatan 1 Tahun 2027 di <strong className="text-emerald-700">SMA Kota Gelanggi 3</strong>
                   </p>
                   
                   <p className="text-slate-500 mb-10 max-w-lg mx-auto">
                     Sila cetak <strong>Surat Panggilan Temuduga</strong> di bawah dan bawa bersama semasa pendaftaran temuduga.
                   </p>
                   <button 
                     onClick={() => window.print()}
                     className="inline-flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
                   >
                     <Printer className="w-5 h-5" /> Cetak Surat Panggilan
                   </button>
                 </div>
              </div>
              
              <div className="mt-12">
                 <div className="text-center mb-4 no-print text-sm font-bold text-slate-400 uppercase tracking-widest">Pratonton Surat</div>
                 <SuratPanggilan candidate={result} />
              </div>
            </div>
          ) : result.statusTemuduga === 'TIDAK_LAYAK' ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-red-100/50 border border-red-100 p-12 text-center relative overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
               <div className="inline-flex p-4 bg-red-50 rounded-full mb-6">
                 <XCircle className="w-16 h-16 text-red-500" />
               </div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">MAAF!</h2>
               <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto font-medium">
                 Anda <strong className="text-red-600">tidak layak</strong> ke peringkat temuduga bagi pengambilan <br/>
                 pelajar tingkatan 1 Tahun 2027 di SMA Kota Gelanggi 3.
               </p>
               <div className="mt-10 pt-8 border-t border-slate-100 text-sm text-slate-400 font-medium">
                 {result.name} ({result.ic})
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border border-emerald-100 p-12 text-center relative overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
               <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Dalam Proses Penilaian</h2>
               <p className="text-slate-600 leading-relaxed max-w-lg mx-auto font-medium text-lg">
                 Status kelayakan anda masih dalam proses penilaian oleh pihak pengurusan. Sila semak semula nanti.
               </p>
               <div className="mt-10 pt-8 border-t border-slate-100 text-sm text-slate-400 font-medium">
                 {result.name} ({result.ic})
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

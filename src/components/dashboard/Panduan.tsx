import { Info, CheckCircle, FileText, Calendar } from 'lucide-react';
import { useAppContext } from '../../store';

export default function Panduan() {
  const { infographics, settings } = useAppContext();

  return (
    <div className="animate-in fade-in duration-500 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
           <Info className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Panduan Permohonan</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Sila baca panduan ini dengan teliti sebelum memulakan permohonan. Pastikan semua maklumat yang diisi adalah tepat dan benar.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-emerald-50 to-indigo-50/50 border-b border-emerald-100 p-8 flex items-center gap-4">
          <div className="bg-emerald-100 p-2.5 rounded-xl">
             <Calendar className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-950">Proses Kemasukan</h2>
        </div>
        
        <div className="p-8 md:p-12">
          {settings.panduanContent ? (
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                  {settings.panduanContent}
              </div>
          ) : (
          <div className="relative border-l-[3px] border-slate-100 ml-4 md:ml-8 space-y-14">
            
            <div className="relative pl-10 md:pl-12 group">
              <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-slate-500 ring-[6px] ring-white transition-transform group-hover:scale-125"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Langkah 1: Isi Borang Permohonan</h3>
              <p className="text-slate-600 mb-5 leading-relaxed">Ibu bapa atau penjaga perlu mengisi borang permohonan secara atas talian. Pastikan semua maklumat peribadi, maklumat penjaga, dan maklumat akademik diisi dengan lengkap dan tepat.</p>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 mb-5">
                <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600"/> Dokumen Diperlukan (Softcopy):</h4>
                <ul className="grid sm:grid-cols-2 gap-2 pl-2 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>Gambar Pasport Pemohon</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed"><strong>Peringatan Penting:</strong> Sila cetak salinan <strong>BORANG PERMOHONAN KEMASUKAN</strong> setelah permohonan dihantar. Borang ini wajib dibawa semasa sesi temuduga bagi calon yang berjaya dipanggil.</p>
              </div>
            </div>
            <div className="relative pl-10 md:pl-12 group">
              <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-slate-200 ring-[6px] ring-white transition-colors group-hover:bg-slate-300"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Langkah 2: Semakan Kelayakan Temuduga</h3>
              <p className="text-slate-600 leading-relaxed">Pihak sekolah akan menapis permohonan. Calon boleh menyemak status kelayakan temuduga melalui sistem ini setelah tarikh semakan diumumkan. Calon yang berjaya perlu mencetak surat panggilan temuduga.</p>
            </div>
            <div className="relative pl-10 md:pl-12 group">
              <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-slate-200 ring-[6px] ring-white transition-colors group-hover:bg-slate-300"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Langkah 3: Sesi Temuduga</h3>
              <p className="text-slate-600 leading-relaxed">Calon perlu hadir ke sesi temuduga bersama ibu bapa/penjaga pada tarikh, masa dan tempat yang telah ditetapkan di dalam Surat Panggilan Temuduga tersebut.</p>
            </div>
            <div className="relative pl-10 md:pl-12 group">
              <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-slate-200 ring-[6px] ring-white transition-colors group-hover:bg-slate-300"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Langkah 4: Semakan Tawaran</h3>
              <p className="text-slate-600 leading-relaxed">Keputusan akhir akan diumumkan. Calon yang berjaya mesti mengesahkan penerimaan tawaran (Terima/Tolak) dalam tempoh yang ditetapkan dan mencetak Surat Tawaran untuk hari pendaftaran.</p>
            </div>

          </div>
          )}
        </div>
      </div>

      {infographics && infographics.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-emerald-600" /> Infografik Panduan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infographics.map((info) => (
              <div key={info.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img src={info.url} alt={info.title} className="w-full h-auto object-contain bg-slate-50" />
                <div className="p-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800">{info.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-[2rem] border border-emerald-100 p-10 text-center shadow-lg shadow-emerald-100/20">
        <div className="inline-flex p-4 bg-emerald-200/50 rounded-2xl mb-6">
           <Info className="w-8 h-8 text-emerald-700" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-950 mb-3">Maklumat Penting</h3>
        <p className="text-emerald-700 max-w-2xl mx-auto font-medium leading-relaxed">
          Sila pastikan anda sentiasa menyemak sistem ini untuk mengetahui tarikh-tarikh penting permohonan. Jika ada sebarang pertanyaan, sila hubungi pejabat SMAG3.
        </p>
      </div>
    </div>
  );
}

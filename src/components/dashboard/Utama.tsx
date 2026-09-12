import { CheckCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../store';

interface UtamaProps {
  onNavigate: (view: any) => void;
}

export default function Utama({ onNavigate }: UtamaProps) {
  const { settings } = useAppContext();
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Top Grid: Pengenalan & Video */}
            {/* Top Grid: Pengenalan, Video, Infografik */}
            {/* Top Section: Pengenalan */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-emerald-700 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Pengenalan</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm">
          {settings.utamaContent ? (
              <div className="whitespace-pre-wrap">{settings.utamaContent}</div>
          ) : (
              <>
                <p>
                  Matlamat utama pelaksanaan Kurikulum Bersepadu Tahfiz (KBT) di SMAG3 adalah untuk melahirkan golongan profesional, teknokrat dan usahawan hafiz yang mengamalkan ajaran Islam (mutadayyin) dan memiliki pelbagai kemahiran ilmu selaras dengan Falsafah Pendidikan Negara.
                </p>
                <p className="font-bold text-slate-800 pt-2">Pelaksanaan KBT diharap dapat melahirkan:</p>
                <ol className="list-decimal list-outside ml-5 space-y-2">
                  <li>Menghafaz 30 juzuk Al-Quran.</li>
                  <li>Profesional dengan asas keagamaan mantap berlandaskan Al-Quran dan Al-Sunnah.</li>
                  <li>Memaksimumkan keupayaan berfikir aras tinggi, kreatif dan inovatif.</li>
                  <li>Hubungan baik dengan Allah, manusia dan alam sekitar.</li>
                </ol>
              </>
          )}
        </div>
      </div>

      {/* Middle Grid: Video & Infografik bersebelahan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card: Video Korporat */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-red-600 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Video Korporat</h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative min-h-[300px] shadow-inner">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/JT6Py5iXp1g?si=VRrKskCawUxW1W1B" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>

        {/* Card: Infografik */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-amber-500 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex justify-between items-center">
            Info SMAG3
            <a href="https://www.facebook.com/SMAKG03/" target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1 font-bold transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              Facebook
            </a>
          </h2>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px] shadow-inner border border-slate-200">
            <img src="https://i.postimg.cc/yNK9VCKH/infografik.png" alt="Infografik SMAG3" className="absolute inset-0 w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer" onClick={() => window.open('https://tinyurl.com/y5h7jxxx', '_blank')} referrerPolicy="no-referrer" />
            
            {/* Fallback jika gambar tiada */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none -z-10">
               <span className="text-sm font-medium">Memuatkan infografik...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Mata Pelajaran Ditawarkan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Menengah Bawah */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">Menengah Bawah</h3>
          <p className="text-slate-500 font-medium mb-6 text-sm">Tingkatan 1 - 3</p>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                 Teras
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Bahasa Melayu</li>
                <li>&bull; Sains</li>
                <li>&bull; Bahasa Inggeris</li>
                <li>&bull; Sejarah</li>
                <li>&bull; Bahasa Arab</li>
                <li>&bull; Pendidikan Islam</li>
                <li>&bull; Matematik</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-emerald-400 rounded-full"></div>
                 Wajib
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Pend. Jasmani & Kesihatan</li>
                <li>&bull; Geografi</li>
                <li>&bull; Reka Bentuk Teknologi</li>
                <li>&bull; Pendidikan Seni Visual</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div>
                 Tahfiz
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Hifz Al-Quran</li>
                <li>&bull; Maharat Al-Quran</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Menengah Atas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Menengah Atas</h3>
          <p className="text-slate-500 font-medium mb-6 text-sm">Tingkatan 4 - 5</p>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                 Teras
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Bahasa Melayu</li>
                <li>&bull; Sains</li>
                <li>&bull; Bahasa Inggeris</li>
                <li>&bull; Sejarah</li>
                <li>&bull; Bahasa Arab</li>
                <li>&bull; Matematik</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-blue-400 rounded-full"></div>
                 Wajib
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Pend. Jasmani & Kesihatan</li>
                <li>&bull; Perniagaan</li>
                <li>&bull; Pendidikan Islam</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                 Tahfiz
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                <li>&bull; Hifz Al-Quran</li>
                <li>&bull; Maharat Al-Quran</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

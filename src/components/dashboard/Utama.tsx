import {
  useAppContext,
  DEFAULT_PENGENALAN_ITEMS,
  DEFAULT_VIDEO_KORPORAT_ITEMS,
  DEFAULT_INFO_SMAG3_ITEMS,
  DEFAULT_SUBJEK_MENENGAH_BAWAH,
  DEFAULT_SUBJEK_MENENGAH_ATAS,
} from '../../store';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';

interface UtamaProps {
  onNavigate: (view: any) => void;
}

export function normalizeYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  return trimmed;
}

export default function Utama({ onNavigate: _onNavigate }: UtamaProps) {
  const { settings } = useAppContext();

  const pengenalanItems =
    Array.isArray(settings.pengenalanItems) && settings.pengenalanItems.length > 0
      ? settings.pengenalanItems
      : DEFAULT_PENGENALAN_ITEMS;

  const videoItems =
    Array.isArray(settings.videoKorporatItems) && settings.videoKorporatItems.length > 0
      ? settings.videoKorporatItems
      : DEFAULT_VIDEO_KORPORAT_ITEMS;

  const infoItems =
    Array.isArray(settings.infoSmag3Items) && settings.infoSmag3Items.length > 0
      ? settings.infoSmag3Items
      : DEFAULT_INFO_SMAG3_ITEMS;

  const subjekBawah =
    Array.isArray(settings.subjekMenengahBawah) && settings.subjekMenengahBawah.length > 0
      ? settings.subjekMenengahBawah
      : DEFAULT_SUBJEK_MENENGAH_BAWAH;

  const subjekAtas =
    Array.isArray(settings.subjekMenengahAtas) && settings.subjekMenengahAtas.length > 0
      ? settings.subjekMenengahAtas
      : DEFAULT_SUBJEK_MENENGAH_ATAS;

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Top Section: Pengenalan */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-emerald-700 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Pengenalan</h2>
        <div className="text-slate-600 space-y-4 leading-relaxed text-sm">
          {settings.utamaContent && settings.utamaContent.trim() ? (
            <div className="whitespace-pre-wrap">{settings.utamaContent}</div>
          ) : (
            (() => {
              const paragraphs = pengenalanItems.filter((i) => i.type === 'PARAGRAPH');
              const lists = pengenalanItems.filter((i) => i.type === 'LIST_ITEM');
              return (
                <>
                  {paragraphs.map((p) => (
                    <p key={p.id} className="leading-relaxed">
                      {p.text}
                    </p>
                  ))}
                  {lists.length > 0 && (
                    <>
                      <p className="font-bold text-slate-800 pt-2">
                        Pelaksanaan KBT diharap dapat melahirkan:
                      </p>
                      <ol className="list-decimal list-outside ml-5 space-y-2">
                        {lists.map((l) => (
                          <li key={l.id}>{l.text}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </>
              );
            })()
          )}
        </div>
      </div>

      {/* Middle Grid: Video & Infografik bersebelahan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card: Video Korporat */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-red-600 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Video Korporat</h2>
          <div className="space-y-4 flex-1 flex flex-col">
            {videoItems.map((vid) => (
              <div key={vid.id} className="flex-1 flex flex-col">
                {videoItems.length > 1 && vid.title && (
                  <p className="text-xs font-bold text-slate-600 mb-2">{vid.title}</p>
                )}
                <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative min-h-[300px] shadow-inner">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={normalizeYoutubeEmbedUrl(vid.embedUrl)}
                    title={vid.title || 'Video Korporat'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Info SMAG3 */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 border-t-[6px] border-t-amber-500 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex justify-between items-center">
            <span>Info SMAG3</span>
            {infoItems[0]?.facebookUrl && (
              <a
                href={infoItems[0].facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1 font-bold transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Facebook
              </a>
            )}
          </h2>
          <div className="space-y-4 flex-1 flex flex-col">
            {infoItems.map((inf) => (
              <div key={inf.id} className="flex-1 flex flex-col">
                {infoItems.length > 1 && inf.title && (
                  <p className="text-xs font-bold text-slate-600 mb-2">{inf.title}</p>
                )}
                <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative min-h-[300px] shadow-inner border border-slate-200">
                  {inf.linkUrl ? (
                    <a
                      href={inf.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 w-full h-full block"
                    >
                      <img
                        src={inf.imageUrl}
                        alt={inf.title || 'Infografik SMAG3'}
                        className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  ) : (
                    <img
                      src={inf.imageUrl}
                      alt={inf.title || 'Infografik SMAG3'}
                      className="absolute inset-0 w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none -z-10">
                    <span className="text-sm font-medium">Memuatkan infografik...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paparan Aplikasi Mesra Peranti (Telefon, Tablet, Laptop - Untuk Calon & Penilai) */}
      <PWAInstallPrompt variant="card" />

      {/* Subjects Section */}
      <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Mata Pelajaran Ditawarkan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Menengah Bawah */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">Menengah Bawah</h3>
          <p className="text-slate-500 font-medium mb-6 text-sm">Tingkatan 1 - 3</p>

          <div className="space-y-6">
            {subjekBawah.map((kat, idx) => (
              <div key={kat.id}>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <div
                    className={`w-1.5 h-4 rounded-full ${
                      idx % 3 === 0
                        ? 'bg-emerald-500'
                        : idx % 3 === 1
                        ? 'bg-emerald-400'
                        : 'bg-emerald-600'
                    }`}
                  ></div>
                  {kat.kategori}
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                  {(kat.subjek || []).map((subj, sIdx) => (
                    <li key={sIdx}>&bull; {subj}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Menengah Atas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Menengah Atas</h3>
          <p className="text-slate-500 font-medium mb-6 text-sm">Tingkatan 4 - 5</p>

          <div className="space-y-6">
            {subjekAtas.map((kat, idx) => (
              <div key={kat.id}>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <div
                    className={`w-1.5 h-4 rounded-full ${
                      idx % 3 === 0
                        ? 'bg-blue-500'
                        : idx % 3 === 1
                        ? 'bg-blue-400'
                        : 'bg-blue-600'
                    }`}
                  ></div>
                  {kat.kategori}
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-slate-600 text-sm">
                  {(kat.subjek || []).map((subj, sIdx) => (
                    <li key={sIdx}>&bull; {subj}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

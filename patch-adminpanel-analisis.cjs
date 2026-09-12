const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const componentCode = `
function AnalisisKemasukan({ candidates }: { candidates: any[] }) {
  const permohonan = candidates;
  const permohonanL = permohonan.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const permohonanP = permohonan.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const ditawarkan = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  const ditawarkanL = ditawarkan.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const ditawarkanP = ditawarkan.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const terima = ditawarkan.filter(c => c.maklumBalasTawaran === 'TERIMA');
  const terimaL = terima.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const terimaP = terima.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const tolak = ditawarkan.filter(c => c.maklumBalasTawaran === 'TOLAK');
  const tolakL = tolak.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const tolakP = tolak.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  const belum = ditawarkan.filter(c => !c.maklumBalasTawaran);
  const belumL = belum.filter(c => c.jantina?.toUpperCase() === 'LELAKI').length;
  const belumP = belum.filter(c => c.jantina?.toUpperCase() === 'PEREMPUAN').length;

  return (
    <div className="mb-12 mt-4">
      <h4 className="font-bold text-lg text-slate-800 mb-4">Analisis Kemasukan Tahun Semasa</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-slate-500 font-bold mb-2 uppercase tracking-wide text-sm">Jumlah Permohonan</div>
            <div className="text-5xl font-extrabold text-slate-800 mb-2">{permohonan.length}</div>
            <div className="text-slate-500 font-bold">(L: {permohonanL} / P: {permohonanP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-sm">Jumlah Ditawarkan</div>
            <div className="text-5xl font-extrabold text-blue-600 mb-2">{ditawarkan.length}</div>
            <div className="text-blue-600/80 font-bold">(L: {ditawarkanL} / P: {ditawarkanP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-emerald-600 font-bold mb-2 uppercase tracking-wide text-sm">Tawaran Diterima</div>
            <div className="text-5xl font-extrabold text-emerald-600 mb-2">{terima.length}</div>
            <div className="text-emerald-600/80 font-bold">(L: {terimaL} / P: {terimaP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-red-600 font-bold mb-2 uppercase tracking-wide text-sm">Tawaran Ditolak</div>
            <div className="text-5xl font-extrabold text-red-600 mb-2">{tolak.length}</div>
            <div className="text-red-600/80 font-bold">(L: {tolakL} / P: {tolakP})</div>
         </div>
         <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm text-center flex flex-col justify-center items-center">
            <div className="text-amber-600 font-bold mb-2 uppercase tracking-wide text-sm">Belum Maklum Balas</div>
            <div className="text-5xl font-extrabold text-amber-600 mb-2">{belum.length}</div>
            <div className="text-amber-600/80 font-bold">(L: {belumL} / P: {belumP})</div>
         </div>
      </div>
    </div>
  );
}
`;

// Insert the component before function PentadbirView
code = code.replace(/function PentadbirView\(\) \{/, componentCode + '\nfunction PentadbirView() {');

// Insert the component rendering inside PentadbirView
const pentadbirRenderTarget = `{/* Analisa Demografi */}`;
const pentadbirRenderReplace = `<AnalisisKemasukan candidates={candidates} />\n       {/* Analisa Demografi */}`;
code = code.replace(pentadbirRenderTarget, pentadbirRenderReplace);

// Insert the component rendering inside SuperAdminView
const superAdminRenderTarget = `{activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-500" />
                <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
             </div>`;
const superAdminRenderReplace = `{activeTab === 'PERMOHONAN' && (
          <div className="space-y-6 animate-in fade-in">
             <AnalisisKemasukan candidates={candidates} />
             <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-500" />
                <h3 className="text-xl font-bold">Senarai Keseluruhan Permohonan</h3>
             </div>`;
code = code.replace(superAdminRenderTarget, superAdminRenderReplace);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx with AnalisisKemasukan");

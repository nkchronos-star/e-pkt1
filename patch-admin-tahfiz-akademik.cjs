const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// Replace TahfizView State Initialization
code = code.replace(
  `const [markah, setMarkah] = useState({ hafazan: 0, tilawah: 0, sahsiah: 0 });`,
  `const [markah, setMarkah] = useState({ jumlah: 0, catatan: '' });`
);

code = code.replace(
  `setMarkah({ hafazan: 0, tilawah: 0, sahsiah: 0 });`,
  `setMarkah({ jumlah: 0, catatan: '' });`
);

code = code.replace(
  `{setSelectedCandidate(e.target.value); setMarkah({hafazan:0, tilawah:0, sahsiah:0});}`,
  `{setSelectedCandidate(e.target.value); setMarkah({jumlah:0, catatan:''});}`
);

// Replace TahfizView handleSubmit markahTahfiz saving
code = code.replace(
  `    updateCandidate(targetIc, {
      markahTahfiz: {
        ...markah,
        jumlah: Number(markah.hafazan) + Number(markah.tilawah) + Number(markah.sahsiah),
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: today
      }
    });`,
  `    updateCandidate(targetIc, {
      markahTahfiz: {
        jumlah: Number(markah.jumlah),
        catatan: markah.catatan,
        dinilaiOleh: currentUser?.name,
        tarikhDinilai: today
      }
    });`
);

// Replace TahfizView startEdit
code = code.replace(
  `     setMarkah({
        hafazan: c.markahTahfiz.hafazan || 0,
        tilawah: c.markahTahfiz.tilawah || 0,
        sahsiah: c.markahTahfiz.sahsiah || 0
     });`,
  `     setMarkah({
        jumlah: c.markahTahfiz.jumlah || 0,
        catatan: c.markahTahfiz.catatan || ''
     });`
);

// Replace TahfizView Info Card
const oldInfoCard = `<div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-1">Maklumat Calon:</span>
                  <span className="font-extrabold text-2xl text-slate-900 block mb-1">{currentC.name}</span>
                  <span className="font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-md inline-block">{currentC.ic}</span>
               </div>`;

const newInfoCard = `<div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50 flex gap-6 items-start flex-col sm:flex-row">
                  {currentC.gambarUrl ? (
                     <img src={currentC.gambarUrl} alt={currentC.name} className="w-24 h-32 object-cover rounded-xl border border-slate-200 shrink-0" />
                  ) : (
                     <div className="w-24 h-32 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium shrink-0 border border-slate-200">Tiada Gambar</div>
                  )}
                  <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-1">Maklumat Calon:</span>
                    <span className="font-extrabold text-2xl text-slate-900 block mb-1">{currentC.name}</span>
                    <span className="font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-md inline-block mb-3">{currentC.ic}</span>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p><span className="font-bold">Asal:</span> {currentC.daerah}, {currentC.negeri}</p>
                       <p><span className="font-bold">Sekolah:</span> {currentC.namaSekolahRendah}</p>
                       <p><span className="font-bold">Status Borang:</span> {currentC.statusBorang}</p>
                    </div>
                  </div>
               </div>`;

code = code.replace(oldInfoCard, newInfoCard);

// Replace TahfizView Form (Isi)
const oldTahfizForm1 = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Hafazan (70%)</label>
                      <input type="number" max="70" min="0" required value={markah.hafazan} onChange={e=>setMarkah({...markah, hafazan: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tilawah (25%)</label>
                      <input type="number" max="25" min="0" required value={markah.tilawah} onChange={e=>setMarkah({...markah, tilawah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sahsiah (5%)</label>
                      <input type="number" max="5" min="0" required value={markah.sahsiah} onChange={e=>setMarkah({...markah, sahsiah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Jumlah Keseluruhan</label>
                      <input type="text" readOnly value={Number(markah.hafazan) + Number(markah.tilawah) + Number(markah.sahsiah)} className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-100 font-extrabold text-xl text-slate-900" />
                    </div>
                  </div>`;

const newTahfizForm1 = `<div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Markah Keseluruhan Temuduga (0-100)</label>
                      <input type="number" max="100" min="0" required value={markah.jumlah} onChange={e=>setMarkah({...markah, jumlah: Number(e.target.value)})} className="w-full sm:w-1/2 p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                      <p className="text-xs text-slate-500 mt-2">Ditetapkan oleh admin kerana format pemarkahan masih dalam perbincangan.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Catatan / Ulasan Penemuduga</label>
                      <textarea value={markah.catatan} onChange={e=>setMarkah({...markah, catatan: e.target.value})} className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white text-slate-800 transition-all min-h-[120px]" placeholder="Masukkan komen atau ulasan tentang calon..." />
                    </div>
                  </div>`;
                  
code = code.replace(oldTahfizForm1, newTahfizForm1);

// Replace TahfizView Form (Edit)
const oldTahfizFormEdit = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Hafazan (70%)</label>
                          <input type="number" max="70" min="0" required value={markah.hafazan} onChange={e=>setMarkah({...markah, hafazan: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tilawah (25%)</label>
                          <input type="number" max="25" min="0" required value={markah.tilawah} onChange={e=>setMarkah({...markah, tilawah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sahsiah (5%)</label>
                          <input type="number" max="5" min="0" required value={markah.sahsiah} onChange={e=>setMarkah({...markah, sahsiah: Number(e.target.value)})} className="w-full p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                      </div>`;

const newTahfizFormEdit = `<div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Markah Keseluruhan (0-100)</label>
                          <input type="number" max="100" min="0" required value={markah.jumlah} onChange={e=>setMarkah({...markah, jumlah: Number(e.target.value)})} className="w-full sm:w-1/2 p-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white font-bold text-lg text-slate-800 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Catatan / Ulasan</label>
                          <textarea value={markah.catatan} onChange={e=>setMarkah({...markah, catatan: e.target.value})} className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 bg-white text-slate-800 transition-all min-h-[100px]" />
                        </div>
                      </div>`;

code = code.replace(oldTahfizFormEdit, newTahfizFormEdit);

// Replace TahfizView Lihat Table Headers
const oldTahfizHeaders = `<th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Hafazan</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Tilawah</th>
                         <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Sahsiah</th>`;
                         
const newTahfizHeaders = `<th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-left">Catatan</th>`;

code = code.replace(oldTahfizHeaders, newTahfizHeaders);

// Replace TahfizView Lihat Table Data
const oldTahfizData = `<td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.hafazan}</td>
                               <td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.tilawah}</td>
                               <td className="px-4 py-4 text-center font-medium">{c.markahTahfiz?.sahsiah}</td>`;

const newTahfizData = `<td className="px-4 py-4 text-left font-medium text-slate-600 text-sm">{c.markahTahfiz?.catatan || '-'}</td>`;

code = code.replace(oldTahfizData, newTahfizData);


// Now for AkademikView

// Initialization
code = code.replace(
  `{bm: c.markahAkademik.bm || 0,
                 bi: c.markahAkademik.bi || 0,
                 sains: c.markahAkademik.sains || 0,
                 matematik: c.markahAkademik.matematik || 0}`,
  `{jumlah: c.markahAkademik.jumlah || 0, catatan: c.markahAkademik.catatan || ''}`
);
code = code.replace(
  `{bm:0, bi:0, sains:0, matematik:0}`,
  `{jumlah:0, catatan:''}`
);
code = code.replace(
  `{bm:0, bi:0, sains:0, matematik:0}`, // in the next map loop
  `{jumlah:0, catatan:''}`
);
code = code.replace(
  `{bm: c.markahAkademik.bm || 0,
                 bi: c.markahAkademik.bi || 0,
                 sains: c.markahAkademik.sains || 0,
                 matematik: c.markahAkademik.matematik || 0}`,
  `{jumlah: c.markahAkademik.jumlah || 0, catatan: c.markahAkademik.catatan || ''}`
); // Just in case it didn't catch

// Replace handleChange
const oldHandleChange = `const handleChange = (ic: string, subject: string, value: string) => {
     const val = Number(value);
     setBulkMarks(prev => {
        const next = {
           ...prev,
           [ic]: {
              ...(prev[ic] || {bm:0, bi:0, sains:0, matematik:0}),
              [subject]: val
           }
        };`;

const newHandleChange = `const handleChange = (ic: string, subject: string, value: string) => {
     const val = subject === 'jumlah' ? Number(value) : value;
     setBulkMarks(prev => {
        const next = {
           ...prev,
           [ic]: {
              ...(prev[ic] || {jumlah:0, catatan:''}),
              [subject]: val
           }
        };`;
code = code.replace(oldHandleChange, newHandleChange);

// Replace handleBulkSubmit
const oldBulkSubmit = `const jumlah = Number(marks.bm) + Number(marks.bi) + Number(marks.sains) + Number(marks.matematik);
        updateCandidate(ic, {
           markahAkademik: {
              ...marks,
              jumlah,
              dinilaiOleh: currentUser?.name,
              tarikhDinilai: today
           }
        });`;
        
const newBulkSubmit = `const jumlah = Number(marks.jumlah);
        updateCandidate(ic, {
           markahAkademik: {
              jumlah,
              catatan: marks.catatan,
              dinilaiOleh: currentUser?.name,
              tarikhDinilai: today
           }
        });`;
code = code.replace(oldBulkSubmit, newBulkSubmit);

// Replace AkademikView Headers
const oldAkademikHeaders = `<th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">BM (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">BI (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Sains (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Math (25)</th>
                      <th className="px-4 py-4 text-xs font-bold text-emerald-700 uppercase tracking-widest border-b border-slate-200 bg-emerald-50/50 text-center">Jumlah</th>`;

const newAkademikHeaders = `<th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-center">Markah Keseluruhan</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 text-left">Catatan</th>`;
code = code.replace(oldAkademikHeaders, newAkademikHeaders);

// Replace AkademikView Row
const oldAkademikRowStart = `const total = Number(marks.bm) + Number(marks.bi) + Number(marks.sains) + Number(marks.matematik);
                                                  
                         return (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                               <td className="px-4 py-4">
                                  <div className="font-bold text-slate-800">{c.name}</div>
                                  <div className="text-xs text-slate-500 mt-1">{c.ic}</div>
                               </td>
                               <td className="px-2 py-4">
                                  <input type="number" min="0" max="25" value={marks.bm || ''} onChange={(e) => handleChange(c.ic, 'bm', e.target.value)} className="w-16 mx-auto block text-center border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-800" />
                               </td>
                               <td className="px-2 py-4">
                                  <input type="number" min="0" max="25" value={marks.bi || ''} onChange={(e) => handleChange(c.ic, 'bi', e.target.value)} className="w-16 mx-auto block text-center border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-800" />
                               </td>
                               <td className="px-2 py-4">
                                  <input type="number" min="0" max="25" value={marks.sains || ''} onChange={(e) => handleChange(c.ic, 'sains', e.target.value)} className="w-16 mx-auto block text-center border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-800" />
                               </td>
                               <td className="px-2 py-4">
                                  <input type="number" min="0" max="25" value={marks.matematik || ''} onChange={(e) => handleChange(c.ic, 'matematik', e.target.value)} className="w-16 mx-auto block text-center border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-800" />
                               </td>
                               <td className="px-4 py-4 text-center">
                                  <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-extrabold text-sm">{total}</div>
                               </td>`;

const newAkademikRowStart = `const total = Number(marks.jumlah);
                                                  
                         return (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                               <td className="px-4 py-4">
                                  <div className="font-bold text-slate-800 flex items-center gap-3">
                                     {c.gambarUrl ? <img src={c.gambarUrl} className="w-10 h-10 object-cover rounded-md" /> : <div className="w-10 h-10 bg-slate-200 rounded-md"></div>}
                                     <div>
                                        {c.name}
                                        <div className="text-xs text-slate-500 mt-0.5">{c.ic}</div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-2 py-4 text-center">
                                  <input type="number" min="0" max="100" value={marks.jumlah || ''} onChange={(e) => handleChange(c.ic, 'jumlah', e.target.value)} className="w-20 mx-auto block text-center border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-800" placeholder="0" />
                               </td>
                               <td className="px-2 py-4">
                                  <input type="text" value={marks.catatan || ''} onChange={(e) => handleChange(c.ic, 'catatan', e.target.value)} className="w-full border-2 border-slate-200 rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 text-sm" placeholder="Catatan..." />
                               </td>`;

code = code.replace(oldAkademikRowStart, newAkademikRowStart);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
console.log("Patched AdminPanel.tsx for tahfiz and akademik");

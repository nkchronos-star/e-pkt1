const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const target1 = `function PentadbirView() {
  const { candidates } = useAppContext();
  const [filter, setFilter] = useState('ALL');`;

const replace1 = `function PentadbirView() {
  const { candidates, updateCandidate } = useAppContext();
  const [filter, setFilter] = useState('ALL');

  const setTawaran = (ic: string, isLayak: boolean) => {
    updateCandidate(ic, { statusTawaran: isLayak ? 'BERJAYA' : 'GAGAL' });
  };`;

code = code.replace(target1, replace1);

const target2 = `                               <td className="px-4 py-4">
                                  {c.statusTawaran === 'BERJAYA' ? (
                                     <span className="inline-flex bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">LAYAK TAWARAN</span>
                                  ) : c.statusTawaran === 'GAGAL' ? (
                                     <span className="inline-flex bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">TIDAK LAYAK</span>
                                  ) : (
                                     <span className="inline-flex bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">DALAM PERTIMBANGAN</span>
                                  )}
                               </td>`;

const replace2 = `                               <td className="px-4 py-4">
                                  <div className="flex flex-col gap-2">
                                    {c.statusTawaran === 'BERJAYA' ? (
                                       <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">LAYAK TAWARAN</span>
                                    ) : c.statusTawaran === 'GAGAL' ? (
                                       <span className="inline-flex items-center justify-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">TIDAK LAYAK</span>
                                    ) : (
                                       <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">DALAM PERTIMBANGAN</span>
                                    )}
                                    <div className="flex gap-2 mt-1">
                                      <button onClick={() => setTawaran(c.ic, true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 rounded transition">LAYAK</button>
                                      <button onClick={() => setTawaran(c.ic, false)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1 rounded transition">TIDAK</button>
                                    </div>
                                  </div>
                               </td>`;

code = code.replace(target2, replace2);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);

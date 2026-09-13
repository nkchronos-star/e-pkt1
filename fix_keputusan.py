import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Make sure filtered only includes LAYAK
old_filter_logic = """  let filtered = candidates;
  if (filter === 'BERJAYA') filtered = candidates.filter(c => c.statusTawaran === 'BERJAYA');
  if (filter === 'GAGAL') filtered = candidates.filter(c => c.statusTawaran === 'GAGAL');
  if (filter === 'TERIMA') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  if (filter === 'TOLAK') filtered = candidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  if (filter === 'LAYAK_TEMUDUGA') filtered = candidates.filter(c => c.statusTemuduga === 'LAYAK');"""

new_filter_logic = """  // Hanya paparkan calon yang layak temuduga
  let baseCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');
  let filtered = baseCandidates;

  if (filter === 'BERJAYA') filtered = baseCandidates.filter(c => c.statusTawaran === 'BERJAYA');
  if (filter === 'GAGAL') filtered = baseCandidates.filter(c => c.statusTawaran === 'GAGAL');
  if (filter === 'TERIMA') filtered = baseCandidates.filter(c => c.maklumBalasTawaran === 'TERIMA');
  if (filter === 'TOLAK') filtered = baseCandidates.filter(c => c.maklumBalasTawaran === 'TOLAK');
  if (filter === 'LAYAK_TEMUDUGA') filtered = baseCandidates; // all layak"""

content = content.replace(old_filter_logic, new_filter_logic)

# Replace the components AnalisisKemasukan and Analisa Penerimaan Tawaran from PentadbirView since it's already in the Analisis tab.
# We will remove <AnalisisKemasukan candidates={candidates} /> and the block <div className="mb-12">...</div> entirely.
analisis_block_regex = re.compile(r'<AnalisisKemasukan candidates=\{candidates\} />.*?<div className="flex flex-col sm:flex-row gap-4 mb-6">', re.DOTALL)
content = analisis_block_regex.sub('<div className="flex flex-col sm:flex-row gap-4 mb-6">', content)

# Change drop down options
old_select = """           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-bold text-slate-700 bg-white"
           >
              <option value="ALL">Semua Calon</option>
              <option value="LAYAK_TEMUDUGA">Layak Temuduga</option>
              <option value="BERJAYA">Tawaran: Berjaya</option>
              <option value="GAGAL">Tawaran: Gagal</option>
              <option value="TERIMA">Maklum Balas: Terima</option>
              <option value="TOLAK">Maklum Balas: Tolak</option>
           </select>"""

new_select = """           <select 
              value={filter} 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-bold text-slate-700 bg-white"
           >
              <option value="LAYAK_TEMUDUGA">Semua Calon Temuduga</option>
              <option value="BERJAYA">Ditawarkan</option>
              <option value="GAGAL">Tidak Berjaya</option>
              <option value="TOLAK">Tolak Tawaran</option>
           </select>"""
content = content.replace(old_select, new_select)


# Change Table Header
table_head_old = """              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Sekolah Asal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Temuduga (Tahfiz)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Akademik</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status Tawaran</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Maklum Balas</th>
                </tr>
              </thead>"""

table_head_new = """              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest w-12">Bil</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Calon</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tahfiz/Penilai</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Akademik/Penilai</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Maklum Balas</th>
                </tr>
              </thead>"""
content = content.replace(table_head_old, table_head_new)

# Change Table Body (add Bil, and markah specifics)
table_body_old_start = "                {filtered.map(c => ("
table_body_old_end = """                           {c.maklumBalasTawaran ? c.maklumBalasTawaran : 'BELUM MAKLUM BALAS'}
                       </span>
                    </td>
                  </tr>
                ))}"""

import re
old_body_regex = re.compile(r'\{filtered\.map\(c => \(.*?\{c\.maklumBalasTawaran \? c\.maklumBalasTawaran : \'BELUM MAKLUM BALAS\'\}.*?</tr>\n                \)\)\}', re.DOTALL)

table_body_new = """                {filtered.map((c, index) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5">
                       <span className="font-bold text-slate-900 block mb-1">{c.name || c.studentName}</span>
                       <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">{c.ic || c.icNumber}</span>
                    </td>
                    <td className="px-6 py-5">
                       {c.markahTahfiz ? (
                          <div>
                            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md mb-2 inline-block">Jumlah: {c.markahTahfiz.jumlah}/{tahfizTotal}</span>
                            <div className="text-xs text-slate-600 space-y-1">
                               {c.markahTahfiz.details && Object.entries(c.markahTahfiz.details).map(([k, v]) => (
                                 <div key={k} className="flex justify-between max-w-[150px]"><span>{k}:</span> <strong>{v}</strong></div>
                               ))}
                            </div>
                          </div>
                       ) : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahTahfiz?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-2 uppercase font-bold border-t border-slate-100 pt-1">Penilai: {c.markahTahfiz.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       {c.markahAkademik ? (
                          <div>
                            <span className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-2 inline-block">Jumlah: {c.markahAkademik.jumlah}/{akademikTotal}</span>
                            <div className="text-xs text-slate-600 space-y-1">
                               {c.markahAkademik.details && Object.entries(c.markahAkademik.details).map(([k, v]) => (
                                 <div key={k} className="flex justify-between max-w-[150px]"><span>{k}:</span> <strong>{v}</strong></div>
                               ))}
                            </div>
                          </div>
                       ) : <span className="text-sm font-medium text-slate-400">Belum Dinilai</span>}
                       {c.markahAkademik?.dinilaiOleh && <div className="text-[10px] text-slate-400 mt-2 uppercase font-bold border-t border-slate-100 pt-1">Penilai: {c.markahAkademik.dinilaiOleh}</div>}
                    </td>
                    <td className="px-6 py-5">
                       <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                         c.statusTawaran === 'BERJAYA' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                         c.statusTawaran === 'GAGAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                       }`}>
                           {c.statusTawaran === 'BERJAYA' ? 'DITAWARKAN' : c.statusTawaran === 'GAGAL' ? 'TIDAK BERJAYA' : 'DALAM PROSES'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                         c.maklumBalasTawaran === 'TERIMA' ? 'bg-emerald-100 text-emerald-800' :
                         c.maklumBalasTawaran === 'TOLAK' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500'
                       }`}>
                           {c.maklumBalasTawaran === 'TERIMA' ? 'TERIMA TAWARAN' : c.maklumBalasTawaran === 'TOLAK' ? 'TOLAK TAWARAN' : '-'}
                       </span>
                    </td>
                  </tr>
                ))}"""
content = old_body_regex.sub(table_body_new, content)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

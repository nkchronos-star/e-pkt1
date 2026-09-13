import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Update Table Headers
table_head_old = """                      <thead className="bg-slate-100/50">
                         <tr>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Nama & IC</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Daerah / Negeri</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">UPKK</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status Temuduga</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Tindakan</th>
                         </tr>
                      </thead>"""

table_head_new = """                      <thead className="bg-slate-100/50">
                         <tr>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">Bil</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Nama & IC</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase">Daerah / Negeri</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">UPKK</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Tindakan</th>
                         </tr>
                      </thead>"""
content = content.replace(table_head_old, table_head_new)

# Find upkk formatter logic
upkk_formatter = """const formatUpkk = (upkk) => {
    if(!upkk) return <span className="text-xs text-slate-400">Tiada</span>;
    const grades = Object.values(upkk).filter(v => v);
    if(grades.length === 0) return <span className="text-xs text-slate-400">Tiada</span>;
    
    const counts: Record<string, number> = {};
    grades.forEach(g => { counts[g as string] = (counts[g as string] || 0) + 1; });
    const formatted = Object.entries(counts).sort().map(([g, c]) => `${c}${g}`).join(', ');
    return <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">{formatted}</div>;
}"""

# Update Table Body
table_body_old = """                            filteredPermohonan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(c => (
                               <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                  <td className="px-4 py-4">
                                     <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                                     <div className="text-xs text-slate-500">{c.ic}</div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                     {c.daerah}, {c.negeri}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     {c.upkk ? (
                                        <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">Ada</div>
                                     ) : <span className="text-xs text-slate-400">Tiada</span>}
                                  </td>"""

table_body_new = """                            filteredPermohonan.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((c, index) => (
                               <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                  <td className="px-4 py-4 text-center text-sm font-medium text-slate-500">
                                     {(currentPage - 1) * itemsPerPage + index + 1}
                                  </td>
                                  <td className="px-4 py-4">
                                     <div className="font-bold text-slate-800 text-sm">{c.name || c.studentName}</div>
                                     <div className="text-xs text-slate-500">{c.ic || c.icNumber}</div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-600">
                                     {c.daerah || '-'}, {c.negeri || '-'}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                     {(() => {
                                        if(!c.upkk) return <span className="text-xs text-slate-400">Tiada</span>;
                                        const grades = Object.values(c.upkk).filter(v => v && typeof v === 'string' && v.trim() !== '');
                                        if(grades.length === 0) return <span className="text-xs text-slate-400">Tiada</span>;
                                        
                                        const counts: Record<string, number> = {};
                                        grades.forEach(g => { counts[g as string] = (counts[g as string] || 0) + 1; });
                                        const formatted = Object.entries(counts).sort().map(([g, count]) => `${count}${g}`).join(', ');
                                        return <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block whitespace-nowrap">{formatted}</div>;
                                     })()}
                                  </td>"""
content = content.replace(table_body_old, table_body_new)
content = content.replace('<tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>', '<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Tiada permohonan.</td></tr>')


with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

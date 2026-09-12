import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# --- 1. Fix Tahfiz pending candidates (remove draft logic) ---
content = content.replace(
    '''  const pendingCandidates = candidates.filter(c => 
    c.statusTemuduga === 'LAYAK' && 
    (!c.markahTahfiz || (c.markahTahfiz?.dinilaiOleh === currentUser?.name && isSameDay(c.markahTahfiz?.tarikhDinilai)))
  );''',
    '''  const pendingCandidates = candidates.filter(c => 
    c.statusTemuduga === 'LAYAK' && 
    !c.markahTahfiz
  );'''
)

content = content.replace(
    "{c.markahTahfiz ? '- (Draf)' : ''}",
    ""
)

content = content.replace(
    "Tiada calon baru atau draf hari ini untuk dinilai.",
    "Tiada calon baru untuk dinilai."
)

# --- 2. Fix Tahfiz Table to show all marks ---
tahfiz_th_insert = """<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Ulasan</th>
                     {items.map((item: any) => (
                       <th key={item.id} className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">{item.name}</th>
                     ))}"""
content = content.replace(
    '<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Ulasan</th>',
    tahfiz_th_insert
)

tahfiz_td_insert = """<td className="px-6 py-4">
                             <p className="text-sm text-slate-600 line-clamp-3" title={c.markahTahfiz?.catatan}>{c.markahTahfiz?.catatan || '-'}</p>
                           </td>
                           {items.map((item: any) => (
                             <td key={item.id} className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-700">
                               {c.markahTahfiz?.[item.id] || 0}
                             </td>
                           ))}"""
content = content.replace(
    '''<td className="px-6 py-4">
                             <p className="text-sm text-slate-600 line-clamp-3" title={c.markahTahfiz?.catatan}>{c.markahTahfiz?.catatan || '-'}</p>
                           </td>''',
    tahfiz_td_insert
)

# --- 3. Fix Akademik View to show all LAYAK candidates regardless of Tahfiz ---
content = content.replace(
    "const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK' && c.markahTahfiz);",
    "const eligibleCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK');"
)

content = content.replace(
    "Secara pukal (Calon yang telah selesai ujian Tahfiz)",
    "Secara pukal (Semua calon yang layak ke peringkat temuduga)"
)

content = content.replace(
    "Tiada calon yang telah selesai temuduga Tahfiz buat masa ini.",
    "Tiada calon yang layak temuduga buat masa ini."
)

content = content.replace(
    "Sistem hanya memaparkan calon yang LAYAK dan telah mendapat markah Tahfiz.",
    "Sistem hanya memaparkan calon yang LAYAK untuk dinilai."
)

# Small fix on colspan since I added more columns to tahfiz, but tahfiz colSpan is 5, it needs to be 5 + items.length.
content = re.sub(
    r'<td colSpan=\{5\} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod penilaian setakat ini\.</td>',
    r'<td colSpan={5 + items.length} className="px-6 py-12 text-center text-slate-500 font-medium">Tiada rekod penilaian setakat ini.</td>',
    content
)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

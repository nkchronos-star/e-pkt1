with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re

pattern = r'(<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Calon</th>\n\s*<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tahfiz/Penilai</th>)'

replacement = r'<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Calon</th>\n                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Sekolah Asal</th>\n                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Tahfiz/Penilai</th>'

content = re.sub(pattern, replacement, content)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re

# Remove the header
pattern_header = r'[ \t]*<th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Sekolah Asal</th>\n'
content = re.sub(pattern_header, '', content)

# Remove the cell
pattern_cell = r'[ \t]*<td className="px-6 py-5 font-medium text-slate-600 truncate max-w-\[150px\]">\{c\.namaSekolahRendah\}</td>\n'
content = re.sub(pattern_cell, '', content)

# Change colSpan=7 to colSpan=6
content = content.replace('colSpan={7}', 'colSpan={6}')

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

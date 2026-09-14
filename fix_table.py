with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re

# We need to find the filtered.map(c => ( inside PentadbirView
# It looks like:
# {filtered.map(c => (
#   <tr key={c.id} className="hover:bg-slate-50 transition-colors">
#     <td className="px-6 py-5">
#        <span className="font-bold text-slate-900 block mb-1">{c.name}</span>

pattern = r'\{filtered\.map\(c => \(\n\s*<tr key=\{c\.id\} className="hover:bg-slate-50 transition-colors">\n\s*<td className="px-6 py-5">'

replacement = r"""{filtered.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 text-center text-sm font-medium text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-5">"""

content = re.sub(pattern, replacement, content)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

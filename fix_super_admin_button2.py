with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re
# Find the exact trash button block
pattern = r'(<button[^>]+onClick=\{\(\) => \{\s*if \(confirm\(\'Padam calon ini\?\'\)\).*?</button>)'
replacement = r"""
    <button
      onClick={() => setEditCandidate(c)}
      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg"
      title="Kemaskini Maklumat"
    >
      <Edit className="w-5 h-5" />
    </button>
\1
"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

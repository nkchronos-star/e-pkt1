with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

import re

# Find the second instance of <BorangPukalCetakPDF candidates={filtered} (which is in SuperAdminView)
# and change it to filteredPermohonan.
# Actually, SuperAdminView starts later.
pattern = r'(function SuperAdminView\(\) \{.*?if \(printPukalBorang\) return <BorangPukalCetakPDF candidates=\{)filtered(\} onClose=\{\(\) => setPrintPukalBorang\(false\)\} />)'
replacement = r'\1filteredPermohonan\2'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

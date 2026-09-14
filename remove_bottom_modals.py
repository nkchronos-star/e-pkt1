import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace('{printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}', '')
content = content.replace('{printPukalBorang && <BorangPukalCetakPDF candidates={candidates} onClose={() => setPrintPukalBorang(false)} />}', '')
content = content.replace('{printPukalBorang && <BorangPukalCetakPDF candidates={filteredPermohonan} onClose={() => setPrintPukalBorang(false)} />}', '')

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

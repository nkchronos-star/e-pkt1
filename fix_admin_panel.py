import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# For SuperAdminView
# Find the start of the return for SuperAdminView
pattern1 = r'(function SuperAdminView\(\) \{.*?)(  return \(\n    <div className="space-y-8">)'
replacement1 = r"""\1
  if (printCandidate) return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={filteredPermohonan} onClose={() => setPrintPukalBorang(false)} />;

\2"""
content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

# For PentadbirView
pattern2 = r'(function PentadbirView\(\) \{.*?)(  return \(\n    <div>)'
replacement2 = r"""\1
  if (printCandidate) return <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />;
  if (printPukalBorang) return <BorangPukalCetakPDF candidates={filteredPermohonan} onClose={() => setPrintPukalBorang(false)} />;

\2"""
content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

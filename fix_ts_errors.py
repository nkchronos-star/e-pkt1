import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("c.noTelBapa || ''", "c.telefonBapa || ''")
content = content.replace("c.noTelIbu || ''", "c.telefonIbu || ''")

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content2 = f.read()

content2 = content2.replace("candidate.alamat || '-'", "(candidate.alamat1 ? candidate.alamat1 + ' ' + (candidate.alamat2 || '') + ' ' + (candidate.poskod || '') + ' ' + (candidate.bandar || '') + ' ' + (candidate.negeri || '') : '-')")

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content2)

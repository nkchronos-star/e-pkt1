with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

old_str = "c.statusTemuduga === 'LAYAK' &&"
new_str = "c.statusTemuduga === 'LAYAK' && (isTahfiz ? True : c.markahTahfiz) &&"

# I'll just rewrite the pendingCandidates definition properly.
content = content.replace(
    "const pendingCandidates = candidates.filter(c => \n    c.statusTemuduga === 'LAYAK' && \n    (!c[markahKey] || (c[markahKey]?.dinilaiOleh === currentUser?.name && isSameDay(c[markahKey]?.tarikhDinilai)))\n  );",
    "const pendingCandidates = candidates.filter(c => \n    c.statusTemuduga === 'LAYAK' && \n    (isTahfiz ? true : !!c.markahTahfiz) &&\n    (!c[markahKey] || (c[markahKey]?.dinilaiOleh === currentUser?.name && isSameDay(c[markahKey]?.tarikhDinilai)))\n  );"
)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)

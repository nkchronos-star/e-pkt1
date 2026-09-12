import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# I also need to ensure PenilaianModulView works perfectly for Tahfiz since I changed its name or logic inside AkademikView.
# I will just remove the isTahfiz ternary since it's strictly Tahfiz now and rename it to TahfizView natively.

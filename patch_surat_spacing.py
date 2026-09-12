import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# Fix spacing in tables
content = content.replace('className="ml-8 mt-4 mb-4"', 'className="ml-8 mt-4 print:mt-2 mb-4 print:mb-2"')
content = content.replace('className="ml-8 mb-6"', 'className="ml-8 mb-6 print:mb-2"')

# Fix duplicate print:mb
content = content.replace('print:mb-4 print:mb-3', 'print:mb-2')
content = content.replace('print:mb-4', 'print:mb-2')

# Shrink the scale slightly more to ensure it fits 100% on one page
content = content.replace('transform: scale(0.97);', 'transform: scale(0.94);')
content = content.replace('margin: 1cm;', 'margin: 0.8cm;')

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)

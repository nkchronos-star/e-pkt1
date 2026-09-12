import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

content = content.replace('             height: 28.5cm;\n             overflow: hidden;', '')

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content)


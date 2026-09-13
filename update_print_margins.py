import re

for filename in ['src/components/dashboard/BorangCetakPDF.tsx', 'src/components/dashboard/BorangPukalCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # Tukar margin kepada 2.54cm top, dan 1cm untuk kiri, kanan, bawah
    content = content.replace('@page { size: A4 portrait; margin: 1cm; }', '@page { size: A4 portrait; margin: 2.54cm 1cm 1cm 1cm; }')
    
    with open(filename, 'w') as f:
        f.write(content)

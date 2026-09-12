import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# Adjust print margins and sizes to be slightly smaller
content = content.replace('print:py-4', 'print:py-2')
content = content.replace('print:mb-4', 'print:mb-2')
content = content.replace('print:mb-2', 'print:mb-1')
content = content.replace('print:mb-6', 'print:mb-3')
content = content.replace('print:mt-4', 'print:mt-2')
content = content.replace('print:mt-2', 'print:mt-1')
content = content.replace('mt-12', 'mt-8 print:mt-6') # Signature gap
content = content.replace('mb-8', 'mb-6 print:mb-4')
content = content.replace('w-24', 'w-20') # Logo size slightly smaller
content = content.replace('text-sm', 'text-[13px]') # Slightly smaller font
content = content.replace('text-lg', 'text-base') # Header slightly smaller

# Add a slight scale adjustment in print CSS just in case
old_css = """          #printable-surat {
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }"""
          
new_css = """          #printable-surat {
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            transform: scale(0.97);
            transform-origin: top center;
          }"""

content = content.replace(old_css, new_css)

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)

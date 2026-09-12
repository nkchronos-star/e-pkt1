import re

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'r') as f:
    content = f.read()

old_style = """      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-pukal-area, #printable-pukal-area * { visibility: visible; }
          #printable-pukal-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
          .break-after-page { page-break-after: always; }
          .break-after-page:last-child { page-break-after: auto; }
        }
      `}} />"""

new_style = """      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body * { visibility: hidden; }
          .fixed { position: absolute !important; }
          .overflow-y-auto { overflow: visible !important; }
          .max-h-[90vh] { max-height: none !important; }
          #printable-pukal-area, #printable-pukal-area * { visibility: visible; }
          #printable-pukal-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          .break-after-page { page-break-after: always; }
          .break-after-page:last-child { page-break-after: auto; }
        }
      `}} />"""

content = content.replace(old_style, new_style)

# Also fix the outer divs to allow printing by removing max-h and overflow during print via classes
# Wait, just doing it in CSS is enough.

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'w') as f:
    f.write(content)

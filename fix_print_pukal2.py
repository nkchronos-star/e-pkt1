import re

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'r') as f:
    content = f.read()

old_style = """      <style dangerouslySetInnerHTML={{__html: `
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

new_style = """      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body * { visibility: hidden !important; }
          
          /* Unset fixed positioning and scroll limits on modal wrappers */
          .fixed.inset-0 { 
             position: absolute !important; 
             overflow: visible !important;
             background: transparent !important;
             height: auto !important;
             min-height: 100% !important;
          }
          
          .max-h-\\[90vh\\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          /* Show the printable area */
          #printable-pukal-area, #printable-pukal-area * { visibility: visible !important; }
          #printable-pukal-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          
          .break-after-page { page-break-after: always !important; }
          .break-after-page:last-child { page-break-after: auto !important; }
        }
      `}} />"""

content = content.replace(old_style, new_style)

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'w') as f:
    f.write(content)

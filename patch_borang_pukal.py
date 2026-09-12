import re

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'r') as f:
    content = f.read()

# Make the page padding smaller for print to ensure it fits one page
content = content.replace('className="p-8 sm:p-12 w-full max-w-4xl mx-auto printable-page font-sans text-sm break-after-page text-black bg-white relative"', 'className="p-4 sm:p-8 print:p-2 w-full max-w-4xl mx-auto printable-page font-sans text-[11px] print:text-[11px] sm:text-xs break-after-page text-black bg-white relative"')

# Also let's tighten up some margins/paddings
content = content.replace('className="mt-8"', 'className="mt-4 print:mt-2"')
content = content.replace('className="mt-16 grid grid-cols-2 gap-8 text-center"', 'className="mt-8 print:mt-6 grid grid-cols-2 gap-8 text-center"')
content = content.replace('gap-6 text-sm', 'gap-4 text-xs print:text-[11px]')
content = content.replace('gap-8 text-sm', 'gap-4 text-xs print:text-[11px]')

# Update the print CSS
old_style = """      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          body * { visibility: hidden !important; }
          
          /* Unset fixed positioning and scroll limits on modal wrappers */
          .fixed.inset-0 { 
             position: absolute !important; 
             left: 0 !important;
             top: 0 !important;
             overflow: visible !important;
             background: transparent !important;
             height: auto !important;
             min-height: 100% !important;
             display: block !important;
             padding: 0 !important;
          }
          
          .bg-white.max-w-4xl.w-full {
             display: block !important;
             box-shadow: none !important;
             max-width: none !important;
             width: 100% !important;
             margin: 0 !important;
             border-radius: 0 !important;
          }
          
          .max-h-\\[90vh\\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          /* Show the printable area */
          #printable-pukal-area, #printable-pukal-area * { visibility: visible !important; }
          #printable-pukal-area { 
            position: relative !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          
          .break-after-page { page-break-after: always !important; }
          .break-after-page:last-child { page-break-after: auto !important; }
        }
      `}} />"""

new_style = """      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          body * { visibility: hidden !important; }
          
          .fixed.inset-0 { 
             position: absolute !important; 
             left: 0 !important;
             top: 0 !important;
             overflow: visible !important;
             background: transparent !important;
             height: auto !important;
             min-height: 100% !important;
             display: block !important;
             padding: 0 !important;
          }
          
          .bg-white.max-w-4xl.w-full {
             display: block !important;
             box-shadow: none !important;
             max-width: none !important;
             width: 100% !important;
             margin: 0 !important;
             border-radius: 0 !important;
          }
          
          .max-h-\\[90vh\\] { max-height: none !important; }
          .overflow-y-auto { overflow: visible !important; }
          
          #printable-pukal-area, #printable-pukal-area * { visibility: visible !important; }
          #printable-pukal-area { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          
          .printable-page {
             height: 28.5cm; /* Enforce slightly less than A4 height */
             overflow: hidden;
             box-sizing: border-box;
          }
          
          .break-after-page { 
             page-break-after: always !important; 
             break-after: page !important;
          }
          .break-after-page:last-child { 
             page-break-after: auto !important; 
             break-after: auto !important;
          }
        }
      `}} />"""

content = content.replace(old_style, new_style)

with open('src/components/dashboard/BorangPukalCetakPDF.tsx', 'w') as f:
    f.write(content)


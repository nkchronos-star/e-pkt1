import re

for filename in ['src/components/dashboard/BorangCetakPDF.tsx', 'src/components/dashboard/BorangPukalCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # We will rewrite the print styles completely.
    new_style = """
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 1cm; }
          
          /* Hide everything in the body by default */
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          body * { 
            visibility: hidden; 
          }
          
          /* Show only our printable areas */
          #printable-area, #printable-area *,
          #printable-pukal-area, #printable-pukal-area * { 
            visibility: visible; 
          }
          
          /* Position the printable area at the top left of the page */
          #printable-area, #printable-pukal-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .print\\\\:hidden { display: none !important; }
          
          .break-after-page {
             page-break-after: always;
             break-after: page;
          }
          .break-after-page:last-child {
             page-break-after: auto;
             break-after: auto;
          }
        }
      `}} />
"""
    # Replace the existing style block
    content = re.sub(r'<style dangerouslySetInnerHTML=\{\{__html: `.*?`\}\} />', new_style.strip().replace('\\\\', '\\'), content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)

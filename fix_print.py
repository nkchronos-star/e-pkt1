import re

for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # We will remove the old style block and replace it
    pattern = r'<style dangerouslySetInnerHTML=\{\{__html: `.*?`\}\} />'
    
    style_block = """<style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 2.54cm 1cm 1cm 1cm; }
          
          /* Hide everything outside of our modal */
          body {
            background: white;
            -webkit-print-color-adjust: exact;
          }
          
          /* The key to fixing truncation is NOT using absolute positioning, 
             but we must hide siblings so it doesn't get pushed down. 
             Since we can't easily hide siblings in React without refs, 
             we use absolute but apply it to a fixed wrapper? No, absolute clips. 
             Wait, if we set #root to display: contents, it removes the box! */
          #root {
             display: contents;
          }
          
          /* Hide non-printable elements */
          .print\\\\:hidden { display: none !important; }
          
          /* We hide siblings of the modal container */
          #root > div > div:not(.print-modal-wrapper) {
             display: none !important;
          }
          
          .break-after-page { 
             page-break-after: always; 
             break-after: page;
          }
          .break-after-page:last-child { 
             page-break-after: auto; 
             break-after: auto;
          }
        }
      `}} />"""
      
    content = re.sub(pattern, style_block, content, flags=re.DOTALL)
    
    # add class to the outermost div
    content = content.replace('className="fixed inset-0', 'className="print-modal-wrapper fixed inset-0')
    
    with open(filename, 'w') as f:
        f.write(content)

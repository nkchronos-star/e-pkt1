import re

for filename in ['src/components/dashboard/BorangPukalCetakPDF.tsx', 'src/components/dashboard/BorangCetakPDF.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # Add import
    if 'createPortal' not in content:
        content = content.replace("import React,", "import React, { useEffect } from 'react';\nimport { createPortal } from 'react-dom';\n").replace("import React, { useEffect }", "import React, { useEffect } from 'react';\nimport { createPortal } from 'react-dom';\n")

    # Wrap the return
    if 'return createPortal(' not in content:
        content = content.replace('return (', 'return createPortal(')
        content = content.replace('  );\n}', '  ),\n  document.body\n);\n}')

    # Update CSS
    style_pattern = r'<style dangerouslySetInnerHTML=\{\{__html: `.*?`\}\} />'
    new_style = """<style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 2.54cm 1cm 1cm 1cm; }
          
          /* Hide the main app root */
          #root {
             display: none !important;
          }
          
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          
          /* The modal wrapper is directly in body now, make it static so it paginates! */
          .print-modal-wrapper {
             position: static !important;
             overflow: visible !important;
             height: auto !important;
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
      `}} />"""
      
    content = re.sub(style_pattern, new_style, content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)

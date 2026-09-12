import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# Fix overflow-hidden
content = content.replace('shadow-2xl overflow-hidden flex', 'shadow-2xl flex')

# Let's replace the whole <style> block
start_style = content.find('<style dangerouslySetInnerHTML=')
end_style = content.find('</style>') + 8
if start_style != -1 and end_style != -1:
    old_style = content[start_style:end_style]
    new_style = """<style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          
          /* Hide everything outside of our printable area */
          body * {
            visibility: hidden !important;
          }
          
          /* Make the printable area and its children visible */
          #printable-area, #printable-area * {
            visibility: visible !important;
          }
          
          /* Position the printable area absolutely at the top left of the page */
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top left !important;
          }
        }
      `}} />"""
    content = content.replace(old_style, new_style)

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content)

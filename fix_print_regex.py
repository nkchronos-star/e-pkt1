import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# Find the start of the first <style> tag
start_style = content.find('<style dangerouslySetInnerHTML')
if start_style != -1:
    content = content[:start_style]

clean_end = """
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0.5cm; }
          body * { visibility: hidden !important; }
          
          .fixed.inset-0 {
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             padding: 0 !important;
             margin: 0 !important;
             background: transparent !important;
             overflow: visible !important;
             display: block !important;
          }
          
          .bg-white.max-w-4xl {
             display: block !important;
             box-shadow: none !important;
             border: none !important;
             margin: 0 !important;
             max-width: none !important;
             width: 100% !important;
          }
          
          #printable-area, #printable-area * { visibility: visible !important; }
          
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: scale(0.90) !important;
            transform-origin: top center !important;
          }
          
          .print\\\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
"""

with open('src/components/dashboard/BorangCetakPDF.tsx', 'w') as f:
    f.write(content + clean_end)

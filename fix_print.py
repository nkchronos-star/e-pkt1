import re

with open('src/components/dashboard/BorangCetakPDF.tsx', 'r') as f:
    content = f.read()

# Remove all `<style dangerouslySetInnerHTML... />` entirely up to the closing `</div>` and `); }`
start_idx = content.find('<style dangerouslySetInnerHTML')
end_idx = content.rfind('</div>')

if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
    clean_content = content[:start_idx] + """
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
        f.write(clean_content)


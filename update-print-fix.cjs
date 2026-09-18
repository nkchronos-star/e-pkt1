const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratTawaran.tsx', 'utf8');

const replacement = `
      <style dangerouslySetInnerHTML={{__html: \`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white; }
          
          /* Hide everything by default but keep document flow */
          body * { 
            visibility: hidden; 
          }
          
          /* Elements with .no-print should not take up space */
          .no-print {
            display: none !important;
          }

          /* Force the printable area to the absolute top-left of the physical page */
          .printable-area { 
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             width: 100% !important;
             visibility: visible !important;
          }
          
          /* Make sure all children of printable area are visible */
          .printable-area * {
             visibility: visible;
          }
          
          /* 
            CRITICAL FIX: Remove relative/transform from all ancestors of .printable-area
            so that 'position: absolute' anchors to the page boundaries, not a parent container.
            We target typical React root elements.
          */
          html, body, #root, main, section, div:not(.printable-area):not(.printable-area *) {
             position: static !important;
             transform: none !important;
          }

          @page { size: A4; margin: 10mm 15mm; }
        }
      \`}} />
`;

// Replace the existing style tag
code = code.replace(/<style dangerouslySetInnerHTML=\{{__html: `[\s\S]*?`}}\s*\/>/, replacement.trim());
fs.writeFileSync('src/components/dashboard/SuratTawaran.tsx', code);
console.log("Success");

const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratTawaran.tsx', 'utf8');

const replacement = `
      <style dangerouslySetInnerHTML={{__html: \`
        @media print {
          @page { size: A4; margin: 10mm 15mm; }
          
          body { 
            -webkit-print-color-adjust: exact; 
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Hide everything outside the printable area using standard display none 
             to prevent empty space from taking up the layout */
          .no-print {
            display: none !important;
          }

          /* Ensure the printable area has no constraints */
          .printable-area { 
             position: static !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             width: 100% !important;
             max-width: 100% !important;
          }
          
          /* Reset any layout wrappers that might cause spacing */
          #root, main, .bg-\\\\[\\\\#f4f7ee\\\\] {
             background: white !important;
             padding: 0 !important;
             margin: 0 !important;
          }
        }
      \`}} />
`;

code = code.replace(/<style dangerouslySetInnerHTML=\{{__html: `[\s\S]*?`}}\s*\/>/, replacement.trim());
fs.writeFileSync('src/components/dashboard/SuratTawaran.tsx', code);
console.log("Success");

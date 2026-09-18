const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratTawaran.tsx', 'utf8');

const target = `@media print {
          body { -webkit-print-color-adjust: exact; }
          .printable-area { 
             margin: 0 !important; 
             padding: 0 !important;
             box-shadow: none !important;
             transform: none !important;
             width: 100% !important;
             min-height: 0 !important;
             page-break-after: auto;
             page-break-inside: avoid;
          }
          @page { size: A4; margin: 15mm; }
        }`;

const replacement = `@media print {
          body { -webkit-print-color-adjust: exact; }
          body * { visibility: hidden; }
          .printable-area { 
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             transform: none !important;
             width: 100% !important;
             min-height: 0 !important;
             visibility: visible !important;
          }
          .printable-area * {
             visibility: visible;
          }
          @page { size: A4; margin: 12mm 15mm; }
        }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/dashboard/SuratTawaran.tsx', code);
    console.log("Success");
} else {
    console.log("Target not found");
}

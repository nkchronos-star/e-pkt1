const fs = require('fs');

// 1. Remove timestamp from BorangCetakPDF
let pdfCode = fs.readFileSync('src/components/dashboard/BorangCetakPDF.tsx', 'utf8');
pdfCode = pdfCode.replace(/Dicetak pada: \{new Date\(\)\.toLocaleString\('ms-MY'\)\}/g, '');
fs.writeFileSync('src/components/dashboard/BorangCetakPDF.tsx', pdfCode);

// 2. Fix SuratTawaran.tsx for 1 page and dynamic Admin name
let suratCode = fs.readFileSync('src/components/dashboard/SuratTawaran.tsx', 'utf8');

suratCode = suratCode.replace(/YAHAYA BIN TAHIR/g, "{settings.namaPengetua || 'NAMA PENTADBIR'}");

// reduce margins and padding
suratCode = suratCode.replace('mb-16', 'mb-6');
suratCode = suratCode.replace('mt-8', 'mt-4');
suratCode = suratCode.replace('mb-8', 'mb-4');
suratCode = suratCode.replace('mb-6', 'mb-3');
suratCode = suratCode.replace('mb-6', 'mb-3');
suratCode = suratCode.replace('mb-6', 'mb-3');
suratCode = suratCode.replace('p-10', 'p-6 sm:p-10 print:p-2'); // reduce padding for print
suratCode = suratCode.replace('mt-8 text-xs', 'mt-4 text-xs');
suratCode = suratCode.replace(/mt-7/g, 'mt-4'); // line 19
suratCode = suratCode.replace('pb-4', 'pb-2'); // line 12

// Let's add an explicit scale style for printing in SuratTawaran just in case
if(!suratCode.includes('<style')) {
    suratCode = suratCode.replace('</div>\n  );', '  <style dangerouslySetInnerHTML={{__html: `\n        @media print {\n          .printable-area { transform: scale(0.95); transform-origin: top center; }\n        }\n      `}} />\n    </div>\n  );');
}

fs.writeFileSync('src/components/dashboard/SuratTawaran.tsx', suratCode);

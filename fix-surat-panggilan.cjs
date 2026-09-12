const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SuratPanggilan.tsx', 'utf8');

// Replace name
code = code.replace(/NOOR AZLAN BIN MOHAMMAD/g, "{settings.namaPengetua || 'NAMA PENTADBIR'}");

// Adjust paddings
code = code.replace(/mb-16/g, 'mb-6');
code = code.replace(/mb-8/g, 'mb-4');
code = code.replace(/p-10/g, 'p-6 sm:p-10 print:p-2');

if(!code.includes('<style')) {
    code = code.replace('</div>\n  );', '  <style dangerouslySetInnerHTML={{__html: `\n        @media print {\n          .printable-area { transform: scale(0.95); transform-origin: top center; }\n        }\n      `}} />\n    </div>\n  );');
}

fs.writeFileSync('src/components/dashboard/SuratPanggilan.tsx', code);

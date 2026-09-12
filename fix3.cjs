const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

code = code.replace('        {/* Bahagian C */}', '           </div>\n        </div>\n        {/* Bahagian C */}');

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

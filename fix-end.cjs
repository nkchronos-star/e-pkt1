const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const regex = /<\/form>\s*<\/div>\s*<\/form>\s*<\/div>\s*\);\s*\}/;
code = code.replace(regex, '</form>\n    </div>\n  );\n}');
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

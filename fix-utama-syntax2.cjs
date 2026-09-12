const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

// The issue is an extra `</div>` at line 61.
// Let's remove it safely.
code = code.replace(/<\/div>\s*<\/div>\s*\{\/\* Subjects Section \*\/\}/, '</div>\n\n      {/* Subjects Section */}');

fs.writeFileSync('src/components/dashboard/Utama.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

while(code.endsWith('}') || code.endsWith(' ') || code.endsWith('\\n') || code.endsWith('\\r')) {
    code = code.slice(0, -1);
}
// Now it should end with `);` from the return statement.
code = code + '\\n}\\n';

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// I will just append a } at the end of the file since it's missing one.
// Let's check how many opening and closing braces there are.
code = code + '\n}\n';
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);

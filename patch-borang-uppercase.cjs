const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// The original input handler:
//         let updates: any = { [name]: value };

// We want inputs to be uppercase while typing (except for emails, but we don't have email fields here, wait there is no email field in Borang).
// Actually, applying toUpperCase on ALL fields is safe for this specific form because they are names, ICs, addresses.

const targetInput = `         let updates: any = { [name]: value };`;
const replaceInput = `         let updates: any = { [name]: typeof value === 'string' ? value.toUpperCase() : value };`;

code = code.replace(targetInput, replaceInput);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx to force uppercase on typing");
